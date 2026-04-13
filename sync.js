// api/sheets/sync.js
// Google Sheets Sync — uses OAuth2 (no service account key needed)
// Tab names: Submissions (deals), Funded Deals, ISO Performance (brokers)
// Runs every 15 minutes via Vercel cron

import { google } from 'googleapis'
import { supabaseAdmin } from '../../lib/supabase.js'

function getSheetsClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  })
  return google.sheets({ version: 'v4', auth: oauth2Client })
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const pull = req.query.pull === '1'

  try {
    if (pull) {
      const results = await pullFromSheets()
      return res.json({ direction: 'pull', results })
    } else {
      const results = await pushToSheets()
      return res.json({ direction: 'push', results })
    }
  } catch (err) {
    console.error('Sheets sync error:', err)
    return res.status(500).json({ error: err.message })
  }
}

async function pushToSheets() {
  const sheets = getSheetsClient()
  const results = {}
  results.deals   = await pushSubmissions(sheets)
  results.brokers = await pushISOPerformance(sheets)
  results.funded  = await pushFundedDeals(sheets)
  for (const [sheet, result] of Object.entries(results)) {
    await supabaseAdmin.from('sheets_sync_log').insert({
      sheet_name: sheet, action: 'push',
      rows: result.rows, error: result.error || null
    })
  }
  return results
}

async function pushSubmissions(sheets) {
  try {
    const { data: deals } = await supabaseAdmin
      .from('deals')
      .select('*, broker:brokers(name)')
      .order('submitted_at', { ascending: false })
      .limit(1000)

    const headers = [
      'Deal #', 'Business Name', 'Contact', 'Broker / ISO', 'Amount Requested',
      'Amount Approved', 'Factor Rate', 'Term (months)', 'Status', 'Risk Score',
      'Monthly Revenue', 'Avg Daily Balance', 'Positions', 'NY Courts',
      'DataMerch', 'Submitted Date', 'Funded Date', 'Balance', 'Notes'
    ]

    const rows = deals.map(d => [
      d.deal_number, d.business_name, d.contact_name || '',
      d.broker?.name || '', d.amount_requested || '',
      d.amount_approved || '', d.factor_rate || '',
      d.term_months || '', d.status, d.risk_score || '',
      d.monthly_revenue || '', d.avg_daily_balance || '',
      d.positions || 0, d.ny_court_result || '',
      d.datamerch_result || '',
      d.submitted_at ? new Date(d.submitted_at).toLocaleDateString() : '',
      d.funded_at ? new Date(d.funded_at).toLocaleDateString() : '',
      d.balance || '', d.notes ? d.notes.slice(0, 200) : ''
    ])

    await clearAndWrite(sheets, process.env.SHEETS_DEALS_ID, 'Submissions!A1', [headers, ...rows])
    return { rows: rows.length }
  } catch (err) {
    return { rows: 0, error: err.message }
  }
}

async function pushISOPerformance(sheets) {
  try {
    const { data: brokers } = await supabaseAdmin.from('brokers').select('*').order('name')
    const { data: dealStats } = await supabaseAdmin.from('deals').select('broker_id, status, amount_approved')

    const stats = {}
    for (const d of dealStats || []) {
      if (!d.broker_id) continue
      if (!stats[d.broker_id]) stats[d.broker_id] = { total: 0, funded: 0, volume: 0, declined: 0 }
      stats[d.broker_id].total++
      if (d.status === 'funded') { stats[d.broker_id].funded++; stats[d.broker_id].volume += d.amount_approved || 0 }
      if (d.status === 'declined') stats[d.broker_id].declined++
    }

    const headers = [
      'ISO / Broker Name', 'Contact', 'Email', 'Phone', 'Commission %',
      'Total Submissions', 'Funded Deals', 'Declined Deals',
      'Total Volume Funded', 'Conversion Rate', 'Active'
    ]

    const rows = brokers.map(b => {
      const s = stats[b.id] || { total: 0, funded: 0, volume: 0, declined: 0 }
      return [b.name, b.contact || '', b.email || '', b.phone || '', b.commission_pct,
        s.total, s.funded, s.declined, s.volume,
        s.total > 0 ? Math.round(s.funded / s.total * 100) + '%' : '0%',
        b.active ? 'Yes' : 'No']
    })

    await clearAndWrite(sheets, process.env.SHEETS_BROKERS_ID, 'ISO Performance!A1', [headers, ...rows])
    return { rows: rows.length }
  } catch (err) {
    return { rows: 0, error: err.message }
  }
}

