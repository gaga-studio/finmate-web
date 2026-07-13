import { useMemo, useState, type CSSProperties } from 'react'
import type { Navigate } from './navigation'
import { AppIcon } from './uiPrimitives'

type JourneyTone = 'expense' | 'income' | 'saving' | 'invest' | 'quest' | 'planned' | 'locked'

type MonthKey = '2026-06' | '2026-07'

type JourneyDay = {
  day: number
  title: string
  amount?: string
  tone: JourneyTone
  tags: string[]
  recorded: boolean
  primary?: boolean
}

const roadmapIconBase = `${import.meta.env.BASE_URL}assets/roadmap/icons`

type MonthModel = {
  key: MonthKey
  label: string
  recordedCount: number
  metrics: {
    income: string
    expense: string
    saving: string
  }
  days: JourneyDay[]
}

const monthModels: Record<MonthKey, MonthModel> = {
  '2026-07': {
    key: '2026-07',
    label: '2026년 7월',
    recordedCount: 11,
    metrics: {
      income: '+2,800,000원',
      expense: '-163,400원',
      saving: '+100,000원',
    },
    days: buildDays('2026-07'),
  },
  '2026-06': {
    key: '2026-06',
    label: '2026년 6월',
    recordedCount: 24,
    metrics: {
      income: '+2,760,000원',
      expense: '-1,482,000원',
      saving: '+220,000원',
    },
    days: buildDays('2026-06'),
  },
}

const stonePositions = [
  [55, 4], [35, 8], [62, 12], [45, 16], [66, 20],
  [42, 24], [58, 28], [34, 32], [50, 36], [68, 40],
  [40, 44], [60, 48], [32, 52], [48, 56], [67, 60],
  [43, 64], [28, 68], [52, 72], [71, 76], [47, 80],
  [30, 84], [58, 88], [72, 92], [44, 96], [24, 100],
  [50, 104], [68, 108], [40, 112], [58, 116], [48, 120],
] as const

export function RoadmapPage({
  date,
  navigate,
}: {
  date?: string
  navigate: Navigate
}) {
  const initialMonth = monthFromDate(date) ?? '2026-07'
  const [monthKey, setMonthKey] = useState<MonthKey>(initialMonth)
  const selectedDate = normalizeDate(date)
  const visibleMonthKey = selectedDate ? monthFromDate(selectedDate) ?? monthKey : monthKey
  const month = monthModels[visibleMonthKey]
  const selectedDay = selectedDate ? month.days.find((day) => day.day === dayFromDate(selectedDate)) : undefined
  const detail = selectedDate && selectedDay ? { date: selectedDate, day: selectedDay } : null

  const handlePrevMonth = () => setMonthKey('2026-06')
  const handleNextMonth = () => setMonthKey('2026-07')

  return (
    <section className="roadmap-screen" aria-labelledby="roadmap-title">
      <RoadmapHeader />
      <MonthSummary
        month={month}
        canGoPrev={visibleMonthKey !== '2026-06'}
        canGoNext={visibleMonthKey !== '2026-07'}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
      />
      <main className="roadmap-stage" aria-label={`${month.label} 30일 금융 여정`}>
        <div className="roadmap-map-bg" aria-hidden="true" />
        <div className="roadmap-stones">
          {month.days.map((day, index) => (
            <JourneyStone
              date={`${month.key}-${String(day.day).padStart(2, '0')}`}
              day={day}
              index={index}
              selected={selectedDay?.day === day.day}
              navigate={navigate}
              key={day.day}
            />
          ))}
        </div>
      </main>
      {detail ? <DayDetailSheet date={detail.date} day={detail.day} navigate={navigate} /> : null}
    </section>
  )
}

function RoadmapHeader() {
  return (
    <header className="roadmap-hero">
      <div className="roadmap-status" aria-hidden="true">
        <strong>9:41</strong>
        <span><i /><i /><i /></span>
      </div>
      <div className="roadmap-topline">
        <div>
          <h1 id="roadmap-title">30일 금융 여정</h1>
          <p>이번 달 돈의 흐름을 발판으로 따라가요</p>
        </div>
        <div className="roadmap-wallet" aria-label="보유 포인트 12,450">
          <span className="coin">★</span>
          <strong>12,450</strong>
          <button type="button" aria-label="포인트 충전">+</button>
        </div>
        <div className="roadmap-avatar" aria-hidden="true"><span /></div>
      </div>
    </header>
  )
}

