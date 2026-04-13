module.exports = async function handler(req, res) {
  res.status(200).json({ 
    status: 'Gmail watcher is connected',
    email: process.env.GMAIL_USER_EMAIL || 'not set',
    hasRefreshToken: !!process.env.GMAIL_REFRESH_TOKEN
  })
}
