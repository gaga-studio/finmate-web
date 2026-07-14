import { Luggage } from 'lucide-react'
import type { Schema } from '../api/client'
import styles from './HomeRaidScene.module.css'

type ReportType = Schema['CharacterReportType']

interface HomeRaidSceneProps {
  goalTitle: string
  goalProgress: number
  stage: number
  bossHpBps: number
  stats: Schema['FinancialStats']
  onOpenQuest: () => void
  onOpenReport: (type: ReportType) => void
}

const party: Array<{
  type: ReportType
  name: string
  role: string
  image: string
  value: (stats: Schema['FinancialStats']) => string
  className: string
}> = [
  {
    type: 'SPENDING_DEFENSE',
    name: '곰',
    role: '소비',
    image: '/assets/characters/mate/mate-char-bear.png',
    value: (stats) => `${Math.round(stats.spendingDefenseBps / 100)}점`,
    className: styles.bear,
  },
  {
    type: 'SAVING_HP',
    name: '물개',
    role: '저축',
    image: '/assets/home/home-char-save.png',
    value: (stats) => `${Math.round(stats.savingHpBps / 100)}점`,
    className: styles.seal,
  },
  {
    type: 'INVESTMENT_JUDGMENT',
    name: '토끼',
    role: '투자 판단',
    image: '/assets/characters/mate/mate-char-rabbit.png',
    value: (stats) => `${Math.round(stats.investmentJudgmentBps / 100)}점`,
    className: styles.rabbit,
  },
  {
    type: 'QUEST_XP',
    name: '새',
    role: '퀘스트 XP',
    image: '/assets/characters/mate/mate-char-bird.png',
    value: (stats) => `${stats.questXp} XP`,
    className: styles.bird,
  },
]

function raidTitle(goalTitle: string) {
  return `${goalTitle}${goalTitle.includes('자금') ? '' : ' 자금'} 레이드`
}

export function HomeRaidScene({
  goalTitle,
  goalProgress,
  stage,
  bossHpBps,
  stats,
  onOpenQuest,
  onOpenReport,
}: HomeRaidSceneProps) {
  return (
    <section className={styles.raid} aria-labelledby="home-raid-title">
      <header className={styles.heading}>
        <span>STAGE {stage}</span>
        <h2 id="home-raid-title">{raidTitle(goalTitle)}</h2>
        <p>확인된 금융데이터가 목표와 전투 상태를 갱신해요.</p>
      </header>

      <div className={styles.bossStatus}>
        <span>목표 진행 {goalProgress}%</span>
        <div className={styles.bossTrack} aria-label={`보스 남은 체력 ${Math.round(bossHpBps / 100)}%`}>
          <i style={{ width: `${bossHpBps / 100}%` }} />
        </div>
      </div>

      <div className={styles.stage}>
        <button
          className={styles.goalBoss}
          type="button"
          aria-label={`${goalTitle} 보스 퀘스트 보기`}
          onClick={onOpenQuest}
        >
          <span className={styles.goalIcon}><Luggage aria-hidden="true" size={42} /></span>
          <strong>여행 준비 보스</strong>
          <small>퀘스트로 이동</small>
        </button>

        {party.map((member) => (
          <button
            className={`${styles.member} ${member.className}`}
            type="button"
            aria-label={`${member.name} ${member.role} 리포트 보기`}
            key={member.type}
            onClick={() => onOpenReport(member.type)}
          >
            <img src={member.image} alt="" draggable={false} />
            <span>
              <strong>{member.name} · {member.role}</strong>
              <small>{member.value(stats)}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
