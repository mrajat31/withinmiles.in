import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Review } from '../../lib/types'
import { fetchAllReviews, addReviewAdmin, setReviewApproval, deleteReview } from '../../lib/reviews'

const inputCls =
  'mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export default function ReviewsManager() {
  const { t } = useTranslation()
  const f = (key: string) => t(`admin.reviewsTab.${key}`)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [tripName, setTripName] = useState('')
  const [busy, setBusy] = useState(false)

  async function reload() {
    setLoading(true)
    try {
      setReviews(await fetchAllReviews())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await addReviewAdmin({
        name: name.trim(),
        rating,
        text: text.trim(),
        trip_name: tripName.trim() || null,
      })
      setName('')
      setText('')
      setTripName('')
      setRating(5)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="font-display text-xl font-semibold text-slate-900">{f('addTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{f('addHint')}</p>
        <form onSubmit={handleAdd} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              {t('reviews.yourName')} *
              <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {t('reviews.tripName')}
              <input value={tripName} onChange={(e) => setTripName(e.target.value)} className={inputCls} />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">{t('reviews.rating')}</p>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`text-2xl ${n <= rating ? 'text-sand-400' : 'text-slate-200'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            {t('reviews.yourReview')} *
            <textarea required rows={3} value={text} onChange={(e) => setText(e.target.value)} className={inputCls} />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {f('publish')}
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-2xl bg-brand-50 px-5 py-4 text-sm text-slate-600 ring-1 ring-brand-100">
        {f('shareHint')}{' '}
        <span className="font-semibold text-brand-800">withinmiles.in/review</span>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}

      {loading ? (
        <p className="py-10 text-center text-slate-400">…</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sand-400">{'★'.repeat(r.rating)}</span>
                <span className="font-semibold text-slate-900">{r.name}</span>
                {r.trip_name && <span className="text-sm text-slate-400">· {r.trip_name}</span>}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    r.is_approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {r.is_approved ? f('live') : f('pending')}
                </span>
                <span className="ml-auto flex gap-2">
                  <button
                    onClick={async () => {
                      await setReviewApproval(r.id, !r.is_approved)
                      await reload()
                    }}
                    className="rounded-full border border-brand-200 px-3.5 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
                  >
                    {r.is_approved ? f('hide') : f('approveBtn')}
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm(f('deleteConfirm'))) {
                        await deleteReview(r.id)
                        await reload()
                      }
                    }}
                    className="rounded-full border border-rose-200 px-3.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    {t('admin.delete')}
                  </button>
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.text}</p>
              {r.photo_url && (
                <img src={r.photo_url} alt="" className="mt-3 h-28 w-40 rounded-xl object-cover" />
              )}
            </li>
          ))}
          {reviews.length === 0 && (
            <p className="py-10 text-center text-slate-400">{f('empty')}</p>
          )}
        </ul>
      )}
    </div>
  )
}
