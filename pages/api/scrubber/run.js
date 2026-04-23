export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const dealId = (req.body || {}).dealId
    if (!dealId) return res.status(400).json({ error: 'dealId required' })

    const { createClient } = require('@supabase/supabase-js')
    const Anthropic = require('@anthropic-ai/sdk')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const anthropic = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })
    const appUrl = process.env.NEXTAUTH_URL || 'https://flowcap-mca.vercel.app'

    let { data: deal } = await supabase.from('deals').select('*, deal_notes(*)').eq('id', dealId).single()
    if (!deal) return res.status(404).json({ error: 'Deal not found' })

    await supabase.from('deals').update({ status: 'scrubbing' }).eq('id', dealId)

    // STEP 1: Run parser first if we have docs but no financial data
    const hasFinancialData = !!(deal.monthly_revenue || deal.avg_daily_balance)
    if (!hasFinancialData) {
      const { count: docCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('deal_id', dealId)
        .eq('doc_type', 'bank_statement')

      if (docCount > 0) {
        try {
          const parseRes = await fetch(appUrl + '/api/documents/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dealId })
          })
          const parseData = await parseRes.json()
          console.log('Parser result for', deal.deal_number, ':', parseData.success ? 'success revenue=$'+(parseData.extracted?.avg_monthly_revenue||0) : 'failed')
        } catch (e) { console.error('Parser failed:', e.message) }
      }
    }

    // STEP 2: Always reload fresh data from DB after parser runs
    const { data: freshDeal } = await supabase.from('deals').select('*, deal_notes(*)').eq('id', dealId).single()
    if (freshDeal) deal = freshDeal

    const parserNote = (deal.deal_notes || []).find(n => n.author === 'Document Parser' && n.body?.includes('Bank statement analysis'))
    const hasRealData = !!(parserNote || deal.monthly_revenue || deal.avg_daily_balance)

    // No bank data - check if it's missing docs or just failed parsing
    if (!hasRealData) {
      const { count: docCount } = await supabase
        .from('documents').select('*', { count: 'exact', head: true })
        .eq('deal_id', dealId).eq('doc_type', 'bank_statement')

      if ((docCount || 0) === 0) {
        // No documents at all - underwriting needed
        await supabase.from('deals').update({ status: 'underwriting', updated_at: new Date().toISOString() }).eq('id', dealId)
        await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'system', body: 'Sent to underwriting — no bank statements attached. Contact broker for statements.' })
        return res.json({ dealId, dealNumber: deal.deal_number, decision: 'manual_review', status: 'underwriting' })
      } else {
        // Has docs but parser failed - put on hold
        await supabase.from('deals').update({ status: 'pending', updated_at: new Date().toISOString() }).eq('id', dealId)
        await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'system', body: 'HOLD — Bank statements attached but could not be parsed. Manual review needed.' })
        return res.json({ dealId, dealNumber: deal.deal_number, decision: 'hold', status: 'pending' })
      }
    }

    // STEP 3: Build data string for Claude
    const dataStr = [
      'Business: ' + deal.business_name,
      'Amount Requested: ' + (deal.amount_requested ? '$' + Number(deal.amount_requested).toLocaleString() : 'Unknown'),
      'Monthly Revenue: ' + (deal.monthly_revenue ? '$' + Number(deal.monthly_revenue).toLocaleString() : 'Unknown'),
      'Avg Daily Balance: ' + (deal.avg_daily_balance ? '$' + Number(deal.avg_daily_balance).toLocaleString() : 'Unknown'),
      'Positions: ' + (deal.positions || 0),
      'NY Courts: ' + (deal.ny_court_result || 'unknown'),
      'DataMerch: ' + (deal.datamerch_result || 'unknown'),
      parserNote ? '\nBANK STATEMENT DATA:\n' + parserNote.body : '',
      deal.notes ? '\nNOTES:\n' + deal.notes.slice(0, 500) : ''
    ].filter(Boolean).join('\n')

    const prompt = `You are an MCA underwriter. Analyze this deal and return JSON only.

GUIDELINES:
- Second position and up ONLY - auto decline first positions
- Min avg monthly revenue: $35,000
- Min avg daily balance: $1,000
- Max negative days: 7/month
- Min 6 months in business
- Max cash withhold: 40% of gross monthly revenue
- No adult entertainment
- Trucking: max 60 day term
- Construction: max 90 day term
- All others: max 120 day term
- Sell rate ALWAYS 1.499x
- Buy rates: risk 80-100 = 1.20-1.22x | 65-79 = 1.29-1.35x | 50-64 = 1.38-1.45x | below 50 = decline

POSITION DETECTION:
- Daily debits of similar amounts = likely MCA position
- Weekly debits of similar amounts = likely MCA position
- If positions unclear with low confidence = manual_review

DECISION RULES:
- Only approve or decline if confident
- If uncertain about positions or data = manual_review

ADVANCE AMOUNT:
- Max daily payment = monthly revenue x 40% / 21 business days
- Approved amount = max daily payment x term days
- Round to nearest $1,000

DEAL DATA:
${dataStr}

Return ONLY valid JSON:
{
  "risk_score": <0-100>,
  "decision": <"approve","decline","manual_review">,
  "decline_reason": <string or null>,
  "manual_review_reason": <string or null>,
  "industry": <string>,
  "is_prohibited": <bool>,
  "position": <"first","second","third","fourth_plus","unknown","unclear">,
  "detected_mca_payments": [{"company_name":"","amount":0,"frequency":"daily/weekly"}],
  "estimated_positions": <number>,
  "positions_confidence": <"high","medium","low">,
  "avg_monthly_revenue": <number or null>,
  "avg_daily_balance": <number or null>,
  "negative_days_per_month": <number or null>,
  "buy_rate": <number or null>,
  "term_days": <number or null>,
  "approved_amount": <number or null>,
  "merchant_payback": <number or null>,
  "our_profit": <number or null>,
  "flags": [],
  "conditions": [],
  "summary": "<2 sentence summary>"
}`

    let response
    try {
      response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })

    } catch (apiErr) {
      console.error('Claude API error for', deal.deal_number, apiErr.message)
      await supabase.from('deals').update({ status: 'pending', updated_at: new Date().toISOString() }).eq('id', dealId)
      await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'system', body: 'HOLD — Claude API error: ' + apiErr.message.slice(0, 100) })
      return res.json({ dealId, status: 'pending', error: apiErr.message })
    }

    let rawResponse = response.content[0].text.trim().replace(/```json\n?|\n?```/g, '').trim()
    // Extract JSON if there's text around it
    const jStart = rawResponse.indexOf('{')
    const jEnd = rawResponse.lastIndexOf('}')
    if (jStart >= 0 && jEnd >= 0) rawResponse = rawResponse.slice(jStart, jEnd + 1)
    let a
    try {
      a = JSON.parse(rawResponse)
    } catch (parseErr) {
      await supabase.from('deals').update({ status: 'pending', updated_at: new Date().toISOString() }).eq('id', dealId)
      await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'system', body: 'HOLD — Could not parse scrubber response. Manual review needed.' })
      return res.json({ dealId, status: 'pending', error: 'JSON parse failed' })
    }

    // Auto decline prohibited or first position
    if (a.is_prohibited) { a.decision = 'decline'; a.decline_reason = 'Prohibited industry: ' + a.industry; a.approved_amount = null }
    if (a.position === 'first') { a.decision = 'decline'; a.decline_reason = 'First position - we fund second position and up only'; a.approved_amount = null }

    // Low confidence positions = manual review
    if ((a.position === 'unclear' || a.positions_confidence === 'low') && a.decision !== 'decline') {
      a.decision = 'manual_review'
      a.manual_review_reason = 'Position count unclear - manual review needed. ' + (a.manual_review_reason || '')
    }

    // Determine final status
    let newStatus
    if (a.decision === 'approve' && (a.risk_score || 0) >= 50) newStatus = 'offered'
    else if (a.decision === 'decline') newStatus = 'declined'
    else newStatus = 'underwriting'

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
        a.detected_mca_payments?.length > 0 ? 'Detected recurring debits: ' + a.detected_mca_payments.map(p => p.company_name + ' $' + p.amount + '/' + p.frequency).join(', ') : '',
        'Position confidence: ' + a.positions_confidence,
        a.summary
      ].filter(Boolean).join('\n')
    }

    await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: newStatus === 'offered' ? 'approval' : newStatus === 'declined' ? 'risk' : 'system', body: noteBody })

    if (a.detected_mca_payments?.length > 0) {
      await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'risk', body: 'Possible MCA positions detected:\n' + a.detected_mca_payments.map((p,i) => (i+1) + '. ' + (p.company_name||'Unknown') + ' - $' + (p.amount||'?') + '/' + (p.frequency||'unknown')).join('\n') })
    }
    for (const flag of (a.flags || [])) await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'risk', body: flag })
    for (const cond of (a.conditions || [])) await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'AI Scrubber', category: 'condition', body: cond })

    return res.status(200).json({
      dealId, dealNumber: deal.deal_number, approved: newStatus === 'offered',
      decision: a.decision, status: newStatus, riskScore: a.risk_score,
      declineReason: a.decline_reason, manualReviewReason: a.manual_review_reason,
      industry: a.industry, estimatedPositions: a.estimated_positions,
      positionsConfidence: a.positions_confidence, detectedMcaPayments: a.detected_mca_payments,
      approvedAmount: a.approved_amount, buyRate: a.buy_rate, sellRate: 1.499,
      termDays: a.term_days, ourProfit: a.our_profit, merchantPayback: a.merchant_payback,
      flags: a.flags, conditions: a.conditions, summary: a.summary
    })

  } catch (err) {
    console.error('Scrubber error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
