import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Review } from '../lib/types'
import { fetchApprovedReviews, reviewPhotos } from '../lib/reviews'
import { isSupabaseConfigured } from '../lib/supabase'
import { GOOGLE_REVIEW_URL } from '../lib/trips'

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5 text-xl leading-none">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? 'text-sand-400' : 'text-slate-200'}>★</span>
      ))}
    </div>
  )
}

export default function ReviewsSection() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetchApprovedReviews().then(setReviews).catch(() => setReviews([]))
  }, [])

  // Until the first approved review exists, show an invite instead of stories
  if (isSupabaseConfigured && reviews.length === 0) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-slate-900">{t('reviews.title')}</h2>
          <p className="mt-3 text-slate-500">{t('reviews.emptyInvite')}</p>
          <Link
            to="/review"
            className="mt-6 inline-block rounded-full bg-brand-600 px-7 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            {t('reviews.writeReview')}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            {t('reviews.title')}
          </h2>
          <p className="mt-2 text-slate-500">{t('reviews.subtitle')}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 6).map((r) => {
            const photos = reviewPhotos(r)
            return (
              <figure key={r.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                {photos[0] && (
                  <img src={photos[0]} alt="" loading="lazy" className="h-44 w-full object-cover" />
                )}
                <div className="p-7">
                  <Stars value={r.rating} />
                  <blockquote className="mt-4 text-sm leading-relaxed text-slate-600">
                    "{r.text}"
                  </blockquote>
                  {photos.length > 1 && (
                    <div className="mt-4 flex gap-2">
                      {photos.slice(1, 4).map((p) => (
                        <img key={p} src={p} alt="" loading="lazy" className="h-14 w-14 rounded-lg object-cover" />
                      ))}
                      {photos.length > 4 && (
                        <span className="grid h-14 w-14 place-items-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                          +{photos.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                  <figcaption className="mt-5">
                    <p className="font-semibold text-slate-900">{r.name}</p>
                    {r.trip_name && <p className="text-xs text-slate-400">{r.trip_name}</p>}
                  </figcaption>
                </div>
              </figure>
            )
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/review"
            className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            {t('reviews.writeReview')}
          </Link>
          {GOOGLE_REVIEW_URL && (
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {t('reviews.googleButton')}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
