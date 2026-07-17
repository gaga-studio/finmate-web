import { useState, type ReactNode } from 'react'
import { IconBadge } from './primitives'

export type MateSpecies = 'me' | 'otter' | 'rabbit' | 'bear' | 'bird' | 'coach'
type RpgIconName = 'briefcase' | 'chest' | 'coffee' | 'coins' | 'heart' | 'medal' | 'piggy' | 'potion' | 'quiz' | 'shield' | 'swords' | 'xp'

const assets: Record<MateSpecies, { src: string; glyph: string; bg: string }> = {
  me: { src: '/assets/characters/mate/mate-avatar-me.png', glyph: '●', bg: 'linear-gradient(160deg, #EAFBF0, #BEE9CC)' },
  otter: { src: '/assets/characters/mate/mate-char-otter.png', glyph: '●', bg: 'linear-gradient(160deg, #E4EAFB, #B9C6EF)' },
  rabbit: { src: '/assets/characters/mate/mate-char-rabbit.png', glyph: '●', bg: 'linear-gradient(160deg, #EAFBF0, #BEE9CC)' },
  bear: { src: '/assets/characters/mate/mate-char-bear.png', glyph: '●', bg: 'linear-gradient(160deg, #FFF3DC, #F4D89A)' },
  bird: { src: '/assets/characters/mate/mate-char-bird.png', glyph: '●', bg: 'linear-gradient(160deg, #ECE5FF, #C6B7F2)' },
  coach: { src: '/assets/characters/mate/mate-coach-wizard.png', glyph: '●', bg: 'linear-gradient(160deg, #FFF3DC, #F4D89A)' },
}

export function MateAvatar({ species, size = 56, locked = false, fit = 'cover', badge, className }: { species: MateSpecies; size?: number; locked?: boolean; fit?: 'cover' | 'contain'; badge?: ReactNode; className?: string }) {
  const [broken, setBroken] = useState(false)
  const meta = assets[species]
  return <span className={`mate-avatar${locked ? ' is-locked' : ''}${className ? ` ${className}` : ''}`} style={{ width: size, height: size, background: meta.bg }}>{!broken ? <img src={meta.src} alt="" draggable={false} style={{ objectFit: fit }} onError={() => setBroken(true)}/> : <span className="mate-avatar-fallback" aria-hidden="true" style={{ fontSize: Math.round(size * .52) }}>{meta.glyph}</span>}{badge ? <span className="mate-avatar-badge">{badge}</span> : null}</span>
}

export function RpgIcon({ name, fallback = '✦', size = 40, className }: { name: RpgIconName; fallback?: string; size?: number; className?: string }) {
  const [broken, setBroken] = useState(false)
  return <span className={`rpg-icon${className ? ` ${className}` : ''}`} style={{ width: size, height: size }}>{!broken ? <img src={`/assets/rpg-icons/rpg-icon-${name}.png`} alt="" draggable={false} onError={() => setBroken(true)}/> : <span className="rpg-icon-fallback" aria-hidden="true" style={{ fontSize: Math.round(size * .46) }}>{fallback}</span>}</span>
}

export function MateSectionCard({ eyebrowIcon, title, subtitle, action, children, className }: { eyebrowIcon?: string; title: ReactNode; subtitle?: ReactNode; action?: ReactNode; children?: ReactNode; className?: string }) {
  return <section className={`mate-card${className ? ` ${className}` : ''}`}><header className="mate-card-head"><div className="mate-card-head-title">{eyebrowIcon ? <IconBadge icon={eyebrowIcon} tone="teal"/> : null}<div><h2>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</div></div>{action}</header>{children}</section>
}

export function MateCoachCard({ message }: { message: ReactNode }) {
  return <section className="mate-coach-card"><MateAvatar species="coach" size={64} fit="contain" className="mate-coach-avatar"/><div className="mate-coach-copy"><span className="mate-coach-name">코치 설명</span><p>{message}</p></div></section>
}

export function MateStatBadge({ icon, label, tone = 'teal' }: { icon: string; label: string; tone?: string }) {
  return <span className="mate-stat-badge"><IconBadge icon={icon} tone={tone}/><b>{label}</b></span>
}

const routineStepLabels = ['루틴 확인', '강도 선택', '적용 완료'] as const

export function RoutineSteps({ current }: { current: 1 | 2 | 3 }) {
  return <ol className="routine-steps" aria-label="루틴 적용 단계">{routineStepLabels.map((label, index) => { const step = index + 1; const state = step < current ? 'done' : step === current ? 'current' : 'todo'; return <li className={`is-${state}`} aria-current={step === current ? 'step' : undefined} key={label}><i aria-hidden="true">{step < current ? '✓' : step}</i><span>{label}</span></li> })}</ol>
}

export function MatePointPill({ value }: { value: number }) {
  return <span className="mate-point-pill"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#FFD35C" stroke="#E8A93A" strokeWidth="1.5"/><path d="m12 6 1.4 4.4L18 12l-4.6 1.6L12 18l-1.4-4.4L6 12l4.6-1.6L12 6Z" fill="#FFF3D0"/></svg><b className="num">{value.toLocaleString('ko-KR')}</b></span>
}
