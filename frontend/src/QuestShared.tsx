import { useState, type ReactNode } from 'react'

/**
 * 퀘스트 탭 리디자인(RPG 마스코트 톤) 공용 조각.
 * AI 생성 PNG 에셋은 public/assets/quest/ 아래의 정해진 파일명을 우선 사용한다.
 * 파일이 없는 동안은 QuestIcon이 이모지로 자연스럽게 대체한다.
 */
export const QUEST_ASSET_DIR = '/assets/quest'

export type QuestTone = 'mint' | 'pink' | 'teal' | 'purple'

const TONE_BG: Record<QuestTone, string> = {
  mint: 'linear-gradient(160deg, #EAFBF0, #C9EFD6)',
  pink: 'linear-gradient(160deg, #FFEEF2, #FBCFDA)',
  teal: 'linear-gradient(160deg, #E1F5F4, #B7E5E2)',
  purple: 'linear-gradient(160deg, #EFE9FF, #D3C4F7)',
}

export function QuestIcon({
  src,
  emoji,
  tone = 'teal',
  size = 56,
  square = true,
  className,
}: {
  src: string
  emoji: string
  tone?: QuestTone
  size?: number
  square?: boolean
  className?: string
}) {
  const [broken, setBroken] = useState(false)

  return (
    <span
      className={`quest-icon${square ? ' is-square' : ' is-round'}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, background: TONE_BG[tone] }}
    >
      {!broken ? (
        <img src={src} alt="" draggable={false} onError={() => setBroken(true)} />
      ) : (
        <span className="quest-icon-fallback" aria-hidden="true" style={{ fontSize: Math.round(size * 0.5) }}>{emoji}</span>
      )}
    </span>
  )
}

export function QuestMascot({ size = 132 }: { size?: number }) {
  const [broken, setBroken] = useState(false)
  const src = `${QUEST_ASSET_DIR}/quest-mascot-ai.png`

  return (
    <span className="quest-mascot" style={{ width: size, height: size }}>
      {!broken ? (
        <img src={src} alt="" draggable={false} onError={() => setBroken(true)} />
      ) : (
        <span className="quest-mascot-fallback" aria-hidden="true">🐻‍❄️✨</span>
      )}
    </span>
  )
}

export function QuestNumberedHeading({ n, title, action }: { n: number; title: string; action?: ReactNode }) {
  return (
    <header className="quest-numbered-heading">
      <div className="quest-numbered-heading-title">
        <span className="quest-number-badge">{n}</span>
        <h2>{title}</h2>
      </div>
      {action}
    </header>
  )
}

export function QuestProgressBar({ value, tone = 'teal' }: { value: number; tone?: 'teal' | 'orange' }) {
  return (
    <span className={`quest-progress-track ${tone}`}>
      <i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </span>
  )
}

/* ── 목업 데이터 ─────────────────────────────────────────── */

export type QuestCategory = {
  id: string
  label: string
  emoji: string
  tone: QuestTone
  desc: string
}

export const questCategories: QuestCategory[] = [
  { id: 'spend', label: '소비', emoji: '☕', tone: 'mint', desc: '카페비 5,000원 이하로 관리하기' },
  { id: 'saving', label: '저축', emoji: '🐷', tone: 'pink', desc: '오늘 저축 3,000원 달성하기' },
  { id: 'invest', label: '투자', emoji: '📊', tone: 'teal', desc: '투자 포트폴리오 확인하기' },
  { id: 'knowledge', label: '금융지식', emoji: '📘', tone: 'purple', desc: '금융 퀴즈 3문제 풀기' },
]

export const questSummary = {
  completed: 3,
  total: 5,
  progressPercent: 60,
  xp: 140,
  point: 400,
  rewardBoxProgress: 60,
  recommendedTitle: '카페비 관리 퀘스트',
  coachMessage: '지갑 HP가 빠르게 줄고 있어요. 오늘은 카페비 관리 퀘스트를 추천해요.',
}

export type QuestProgressItem = {
  id: string
  iconId: string
  emoji: string
  tone: QuestTone
  title: string
  current: number
  target: number
  unit: string
  timeLeft: string
  barTone: 'teal' | 'orange'
  rewardEmoji: string
  rewardLabel: string
  rewardValue: string
  rewardColor: string
  effectEmoji: string
  effectText: string
}

export const questInProgress: QuestProgressItem[] = [
  {
    id: 'q1',
    iconId: 'spend',
    emoji: '☕',
    tone: 'mint',
    title: '카페비 5,000원 이하로 관리하기',
    current: 3200,
    target: 5000,
    unit: '원',
    timeLeft: '오늘 8시간 남음',
    barTone: 'teal',
    rewardEmoji: '💚',
    rewardLabel: '지갑 HP',
    rewardValue: '+8',
    rewardColor: 'var(--teal-600)',
    effectEmoji: '📈',
    effectText: '진행률 12% 상승',
  },
  {
    id: 'q2',
    iconId: 'saving',
    emoji: '🐷',
    tone: 'pink',
    title: '오늘 저축 3,000원 달성하기',
    current: 2100,
    target: 3000,
    unit: '원',
    timeLeft: '오늘 8시간 남음',
    barTone: 'teal',
    rewardEmoji: '💧',
    rewardLabel: '저축력',
    rewardValue: '+5',
    rewardColor: '#2E8FDB',
    effectEmoji: '🛡️',
    effectText: '보스 방어력 5% 감소',
  },
  {
    id: 'q3',
    iconId: 'knowledge',
    emoji: '📘',
    tone: 'purple',
    title: '금융 퀴즈 3문제 풀기',
    current: 1,
    target: 3,
    unit: '문제',
    timeLeft: '오늘 8시간 남음',
    barTone: 'orange',
    rewardEmoji: '⭐',
    rewardLabel: '성장력',
    rewardValue: '+4',
    rewardColor: '#8C5CE6',
    effectEmoji: '🎯',
    effectText: '치명타 확률 3% 증가',
  },
]

export type QuestCompletedItem = {
  id: string
  iconId: string
  emoji: string
  tone: QuestTone
  title: string
  date: string
  rewardLabel: string
}

export const questCompleted: QuestCompletedItem[] = [
  { id: 'c1', iconId: 'spend', emoji: '☕', tone: 'mint', title: '카페비 4,500원 이하로 관리하기', date: '7월 11일', rewardLabel: '지갑 HP +6 · P 80' },
  { id: 'c2', iconId: 'saving', emoji: '🐷', tone: 'pink', title: '오늘 저축 3,000원 달성하기', date: '7월 11일', rewardLabel: '저축력 +5 · P 60' },
  { id: 'c3', iconId: 'knowledge', emoji: '📘', tone: 'purple', title: '금융 퀴즈 3문제 풀기', date: '7월 10일', rewardLabel: '성장력 +4 · P 50' },
]

export type QuestPointEvent = {
  id: string
  title: string
  date: string
  amount: number
}

export const questPointLedger: QuestPointEvent[] = [
  { id: 'p1', title: '카페비 관리 퀘스트 완료', date: '7월 11일', amount: 80 },
  { id: 'p2', title: '저축 목표 달성 퀘스트 완료', date: '7월 11일', amount: 60 },
  { id: 'p3', title: '금융 퀴즈 퀘스트 완료', date: '7월 10일', amount: 50 },
  { id: 'p4', title: '연속 출석 보너스', date: '7월 9일', amount: 30 },
]

export const questPointSummary = {
  balance: 12450,
  earnedThisMonth: 640,
}
