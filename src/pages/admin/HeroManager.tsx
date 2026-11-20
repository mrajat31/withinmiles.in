import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchHeroImageRows, addHeroImage, deleteHeroImage, type HeroImage } from '../../lib/heroImages'
import { uploadTripImage } from '../../lib/trips'

export default function HeroManager() {
  const { t } = useTranslation()
  const f = (key: string) => t(`admin.heroTab.${key}`)
  const [images, setImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      setImages(await fetchHeroImageRows())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const url = await uploadTripImage(file)
      await addHeroImage(url)
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mt-8">
      <p className="text-sm text-slate-500">{f('hint')}</p>

      <label className="mt-4 inline-block cursor-pointer rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
        {uploading ? f('uploading') : f('upload')}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
          }}
        />
      </label>

      {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}

      {loading ? (
        <p className="py-10 text-center text-slate-400">…</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <img src={img.image_url} alt="" className="h-36 w-full object-cover" />
              <button
                onClick={async () => {
                  if (window.confirm(f('deleteConfirm'))) {
                    await deleteHeroImage(img.id)
                    await reload()
                  }
                }}
                className="absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
              >
                {t('admin.delete')}
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <p className="col-span-full py-8 text-center text-slate-400">{f('empty')}</p>
          )}
        </div>
      )}
    </div>
  )
}
