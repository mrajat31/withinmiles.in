import { supabase, isSupabaseConfigured } from './supabase'

/** Simple key/value site settings (public read, owner write). */
export async function fetchSetting(key: string): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  if (error) throw error
  return (data?.value as string | undefined) ?? null
}

export async function setSetting(key: string, value: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('site_settings').upsert({ key, value })
  if (error) throw error
}
