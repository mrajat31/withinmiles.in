import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Review } from '../../lib/types'
import { fetchAllReviews, setReviewApproval, deleteReview, reviewPhotos } from '../../lib/reviews'

export default function ReviewsManager() {
  const { t } = useTranslation()
  const f = (key: string) => t(`admin.reviewsTab.${key}`)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const pending = reviews.filter((r) => !r.is_approved).length

  return (
    <div className="mt-8">
      <div className="rounded-2xl bg-brand-50 px-5 py-4 text-sm text-slate-600 ring-1 ring-brand-100">
        {f('shareHint')}{' '}
        <span className="font-semibold text-brand-800">withinmiles.in/review</span>
        {pending > 0 && (
          <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            {pending} {f('pending').toLowerCase()}
          </span>
        )}
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
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      r.is_approved
                        ? 'border border-brand-200 text-brand-700 hover:bg-brand-50'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
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
                    className="rounded-full border border-rose-200 px-4 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    {t('admin.delete')}
                  </button>
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.text}</p>
              {reviewPhotos(r).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {reviewPhotos(r).map((p) => (
                    <img key={p} src={p} alt="" className="h-24 w-32 rounded-xl object-cover" />
                  ))}
                </div>
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
