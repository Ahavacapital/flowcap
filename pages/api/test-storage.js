export default async function handler(req, res) {
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Test 1 - check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    if (bucketsError) return res.json({ step: 'list buckets', error: bucketsError.message })

    const bucketNames = buckets.map(b => b.name)

    // Test 2 - try uploading a simple text file
    const testContent = Buffer.from('test file ' + Date.now())
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('deal-documents')
      .upload('test/test-' + Date.now() + '.txt', testContent, {
        contentType: 'text/plain',
        upsert: true
      })

    if (uploadError) {
      return res.json({
        step: 'upload test',
        error: uploadError.message,
        buckets: bucketNames,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'MISSING',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set (length: ' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ')' : 'MISSING'
      })
    }

    return res.json({
      success: true,
      uploadPath: uploadData.path,
      buckets: bucketNames,
      message: 'Storage is working!'
    })

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
