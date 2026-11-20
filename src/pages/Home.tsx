import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TripCard from '../components/TripCard'
import ReviewsSection from '../components/ReviewsSection'
import type { Trip } from '../lib/types'
import { REGIONS } from '../lib/types'
import {
  fetchActiveTrips,
  sortUpcoming,
  whatsappGeneralLink,
  INSTAGRAM_URL,
} from '../lib/trips'

/** Put your real group photo at public/images/hero.jpg — it loads automatically.
 *  Until then this scenic placeholder is shown. */
const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80'

export default function Home() {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    fetchActiveTrips().then(setTrips).catch(() => setTrips([]))
  }, [])

  const latest = sortUpcoming(trips).slice(0, 3)
  const regionCounts = trips.reduce<Record<string, number>>((acc, trip) => {
    acc[trip.region] = (acc[trip.region] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      {/* Compact hero */}
      <section className="relative flex min-h-[58vh] items-center overflow-hidden">
        <img
          src="/images/hero.jpg"
          onError={(e) => {
            if (e.currentTarget.src !== HERO_FALLBACK) e.currentTarget.src = HERO_FALLBACK
          }}
          alt="Travellers on an adventure"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/60 to-brand-950/30" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.3em] text-sand-300">
            {t('hero.tagline')}
          </p>
          <h1 className="animate-fade-up-delay-1 mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {t('hero.title')}{' '}
            <span className="italic text-sand-300">{t('hero.titleAccent')}</span>
          </h1>
          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-4">
            <a
              href="#latest"
              className="rounded-full bg-sand-400 px-8 py-3.5 font-semibold text-brand-950 shadow-lg shadow-sand-500/25 transition hover:bg-sand-300"
            >
              {t('home.seeLatest')}
            </a>
            <a
              href={whatsappGeneralLink()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/40 px-8 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </div>
      </section>

      {/* This week's trips — the star of the page */}
      <section id="latest" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-600">
              {t('home.thisWeekKicker')}
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              {t('home.thisWeekTitle')}
            </h2>
            <p className="mt-2 text-slate-500">{t('home.thisWeekSubtitle')}</p>
          </div>
          <Link
            to="/trips"
            className="rounded-full border border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            {t('home.viewAll')} &rarr;
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>

      {/* Explore by destination */}
      <section className="bg-brand-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {t('home.destinationsTitle')}
          </h2>
          <p className="mt-2 text-brand-200/70">{t('home.destinationsSubtitle')}</p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {REGIONS.filter((r) => r !== 'other').map((region) => (
              <Link
                key={region}
                to={`/trips?region=${region}`}
                className="group relative flex h-36 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-brand-800 to-brand-950 p-4 ring-1 ring-white/10 transition hover:ring-sand-400/60 sm:h-40"
              >
                {/* Mountain watermark */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute -right-3 -top-3 h-28 w-28 text-white opacity-[0.06] transition group-hover:opacity-[0.12]"
                  fill="currentColor"
                >
                  <path d="M22 70 L44 42 L50 49 L61 32 L90 70 Z" />
                </svg>
                <p className="font-display text-lg font-semibold text-white">
                  {t(`regions.${region}`)}
                </p>
                {regionCounts[region] ? (
                  <p className="text-xs text-sand-300">
                    {t('home.tripCount', { count: regionCounts[region] })}
                  </p>
                ) : (
                  <p className="text-xs text-white/50">{t('home.comingSoon')}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection />

      {/* Instagram band */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-600 via-rose-500 to-amber-400 p-10 text-white sm:p-14">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold">{t('home.instaTitle')}</h2>
              <p className="mt-3 text-white/90">{t('home.instaText')}</p>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-7 py-3.5 font-semibold text-rose-600 shadow-lg transition hover:scale-105"
            >
              {t('home.instaButton')}
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-900 py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {t('home.ctaTitle')}
          </h2>
          <p className="mt-4 text-lg text-brand-200/80">{t('home.ctaText')}</p>
          <a
            href={whatsappGeneralLink()}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white shadow-lg shadow-green-500/25 transition hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M17.5 14.4l-2.1-1c-.3-.1-.6-.1-.8.2l-.6.8c-.2.2-.5.3-.8.2-1-.4-2.6-1.6-3.3-3.2-.1-.3 0-.6.2-.8l.7-.7c.2-.2.3-.6.1-.9l-1-2c-.2-.5-.8-.6-1.2-.3-1 .7-1.7 1.9-1.6 3.1.2 2 1.4 4.2 3.4 5.9 2 1.7 4.1 2.6 6.1 2.5 1.2 0 2.3-.9 2.8-2 .2-.4 0-1-.5-1.2l-1.4-.6zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
            </svg>
            {t('home.ctaButton')}
          </a>
        </div>
      </section>
    </div>
  )
}
