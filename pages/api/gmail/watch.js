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

    // Only pull from INBOX, unread, not promotions/social/updates
    const query = `is:unread in:inbox to:${process.env.GMAIL_USER_EMAIL} -category:promotions -category:social -category:updates`

    const { data: listData } = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 20,
    })

    const messages = listData.messages || []
    const results = []

    // Domains to always skip
    const skipDomains = [
      'canva.com', 'streak.com', 'linkedin.com', 'google.com',
      'facebook.com', 'twitter.com', 'instagram.com', 'youtube.com',
      'mailchimp.com', 'constantcontact.com', 'sendgrid.net',
      'notifications', 'noreply', 'no-reply', 'donotreply'
    ]

    // Subject words to skip
    const skipSubjectWords = [
      'unsubscribe', 'newsletter', 'your account', 'verify your',
      'password reset', 'invoice', 'receipt', 'order confirmation',
      'webinar', 'meeting invite', 'calendar invite'
    ]

    // Keywords that indicate a real deal submission
    const dealKeywords = [
      'fw:', 'fwd:', 'new deal', 'new submission', 'new application',
      'submission', 'application', 'merchant', 'funding request',
      'deal submission', 'new file', 'new client', 'llc', 'inc',
      'corp', 'co.', 'dba', 'restaurant', 'construction', 'trucking',
      'medical', 'dental', 'salon', 'auto', 'repair', 'catering',
      'services', 'group', 'associates', 'enterprises', 'solutions'
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

        // Skip if from known non-deal domain
        const isDomainSkip = skipDomains.some(d => fromLower.includes(d))

        // Skip if subject has non-deal words
        const isSubjectSkip = skipSubjectWords.some(w => subjectLower.includes(w))

        // Check if looks like a real deal
        const isDeal = dealKeywords.some(k => subjectLower.includes(k))

        if (isDomainSkip || isSubjectSkip || !isDeal) {
          await gmail.users.messages.modify({
            userId: 'me',
            id: msg.id,
            requestBody: { removeLabelIds: ['UNREAD'] }
          })
          results.push({ messageId: msg.id, status: 'skipped', subject, from: fromEmail })
          continue
        }

        // Extract business name from subject
        const businessName = subject
          .replace(/^FW:\s*/i, '')
          .replace(/^FWD:\s*/i, '')
          .replace(/^NEW DEAL\s*[-:]\s*/i, '')
          .replace(/^New Submission\s*/i, '')
          .replace(/^New Application\s*/i, '')
          .replace(/^Submission\s*[-:]\s*/i, '')
          .trim() || 'Unknown Business'

        // Try to extract amount from subject or body
        const bodyText = extractBody(message.payload)
        const amountMatch = `${subject} ${bodyText}`.match(/\$?([\d,]+)k?\b/)
        const amountStr = amountMatch?.[1]?.replace(/,/g, '') || ''
        const amount = amountStr ? parseInt(amountStr) : null

        // Get deal count for deal number
        const { count } = await supabase
          .from('deals')
          .select('*', { count: 'exact', head: true })

        const dealNumber = `D-${String((count || 0) + 1).padStart(4, '0')}`

        // Look up broker by email
        const { data: broker } = await supabase
          .from('brokers')
          .select('id, name')
          .ilike('email', fromEmail.toLowerCase())
          .single()

        // Create deal in Supabase
        const { data: deal, error } = await supabase
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
            notes:            `From: ${fromName} <${fromEmail}>\nSubject: ${subject}`
          })
          .select()
          .single()

        if (error) throw error

        // Log the sync
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

        // Auto-trigger scrubber immediately
        try {
          const appUrl = process.env.NEXTAUTH_URL || 'https://flowcap-mca.vercel.app'
          await fetch(`${appUrl}/api/scrubber/run`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dealId: deal.id })
          })
        } catch (scrubErr) {
          console.error('Auto-scrub failed for deal', dealNumber, ':', scrubErr.message)
        }

        results.push({
          messageId:    msg.id,
          dealNumber,
          businessName,
          from:         fromEmail,
          broker:       broker?.name || 'Unknown broker',
          status:       'created'
        })

      } catch (err) {
        console.error(`Failed to process message ${msg.id}:`, err.message)
        results.push({ messageId: msg.id, status: 'error', error: err.message })

        // Log the error
        try {
          await supabase.from('gmail_sync_log').insert({
            gmail_message_id: msg.id,
            gmail_thread_id:  msg.threadId,
            processed:        false,
            error:            err.message
          })
        } catch(e) {}
      }
    }

    return res.json({ processed: results.length, results })

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
