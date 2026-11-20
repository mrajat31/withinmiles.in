import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Member } from '../../lib/types'
import { fetchMembers, updateMember } from '../../lib/members'

export default function MembersManager() {
  const { t } = useTranslation()
  const f = (key: string) => t(`admin.membersTab.${key}`)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      setMembers(await fetchMembers())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  async function approve(m: Member) {
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    await updateMember(m.id, { status: 'active', expires_at: expires.toISOString().slice(0, 10) })
    await reload()
  }

  async function reject(m: Member) {
    await updateMember(m.id, { status: 'rejected', expires_at: null })
    await reload()
  }

  const badge = (m: Member) => {
    if (m.status === 'active' && m.expires_at && m.expires_at < new Date().toISOString().slice(0, 10)) {
      return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">{f('expired')}</span>
    }
    if (m.status === 'active')
      return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{f('active')}{m.expires_at ? ` · ${m.expires_at}` : ''}</span>
    if (m.status === 'rejected')
      return <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-600">{f('rejected')}</span>
    return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">⏳ {f('pending')}</span>
  }

  if (loading) return <p className="py-16 text-center text-slate-400">…</p>

  return (
    <div className="mt-8">
      <p className="text-sm text-slate-500">{f('hint')}</p>
      {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
      <ul className="mt-5 space-y-3">
        {members.map((m) => (
          <li key={m.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-900">{m.full_name}</span>
              <a href={`https://wa.me/${m.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-emerald-700 hover:underline">
                {m.whatsapp}
              </a>
              {m.city && <span className="text-sm text-slate-400">· {m.city}</span>}
              {badge(m)}
              <span className="ml-auto flex gap-2">
                {m.status !== 'active' && (
                  <button onClick={() => approve(m)} className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                    {f('approve')}
                  </button>
                )}
                {m.status === 'pending' && (
                  <button onClick={() => reject(m)} className="rounded-full border border-rose-200 px-4 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50">
                    {f('reject')}
                  </button>
                )}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-medium">{f('eligibility')}:</span>{' '}
              {m.eligibility === 'two_treks' ? f('eligTwo') : `${f('eligOne')}${m.referred_by ? ` (${m.referred_by})` : ''}`}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              <span className="font-medium text-slate-600">{f('treks')}:</span> {m.treks_done}
            </p>
          </li>
        ))}
        {members.length === 0 && <p className="py-10 text-center text-slate-400">{f('empty')}</p>}
      </ul>
    </div>
  )
}
