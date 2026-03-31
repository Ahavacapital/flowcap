// api/sheets/sync.js
// ─────────────────────────────────────────────────────────────
// Google Sheets Sync — two-way sync between Supabase and your
// three Google Sheets (deals, brokers, funded).
//
// POST /api/sheets/sync        — push all data to sheets
// POST /api/sheets/sync?pull=1 — pull updates from sheets into DB
//
// Vercel cron (every 15 minutes):
// { "path": "/api/sheets/sync", "schedule": "*/15 * * * *" }
// ─────────────────────────────────────────────────────────────

import { google } from 'googleapis'
import { supabaseAdmin } from '../../lib/supabase.js'

function getSheetsClient() {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
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

// ─── PUSH: Supabase → Google Sheets ──────────────────────────

async function pushToSheets() {
  const sheets = getSheetsClient()
  const results = {}

  // 1. Deals sheet
  results.deals = await pushDeals(sheets)

  // 2. Brokers sheet
  results.brokers = await pushBrokers(sheets)

  // 3. Funded deals sheet
  results.funded = await pushFunded(sheets)

  // Log sync
  for (const [sheet, result] of Object.entries(results)) {
    await supabaseAdmin.from('sheets_sync_log').insert({
      sheet_name: sheet,
      action: 'push',
      rows: result.rows,
      error: result.error || null
    })
  }

  return results
}

async function pushDeals(sheets) {
  try {
    const { data: deals } = await supabaseAdmin
      .from('deals')
      .select('*, broker:brokers(name)')
      .order('submitted_at', { ascending: false })
      .limit(1000)

    const headers = [
      'Deal #', 'Business', 'Contact', 'Broker', 'Requested', 'Approved',
      'Factor Rate', 'Term', 'Status', 'Risk Score', 'Monthly Revenue',
      'Avg Daily Bal', 'Positions', 'NY Courts', 'DataMerch',
      'Submitted', 'Funded Date', 'Balance', 'Notes'
    ]

    const rows = deals.map(d => [
      d.deal_number,
      d.business_name,
      d.contact_name || '',
      d.broker?.name || '',
      d.amount_requested || '',
      d.amount_approved || '',
      d.factor_rate || '',
      d.term_months || '',
      d.status,
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

    await clearAndWrite(sheets, process.env.SHEETS_DEALS_ID, 'Deals!A1', [headers, ...rows])
    return { rows: rows.length }
  } catch (err) {
    return { rows: 0, error: err.message }
  }
}

async function pushBrokers(sheets) {
  try {
    const { data: brokers } = await supabaseAdmin.from('brokers').select('*').order('name')

    // Get deal stats per broker
    const { data: dealStats } = await supabaseAdmin
      .from('deals')
      .select('broker_id, status, amount_approved')

    const stats = {}
    for (const d of dealStats || []) {
      if (!d.broker_id) continue
      if (!stats[d.broker_id]) stats[d.broker_id] = { total: 0, funded: 0, volume: 0 }
      stats[d.broker_id].total++
      if (d.status === 'funded') {
        stats[d.broker_id].funded++
        stats[d.broker_id].volume += d.amount_approved || 0
      }
    }

    const headers = ['Name', 'Contact', 'Email', 'Phone', 'Commission %',
                     'Total Deals', 'Funded Deals', 'Total Volume', 'Conversion %', 'Active']

    const rows = brokers.map(b => {
      const s = stats[b.id] || { total: 0, funded: 0, volume: 0 }
      return [
        b.name, b.contact || '', b.email || '', b.phone || '',
        b.commission_pct,
        s.total, s.funded,
        s.volume,
        s.total > 0 ? Math.round(s.funded / s.total * 100) + '%' : '0%',
        b.active ? 'Yes' : 'No'
      ]
    })

    await clearAndWrite(sheets, process.env.SHEETS_BROKERS_ID, 'Brokers!A1', [headers, ...rows])
    return { rows: rows.length }
  } catch (err) {
    return { rows: 0, error: err.message }
  }
}

async function pushFunded(sheets) {
  try {
    const { data: funded } = await supabaseAdmin
      .from('deals')
      .select('*, broker:brokers(name)')
      .eq('status', 'funded')
      .order('funded_at', { ascending: false })

    const headers = [
      'Deal #', 'Business', 'Contact', 'Broker', 'Funded Amount',
      'Factor Rate', 'Term', 'Payback Amount', 'Balance', '% Paid',
      'Funded Date', 'Daily Payment', 'Renewal Eligible'
    ]

    const rows = funded.map(d => {
      const payback = d.amount_approved && d.factor_rate
        ? Math.round(d.amount_approved * d.factor_rate)
        : ''
      const dailyPay = payback && d.term_months
        ? Math.round(payback / (d.term_months * 21))
        : ''
      const pctPaid = d.amount_approved && d.balance
        ? Math.round((1 - d.balance / d.amount_approved) * 100) + '%'
        : ''
      const renewalEligible = d.amount_approved && d.balance
        ? (d.balance / d.amount_approved <= 0.5 ? 'YES' : 'No')
        : ''
      return [
        d.deal_number,
        d.business_name,
        d.contact_name || '',
        d.broker?.name || '',
        d.amount_approved || '',
        d.factor_rate || '',
        d.term_months || '',
        payback,
        d.balance || '',
        pctPaid,
        d.funded_at ? new Date(d.funded_at).toLocaleDateString() : '',
        dailyPay,
        renewalEligible
      ]
    })

    await clearAndWrite(sheets, process.env.SHEETS_FUNDED_ID, 'Funded!A1', [headers, ...rows])
    return { rows: rows.length }
  } catch (err) {
    return { rows: 0, error: err.message }
  }
}

// ─── PULL: Google Sheets → Supabase ──────────────────────────
// Useful for: updating balances, adding notes, changing status from sheet

async function pullFromSheets() {
  const sheets = getSheetsClient()
  const results = {}

  try {
    // Pull deals sheet and sync status/balance changes back
    const { data: sheetRows } = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEETS_DEALS_ID,
      range: 'Deals!A2:S1000'  // skip header row
    })

    const rows = sheetRows?.values || []
    let updated = 0

    for (const row of rows) {
      const dealNumber = row[0]
      const statusFromSheet = row[8]?.toLowerCase()
      const balanceFromSheet = parseFloat(row[17]) || null
      const notesFromSheet = row[18] || ''

      if (!dealNumber) continue

      // Find deal in DB
      const { data: deal } = await supabaseAdmin
        .from('deals')
        .select('id, status, balance, notes')
        .eq('deal_number', dealNumber)
        .single()

      if (!deal) continue

      const updates = {}

      // Sync balance if changed
      if (balanceFromSheet !== null && balanceFromSheet !== deal.balance) {
        updates.balance = balanceFromSheet
      }

      // Sync notes if changed (sheet notes are appended)
      if (notesFromSheet && notesFromSheet !== (deal.notes || '')) {
        updates.notes = notesFromSheet
      }

      if (Object.keys(updates).length > 0) {
        await supabaseAdmin.from('deals').update(updates).eq('id', deal.id)
        updated++
      }
    }

    results.deals = { updated }
  } catch (err) {
    results.deals = { updated: 0, error: err.message }
  }

  await supabaseAdmin.from('sheets_sync_log').insert({
    sheet_name: 'deals', action: 'pull',
    rows: results.deals?.updated || 0,
    error: results.deals?.error || null
  })

  return results
}

// ─── SHEET WRITER HELPER ─────────────────────────────────────

async function clearAndWrite(sheets, spreadsheetId, range, values) {
  // Clear existing data
  await sheets.spreadsheets.values.clear({ spreadsheetId, range })
  
  // Write new data
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values }
  })

  // Format header row (bold + background)
  const sheetId = await getFirstSheetId(sheets, spreadsheetId)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.15, green: 0.2, blue: 0.35 },
              textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)'
        }
      }, {
        // Auto-resize columns
        autoResizeDimensions: {
          dimensions: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 20 }
        }
      }]
    }
  })
}

async function getFirstSheetId(sheets, spreadsheetId) {
  const { data } = await sheets.spreadsheets.get({ spreadsheetId })
  return data.sheets?.[0]?.properties?.sheetId || 0
}
