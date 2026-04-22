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
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    // Only pick up emails newer than our last processed deal (April 17 2026)
    // This ensures we only process new submissions going forward
    const query = 'is:unread in:inbox to:' + process.env.GMAIL_USER_EMAIL + ' after:2026/04/17 -category:promotions -category:social -category:updates'
    const { data: listData } = await gmail.users.messages.list({ userId: 'me', q: query, maxResults: 20 })
    const messages = listData.messages || []
    const results = []
    const internalDomains = ['yoyo.com', 'genesis.com', 'ahavacapital.com', 'ahava.com']
    const spamDomains = ['canva.com', 'streak.com', 'linkedin.com', 'google.com', 'facebook.com', 'mailchimp.com', 'sendgrid.net', 'hubspot.com', 'noreply', 'no-reply', 'donotreply']
    const skipSubjects = ['unsubscribe', 'newsletter', 'password reset', 'invoice for', 'receipt for', 'webinar', 'out of office', 'auto-reply', 'delivery failed']
    // Broad keyword list - if it passes spam/internal checks and has any business-like content, take it
    const dealKeywords = ['fw:', 'fwd:', 're:', 'new deal', 'new submission', 'new application', 'submission', 'application', 'merchant', 'funding', 'advance', 'mca', 'business', 'llc', 'inc', 'corp', 'co.', 'dba', 'restaurant', 'construction', 'trucking', 'medical', 'dental', 'salon', 'auto', 'repair', 'catering', 'services', 'group', 'associates', 'enterprises', 'solutions', 'management', 'grill', 'cafe', 'hotel', 'gym', 'fitness', 'plumbing', 'electric', 'hvac', 'roofing', 'landscaping', 'deal', 'file', 'client', 'referral', 'package', 'docs', 'statement', 'renewal']
    const appUrl = process.env.NEXTAUTH_URL || 'https://flowcap-mca.vercel.app'

    for (const msg of messages) {
      try {
        const { data: existing } = await supabase.from('gmail_sync_log').select('id').eq('gmail_message_id', msg.id).single()
        if (existing) { results.push({ messageId: msg.id, status: 'already_processed' }); continue }
        const { data: message } = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'metadata', metadataHeaders: ['Subject', 'From'] })
        const headers = message.payload?.headers || []
        const getH = n => headers.find(h => h.name.toLowerCase() === n.toLowerCase())?.value || ''
        const subject = getH('Subject')
        const fromRaw = getH('From')
        const fromEmail = fromRaw.match(/<(.+)>/)?.[1] || fromRaw.trim()
        const fromName = fromRaw.match(/^(.+?)\s*</)?.[1]?.trim() || fromEmail
        const sl = subject.toLowerCase()
        const fl = fromEmail.toLowerCase()
        if (internalDomains.some(d => fl.includes(d))) {
          await gmail.users.messages.modify({ userId: 'me', id: msg.id, requestBody: { removeLabelIds: ['UNREAD'] } })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'internal' }); continue
        }
        if (spamDomains.some(d => fl.includes(d))) {
          await gmail.users.messages.modify({ userId: 'me', id: msg.id, requestBody: { removeLabelIds: ['UNREAD'] } })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'spam' }); continue
        }
        if (skipSubjects.some(w => sl.includes(w))) {
          await gmail.users.messages.modify({ userId: 'me', id: msg.id, requestBody: { removeLabelIds: ['UNREAD'] } })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'non-deal subject' }); continue
        }
        if (!dealKeywords.some(k => sl.includes(k))) {
          // Don't mark as read - log it so we can review
          console.log('Skipping email - no deal keywords in subject:', subject, 'from:', fromEmail)
          results.push({ messageId: msg.id, status: 'skipped', reason: 'no deal keywords', subject, from: fromEmail }); continue
        }
        const businessName = subject.replace(/^FW:\s*/i,'').replace(/^FWD:\s*/i,'').replace(/^RE:\s*/i,'').replace(/^NEW DEAL\s*[-:]\s*/i,'').replace(/^New Submission\s*[-:]\s*/i,'').replace(/^New Application\s*[-:]\s*/i,'').replace(/^Submission\s*[-:]\s*/i,'').trim() || 'Unknown Business'
        const { count } = await supabase.from('deals').select('*', { count: 'exact', head: true })
        const dealNumber = 'D-' + String((count || 0) + 1).padStart(4, '0')
        const { data: broker } = await supabase.from('brokers').select('id,name').ilike('email', fromEmail.toLowerCase()).single()
        const { data: deal, error: dealError } = await supabase.from('deals').insert({
          deal_number: dealNumber, broker_id: broker?.id || null,
          business_name: businessName, contact_name: fromName,
          contact_email: fromEmail, status: 'new', source: 'email',
          gmail_thread_id: message.threadId,
          notes: 'From: ' + fromName + ' <' + fromEmail + '>\nSubject: ' + subject
        }).select().single()
        if (dealError) throw dealError

        await supabase.from('gmail_sync_log').insert({ gmail_message_id: msg.id, gmail_thread_id: message.threadId, subject, from_email: fromEmail, deal_id: deal.id, processed: true })
        await gmail.users.messages.modify({ userId: 'me', id: msg.id, requestBody: { removeLabelIds: ['UNREAD'] } })

        // Step 1: Save attachments FIRST (synchronous - wait for it)
        const { saved, hasBankStatements } = await saveAttachments(gmail, message.id, deal.id, supabase)

        // Step 2: Parse bank statements if found (synchronous - wait for it)
        if (hasBankStatements && saved > 0) {
          try {
            await fetch(appUrl + '/api/documents/parse', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dealId: deal.id })
            })
          } catch (e) { console.error('Parse failed:', e.message) }
        }

        // Step 3: Run scrubber after 3 second delay to let parser save data
        setTimeout(() => {
          fetch(appUrl + '/api/scrubber/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dealId: deal.id })
          }).catch(e => console.error('Scrub failed:', e.message))
        }, 3000)

        results.push({ messageId: msg.id, dealNumber, businessName, from: fromEmail, broker: broker?.name || 'Unknown', attachmentsSaved: saved, hasBankStatements, status: 'created' })

      } catch (err) {
        console.error('Error processing', msg.id, ':', err.message)
        results.push({ messageId: msg.id, status: 'error', error: err.message })
        try { await supabase.from('gmail_sync_log').insert({ gmail_message_id: msg.id, processed: false, error: err.message }) } catch (e) {}
      }
    }
    return res.json({ processed: results.length, created: results.filter(r => r.status === 'created').length, skipped: results.filter(r => r.status === 'skipped').length, errors: results.filter(r => r.status === 'error').length, results })
  } catch (err) {
    console.error('Gmail watch error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}

async function saveAttachments(gmail, messageId, dealId, supabase) {
  let saved = 0
  let hasBankStatements = false
  try {
    const { data: fullMsg } = await gmail.users.messages.get({ userId: 'me', id: messageId, format: 'full' })
    const atts = []
    collectAtts(fullMsg.payload, atts)
    console.log('Found', atts.length, 'attachments for deal', dealId)
    for (const att of atts) {
      try {
        let data = att.body?.data
        if (!data && att.body?.attachmentId) {
          const { data: fetched } = await gmail.users.messages.attachments.get({ userId: 'me', messageId, id: att.body.attachmentId })
          data = fetched?.data
        }
        if (!data) { console.log('No data for attachment:', att.filename); continue }
        const buf = Buffer.from(data, 'base64')
        const filename = att.filename || 'file-' + Date.now()
        const mime = att.mimeType || 'application/octet-stream'
        const path = 'deals/' + dealId + '/' + filename
        const docType = guessType(filename, mime)
        if (docType === 'bank_statement') hasBankStatements = true
        console.log('Uploading', filename, 'as', docType, 'to', path)
        const { error: uploadErr } = await supabase.storage.from('deal-documents').upload(path, buf, { contentType: mime, upsert: true })
        if (uploadErr) { console.error('Upload error for', filename, ':', uploadErr.message); continue }
        await supabase.from('documents').insert({ deal_id: dealId, name: filename, doc_type: docType, storage_path: path, mime_type: mime, size_bytes: buf.length, source: 'email' })
        saved++
        console.log('Saved attachment:', filename)
      } catch (e) { console.error('Att error:', att.filename, e.message) }
    }
  } catch (err) { console.error('saveAttachments error:', err.message) }
  console.log('Total saved:', saved, 'hasBankStatements:', hasBankStatements)
  return { saved, hasBankStatements }
}

function collectAtts(payload, out) {
  if (payload.filename && payload.filename.length > 0 && payload.body) out.push(payload)
  if (payload.parts) payload.parts.forEach(p => collectAtts(p, out))
}

function guessType(filename, mime) {
  const f = filename.toLowerCase()
  // Specific non-bank documents first
  if (f.includes('void') || f.includes('voided')) return 'voided_check'
  if (f.includes('license') || f.includes('passport') || f.includes('_dl_') || f.includes('driver') || f.includes('photo_id') || f.includes('_id_')) return 'photo_id'
  if (f.includes('contract') || f.includes('agreement') || f.includes('signed')) return 'contract'
  if (f.includes('tax') || f.includes('1099') || f.includes('w-2') || f.includes('w2')) return 'tax_document'
  if (f.includes('export') || f.includes('renderer') || f.includes('report')) return 'other'
  // Bank statements - must have specific indicators
  if (f.includes('stmt') || f.includes('statement') || f.includes('bank') || f.includes('checking') || f.includes('savings') || f.includes('estmt') || f.includes('acct') || f.match(/\d{4}[_-]\d{2}[_-]\d{2}/)) return 'bank_statement'
  // Generic PDFs - classify as other, not bank statement
  if (mime === 'application/pdf') return 'other'
  return 'other'
}
