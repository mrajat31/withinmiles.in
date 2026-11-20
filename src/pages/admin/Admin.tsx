import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useTranslation } from 'react-i18next'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

export default function Admin() {
  const { t } = useTranslation()
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setReady(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="rounded-3xl bg-amber-50 p-10 ring-1 ring-amber-200">
          <h1 className="font-display text-2xl font-bold text-amber-900">{t('admin.setupTitle')}</h1>
          <p className="mt-4 leading-relaxed text-amber-800">{t('admin.setupText')}</p>
        </div>
      </div>
    )
  }

  if (!ready) return <p className="py-32 text-center text-slate-400">…</p>

  return session ? <AdminDashboard /> : <AdminLogin />
}
