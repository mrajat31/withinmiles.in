import { supabase, isSupabaseConfigured } from './supabase'
import type { Review } from './types'

/** Sample reviews shown until Supabase is connected. */
export const sampleReviews: Review[] = [
  {
    id: 'r1',
    name: 'Priya S.',
    rating: 5,
    text: 'The Harishchandragad night trek was magical, zero crowds, an incredible sunrise at Konkan Kada, and captains who genuinely cared. Felt like travelling with old friends!',
    trip_name: 'Harishchandragad Night Trek',
    is_approved: true,
  },
  {
    id: 'r2',
    name: 'Rohan & Sneha',
    rating: 5,
    text: 'Our first trek ever and we were nervous, the team made it so easy. Everything was planned to perfection. Already booked our next trip!',
    trip_name: 'Kedarkantha Winter Trek',
    is_approved: true,
  },
  {
    id: 'r3',
    name: 'Aditya K.',
    rating: 5,
    text: 'Spiti with withinmiles.in was the best decision of the year. Hidden homestays, starry skies, no tourist chaos. They really do sell happiness.',
    trip_name: 'Spiti Valley Expedition',
    is_approved: true,
  },
]

export async function fetchApprovedReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured || !supabase) return sampleReviews
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(9)
  if (error) throw error
  // Real reviews only once the database is live; no sample fallback.
  return (data ?? []) as Review[]
}

/** Owner only: all reviews including pending (enforced by RLS). */
export async function fetchAllReviews(): Promise<Review[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Review[]
}

/** Owner only: paste-in reviews received on WhatsApp (published immediately). */
export async function addReviewAdmin(input: {
  name: string
  rating: number
  text: string
  trip_name: string | null
}): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('reviews').insert({ ...input, is_approved: true })
  if (error) throw error
}

export async function setReviewApproval(id: string, approved: boolean): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('reviews').update({ is_approved: approved }).eq('id', id)
  if (error) throw error
}

export async function deleteReview(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) throw error
}

/** Visitors submit reviews; they stay hidden until approved in Supabase. */
export async function submitReview(input: {
  name: string
  rating: number
  text: string
  trip_name: string | null
  photo_url?: string | null
}): Promise<void> {
  if (!supabase) throw new Error('Reviews are not enabled yet')
  const { error } = await supabase.from('reviews').insert({ ...input, is_approved: false })
  if (error) throw error
}

/** Upload a customer's review photo (anonymous allowed); returns public URL. */
export async function uploadReviewPhoto(file: File): Promise<string> {
  if (!supabase) throw new Error('Reviews are not enabled yet')
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('review-photos').upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from('review-photos').getPublicUrl(path)
  return data.publicUrl
}
