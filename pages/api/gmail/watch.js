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

    const query = 'is:unread in:inbox to:' + process.env.GMAIL_USER_EMAIL + ' -category:promotions -category:social -category:updates'

    const { data: listData } = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 20,
    })

    const messages = listData.messages || []
    const results = []

    // Internal domains - never process
    const internalDomains = [
      'yoyo.com', 'genesis.com', 'ahavacapital.com', 'ahava.com'
    ]

    // Spam/marketing domains - skip
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

    // Deal keywords that must be present
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

        // Get message headers only first (fast)
        const { data: message } = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From', 'To', 'Date']
        })

        const headers = message.payload?.headers || []
        const getHeader = (name) =>
          headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''

        const subject   = getHeader('Subject')
        const fromRaw   = getHeader('From')
        const fromEmail = fromRaw.match(/<(.+)>/)?.[1] || fromRaw.trim()
        const fromName  = fromRaw.match(/^(.+?)\s*</)?.[1]?.trim() || fromEmail

        const subjectLower = subject.toLowerCase()
        const fromLower    = fromEmail.toLowerCase()

        // Skip internal
        if (internalDomains.some(d => fromLower.includes(d))) {
          await gmail.users.messages.modify({ userId: 'me', id: msg.id, requestBody: { removeLabelIds: ['UNREAD'] } })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'internal', from: fromEmail })
          continue
        }

        // Skip spam
        if (spamDomains.some(d => fromLower.includes(d))) {
          await gmail.users.messages.modify({ userId: 'me', id: msg.id, requestBody: { removeLabelIds: ['UNREAD'] } })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'spam', from: fromEmail })
          continue
        }

        // Skip non-deal subjects
        if (skipSubjectWords.some(w => subjectLower.includes(w))) {
          await gmail.users.messages.modify({ userId: 'me', id: msg.id, requestBody: { removeLabelIds: ['UNREAD'] } })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'non-deal subject', subject })
          continue
        }

        // Must have deal keywords
        if (!dealKeywords.some(k => subjectLower.includes(k))) {
          await gmail.users.messages.modify({ userId: 'me', id: msg.id, requestBody: { removeLabelIds: ['UNREAD'] } })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'no deal keywords', subject })
          continue
        }

        // Clean business name from subject
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

        // Get deal count for deal number
        const { count } = await supabase
          .from('deals')
          .select('*', { count: 'exact', head: true })

        const dealNumber = 'D-' + String((count || 0) + 1).padStart(4, '0')

        // Look up broker by email
        const { data: broker } = await supabase
          .from('brokers')
          .select('id, name')
          .ilike('email', fromEmail.toLowerCase())
          .single()

        // Create deal in Supabase
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

        // Fire scrubber async - don't wait for it
        fetch(appUrl + '/api/scrubber/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId: deal.id })
        }).catch(e => console.error('Scrubber fire failed:', e.message))

        // Save attachments async in background - don't wait
        saveAttachmentsAsync(gmail, message.id, deal.id, supabase, appUrl)

        results.push({
          messageId:    msg.id,
          dealNumber,
          businessName,
          from:         fromEmail,
          broker:       broker?.name || 'Unknown broker',
          status:       'created'
        })

      } catch (err) {
        console.error('Failed to process', msg.id, ':', err.message)
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

// Runs in background - saves attachments then triggers document parser
async function saveAttachmentsAsync(gmail, messageId, dealId, supabase, appUrl) {
  try {
    const { data: fullMessage } = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full'
    })

    const attachments = []
    collectAttachments(fullMessage.payload, attachments)

    let savedDocs = 0
    let hasBankStatements = false

    for (const att of attachments) {
      try {
        let data = att.body?.data
        if (!data && att.body?.attachmentId) {
          const { data: fetched } = await gmail.users.messages.attachments.get({
            userId: 'me',
            messageId,
            id: att.body.attachmentId
          })
          data = fetched?.data
        }
        if (!data) continue

        const buffer   = Buffer.from(data, 'base64')
        const filename = att.filename || 'attachment-' + Date.now()
        const mimeType = att.mimeType || 'application/octet-stream'
        const path     = 'deals/' + dealId + '/' + filename
        const docType  = guessDocType(filename, mimeType)

        if (docType === 'bank_statement') hasBankStatements = true

        const { error: uploadError } = await supabase.storage
          .from('deal-documents')
          .upload(path, buffer, { contentType: mimeType, upsert: true })

        if (uploadError) continue

        await supabase.from('documents').insert({
          deal_id:      dealId,
          name:         filename,
          doc_type:     docType,
          storage_path: path,
          mime_type:    mimeType,
          size_bytes:   buffer.length,
          source:       'email'
        })

        savedDocs++
      } catch (e) {
        console.error('Attachment save error:', e.message)
      }
    }

    // Trigger document parser if we have bank statements
    if (hasBankStatements && savedDocs > 0) {
      await fetch(appUrl + '/api/documents/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId })
      }).catch(e => console.error('Parse trigger failed:', e.message))
    }

  } catch (err) {
    console.error('saveAttachmentsAsync error:', err.message)
  }
}

function collectAttachments(payload, out) {
  if (payload.filename && payload.filename.length > 0 && payload.body) {
    out.push(payload)
  }
  if (payload.parts) {
    payload.parts.forEach(p => collectAttachments(p, out))
  }
}

function guessDocType(filename, mimeType) {
  const f = filename.toLowerCase()
  if (f.includes('statement') || f.includes('bank') || f.includes('checking') ||
      f.includes('savings') || f.includes('account') || f.endsWith('.pdf') ||
      mimeType === 'application/pdf') return 'bank_statement'
  if (f.includes('void') || f.includes('check')) return 'voided_check'
  if (f.includes(' id') || f.includes('license') || f.includes('passport')) return 'photo_id'
  if (f.includes('contract') || f.includes('agreement')) return 'contract'
  if (f.includes('tax') || f.includes('1099') || f.includes('w2')) return 'tax_document'
  return 'other'
}
