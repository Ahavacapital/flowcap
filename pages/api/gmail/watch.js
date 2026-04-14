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

    // Only pull unread emails from inbox
    const query = 'is:unread in:inbox to:' + process.env.GMAIL_USER_EMAIL + ' -category:promotions -category:social -category:updates'

    const { data: listData } = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 20,
    })

    const messages = listData.messages || []
    const results = []

    // ─── INTERNAL DOMAINS — ALWAYS SKIP ──────────────────────
    // These are your own company emails — never create deals from these
    const internalDomains = [
      'yoyo.com',
      'genesis.com',
      'ahavacapital.com',
      'ahava.com'
    ]

    // ─── MARKETING/SPAM DOMAINS — ALWAYS SKIP ────────────────
    const spamDomains = [
      'canva.com', 'streak.com', 'linkedin.com', 'google.com',
      'facebook.com', 'twitter.com', 'instagram.com', 'youtube.com',
      'mailchimp.com', 'constantcontact.com', 'sendgrid.net',
      'hubspot.com', 'salesforce.com', 'noreply', 'no-reply',
      'donotreply', 'notifications', 'mailer', 'bounce',
      'support@', 'info@', 'newsletter'
    ]

    // ─── SUBJECT WORDS THAT INDICATE NON-DEAL EMAILS ─────────
    const skipSubjectWords = [
      'unsubscribe', 'newsletter', 'your account', 'verify your',
      'password reset', 'invoice for', 'receipt for',
      'order confirmation', 'webinar', 'meeting invite',
      'calendar invite', 'out of office', 'auto-reply',
      'delivery failed', 'bounce', 'welcome to'
    ]

    // ─── KEYWORDS THAT CONFIRM A REAL DEAL SUBMISSION ────────
    const dealKeywords = [
      'fw:', 'fwd:', 'new deal', 'new submission', 'new application',
      'submission', 'application', 'merchant', 'funding request',
      'new file', 'new client', 'llc', 'inc', 'corp', 'co.',
      'dba', 'restaurant', 'construction', 'trucking', 'medical',
      'dental', 'salon', 'auto', 'repair', 'catering', 'services',
      'group', 'associates', 'enterprises', 'solutions', 'management',
      'bar ', 'grill', 'cafe', 'hotel', 'motel', 'gym', 'fitness',
      'plumbing', 'electric', 'hvac', 'roofing', 'landscaping'
    ]

    for (const msg of messages) {
      try {
        // Check if already processed
        const { data: existing } = await supabase
          .from('gmail_sync_log')
          .select('id')
          .eq('gmail_message_id', msg.id)
          .single()

        if (existing) {
          results.push({ messageId: msg.id, status: 'already_processed' })
          continue
        }

        const { data: message } = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full'
        })

        const headers = message.payload.headers
        const getHeader = (name) =>
          headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''

        const subject   = getHeader('Subject')
        const fromRaw   = getHeader('From')
        const fromEmail = fromRaw.match(/<(.+)>/)?.[1] || fromRaw.trim()
        const fromName  = fromRaw.match(/^(.+?)\s*</)?.[1]?.trim() || fromEmail

        const subjectLower = subject.toLowerCase()
        const fromLower    = fromEmail.toLowerCase()

        // Skip internal company emails
        const isInternal = internalDomains.some(d => fromLower.includes(d))
        if (isInternal) {
          await gmail.users.messages.modify({
            userId: 'me',
            id: msg.id,
            requestBody: { removeLabelIds: ['UNREAD'] }
          })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'internal email', from: fromEmail })
          continue
        }

        // Skip spam/marketing domains
        const isSpam = spamDomains.some(d => fromLower.includes(d))
        if (isSpam) {
          await gmail.users.messages.modify({
            userId: 'me',
            id: msg.id,
            requestBody: { removeLabelIds: ['UNREAD'] }
          })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'spam domain', from: fromEmail })
          continue
        }

        // Skip non-deal subject lines
        const isSubjectSkip = skipSubjectWords.some(w => subjectLower.includes(w))
        if (isSubjectSkip) {
          await gmail.users.messages.modify({
            userId: 'me',
            id: msg.id,
            requestBody: { removeLabelIds: ['UNREAD'] }
          })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'non-deal subject', subject })
          continue
        }

        // Must match at least one deal keyword
        const isDeal = dealKeywords.some(k => subjectLower.includes(k))
        if (!isDeal) {
          await gmail.users.messages.modify({
            userId: 'me',
            id: msg.id,
            requestBody: { removeLabelIds: ['UNREAD'] }
          })
          results.push({ messageId: msg.id, status: 'skipped', reason: 'no deal keywords', subject })
          continue
        }

        // Extract business name from subject
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

        // Extract body text
        const bodyText = extractBody(message.payload)

        // Try to extract requested amount
        const amountMatch = (subject + ' ' + bodyText).match(/\$?([\d,]+)(?:k|K)?\b/)
        const amountStr = amountMatch?.[1]?.replace(/,/g, '') || ''
        let amount = amountStr ? parseInt(amountStr) : null
        if (amount && amount < 1000) amount = amount * 1000

        // Get deal count for sequential deal number
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
            amount_requested: amount,
            status:           'new',
            source:           'email',
            gmail_thread_id:  message.threadId,
            notes:            'From: ' + fromName + ' <' + fromEmail + '>\nSubject: ' + subject
          })
          .select()
          .single()

        if (dealError) throw dealError

        // Save attachments to Supabase storage
        const attachments = []
        collectAttachments(message.payload, attachments)
        let savedDocs = 0
        let hasBankStatements = false

        for (const att of attachments) {
          try {
            let data = att.body?.data
            if (!data && att.body?.attachmentId) {
              const { data: fetched } = await gmail.users.messages.attachments.get({
                userId: 'me',
                messageId: message.id,
                id: att.body.attachmentId
              })
              data = fetched?.data
            }
            if (!data) continue

            const buffer   = Buffer.from(data, 'base64')
            const filename = att.filename || 'attachment-' + Date.now()
            const mimeType = att.mimeType || 'application/octet-stream'
            const path     = 'deals/' + deal.id + '/' + filename
            const docType  = guessDocType(filename, mimeType)

            if (docType === 'bank_statement') hasBankStatements = true

            const { error: uploadError } = await supabase.storage
              .from('deal-documents')
              .upload(path, buffer, { contentType: mimeType, upsert: true })

            if (uploadError) {
              console.error('Upload error:', filename, uploadError.message)
              continue
            }

            await supabase.from('documents').insert({
              deal_id:      deal.id,
              name:         filename,
              doc_type:     docType,
              storage_path: path,
              mime_type:    mimeType,
              size_bytes:   buffer.length,
              source:       'email'
            })

            savedDocs++
          } catch (attErr) {
            console.error('Attachment error:', attErr.message)
          }
        }

        // Log sync
        await supabase.from('gmail_sync_log').insert({
          gmail_message_id: msg.id,
          gmail_thread_id:  message.threadId,
          subject,
          from_email:       fromEmail,
          deal_id:          deal.id,
          processed:        true
        })

        // Mark email as read
        await gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: { removeLabelIds: ['UNREAD'] }
        })

        const appUrl = process.env.NEXTAUTH_URL || 'https://flowcap-mca.vercel.app'

        // Auto-parse bank statements if found
        if (hasBankStatements && savedDocs > 0) {
          try {
            await fetch(appUrl + '/api/documents/parse', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dealId: deal.id })
            })
          } catch (e) {
            console.error('Document parse trigger failed:', e.message)
          }
        }

        // Auto-scrub deal
        try {
          await fetch(appUrl + '/api/scrubber/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dealId: deal.id })
          })
        } catch (e) {
          console.error('Scrubber trigger failed:', e.message)
        }

        results.push({
          messageId:        msg.id,
          dealNumber,
          businessName,
          from:             fromEmail,
          broker:           broker?.name || 'Unknown broker',
          attachmentsSaved: savedDocs,
          hasBankStatements,
          status:           'created'
        })

      } catch (err) {
        console.error('Failed to process message', msg.id, ':', err.message)
        results.push({ messageId: msg.id, status: 'error', error: err.message })
        try {
          await supabase.from('gmail_sync_log').insert({
            gmail_message_id: msg.id,
            processed:        false,
            error:            err.message
          })
        } catch (e) {}
      }
    }

    return res.json({
      processed: results.length,
      created: results.filter(r => r.status === 'created').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      errors: results.filter(r => r.status === 'error').length,
      results
    })

  } catch (err) {
    console.error('Gmail watch error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}

function extractBody(payload) {
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8')
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8')
      }
    }
    for (const part of payload.parts) {
      const nested = extractBody(part)
      if (nested) return nested
    }
  }
  return ''
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
  if (
    f.includes('statement') || f.includes('bank') ||
    f.includes('checking') || f.includes('savings') ||
    f.includes('account') || f.endsWith('.pdf')
  ) return 'bank_statement'
  if (f.includes('void') || f.includes('check')) return 'voided_check'
  if (f.includes(' id') || f.includes('license') || f.includes('passport') || f.includes('dl')) return 'photo_id'
  if (f.includes('contract') || f.includes('agreement') || f.includes('signed')) return 'contract'
  if (f.includes('tax') || f.includes('1099') || f.includes('w2') || f.includes('w-2')) return 'tax_document'
  if (mimeType === 'application/pdf') return 'bank_statement'
  return 'other'
}
