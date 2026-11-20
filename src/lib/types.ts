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
  category: 'trek' | 'beach' | 'adventure' | 'weekend' | 'international' | 'pilgrimage'
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
}

export type TripInput = Omit<Trip, 'id' | 'created_at'>

export const TRIP_CATEGORIES = [
  'trek',
  'beach',
  'adventure',
  'weekend',
  'international',
  'pilgrimage',
] as const
