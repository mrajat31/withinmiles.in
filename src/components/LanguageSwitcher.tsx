import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n'

export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { i18n } = useTranslation()
  const current = i18n.language?.slice(0, 2) ?? 'en'

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full p-0.5 text-xs font-semibold ${
        dark ? 'bg-white/10' : 'bg-slate-100'
      }`}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            current === lang.code
              ? dark
                ? 'bg-sand-400 text-brand-950 shadow-sm'
                : 'bg-brand-600 text-white shadow-sm'
              : dark
                ? 'text-white/70 hover:text-white'
                : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
