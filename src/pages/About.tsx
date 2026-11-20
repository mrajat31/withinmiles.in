import { useTranslation } from 'react-i18next'

const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1600&q=80'

export default function About() {
  const { t } = useTranslation()

  const missions = [
    { title: t('about.mission1Title'), text: t('about.mission1Text') },
    { title: t('about.mission2Title'), text: t('about.mission2Text') },
    { title: t('about.mission3Title'), text: t('about.mission3Text') },
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
