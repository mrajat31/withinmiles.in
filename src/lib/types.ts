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
  duration_days: number
  duration_nights: number
  price: number
  start_date: string | null
  end_date: string | null
  image_url: string
  highlights: string[]
  is_active: boolean
  is_featured: boolean
  created_at?: string
  approval_status?: 'pending' | 'approved'
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
  'international',
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

export interface Review {
  id: string
  name: string
  rating: number
  text: string
  trip_name: string | null
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
