// lib/supabase.js
// Supabase client — use supabaseAdmin on the server (has full access)
// use supabase (anon) only on the client side

import { createClient } from '@supabase/supabase-js'

// Browser-safe client (limited by RLS policies)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Server-only admin client (bypasses RLS — never expose to browser)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ─── DEAL HELPERS ────────────────────────────────────────────

export async function getDeals(filters = {}) {
  let q = supabaseAdmin
    .from('deals')
    .select(`
      *,
      broker:brokers(id, name, contact, email),
      notes:deal_notes(id, category, body, author, created_at),
      documents:documents(id, name, doc_type, created_at),
      contracts:contracts(id, status, docusign_envelope_id, sent_at, signed_at)
    `)
    .order('submitted_at', { ascending: false })

  if (filters.status) q = q.eq('status', filters.status)
  if (filters.broker_id) q = q.eq('broker_id', filters.broker_id)

  const { data, error } = await q
  if (error) throw error
  return data
}

export async function getDeal(id) {
  const { data, error } = await supabaseAdmin
    .from('deals')
    .select(`
      *,
      broker:brokers(*),
      notes:deal_notes(* order created_at asc),
      documents:documents(*),
      contracts:contracts(*),
      history:deal_status_history(* order changed_at asc)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateDealStatus(dealId, newStatus, changedBy = 'system') {
  const { data, error } = await supabaseAdmin
    .from('deals')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', dealId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function addDealNote(dealId, { body, category = 'general', author = 'System' }) {
  const { data, error } = await supabaseAdmin
    .from('deal_notes')
    .insert({ deal_id: dealId, body, category, author })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── BROKER HELPERS ──────────────────────────────────────────

export async function getBrokers() {
  const { data, error } = await supabaseAdmin
    .from('brokers')
    .select('*')
    .eq('active', true)
    .order('name')
  if (error) throw error
  return data
}

export async function getBrokerByEmail(email) {
  const { data } = await supabaseAdmin
    .from('brokers')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single()
  return data
}

// ─── DEAL NUMBER GENERATOR ───────────────────────────────────

export async function generateDealNumber() {
  const { count } = await supabaseAdmin
    .from('deals')
    .select('*', { count: 'exact', head: true })
  const next = (count || 0) + 1
  return `D-${String(next).padStart(4, '0')}`
}
