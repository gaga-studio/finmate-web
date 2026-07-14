import type { ReactNode } from 'react'
import { Chevron, IconBadge, type IconName } from './primitives'

export function ScreenLead({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string | null; children?: ReactNode }) {
  return <section className="app-lead-panel"><span>{eyebrow}</span><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}{children}</section>
}

export function AppSectionCard({ children, className }: { children: ReactNode; className?: string }) {
  return <article className={`app-section-card ${className ?? ''}`}>{children}</article>
}

export function SectionHeading({ eyebrow, title, subtitle, actionLabel = '보기', onAction }: { eyebrow?: string | null; title: string; subtitle?: string | null; actionLabel?: string; onAction?: () => void }) {
  return <div className="app-section-heading"><div>{eyebrow ? <span>{eyebrow}</span> : null}<h2>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</div>{onAction ? <button className="app-section-link" type="button" onClick={onAction}>{actionLabel}<Chevron/></button> : null}</div>
}

export function ConsentRow({ checked, title, onChange }: { checked: boolean; title: string; onChange: (checked: boolean) => void }) {
  return <label className={`consent-row ${checked ? 'is-checked' : ''}`}><span><strong>{title}</strong></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)}/><i aria-hidden="true"/></label>
}

export function BottomSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const titleId = `bottom-sheet-${title.replace(/\s+/g, '-')}`
  return <div className="filter-sheet" role="presentation"><button className="filter-sheet-backdrop" type="button" aria-label="선택 닫기" onClick={onClose}/><section className="filter-sheet-panel" role="dialog" aria-modal="true" aria-labelledby={titleId}><div className="filter-sheet-handle" aria-hidden="true"/><header className="filter-sheet-header"><h2 id={titleId}>{title}</h2><button className="filter-sheet-close" type="button" onClick={onClose}>닫기</button></header>{children}</section></div>
}

export function EmptyState({ title, subtitle, icon = 'spark' }: { title: string; subtitle?: string | null; icon?: IconName }) {
  return <div className="empty-state-panel"><IconBadge icon={icon} tone="muted"/><div><strong>{title}</strong>{subtitle ? <p>{subtitle}</p> : null}</div></div>
}

export function SegmentedControl({ items, activeId, onChange, ariaLabel = '화면 내용 전환' }: { items: Array<{ id: string; label: string; disabled?: boolean }>; activeId: string; onChange: (id: string) => void; ariaLabel?: string }) {
  return <div className="segmented-control" role="tablist" aria-label={ariaLabel}>{items.map((item) => <button className={item.id === activeId ? 'is-active' : ''} type="button" role="tab" aria-selected={item.id === activeId} disabled={item.disabled} onClick={() => onChange(item.id)} key={item.id}>{item.label}</button>)}</div>
}
