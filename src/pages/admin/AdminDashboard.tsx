import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { fetchAllTrips, deleteTrip, updateTrip, formatPrice } from '../../lib/trips'
import { fetchMyProfile } from '../../lib/team'
import type { Trip, Profile } from '../../lib/types'
import TripForm from './TripForm'
import MyProfileForm from './MyProfileForm'
import TeamManager from './TeamManager'
import ReviewsManager from './ReviewsManager'
import MembersManager from './MembersManager'
import HeroManager from './HeroManager'
import GalleryManager from './GalleryManager'
import { parseTripTemplate } from '../../lib/templateParser'
import type { TripInput } from '../../lib/types'

type Tab = 'trips' | 'profile' | 'gallery' | 'team' | 'reviews' | 'members' | 'hero'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Trip | 'new' | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [importedInitial, setImportedInitial] = useState<Partial<TripInput> | null>(null)
  const [tab, setTab] = useState<Tab>('trips')
  const [me, setMe] = useState<Profile | null>(null)
  const isOwner = me?.role === 'owner'
  const canEditTrips = me?.role === 'owner' || me?.role === 'zone_head'
  const photoOnly = me?.role === 'volunteer'

  async function reload() {
    setLoading(true)
    try {
      setTrips(await fetchAllTrips())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
    fetchMyProfile().then(setMe).catch(() => setMe(null))
  }, [])

  async function handleApprove(trip: Trip) {
    await updateTrip(trip.id, { approval_status: 'approved' })
    await reload()
  }

  async function handleDelete(trip: Trip) {
    if (!window.confirm(t('admin.deleteConfirm'))) return
    await deleteTrip(trip.id)
    await reload()
  }

  if (editing) {
    return (
      <TripForm
        trip={editing === 'new' ? null : editing}
        initial={editing === 'new' ? importedInitial : null}
        photoOnly={photoOnly}
        onDone={async () => {
          setEditing(null)
          setImportedInitial(null)
          await reload()
        }}
        onCancel={() => {
          setEditing(null)
          setImportedInitial(null)
        }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-slate-900">{t('admin.dashboard')}</h1>
        <div className="flex items-center gap-3">
          {tab === 'trips' && canEditTrips && (
            <>
              <button
                onClick={() => setImportOpen((v) => !v)}
                className="rounded-full border border-brand-300 px-5 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                📄 {t('admin.tpl.button')}
              </button>
              <button
                onClick={() => setEditing('new')}
                className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                + {t('admin.addTrip')}
              </button>
            </>
          )}
          <button
            onClick={() => supabase?.auth.signOut()}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            {t('admin.signOut')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        {(['trips', 'profile', 'gallery', ...(isOwner ? (['team', 'reviews', 'members', 'hero'] as Tab[]) : [])] as Tab[]).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === tb ? 'bg-brand-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t(`admin.tab_${tb}`)}
          </button>
        ))}
      </div>

      {/* Template import panel */}
      {tab === 'trips' && importOpen && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="font-display text-xl font-semibold text-slate-900">{t('admin.tpl.title')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('admin.tpl.hint')}</p>
          <div className="mt-3">
            <label className="inline-block cursor-pointer rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-100">
              {t('admin.tpl.file')}
              <input
                type="file"
                accept=".txt,.md,text/plain"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => setImportText(String(reader.result ?? ''))
                  reader.readAsText(file)
                  e.target.value = ''
                }}
              />
            </label>
          </div>
          <textarea
            rows={10}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={t('admin.tpl.paste')}
            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-xs outline-none transition focus:border-brand-500"
          />
          {importError && <p className="mt-2 text-sm font-medium text-rose-600">{importError}</p>}
          <button
            onClick={() => {
              setImportError(null)
              try {
                const parsed = parseTripTemplate(importText)
                setImportedInitial(parsed)
                setImportOpen(false)
                setImportText('')
                setEditing('new')
              } catch (e) {
                setImportError(e instanceof Error ? e.message : String(e))
              }
            }}
            disabled={!importText.trim()}
            className="mt-3 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {t('admin.tpl.load')}
          </button>
        </div>
      )}

      {tab === 'profile' && <MyProfileForm />}
      {tab === 'gallery' && <GalleryManager canDeleteAll={isOwner} />}
      {tab === 'team' && isOwner && <TeamManager />}
      {tab === 'reviews' && isOwner && <ReviewsManager />}
      {tab === 'members' && isOwner && <MembersManager />}
      {tab === 'hero' && isOwner && <HeroManager />}
      {tab === 'trips' && (loading ? (
        <p className="py-20 text-center text-slate-400">{t('trips.loading')}</p>
      ) : trips.length === 0 ? (
        <p className="py-20 text-center text-slate-400">{t('admin.noTripsYet')}</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <img
                src={trip.image_url}
                alt=""
                className="h-16 w-24 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{trip.title_en}</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {trip.destination} · {formatPrice(trip.price)}
                </p>
                <div className="mt-1.5 flex gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      trip.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {trip.is_active ? t('admin.active') : t('admin.inactive')}
                  </span>
                  {trip.approval_status === 'pending' && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      ⏳ {t('admin.pendingBadge')}
                    </span>
                  )}
                  {trip.is_featured && (
                    <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-semibold text-sand-600">
                      ★ {t('admin.featuredBadge')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {isOwner && trip.approval_status === 'pending' && (
                  <button
                    onClick={() => handleApprove(trip)}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    {t('admin.approve')}
                  </button>
                )}
                <button
                  onClick={() => setEditing(trip)}
                  className="rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
                >
                  {photoOnly ? t('admin.updatePhoto') : t('admin.edit')}
                </button>
                {isOwner && (
                  <button
                    onClick={() => handleDelete(trip)}
                    className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    {t('admin.delete')}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}
