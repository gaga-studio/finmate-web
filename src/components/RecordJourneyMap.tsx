import type { CSSProperties } from 'react'
import type { Schema } from '../api/client'
import { AppIcon } from '../design-v2/primitives'

interface RecordJourneyMapProps {
  journey: Schema['DailyJourneyMonth']
  pointBalance: number
  onChangeMonth: (offset: -1 | 1) => void
  onSelectDate: (date: string) => void
}

type Tone = 'income' | 'expense' | 'saving' | 'invest' | 'quest' | 'planned' | 'locked'
const iconBase = '/assets/roadmap/icons'
const visibleNodeCount = 7
const positions = [[55,4],[35,8],[62,12],[45,16],[66,20],[42,24],[58,28],[34,32],[50,36],[68,40],[40,44],[60,48],[32,52],[48,56],[67,60],[43,64],[28,68],[52,72],[71,76],[47,80],[30,84],[58,88],[72,92],[44,96],[24,100],[50,104],[68,108],[40,112],[58,116],[48,120]] as const
const labels: Record<Schema['DailyActivity']['activityType'], string> = { INCOME: '수입', EXPENSE: '지출', SAVING: '저축', INVESTMENT: '투자', QUEST: '퀘스트', ROUTINE: '루틴', MYDATA_RECALCULATION: '데이터 반영' }

const toneFor = (node: Schema['JourneyNode']): Tone => {
  if (node.status === 'LOCKED') return 'locked'
  if (node.status === 'PLANNED' || node.status === 'EMPTY') return 'planned'
  return node.primaryActivity.activityType === 'INCOME' ? 'income' : node.primaryActivity.activityType === 'EXPENSE' ? 'expense' : node.primaryActivity.activityType === 'SAVING' ? 'saving' : node.primaryActivity.activityType === 'INVESTMENT' ? 'invest' : 'quest'
}
const iconFor = (tone: Tone) => `${iconBase}/roadmap-icon-${tone === 'income' ? 'document' : tone === 'expense' ? 'wallet' : tone === 'saving' ? 'piggy' : tone === 'invest' ? 'chart' : tone === 'quest' ? 'quest' : tone === 'locked' ? 'trophy' : 'calendar'}.png`
const amount = (value: number) => `${value > 0 ? '+' : ''}${new Intl.NumberFormat('ko-KR').format(value)}원`

export function RecordJourneyMap({ journey, pointBalance, onChangeMonth, onSelectDate }: RecordJourneyMapProps) {
  const [year, month] = journey.month.split('-')
  const todayIndex = journey.nodes.findIndex((node) => node.status === 'TODAY')
  const latestRecordedIndex = journey.nodes.reduce(
    (latest, node, index) => node.status === 'RECORDED' ? index : latest,
    -1,
  )
  const focusIndex = todayIndex >= 0 ? todayIndex : Math.max(0, latestRecordedIndex)
  const visibleStart = Math.max(0, Math.min(journey.nodes.length - visibleNodeCount, focusIndex - 4))
  const visibleNodes = journey.nodes.slice(visibleStart, visibleStart + visibleNodeCount)
  return <section className="roadmap-screen" aria-labelledby="roadmap-title">
    <header className="roadmap-hero"><div className="roadmap-status" aria-hidden="true"><strong>9:41</strong><span><i/><i/><i/></span></div><div className="roadmap-topline"><div><h1 id="roadmap-title">30일 금융 여정</h1><p>이번 달 돈의 흐름을 발판으로 따라가요</p></div><div className="roadmap-wallet" aria-label={`보유 꾸미기 포인트 ${pointBalance.toLocaleString('ko-KR')}`}><span className="coin">★</span><strong>{pointBalance.toLocaleString('ko-KR')}</strong></div><div className="roadmap-avatar" aria-hidden="true"><span/></div></div></header>
    <section className="roadmap-month-card" aria-label={`${year}년 ${Number(month)}월 요약`}><div className="roadmap-month-title"><button type="button" aria-label="이전 달" onClick={() => onChangeMonth(-1)}><AppIcon name="chevron-left"/></button><strong>{year}년 {Number(month)}월</strong><button type="button" aria-label="다음 달" onClick={() => onChangeMonth(1)}><AppIcon name="chevron-right"/></button><span><em>{journey.recordedDayCount}</em> / {journey.dayCount}일 기록</span></div><div className="roadmap-metrics"><div className="roadmap-metric" data-tone="income"><span>수입</span><strong>+{journey.moneySummary.incomeKrw.toLocaleString('ko-KR')}원</strong></div><div className="roadmap-metric" data-tone="expense"><span>지출</span><strong>-{journey.moneySummary.expenseKrw.toLocaleString('ko-KR')}원</strong></div><div className="roadmap-metric" data-tone="saving"><span>저축</span><strong>+{journey.moneySummary.savingKrw.toLocaleString('ko-KR')}원</strong></div></div></section>
    <main className="roadmap-stage" aria-label={`${year}년 ${Number(month)}월 30일 금융 여정`}><div className="roadmap-map-bg" aria-hidden="true"/><div className="roadmap-stones">{visibleNodes.map((node, index) => { const tone = toneFor(node); const position = positions[index]; const style = { '--stone-x': `${position[0]}%`, '--stone-y': `${position[1]}%` } as CSSProperties; const today = node.status === 'TODAY'; const tags = node.secondaryActivityTypes.slice(0, 2).map((type) => labels[type]); if (node.hiddenActivityCount > 0) tags.push(`+${node.hiddenActivityCount}`); return <button className={`roadmap-stone is-${tone}${node.status === 'RECORDED' || today ? ' is-recorded' : ''}${today ? ' is-primary' : ''}`} style={style} type="button" disabled={!node.detailAvailable} aria-current={today ? 'date' : undefined} aria-label={`${node.date} 기록 상세 보기`} onClick={() => onSelectDate(node.date)} key={node.date}><span className="stone-icon"><img src={iconFor(tone)} alt=""/></span><span className="stone-copy"><strong>{Number(node.date.slice(-2))}일</strong><em>{node.primaryActivity.title}{node.primaryActivity.amountKrw !== undefined ? ` ${amount(node.primaryActivity.amountKrw)}` : ''}</em></span><span className="stone-tags">{tags.map((tag) => <i key={tag}>{tag}</i>)}</span></button> })}</div></main>
  </section>
}
