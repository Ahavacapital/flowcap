export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { google } = require('googleapis')
    const { createClient } = require('@supabase/supabase-js')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    )
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    })

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })
    const spreadsheetId = process.env.SHEETS_DEALS_ID

    const results = {}

    // ─── CRM SUBS TAB (All Deals) ─────────────────────────────
    try {
      const { data: deals } = await supabase
        .from('deals')
        .select('*, broker:brokers(name), notes:deal_notes(category, body, author, created_at)')
        .order('submitted_at', { ascending: false })
        .limit(2000)

      const headers = [
        'Deal #', 'Business Name', 'Contact Name', 'Contact Email',
        'Broker / ISO', 'Amount Requested', 'Amount Approved',
        'Buy Rate', 'Sell Rate (1.499)', 'Term (days)',
        'Status', 'Risk Score', 'Monthly Revenue', 'Avg Daily Balance',
        'Positions', 'NY Courts', 'DataMerch', 'Industry',
        'Submitted Date', 'Last Updated', 'Notes'
      ]

      const rows = (deals || []).map(d => {
        const termDays = d.term_months ? d.term_months * 30 : ''
        const lastNote = (d.notes || []).slice(-1)[0]
        return [
          d.deal_number || '',
          d.business_name || '',
          d.contact_name || '',
          d.contact_email || '',
          d.broker?.name || '',
          d.amount_requested || '',
          d.amount_approved || '',
          d.factor_rate || '',
          d.amount_approved ? 1.499 : '',
          termDays,
          d.status || '',
          d.risk_score || '',
          d.monthly_revenue || '',
          d.avg_daily_balance || '',
          d.positions || 0,
          d.ny_court_result || '',
          d.datamerch_result || '',
          '',
          d.submitted_at ? new Date(d.submitted_at).toLocaleDateString() : '',
          d.updated_at ? new Date(d.updated_at).toLocaleDateString() : '',
          lastNote ? lastNote.body?.slice(0, 300) : (d.notes_text || '')
        ]
      })

      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: 'CRM SUBS!A1:U5000'
      })

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'CRM SUBS!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers, ...rows] }
      })

      results.crmSubs = { rows: rows.length, status: 'success' }
    } catch (err) {
      results.crmSubs = { status: 'error', error: err.message }
    }

    // ─── FUNDED DEALS TAB ─────────────────────────────────────
    try {
      const { data: funded } = await supabase
        .from('deals')
        .select('*, broker:brokers(name)')
        .eq('status', 'funded')
        .order('funded_at', { ascending: false })

      const headers = [
        'Deal #', 'Business Name', 'Contact', 'ISO / Broker',
        'Funded Amount', 'Buy Rate', 'Sell Rate',
        'Term (days)', 'Merchant Payback', 'Our Payback',
        'Our Profit', 'Current Balance', '% Paid',
        'Daily Payment', 'Funded Date', 'Renewal Eligible'
      ]

      const rows = (funded || []).map(d => {
        const termDays = d.term_months ? d.term_months * 30 : 0
        const merchantPayback = d.amount_approved ? Math.round(d.amount_approved * 1.499) : ''
        const ourPayback = d.amount_approved && d.factor_rate ? Math.round(d.amount_approved * d.factor_rate) : ''
        const ourProfit = merchantPayback && ourPayback ? merchantPayback - ourPayback : ''
        const dailyPay = merchantPayback && termDays ? Math.round(merchantPayback / termDays) : ''
        const pctPaid = d.amount_approved && d.balance
          ? Math.round((1 - d.balance / d.amount_approved) * 100) + '%' : ''
        const renewal = d.amount_approved && d.balance
          ? (d.balance / d.amount_approved <= 0.5 ? 'YES' : 'No') : ''
        return [
          d.deal_number || '',
          d.business_name || '',
          d.contact_name || '',
          d.broker?.name || '',
          d.amount_approved || '',
          d.factor_rate || '',
          1.499,
          termDays,
          merchantPayback,
          ourPayback,
          ourProfit,
          d.balance || '',
          pctPaid,
          dailyPay,
          d.funded_at ? new Date(d.funded_at).toLocaleDateString() : '',
          renewal
        ]
      })

      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: 'Funded Deals!A1:P5000'
      })

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Funded Deals!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers, ...rows] }
      })

      results.fundedDeals = { rows: rows.length, status: 'success' }
    } catch (err) {
      results.fundedDeals = { status: 'error', error: err.message }
    }

    // ─── ISO PERFORMANCE TAB ──────────────────────────────────
    try {
      const { data: brokers } = await supabase
        .from('brokers')
        .select('*')
        .order('name')

      const { data: allDeals } = await supabase
        .from('deals')
        .select('broker_id, status, amount_approved, amount_requested')

      const stats = {}
      for (const d of allDeals || []) {
        if (!d.broker_id) continue
        if (!stats[d.broker_id]) stats[d.broker_id] = {
          total: 0, funded: 0, declined: 0,
          volume: 0, requested: 0
        }
        stats[d.broker_id].total++
        stats[d.broker_id].requested += d.amount_requested || 0
        if (d.status === 'funded') {
          stats[d.broker_id].funded++
          stats[d.broker_id].volume += d.amount_approved || 0
        }
        if (d.status === 'declined') stats[d.broker_id].declined++
      }

      const headers = [
        'ISO / Broker Name', 'Contact', 'Email', 'Phone',
        'Commission %', 'Total Submissions', 'Funded',
        'Declined', 'In Pipeline', 'Total Volume Funded',
        'Total Requested', 'Conversion Rate', 'Active'
      ]

      const rows = (brokers || []).map(b => {
        const s = stats[b.id] || { total: 0, funded: 0, declined: 0, volume: 0, requested: 0 }
        const inPipeline = s.total - s.funded - s.declined
        return [
          b.name || '',
          b.contact || '',
          b.email || '',
          b.phone || '',
          b.commission_pct || 5,
          s.total,
          s.funded,
          s.declined,
          inPipeline,
          s.volume,
          s.requested,
          s.total > 0 ? Math.round(s.funded / s.total * 100) + '%' : '0%',
          b.active ? 'Yes' : 'No'
        ]
      })

      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: 'ISO Performance!A1:M5000'
      })

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'ISO Performance!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers, ...rows] }
      })

      results.isoPerformance = { rows: rows.length, status: 'success' }
    } catch (err) {
      results.isoPerformance = { status: 'error', error: err.message }
    }

    return res.status(200).json({
      success: true,
      message: 'Sheets synced successfully',
      results
    })

  } catch (err) {
    console.error('Sheets sync error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
