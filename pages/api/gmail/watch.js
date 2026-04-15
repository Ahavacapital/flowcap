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

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Last 30 days, unread, inbox only
    const query = [
      'is:unread',
      'in:inbox',
      'to:' + process.env.GMAIL_USER_EMAIL,
      'newer_than:30d',
      '-category:promotions',
      '-category:social',
      '-category:updates'
    ].join(' ')

    const { data: listData } = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 20,
    })

    const messages = listData.messages || []
    const results = []

    // Internal company domains - always skip
    const internalDomains = [
      'yoyo.com', 'genesis.com', 'ahavacapital.com', 'ahava.com'
    ]

    // Spam/marketing - always skip
    const spamDomains = [
      'canva.com', 'streak.com', 'linkedin.com', 'google.com',
      'facebook.com', 'twitter.com', 'mailchimp.com', 'sendgrid.net',
      'constantcontact.com', 'hubspot.com', 'salesforce.com',
      'noreply', 'no-reply', 'donotreply', 'mailer', 'bounce'
    ]

    // Non-deal subject words
    const skipSubjectWords = [
      'unsubscribe', 'newsletter', 'your account', 'verify your',
      'password reset', 'invoice for', 'receipt for',
      'order confirmation', 'webinar', 'meeting invite',
      'out of office', 'auto-reply', 'delivery failed', 'welcome to'
    ]

    // Must have at least one of these to be a deal
    const dealKeywords = [
      'fw:', 'fwd:', 'new deal', 'new submission', 'new application',
      'submission', 'application', 'merchant', 'funding request',
      'new file', 'new client', 'llc', 'inc', 'corp', 'co.',
      'dba', 'restaurant', 'construction', 'trucking', 'medical',
      'dental', 'salon', 'auto', 'repair', 'catering', 'services',
      'group', 'associates', 'enterprises', 'solutions', 'management',
      'bar ', 'grill', 'cafe', 'hotel', 'gym', 'fitness',
      'plumbing', 'electric', 'hvac', 'roofing', 'landscaping'
    ]

    const appUrl = process.env.NEXTAUTH_URL || 'https://flowcap-mca.vercel.app'

    for (const msg of messages) {
      try {
        // Already processed?
        const { data: existing } = await supabase
          .from('gmail_sync_log')
          .select('id')
          .eq('gmail_message_id', msg.id)
          .single()

        if (existing) {
          results.push({ messageId: msg.id, status: 'already_processed' })
          continue
        }

        // Get headers only - very fast
        const { data: message } = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From', 'To', 'Date']
        })

        const headers = message.payload?.headers || []
        const getH = (n) => headers.find(h => h.name.toLowerCase() === n.toLowerCase())?.value || ''

        const subject   = getH('Subject')
        const fromRaw   = getH('From')
        const fromEmail = fromRaw.match(/<(.+)>/)?.[1] || fromRaw.trim()
        const fromName  = fromRaw.match(/^(.+?)\s*</)?.[1]?.trim() || fromEmail
        const subjectLo = subject.toLowerCase()
        const fromLo    = fromEmail.toLowerCase()

        // Skip internal
        if (internalDomains.some(d => fromLo.includes(d))) {
          await gmail.users.messages.modify({ userId:'me', id:msg.id, requestBody:{ removeLabelIds:['UNREAD'] } })
          results.push({ messageId:msg.id, status:'skipped', reason:'internal', from:fromEmail })
          continue
        }

        // Skip spam
        if (spamDomains.some(d => fromLo.includes(d))) {
          await gmail.users.messages.modify({ userId:'me', id:msg.id, requestBody:{ removeLabelIds:['UNREAD'] } })
          results.push({ messageId:msg.id, status:'skipped', reason:'spam', from:fromEmail })
          continue
        }

        // Skip non-deal subjects
        if (skipSubjectWords.some(w => subjectLo.includes(w))) {
          await gmail.users.messages.modify({ userId:'me', id:msg.id, requestBody:{ removeLabelIds:['UNREAD'] } })
          results.push({ messageId:msg.id, status:'skipped', reason:'non-deal subject', subject })
          continue
        }

        // Must match deal keywords
        if (!dealKeywords.some(k => subjectLo.includes(k))) {
          await gmail.users.messages.modify({ userId:'me', id:msg.id, requestBody:{ removeLabelIds:['UNREAD'] } })
          results.push({ messageId:msg.id, status:'skipped', reason:'no deal keywords', subject })
          continue
        }

        // Clean business name
        const businessName = subject
          .replace(/^FW:\s*/i, '')
          .replace(/^FWD:\s*/i, '')
          .replace(/^RE:\s*/i, '')
          .replace(/^NEW DEAL\s*[-:]\s*/i, '')
          .replace(/^New Submission\s*[-:]\s*/i, '')
          .replace(/^New Application\s*[-:]\s*/i, '')
          .replace(/^Submission\s*[-:]\s*/i, '')
          .replace(/^Deal\s*[-:]\s*/i, '')
          .trim() || 'Unknown Business'

        // Get deal count for number
        const { count } = await supabase
          .from('deals')
          .select('*', { count:'exact', head:true })

        const dealNumber = 'D-' + String((count || 0) + 1).padStart(4, '0')

        // Look up broker
        const { data: broker } = await supabase
          .from('brokers')
          .select('id, name')
          .ilike('email', fromEmail.toLowerCase())
          .single()

        // Create deal
        const { data: deal, error: dealError } = await supabase
          .from('deals')
          .insert({
            deal_number:      dealNumber,
            broker_id:        broker?.id || null,
            business_name:    businessName,
            contact_name:     fromName,
            contact_email:    fromEmail,
            amount_requested: null,
            status:           'new',
            source:           'email',
            gmail_thread_id:  message.threadId,
            notes:            'From: ' + fromName + ' <' + fromEmail + '>\nSubject: ' + subject
          })
          .select()
          .single()

        if (dealError) throw dealError

        // Log sync
        await supabase.from('gmail_sync_log').insert({
          gmail_message_id: msg.id,
          gmail_thread_id:  message.threadId,
          subject,
          from_email:       fromEmail,
          deal_id:          deal.id,
          processed:        true
        })

        // Mark as read
        await gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: { removeLabelIds: ['UNREAD'] }
        })

        // Fire scrubber without waiting
        fetch(appUrl + '/api/scrubber/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId: deal.id })
        }).catch(e => console.error('Scrubber fire failed:', e.message))

        // Save attachments in background without waiting
        saveAttachments(gmail, message.id, deal.id, supabase, appUrl)
          .catch(e => console.error('Attachment save failed:', e.message))

        results.push({
          messageId:    msg.id,
          dealNumber,
          businessName,
          from:         fromEmail,
          broker:       broker?.name || 'Unknown broker',
          status:       'created'
        })

      } catch (err) {
        console.error('Error processing', msg.id, ':', err.message)
        results.push({ messageId: msg.id, status: 'error', error: err.message })
        try {
          await supabase.from('gmail_sync_log').insert({
            gmail_message_id: msg.id,
            processed: false,
            error: err.message
          })
        } catch (e) {}
      }
    }

    return res.json({
      processed: results.length,
      created:   results.filter(r => r.status === 'created').length,
      skipped:   results.filter(r => r.status === 'skipped').length,
      errors:    results.filter(r => r.status === 'error').length,
      results
    })

  } catch (err) {
    console.error('Gmail watch error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}

async function saveAttachments(gmail, messageId, dealId, supabase, appUrl) {
  const { data: fullMsg } = await gmail.users.messages.get({
    userId: 'me', id: messageId, format: 'full'
  })

  const atts = []
  collectAtts(fullMsg.payload, atts)

  let saved = 0
  let hasBankStatements = false

  for (const att of atts) {
    try {
      let data = att.body?.data
      if (!data && att.body?.attachmentId) {
        const { data: fetched } = await gmail.users.messages.attachments.get({
          userId: 'me', messageId, id: att.body.attachmentId
        })
        data = fetched?.data
      }
      if (!data) continue

      const buf      = Buffer.from(data, 'base64')
      const filename = att.filename || 'file-' + Date.now()
      const mime     = att.mimeType || 'application/octet-stream'
      const path     = 'deals/' + dealId + '/' + filename
      const docType  = guessType(filename, mime)

      if (docType === 'bank_statement') hasBankStatements = true

      const { error } = await supabase.storage
        .from('deal-documents')
        .upload(path, buf, { contentType: mime, upsert: true })

      if (error) continue

      await supabase.from('documents').insert({
        deal_id: dealId, name: filename, doc_type: docType,
        storage_path: path, mime_type: mime, size_bytes: buf.length, source: 'email'
      })
      saved++
    } catch (e) {
      console.error('Att error:', e.message)
    }
  }

  if (hasBankStatements && saved > 0) {
    await fetch(appUrl + '/api/documents/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId })
    }).catch(e => console.error('Parse trigger failed:', e.message))
  }
}

function collectAtts(payload, out) {
  if (payload.filename && payload.filename.length > 0 && payload.body) out.push(payload)
  if (payload.parts) payload.parts.forEach(p => collectAtts(p, out))
}

function guessType(filename, mime) {
  const f = filename.toLowerCase()
  if (f.includes('statement') || f.includes('bank') || f.includes('checking') ||
      f.includes('savings') || f.endsWith('.pdf') || mime === 'application/pdf') return 'bank_statement'
  if (f.includes('void') || f.includes('check')) return 'voided_check'
  if (f.includes(' id') || f.includes('license') || f.includes('passport')) return 'photo_id'
  if (f.includes('contract') || f.includes('agreement')) return 'contract'
  if (f.includes('tax') || f.includes('1099') || f.includes('w2')) return 'tax_document'
  return 'other'
}
