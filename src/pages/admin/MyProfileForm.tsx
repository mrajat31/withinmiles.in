import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Profile } from '../../lib/types'
import { fetchMyProfile, upsertMyProfile } from '../../lib/team'
import { uploadTripImage } from '../../lib/trips'

const inputCls =
  'mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export default function MyProfileForm() {
  const { t } = useTranslation()
  const f = (key: string) => t(`admin.profile.${key}`)
  const [loaded, setLoaded] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState({
    full_name: '',
    title: '',
    bio: '',
    photo_url: '',
    instagram: '',
    is_public: true,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMyProfile()
      .then((p) => {
        setProfile(p)
        if (p) {
          setForm({
            full_name: p.full_name,
            title: p.title ?? '',
            bio: p.bio ?? '',
            photo_url: p.photo_url ?? '',
            instagram: p.instagram ?? '',
            is_public: p.is_public,
          })
        }
      })
      .finally(() => setLoaded(true))
  }, [])

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handlePhoto(file: File) {
    setUploading(true)
    setError(null)
    try {
      set('photo_url', await uploadTripImage(file))
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
    try {
      await upsertMyProfile({
        full_name: form.full_name.trim(),
        title: form.title.trim() || null,
        bio: form.bio.trim() || null,
        photo_url: form.photo_url.trim() || null,
        instagram: form.instagram.trim().replace(/^@/, '') || null,
        is_public: form.is_public,
      })
      setSaved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return <p className="py-16 text-center text-slate-400">…</p>

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl space-y-5">
      {profile?.role === 'owner' && (
        <p className="rounded-xl bg-sand-50 px-4 py-2.5 text-sm font-medium text-sand-600 ring-1 ring-sand-200">
          ★ {f('adminBadge')}
        </p>
      )}

      <div className="flex items-center gap-5">
        <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-2xl font-bold text-slate-400">
          {form.photo_url ? (
            <img src={form.photo_url} alt="" className="h-full w-full object-cover" />
          ) : (
            (form.full_name.trim()[0] ?? '?').toUpperCase()
          )}
        </span>
        <label className="cursor-pointer rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-100">
          {uploading ? f('uploading') : f('uploadPhoto')}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handlePhoto(file)
            }}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        {f('fullName')} *
        <input required value={form.full_name} onChange={(e) => set('full_name', e.target.value)} className={inputCls} />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        {f('roleTitle')}
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder={f('roleTitlePlaceholder')}
          className={inputCls}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        {f('bio')}
        <textarea rows={3} value={form.bio} onChange={(e) => set('bio', e.target.value)} className={inputCls} />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Instagram
        <input
          value={form.instagram}
          onChange={(e) => set('instagram', e.target.value)}
          placeholder="username"
          className={inputCls}
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={form.is_public}
          onChange={(e) => set('is_public', e.target.checked)}
          className="h-4 w-4 accent-brand-600"
        />
        {f('isPublic')}
      </label>

      {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
      {saved && <p className="text-sm font-medium text-emerald-600">{f('saved')}</p>}

      <button
        type="submit"
        disabled={saving || uploading}
        className="rounded-full bg-brand-600 px-7 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {saving ? t('admin.saving') : f('save')}
      </button>
    </form>
  )
}
