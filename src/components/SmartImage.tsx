import { useState, type SyntheticEvent } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
}

/**
 * Thumbnail that adapts to the photo's shape: landscape photos fill the
 * box edge to edge, while portrait (vertical) photos are shown complete,
 * framed on a dark backdrop.
 */
export default function SmartImage({ src, alt, className = '' }: Props) {
  const [portrait, setPortrait] = useState(false)

  const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (img.naturalHeight > img.naturalWidth * 1.05) setPortrait(true)
  }

  if (!portrait) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={onLoad}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  // Vertical photo: show it complete, framed on a clean dark backdrop
  return (
    <div className="isolate h-full w-full overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-contain ${className}`}
      />
    </div>
  )
}
