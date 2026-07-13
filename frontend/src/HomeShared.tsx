import { useEffect, useState } from 'react'

/**
 * 홈 탭 "보스 전투" 리디자인 공용 조각.
 * 실제 캐릭터/보스 일러스트 파일이 없어서(이미지 생성 도구 없음), 사용자가
 * public/assets/home/ 아래에 정해진 파일명으로 넣어주면 그대로 교체된다.
 * 파일이 없는 동안은 이모지로 자연스럽게 대체한다.
 */
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

  // src가 바뀌면(예: 대기 ↔ 공격 스프라이트 전환) 이전 로드 실패 상태를 초기화한다.
  useEffect(() => {
    setBroken(false)
  }, [src])

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

/* ── 목업 데이터 ─────────────────────────────────────────── */

export const homePlayer = {
  name: '모험가 토토',
  level: 35,
  xpPercent: 68,
  coins: 128450,
  gems: 2350,
}

export const homeBoss = {
  stage: 'STAGE 4-12',
  name: '과소비',
  hpPercent: 2,
}

export const homeQuestBanner = {
  title: '일일 퀘스트',
  desc: '몬스터 100마리 처치',
  current: 75,
  target: 100,
}

export type HomeSpecies = 'invest' | 'consume' | 'mission' | 'save'

export type HomePartyMember = {
  id: HomeSpecies
  label: string
  name: string
  meaning: string
  reportTitle: string
  emoji: string
  skillEmoji: string
  tone: 'blue' | 'teal' | 'purple' | 'green'
  hpPercent: number
  role: 'attack' | 'heal'
  detailPath: string
}

// 4명 전원이 보스 주위를 돌며 공격한다. 옆모습 스프라이트의 좌/우는 고정값이 아니라
// 전투 화면(HomeBattleScene)에서 매 프레임 보스와의 상대 x좌표를 비교해 동적으로 결정한다.
export const homeParty: HomePartyMember[] = [
  {
    id: 'consume',
    label: '소비',
    name: '아껴',
    meaning: '사용자의 소비 점수',
    reportTitle: '소비 리포트',
    emoji: '🐰',
    skillEmoji: '🛡️',
    tone: 'teal',
    hpPercent: 100,
    role: 'attack',
    detailPath: '/home/consume',
  },
  {
    id: 'save',
    label: '저축',
    name: '모아',
    meaning: '사용자의 저축 점수',
    reportTitle: '저축 리포트',
    emoji: '🦦',
    skillEmoji: '➕',
    tone: 'green',
    hpPercent: 54,
    role: 'attack',
    detailPath: '/home/save',
  },
  {
    id: 'invest',
    label: '투자',
    name: '불려',
    meaning: '사용자의 투자 점수',
    reportTitle: '투자 리포트',
    emoji: '🐻',
    skillEmoji: '🌀',
    tone: 'blue',
    hpPercent: 0,
    role: 'attack',
    detailPath: '/home/invest',
  },
  {
    id: 'mission',
    label: '미션·경험치',
    name: '해내',
    meaning: '사용자의 미션 수행도',
    reportTitle: '미션 리포트',
    emoji: '🦉',
    skillEmoji: '✨',
    tone: 'purple',
    hpPercent: 90,
    role: 'attack',
    detailPath: '/home/mission',
  },
]

export const homeRewardChestSeconds = 1 * 3600 + 23 * 60 + 45

export const homeTodayQuests = [
  { id: 'spend', emoji: '☕', icon: '/assets/rpg-icons/rpg-icon-coffee.png', done: true },
  { id: 'saving', emoji: '🐷', icon: '/assets/rpg-icons/rpg-icon-piggy.png', done: true },
  { id: 'knowledge', emoji: '📘', icon: '/assets/quest/quest-icon-knowledge.png', done: true },
]
export const homeTodayQuestCompleted = 3
export const homeTodayQuestTotal = 5

export const homeStreak = { days: 7, best: 12 }

export const homeCoachMessage = '오늘도 과소비 보스와 잘 싸우고 있어요! 카페비만 조금 줄이면 이번 스테이지를 곧 깰 수 있어요.'

export function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds)
  const h = Math.floor(clamped / 3600)
  const m = Math.floor((clamped % 3600) / 60)
  const s = Math.floor(clamped % 60)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
