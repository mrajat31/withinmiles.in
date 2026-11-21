import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { GalleryPhoto, Trip, Review } from '../lib/types'
import { fetchGalleryPhotos } from '../lib/gallery'
import { fetchActiveTrips, tripTitle } from '../lib/trips'
import { fetchApprovedReviews, reviewPhotos } from '../lib/reviews'
import Lightbox, { type LightboxItem } from '../components/Lightbox'

interface WallItem extends LightboxItem {
  key: string
  tripId: string | null
}

export default function Gallery() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) ?? 'en'
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      fetchGalleryPhotos().catch(() => [] as GalleryPhoto[]),
      fetchActiveTrips().catch(() => [] as Trip[]),
      fetchApprovedReviews().catch(() => [] as Review[]),
    ]).then(([g, tr, rv]) => {
      setPhotos(g)
      setTrips(tr)
      setReviews(rv)
      setLoading(false)
    })
  }, [])

  const tripName = (id: string | null) => {
    const trip = trips.find((x) => x.id === id)
    return trip ? tripTitle(trip, lang) : null
  }

  const wall = useMemo<WallItem[]>(() => {
    const own: WallItem[] = photos.map((p) => ({
      key: `g-${p.id}`,
      src: p.image_url,
      caption: p.caption || tripName(p.trip_id),
      tripId: p.trip_id,
    }))
    const fromReviews: WallItem[] = reviews.flatMap((r) =>
      reviewPhotos(r).map((src, i) => ({
        key: `r-${r.id}-${i}`,
        src,
        caption: t('gallery.byTraveller', { name: r.name }),
        tripId: null,
      })),
    )
    return [...own, ...fromReviews]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos, reviews, trips, lang])

  // Only trips that actually have photos appear as filters
  const filterTrips = useMemo(
    () => trips.filter((trip) => photos.some((p) => p.trip_id === trip.id)),
    [trips, photos],
  )

  const visible = useMemo(
    () =>
      filter === 'all'
        ? wall
        : filter === 'travellers'
          ? wall.filter((w) => w.key.startsWith('r-'))
          : wall.filter((w) => w.tripId === filter),
    [wall, filter],
  )

  const hasTravellerPhotos = wall.some((w) => w.key.startsWith('r-'))

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900">{t('gallery.title')}</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-500">{t('gallery.subtitle')}</p>
      </div>

      {(filterTrips.length > 0 || hasTravellerPhotos) && (
        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === 'all' ? 'bg-brand-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('gallery.all')}
          </button>
          {filterTrips.map((trip) => (
            <button
              key={trip.id}
              onClick={() => setFilter(trip.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === trip.id ? 'bg-brand-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tripTitle(trip, lang)}
            </button>
          ))}
          {hasTravellerPhotos && (
            <button
              onClick={() => setFilter('travellers')}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === 'travellers' ? 'bg-brand-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('gallery.travellers')}
            </button>
          )}
        </div>
      )}

      {loading ? (
        <p className="py-24 text-center text-slate-400">{t('trips.loading')}</p>
      ) : visible.length === 0 ? (
        <p className="py-24 text-center text-slate-400">{t('gallery.empty')}</p>
      ) : (
        <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>button]:mb-4">
          {visible.map((item, i) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full break-inside-avoid overflow-hidden rounded-2xl"
            >
              <img
                src={item.src}
                alt={item.caption ?? ''}
                loading="lazy"
                className="w-full transition duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {open !== null && (
        <Lightbox items={visible} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      )}
    </div>
  )
}
