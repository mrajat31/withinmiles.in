import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Trip } from '../lib/types'
import { tripTags } from '../lib/types'
import { tripTitle, formatPrice, whatsappBookingLink, communityPrice } from '../lib/trips'

export default function TripCard({ trip }: { trip: Trip }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) ?? 'en'

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/trips/${trip.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <img
            src={trip.image_url}
            alt={tripTitle(trip, lang)}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {tripTags(trip).slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
                {t(`categories.${tag}`)}
              </span>
            ))}
            {trip.difficulty && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
                  trip.difficulty === 'beginner'
                    ? 'bg-emerald-500/90 text-white'
                    : trip.difficulty === 'moderate'
                      ? 'bg-amber-500/90 text-white'
                      : 'bg-rose-600/90 text-white'
                }`}
              >
                {t(`difficulty.${trip.difficulty}`)}
              </span>
            )}
            {trip.is_featured && (
              <span className="rounded-full bg-sand-400 px-3 py-1 text-xs font-bold text-sand-50 text-white">
                ★ {t('trips.featured')}
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="text-sm font-medium">{trip.destination}</span>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/trips/${trip.slug}`}>
          <h3 className="font-display text-lg font-semibold text-slate-900 transition group-hover:text-brand-700">
            {tripTitle(trip, lang)}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" />
            </svg>
            {t('trips.days', { days: trip.duration_days, nights: trip.duration_nights })}
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">{t('trips.from')}</p>
            <p className="text-xl font-bold text-brand-700">
              {formatPrice(trip.price)}
              <span className="ml-1 text-xs font-normal text-slate-400">{t('trips.perPerson')}</span>
            </p>
            <p className="mt-0.5 text-xs font-semibold text-sand-600">
              {t('community.cardLabel', { price: formatPrice(communityPrice(trip.price)) })}
            </p>
          </div>
          <a
            href={whatsappBookingLink(trip, lang)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {t('nav.bookNow')}
          </a>
        </div>
      </div>
    </article>
  )
}
