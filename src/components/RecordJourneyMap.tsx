import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Schema } from '../api/client'
import styles from './RecordJourneyMap.module.css'

interface RecordJourneyMapProps {
  journey: Schema['DailyJourneyMonth']
  onChangeMonth: (offset: -1 | 1) => void
  onSelectDate: (date: string) => void
}

const activityLabels: Record<Schema['DailyActivity']['activityType'], string> = {
  INCOME: '수입',
  EXPENSE: '지출',
  SAVING: '저축',
  INVESTMENT: '투자',
  QUEST: '퀘스트',
  ROUTINE: '루틴',
  MYDATA_RECALCULATION: '데이터 반영',
}

function formatWon(value: number, signed = false) {
  const sign = signed && value > 0 ? '+' : ''
  return `${sign}${new Intl.NumberFormat('ko-KR').format(value)}원`
}

function visibleWeek(nodes: Schema['JourneyNode'][]) {
  const todayIndex = nodes.findIndex((node) => node.status === 'TODAY')
  if (todayIndex < 0) return nodes.slice(0, 7)
  const start = Math.max(0, Math.min(todayIndex - 4, nodes.length - 7))
  return nodes.slice(start, start + 7)
}

function nodeSummary(node: Schema['JourneyNode']) {
  const secondary = node.secondaryActivityTypes.slice(0, 2).map((type) => activityLabels[type])
  if (node.hiddenActivityCount > 0) secondary.push(`+${node.hiddenActivityCount}`)
  return secondary.join(' · ')
}

export function RecordJourneyMap({ journey, onChangeMonth, onSelectDate }: RecordJourneyMapProps) {
  const nodes = visibleWeek(journey.nodes)
  const [year, month] = journey.month.split('-')

  return (
    <>
      <header className={styles.header}>
        <div>
          <p>기록</p>
          <h1>30일 금융 여정</h1>
          <span>이번 달 돈의 흐름을 발판으로 따라가요.</span>
        </div>
        <img src="/assets/home/home-avatar-me.png" alt="내 캐릭터" />
      </header>

      <section className={styles.monthHeader} aria-label="기록 월 선택">
        <button type="button" aria-label="이전 달" onClick={() => onChangeMonth(-1)}><ChevronLeft size={20} /></button>
        <div>
          <strong>{year}년 {Number(month)}월</strong>
          <span>{journey.recordedDayCount} / {journey.dayCount}일 기록</span>
        </div>
        <button type="button" aria-label="다음 달" onClick={() => onChangeMonth(1)}><ChevronRight size={20} /></button>
      </section>

      <section className={styles.moneySummary} aria-label="월간 금융 요약">
        <div><span>수입</span><strong className={styles.income}>{formatWon(journey.moneySummary.incomeKrw, true)}</strong></div>
        <div><span>지출</span><strong className={styles.expense}>{formatWon(-journey.moneySummary.expenseKrw)}</strong></div>
        <div><span>저축</span><strong className={styles.saving}>{formatWon(journey.moneySummary.savingKrw, true)}</strong></div>
      </section>

      <section className={styles.journey} aria-label="현재 주간 금융 여정">
        <div className={styles.path} aria-hidden="true" />
        {nodes.map((node, index) => {
          const day = Number(node.date.slice(-2))
          const summary = nodeSummary(node)
          const isToday = node.status === 'TODAY'
          const amount = node.primaryActivity.amountKrw
          const tone = styles[node.primaryActivity.activityType.toLowerCase() as keyof typeof styles] ?? ''
          const alignment = index % 2 === 0 ? '' : styles.right
          const status = styles[node.status.toLowerCase() as keyof typeof styles] ?? ''
          return (
            <button
              aria-current={isToday ? 'date' : undefined}
              aria-label={`${node.date} 기록`}
              className={[styles.step, alignment, status].filter(Boolean).join(' ')}
              disabled={!node.detailAvailable}
              key={node.date}
              type="button"
              onClick={() => onSelectDate(node.date)}
            >
              <span className={styles.day}>{day}일</span>
              <strong className={tone}>{node.primaryActivity.title}</strong>
              {amount !== undefined && <b className={tone}>{formatWon(amount, true)}</b>}
              {summary && <small>{summary}</small>}
              {isToday && (
                <span className={styles.currentCharacter} aria-hidden="true">
                  <img src="/assets/home/home-avatar-me.png" alt="" />
                </span>
              )}
            </button>
          )
        })}
      </section>
    </>
  )
}
