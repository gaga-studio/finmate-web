import { CheckCircle2, X } from 'lucide-react'
import type { Schema } from '../api/client'
import styles from './RecordDaySheetView.module.css'

interface RecordDaySheetViewProps {
  record: Schema['DailyRecord']
  onClose: () => void
}

const activityMeta: Record<Schema['DailyActivity']['activityType'], { label: string; icon: string; className: string }> = {
  INCOME: { label: '수입', icon: '/assets/roadmap/icons/roadmap-icon-document.png', className: styles.income },
  EXPENSE: { label: '지출', icon: '/assets/roadmap/icons/roadmap-icon-wallet.png', className: styles.expense },
  SAVING: { label: '저축', icon: '/assets/roadmap/icons/roadmap-icon-piggy.png', className: styles.saving },
  INVESTMENT: { label: '투자', icon: '/assets/roadmap/icons/roadmap-icon-chart.png', className: styles.investment },
  QUEST: { label: '퀘스트', icon: '/assets/roadmap/icons/roadmap-icon-quest.png', className: styles.quest },
  ROUTINE: { label: '루틴', icon: '/assets/roadmap/icons/roadmap-icon-calendar.png', className: styles.routine },
  MYDATA_RECALCULATION: { label: '데이터 반영', icon: '/assets/roadmap/icons/roadmap-icon-calendar.png', className: styles.recalculation },
}

function formatAmount(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${new Intl.NumberFormat('ko-KR').format(Math.abs(value))}원`
}

function dateLabel(date: string) {
  const [, month, day] = date.split('-').map(Number)
  return `${month}월 ${day}일 금융 기록`
}

export function RecordDaySheetView({ record, onClose }: RecordDaySheetViewProps) {
  return (
    <div className={styles.scrim} onClick={onClose}>
      <section
        aria-label={dateLabel(record.date)}
        className={styles.sheet}
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <span className={styles.handle} aria-hidden="true" />
        <header className={styles.header}>
          <div>
            <span className={styles.complete}><CheckCircle2 size={14} /> 기록 완료</span>
            <h2>{dateLabel(record.date)}</h2>
            <p>오늘의 금융활동 {record.activities.length}개</p>
          </div>
          <button aria-label="닫기" type="button" onClick={onClose}><X size={20} /></button>
        </header>

        <section className={styles.activities} aria-labelledby="activity-title">
          <h3 id="activity-title">활동 내역</h3>
          {record.activities.map((activity) => {
            const meta = activityMeta[activity.activityType]
            return (
              <article className={styles.activity} key={activity.activityId}>
                <span className={styles.activityIcon}><img src={meta.icon} alt="" /></span>
                <div>
                  <span>{meta.label}{activity.primary ? ' · 대표 활동' : ''}</span>
                  <strong>{activity.title}</strong>
                  {activity.categoryLabels && activity.categoryLabels.length > 0 && <small>{activity.categoryLabels.join(' · ')}</small>}
                </div>
                {activity.amountKrw !== undefined && <b className={meta.className}>{formatAmount(activity.amountKrw)}</b>}
              </article>
            )
          })}
        </section>

        <section className={styles.budget} aria-labelledby="budget-title">
          <div>
            <h3 id="budget-title">오늘 예산</h3>
            <strong>{new Intl.NumberFormat('ko-KR').format(record.budget.budgetKrw)}원</strong>
          </div>
          <div className={styles.budgetNumbers}>
            <span>사용 {new Intl.NumberFormat('ko-KR').format(record.budget.spentKrw)}원</span>
            <b>남은 예산 {new Intl.NumberFormat('ko-KR').format(record.budget.remainingKrw)}원</b>
          </div>
          <div className={styles.track} aria-label={`오늘 예산 ${Math.round(record.budget.usedBps / 100)}% 사용`}>
            <i style={{ width: `${record.budget.usedBps / 100}%` }} />
          </div>
        </section>

        <section className={styles.recalculationCard}>
          <div><CheckCircle2 size={20} /><strong>퀘스트 XP +{record.xpEarned}</strong></div>
          <p>{record.recalculationSummary ?? '데이터 반영 후 금융 스탯을 다시 계산해요'}</p>
        </section>
      </section>
    </div>
  )
}
