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

    // Get next batch of unscubbed deals
    const { data: deals, count } = await supabase
      .from('deals')
      .select('id, deal_number, business_name, monthly_revenue, avg_daily_balance', { count: 'exact' })
      .in('status', ['new', 'scrubbing'])
      .order('submitted_at', { ascending: false })
      .limit(10)

    if (!deals || deals.length === 0) {
      return res.json({ message: 'All deals already scrubbed!', remaining: 0 })
    }

    const results = []

    for (const deal of deals) {
      try {
        // Check if deal already has financial data from parser
        const hasData = !!(deal.monthly_revenue || deal.avg_daily_balance)

        if (!hasData) {
          // Check if bank statements exist
          const { count: docCount } = await supabase
            .from('documents')
            .select('*', { count: 'exact', head: true })
            .eq('deal_id', deal.id)
            .eq('doc_type', 'bank_statement')

          if (docCount > 0) {
            // Run parser FIRST and wait for it to complete
            try {
              const parseRes = await fetch(appUrl + '/api/documents/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dealId: deal.id })
              })
              const parseData = await parseRes.json()
              if (parseData.success) {
                results.push({
                  deal: deal.deal_number,
                  parsed: true,
                  revenue: parseData.extracted?.avg_monthly_revenue
                })
              }
            } catch (e) {
              console.error('Parser failed for', deal.deal_number, e.message)
            }
          }
        }

        // Now run scrubber — it will have fresh financial data
        fetch(appUrl + '/api/scrubber/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId: deal.id })
        }).catch(e => console.error('Scrub failed:', deal.deal_number, e.message))

        results.push({
          deal: deal.deal_number,
          business: deal.business_name,
          hadData: hasData,
          status: 'scrubbing'
        })

      } catch (err) {
        console.error('Error for', deal.deal_number, err.message)
        results.push({ deal: deal.deal_number, error: err.message })
      }
    }

    return res.json({
      message: 'Processing ' + deals.length + ' deals',
      remaining: count,
      results
    })

  } catch (err) {
    console.error('Scrub-all error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
