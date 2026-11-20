import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Profile } from '../../lib/types'
import { fetchAllProfiles, updateProfileAdmin } from '../../lib/team'

export default function TeamManager() {
  const { t } = useTranslation()
  const f = (key: string) => t(`admin.teamTab.${key}`)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      setProfiles(await fetchAllProfiles())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  async function change(id: string, input: Partial<Pick<Profile, 'role' | 'is_public'>>) {
    setError(null)
    try {
      await updateProfileAdmin(id, input)
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  if (loading) return <p className="py-16 text-center text-slate-400">…</p>

  return (
    <div className="mt-8">
      <p className="text-sm text-slate-500">{f('hint')}</p>
      {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
      <ul className="mt-5 space-y-3">
        {profiles.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 font-bold text-slate-400">
              {p.photo_url ? (
                <img src={p.photo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                (p.full_name.trim()[0] ?? '?').toUpperCase()
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-900">{p.full_name || '—'}</p>
              <p className="text-sm text-slate-500">{p.title ?? ''}</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              {f('role')}
              <select
                value={p.role}
                onChange={(e) => change(p.id, { role: e.target.value as Profile['role'] })}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              >
                <option value="volunteer">{f('volunteer')}</option>
                <option value="zone_head">{f('zone_head')}</option>
                <option value="owner">{f('owner')}</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={p.is_public}
                onChange={(e) => change(p.id, { is_public: e.target.checked })}
                className="h-4 w-4 accent-brand-600"
              />
              {f('isPublic')}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
