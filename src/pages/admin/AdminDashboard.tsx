import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { fetchAllTrips, deleteTrip, formatPrice } from '../../lib/trips'
import type { Trip } from '../../lib/types'
import TripForm from './TripForm'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Trip | 'new' | null>(null)

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
  }, [])

  async function handleDelete(trip: Trip) {
    if (!window.confirm(t('admin.deleteConfirm'))) return
    await deleteTrip(trip.id)
    await reload()
  }

  if (editing) {
    return (
      <TripForm
        trip={editing === 'new' ? null : editing}
        onDone={async () => {
          setEditing(null)
          await reload()
        }}
        onCancel={() => setEditing(null)}
      />
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-slate-900">{t('admin.dashboard')}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing('new')}
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            + {t('admin.addTrip')}
          </button>
          <button
            onClick={() => supabase?.auth.signOut()}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            {t('admin.signOut')}
          </button>
        </div>
      </div>

      {loading ? (
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
                  {trip.is_featured && (
                    <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-semibold text-sand-600">
                      ★ {t('admin.featuredBadge')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(trip)}
                  className="rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
                >
                  {t('admin.edit')}
                </button>
                <button
                  onClick={() => handleDelete(trip)}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                >
                  {t('admin.delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
