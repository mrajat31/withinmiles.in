import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Profile } from '../../lib/types'
import { fetchAllProfiles, updateProfileAdmin, createTeamLogin } from '../../lib/team'

const inputCls =
  'mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export default function TeamManager() {
  const { t } = useTranslation()
  const f = (key: string) => t(`admin.teamTab.${key}`)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError(null)
    setCreated(false)
    try {
      await createTeamLogin(newEmail.trim(), newPassword)
      setCreated(true)
      setNewEmail('')
      setNewPassword('')
      setTimeout(reload, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setCreating(false)
    }
  }

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
      {/* Add a team member */}
      <form onSubmit={handleCreate} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="font-display text-xl font-semibold text-slate-900">{f('addTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{f('addHint')}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            {t('admin.email')} *
            <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            {f('tempPassword')} *
            <input required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} />
          </label>
        </div>
        {created && <p className="mt-3 text-sm font-medium text-emerald-600">{f('createdMsg')}</p>}
        <button
          type="submit"
          disabled={creating}
          className="mt-4 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {creating ? '…' : f('createBtn')}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">{f('hint')}</p>
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
              <p className="truncate font-semibold text-slate-900">{p.full_name || '-'}</p>
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
