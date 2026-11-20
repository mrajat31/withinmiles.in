import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Trip, TripInput } from '../../lib/types'
import { TRIP_CATEGORIES, REGIONS } from '../../lib/types'
import { createTrip, updateTrip, uploadTripImage, slugify } from '../../lib/trips'

interface Props {
  trip: Trip | null
  onDone: () => void
  onCancel: () => void
}

const inputCls =
  'mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export default function TripForm({ trip, onDone, onCancel }: Props) {
  const { t } = useTranslation()
  const f = (key: string) => t(`admin.form.${key}`)

  const [form, setForm] = useState({
    title_en: trip?.title_en ?? '',
    title_hi: trip?.title_hi ?? '',
    title_mr: trip?.title_mr ?? '',
    description_en: trip?.description_en ?? '',
    description_hi: trip?.description_hi ?? '',
    description_mr: trip?.description_mr ?? '',
    destination: trip?.destination ?? '',
    region: trip?.region ?? 'maharashtra',
    category: trip?.category ?? 'trek',
    duration_days: trip?.duration_days ?? 2,
    duration_nights: trip?.duration_nights ?? 1,
    price: trip?.price ?? 0,
    start_date: trip?.start_date ?? '',
    end_date: trip?.end_date ?? '',
    image_url: trip?.image_url ?? '',
    highlights: (trip?.highlights ?? []).join('\n'),
    is_active: trip?.is_active ?? true,
    is_featured: trip?.is_featured ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleImageUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const url = await uploadTripImage(file)
      set('image_url', url)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const input: TripInput = {
      slug: trip?.slug ?? slugify(form.title_en),
      title_en: form.title_en.trim(),
      title_hi: form.title_hi.trim() || null,
      title_mr: form.title_mr.trim() || null,
      description_en: form.description_en.trim(),
      description_hi: form.description_hi.trim() || null,
      description_mr: form.description_mr.trim() || null,
      destination: form.destination.trim(),
      region: form.region,
      category: form.category as TripInput['category'],
      duration_days: Number(form.duration_days),
      duration_nights: Number(form.duration_nights),
      price: Number(form.price),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      image_url: form.image_url.trim(),
      highlights: form.highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
      is_active: form.is_active,
      is_featured: form.is_featured,
    }
    try {
      if (trip) {
        await updateTrip(trip.id, input)
      } else {
        await createTrip(input)
      }
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-slate-900">
        {trip ? t('admin.editTrip') : t('admin.newTrip')}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block text-sm font-medium text-slate-700 sm:col-span-3">
            {f('titleEn')} *
            <input required value={form.title_en} onChange={(e) => set('title_en', e.target.value)} className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-slate-700 sm:col-span-3 sm:col-start-1">
            {f('titleHi')}
            <input value={form.title_hi} onChange={(e) => set('title_hi', e.target.value)} className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-slate-700 sm:col-span-3">
            {f('titleMr')}
            <input value={form.title_mr} onChange={(e) => set('title_mr', e.target.value)} className={inputCls} />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          {f('descEn')} *
          <textarea required rows={4} value={form.description_en} onChange={(e) => set('description_en', e.target.value)} className={inputCls} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          {f('descHi')}
          <textarea rows={3} value={form.description_hi} onChange={(e) => set('description_hi', e.target.value)} className={inputCls} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          {f('descMr')}
          <textarea rows={3} value={form.description_mr} onChange={(e) => set('description_mr', e.target.value)} className={inputCls} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            {f('destination')} *
            <input required value={form.destination} onChange={(e) => set('destination', e.target.value)} className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            {f('region')} *
            <select value={form.region} onChange={(e) => set('region', e.target.value)} className={inputCls}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {t(`regions.${r}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            {f('category')} *
            <select value={form.category} onChange={(e) => set('category', e.target.value as Trip['category'])} className={inputCls}>
              {TRIP_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`categories.${c}`)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block text-sm font-medium text-slate-700">
            {f('days')} *
            <input type="number" min={1} required value={form.duration_days} onChange={(e) => set('duration_days', Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            {f('nights')} *
            <input type="number" min={0} required value={form.duration_nights} onChange={(e) => set('duration_nights', Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            {f('price')} *
            <input type="number" min={0} required value={form.price} onChange={(e) => set('price', Number(e.target.value))} className={inputCls} />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            {f('startDate')}
            <input type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            {f('endDate')}
            <input type="date" value={form.end_date} onChange={(e) => set('end_date', e.target.value)} className={inputCls} />
          </label>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">{f('image')} *</p>
          {form.image_url && (
            <img src={form.image_url} alt="" className="mt-2 h-40 w-full rounded-xl object-cover" />
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100">
              {uploading ? f('uploading') : f('uploadImage')}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
            </label>
            <input
              placeholder={f('imageUrl')}
              value={form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          {f('highlights')}
          <textarea rows={4} value={form.highlights} onChange={(e) => set('highlights', e.target.value)} className={inputCls} />
        </label>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="h-4 w-4 accent-brand-600" />
            {f('isActive')}
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} className="h-4 w-4 accent-brand-600" />
            {f('isFeatured')}
          </label>
        </div>

        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading || !form.image_url}
            className="rounded-full bg-brand-600 px-7 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {saving ? t('admin.saving') : t('admin.save')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-200 px-7 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
          >
            {t('admin.cancel')}
          </button>
        </div>
      </form>
    </div>
  )
}
