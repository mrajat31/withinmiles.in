import { supabase } from './supabase'
import type { Member } from './types'

export async function submitMembership(input: {
  full_name: string
  whatsapp: string
  email: string | null
  city: string | null
  eligibility: Member['eligibility']
  treks_done: string
  referred_by: string | null
}): Promise<void> {
  if (!supabase) throw new Error('Membership is not enabled yet')
  const { error } = await supabase.from('members').insert({ ...input, status: 'pending' })
  if (error) throw error
}

/** Owner only (enforced by RLS). */
export async function fetchMembers(): Promise<Member[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Member[]
}

/** Owner only (enforced by RLS). */
export async function updateMember(
  id: string,
  input: Partial<Pick<Member, 'status' | 'expires_at'>>,
): Promise<void> {
  if (!supabase) throw new Error('Membership is not enabled yet')
  const { error } = await supabase.from('members').update(input).eq('id', id)
  if (error) throw error
}
