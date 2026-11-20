import { supabase, isSupabaseConfigured } from './supabase'
import { sampleTrips } from './sampleTrips'
import type { Trip, TripInput } from './types'

export const WHATSAPP_NUMBER = '918767959561'
export const INSTAGRAM_URL = 'https://www.instagram.com/withinmiles.in/'

/** Paste your Google Business Profile review link here once created
 *  (business.google.com → your profile → "Ask for reviews" → copy link). */
export const GOOGLE_REVIEW_URL = ''

/** Representative image for each region card on the homepage. */
export const REGION_IMAGES: Record<string, string> = {
  maharashtra:
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=70',
  himachal:
    'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=70',
  uttarakhand:
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=70',
  kashmir:
    'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=70',
  arunachal:
    'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&w=800&q=70',
  meghalaya:
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=70',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=70',
  international:
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=70',
}

/** Trips with upcoming start dates first (soonest first), then undated/featured. */
export function sortUpcoming(trips: Trip[]): Trip[] {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = trips
    .filter((t) => t.start_date && t.start_date >= today)
    .sort((a, b) => (a.start_date! < b.start_date! ? -1 : 1))
  const rest = trips.filter((t) => !t.start_date || t.start_date < today)
  return [...upcoming, ...rest]
}

/** Localized field lookup with English fallback. */
export function tripTitle(trip: Trip, lang: string): string {
  if (lang === 'hi' && trip.title_hi) return trip.title_hi
  if (lang === 'mr' && trip.title_mr) return trip.title_mr
  return trip.title_en
}

export function tripDescription(trip: Trip, lang: string): string {
  if (lang === 'hi' && trip.description_hi) return trip.description_hi
  if (lang === 'mr' && trip.description_mr) return trip.description_mr
  return trip.description_en
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function whatsappBookingLink(trip: Trip, lang: string): string {
  const msg = `Hi Within Miles! I want to book the trip: ${tripTitle(trip, lang)} (${formatPrice(trip.price)}). Please share the details.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export function whatsappGeneralLink(): string {
  const msg = 'Hi Within Miles! I would like to know more about your trips.'
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

/** Public: active trips, featured first then newest. */
export async function fetchActiveTrips(): Promise<Trip[]> {
  if (!isSupabaseConfigured || !supabase) {
    return sampleTrips.filter((t) => t.is_active)
  }
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Trip[]
}

export async function fetchTripBySlug(slug: string): Promise<Trip | null> {
  if (!isSupabaseConfigured || !supabase) {
    return sampleTrips.find((t) => t.slug === slug) ?? null
  }
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data as Trip | null
}

/** Admin: all trips including inactive. */
export async function fetchAllTrips(): Promise<Trip[]> {
  if (!isSupabaseConfigured || !supabase) return sampleTrips
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Trip[]
}

export async function createTrip(input: TripInput): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('trips').insert(input)
  if (error) throw error
}

export async function updateTrip(id: string, input: Partial<TripInput>): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('trips').update(input).eq('id', id)
  if (error) throw error
}

export async function deleteTrip(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('trips').delete().eq('id', id)
  if (error) throw error
}

/** Upload a trip image to Supabase storage; returns the public URL. */
export async function uploadTripImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured')
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('trip-images').upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from('trip-images').getPublicUrl(path)
  return data.publicUrl
}
