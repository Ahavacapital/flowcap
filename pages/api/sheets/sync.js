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

    // ─── SUBMISSIONS TAB ─────────────────────────────────────
    const { data: deals } = await supabase
      .from('deals')
      .select('*, broker:brokers(name)')
      .order('submitted_at', { ascending: false })
      .limit(1000)

    const dealHeaders = [
      'Deal #', 'Business Name', 'Contact', 'Broker / ISO',
      'Amount Requested', 'Amount Approved', 'Buy Rate', 'Sell Rate',
      'Term (days)', 'Status', 'Risk Score', 'Monthly Revenue',
      'Avg Daily Balance', 'Positions', 'NY Courts', 'DataMerch',
      'Submitted Date', 'Funded Date', 'Balance', 'Notes'
    ]

    const dealRows = (deals || []).map(d => [
      d.deal_number || '',
      d.business_name || '',
      d.contact_name || '',
      d.broker?.name || d.contact_email || '',
      d.amount_requested || '',
      d.amount_approved || '',
      d.factor_rate || '',
      d.amount_approved ? 1.499 : '',
      d.term_months ? d.term_months * 30 : '',
      d.status || '',
      d.risk_score || '',
      d.monthly_revenue || '',
      d.avg_daily_balance || '',
      d.positions || 0,
      d.ny_court_result || '',
      d.datamerch_result || '',
      d.submitted_at ? new Date(d.submitted_at).toLocaleDateString() : '',
      d.funded_at ? new Date(d.funded_at).toLocaleDateString() : '',
      d.balance || '',
      d.notes ? d.notes.slice(0, 200) : ''
    ])

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'Submissions!A1:T2000'
    })

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Submissions!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [dealHeaders, ...dealRows] }
    })

    // ─── FUNDED DEALS TAB ────────────────────────────────────
    const { data: funded } = await supabase
      .from('deals')
      .select('*, broker:brokers(name)')
      .eq('status', 'funded')
      .order('funded_at', { ascending: false })

    const fundedHeaders = [
      'Deal #', 'Business Name', 'Contact', 'ISO / Broker',
      'Funded Amount', 'Buy Rate', 'Sell Rate', 'Term (days)',
      'Merchant Payback', 'Current Balance', '% Paid',
      'Funded Date', 'Daily Payment', 'Renewal Eligible'
    ]

    const fundedRows = (funded || []).map(d => {
      const termDays = d.term_months ? d.term_months * 30 : 0
      const merchantPayback = d.amount_approved ? Math.round(d.amount_approved * 1.499) : ''
      const dailyPay = merchantPayback && termDays ? Math.round(merchantPayback / termDays) : ''
      const pctPaid = d.amount_approved && d.balance
        ? Math.round((1 - d.balance / d.amount_approved) * 100) + '%' : ''
      const renewal = d.amount_approved && d.balance
        ? (d.balance / d.amount_approved <= 0.5 ? 'YES' : 'No') : ''
      return [
        d.deal_number, d.business_name, d.contact_name || '',
        d.broker?.name || '', d.amount_approved || '',
        d.factor_rate || '', 1.499, termDays,
        merchantPayback, d.balance || '', pctPaid,
        d.funded_at ? new Date(d.funded_at).toLocaleDateString() : '',
        dailyPay, renewal
      ]
    })

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'Funded Deals!A1:N2000'
    })

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Funded Deals!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [fundedHeaders, ...fundedRows] }
    })

    // ─── ISO PERFORMANCE TAB ─────────────────────────────────
    const { data: brokers } = await supabase
      .from('brokers')
      .select('*')
      .order('name')

    const { data: allDeals } = await supabase
      .from('deals')
      .select('broker_id, status, amount_approved')

    const stats = {}
    for (const d of allDeals || []) {
      if (!d.broker_id) continue
      if (!stats[d.broker_id]) stats[d.broker_id] = { total: 0, funded: 0, volume: 0, declined: 0 }
      stats[d.broker_id].total++
      if (d.status === 'funded') {
        stats[d.broker_id].funded++
        stats[d.broker_id].volume += d.amount_approved || 0
      }
      if (d.status === 'declined') stats[d.broker_id].declined++
    }

    const brokerHeaders = [
      'ISO / Broker Name', 'Contact', 'Email', 'Commission %',
      'Total Submissions', 'Funded', 'Declined',
      'Total Volume', 'Conversion Rate'
    ]

    const brokerRows = (brokers || []).map(b => {
      const s = stats[b.id] || { total: 0, funded: 0, volume: 0, declined: 0 }
      return [
        b.name, b.contact || '', b.email || '', b.commission_pct,
        s.total, s.funded, s.declined, s.volume,
        s.total > 0 ? Math.round(s.funded / s.total * 100) + '%' : '0%'
      ]
    })

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'ISO Performance!A1:I2000'
    })

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'ISO Performance!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [brokerHeaders, ...brokerRows] }
    })

    return res.status(200).json({
      success: true,
      deals: dealRows.length,
      funded: fundedRows.length,
      brokers: brokerRows.length
    })

  } catch (err) {
    console.error('Sheets sync error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
