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

    const { data: deal } = await supabase
      .from('deals')
      .select('*, deal_notes(*)')
      .eq('id', dealId)
      .single()

    if (!deal) return res.status(404).json({ error: 'Deal not found' })

    await supabase.from('deals').update({ status: 'scrubbing' }).eq('id', dealId)

    // Check if we have real bank statement data from document parser
    const parserNote = (deal.deal_notes || []).find(n =>
      n.author === 'Document Parser' && n.body?.includes('Bank statement analysis')
    )
    const hasRealData = !!(parserNote || deal.monthly_revenue || deal.avg_daily_balance)

    // If no bank data at all - send to manual underwriting
    if (!hasRealData) {
      await supabase.from('deals').update({ status: 'underwriting' }).eq('id', dealId)
      await supabase.from('deal_notes').insert({
        deal_id: dealId,
        author: 'AI Scrubber',
        category: 'system',
        body: 'No bank statements found - sent to manual underwriting. Please review attachments and enter financial data manually.'
      })
      return res.json({
        dealId, dealNumber: deal.deal_number,
        approved: null, decision: 'manual_review',
        reason: 'No bank statements available - manual underwriting required',
        status: 'underwriting'
      })
    }

    const dataStr = [
      'Business: ' + deal.business_name,
      'Amount Requested: ' + (deal.amount_requested ? '$' + Number(deal.amount_requested).toLocaleString() : 'Unknown'),
      'Monthly Revenue (from statements): ' + (deal.monthly_revenue ? '$' + Number(deal.monthly_revenue).toLocaleString() : 'Unknown'),
      'Avg Daily Balance: ' + (deal.avg_daily_balance ? '$' + Number(deal.avg_daily_balance).toLocaleString() : 'Unknown'),
      'Known Positions: ' + (deal.positions || 0),
      'NY Courts: ' + (deal.ny_court_result || 'unknown'),
      'DataMerch: ' + (deal.datamerch_result || 'unknown'),
      parserNote ? '\nBANK STATEMENT ANALYSIS:\n' + parserNote.body : '',
      deal.notes ? '\nSUBMISSION NOTES:\n' + deal.notes.slice(0, 500) : ''
    ].filter(Boolean).join('\n')

    const prompt = `You are an experienced MCA underwriter. Analyze this deal carefully.

UNDERWRITING GUIDELINES:
- We fund SECOND POSITION AND UP ONLY — auto decline first positions
- Min avg monthly revenue: $35,000 (3 month average)
- Min avg daily balance: $1,000
- Max negative days: 7 per month
- Min 6 months in business
- Max cash withhold: 40% of gross monthly revenue
- No adult entertainment industries
- Trucking: max 60 day term
- Construction: max 90 day term  
- All others: max 120 day term
- Sell rate: ALWAYS 1.499x fixed
- Buy rates: risk 80-100 = 1.20-1.22x | risk 65-79 = 1.29-1.35x | risk 50-64 = 1.38-1.45x | below 50 = decline

POSITION DETECTION - VERY IMPORTANT:
Look for recurring ACH debits in the bank statements that suggest existing MCA positions:
- Daily debits of similar amounts (within 10-15% variance) = likely MCA position
- Weekly debits of similar amounts = likely MCA position  
- Multiple recurring debit companies = multiple positions
- If you see 3+ suspicious recurring debits, flag for manual review
- If positions are UNCLEAR from the data, set needs_manual_review to true

DECISION RULES:
- If data is insufficient to make accurate decision = set decision to "manual_review"
- If position count is unclear or suspicious = set decision to "manual_review"
- Only set "approve" or "decline" if you have enough data to be confident
- When in doubt = manual_review

ADVANCE AMOUNT:
- Max daily ACH = monthly revenue x 40% / 21 business days
- Approved amount = max daily ACH x business days in term
- Round to nearest $1,000

DEAL DATA:
${dataStr}

Return ONLY valid JSON no markdown:
{
  "risk_score": <0-100 or null if insufficient data>,
  "decision": <"approve", "decline", or "manual_review">,
  "decline_reason": <string or null>,
  "manual_review_reason": <string or null - explain what needs manual review>,
  "industry": <detected industry>,
  "is_prohibited": <true or false>,
  "position": <"first", "second", "third", "fourth_plus", "unknown", or "unclear">,
  "detected_mca_payments": [<list of detected recurring ACH debits that look like MCA payments, with company name and amount>],
  "estimated_positions": <number - your best estimate>,
  "positions_confidence": <"high", "medium", "low">,
  "avg_monthly_revenue": <number or null>,
  "avg_daily_balance": <number or null>,
  "negative_days_per_month": <number or null>,
  "months_in_business": <number or null>,
  "buy_rate": <number or null>,
  "term_days": <number or null>,
  "approved_amount": <number or null>,
  "merchant_payback": <number or null>,
  "our_profit": <number or null>,
  "flags": [<risk flags>],
  "conditions": [<approval conditions>],
  "summary": "<clear 2 sentence summary>"
}`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = response.content[0].text.trim().replace(/```json\n?|\n?```/g, '').trim()
    const a = JSON.parse(text)

    // Auto decline prohibited industries
    if (a.is_prohibited) {
      a.decision = 'decline'
      a.decline_reason = 'Prohibited industry: ' + a.industry
      a.approved_amount = null
    }

    // Auto decline first position
    if (a.position === 'first') {
      a.decision = 'decline'
      a.decline_reason = 'First position - we fund second position and up only'
      a.approved_amount = null
    }

    // If positions unclear with low confidence - send to manual review
    if ((a.position === 'unclear' || a.positions_confidence === 'low') && a.decision !== 'decline') {
      a.decision = 'manual_review'
      a.manual_review_reason = (a.manual_review_reason || '') + ' Position count unclear - manual review needed.'
    }

    // Determine final status
    let newStatus
    if (a.decision === 'approve' && (a.risk_score || 0) >= 50) {
      newStatus = 'offered'
    } else if (a.decision === 'decline') {
      newStatus = 'declined'
    } else {
      // manual_review or anything else
      newStatus = 'underwriting'
    }

    const termMonths = a.term_days ? Math.ceil(a.term_days / 30) : null
    const updates = { status: newStatus, updated_at: new Date().toISOString() }
    if (a.risk_score != null) updates.risk_score = a.risk_score
    if (a.avg_monthly_revenue) updates.monthly_revenue = a.avg_monthly_revenue
    if (a.avg_daily_balance) updates.avg_daily_balance = a.avg_daily_balance
    if (a.estimated_positions != null) updates.positions = a.estimated_positions
    if (a.approved_amount) updates.amount_approved = a.approved_amount
    if (a.buy_rate) updates.factor_rate = a.buy_rate
    if (termMonths) updates.term_months = termMonths

    await supabase.from('deals').update(updates).eq('id', dealId)

    // Main scrub note
    let noteBody = ''
    if (newStatus === 'offered') {
      noteBody = [
        'APPROVED - Risk: ' + a.risk_score + '/100',
        'Offer: $' + (a.approved_amount||0).toLocaleString() + ' | Buy: ' + a.buy_rate + 'x | Sell: 1.499x | Term: ' + a.term_days + ' days',
        'Profit: $' + (a.our_profit||0).toLocaleString() + ' | Merchant payback: $' + (a.merchant_payback||0).toLocaleString(),
        'Industry: ' + (a.industry||'Unknown') + ' | Positions: ' + a.estimated_positions + ' (' + a.positions_confidence + ' confidence)',
        a.summary
      ].filter(Boolean).join('\n')
    } else if (newStatus === 'declined') {
      noteBody = [
        'DECLINED - Risk: ' + (a.risk_score||'N/A') + '/100',
        'Reason: ' + a.decline_reason,
        'Industry: ' + (a.industry||'Unknown'),
        a.summary
      ].filter(Boolean).join('\n')
    } else {
      noteBody = [
        'SENT TO MANUAL UNDERWRITING',
        'Reason: ' + (a.manual_review_reason || 'Insufficient data for automated decision'),
        a.detected_mca_payments?.length > 0 ? 'Detected recurring debits (possible positions): ' + a.detected_mca_payments.map(p => p.company_name + ' $' + p.amount).join(', ') : '',
        'Position confidence: ' + a.positions_confidence,
        a.summary
      ].filter(Boolean).join('\n')
    }

    await supabase.from('deal_notes').insert({
      deal_id: dealId, author: 'AI Scrubber',
      category: newStatus === 'offered' ? 'approval' : newStatus === 'declined' ? 'risk' : 'system',
      body: noteBody
    })

    // Add detected MCA payments as individual notes
    if (a.detected_mca_payments?.length > 0) {
      await supabase.from('deal_notes').insert({
        deal_id: dealId, author: 'AI Scrubber', category: 'risk',
        body: 'Detected possible MCA positions from recurring debits:\n' + a.detected_mca_payments.map((p,i) => (i+1) + '. ' + (p.company_name||'Unknown') + ' - $' + (p.amount||'?') + '/day or /week').join('\n')
      })
    }

    // Add individual flags
    for (const flag of (a.flags || [])) {
      await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'risk', body: flag })
    }

    // Add conditions
    for (const cond of (a.conditions || [])) {
      await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'condition', body: cond })
    }

    return res.status(200).json({
      dealId, dealNumber: deal.deal_number,
      approved: newStatus === 'offered',
      decision: a.decision, status: newStatus,
      riskScore: a.risk_score,
      declineReason: a.decline_reason,
      manualReviewReason: a.manual_review_reason,
      industry: a.industry,
      estimatedPositions: a.estimated_positions,
      positionsConfidence: a.positions_confidence,
      detectedMcaPayments: a.detected_mca_payments,
      approvedAmount: a.approved_amount,
      buyRate: a.buy_rate, sellRate: 1.499,
      termDays: a.term_days,
      ourProfit: a.our_profit,
      merchantPayback: a.merchant_payback,
      flags: a.flags, conditions: a.conditions,
      summary: a.summary
    })

  } catch (err) {
    console.error('Scrubber error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
