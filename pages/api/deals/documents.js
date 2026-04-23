export default async function handler(req, res) {
  try {
    const id = req && req.query ? req.query.dealId : null
    if (!id) return res.status(400).json({ error: 'dealId required' })
    const { createClient } = require('@supabase/supabase-js')
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const { data: docs } = await sb.from('documents').select('*').eq('deal_id', id).order('created_at', { ascending: false })
    const out = await Promise.all((docs || []).map(async d => {
      try {
        const { data: u } = await sb.storage.from('deal-documents').createSignedUrl(d.storage_path, 3600)
        return { ...d, url: u?.signedUrl || null }
      } catch (e2) { return { ...d, url: null } }
    }))
    return res.status(200).json({ documents: out })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
