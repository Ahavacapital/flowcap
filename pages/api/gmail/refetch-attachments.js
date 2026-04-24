export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET || 'flowcap2024secret'
  const auth = req.headers.authorization || ''
  const queryAuth = req.query?.auth || ''
  if (auth !== `Bearer ${secret}` && queryAuth !== secret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { google } = require('googleapis')
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const appUrl = process.env.NEXTAUTH_URL || 'https://flowcap-mca.vercel.app'

    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    )
    oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Get underwriting deals with thread IDs
    const { data: allDeals } = await supabase
      .from('deals')
      .select('id, deal_number, business_name, gmail_thread_id')
      .not('gmail_thread_id', 'is', null)
      .in('status', ['underwriting', 'new', 'pending'])
      .order('submitted_at', { ascending: false })
      .limit(20)

    if (!allDeals || allDeals.length === 0) {
      return res.json({ message: 'No deals to process', count: 0 })
    }

    // Find first deal with no docs
    let targetDeal = null
    for (const deal of allDeals) {
      const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('deal_id', deal.id)
      if (!count || count === 0) {
        targetDeal = deal
        break
      }
    }

    if (!targetDeal) {
      return res.json({ message: 'All deals already have documents', count: 0, remaining: 0 })
    }

    // Fetch thread from Gmail
    const { data: thread } = await gmail.users.threads.get({
      userId: 'me', id: targetDeal.gmail_thread_id, format: 'full'
    })

    const messages = thread?.messages || []
    let totalSaved = 0
    let hasBankStatements = false

    for (const message of messages) {
      const atts = []
      collectParts(message.payload, atts)

      for (const att of atts) {
        try {
          let data = att.body?.data
          if (!data && att.body?.attachmentId) {
            const { data: fetched } = await gmail.users.messages.attachments.get({
              userId: 'me', messageId: message.id, id: att.body.attachmentId
            })
            data = fetched?.data
          }
          if (!data) continue

          const buf = Buffer.from(data, 'base64')
          const filename = att.filename || 'file-' + Date.now()
          const mime = att.mimeType || 'application/octet-stream'
          const path = 'deals/' + targetDeal.id + '/' + filename
          const docType = guessType(filename, mime)
          if (docType === 'bank_statement') hasBankStatements = true

          await supabase.storage.from('deal-documents').upload(path, buf, { contentType: mime, upsert: true })
          await supabase.from('documents').insert({
            deal_id: targetDeal.id, name: filename, doc_type: docType,
            storage_path: path, mime_type: mime, size_bytes: buf.length, source: 'email'
          })
          totalSaved++
        } catch (e) { console.error('Attachment error:', e.message) }
      }
    }

    // If bank statements found, parse then scrub
    if (hasBankStatements && totalSaved > 0) {
      try {
        await fetch(appUrl + '/api/documents/parse', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId: targetDeal.id })
        })
      } catch (e) { console.error('Parse error:', e.message) }

      setTimeout(() => {
        fetch(appUrl + '/api/scrubber/run', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId: targetDeal.id })
        }).catch(() => {})
      }, 3000)
    }

    // Count remaining
    const { count: remaining } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .not('gmail_thread_id', 'is', null)
      .in('status', ['underwriting', 'new', 'pending'])

    return res.json({
      processed: 1,
      saved: totalSaved,
      hasBankStatements,
      remaining: remaining || 0,
      deal: targetDeal.deal_number,
      business: targetDeal.business_name
    })

  } catch (err) {
    console.error('Refetch error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}

function collectParts(payload, out) {
  if (payload?.filename && payload.filename.length > 0 && payload.body) out.push(payload)
  if (payload?.parts) payload.parts.forEach(p => collectParts(p, out))
}

function guessType(filename, mime) {
  const f = filename.toLowerCase()
  if (f.includes('void') || f.includes('voided')) return 'voided_check'
  if (f.includes('license') || f.includes('passport') || f.includes('_dl_') || f.includes('driver')) return 'photo_id'
  if (f.includes('contract') || f.includes('agreement')) return 'contract'
  if (f.includes('stmt') || f.includes('statement') || f.includes('bank') || f.includes('checking') || f.includes('savings') || f.includes('estmt')) return 'bank_statement'
  return 'other'
}
