export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const { dbId, status, amount, factor, termDays, balance, notes } = req.body || {}
    if (!dbId) return res.status(400).json({ error: 'dbId required' })
    const updates = { updated_at: new Date().toISOString() }
    if (status) updates.status = status
    if (amount != null) updates.amount_approved = amount
    if (factor != null) updates.factor_rate = factor
    if (termDays != null) updates.term_months = Math.ceil(termDays / 30)
    if (balance != null) updates.balance = balance
    if (notes != null) updates.notes = notes
    const { data: deal, error } = await supabase
      .from('deals').update(updates).eq('id', dbId).select().single()
    if (error) throw error
    return res.status(200).json({ success: true, deal })
  } catch (err) {
    console.error('update deal error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
