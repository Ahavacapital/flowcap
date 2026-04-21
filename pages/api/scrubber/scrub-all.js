export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const appUrl = process.env.NEXTAUTH_URL || 'https://flowcap-mca.vercel.app'
    const { data: deals, count } = await supabase
      .from('deals')
      .select('id, deal_number, business_name', { count: 'exact' })
      .in('status', ['new', 'scrubbing'])
      .order('submitted_at', { ascending: false })
      .limit(10)
    if (!deals || deals.length === 0) {
      return res.json({ message: 'All deals already scrubbed!', remaining: 0 })
    }
    for (const deal of deals) {
      fetch(appUrl + '/api/scrubber/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal.id })
      }).catch(e => console.error('Scrub failed:', deal.deal_number, e.message))
    }
    return res.json({
      message: 'Scrubbing ' + deals.length + ' deals in background',
      scrubbing: deals.map(d => d.deal_number),
      remaining: count,
      instruction: 'Wait 30 seconds then run again for next batch'
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
