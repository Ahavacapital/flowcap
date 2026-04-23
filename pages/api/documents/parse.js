export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const dealId = (req.body || {}).dealId
  if (!dealId) return res.status(400).json({ error: 'dealId required' })

  const { createClient } = require('@supabase/supabase-js')
  const Anthropic = require('@anthropic-ai/sdk')
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const anthropic = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })

  const hold = async (reason) => {
    await supabase.from('deals').update({ status: 'pending', updated_at: new Date().toISOString() }).eq('id', dealId)
    await supabase.from('deal_notes').insert({ deal_id: dealId, author: 'Document Parser', category: 'system', body: 'HOLD — ' + reason })
    return res.json({ success: false, status: 'pending', reason })
  }

  try {
    const { data: deal } = await supabase.from('deals').select('*').eq('id', dealId).single()
    if (!deal) return res.status(404).json({ error: 'Deal not found' })

    // Get bank statement docs
    const { data: docs } = await supabase
      .from('documents').select('*')
      .eq('deal_id', dealId).eq('doc_type', 'bank_statement')
      .order('created_at', { ascending: false }).limit(3)

    if (!docs || docs.length === 0) {
      return await hold('No bank statements attached — broker needs to resubmit with statements')
    }

    // Download PDFs
    const pdfsToAnalyze = []
    for (const doc of docs) {
      try {
        const { data: fileData, error: dlErr } = await supabase.storage.from('deal-documents').download(doc.storage_path)
        if (dlErr || !fileData) {
          console.error('Download error for', doc.name, dlErr?.message)
          continue
        }
        const arrayBuffer = await fileData.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        if (base64.length > 5000000) {
          console.log('File too large, skipping:', doc.name, Math.round(base64.length/1000)+'kb')
          continue
        }
        pdfsToAnalyze.push({ name: doc.name, base64 })
      } catch (e) {
        console.error('Error downloading', doc.name, e.message)
      }
    }

    if (pdfsToAnalyze.length === 0) {
      return await hold('Bank statements could not be downloaded — files may be corrupted or too large (max 4MB each)')
    }

    // Build Claude message
    const messageContent = []
    for (const pdf of pdfsToAnalyze) {
      messageContent.push({ type: 'text', text: 'Bank statement file: ' + pdf.name })
      messageContent.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdf.base64 } })
    }
    messageContent.push({
      type: 'text',
      text: `Analyze these bank statements for ${deal.business_name}.

RESPOND WITH ONLY A JSON OBJECT. NO OTHER TEXT BEFORE OR AFTER. START WITH { END WITH }.

{"months_analyzed":3,"avg_monthly_revenue":50000,"avg_daily_balance":5000,"negative_days_per_month":0,"nsf_count_per_month":0,"detected_mca_payments":[{"company":"ABC Funding","amount":500,"frequency":"daily"}],"estimated_positions":1,"months_in_business":24,"revenue_trend":"stable","flags":[],"confidence":"high","notes":"brief summary"}`
    })

    let rawText = ''
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: 'You are a JSON-only financial data extraction API. Respond ONLY with a valid JSON object. No explanations, no markdown, no text outside the JSON object.',
        messages: [{ role: 'user', content: messageContent }]
      })
      rawText = response.content[0].text.trim()
      console.log('Parser response preview for', deal.deal_number, ':', rawText.slice(0, 120))
    } catch (apiErr) {
      return await hold('Claude API error: ' + apiErr.message.slice(0, 100))
    }

    // Extract JSON from response
    rawText = rawText.replace(/```json\n?|\n?```/g, '').trim()
    const jsonStart = rawText.indexOf('{')
    const jsonEnd = rawText.lastIndexOf('}')

    if (jsonStart === -1 || jsonEnd === -1) {
      return await hold('Could not extract financial data from statements — response was: ' + rawText.slice(0, 80))
    }

    let extracted
    try {
      extracted = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1))
    } catch (parseErr) {
      return await hold('Invalid JSON in parser response — ' + parseErr.message.slice(0, 80))
    }

    // Validate we got meaningful data
    if (!extracted.avg_monthly_revenue && !extracted.avg_daily_balance) {
      return await hold('Parser could not extract revenue or balance data from statements — may need manual review')
    }

    // Save financial data to deal
    const updates = { updated_at: new Date().toISOString() }
    if (extracted.avg_monthly_revenue) updates.monthly_revenue = extracted.avg_monthly_revenue
    if (extracted.avg_daily_balance) updates.avg_daily_balance = extracted.avg_daily_balance
    if (extracted.estimated_positions != null) updates.positions = extracted.estimated_positions
    await supabase.from('deals').update(updates).eq('id', dealId)

    // Save full analysis note
    const noteBody = [
      'Bank statement analysis (' + extracted.months_analyzed + ' months analyzed | Confidence: ' + extracted.confidence + ')',
      'Avg monthly revenue: $' + Number(extracted.avg_monthly_revenue||0).toLocaleString(),
      'Avg daily balance: $' + Number(extracted.avg_daily_balance||0).toLocaleString(),
      'Negative days/month: ' + (extracted.negative_days_per_month||0),
      'NSFs/month: ' + (extracted.nsf_count_per_month||0),
      'Estimated positions: ' + (extracted.estimated_positions||0),
      extracted.detected_mca_payments?.length > 0 ? 'Detected MCA payments: ' + extracted.detected_mca_payments.map(p => p.company + ' $' + p.amount + '/' + p.frequency).join(', ') : 'No recurring MCA payments detected',
      'Revenue trend: ' + (extracted.revenue_trend||'unknown'),
      extracted.flags?.length > 0 ? 'Flags: ' + extracted.flags.join(' | ') : '',
      extracted.notes || ''
    ].filter(Boolean).join('\n')

    await supabase.from('deal_notes').insert({
      deal_id: dealId, author: 'Document Parser', category: 'system', body: noteBody
    })

    return res.json({ success: true, dealId, docsAnalyzed: pdfsToAnalyze.length, extracted, updatedDeal: updates })

  } catch (err) {
    console.error('Document parser critical error for', dealId, err.message)
    // Put deal on hold instead of crashing
    try {
      const { createClient } = require('@supabase/supabase-js')
      const supabase2 = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
      await supabase2.from('deals').update({ status: 'pending', updated_at: new Date().toISOString() }).eq('id', dealId)
      await supabase2.from('deal_notes').insert({ deal_id: dealId, author: 'Document Parser', category: 'system', body: 'HOLD — Unexpected error: ' + err.message.slice(0, 100) })
    } catch (e2) {}
    return res.status(500).json({ error: err.message, status: 'pending' })
  }
}