function MonthSummary({
  month,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: {
  month: MonthModel
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <section className="roadmap-month-card" aria-label={`${month.label} 요약`}>
      <div className="roadmap-month-title">
        <button type="button" aria-label="이전 달" onClick={onPrev} disabled={!canGoPrev}>
          <AppIcon name="chevron-left" />
        </button>
        <strong>{month.label}</strong>
        <button type="button" aria-label="다음 달" onClick={onNext} disabled={!canGoNext}>
          <AppIcon name="chevron-right" />
        </button>
        <span><em>{month.recordedCount}</em> / 30일 기록</span>
      </div>
      <div className="roadmap-metrics">
        <Metric label="수입" value={month.metrics.income} tone="income" />
        <Metric label="지출" value={month.metrics.expense} tone="expense" />
        <Metric label="저축" value={month.metrics.saving} tone="saving" />
      </div>
    </section>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone: JourneyTone }) {
  return (
    <div className="roadmap-metric" data-tone={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function JourneyStone({
  date,
  day,
  index,
  selected,
  navigate,
}: {
  date: string
  day: JourneyDay
  index: number
  selected: boolean
  navigate: Navigate
}) {
  const [x, y] = stonePositions[index]
  const style = { '--stone-x': `${x}%`, '--stone-y': `${y}%` } as CSSProperties
  return (
    <button
      className={`roadmap-stone is-${day.tone}${day.recorded ? ' is-recorded' : ''}${day.primary ? ' is-primary' : ''}${selected ? ' is-selected' : ''}`}
      style={style}
      type="button"
      aria-label={`${date} 기록 상세 보기`}
      onClick={() => navigate(`/records/${date}`)}
    >
      <span className="stone-icon" aria-hidden="true">
        <img src={iconForDay(day)} alt="" draggable={false} />
      </span>
      <span className="stone-copy">
        <strong>{day.day}일</strong>
        <em>{day.title}{day.amount ? ` ${day.amount}` : ''}</em>
      </span>
      <span className="stone-tags" aria-hidden="true">
        {day.tags.slice(0, 2).map((tag) => <i key={tag}>{tag}</i>)}
      </span>
    </button>
  )
}

function DayDetailSheet({ date, day, navigate }: { date: string; day: JourneyDay; navigate: Navigate }) {
  const activities = useMemo(() => activityRows(day), [day])
  return (
    <div className="roadmap-sheet-layer" role="dialog" aria-modal="true" aria-labelledby="roadmap-sheet-title">
      <button className="roadmap-sheet-dim" type="button" aria-label="상세 기록 배경 닫기" onClick={() => navigate('/records')} />
      <section className="roadmap-sheet">
        <span className="sheet-handle" aria-hidden="true" />
        <button className="sheet-close" type="button" aria-label="상세 기록 닫기" onClick={() => navigate('/records')}>×</button>
        <header className="sheet-heading">
          <h2 id="roadmap-sheet-title">{formatKoreanDate(date)}</h2>
          <span><AppIcon name="check" /> {day.recorded ? '기록 완료' : '예정'}</span>
          <p>오늘의 금융활동 {activities.length}개</p>
        </header>
        <section className="sheet-section">
          <h3>활동 내역</h3>
          <div className="sheet-activity-list">
            {activities.map((activity) => (
              <div className="sheet-activity" data-tone={activity.tone} key={activity.title}>
                <span className="roadmap-icon-orb" data-tone={activity.tone} aria-hidden="true">
                  <img src={iconForActivity(activity.title, activity.tone)} alt="" draggable={false} />
                </span>
                <div>
                  {activity.badge ? <span className="activity-badge">{activity.badge}</span> : null}
                  <strong>{activity.title}</strong>
                  {activity.chips.length ? (
                    <div className="activity-chips">
                      {activity.chips.map((chip) => <span key={chip}>{chip}</span>)}
                    </div>
                  ) : null}
                </div>
                <em>{activity.amount}</em>
                <AppIcon name="chevron-right" />
              </div>
            ))}
          </div>
        </section>
        <section className="sheet-section">
          <h3>오늘 예산</h3>
          <div className="budget-card">
            <p>사용 19,600원 / 예산 32,000원</p>
            <div><strong>12,400원 남음</strong><em>61%</em></div>
            <span><i /></span>
          </div>
        </section>
        <section className="sheet-section">
          <h3>퀘스트 · 성장</h3>
          <div className="quest-card">
            <span className="roadmap-icon-orb" data-tone="quest" aria-hidden="true">
              <img src={`${roadmapIconBase}/roadmap-icon-quest.png`} alt="" draggable={false} />
            </span>
            <div>
              <strong>{day.day}일 금융 기록 퀘스트 완료</strong>
              <p><span>소비 방어력 +2</span><span>저축 HP +5</span><span>XP +20</span></p>
            </div>
          </div>
        </section>
      </section>
    </div>
  )
}

function buildDays(month: MonthKey): JourneyDay[] {
  const julyTemplates: JourneyDay[] = [
    { day: 7, title: '지출', amount: '-24,500원', tone: 'expense', tags: ['저축', '퀘스트'], recorded: true },
    { day: 8, title: '지출', amount: '-8,900원', tone: 'expense', tags: ['수입', '퀘스트'], recorded: true },
    { day: 9, title: '투자', amount: '+50,000원', tone: 'invest', tags: ['지출', '퀘스트'], recorded: true },
    { day: 10, title: '저축', amount: '+100,000원', tone: 'saving', tags: ['지출', '투자'], recorded: true },
    { day: 11, title: '수입', amount: '+2,800,000원', tone: 'income', tags: ['저축', '투자'], recorded: true, primary: true },
    { day: 12, title: '오늘 예산', amount: '28,000원', tone: 'planned', tags: ['예정 2개'], recorded: false },
    { day: 13, title: '퀘스트 예정', tone: 'locked', tags: ['아직 잠김'], recorded: false },
  ]
  const juneTemplates: JourneyDay[] = [
    { day: 3, title: '저축', amount: '+80,000원', tone: 'saving', tags: ['자동저축'], recorded: true },
    { day: 6, title: '지출', amount: '-42,000원', tone: 'expense', tags: ['식비', '교통'], recorded: true },
    { day: 11, title: '투자', amount: '+30,000원', tone: 'invest', tags: ['ETF'], recorded: true, primary: true },
    { day: 18, title: '퀘스트', amount: '+20 XP', tone: 'quest', tags: ['성장'], recorded: true },
    { day: 24, title: '저축', amount: '+140,000원', tone: 'saving', tags: ['비상금'], recorded: true },
  ]
  const templates = month === '2026-07' ? julyTemplates : juneTemplates
  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1
    const found = templates.find((item) => item.day === day)
    if (found) {
      return found
    }
    const pastLimit = month === '2026-07' ? 11 : 24
    const recorded = day <= pastLimit
    return {
      day,
      title: recorded ? (day % 5 === 0 ? '저축' : day % 4 === 0 ? '투자' : day % 3 === 0 ? '퀘스트' : '기록') : '예정',
      amount: recorded ? (day % 5 === 0 ? '+20,000원' : day % 4 === 0 ? '+10,000원' : day % 3 === 0 ? '+20 XP' : '-6,400원') : undefined,
      tone: recorded ? (day % 5 === 0 ? 'saving' : day % 4 === 0 ? 'invest' : day % 3 === 0 ? 'quest' : 'expense') : 'planned',
      tags: recorded ? ['기록', '완료'] : ['예정'],
      recorded,
    }
  })
}

function activityRows(day: JourneyDay) {
  if (day.tone === 'income') {
    return [
      { title: '월급 입금', badge: '대표 활동', amount: day.amount ?? '+2,800,000원', tone: 'income' as JourneyTone, chips: [] },
      { title: '지출 3건', amount: '-19,600원', tone: 'expense' as JourneyTone, chips: ['식비 12,000원', '카페 4,600원', '교통 3,000원'] },
      { title: '비상금 자동저축', amount: '+100,000원', tone: 'saving' as JourneyTone, chips: [] },
      { title: '투자계좌 입금', amount: '+50,000원', tone: 'invest' as JourneyTone, chips: [] },
    ]
  }
  return [
    { title: `${day.title} 기록`, badge: day.primary ? '대표 활동' : undefined, amount: day.amount ?? '예정', tone: day.tone, chips: day.tags },
    { title: '예산 체크', amount: '61%', tone: 'planned' as JourneyTone, chips: ['오늘 예산'] },
    { title: '퀘스트 반영', amount: '+20 XP', tone: 'quest' as JourneyTone, chips: ['성장'] },
  ]
}

function iconForDay(day: JourneyDay) {
  if (day.tone === 'income') return `${roadmapIconBase}/roadmap-icon-document.png`
  if (day.tone === 'expense') return `${roadmapIconBase}/${day.day % 2 === 0 ? 'roadmap-icon-receipt.png' : 'roadmap-icon-wallet.png'}`
  if (day.tone === 'saving') return `${roadmapIconBase}/roadmap-icon-piggy.png`
  if (day.tone === 'invest') return `${roadmapIconBase}/roadmap-icon-chart.png`
  if (day.tone === 'quest') return `${roadmapIconBase}/roadmap-icon-quest.png`
  if (day.tone === 'locked') return `${roadmapIconBase}/roadmap-icon-trophy.png`
  return `${roadmapIconBase}/roadmap-icon-calendar.png`
}

function iconForActivity(title: string, tone: JourneyTone) {
  if (title.includes('월급') || title.includes('수입')) return `${roadmapIconBase}/roadmap-icon-document.png`
  if (title.includes('지출')) return `${roadmapIconBase}/roadmap-icon-wallet.png`
  if (title.includes('저축')) return `${roadmapIconBase}/roadmap-icon-piggy.png`
  if (title.includes('투자')) return `${roadmapIconBase}/roadmap-icon-chart.png`
  if (title.includes('퀘스트')) return `${roadmapIconBase}/roadmap-icon-quest.png`
  if (tone === 'locked') return `${roadmapIconBase}/roadmap-icon-trophy.png`
  return `${roadmapIconBase}/roadmap-icon-calendar.png`
}

function normalizeDate(date?: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date ?? '') ? date : undefined
}

function monthFromDate(date?: string): MonthKey | undefined {
  const month = date?.slice(0, 7)
  return month === '2026-06' || month === '2026-07' ? month : undefined
}

function dayFromDate(date: string) {
  return Number(date.slice(8, 10))
}

function formatKoreanDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`)
  const weekday = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][parsed.getDay()]
  return `${parsed.getMonth() + 1}월 ${parsed.getDate()}일 ${weekday}`
}
