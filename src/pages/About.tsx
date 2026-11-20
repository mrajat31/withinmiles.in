import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Profile } from '../lib/types'
import { fetchPublicProfiles } from '../lib/team'

const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1600&q=80'

export default function About() {
  const { t } = useTranslation()
  const [team, setTeam] = useState<Profile[]>([])

  useEffect(() => {
    fetchPublicProfiles().then(setTeam).catch(() => setTeam([]))
  }, [])

  const missions = [
    { title: t('about.mission1Title'), text: t('about.mission1Text') },
    { title: t('about.mission2Title'), text: t('about.mission2Text') },
    { title: t('about.mission3Title'), text: t('about.mission3Text') },
  ]

  const why = [
    { title: t('home.why1Title'), text: t('home.why1Text') },
    { title: t('home.why2Title'), text: t('home.why2Text') },
    { title: t('home.why3Title'), text: t('home.why3Text') },
    { title: t('home.why4Title'), text: t('home.why4Text') },
  ]

  return (
    <div>
      <section className="relative h-[40vh] min-h-[300px]">
        <img src={ABOUT_IMAGE} alt="Travellers on a trail" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-brand-950/60" />
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <div>
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{t('about.title')}</h1>
            <p className="mt-3 text-lg text-white/80">{t('about.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-lg leading-relaxed text-slate-600">{t('about.story1')}</p>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">{t('about.story2')}</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900">{t('home.whyTitle')}</h2>
          <p className="mt-2 text-slate-500">{t('home.whySubtitle')}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the team */}
      {team.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900">{t('team.title')}</h2>
            <p className="mt-2 text-slate-500">{t('team.subtitle')}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-slate-100"
              >
                <span className="mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-brand-900 font-display text-3xl font-semibold text-sand-300">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.full_name} className="h-full w-full object-cover" />
                  ) : (
                    (member.full_name.trim()[0] ?? '?').toUpperCase()
                  )}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">
                  {member.full_name}
                </h3>
                {member.title && (
                  <p className="mt-1 text-sm font-medium text-sand-600">{member.title}</p>
                )}
                {member.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{member.bio}</p>
                )}
                {member.instagram && (
                  <a
                    href={`https://www.instagram.com/${member.instagram}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-rose-600 hover:underline"
                  >
                    @{member.instagram}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-slate-900">
            {t('about.missionTitle')}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {missions.map((m, i) => (
              <div key={m.title} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
                <span className="font-display text-4xl font-bold text-brand-200">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
