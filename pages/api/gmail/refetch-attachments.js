export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}` && req.query.auth !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const { google } = require('googleapis')
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const oauth2Client = new google.auth.OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET, 'https://developers.google.com/oauthplayground')
    oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    const appUrl = process.env.NEXTAUTH_URL || 'https://flowcap-mca.vercel.app'

    // Use a SQL join to find deals with gmail_thread_id but zero documents
    const { data: deals, error } = await supabase.rpc('get_deals_without_docs').limit ? 
      await supabase.from('deals').select('id, deal_number, business_name, gmail_thread_id').not('gmail_thread_id', 'is', null).eq('source', 'email').limit(5) :
      { data: [], error: null }

    // Simpler approach - just get all underwriting deals with thread IDs
    const { data: allDeals } = await supabase
      .from('deals')
      .select('id, deal_number, business_name, gmail_thread_id')
      .not('gmail_thread_id', 'is', null)
      .eq('source', 'email')
      .in('status', ['underwriting', 'new', 'pending'])
      .order('submitted_at', { ascending: false })
      .limit(10)

    if (!allDeals || allDeals.length === 0) {
      return res.json({ message: 'No deals to process', count: 0 })
    }

    // Filter to only deals with no documents
    const results = []
    let processed = 0

    for (const deal of allDeals) {
      const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('deal_id', deal.id)

      if ((count || 0) > 0) continue // Skip deals that already have docs

      if (processed >= 1) break // Only process 1 per run to avoid timeout
      processed++

      try {
        const { data: thread } = await gmail.users.threads.get({
          userId: 'me', id: deal.gmail_thread_id, format: 'full'
        })

        const messages = thread?.messages || []
        let totalSaved = 0
        let hasBankStatements = false

        for (const message of messages) {
          const atts = []
          collectAtts(message.payload, atts)

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
              const path = 'deals/' + deal.id + '/' + filename
              const docType = guessType(filename, mime)
              if (docType === 'bank_statement') hasBankStatements = true

              const { error: uploadErr } = await supabase.storage
                .from('deal-documents')
                .upload(path, buf, { contentType: mime, upsert: true })

              if (uploadErr) { console.error('Upload error:', uploadErr.message); continue }

              await supabase.from('documents').insert({
                deal_id: deal.id, name: filename, doc_type: docType,
                storage_path: path, mime_type: mime, size_bytes: buf.length, source: 'email'
              })
              totalSaved++
            } catch (e) { console.error('Att error:', e.message) }
          }
        }

        if (hasBankStatements && totalSaved > 0) {
          await fetch(appUrl + '/api/documents/parse', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dealId: deal.id })
          }).catch(() => {})
          setTimeout(() => {
            fetch(appUrl + '/api/scrubber/run', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dealId: deal.id })
            }).catch(() => {})
          }, 3000)
        }

        results.push({
          deal: deal.deal_number, business: deal.business_name,
          attachmentsSaved: totalSaved, hasBankStatements,
          status: totalSaved > 0 ? 'saved' : 'no_attachments_in_email'
        })

        await new Promise(r => setTimeout(r, 500))

      } catch (err) {
        console.error('Error for', deal.deal_number, ':', err.message)
        results.push({ deal: deal.deal_number, status: 'error', error: err.message })
      }
    }

    const remaining = (allDeals.length - processed)
    return res.json({
      processed: results.length,
      saved: results.filter(r => r.status === 'saved').length,
      remaining,
      results
    })

  } catch (err) {
    console.error('Refetch error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}

function collectAtts(payload, out) {
  if (payload.filename && payload.filename.length > 0 && payload.body) out.push(payload)
  if (payload.parts) payload.parts.forEach(p => collectAtts(p, out))
}

function guessType(filename, mime) {
  const f = filename.toLowerCase()
  if (f.includes('void') || f.includes('voided')) return 'voided_check'
  if (f.includes('license') || f.includes('passport') || f.includes('_dl_') || f.includes('driver')) return 'photo_id'
  if (f.includes('contract') || f.includes('agreement')) return 'contract'
  if (f.includes('stmt') || f.includes('statement') || f.includes('bank') || f.includes('checking') || f.includes('savings') || f.includes('estmt')) return 'bank_statement'
  if (f.endsWith('.pdf') || mime === 'application/pdf') return 'other'
  return 'other'
}
