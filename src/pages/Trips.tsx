import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TripCard from '../components/TripCard'
import type { Trip } from '../lib/types'
import { TRIP_CATEGORIES, REGIONS } from '../lib/types'
import { fetchActiveTrips, tripTitle, sortUpcoming } from '../lib/trips'

export default function Trips() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) ?? 'en'
  const [searchParams, setSearchParams] = useSearchParams()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const region = searchParams.get('region') ?? 'all'

  useEffect(() => {
    fetchActiveTrips()
      .then((data) => setTrips(sortUpcoming(data)))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  function setRegion(value: string) {
    if (value === 'all') {
      searchParams.delete('region')
    } else {
      searchParams.set('region', value)
    }
    setSearchParams(searchParams, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return trips.filter((trip) => {
      if (region !== 'all' && trip.region !== region) return false
      if (category !== 'all' && trip.category !== category) return false
      if (!q) return true
      return (
        tripTitle(trip, lang).toLowerCase().includes(q) ||
        trip.title_en.toLowerCase().includes(q) ||
        trip.destination.toLowerCase().includes(q)
      )
    })
  }, [trips, search, category, region, lang])

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900">{t('trips.title')}</h1>
        <p className="mt-3 text-slate-500">{t('trips.subtitle')}</p>
      </div>

      {/* Search + filters */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="relative w-full max-w-lg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('trips.searchPlaceholder')}
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-5 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* Region filter */}
        <div className="no-scrollbar flex w-full max-w-full items-center gap-2 overflow-x-auto pb-1 sm:justify-center">
          {['all', ...REGIONS].map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                region === r
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? t('trips.allRegions') : t(`regions.${r}`)}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="no-scrollbar flex w-full max-w-full items-center gap-2 overflow-x-auto pb-1 sm:justify-center">
          {['all', ...TRIP_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                category === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? t('trips.all') : t(`categories.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-12">
        {loading ? (
          <p className="py-20 text-center text-slate-400">{t('trips.loading')}</p>
        ) : error ? (
          <p className="py-20 text-center text-rose-500">{t('trips.error')}</p>
        ) : filtered.length === 0 ? (
          <p className="py-20 text-center text-slate-400">{t('trips.noTrips')}</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
