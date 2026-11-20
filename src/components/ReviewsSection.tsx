import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Review } from '../lib/types'
import { fetchApprovedReviews, submitReview } from '../lib/reviews'
import { isSupabaseConfigured } from '../lib/supabase'
import { GOOGLE_REVIEW_URL } from '../lib/trips'

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={`text-xl leading-none ${n <= value ? 'text-sand-400' : 'text-slate-200'} ${onChange ? 'cursor-pointer transition hover:scale-110' : 'cursor-default'}`}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function ReviewsSection() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [tripName, setTripName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApprovedReviews().then(setReviews).catch(() => setReviews([]))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await submitReview({ name: name.trim(), rating, text: text.trim(), trip_name: tripName.trim() || null })
      setSubmitted(true)
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  // Hide the whole section until the first real review is approved
  if (isSupabaseConfigured && reviews.length === 0 && !submitted) return null

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
          {reviews.slice(0, 6).map((r) => (
            <figure key={r.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              {r.photo_url && (
                <img src={r.photo_url} alt="" loading="lazy" className="h-44 w-full object-cover" />
              )}
              <div className="p-7">
                <Stars value={r.rating} />
                <blockquote className="mt-4 text-sm leading-relaxed text-slate-600">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-5">
                  <p className="font-semibold text-slate-900">{r.name}</p>
                  {r.trip_name && <p className="text-xs text-slate-400">{r.trip_name}</p>}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {isSupabaseConfigured && !submitted && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
            >
              {t('reviews.writeReview')}
            </button>
          )}
          {GOOGLE_REVIEW_URL && (
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {t('reviews.googleButton')}
            </a>
          )}
        </div>

        {submitted && (
          <p className="mt-6 text-center font-medium text-emerald-600">{t('reviews.submitted')}</p>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 max-w-xl rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100"
          >
            <label className="block text-sm font-medium text-slate-700">
              {t('reviews.yourName')} *
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
              />
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              {t('reviews.tripName')}
              <input
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
              />
            </label>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700">{t('reviews.rating')}</p>
              <div className="mt-1.5">
                <Stars value={rating} onChange={setRating} />
              </div>
            </div>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              {t('reviews.yourReview')} *
              <textarea
                required
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
              />
            </label>
            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-5 rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {t('reviews.submit')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
