export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const { google } = require('googleapis')
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const oauth2Client = new google.auth.OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET, 'https://developers.google.com/oauthplayground')
    oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })
    const sid = process.env.SHEETS_DEALS_ID
    const results = {}

    const write = async (tab, values) => {
      const safe = tab.includes(' ') ? "'" + tab + "'" : tab
      await sheets.spreadsheets.values.clear({ spreadsheetId: sid, range: safe + '!A1:Z5000' })
      await sheets.spreadsheets.values.update({
        spreadsheetId: sid,
        range: safe + '!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
      })
    }

    const { data: allDeals } = await supabase
      .from('deals')
      .select('*, broker:brokers(name), deal_notes(category,body,author,created_at)')
      .order('submitted_at', { ascending: false })
      .limit(2000)
    const deals = allDeals || []

    // SUBMISSIONS
    try {
      const headers = [
        'Deal #','Business Name','Contact','Email','Broker / ISO',
        'Requested','Approved','Buy Rate','Sell Rate','Term (days)',
        'Status','Risk Score','Monthly Revenue','Avg Daily Balance',
        'Positions','NY Courts','DataMerch','Submitted','Latest Note'
      ]
      const rows = deals.map(d => {
        const lastNote = (d.deal_notes||[]).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0]
        return [
          d.deal_number||'', d.business_name||'', d.contact_name||'',
          d.contact_email||'', d.broker?.name||'',
          d.amount_requested||'', d.amount_approved||'',
          d.factor_rate||'', d.amount_approved?1.499:'',
          d.term_months?d.term_months*30:'',
          d.status||'', d.risk_score||'',
          d.monthly_revenue||'', d.avg_daily_balance||'',
          d.positions||0, d.ny_court_result||'', d.datamerch_result||'',
          d.submitted_at?new Date(d.submitted_at).toLocaleDateString():'',
          lastNote?lastNote.body?.slice(0,200):''
        ]
      })
      await write('SUBMISSIONS', [headers, ...rows])
      results.submissions = { rows: rows.length, status: 'success' }
    } catch (err) {
      results.submissions = { status: 'error', error: err.message }
    }

    // APPROVED DEALS
    try {
      const approved = deals.filter(d => ['offered','docs','contracts','bankverify'].includes(d.status))
      const headers = [
        'Deal #','Business','Contact','Broker',
        'Approved Amount','Buy Rate','Sell Rate (1.499)',
        'Term (days)','Merchant Payback','Our Cost','Our Profit',
        'Status','Risk Score','Submitted','Conditions'
      ]
      const rows = approved.map(d => {
        const td = d.term_months ? d.term_months * 30 : 0
        const payback = d.amount_approved ? Math.round(d.amount_approved * 1.499) : ''
        const cost = d.amount_approved && d.factor_rate ? Math.round(d.amount_approved * d.factor_rate) : ''
        const profit = payback && cost ? payback - cost : ''
        const conditions = (d.deal_notes||[]).filter(n=>n.category==='condition').map(n=>n.body).join(' | ')
        return [
          d.deal_number||'', d.business_name||'', d.contact_name||'',
          d.broker?.name||'', d.amount_approved||'',
          d.factor_rate||'', 1.499, td, payback, cost, profit,
          d.status||'', d.risk_score||'',
          d.submitted_at?new Date(d.submitted_at).toLocaleDateString():'',
          conditions
        ]
      })
      await write('APPROVED DEALS', [headers, ...rows])
      results.approvedDeals = { rows: rows.length, status: 'success' }
    } catch (err) {
      results.approvedDeals = { status: 'error', error: err.message }
    }

    // FUNDED DEALS
    try {
      const funded = deals.filter(d => d.status === 'funded')
      const headers = [
        'Deal #','Business','Contact','Broker',
        'Funded Amount','Buy Rate','Sell Rate',
        'Term (days)','Merchant Payback','Our Cost','Our Profit',
        'Balance','% Paid','Daily Payment','Funded Date','Renewal'
      ]
      const rows = funded.map(d => {
        const td = d.term_months ? d.term_months * 30 : 0
        const payback = d.amount_approved ? Math.round(d.amount_approved * 1.499) : ''
        const cost = d.amount_approved && d.factor_rate ? Math.round(d.amount_approved * d.factor_rate) : ''
        const profit = payback && cost ? payback - cost : ''
        const daily = payback && td ? Math.round(payback / td) : ''
        const pct = d.amount_approved && d.balance ? Math.round((1 - d.balance/d.amount_approved)*100)+'%' : ''
        const renewal = d.amount_approved && d.balance ? (d.balance/d.amount_approved <= 0.5 ? 'YES' : 'No') : ''
        return [
          d.deal_number||'', d.business_name||'', d.contact_name||'',
          d.broker?.name||'', d.amount_approved||'',
          d.factor_rate||'', 1.499, td, payback, cost, profit,
          d.balance||'', pct, daily,
          d.funded_at?new Date(d.funded_at).toLocaleDateString():'',
          renewal
        ]
      })
      await write('FUNDED DEALS', [headers, ...rows])
      results.fundedDeals = { rows: rows.length, status: 'success' }
    } catch (err) {
      results.fundedDeals = { status: 'error', error: err.message }
    }

    // ISO PERFORMANCE
    try {
      const { data: brokers } = await supabase.from('brokers').select('*').order('name')
      const stats = {}
      deals.forEach(d => {
        if (!d.broker_id) return
        if (!stats[d.broker_id]) stats[d.broker_id] = { total:0, funded:0, declined:0, volume:0 }
        stats[d.broker_id].total++
        if (d.status==='funded') { stats[d.broker_id].funded++; stats[d.broker_id].volume += d.amount_approved||0 }
        if (d.status==='declined') stats[d.broker_id].declined++
      })
      const headers = [
        'ISO / Broker Name','Contact','Email','Commission %',
        'Total Submissions','Funded','Declined','In Pipeline',
        'Volume Funded','Conversion Rate'
      ]
      const rows = (brokers||[]).map(b => {
        const s = stats[b.id] || { total:0, funded:0, declined:0, volume:0 }
        return [
          b.name||'', b.contact||'', b.email||'', b.commission_pct||5,
          s.total, s.funded, s.declined,
          s.total-s.funded-s.declined, s.volume,
          s.total>0?Math.round(s.funded/s.total*100)+'%':'0%'
        ]
      })
      await write('ISO PERFORMANCE', [headers, ...rows])
      results.isoPerformance = { rows: rows.length, status: 'success' }
    } catch (err) {
      results.isoPerformance = { status: 'error', error: err.message }
    }

    return res.json({ success: true, results })

  } catch (err) {
    console.error('Sheets sync error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
