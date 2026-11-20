import { useTranslation } from 'react-i18next'
import { whatsappGeneralLink, INSTAGRAM_URL, WHATSAPP_NUMBER } from '../lib/trips'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900">{t('contact.title')}</h1>
        <p className="mt-3 text-slate-500">{t('contact.subtitle')}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <a
          href={whatsappGeneralLink()}
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
              <path d="M17.5 14.4l-2.1-1c-.3-.1-.6-.1-.8.2l-.6.8c-.2.2-.5.3-.8.2-1-.4-2.6-1.6-3.3-3.2-.1-.3 0-.6.2-.8l.7-.7c.2-.2.3-.6.1-.9l-1-2c-.2-.5-.8-.6-1.2-.3-1 .7-1.7 1.9-1.6 3.1.2 2 1.4 4.2 3.4 5.9 2 1.7 4.1 2.6 6.1 2.5 1.2 0 2.3-.9 2.8-2 .2-.4 0-1-.5-1.2l-1.4-.6zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
            </svg>
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900">{t('contact.whatsapp')}</h2>
          <p className="mt-2 text-sm text-slate-500">{t('contact.whatsappText')}</p>
          <p className="mt-4 font-semibold text-brand-700">
            +{WHATSAPP_NUMBER.slice(0, 2)} {WHATSAPP_NUMBER.slice(2, 7)} {WHATSAPP_NUMBER.slice(7)}
          </p>
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-rose-500/10 text-rose-500">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
              <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4 1.2-.1 1.6-.1 4.8-.1zm0 5.4a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8zm0 2a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zm5.6-3.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z" />
            </svg>
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900">{t('contact.instagram')}</h2>
          <p className="mt-2 text-sm text-slate-500">{t('contact.instagramText')}</p>
          <p className="mt-4 font-semibold text-rose-600">@withinmiles.in</p>
        </a>
      </div>

      <div className="mt-10 rounded-3xl bg-brand-900 p-10 text-center text-white">
        <h2 className="font-display text-2xl font-bold">{t('contact.customTitle')}</h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-200/80">{t('contact.customText')}</p>
        <a
          href={whatsappGeneralLink()}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-sand-400 px-7 py-3 font-semibold text-brand-950 transition hover:bg-sand-300"
        >
          {t('home.ctaButton')}
        </a>
      </div>
    </div>
  )
}
