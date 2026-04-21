export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { dealId } = req.body
    if (!dealId) return res.status(400).json({ error: 'dealId required' })

    const { createClient } = require('@supabase/supabase-js')
    const Anthropic = require('@anthropic-ai/sdk')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const anthropic = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })

    const { data: deal } = await supabase.from('deals').select('*').eq('id', dealId).single()
    if (!deal) return res.status(404).json({ error: 'Deal not found' })

    // Get bank statement documents
    const { data: docs } = await supabase
      .from('documents')
      .select('*')
      .eq('deal_id', dealId)
      .eq('doc_type', 'bank_statement')
      .order('created_at', { ascending: false })
      .limit(4)

    if (!docs || docs.length === 0) {
      return res.json({ success: false, message: 'No bank statements found for this deal', extracted: null })
    }

    // Download PDFs from storage - max 3 to avoid token limits
    const pdfsToAnalyze = []
    for (const doc of docs.slice(0, 3)) {
      try {
        const { data: fileData, error: dlErr } = await supabase.storage
          .from('deal-documents')
          .download(doc.storage_path)
        if (dlErr || !fileData) { console.error('Download error:', dlErr?.message); continue }
        const arrayBuffer = await fileData.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        // Skip files larger than 4MB (too large for Claude)
        if (base64.length > 5000000) { console.log('Skipping large file:', doc.name); continue }
        pdfsToAnalyze.push({ name: doc.name, base64 })
      } catch (e) { console.error('Error processing doc:', doc.name, e.message) }
    }

    if (pdfsToAnalyze.length === 0) {
      return res.json({ success: false, message: 'Could not download bank statements', extracted: null })
    }

    // Build message with PDFs - send one at a time if multiple
    // Use text extraction approach instead of document type to avoid 400 errors
    const messageContent = []

    for (const pdf of pdfsToAnalyze) {
      messageContent.push({
        type: 'text',
        text: 'Bank statement file: ' + pdf.name
      })
      messageContent.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: pdf.base64
        }
      })
    }

    messageContent.push({
      type: 'text',
      text: `You are an MCA underwriter analyzing bank statements for ${deal.business_name}.

Extract financial data from these bank statements. Use only the most recent 3-4 months of data.

IMPORTANT: Look carefully for recurring daily or weekly ACH debits of similar amounts - these indicate existing MCA positions.

Return ONLY valid JSON, no markdown:
{
  "months_analyzed": <number>,
  "avg_monthly_revenue": <number>,
  "avg_daily_balance": <number>,
  "negative_days_per_month": <number>,
  "nsf_count_per_month": <number>,
  "detected_mca_payments": [{"company": "name", "amount": 000, "frequency": "daily/weekly"}],
  "estimated_positions": <number>,
  "months_in_business": <number or null>,
  "revenue_trend": "increasing/decreasing/stable",
  "flags": [],
  "confidence": "high/medium/low",
  "notes": "brief summary"
}`
    })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: messageContent }]
    })

    const text = response.content[0].text.trim().replace(/```json\n?|\n?```/g, '').trim()
    const extracted = JSON.parse(text)

    // Update deal with extracted data
    const updates = { updated_at: new Date().toISOString() }
    if (extracted.avg_monthly_revenue) updates.monthly_revenue = extracted.avg_monthly_revenue
    if (extracted.avg_daily_balance) updates.avg_daily_balance = extracted.avg_daily_balance
    if (extracted.estimated_positions != null) updates.positions = extracted.estimated_positions
    await supabase.from('deals').update(updates).eq('id', dealId)

    // Save analysis as a note
    const noteBody = [
      'Bank statement analysis (' + extracted.months_analyzed + ' months | Confidence: ' + extracted.confidence + ')',
      'Avg monthly revenue: $' + Number(extracted.avg_monthly_revenue||0).toLocaleString(),
      'Avg daily balance: $' + Number(extracted.avg_daily_balance||0).toLocaleString(),
      'Negative days/month: ' + (extracted.negative_days_per_month||0),
      'NSFs/month: ' + (extracted.nsf_count_per_month||0),
      'Estimated positions: ' + (extracted.estimated_positions||0),
      extracted.detected_mca_payments?.length > 0 ? 'Detected MCA payments: ' + extracted.detected_mca_payments.map(p=>p.company+' $'+p.amount+'/'+p.frequency).join(', ') : '',
      'Revenue trend: ' + (extracted.revenue_trend||'unknown'),
      extracted.flags?.length > 0 ? 'Flags: ' + extracted.flags.join(', ') : '',
      extracted.notes || ''
    ].filter(Boolean).join('\n')

    await supabase.from('deal_notes').insert({
      deal_id: dealId, author: 'Document Parser',
      category: 'system', body: noteBody
    })

    return res.json({ success: true, dealId, docsAnalyzed: pdfsToAnalyze.length, extracted, updatedDeal: updates })

  } catch (err) {
    console.error('Document parser error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
