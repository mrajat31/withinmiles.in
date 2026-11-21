import { useEffect, useRef } from 'react'

export interface LightboxItem {
  src: string
  caption?: string | null
}

interface Props {
  items: LightboxItem[]
  index: number
  onClose: () => void
  onIndex: (i: number) => void
}

/** Full-screen photo viewer: arrows, keyboard, and swipe on mobile. */
export default function Lightbox({ items, index, onClose, onIndex }: Props) {
  const touchX = useRef<number | null>(null)
  const item = items[index]

  const prev = () => onIndex((index - 1 + items.length) % items.length)
  const next = () => onIndex((index + 1) % items.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={onClose}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (dx > 50) prev()
        else if (dx < -50) next()
      }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25"
      >
        ×
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25 sm:grid"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25 sm:grid"
          >
            →
          </button>
        </>
      )}

      <figure className="max-h-full max-w-full p-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={item.src}
          alt={item.caption ?? ''}
          className="max-h-[85vh] max-w-full rounded-lg object-contain"
        />
        <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-white/80">
          <span>{item.caption}</span>
          {items.length > 1 && (
            <span className="shrink-0 text-white/50">
              {index + 1} / {items.length}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  )
}
