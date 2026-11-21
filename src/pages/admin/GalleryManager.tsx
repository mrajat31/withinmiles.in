import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { GalleryPhoto, Trip } from '../../lib/types'
import {
  fetchGalleryPhotos,
  addGalleryPhoto,
  deleteGalleryPhoto,
  uploadGalleryImage,
} from '../../lib/gallery'
import { fetchAllTrips } from '../../lib/trips'
import { supabase } from '../../lib/supabase'

export default function GalleryManager({ canDeleteAll }: { canDeleteAll: boolean }) {
  const { t } = useTranslation()
  const g = (key: string, opts?: Record<string, unknown>) =>
    t(`admin.galleryTab.${key}`, { ...(opts ?? {}), defaultValue: '' }) as string
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [tripId, setTripId] = useState<string>('')
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [myId, setMyId] = useState<string | null>(null)

  async function reload() {
    setPhotos(await fetchGalleryPhotos().catch(() => []))
  }

  useEffect(() => {
    reload()
    fetchAllTrips().then(setTrips).catch(() => setTrips([]))
    supabase?.auth.getUser().then(({ data }) => setMyId(data.user?.id ?? null))
  }, [])

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    setError(null)
    try {
      const list = Array.from(files)
      for (let i = 0; i < list.length; i++) {
        setProgress(g('uploading', { current: i + 1, total: list.length }))
        const url = await uploadGalleryImage(list[i])
        await addGalleryPhoto({
          trip_id: tripId || null,
          image_url: url,
          caption: caption.trim() || null,
        })
      }
      setCaption('')
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
      setProgress(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(photo: GalleryPhoto) {
    if (!window.confirm(g('deleteConfirm'))) return
    try {
      await deleteGalleryPhoto(photo.id)
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const tripName = (id: string | null) => trips.find((x) => x.id === id)?.title_en ?? g('general')

  return (
    <div className="mt-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="font-display text-xl font-semibold text-slate-900">{g('title')}</h2>
        <p className="mt-1 text-sm text-slate-500">{g('hint')}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            {g('trip')}
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500"
            >
              <option value="">{g('general')}</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.title_en}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            {g('caption')}
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={g('captionPlaceholder')}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500"
            />
          </label>
        </div>

        <label className={`mt-4 inline-block cursor-pointer rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 ${busy ? 'pointer-events-none opacity-60' : ''}`}>
          {progress ?? `📷 ${g('upload')}`}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
        {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
      </div>

      {photos.length === 0 ? (
        <p className="py-16 text-center text-slate-400">{g('empty')}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <figure key={p.id} className="group relative overflow-hidden rounded-xl">
              <img src={p.image_url} alt="" loading="lazy" className="h-40 w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-xs text-white">
                {p.caption || tripName(p.trip_id)}
              </figcaption>
              {(canDeleteAll || (myId !== null && p.uploaded_by === myId)) && (
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  aria-label={g('delete')}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white opacity-0 transition hover:bg-rose-600 group-hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
