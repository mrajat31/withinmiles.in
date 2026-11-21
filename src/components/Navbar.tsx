import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from './Logo'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
    isActive ? 'text-white bg-white/10' : 'text-white/70 hover:text-white'
  }`

export default function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/trips', label: t('nav.trips') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-950/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)} aria-label="withinmiles.in home">
          <Logo className="h-11 w-12 text-white" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher dark />
          <Link
            to="/community"
            className="rounded-full bg-sand-400 px-4 py-2 text-sm font-semibold text-brand-950 shadow-sm transition hover:bg-sand-300"
          >
            {t('nav.member')}
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-brand-950 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={navLinkClass}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <LanguageSwitcher dark />
            <Link
              to="/community"
              onClick={() => setOpen(false)}
              className="rounded-full bg-sand-400 px-4 py-2 text-sm font-semibold text-brand-950"
            >
              {t('nav.member')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
