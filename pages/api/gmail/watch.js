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

    const { data: listData } = await gmail.users.messages.list({
      userId: 'me',
      q: `is:unread to:${process.env.GMAIL_USER_EMAIL}`,
      maxResults: 20,
    })

    const messages = listData.messages || []
    const results = []

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

        // Extract business name from subject
        const businessName = subject
          .replace(/^FW:\s*/i, '')
          .replace(/^NEW DEAL\s*-\s*/i, '')
          .replace(/^New Submission\s*/i, '')
          .trim() || 'Unknown Business'

        // Skip non-deal emails
       const skipKeywords = ['canva', 'streak', 'linkedin', 'unsubscribe', 'newsletter', 'noreply', 'no-reply', 'marketing', 'promo']
const isSpam = skipKeywords.some(k => fromEmail.toLowerCase().includes(k)) && 
               !subject.toLowerCase().includes('fw:') &&
               !subject.toLowerCase().includes('new deal') &&
               !subject.toLowerCase().includes('submission') &&
               !subject.toLowerCase().includes('application')

        if (isSpam) {
          results.push({ messageId: msg.id, status: 'skipped', reason: 'not a deal' })
          await gmail.users.messages.modify({
            userId: 'me',
            id: msg.id,
            requestBody: { removeLabelIds: ['UNREAD'] }
          })
          continue
        }

        // Get deal count for deal number
        const { count } = await supabase
          .from('deals')
          .select('*', { count: 'exact', head: true })

        const dealNumber = `D-${String((count || 0) + 1).padStart(4, '0')}`

        // Look up broker
        const { data: broker } = await supabase
          .from('brokers')
          .select('id, name')
          .eq('email', fromEmail.toLowerCase())
          .single()

        // Create deal in Supabase
        const { data: deal, error } = await supabase
          .from('deals')
          .insert({
            deal_number: dealNumber,
            broker_id: broker?.id || null,
            business_name: businessName,
            contact_name: fromName,
            contact_email: fromEmail,
            status: 'new',
            source: 'email',
            gmail_thread_id: message.threadId,
            notes: `From: ${fromName} <${fromEmail}>\nSubject: ${subject}`
          })
          .select()
          .single()

        if (error) throw error

        // Log the sync
        await supabase.from('gmail_sync_log').insert({
          gmail_message_id: msg.id,
          gmail_thread_id: message.threadId,
          subject,
          from_email: fromEmail,
          deal_id: deal.id,
          processed: true
        })

        // Mark as read
        await gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: { removeLabelIds: ['UNREAD'] }
        })

        results.push({
          messageId: msg.id,
          dealNumber,
          businessName,
          from: fromEmail,
          status: 'created'
        })

      } catch (err) {
        results.push({ messageId: msg.id, status: 'error', error: err.message })
      }
    }

    return res.json({ processed: results.length, results })

  } catch (err) {
    console.error('Gmail error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
