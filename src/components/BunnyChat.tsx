import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Trip } from '../lib/types'
import {
  fetchActiveTrips,
  sortUpcoming,
  tripTitle,
  formatPrice,
  WHATSAPP_NUMBER,
} from '../lib/trips'

interface Msg {
  from: 'bot' | 'user'
  text: string
}

type Step = 'start' | 'regions' | 'vibe' | 'trips' | 'pax' | 'date' | 'summary'

const VIBE_TO_CATEGORY: Record<string, string> = {
  mountains: 'trek',
  beach: 'beach',
  spiritual: 'pilgrimage',
  roadtrip: 'roadtrip',
}

export default function BunnyChat() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) ?? 'en'
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [step, setStep] = useState<Step>('start')
  const [trips, setTrips] = useState<Trip[]>([])
  const [shortlist, setShortlist] = useState<Trip[]>([])
  const [chosen, setChosen] = useState<Trip | null>(null)
  const [pax, setPax] = useState('')
  const [date, setDate] = useState('')
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const greeted = useRef(false)

  useEffect(() => {
    if (open && !greeted.current) {
      greeted.current = true
      fetchActiveTrips().then((data) => setTrips(sortUpcoming(data))).catch(() => setTrips([]))
      pushBot([t('bot.greeting1'), t('bot.greeting2')])
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, step])

  function pushBot(texts: string[]) {
    texts.forEach((text, i) => {
      setTimeout(() => setMessages((m) => [...m, { from: 'bot', text }]), 350 * (i + 1))
    })
  }

  function pushUser(text: string) {
    setMessages((m) => [...m, { from: 'user', text }])
  }

  function restart() {
    setChosen(null)
    setPax('')
    setDate('')
    setShortlist([])
    setStep('start')
    pushBot([t('bot.whatNext')])
  }

  function chooseBrowse() {
    pushUser(t('bot.optBrowse'))
    setStep('regions')
    pushBot([t('bot.pickRegion')])
  }

  function chooseThisWeek() {
    pushUser(t('bot.optThisWeek'))
    const list = trips.slice(0, 4)
    setShortlist(list)
    setStep('trips')
    pushBot([list.length ? t('bot.pickTrip') : t('bot.noTrips')])
  }

  function chooseVibe() {
    pushUser(t('bot.optSurprise'))
    setStep('vibe')
    pushBot([t('bot.vibeQ')])
  }

  function pickRegion(region: string) {
    pushUser(t(`regions.${region}`))
    const list = trips.filter((trip) => trip.region === region).slice(0, 4)
    setShortlist(list)
    setStep('trips')
    pushBot([list.length ? t('bot.pickTrip') : t('bot.noTrips')])
  }

  function pickVibe(vibe: string) {
    pushUser(t(`bot.vibe_${vibe}`))
    const cat = VIBE_TO_CATEGORY[vibe]
    let list = trips.filter((trip) => trip.category === cat)
    if (list.length === 0) list = trips
    setShortlist(list.slice(0, 4))
    setStep('trips')
    pushBot([t('bot.pickTrip')])
  }

  function pickTrip(trip: Trip) {
    pushUser(tripTitle(trip, lang))
    setChosen(trip)
    setStep('pax')
    pushBot([
      t('bot.tripPitch', {
        title: tripTitle(trip, lang),
        days: trip.duration_days,
        nights: trip.duration_nights,
        price: formatPrice(trip.price),
      }),
      t('bot.askPax'),
    ])
  }

  function pickPax(value: string) {
    pushUser(value)
    setPax(value)
    setStep('date')
    pushBot([t('bot.askDate')])
  }

  function pickDate(value: string) {
    pushUser(value)
    setDate(value)
    setStep('summary')
    pushBot([t('bot.summary'), t('bot.summaryNudge')])
  }

  function handleFreeText() {
    const q = input.trim()
    if (!q) return
    pushUser(q)
    setInput('')
    const needle = q.toLowerCase()
    const matches = trips.filter(
      (trip) =>
        trip.title_en.toLowerCase().includes(needle) ||
        tripTitle(trip, lang).toLowerCase().includes(needle) ||
        trip.destination.toLowerCase().includes(needle) ||
        trip.region.includes(needle),
    )
    if (matches.length > 0) {
      setShortlist(matches.slice(0, 4))
      setStep('trips')
      pushBot([t('bot.foundSome'), t('bot.pickTrip')])
    } else {
      setStep('start')
      pushBot([t('bot.fallback')])
    }
  }

  const whatsappUrl = (() => {
    if (!chosen) return `https://wa.me/${WHATSAPP_NUMBER}`
    const msg = `Hi withinmiles.in! Bunny helped me plan 🐰\nTrip: ${tripTitle(chosen, lang)} (${formatPrice(chosen.price)})\nTravellers: ${pax}\nPreferred dates: ${date}\nPlease help me book!`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
  })()

  const regionsWithTrips = [...new Set(trips.map((trip) => trip.region))]

  const chipCls =
    'rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-800 transition hover:bg-brand-100'

  function renderChips() {
    switch (step) {
      case 'start':
        return (
          <>
            <button className={chipCls} onClick={chooseThisWeek}>{t('bot.optThisWeek')}</button>
            <button className={chipCls} onClick={chooseBrowse}>{t('bot.optBrowse')}</button>
            <button className={chipCls} onClick={chooseVibe}>{t('bot.optSurprise')}</button>
            <a className={chipCls} href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
              {t('bot.optHuman')}
            </a>
          </>
        )
      case 'regions':
        return (
          <>
            {regionsWithTrips.map((region) => (
              <button key={region} className={chipCls} onClick={() => pickRegion(region)}>
                {t(`regions.${region}`)}
              </button>
            ))}
          </>
        )
      case 'vibe':
        return (
          <>
            {Object.keys(VIBE_TO_CATEGORY).map((vibe) => (
              <button key={vibe} className={chipCls} onClick={() => pickVibe(vibe)}>
                {t(`bot.vibe_${vibe}`)}
              </button>
            ))}
          </>
        )
      case 'trips':
        return (
          <>
            {shortlist.map((trip) => (
              <button key={trip.id} className={chipCls} onClick={() => pickTrip(trip)}>
                {tripTitle(trip, lang)} · {formatPrice(trip.price)}
              </button>
            ))}
            <button className={chipCls} onClick={restart}>{t('bot.restart')}</button>
          </>
        )
      case 'pax':
        return (
          <>
            {['1', '2', '3-5', '6+'].map((n) => (
              <button key={n} className={chipCls} onClick={() => pickPax(n)}>{n}</button>
            ))}
          </>
        )
      case 'date': {
        const chips: string[] = []
        if (chosen?.start_date) chips.push(chosen.start_date)
        chips.push(t('bot.flexible'))
        return (
          <>
            {chips.map((c) => (
              <button key={c} className={chipCls} onClick={() => pickDate(c)}>{c}</button>
            ))}
          </>
        )
      }
      case 'summary':
        return (
          <>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:scale-105"
            >
              {t('bot.bookNow')}
            </a>
            <button className={chipCls} onClick={restart}>{t('bot.restart')}</button>
          </>
        )
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t('bot.open')}
        className="fixed bottom-22 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-2xl shadow-lg shadow-brand-900/30 transition hover:scale-105"
      >
        {open ? <span className="text-xl text-white">✕</span> : '🐰'}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-40 right-5 z-50 flex max-h-[65vh] w-[21rem] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:w-[23rem]">
          <div className="flex items-center gap-3 bg-brand-900 px-4 py-3 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-xl">🐰</span>
            <div>
              <p className="font-semibold leading-tight">Bunny</p>
              <p className="text-xs text-brand-200/80">{t('bot.role')}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto bg-slate-50 px-3 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.from === 'bot'
                    ? 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-100'
                    : 'ml-auto bg-brand-600 text-white'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-3 py-3">
            {renderChips()}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleFreeText()
            }}
            className="flex items-center gap-2 border-t border-slate-100 bg-white px-3 py-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('bot.inputPlaceholder')}
              className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              aria-label="Send"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
