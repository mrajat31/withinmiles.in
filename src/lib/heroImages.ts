import { supabase, isSupabaseConfigured } from './supabase'

export interface HeroImage {
  id: string
  image_url: string
  created_at?: string
}

/** Public: active hero slideshow image URLs. */
export async function fetchHeroImages(): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase) return []
  const { data, error } = await supabase
    .from('hero_images')
    .select('image_url')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map((row) => row.image_url as string)
}

/** Owner: full rows for management. */
export async function fetchHeroImageRows(): Promise<HeroImage[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('hero_images')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as HeroImage[]
}

export async function addHeroImage(imageUrl: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('hero_images').insert({ image_url: imageUrl })
  if (error) throw error
}

export async function deleteHeroImage(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('hero_images').delete().eq('id', id)
  if (error) throw error
}
