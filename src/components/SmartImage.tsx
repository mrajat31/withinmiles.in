import { useState, type SyntheticEvent } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
}

/**
 * Thumbnail that adapts to the photo's shape: landscape photos fill the
 * box edge to edge, while portrait (vertical) photos are shown complete
 * with a blurred copy filling the sides.
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

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900">
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-lg"
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`relative z-[1] h-full w-full object-contain ${className}`}
      />
    </div>
  )
}
