export interface TripBatch {
  start: string
  end: string | null
  note?: string | null
}

export interface Trip {
  id: string
  slug: string
  title_en: string
  title_hi: string | null
  title_mr: string | null
  description_en: string
  description_hi: string | null
  description_mr: string | null
  destination: string
  region: string
  category: 'trek' | 'roadtrip' | 'beach' | 'adventure' | 'weekend' | 'international' | 'pilgrimage'
  /** Multiple tags; the legacy single `category` mirrors the first tag. */
  categories?: string[] | null
  duration_days: number
  duration_nights: number
  price: number
  start_date: string | null
  end_date: string | null
  /** Multiple departure dates; start_date/end_date mirror the next upcoming batch. */
  batches?: TripBatch[] | null
  image_url: string
  highlights: string[]
  is_active: boolean
  is_featured: boolean
  created_at?: string
  approval_status?: 'pending' | 'approved'
  difficulty?: 'beginner' | 'moderate' | 'advanced' | null
  // Extended catalog fields (optional)
  best_months?: string | null
  pickup_points?: string | null
  departure_note?: string | null
  price_note?: string | null
  itinerary?: string | null
  includes?: string[] | null
  excludes?: string[] | null
  things_to_carry?: string[] | null
}

export type TripInput = Omit<Trip, 'id' | 'created_at'>

export const TRIP_CATEGORIES = [
  'trek',
  'roadtrip',
  'beach',
  'adventure',
  'weekend',
  'pilgrimage',
] as const

export const REGIONS = [
  'maharashtra',
  'himachal',
  'uttarakhand',
  'kashmir',
  'arunachal',
  'meghalaya',
  'goa',
  'international',
  'other',
] as const

export type Region = (typeof REGIONS)[number]

/** All tags for a trip, falling back to the legacy single category. */
export function tripTags(trip: Pick<Trip, 'category' | 'categories'>): string[] {
  return trip.categories && trip.categories.length > 0 ? trip.categories : [trip.category]
}

export interface Review {
  id: string
  name: string
  rating: number
  text: string
  trip_name: string | null
  photo_url?: string | null
  photo_urls?: string[] | null
  is_approved: boolean
  created_at?: string
}

export interface Profile {
  id: string
  full_name: string
  title: string | null
  bio: string | null
  photo_url: string | null
  instagram: string | null
  role: 'owner' | 'zone_head' | 'volunteer'
  is_public: boolean
  created_at?: string
}

export const ROLES = ['owner', 'zone_head', 'volunteer'] as const

export interface GalleryPhoto {
  id: string
  created_at?: string
  trip_id: string | null
  image_url: string
  caption: string | null
  sort_order: number
  uploaded_by?: string | null
}

export interface Member {
  id: string
  created_at?: string
  full_name: string
  whatsapp: string
  email: string | null
  city: string | null
  eligibility: 'two_treks' | 'one_trek_with_member'
  treks_done: string
  referred_by: string | null
  status: 'pending' | 'active' | 'rejected'
  expires_at: string | null
}
