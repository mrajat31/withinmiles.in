import { useEffect, useRef, useState } from 'react'
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
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    fetchApprovedReviews().then(setReviews).catch(() => setReviews([]))
  }, [])

  // Gentle auto-scroll: advance one card every 5s, loop back at the end.
  // Pauses while the visitor is hovering, touching or dragging.
  useEffect(() => {
    if (reviews.length < 2) return
    const id = setInterval(() => {
      const el = trackRef.current
      if (!el || pausedRef.current) return
      const card = el.querySelector<HTMLElement>('[data-review-card]')
      if (!card) return
      const step = card.offsetWidth + 24
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - step / 2
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: 'smooth' })
    }, 5000)
    return () => clearInterval(id)
  }, [reviews.length])

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-review-card]')
    const step = card ? card.offsetWidth + 24 : el.clientWidth
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const onTrackScroll = () => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-review-card]')
    if (!card) return
    setActive(Math.round(el.scrollLeft / (card.offsetWidth + 24)))
  }

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

        <div className="relative mt-12">
          {reviews.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous reviews"
                onClick={() => scrollByCard(-1)}
                className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-xl text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-900 hover:text-white md:grid"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next reviews"
                onClick={() => scrollByCard(1)}
                className="absolute -right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-xl text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-900 hover:text-white md:grid"
              >
                →
              </button>
            </>
          )}

          <div
            ref={trackRef}
            onScroll={onTrackScroll}
            onMouseEnter={() => { pausedRef.current = true }}
            onMouseLeave={() => { pausedRef.current = false }}
            onTouchStart={() => { pausedRef.current = true }}
            onTouchEnd={() => { setTimeout(() => { pausedRef.current = false }, 8000) }}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
          >
            {reviews.map((r) => {
              const photos = reviewPhotos(r)
              return (
                <figure
                  key={r.id}
                  data-review-card
                  className="w-[85%] shrink-0 snap-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 sm:w-[380px] sm:snap-start"
                >
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

          {reviews.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {reviews.map((r, i) => (
                <span
                  key={r.id}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? 'w-6 bg-sand-400' : 'w-1.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          )}
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
