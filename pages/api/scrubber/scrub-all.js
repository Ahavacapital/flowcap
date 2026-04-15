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

    // Get all deals that haven't been scrubbed yet
    const { data: deals } = await supabase
      .from('deals')
      .select('id, deal_number, business_name, status')
      .in('status', ['new', 'scrubbing'])
      .order('submitted_at', { ascending: false })
      .limit(50)

    if (!deals || deals.length === 0) {
      return res.json({ message: 'No deals to scrub', count: 0 })
    }

    const results = []

    for (const deal of deals) {
      try {
        // First check if there are documents to parse
        const { data: docs } = await supabase
          .from('documents')
          .select('id')
          .eq('deal_id', deal.id)
          .limit(1)

        // Parse documents first if available
        if (docs && docs.length > 0) {
          await fetch(appUrl + '/api/documents/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dealId: deal.id })
          })
          // Small delay to let parser finish
          await new Promise(r => setTimeout(r, 2000))
        }

        // Now run scrubber
        const r = await fetch(appUrl + '/api/scrubber/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId: deal.id })
        })

        const data = await r.json()
        results.push({
          dealNumber: deal.deal_number,
          business: deal.business_name,
          approved: data.approved,
          riskScore: data.riskScore,
          status: data.approved ? 'offered' : 'declined'
        })

        // Small delay between deals to avoid API rate limits
        await new Promise(r => setTimeout(r, 1000))

      } catch (err) {
        results.push({
          dealNumber: deal.deal_number,
          business: deal.business_name,
          error: err.message
        })
      }
    }

    return res.json({
      message: 'Scrub complete',
      count: results.length,
      approved: results.filter(r => r.approved).length,
      declined: results.filter(r => r.approved === false).length,
      results
    })

  } catch (err) {
    console.error('Scrub all error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
