export default async function handler(req, res) {
  const { dealId } = req.query
  if (!dealId) return res.status(400).json({ error: 'dealId required' })
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Get all documents for this deal
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Generate signed download URLs for each doc
    const docsWithUrls = await Promise.all((documents || []).map(async doc => {
      try {
        const { data: urlData } = await supabase.storage
          .from('deal-documents')
          .createSignedUrl(doc.storage_path, 3600) // 1 hour expiry
        return { ...doc, url: urlData?.signedUrl || null }
      } catch (e) {
        return { ...doc, url: null }
      }
    }))

    return res.status(200).json({ documents: docsWithUrls })
  } catch (err) {
    console.error('Documents error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