async function pushFundedDeals(sheets) {
  try {
    const { data: funded } = await supabaseAdmin
      .from('deals').select('*, broker:brokers(name)')
      .eq('status', 'funded').order('funded_at', { ascending: false })

    const headers = [
      'Deal #', 'Business Name', 'Contact', 'ISO / Broker',
      'Funded Amount', 'Factor Rate', 'Term (months)',
      'Payback Amount', 'Current Balance', '% Paid',
      'Funded Date', 'Daily Payment', 'Renewal Eligible'
    ]

    const rows = funded.map(d => {
      const payback = d.amount_approved && d.factor_rate ? Math.round(d.amount_approved * d.factor_rate) : ''
      const dailyPay = payback && d.term_months ? Math.round(payback / (d.term_months * 21)) : ''
      const pctPaid = d.amount_approved && d.balance ? Math.round((1 - d.balance / d.amount_approved) * 100) + '%' : ''
      const renewal = d.amount_approved && d.balance ? (d.balance / d.amount_approved <= 0.5 ? 'YES' : 'No') : ''
      return [d.deal_number, d.business_name, d.contact_name || '', d.broker?.name || '',
        d.amount_approved || '', d.factor_rate || '', d.term_months || '',
        payback, d.balance || '', pctPaid,
        d.funded_at ? new Date(d.funded_at).toLocaleDateString() : '',
        dailyPay, renewal]
    })

    await clearAndWrite(sheets, process.env.SHEETS_FUNDED_ID, 'Funded Deals!A1', [headers, ...rows])
    return { rows: rows.length }
  } catch (err) {
    return { rows: 0, error: err.message }
  }
}

async function pullFromSheets() {
  const sheets = getSheetsClient()
  let updated = 0

  try {
    const { data: sheetRows } = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEETS_DEALS_ID,
      range: 'Submissions!A2:S1000'
    })

    for (const row of (sheetRows?.values || [])) {
      const dealNumber = row[0]
      if (!dealNumber) continue
      const { data: deal } = await supabaseAdmin.from('deals').select('id, balance, notes').eq('deal_number', dealNumber).single()
      if (!deal) continue
      const updates = {}
      const bal = parseFloat(row[17]) || null
      if (bal !== null && bal !== deal.balance) updates.balance = bal
      if (row[18] && row[18] !== (deal.notes || '')) updates.notes = row[18]
      if (Object.keys(updates).length > 0) {
        await supabaseAdmin.from('deals').update(updates).eq('id', deal.id)
        updated++
      }
    }
  } catch (err) {
    console.error('Pull error:', err)
  }

  await supabaseAdmin.from('sheets_sync_log').insert({ sheet_name: 'Submissions', action: 'pull', rows: updated })
  return { updated }
}

async function clearAndWrite(sheets, spreadsheetId, range, values) {
  await sheets.spreadsheets.values.clear({ spreadsheetId, range })
  await sheets.spreadsheets.values.update({
    spreadsheetId, range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values }
  })

  const sheetId = await getSheetId(sheets, spreadsheetId, range)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.15, blue: 0.25 }, textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } } } },
            fields: 'userEnteredFormat(backgroundColor,textFormat)'
          }
        },
        { autoResizeDimensions: { dimensions: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 20 } } }
      ]
    }
  })
}

async function getSheetId(sheets, spreadsheetId, range) {
  const tabName = range.split('!')[0]
  const { data } = await sheets.spreadsheets.get({ spreadsheetId })
  const sheet = data.sheets?.find(s => s.properties.title === tabName)
  return sheet?.properties?.sheetId || 0
}
