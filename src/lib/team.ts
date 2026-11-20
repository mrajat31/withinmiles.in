import { supabase, isSupabaseConfigured } from './supabase'
import type { Profile } from './types'

/** Sample team shown until Supabase is connected. */
export const sampleTeam: Profile[] = [
  {
    id: 'sample-founder',
    full_name: 'Rajat',
    title: 'Founder & Trip Lead',
    bio: 'Started withinmiles.in with one belief — the best memories are made away from the crowds. Has led 100+ treks across the Sahyadris and Himalayas.',
    photo_url: null,
    instagram: 'withinmiles.in',
    role: 'admin',
    is_public: true,
  },
]

export async function fetchPublicProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured || !supabase) return sampleTeam
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  const profiles = (data ?? []) as Profile[]
  return profiles.length > 0 ? profiles : sampleTeam
}

export async function fetchMyProfile(): Promise<Profile | null> {
  if (!supabase) return null
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) return null
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (error) throw error
  return data as Profile | null
}

export async function upsertMyProfile(input: {
  full_name: string
  title: string | null
  bio: string | null
  photo_url: string | null
  instagram: string | null
  is_public: boolean
}): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) throw new Error('Not signed in')
  // Role is never sent from the client on self-upsert; new rows default to 'member'.
  const { error } = await supabase.from('profiles').upsert({ id: user.id, ...input })
  if (error) throw error
}

/** Admin only (enforced by RLS). */
export async function fetchAllProfiles(): Promise<Profile[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as Profile[]
}

/** Admin only (enforced by RLS). */
export async function updateProfileAdmin(
  id: string,
  input: Partial<Pick<Profile, 'role' | 'is_public'>>,
): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('profiles').update(input).eq('id', id)
  if (error) throw error
}
