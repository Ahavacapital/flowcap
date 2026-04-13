export default function handler(req, res) {
  res.status(200).json({ status: 'working', email: process.env.GMAIL_USER_EMAIL })
}
