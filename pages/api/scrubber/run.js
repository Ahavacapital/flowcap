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
    const anthropic = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('*, deal_notes(*)')
      .eq('id', dealId)
      .single()
    if (dealError || !deal) return res.status(404).json({ error: 'Deal not found' })
    await supabase.from('deals').update({ status: 'scrubbing' }).eq('id', dealId)
    const parserNote = (deal.deal_notes || []).find(n => n.author === 'Document Parser')
    const dataStr = [
      'Business: ' + deal.business_name,
      'Amount Requested: ' + (deal.amount_requested ? '$' + deal.amount_requested : 'Unknown'),
      'Monthly Revenue: ' + (deal.monthly_revenue ? '$' + deal.monthly_revenue : 'Unknown'),
      'Avg Daily Balance: ' + (deal.avg_daily_balance ? '$' + deal.avg_daily_balance : 'Unknown'),
      'Positions: ' + (deal.positions || 0),
      'NY Courts: ' + (deal.ny_court_result || 'unknown'),
      'DataMerch: ' + (deal.datamerch_result || 'unknown'),
      parserNote ? 'Bank Statement Data:\n' + parserNote.body : '',
      deal.notes ? 'Notes: ' + deal.notes : ''
    ].filter(Boolean).join('\n')
    const prompt = `You are an MCA underwriter. Analyze this deal and return JSON only.

GUIDELINES:
- Second position and up ONLY - no first positions (auto decline)
- Min avg monthly revenue: $35,000
- Min avg daily balance: $1,000
- Max negative days: 7/month
- Min 6 months in business
- Max cash withhold: 40% of monthly revenue
- No adult entertainment
- Trucking: max 60 day term
- Construction: max 90 day term
- All others: max 120 day term
- Sell rate ALWAYS 1.499x
- Buy rates: 80-100 risk=1.20-1.22x, 65-79=1.29-1.35x, 50-64=1.38-1.45x, below 50=decline

DEAL DATA:
${dataStr}

Return ONLY valid JSON:
{
  "risk_score": 0-100,
  "decision": "approve" or "decline",
  "decline_reason": null or string,
  "industry": string,
  "position": "first" or "second_plus" or "unknown",
  "avg_monthly_revenue": number or null,
  "avg_daily_balance": number or null,
  "negative_days_per_month": number or null,
  "existing_positions": number,
  "buy_rate": number or null,
  "term_days": number or null,
  "approved_amount": number or null,
  "merchant_payback": number or null,
  "our_profit": number or null,
  "flags": [],
  "conditions": [],
  "summary": string
}`
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
    const text = response.content[0].text.trim().replace(/```json\n?|\n?```/g, '').trim()
    const analysis = JSON.parse(text)
    if (analysis.position === 'first') {
      analysis.decision = 'decline'
      analysis.decline_reason = 'First position only - we fund second position and up'
      analysis.risk_score = Math.min(analysis.risk_score || 0, 25)
      analysis.approved_amount = null
    }
    const approved = analysis.decision === 'approve' && (analysis.risk_score || 0) >= 50
    const newStatus = approved ? 'offered' : 'declined'
    const termMonths = analysis.term_days ? Math.ceil(analysis.term_days / 30) : null
    const updates = { status: newStatus, risk_score: analysis.risk_score, updated_at: new Date().toISOString() }
    if (analysis.avg_monthly_revenue) updates.monthly_revenue = analysis.avg_monthly_revenue
    if (analysis.avg_daily_balance) updates.avg_daily_balance = analysis.avg_daily_balance
    if (analysis.existing_positions != null) updates.positions = analysis.existing_positions
    if (analysis.approved_amount) updates.amount_approved = analysis.approved_amount
    if (analysis.buy_rate) updates.factor_rate = analysis.buy_rate
    if (termMonths) updates.term_months = termMonths
    await supabase.from('deals').update(updates).eq('id', dealId)
    const noteBody = [
      approved ? 'APPROVED - Risk: ' + analysis.risk_score + '/100' : 'DECLINED - Risk: ' + analysis.risk_score + '/100',
      approved ? 'Offer: $' + (analysis.approved_amount||0).toLocaleString() + ' | Buy: ' + analysis.buy_rate + 'x | Sell: 1.499x | Term: ' + analysis.term_days + ' days' : '',
      approved ? 'Profit: $' + (analysis.our_profit||0).toLocaleString() + ' | Payback: $' + (analysis.merchant_payback||0).toLocaleString() : '',
      !approved ? 'Reason: ' + analysis.decline_reason : '',
      'Industry: ' + (analysis.industry || 'Unknown'),
      analysis.summary
    ].filter(Boolean).join('\n')
    await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: approved ? 'approval' : 'risk', body: noteBody })
    for (const flag of (analysis.flags || [])) {
      await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'risk', body: flag })
    }
    for (const cond of (analysis.conditions || [])) {
      await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'condition', body: cond })
    }
    return res.status(200).json({
      dealId, dealNumber: deal.deal_number, approved,
      riskScore: analysis.risk_score, decision: analysis.decision,
      declineReason: analysis.decline_reason, industry: analysis.industry,
      approvedAmount: analysis.approved_amount, buyRate: analysis.buy_rate,
      sellRate: 1.499, termDays: analysis.term_days,
      ourProfit: analysis.our_profit, merchantPayback: analysis.merchant_payback,
      flags: analysis.flags, conditions: analysis.conditions, summary: analysis.summary
    })
  } catch (err) {
    console.error('Scrubber error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
