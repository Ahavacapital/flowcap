export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { dealId } = req.body
    if (!dealId) return res.status(400).json({ error: 'dealId required' })

    const { createClient } = require('@supabase/supabase-js')
    const Anthropic = require('@anthropic-ai/sdk')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const anthropic = new Anthropic.default({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    // Get deal with all notes (includes document parser results)
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('*, deal_notes(*)')
      .eq('id', dealId)
      .single()

    if (dealError || !deal) {
      return res.status(404).json({ error: 'Deal not found' })
    }

    // Update status to scrubbing
    await supabase.from('deals').update({ status: 'scrubbing' }).eq('id', dealId)

    // Get document parser results from notes if available
    const parserNote = (deal.deal_notes || []).find(n =>
      n.author === 'Document Parser' && n.body?.includes('Bank statement analysis')
    )

    // Build data summary from what we know
    const knownData = {
      monthly_revenue: deal.monthly_revenue || null,
      avg_daily_balance: deal.avg_daily_balance || null,
      positions: deal.positions || 0,
      ny_court_result: deal.ny_court_result || 'unknown',
      datamerch_result: deal.datamerch_result || 'unknown',
      months_in_business: null,
      negative_days_per_month: null,
      nsf_count_per_month: null,
      revenue_trend: null,
      flags: []
    }

    // If we have parser notes, they are already saved in deal fields
    // Build a comprehensive data string
    const dataString = [
      'Business: ' + deal.business_name,
      'Amount Requested: ' + (deal.amount_requested ? '$' + deal.amount_requested.toLocaleString() : 'Unknown'),
      'Monthly Revenue (from bank statements): ' + (knownData.monthly_revenue ? '$' + knownData.monthly_revenue.toLocaleString() : 'Unknown'),
      'Average Daily Balance: ' + (knownData.avg_daily_balance ? '$' + knownData.avg_daily_balance.toLocaleString() : 'Unknown'),
      'Estimated Existing Positions: ' + knownData.positions,
      'NY Courts Result: ' + knownData.ny_court_result,
      'DataMerch Result: ' + knownData.datamerch_result,
      parserNote ? '\nBank Statement Analysis:\n' + parserNote.body : '',
      deal.notes ? '\nSubmission Notes:\n' + deal.notes : ''
    ].filter(Boolean).join('\n')

    const prompt = `You are an experienced MCA (Merchant Cash Advance) underwriter.
Analyze this deal using ALL available data and return a structured JSON assessment.

UNDERWRITING GUIDELINES:

PROHIBITED INDUSTRIES - AUTO DECLINE:
- Adult entertainment (strip clubs, adult websites, escort services)
- Cannabis / marijuana
- Firearms dealers
- Gambling / casinos

POSITION POLICY:
- We fund SECOND POSITION AND UP ONLY - NO first positions
- Will fund merchants with existing defaults if current financials are satisfactory
- Maximum 4 positions total (including ours)

FINANCIAL REQUIREMENTS:
- Minimum average monthly revenue: $35,000 (3-month average)
- Minimum average daily balance: $1,000
- Maximum negative days: 7 per month
- Minimum time in business: 6 months
- Maximum cash withhold: 40% of gross monthly revenue

INDUSTRY SPECIFIC TERMS:
- TRUCKING: Max term 60 days, more aggressive factor rates
- CONSTRUCTION: Max term 90 days, more aggressive factor rates
- All other industries: Max term 120 days

PRICING (BUY RATES - our cost):
- Risk score 80-100: buy rate 1.20x - 1.22x
- Risk score 65-79:  buy rate 1.29x - 1.35x
- Risk score 50-64:  buy rate 1.38x - 1.45x
- Below 50: DECLINE

SELL RATE: Always 1.499x (fixed - what broker presents to merchant)

ADVANCE AMOUNT:
- Max daily payment = monthly revenue x 40% / 21 business days
- Approved amount = max daily payment x business days in term
- Round to nearest $1,000

DEAL DATA:
${dataString}

SCORING GUIDE (100 points total):
- Monthly revenue vs $35k minimum (25pts): >$70k=25, $50-70k=20, $35-50k=15, <$35k=0
- Avg daily balance (20pts): >$5k=20, $2-5k=15, $1-2k=10, <$1k=0
- Negative days/month (20pts): 0-2=20, 3-4=15, 5-7=10, >7=0
- Positions (15pts): 1st=AUTO DECLINE, 2nd=15, 3rd=10, 4th=5
- Time in business (10pts): >2yr=10, 1-2yr=8, 6-12mo=5, <6mo=0
- Revenue consistency (10pts): consistent=10, moderate=7, high_variation=3

If financial data is missing or unknown, use conservative estimates and note uncertainty.

Respond ONLY with valid JSON, no markdown:
{
  "risk_score": <0-100>,
  "decision": <"approve" or "decline">,
  "decline_reason": <string or null>,
  "industry": <detected industry>,
  "is_prohibited": <true or false>,
  "position": <"first", "second", "third", "fourth_plus", or "unknown">,
  "avg_monthly_revenue": <number or null>,
  "avg_daily_balance": <number or null>,
  "negative_days_per_month": <number or null>,
  "nsf_count_per_month": <number or null>,
  "months_in_business": <number or null>,
  "existing_positions": <number>,
  "buy_rate": <our internal factor rate or null>,
  "sell_rate": 1.499,
  "term_days": <number - max 120 standard, 60 trucking, 90 construction>,
  "approved_amount": <number or null>,
  "max_daily_payment": <number or null>,
  "merchant_payback": <approved_amount x 1.499 or null>,
  "our_cost": <approved_amount x buy_rate or null>,
  "our_profit": <merchant_payback minus our_cost or null>,
  "data_quality": <"full" if bank statements available, "partial" if some data, "limited" if email only>,
  "flags": [<array of risk flag strings>],
  "conditions": [<array of approval conditions>],
  "summary": "<two sentence summary of the deal and decision>"
}`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = response.content[0].text.trim()
    const clean = text.replace(/```json\n?|\n?```/g, '').trim()
    const analysis = JSON.parse(clean)

    // Auto decline prohibited industries
    if (analysis.is_prohibited) {
      analysis.decision = 'decline'
      analysis.decline_reason = 'Prohibited industry: ' + analysis.industry
      analysis.risk_score = 0
      analysis.approved_amount = null
    }

    // Auto decline first position
    if (analysis.position === 'first') {
      analysis.decision = 'decline'
      analysis.decline_reason = 'First position only - we fund second position and up'
      analysis.risk_score = Math.min(analysis.risk_score || 0, 25)
      analysis.approved_amount = null
    }

    const approved = analysis.decision === 'approve' && analysis.risk_score >= 50
    const newStatus = approved ? 'offered' : 'declined'
    const termMonths = analysis.term_days ? Math.ceil(analysis.term_days / 30) : null

    // Update deal with all results
    const updateData = {
      status:            newStatus,
      risk_score:        analysis.risk_score,
      updated_at:        new Date().toISOString()
    }

    if (analysis.avg_monthly_revenue) updateData.monthly_revenue = analysis.avg_monthly_revenue
    if (analysis.avg_daily_balance) updateData.avg_daily_balance = analysis.avg_daily_balance
    if (analysis.existing_positions !== undefined) updateData.positions = analysis.existing_positions
    if (analysis.approved_amount) updateData.amount_approved = analysis.approved_amount
    if (analysis.buy_rate) updateData.factor_rate = analysis.buy_rate
    if (termMonths) updateData.term_months = termMonths

    await supabase.from('deals').update(updateData).eq('id', dealId)

    // Add main scrub result note
    const noteLines = [
      approved
        ? 'APPROVED - Risk score: ' + analysis.risk_score + '/100'
        : 'DECLINED - Risk score: ' + analysis.risk_score + '/100',
      approved ? 'Offer: $' + (analysis.approved_amount || 0).toLocaleString() + ' | Buy: ' + analysis.buy_rate + 'x | Sell: 1.499x | Term: ' + analysis.term_days + ' days' : '',
      approved ? 'Profit: $' + (analysis.our_profit || 0).toLocaleString() + ' | Merchant payback: $' + (analysis.merchant_payback || 0).toLocaleString() : '',
      !approved ? 'Decline reason: ' + analysis.decline_reason : '',
      'Industry: ' + (analysis.industry || 'Unknown'),
      'Data quality: ' + (analysis.data_quality || 'limited'),
      analysis.summary
    ].filter(Boolean).join('\n')

    await supabase.from('deal_notes').insert({
      deal_id:  dealId,
      author:   'AI Scrubber',
      category: approved ? 'approval' : 'risk',
      body:     noteLines
    })

    // Add individual flags as risk notes
    for (const flag of (analysis.flags || [])) {
      await supabase.from('deal_notes').insert({
        deal_id:  dealId,
        author:   'AI Scrubber',
        category: 'risk',
        body:     flag
      })
    }

    // Add conditions if approved
    for (const condition of (analysis.conditions || [])) {
      await supabase.from('deal_notes').insert({
        deal_id:  dealId,
        author:   'AI Scrubber',
        category: 'condition',
        body:     condition
      })
    }

    return res.status(200).json({
      dealId,
      dealNumber:     deal.deal_number,
      approved,
      riskScore:      analysis.risk_score,
      decision:       analysis.decision,
      declineReason:  analysis.decline_reason,
      industry:       analysis.industry,
      dataQuality:    analysis.data_quality,
      approvedAmount: analysis.approved_amount,
      buyRate:        analysis.buy_rate,
      sellRate:       1.499,
      termDays:       analysis.term_days,
      ourProfit:      analysis.our_profit,
      merchantPayback: analysis.merchant_payback,
      flags:          analysis.flags,
      conditions:     analysis.conditions,
      summary:        analysis.summary
    })

  } catch (err) {
    console.error('Scrubber error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
