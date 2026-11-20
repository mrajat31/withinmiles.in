import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { submitMembership } from '../lib/members'
import { isSupabaseConfigured } from '../lib/supabase'
import type { Member } from '../lib/types'

const inputCls =
  'mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export default function Community() {
  const { t } = useTranslation()
  const c = (key: string) => t(`communityPage.${key}`)
  const [form, setForm] = useState({
    full_name: '',
    whatsapp: '',
    email: '',
    city: '',
    eligibility: 'two_treks' as Member['eligibility'],
    treks_done: '',
    referred_by: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await submitMembership({
        full_name: form.full_name.trim(),
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim() || null,
        city: form.city.trim() || null,
        eligibility: form.eligibility,
        treks_done: form.treks_done.trim(),
        referred_by: form.eligibility === 'one_trek_with_member' ? form.referred_by.trim() || null : null,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const benefits = [c('benefit1'), c('benefit2'), c('benefit3')]

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-950 py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sand-300">
            withinmiles.in
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            {c('title')}
          </h1>
          <p className="mt-4 text-lg text-brand-200/80">{c('subtitle')}</p>
          <p className="mt-6 inline-block rounded-full bg-sand-400 px-6 py-2.5 font-display text-xl font-semibold text-brand-950">
            {c('price')}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {/* Benefits */}
        <div className="grid gap-4 sm:grid-cols-3">
          {benefits.map((b) => (
            <div key={b} className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
              <p className="text-2xl">✨</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{b}</p>
            </div>
          ))}
        </div>

        {/* Eligibility */}
        <div className="mt-8 rounded-2xl bg-sand-50 p-6 ring-1 ring-sand-200">
          <h2 className="font-display text-lg font-semibold text-slate-900">{c('eligTitle')}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="flex gap-2"><span className="font-bold text-sand-600">✓</span>{c('eligA')}</li>
            <li className="flex gap-2"><span className="font-bold text-sand-600">✓</span>{c('eligB')}</li>
          </ul>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="mt-10 rounded-3xl bg-emerald-50 p-10 text-center ring-1 ring-emerald-200">
            <p className="text-3xl">🎉</p>
            <p className="mt-3 text-lg font-semibold text-emerald-800">{c('success')}</p>
          </div>
        ) : !isSupabaseConfigured ? (
          <p className="mt-10 text-center text-slate-400">{t('trips.error')}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <h2 className="font-display text-2xl font-semibold text-slate-900">{c('formTitle')}</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                {c('name')} *
                <input required value={form.full_name} onChange={(e) => set('full_name', e.target.value)} className={inputCls} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                {c('whatsapp')} *
                <input required type="tel" placeholder="+91" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} className={inputCls} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                {c('email')}
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                {c('city')}
                <input value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls} />
              </label>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-slate-700">{c('eligLabel')} *</p>
              <div className="mt-2 space-y-2">
                <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 has-checked:border-brand-500 has-checked:bg-brand-50">
                  <input
                    type="radio"
                    name="eligibility"
                    checked={form.eligibility === 'two_treks'}
                    onChange={() => set('eligibility', 'two_treks')}
                    className="mt-0.5 accent-brand-600"
                  />
                  {c('eligA')}
                </label>
                <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 has-checked:border-brand-500 has-checked:bg-brand-50">
                  <input
                    type="radio"
                    name="eligibility"
                    checked={form.eligibility === 'one_trek_with_member'}
                    onChange={() => set('eligibility', 'one_trek_with_member')}
                    className="mt-0.5 accent-brand-600"
                  />
                  {c('eligB')}
                </label>
              </div>
            </div>

            <label className="mt-5 block text-sm font-medium text-slate-700">
              {c('treksLabel')} *
              <textarea required rows={3} placeholder={c('treksPlaceholder')} value={form.treks_done} onChange={(e) => set('treks_done', e.target.value)} className={inputCls} />
            </label>

            {form.eligibility === 'one_trek_with_member' && (
              <label className="mt-5 block text-sm font-medium text-slate-700">
                {c('referredLabel')} *
                <input required value={form.referred_by} onChange={(e) => set('referred_by', e.target.value)} className={inputCls} />
              </label>
            )}

            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
              {c('feeNote')}
            </p>

            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-full bg-brand-600 py-3.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {c('submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
