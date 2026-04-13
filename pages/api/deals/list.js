export default async function handler(req, res) {
  try {
    const { createClient } = require('@supabase/supabase-js')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: deals, error } = await supabase
      .from('deals')
      .select(`
        *,
        broker:brokers(id, name, contact, email),
        notes:deal_notes(id, category, body, author, created_at)
      `)
      .order('submitted_at', { ascending: false })

    if (error) throw error

    return res.status(200).json({ deals })

  } catch (err) {
    console.error('Error fetching deals:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
