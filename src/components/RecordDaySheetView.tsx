import { CheckCircle2 } from 'lucide-react'
import type { Schema } from '../api/client'
import { AppIcon } from '../design-v2/primitives'

interface RecordDaySheetViewProps { record: Schema['DailyRecord']; onClose: () => void }
type Tone = 'income' | 'expense' | 'saving' | 'invest' | 'quest' | 'planned'
const iconBase = '/assets/roadmap/icons'
const meta: Record<Schema['DailyActivity']['activityType'], { tone: Tone; icon: string }> = {
  INCOME: { tone: 'income', icon: 'document' }, EXPENSE: { tone: 'expense', icon: 'wallet' }, SAVING: { tone: 'saving', icon: 'piggy' }, INVESTMENT: { tone: 'invest', icon: 'chart' }, QUEST: { tone: 'quest', icon: 'quest' }, ROUTINE: { tone: 'planned', icon: 'calendar' }, MYDATA_RECALCULATION: { tone: 'planned', icon: 'calendar' },
}
const formatAmount = (value: number) => `${value > 0 ? '+' : ''}${new Intl.NumberFormat('ko-KR').format(value)}원`
const dateLabel = (date: string) => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date(`${date}T00:00:00`))

export function RecordDaySheetView({ record, onClose }: RecordDaySheetViewProps) {
  return <div className="roadmap-sheet-layer" role="dialog" aria-modal="true" aria-labelledby="record-sheet-title"><button className="roadmap-sheet-dim" type="button" aria-label="상세 기록 닫기" onClick={onClose}/><section className="roadmap-sheet"><span className="sheet-handle"/><button className="sheet-close" type="button" aria-label="상세 기록 닫기" onClick={onClose}>×</button><header className="sheet-heading"><h2 id="record-sheet-title">{dateLabel(record.date)}</h2><span><AppIcon name="check"/> {record.status === 'PLANNED' ? '예정' : '기록 완료'}</span><p>오늘의 금융활동 {record.activities.length}개</p></header>
    <section className="sheet-section"><h3>활동 내역</h3><div className="sheet-activity-list">{record.activities.map((activity) => { const item = meta[activity.activityType]; return <div className="sheet-activity" data-tone={item.tone} key={activity.activityId}><span className="roadmap-icon-orb" data-tone={item.tone}><img src={`${iconBase}/roadmap-icon-${item.icon}.png`} alt=""/></span><div>{activity.primary ? <span className="activity-badge">대표 활동</span> : null}<strong>{activity.title}</strong>{activity.categoryLabels?.length ? <div className="activity-chips">{activity.categoryLabels.map((label) => <span key={label}>{label}</span>)}</div> : null}</div>{activity.amountKrw !== undefined ? <em>{formatAmount(activity.amountKrw)}</em> : null}<AppIcon name="chevron-right"/></div>})}</div></section>
    <section className="sheet-section"><h3>오늘 예산</h3><div className="budget-card"><p>사용 {record.budget.spentKrw.toLocaleString('ko-KR')}원 / 예산 {record.budget.budgetKrw.toLocaleString('ko-KR')}원</p><div><strong>{record.budget.remainingKrw.toLocaleString('ko-KR')}원 남음</strong><em>{Math.round(record.budget.usedBps / 100)}%</em></div><span><i style={{ width: `${Math.min(100, record.budget.usedBps / 100)}%` }}/></span></div></section>
    <section className="sheet-section"><h3>퀘스트 · 데이터 반영</h3><div className="quest-card"><span className="roadmap-icon-orb" data-tone="quest"><img src={`${iconBase}/roadmap-icon-quest.png`} alt=""/></span><div><strong>퀘스트 XP +{record.xpEarned}</strong><p><span>{record.recalculationSummary ?? '새 금융데이터 확인 후 스탯을 다시 계산해요.'}</span></p></div></div></section>
    {record.reflection ? <section className="sheet-section"><h3>오늘의 회고</h3><div className="quest-card"><CheckCircle2 size={22}/><div><strong>{record.reflection}</strong></div></div></section> : null}
  </section></div>
}
