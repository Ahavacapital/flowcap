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

    // Get deal from database
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .single()

    if (dealError || !deal) {
      return res.status(404).json({ error: 'Deal not found' })
    }

    // Update status to scrubbing
    await supabase.from('deals').update({ status: 'scrubbing' }).eq('id', dealId)

    const prompt = `You are an experienced MCA (Merchant Cash Advance) underwriter.
Analyze this merchant application and return a structured JSON assessment.

UNDERWRITING GUIDELINES:

PROHIBITED INDUSTRIES — AUTO DECLINE:
- Adult entertainment (strip clubs, adult websites, escort services, pornography)
- Cannabis / marijuana businesses
- Firearms dealers
- Gambling / casinos

POSITION POLICY:
- We fund SECOND POSITION AND UP ONLY
- We DO NOT fund first positions — auto decline if first position
- We WILL fund merchants with existing defaults if current financials are satisfactory

FINANCIAL MINIMUMS:
- Minimum average monthly revenue: $35,000 (3 month average)
- Minimum average daily balance: $1,000
- Maximum negative days: 7 per month
- Minimum time in business: 6 months
- Maximum cash withhold: 40% of gross monthly revenue

INDUSTRY SPECIFIC RULES:
- TRUCKING: Be MORE aggressive — shorter terms only, max 60 days, higher factor rates due to volatility
- CONSTRUCTION: Be MORE aggressive — shorter terms only, max 90 days, higher factor rates due to seasonality
- All other industries: standard terms up to 120 days maximum

PRICING RULES:
- Our SELL RATE to broker is ALWAYS 1.499 factor — this is what the broker presents to merchant
- Our BUY RATE (our cost) is what we calculate internally based on risk
- Maximum term: 120 days for standard industries
- Maximum term: 60 days for trucking
- Maximum term: 90 days for construction

BUY RATE PRICING (our internal cost):
- Risk score 80-100: buy rate 1.20x - 1.25x, term 90-120 days
- Risk score 65-79:  buy rate 1.29x - 1.35x, term 60-90 days
- Risk score 50-64:  buy rate 1.38x - 1.45x, term 45-60 days
- Risk score below 50: DECLINE

RISK SCORE FACTORS (out of 100):
- Average monthly revenue vs $35k minimum (25pts): >$70k=25, $50-70k=20, $35-50k=15, <$35k=0
- Average daily balance (20pts): >$5k=20, $2-5k=15, $1-2k=10, <$1k=0
- Negative days per month (20pts): 0-2=20, 3-4=15, 5-7=10, >7=0
- Position in stack (15pts): 2nd=15, 3rd=10, 4th+=5, 1st=AUTO DECLINE
- Time in business (10pts): >2yr=10, 1-2yr=8, 6-12mo=5, <6mo=0
- Revenue consistency (10pts): consistent=10, moderate variation=7, high variation=3

ADVANCE AMOUNT CALCULATION:
- Maximum daily ACH = monthly revenue x 40% / 21 business days
- Approved amount = max daily ACH x number of business days in term
- Always round approved amount to nearest $1,000

DEAL INFORMATION:
Business: ${deal.business_name}
Contact: ${deal.contact_name || 'Unknown'}
Amount Requested: $${deal.amount_requested?.toLocaleString() || 'Unknown'}
Notes: ${deal.notes || 'None'}

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "risk_score": <0-100>,
  "decision": <"approve" or "decline">,
  "decline_reason": <string or null>,
  "industry": <detected industry>,
  "is_prohibited_industry": <true or false>,
  "position": <"first" or "second_plus" or "unknown">,
  "avg_monthly_revenue": <number or null>,
  "avg_daily_balance": <number or null>,
  "negative_days_per_month": <number or null>,
  "nsf_count_per_month": <number or null>,
  "months_in_business": <number or null>,
  "existing_positions": <number>,
  "buy_rate": <our internal factor rate>,
  "sell_rate": 1.499,
  "term_days": <number of days — max 120 standard, 60 trucking, 90 construction>,
  "approved_amount": <number or null>,
  "max_daily_payment": <number or null>,
  "merchant_payback": <approved_amount x sell_rate>,
  "our_payback": <approved_amount x buy_rate>,
  "our_profit": <merchant_payback minus our_payback>,
  "flags": [<array of risk flag strings>],
  "conditions": [<array of approval condition strings>],
  "summary": "<one sentence summary>"
}`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = response.content[0].text.trim()
    const clean = text.replace(/```json\n?|\n?```/g, '').trim()
    const analysis = JSON.parse(clean)

    // Auto decline prohibited industries
    if (analysis.is_prohibited_industry) {
      analysis.decision = 'decline'
      analysis.decline_reason = `Prohibited industry: ${analysis.industry}`
      analysis.risk_score = 0
    }

    // Auto decline first position
    if (analysis.position === 'first') {
      analysis.decision = 'decline'
      analysis.decline_reason = 'First position only — we fund second position and up'
      analysis.risk_score = Math.min(analysis.risk_score, 30)
    }

    const approved = analysis.decision === 'approve' && analysis.risk_score >= 50
    const newStatus = approved ? 'offered' : 'declined'

    // Convert term days to months for display
    const termMonths = analysis.term_days ? Math.round(analysis.term_days / 30) : null

    // Update deal with results
    await supabase.from('deals').update({
      status:            newStatus,
      risk_score:        analysis.risk_score,
      avg_daily_balance: analysis.avg_daily_balance,
      monthly_revenue:   analysis.avg_monthly_revenue,
      positions:         analysis.existing_positions || 0,
      amount_approved:   analysis.approved_amount,
      factor_rate:       analysis.buy_rate,
      term_months:       termMonths,
      updated_at:        new Date().toISOString()
    }).eq('id', dealId)

    // Main scrub note
    const noteBody = approved
      ? `AI Scrub APPROVED — Risk: ${analysis.risk_score}/100 | Industry: ${analysis.industry} | Offer: $${analysis.approved_amount?.toLocaleString()} | Buy rate: ${analysis.buy_rate}x | Sell rate: 1.499x | Term: ${analysis.term_days} days | Our profit: $${analysis.our_profit?.toLocaleString()} | ${analysis.summary}`
      : `AI Scrub DECLINED — Risk: ${analysis.risk_score}/100 | Industry: ${analysis.industry} | Reason: ${analysis.decline_reason} | ${analysis.summary}`

    await supabase.from('deal_notes').insert({
      deal_id:  dealId,
      author:   'AI Scrubber',
      category: approved ? 'approval' : 'risk',
      body:     noteBody
    })

    // Add flags
    for (const flag of (analysis.flags || [])) {
      await supabase.from('deal_notes').insert({
        deal_id:  dealId,
        author:   'AI Scrubber',
        category: 'risk',
        body:     flag
      })
    }

    // Add conditions
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
      dealNumber:    deal.deal_number,
      approved,
      riskScore:     analysis.risk_score,
      decision:      analysis.decision,
      declineReason: analysis.decline_reason,
      industry:      analysis.industry,
      approvedAmount: analysis.approved_amount,
      buyRate:       analysis.buy_rate,
      sellRate:      1.499,
      termDays:      analysis.term_days,
      maxDailyPayment: analysis.max_daily_payment,
      merchantPayback: analysis.merchant_payback,
      ourProfit:     analysis.our_profit,
      flags:         analysis.flags,
      conditions:    analysis.conditions,
      summary:       analysis.summary
    })

  } catch (err) {
    console.error('Scrubber error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
