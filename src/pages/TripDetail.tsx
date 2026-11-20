import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Trip } from '../lib/types'
import {
  fetchTripBySlug,
  tripTitle,
  tripDescription,
  formatPrice,
  whatsappBookingLink,
  whatsappGeneralLink,
  communityPrice,
} from '../lib/trips'

export default function TripDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) ?? 'en'
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetchTripBySlug(slug)
      .then(setTrip)
      .catch(() => setTrip(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return <p className="py-32 text-center text-slate-400">{t('trips.loading')}</p>
  }

  if (!trip) {
    return (
      <div className="py-32 text-center">
        <p className="text-2xl font-semibold text-slate-700">{t('tripDetail.notFound')}</p>
        <Link to="/trips" className="mt-4 inline-block font-medium text-brand-700 hover:underline">
          ← {t('tripDetail.backToTrips')}
        </Link>
      </div>
    )
  }

  const dateRange = trip.departure_note
    ? trip.departure_note
    : trip.start_date && trip.end_date
      ? `${new Date(trip.start_date).toLocaleDateString(lang === 'en' ? 'en-IN' : lang, { day: 'numeric', month: 'short' })} - ${new Date(trip.end_date).toLocaleDateString(lang === 'en' ? 'en-IN' : lang, { day: 'numeric', month: 'short', year: 'numeric' })}`
      : t('tripDetail.flexible')

  const facts = [
    { label: t('tripDetail.destination'), value: trip.destination },
    { label: t('tripDetail.duration'), value: t('trips.days', { days: trip.duration_days, nights: trip.duration_nights }) },
    ...(trip.difficulty ? [{ label: t('tripDetail.difficulty'), value: t(`difficulty.${trip.difficulty}`) }] : []),
    { label: t('tripDetail.dates'), value: dateRange },
    ...(trip.best_months ? [{ label: t('tripDetail.bestMonths'), value: trip.best_months }] : []),
    ...(trip.pickup_points ? [{ label: t('tripDetail.pickup'), value: trip.pickup_points }] : []),
    { label: t('tripDetail.price'), value: `${formatPrice(trip.price)} ${t('trips.perPerson')}` },
  ]

  return (
    <div>
      {/* Hero image */}
      <section className="relative h-[55vh] min-h-[380px]">
        <img src={trip.image_url} alt={tripTitle(trip, lang)} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
            <Link to="/trips" className="text-sm font-medium text-white/80 hover:text-white">
              ← {t('tripDetail.backToTrips')}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                {t(`categories.${trip.category}`)}
              </span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">
              {tripTitle(trip, lang)}
            </h1>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            {t('tripDetail.aboutTrip')}
          </h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">
            {tripDescription(trip, lang)}
          </p>

          {trip.highlights.length > 0 && (
            <>
              <h2 className="mt-10 font-display text-2xl font-semibold text-slate-900">
                {t('tripDetail.highlights')}
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {trip.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-3 rounded-xl bg-brand-50/60 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {h}
                  </li>
                ))}
              </ul>
            </>
          )}

          {trip.itinerary && (
            <>
              <h2 className="mt-10 font-display text-2xl font-semibold text-slate-900">
                {t('tripDetail.itinerary')}
              </h2>
              <div className="mt-4 whitespace-pre-line rounded-2xl bg-slate-50 p-6 text-sm leading-relaxed text-slate-700 ring-1 ring-slate-100">
                {trip.itinerary}
              </div>
            </>
          )}

          {((trip.includes?.length ?? 0) > 0 || (trip.excludes?.length ?? 0) > 0) && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {(trip.includes?.length ?? 0) > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    {t('tripDetail.includes')}
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {trip.includes!.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-0.5 font-bold text-emerald-600">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(trip.excludes?.length ?? 0) > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    {t('tripDetail.excludes')}
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {trip.excludes!.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-0.5 font-bold text-rose-500">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {(trip.things_to_carry?.length ?? 0) > 0 && (
            <>
              <h2 className="mt-10 font-display text-xl font-semibold text-slate-900">
                {t('tripDetail.carry')}
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {trip.things_to_carry!.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-0.5 text-sand-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Booking card */}
        <aside>
          <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
            <dl className="space-y-4">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
                  <dt className="text-sm text-slate-400">{f.label}</dt>
                  <dd className="text-right text-sm font-semibold text-slate-800">{f.value}</dd>
                </div>
              ))}
            </dl>
            {trip.price_note && (
              <p className="mt-3 text-xs leading-relaxed text-slate-400">{trip.price_note}</p>
            )}
            <div className="mt-4 rounded-xl bg-sand-50 px-4 py-3 ring-1 ring-sand-200">
              <p className="text-sm font-semibold text-sand-600">
                {t('community.detailLabel', { price: formatPrice(communityPrice(trip.price)) })}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{t('community.detailText')}</p>
              <Link
                to="/community"
                className="mt-1.5 inline-block text-xs font-semibold text-brand-700 hover:underline"
              >
                {t('community.join')} →
              </Link>
            </div>
            <a
              href={whatsappBookingLink(trip, lang)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 font-semibold text-white shadow-md shadow-green-500/20 transition hover:scale-[1.02]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M17.5 14.4l-2.1-1c-.3-.1-.6-.1-.8.2l-.6.8c-.2.2-.5.3-.8.2-1-.4-2.6-1.6-3.3-3.2-.1-.3 0-.6.2-.8l.7-.7c.2-.2.3-.6.1-.9l-1-2c-.2-.5-.8-.6-1.2-.3-1 .7-1.7 1.9-1.6 3.1.2 2 1.4 4.2 3.4 5.9 2 1.7 4.1 2.6 6.1 2.5 1.2 0 2.3-.9 2.8-2 .2-.4 0-1-.5-1.2l-1.4-.6zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
              </svg>
              {t('tripDetail.bookWhatsApp')}
            </a>
            <a
              href={whatsappGeneralLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-center text-sm font-medium text-brand-700 hover:underline"
            >
              {t('tripDetail.enquire')}
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}
