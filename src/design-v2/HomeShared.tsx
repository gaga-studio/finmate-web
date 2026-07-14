import { useEffect, useState } from 'react'

export const HOME_ASSET_DIR = '/assets/home'

export function HomeCharacterImg({
  src,
  emoji,
  className,
  alt = '',
}: {
  src: string
  emoji: string
  className?: string
  alt?: string
}) {
  const [broken, setBroken] = useState(false)

  useEffect(() => setBroken(false), [src])

  return broken ? (
    <span className={`home-char-fallback ${className ?? ''}`} aria-hidden="true">{emoji}</span>
  ) : (
    <img className={className} src={src} alt={alt} draggable={false} onError={() => setBroken(true)} />
  )
}

export function HomeHPBar({ percent, tone = 'green' }: { percent: number; tone?: 'green' | 'red' | 'blue' }) {
  return (
    <span className={`home-hp-bar ${tone}`}>
      <i style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
    </span>
  )
}
