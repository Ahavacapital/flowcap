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

    // Get all documents for this deal
    const { data: docs } = await supabase
      .from('documents')
      .select('*')
      .eq('deal_id', dealId)
      .in('doc_type', ['bank_statement', 'other'])
      .order('created_at', { ascending: false })

    if (!docs || docs.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No bank statements found for this deal',
        extracted: null
      })
    }

    // Get the deal info
    const { data: deal } = await supabase
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .single()

    // Download and process each document
    const documentContents = []

    for (const doc of docs.slice(0, 5)) { // Max 5 docs to avoid token limits
      try {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('deal-documents')
          .download(doc.storage_path)

        if (downloadError || !fileData) continue

        // Convert to base64
        const arrayBuffer = await fileData.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const mimeType = doc.mime_type || 'application/pdf'

        documentContents.push({
          name: doc.name,
          base64,
          mimeType,
          docType: doc.doc_type
        })
      } catch (err) {
        console.error('Error downloading doc:', doc.name, err.message)
      }
    }

    if (documentContents.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'Could not download documents',
        extracted: null
      })
    }

    // Build message content with all documents
    const messageContent = []

    for (const doc of documentContents) {
      messageContent.push({
        type: 'text',
        text: 'Document: ' + doc.name
      })

      if (doc.mimeType === 'application/pdf' || doc.mimeType === 'application/octet-stream') {
        messageContent.push({
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: doc.base64
          }
        })
      } else if (doc.mimeType.startsWith('image/')) {
        messageContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: doc.mimeType,
            data: doc.base64
          }
        })
      }
    }

    messageContent.push({
      type: 'text',
      text: `You are an expert MCA underwriter analyzing bank statements for ${deal.business_name}.

Extract ALL of the following financial data from these bank statements. Be precise and thorough.

IMPORTANT INSTRUCTIONS:
- Look at ALL months provided and calculate averages
- Count negative balance days carefully - these are days where the ending balance was below $0
- Count NSF/returned items carefully
- Look for any existing MCA/loan payments (ACH debits that repeat regularly - these indicate existing positions)
- Time in business = how long the account has been open OR earliest transaction date
- Be conservative - if unsure, note the uncertainty

Return ONLY valid JSON, no markdown, no explanation:
{
  "months_analyzed": <number of months of statements provided>,
  "monthly_revenues": [<array of monthly deposit totals, most recent first>],
  "avg_monthly_revenue": <average of all months>,
  "avg_daily_balance": <average ending daily balance across all months>,
  "lowest_daily_balance": <lowest single day balance seen>,
  "negative_days_per_month": <average number of days per month with negative balance>,
  "nsf_count_per_month": <average NSFs/returned items per month>,
  "existing_mca_payments": [<array of recurring ACH debits that appear to be MCA/loan payments, with amounts>],
  "estimated_positions": <number of estimated existing MCA positions based on recurring debits>,
  "account_open_date": "<earliest date seen in statements or 'unknown'>",
  "months_in_business": <estimated months in business>,
  "revenue_trend": <"increasing", "decreasing", or "stable">,
  "revenue_consistency": <"consistent", "moderate_variation", or "high_variation">,
  "large_deposits": [<any unusually large one-time deposits that should be excluded>],
  "flags": [<array of risk concerns found in the statements>],
  "notes": "<any important observations about the statements>",
  "confidence": <"high", "medium", or "low" - how confident you are in the extraction>
}`
    })

    // Call Claude to analyze the documents
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: messageContent
      }]
    })

    const text = response.content[0].text.trim()
    const clean = text.replace(/```json\n?|\n?```/g, '').trim()
    const extracted = JSON.parse(clean)

    // Save extracted data to the deal
    const updates = {}
    if (extracted.avg_monthly_revenue) updates.monthly_revenue = extracted.avg_monthly_revenue
    if (extracted.avg_daily_balance) updates.avg_daily_balance = extracted.avg_daily_balance
    if (extracted.estimated_positions !== undefined) updates.positions = extracted.estimated_positions
    updates.updated_at = new Date().toISOString()

    await supabase.from('deals').update(updates).eq('id', dealId)

    // Save a note with the extraction results
    const noteBody = [
      'Bank statement analysis complete (' + extracted.months_analyzed + ' months)',
      'Avg monthly revenue: $' + (extracted.avg_monthly_revenue || 0).toLocaleString(),
      'Avg daily balance: $' + (extracted.avg_daily_balance || 0).toLocaleString(),
      'Negative days/month: ' + (extracted.negative_days_per_month || 0),
      'NSFs/month: ' + (extracted.nsf_count_per_month || 0),
      'Estimated positions: ' + (extracted.estimated_positions || 0),
      'Revenue trend: ' + (extracted.revenue_trend || 'unknown'),
      'Confidence: ' + (extracted.confidence || 'unknown'),
      extracted.flags?.length > 0 ? 'Flags: ' + extracted.flags.join(', ') : '',
      extracted.notes ? 'Notes: ' + extracted.notes : ''
    ].filter(Boolean).join('\n')

    await supabase.from('deal_notes').insert({
      deal_id: dealId,
      author: 'Document Parser',
      category: 'system',
      body: noteBody
    })

    return res.status(200).json({
      success: true,
      dealId,
      docsAnalyzed: documentContents.length,
      extracted,
      updatedDeal: updates
    })

  } catch (err) {
    console.error('Document parser error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
