import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TripCard from '../components/TripCard'
import type { Trip } from '../lib/types'
import { fetchActiveTrips, whatsappGeneralLink, INSTAGRAM_URL } from '../lib/trips'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80'

export default function Home() {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    fetchActiveTrips()
      .then((all) => {
        const featured = all.filter((x) => x.is_featured)
        setTrips((featured.length > 0 ? featured : all).slice(0, 3))
      })
      .catch(() => setTrips([]))
  }, [])

  const stats = [
    { value: '500+', label: t('hero.statTravellers') },
    { value: '120+', label: t('hero.statTrips') },
    { value: '45+', label: t('hero.statDestinations') },
    { value: '4.9★', label: t('hero.statRating') },
  ]

  const why = [
    {
      title: t('home.why1Title'),
      text: t('home.why1Text'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 21l4-9 4 9M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: t('home.why2Title'),
      text: t('home.why2Text'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="7" r="4" />
        </svg>
      ),
    },
    {
      title: t('home.why3Title'),
      text: t('home.why3Text'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: t('home.why4Title'),
      text: t('home.why4Text'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Mountain landscape"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/60 to-brand-950/30" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.3em] text-sand-300">
            {t('hero.tagline')}
          </p>
          <h1 className="animate-fade-up-delay-1 mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
            {t('hero.title')}{' '}
            <span className="italic text-brand-300">{t('hero.titleAccent')}</span>
          </h1>
          <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            {t('hero.subtitle')}
          </p>
          <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap gap-4">
            <Link
              to="/trips"
              className="rounded-full bg-sand-400 px-8 py-3.5 font-semibold text-brand-950 shadow-lg shadow-sand-500/25 transition hover:bg-sand-300"
            >
              {t('hero.cta')}
            </Link>
            <a
              href={whatsappGeneralLink()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/40 px-8 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>

          <div className="animate-fade-up-delay-3 mt-16 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured trips */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              {t('home.featuredTitle')}
            </h2>
            <p className="mt-2 text-slate-500">{t('home.featuredSubtitle')}</p>
          </div>
          <Link
            to="/trips"
            className="rounded-full border border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            {t('home.viewAll')} →
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              {t('home.whyTitle')}
            </h2>
            <p className="mt-2 text-slate-500">{t('home.whySubtitle')}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
              >
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram band */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
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
      <section className="bg-brand-900 py-20 text-center">
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
