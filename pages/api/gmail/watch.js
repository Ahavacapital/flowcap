const { google } = require('googleapis')

function getGoogleAuth() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  })
  return oauth2Client
}

module.exports = async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const auth = getGoogleAuth()
    const gmail = google.gmail({ version: 'v1', auth })
    const query = `is:unread to:${process.env.GMAIL_USER_EMAIL}`

    const { data: listData } = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 20,
    })

    const messages = listData.messages || []
    const results = []

    for (const msg of messages) {
      try {
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

        results.push({
          messageId: msg.id,
          subject,
          from: fromEmail,
          status: 'received'
        })

        await gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: { removeLabelIds: ['UNREAD'] }
        })

      } catch (err) {
        results.push({ messageId: msg.id, status: 'error', error: err.message })
      }
    }

    return res.json({ processed: results.length, results })

  } catch (err) {
    console.error('Gmail watch error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
