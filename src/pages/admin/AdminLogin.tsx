import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError(false)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(true)
    setBusy(false)
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100"
      >
        <h1 className="font-display text-2xl font-bold text-slate-900">{t('admin.loginTitle')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('admin.loginSubtitle')}</p>

        <label className="mt-6 block text-sm font-medium text-slate-700">
          {t('admin.email')}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          {t('admin.password')}
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        {error && <p className="mt-3 text-sm font-medium text-rose-600">{t('admin.loginError')}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {busy ? t('admin.signingIn') : t('admin.signIn')}
        </button>
      </form>
    </div>
  )
}
