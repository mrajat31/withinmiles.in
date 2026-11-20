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
import { fetchHeroImages } from '../lib/heroImages'

/** Verified destination thumbnails (each from that place's own Wikipedia article). */
const REGION_IMAGES: Record<string, string> = {
  maharashtra: '/images/harishchandragad.jpg',
  himachal: '/images/region-himachal.jpg',
  uttarakhand: '/images/region-uttarakhand.jpg',
  kashmir: '/images/region-kashmir.jpg',
  arunachal: '/images/region-arunachal.jpg',
  meghalaya: '/images/region-meghalaya.jpg',
  goa: '/images/region-goa.jpg',
  international: '/images/region-international.jpg',
}

/** Put your real group photo at public/images/hero.jpg, it loads automatically.
 *  Until then this scenic placeholder is shown. */
const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80'

export default function Home() {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<Trip[]>([])
  const [heroSlides, setHeroSlides] = useState<string[]>([])
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    fetchActiveTrips().then(setTrips).catch(() => setTrips([]))
    fetchHeroImages().then(setHeroSlides).catch(() => setHeroSlides([]))
  }, [])

  const slides = heroSlides.length > 0 ? heroSlides : ['/images/hero.jpg']

  // Screensaver-style rotation when there are multiple hero photos
  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000)
    return () => clearInterval(id)
  }, [slides.length])

  const latest = sortUpcoming(trips).slice(0, 3)
  const regionCounts = trips.reduce<Record<string, number>>((acc, trip) => {
    acc[trip.region] = (acc[trip.region] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      {/* Compact hero */}
      <section className="relative flex min-h-[58vh] items-center overflow-hidden">
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            onError={(e) => {
              if (src === '/images/hero.jpg' && e.currentTarget.src !== HERO_FALLBACK) {
                e.currentTarget.src = HERO_FALLBACK
              }
            }}
            alt="Travellers on an adventure"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === slide % slides.length ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/60 to-brand-950/30" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <h1 className="animate-fade-up mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {t('hero.title')}{' '}
            <span className="text-sand-300">{t('hero.titleAccent')}</span>
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

      {/* This week's trips, the star of the page */}
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
                className="group relative h-40 overflow-hidden rounded-2xl ring-1 ring-white/10 transition hover:ring-sand-400/60 sm:h-48"
              >
                <img
                  src={REGION_IMAGES[region]}
                  alt={t(`regions.${region}`)}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute bottom-3 left-4 right-3">
                  <p className="font-display text-lg font-semibold text-white">
                    {t(`regions.${region}`)}
                  </p>
                  {regionCounts[region] ? (
                    <p className="text-xs text-sand-300">
                      {t('home.tripCount', { count: regionCounts[region] })}
                    </p>
                  ) : (
                    <p className="text-xs text-white/60">{t('home.comingSoon')}</p>
                  )}
                </div>
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
