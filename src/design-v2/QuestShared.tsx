import { useState, type ReactNode } from 'react'

export const QUEST_ASSET_DIR = '/assets/quest'

export function QuestIcon({ src, fallback = '✦', tone = 'mint', size = 48 }: { src: string; fallback?: string; tone?: 'mint' | 'pink' | 'teal' | 'purple'; size?: number }) {
  const [broken, setBroken] = useState(false)
  return <span className={`quest-icon tone-${tone}`} style={{ width: size, height: size }}>{broken ? <span className="quest-icon-fallback">{fallback}</span> : <img src={src} alt="" draggable={false} onError={() => setBroken(true)}/>}</span>
}

export function QuestMascot({ size = 132 }: { size?: number }) {
  const [broken, setBroken] = useState(false)
  return <span className="quest-mascot" style={{ width: size, height: size }}>{broken ? <span className="quest-mascot-fallback">AI</span> : <img src={`${QUEST_ASSET_DIR}/quest-mascot-ai.png`} alt="AI 코치" draggable={false} onError={() => setBroken(true)}/>}</span>
}

export function QuestNumberedHeading({ n, title, action }: { n: number; title: string; action?: ReactNode }) {
  return <header className="quest-numbered-heading"><div className="quest-numbered-heading-title"><span className="quest-number-badge">{n}</span><h2>{title}</h2></div>{action}</header>
}

export function QuestProgressBar({ value, tone = 'teal' }: { value: number; tone?: 'teal' | 'orange' }) {
  const safe = Math.max(0, Math.min(100, value))
  return <span className={`quest-progress-track ${tone === 'orange' ? 'orange' : ''}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(safe)}><i style={{ width: `${safe}%` }}/></span>
}
