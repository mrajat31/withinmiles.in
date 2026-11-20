import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { submitReview, uploadReviewPhoto } from '../lib/reviews'
import { isSupabaseConfigured } from '../lib/supabase'

const inputCls =
  'mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

/** Standalone review page: share withinmiles.in/review with customers. */
export default function ReviewPage() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [tripName, setTripName] = useState('')
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePhotos(files: FileList) {
    setUploading(true)
    setError(null)
    try {
      for (const file of Array.from(files)) {
        const url = await uploadReviewPhoto(file)
        setPhotoUrls((prev) => [...prev, url])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await submitReview({
        name: name.trim(),
        rating,
        text: text.trim(),
        trip_name: tripName.trim() || null,
        photo_urls: photoUrls,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900">{t('reviewPage.title')}</h1>
        <p className="mt-3 text-slate-500">{t('reviewPage.subtitle')}</p>
      </div>

      {submitted ? (
        <div className="mt-10 rounded-3xl bg-emerald-50 p-10 text-center ring-1 ring-emerald-200">
          <p className="text-3xl">🎉</p>
          <p className="mt-3 text-lg font-semibold text-emerald-800">{t('reviews.submitted')}</p>
        </div>
      ) : !isSupabaseConfigured ? (
        <p className="mt-10 text-center text-slate-400">{t('trips.error')}</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100"
        >
          <label className="block text-sm font-medium text-slate-700">
            {t('reviews.yourName')} *
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </label>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            {t('reviews.tripName')}
            <input value={tripName} onChange={(e) => setTripName(e.target.value)} className={inputCls} />
          </label>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700">{t('reviews.rating')}</p>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`text-3xl transition hover:scale-110 ${n <= rating ? 'text-sand-400' : 'text-slate-200'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            {t('reviews.yourReview')} *
            <textarea required rows={5} value={text} onChange={(e) => setText(e.target.value)} className={inputCls} />
          </label>

          {/* Optional photos */}
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700">{t('reviews.addPhoto')}</p>
            {photoUrls.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {photoUrls.map((url, i) => (
                  <div key={url} className="relative">
                    <img src={url} alt="" className="h-24 w-full rounded-xl object-cover" />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => setPhotoUrls((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="mt-2 inline-block cursor-pointer rounded-full bg-brand-50 px-5 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-100">
              {uploading ? t('reviews.uploading') : photoUrls.length > 0 ? t('reviews.addMore') : t('reviews.uploadPhoto')}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  if (e.target.files?.length) handlePhotos(e.target.files)
                  e.target.value = ''
                }}
              />
            </label>
          </div>

          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={busy || uploading}
            className="mt-6 w-full rounded-full bg-brand-600 py-3.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {t('reviews.submit')}
          </button>
        </form>
      )}
    </div>
  )
}
