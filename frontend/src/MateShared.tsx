import { useState, type ReactNode } from 'react'
import { IconBadge, type IconName } from './uiPrimitives'

/**
 * 메이트 탭 리디자인(RPG 마스코트 톤) 공용 조각.
 * 캐릭터 일러스트는 /Users/two_silver/Desktop/FinMate/캐릭터_에셋 실제 에셋을 그대로 복사해 쓴다
 * (토끼=소비/나, 수달=저축, 곰=투자·AI코치, 새=미션). public/assets/characters/mate/ 에 있음.
 * 혹시 파일이 없으면 MateAvatar가 종/톤에 맞는 이모지 배지로 자연스럽게 대체한다.
 */
export type MateSpecies = 'me' | 'otter' | 'rabbit' | 'bear' | 'bird' | 'coach'

export const MATE_ASSET_DIR = '/assets/characters/mate'
export const RPG_ICON_DIR = '/assets/rpg-icons'

export type RpgIconName =
  | 'briefcase'
  | 'chest'
  | 'coffee'
  | 'coins'
  | 'heart'
  | 'medal'
  | 'piggy'
  | 'potion'
  | 'quiz'
  | 'shield'
  | 'swords'
  | 'xp'

const SPECIES_META: Record<MateSpecies, { src: string; glyph: string; bg: string }> = {
  me: { src: `${MATE_ASSET_DIR}/mate-avatar-me.png`, glyph: '🐰', bg: 'linear-gradient(160deg, #EAFBF0, #BEE9CC)' },
  otter: { src: `${MATE_ASSET_DIR}/mate-char-otter.png`, glyph: '🦦', bg: 'linear-gradient(160deg, #E4EAFB, #B9C6EF)' },
  rabbit: { src: `${MATE_ASSET_DIR}/mate-char-rabbit.png`, glyph: '🐰', bg: 'linear-gradient(160deg, #EAFBF0, #BEE9CC)' },
  bear: { src: `${MATE_ASSET_DIR}/mate-char-bear.png`, glyph: '🐻', bg: 'linear-gradient(160deg, #FFF3DC, #F4D89A)' },
  bird: { src: `${MATE_ASSET_DIR}/mate-char-bird.png`, glyph: '🐦', bg: 'linear-gradient(160deg, #ECE5FF, #C6B7F2)' },
  coach: { src: `${MATE_ASSET_DIR}/mate-coach-wizard.png`, glyph: '🧙', bg: 'linear-gradient(160deg, #FFF3DC, #F4D89A)' },
}

export function MateAvatar({
  species,
  size = 56,
  locked = false,
  fit = 'cover',
  badge,
  className,
}: {
  species: MateSpecies
  size?: number
  locked?: boolean
  fit?: 'cover' | 'contain'
  badge?: ReactNode
  className?: string
}) {
  const [broken, setBroken] = useState(false)
  const meta = SPECIES_META[species]

  return (
    <span
      className={`mate-avatar${locked ? ' is-locked' : ''}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, background: meta.bg }}
    >
      {!broken ? (
        <img
          src={meta.src}
          alt=""
          draggable={false}
          style={{ objectFit: fit }}
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="mate-avatar-fallback" aria-hidden="true" style={{ fontSize: Math.round(size * 0.52) }}>
          {meta.glyph}
        </span>
      )}
      {badge ? <span className="mate-avatar-badge">{badge}</span> : null}
    </span>
  )
}

export function RpgIcon({
  name,
  fallback = '✦',
  size = 40,
  className,
}: {
  name: RpgIconName
  fallback?: string
  size?: number
  className?: string
}) {
  const [broken, setBroken] = useState(false)

  return (
    <span className={`rpg-icon${className ? ` ${className}` : ''}`} style={{ width: size, height: size }}>
      {!broken ? (
        <img
          src={`${RPG_ICON_DIR}/rpg-icon-${name}.png`}
          alt=""
          draggable={false}
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="rpg-icon-fallback" aria-hidden="true" style={{ fontSize: Math.round(size * 0.46) }}>
          {fallback}
        </span>
      )}
    </span>
  )
}

export function MateToggle({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label: string }) {
  return (
    <button
      className={`mate-toggle${checked ? ' is-on' : ''}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span className="mate-toggle-knob" />
    </button>
  )
}

export function MateSectionCard({
  eyebrowIcon,
  title,
  subtitle,
  action,
  children,
  className,
}: {
  eyebrowIcon?: string
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <section className={`mate-card${className ? ` ${className}` : ''}`}>
      <header className="mate-card-head">
        <div className="mate-card-head-title">
          {eyebrowIcon ? <IconBadge icon={eyebrowIcon} tone="teal" /> : null}
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}

export function MateGaugeBar({
  label,
  mine,
  other,
  otherLabel = '상대',
  highlight,
  max = 100,
}: {
  label: string
  mine: number
  other: number
  otherLabel?: string
  highlight?: string
  max?: number
}) {
  const minePct = Math.max(0, Math.min(100, (mine / max) * 100))
  const otherPct = Math.max(0, Math.min(100, (other / max) * 100))

  return (
    <div className="mate-gauge-row">
      <div className="mate-gauge-row-head">
        <span>{label}</span>
        {highlight ? <b>{highlight}</b> : null}
      </div>
      <div className="mate-gauge-track" role="img" aria-label={`나 ${mine}, ${otherLabel} ${other}`}>
        <span className="mate-gauge-fill mate-gauge-fill-other" style={{ width: `${otherPct}%` }} />
        <span className="mate-gauge-fill mate-gauge-fill-mine" style={{ width: `${minePct}%` }} />
        <span className="mate-gauge-marker mate-gauge-marker-mine" style={{ left: `${minePct}%` }} />
      </div>
    </div>
  )
}

export function MateCoachCard({
  name = 'AI 코치',
  message,
}: {
  name?: string
  message: ReactNode
}) {
  return (
    <section className="mate-coach-card">
      <MateAvatar species="coach" size={64} fit="contain" className="mate-coach-avatar" />
      <div className="mate-coach-copy">
        <span className="mate-coach-name">{name}</span>
        <p>{message}</p>
      </div>
    </section>
  )
}

export function MateStatBadge({ icon, label, tone = 'teal' }: { icon: string; label: string; tone?: string }) {
  return (
    <span className="mate-stat-badge">
      <IconBadge icon={icon} tone={tone} />
      <b>{label}</b>
    </span>
  )
}

export function MatePointPill({ value }: { value: number }) {
  return (
    <span className="mate-point-pill">
      <CoinGlyph />
      <b className="num">{value.toLocaleString('ko-KR')}</b>
      <i aria-hidden="true">+</i>
    </span>
  )
}

function CoinGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#FFD35C" stroke="#E8A93A" strokeWidth="1.5" />
      <path d="m12 6 1.4 4.4L18 12l-4.6 1.6L12 18l-1.4-4.4L6 12l4.6-1.6L12 6Z" fill="#FFF3D0" />
    </svg>
  )
}

/* ── 목업 데이터 ─────────────────────────────────────────────
 * 사용자 결정: "참고 이미지 화면 구조 우선, 데이터는 목업으로 새로 구성".
 * 실제 API 연동은 이후 별도 작업.
 */

export type MateFriendSlot = { id: string; species: MateSpecies; name: string; done: boolean }
export const mateFriendSlots: MateFriendSlot[] = [
  { id: 'f1', species: 'otter', name: '민우', done: true },
  { id: 'f2', species: 'rabbit', name: '지니', done: true },
  { id: 'f3', species: 'bird', name: '세아', done: true },
  { id: 'f4', species: 'bear', name: '?', done: false },
  { id: 'f5', species: 'rabbit', name: '?', done: false },
]

export type MateFeedItem = {
  id: string
  species: MateSpecies
  name: string
  text: string
  statLabel: string
  statValue: string
  tone: 'teal' | 'danger' | 'warning'
}
export const mateFeedItems: MateFeedItem[] = [
  { id: 'feed-1', species: 'bird', name: '지니', text: '저축 스트럭 6개월을 달성했어요', statLabel: 'HP', statValue: '+10', tone: 'danger' },
  { id: 'feed-2', species: 'otter', name: '민우', text: '적금 정비를 새로 강화했어요', statLabel: '방어력', statValue: '+8', tone: 'teal' },
  { id: 'feed-3', species: 'me', name: '세아', text: '소비 방어력을 강화했어요', statLabel: '공격력', statValue: '+6', tone: 'warning' },
]

export type MateGaugeDatum = { id: string; label: string; mine: number; other: number }
export const mateVsGauges: MateGaugeDatum[] = [
  { id: 'defense', label: '소비 방어력', mine: 72, other: 68 },
  { id: 'savingHp', label: '저축 HP', mine: 65, other: 74 },
  { id: 'attack', label: '투자 공격력', mine: 60, other: 63 },
]

export type MateFriendSignal = {
  id: string
  title: string
  subtitle: string
  participants: number
  total: number
  mine: 'done' | 'ready' | 'none'
  icon: RpgIconName
  fallback: string
}

export type MateFriendInsight = {
  id: string
  label: string
  value: string
  note: string
  icon: string
}

export const mateFriendInsights: MateFriendInsight[] = [
  { id: 'friend-ready', label: '내 준비 상태', value: '1 / 5', note: '여행 자동저축만 준비 중', icon: 'saving' },
  { id: 'friend-gap', label: '가장 큰 차이', value: '청약', note: '친구 3명은 이미 납입 중', icon: 'fund' },
  { id: 'friend-next', label: '다음 추천', value: 'ETF O/X', note: '친구 2명이 학습 시작', icon: 'study' },
]

export const mateFriendSignals: MateFriendSignal[] = [
  {
    id: 'housing-subscription',
    title: '청약 통장 납입 중',
    subtitle: '유럽여행 후 독립 준비까지 이어지는 장기 목표',
    participants: 3,
    total: 5,
    mine: 'none',
    icon: 'shield',
    fallback: '청',
  },
  {
    id: 'travel-saving',
    title: '여행 경비 자동저축',
    subtitle: '방학 유럽여행 목표를 가진 친구들의 루틴',
    participants: 4,
    total: 5,
    mine: 'ready',
    icon: 'piggy',
    fallback: '저',
  },
  {
    id: 'invest-study',
    title: 'ETF 기초 공부 시작',
    subtitle: '투자를 처음 준비하는 친구들이 먼저 선택한 행동',
    participants: 2,
    total: 5,
    mine: 'none',
    icon: 'quiz',
    fallback: 'OX',
  },
  {
    id: 'emergency-fund',
    title: '비상금 통장 분리',
    subtitle: '여행 전 갑작스러운 지출을 막기 위한 안전 장치',
    participants: 3,
    total: 5,
    mine: 'none',
    icon: 'potion',
    fallback: '비',
  },
  {
    id: 'daily-spend-log',
    title: '하루 소비 기록',
    subtitle: '퀘스트 성공률이 높은 친구들이 공통으로 하는 루틴',
    participants: 5,
    total: 5,
    mine: 'ready',
    icon: 'medal',
    fallback: '기',
  },
]

export type MateStreak = { id: string; a: MateSpecies; b: MateSpecies; name: string; days: number; duration: string }
export const mateStreaks: MateStreak[] = [
  { id: 's1', a: 'me', b: 'bear', name: '지니와 12일째', days: 12, duration: '3시간 20분' },
  { id: 's2', a: 'me', b: 'otter', name: '민우와 5일째', days: 5, duration: '1시간 5분' },
]

export const mateSimilarGroup = {
  title: '20대 초반 · 사회초년생 · 월소득 200~250만 원',
  subtitle: '카페/외식 지출이 높은 사용자 그룹',
  memberCount: 1842,
}

export type MatePositionGauge = {
  id: string
  label: string
  sub: string
  icon: IconName | string
  mine: number
  other: number
  highlight: string
}
export const matePositionGauges: MatePositionGauge[] = [
  { id: 'defense', label: '소비 방어력', sub: '불필요한 지출 방어', icon: 'saving', mine: 60, other: 68, highlight: '평균보다 8% 낮음' },
  { id: 'savingHp', label: '저축 HP', sub: '목표로 지키는 힘', icon: 'saving', mine: 78, other: 60, highlight: '3개월 연속 · 돈 1.5개월' },
  { id: 'attack', label: '투자 공격력', sub: '자산을 키우는 힘', icon: 'stocks', mine: 60, other: 50, highlight: '상위 40%' },
]

export const matePopularGear = [
  { id: 'g1', icon: 'shield' as RpgIconName, fallback: '🛡️', title: '소비의 방패: 하나 나라사랑카드', subtitle: '체크카드', usage: 38 },
  { id: 'g2', icon: 'swords' as RpgIconName, fallback: '⚔️', title: '투자의 검: 삼성전자', subtitle: '주식', usage: 29 },
  { id: 'g3', icon: 'potion' as RpgIconName, fallback: '🧪', title: '자금의 물약: 토스뱅크 파킹', subtitle: '파킹', usage: 24 },
]

export const mateFilterFields: Array<{ id: string; label: string; value: string; icon: RpgIconName; fallback: string }> = [
  { id: 'age', label: '나이', value: '24~26세', icon: 'heart', fallback: '♡' },
  { id: 'job', label: '직업', value: '사회초년생', icon: 'briefcase', fallback: '💼' },
  { id: 'income', label: '월소득', value: '200~250만 원', icon: 'coins', fallback: '🪙' },
  { id: 'spend', label: '소비 성향', value: '카페/외식', icon: 'coffee', fallback: '☕' },
  { id: 'saveRate', label: '저축률', value: '20% 이상', icon: 'piggy', fallback: '🐷' },
  { id: 'investType', label: '투자 성향', value: '안정형', icon: 'shield', fallback: '🛡️' },
]

export type MateExploreFilterKey = 'age' | 'job' | 'income' | 'spend' | 'saveRate' | 'investType'

export type MateExploreFilter = {
  id: MateExploreFilterKey
  label: string
  icon: RpgIconName
  fallback: string
  options: string[]
}

export const mateExploreFilters: MateExploreFilter[] = [
  { id: 'age', label: '나이', icon: 'heart', fallback: '♡', options: ['전체', '20~23세', '24~26세', '27~29세'] },
  { id: 'job', label: '직업', icon: 'briefcase', fallback: '가방', options: ['전체', '대학생', '사회초년생', '알바 병행'] },
  { id: 'income', label: '월소득', icon: 'coins', fallback: '원', options: ['전체', '100만 원 미만', '100~200만 원', '200~250만 원', '250만 원 이상'] },
  { id: 'spend', label: '소비 성향', icon: 'coffee', fallback: '카페', options: ['전체', '카페/외식', '패션', '교통 절약', '여행 준비'] },
  { id: 'saveRate', label: '저축률', icon: 'piggy', fallback: '저축', options: ['전체', '10% 미만', '10~20%', '20% 이상', '30% 이상'] },
  { id: 'investType', label: '투자 성향', icon: 'shield', fallback: '투자', options: ['전체', '투자 입문', '안정형', 'ETF 관심', '아직 없음'] },
]

export type MateExploreFilters = Record<MateExploreFilterKey, string>

export const mateExploreDefaultFilters: MateExploreFilters = {
  age: '24~26세',
  job: '대학생',
  income: '100~200만 원',
  spend: '여행 준비',
  saveRate: '20% 이상',
  investType: '투자 입문',
}

export type MateAnonymousProfile = {
  id: string
  species: MateSpecies
  name: string
  age: number
  matchPercent: number
  tagline: string
  filters: Partial<MateExploreFilters>
  stats: Array<{ label: string; value: string; icon: string }>
  snapshot: Array<{ label: string; value: string; caption: string; icon: string }>
  assets: Array<{ id: string; label: string; amountLabel: string; sharePercent: number; note: string }>
  investments: Array<{ name: string; amountLabel: string; deltaLabel: string; deltaTone: 'up' | 'down' | 'flat' }>
  savings: Array<{ name: string; amountLabel: string; note: string }>
  spending: Array<{ category: string; amountLabel: string; note: string }>
  habits: Array<{ icon: RpgIconName; fallback: string; title: string; desc: string }>
  buildSummary: string
}

export const mateAnonymousProfiles: MateAnonymousProfile[] = [
  {
    id: 'anon-travel-01',
    species: 'otter',
    name: '익명 모험가 A',
    age: 24,
    matchPercent: 94,
    tagline: '알바 수입에서 여행 경비를 먼저 떼어두는 저축형',
    filters: { age: '24~26세', job: '대학생', income: '100~200만 원', spend: '여행 준비', saveRate: '20% 이상', investType: '투자 입문' },
    stats: [
      { label: '총자산', value: '2,609만', icon: 'fund' },
      { label: '월저축', value: '73만', icon: 'saving' },
      { label: '투자', value: '413만', icon: 'stocks' },
    ],
    snapshot: [
      { label: '총 금융자산', value: '26,094,699원', caption: '독립 준비와 유럽여행 자금을 함께 모으는 중', icon: 'fund' },
      { label: '월 평균 저축', value: '730,000원', caption: '적금 620,000원 + 청약 110,000원', icon: 'saving' },
      { label: '이번 달 소비', value: '2,830,000원', caption: '지난달보다 80,000원 감소', icon: 'spend' },
    ],
    assets: [
      { id: 'checking', label: '입출금', amountLabel: '15,302,004원', sharePercent: 58.6, note: '생활비와 여행 준비 현금을 함께 보관' },
      { id: 'savings', label: '적금', amountLabel: '5,422,480원', sharePercent: 20.8, note: '매달 620,000원 자동이체' },
      { id: 'investment', label: '투자', amountLabel: '4,135,251원', sharePercent: 15.9, note: '수익 ▲ 98,977원 (+3.7%)' },
      { id: 'deposit', label: '청약', amountLabel: '1,234,965원', sharePercent: 4.7, note: '월 110,000원 납입 유지' },
    ],
    investments: [
      { name: 'SK하이닉스', amountLabel: '534,797원', deltaLabel: '▲ 54,797원 (11.4%)', deltaTone: 'up' },
      { name: '삼성전자', amountLabel: '426,732원', deltaLabel: '▲ 46,732원 (12.3%)', deltaTone: 'up' },
      { name: 'KODEX 코스닥150', amountLabel: '668,914원', deltaLabel: '▲ 5,914원 (0.9%)', deltaTone: 'up' },
      { name: 'KODEX 미국나스닥100TR', amountLabel: '249,481원', deltaLabel: '▼ 2,519원 (-1.0%)', deltaTone: 'down' },
    ],
    savings: [
      { name: '자유적립 저축계좌', amountLabel: '5,422,480원', note: '여행 경비용으로 월급 다음날 자동저축' },
      { name: '청년 주택청약 통장', amountLabel: '1,234,965원', note: '월 110,000원씩 꾸준히 납입' },
    ],
    spending: [
      { category: '식비', amountLabel: '830,000원', note: '점심 외식 비중이 높아 조절 여지 있음' },
      { category: '교육·학습', amountLabel: '470,000원', note: '자격증/강의 지출 중심' },
      { category: '쇼핑·패션', amountLabel: '360,000원', note: '지난달보다 28,000원 감소' },
    ],
    habits: [
      { icon: 'piggy', fallback: '저축', title: '월급 다음날 자동저축', desc: '여행 경비를 먼저 분리해 소비 흔들림을 줄여요.' },
      { icon: 'coffee', fallback: '카페', title: '카페 주 2회 제한', desc: '외식 대신 학식/도시락으로 식비를 방어해요.' },
      { icon: 'quiz', fallback: 'OX', title: 'ETF O/X 퀴즈', desc: '투자 전 개념부터 확인하는 루틴이 있어요.' },
    ],
    buildSummary: '여행 경비 자동저축 + 식비 상한 + ETF 기초 학습을 동시에 돌리는 빌드예요.',
  },
  {
    id: 'anon-saving-02',
    species: 'rabbit',
    name: '익명 모험가 B',
    age: 23,
    matchPercent: 88,
    tagline: '카페 지출을 줄이고 청약 납입을 시작한 절약형',
    filters: { age: '20~23세', job: '알바 병행', income: '100~200만 원', spend: '카페/외식', saveRate: '20% 이상', investType: '아직 없음' },
    stats: [
      { label: '저축잔액', value: '684만', icon: 'saving' },
      { label: '청약', value: '월 10만', icon: 'fund' },
      { label: '식비', value: '42만', icon: 'food' },
    ],
    snapshot: [
      { label: '총 금융자산', value: '9,860,000원', caption: '현금성 자산과 청약 비중이 큰 안정형', icon: 'fund' },
      { label: '월 평균 저축', value: '410,000원', caption: '적금 310,000원 + 청약 100,000원', icon: 'saving' },
      { label: '이번 달 소비', value: '1,240,000원', caption: '카페/외식 지출을 줄이는 중', icon: 'spend' },
    ],
    assets: [
      { id: 'checking', label: '입출금', amountLabel: '2,520,000원', sharePercent: 25.6, note: '한 달 생활비와 비상금' },
      { id: 'savings', label: '적금', amountLabel: '5,340,000원', sharePercent: 54.2, note: '주 1회 알바비에서 자동저축' },
      { id: 'deposit', label: '청약', amountLabel: '1,000,000원', sharePercent: 10.1, note: '월 100,000원 자동납입' },
      { id: 'investment', label: '투자', amountLabel: '1,000,000원', sharePercent: 10.1, note: '아직 투자 전, 예수금으로 보관' },
    ],
    investments: [
      { name: '투자 예수금', amountLabel: '1,000,000원', deltaLabel: '학습 후 첫 매수 예정', deltaTone: 'flat' },
      { name: 'ETF 관심목록', amountLabel: '0원', deltaLabel: 'KODEX 200 / 미국S&P500 관찰', deltaTone: 'flat' },
    ],
    savings: [
      { name: '알바비 적금', amountLabel: '5,340,000원', note: '매주 80,000원씩 모으는 루틴' },
      { name: '주택청약종합저축', amountLabel: '1,000,000원', note: '월 100,000원 납입' },
    ],
    spending: [
      { category: '식비', amountLabel: '420,000원', note: '학식/쿠폰 사용 비중 높음' },
      { category: '카페·간식', amountLabel: '78,000원', note: '지난달보다 18% 감소' },
      { category: '교통', amountLabel: '64,000원', note: '정기권과 대중교통 위주' },
    ],
    habits: [
      { icon: 'shield', fallback: '방패', title: '청약 자동납입', desc: '매월 10만 원을 먼저 납입하고 남은 예산을 써요.' },
      { icon: 'coffee', fallback: '카페', title: '커피 쿠폰 사용', desc: '카페 결제를 쿠폰/포인트로 대체하는 비율이 높아요.' },
      { icon: 'medal', fallback: '배지', title: '연속 퀘스트', desc: '작은 절약 퀘스트를 끊기지 않게 유지해요.' },
    ],
    buildSummary: '청약 자동납입을 중심으로 소비 방어력을 올리는 안정 빌드예요.',
  },
  {
    id: 'anon-etf-03',
    species: 'bear',
    name: '익명 모험가 C',
    age: 26,
    matchPercent: 82,
    tagline: '소액 ETF 공부를 시작한 안정형 투자 입문자',
    filters: { age: '24~26세', job: '사회초년생', income: '200~250만 원', spend: '교통 절약', saveRate: '10~20%', investType: 'ETF 관심' },
    stats: [
      { label: 'ETF', value: '186만', icon: 'stocks' },
      { label: '비상금', value: '420만', icon: 'saving' },
      { label: '저축률', value: '18%', icon: 'chart' },
    ],
    snapshot: [
      { label: '총 금융자산', value: '14,720,000원', caption: '비상금을 유지하며 ETF를 소액으로 시작', icon: 'fund' },
      { label: '월 평균 저축', value: '520,000원', caption: '비상금 320,000원 + ETF 200,000원', icon: 'saving' },
      { label: '이번 달 소비', value: '1,680,000원', caption: '교통비와 구독료를 낮게 유지', icon: 'spend' },
    ],
    assets: [
      { id: 'checking', label: '입출금', amountLabel: '4,200,000원', sharePercent: 28.5, note: '1.8개월치 비상금' },
      { id: 'savings', label: '적금', amountLabel: '6,350,000원', sharePercent: 43.1, note: '월 320,000원 자동저축' },
      { id: 'investment', label: '투자', amountLabel: '1,860,000원', sharePercent: 12.6, note: 'ETF 중심 소액 분산' },
      { id: 'pension', label: '연금', amountLabel: '2,310,000원', sharePercent: 15.7, note: '연금저축으로 장기 준비' },
    ],
    investments: [
      { name: 'KODEX 미국S&P500TR', amountLabel: '820,000원', deltaLabel: '▲ 21,000원 (2.6%)', deltaTone: 'up' },
      { name: 'TIGER 미국나스닥100', amountLabel: '540,000원', deltaLabel: '▲ 8,000원 (1.5%)', deltaTone: 'up' },
      { name: 'KODEX 단기채권', amountLabel: '500,000원', deltaLabel: '변동 낮음', deltaTone: 'flat' },
    ],
    savings: [
      { name: '비상금 통장', amountLabel: '4,200,000원', note: '투자 전 현금 쿠션으로 유지' },
      { name: '정기적금', amountLabel: '6,350,000원', note: '월 320,000원 납입' },
    ],
    spending: [
      { category: '교통', amountLabel: '96,000원', note: '지난달보다 12% 감소' },
      { category: '식비', amountLabel: '560,000원', note: '평일 점심 고정비 중심' },
      { category: '구독', amountLabel: '34,000원', note: '음악/클라우드만 유지' },
    ],
    habits: [
      { icon: 'quiz', fallback: '퀴즈', title: 'ETF 개념 정리', desc: '상품 가입보다 용어와 위험도를 먼저 확인해요.' },
      { icon: 'potion', fallback: '물약', title: '비상금 유지', desc: '투자 전 현금 쿠션을 먼저 확보해요.' },
      { icon: 'shield', fallback: '방패', title: '대중교통 루틴', desc: '교통비를 줄여 투자 공부 예산으로 돌려요.' },
    ],
    buildSummary: '비상금을 유지하면서 ETF 개념 학습으로 투자 공격력을 천천히 올리는 빌드예요.',
  },
  {
    id: 'anon-fashion-04',
    species: 'bird',
    name: '익명 모험가 D',
    age: 25,
    matchPercent: 76,
    tagline: '패션 지출 한도를 정해 여행 목표를 지키는 균형형',
    filters: { age: '24~26세', job: '대학생', income: '100만 원 미만', spend: '패션', saveRate: '10~20%', investType: '투자 입문' },
    stats: [
      { label: '여행통장', value: '310만', icon: 'saving' },
      { label: '의류한도', value: '월 3만', icon: 'cart' },
      { label: '투자준비', value: '50만', icon: 'stocks' },
    ],
    snapshot: [
      { label: '총 금융자산', value: '7,950,000원', caption: '여행 통장과 잔돈 저축 중심', icon: 'fund' },
      { label: '월 평균 저축', value: '250,000원', caption: '여행통장 220,000원 + 잔돈저축', icon: 'saving' },
      { label: '이번 달 소비', value: '980,000원', caption: '의류 예산을 30,000원으로 제한', icon: 'spend' },
    ],
    assets: [
      { id: 'checking', label: '입출금', amountLabel: '2,180,000원', sharePercent: 27.4, note: '약속/생활비 예산' },
      { id: 'travel', label: '여행통장', amountLabel: '3,100,000원', sharePercent: 39.0, note: '유럽여행 목표 자금' },
      { id: 'savings', label: '잔돈저축', amountLabel: '2,170,000원', sharePercent: 27.3, note: '결제 후 잔돈 자동저축' },
      { id: 'investment', label: '투자준비금', amountLabel: '500,000원', sharePercent: 6.3, note: 'ETF 학습 후 투입 예정' },
    ],
    investments: [
      { name: 'ETF 예비자금', amountLabel: '500,000원', deltaLabel: '아직 매수 전', deltaTone: 'flat' },
      { name: '투자 O/X 학습', amountLabel: '4회', deltaLabel: '기초 개념 진행 중', deltaTone: 'flat' },
    ],
    savings: [
      { name: '유럽여행 통장', amountLabel: '3,100,000원', note: '목표 5,000,000원까지 62%' },
      { name: '잔돈 저축', amountLabel: '2,170,000원', note: '카드 결제 잔돈을 자동 이체' },
    ],
    spending: [
      { category: '쇼핑·패션', amountLabel: '30,000원', note: '이번 달 한도 유지 중' },
      { category: '문화·약속', amountLabel: '210,000원', note: '주 1회 약속 기준' },
      { category: '카페·간식', amountLabel: '92,000원', note: '약속 있는 날만 지출 증가' },
    ],
    habits: [
      { icon: 'chest', fallback: '상자', title: '옷 예산 봉인', desc: '월초에 의류 예산을 따로 묶어 초과를 막아요.' },
      { icon: 'piggy', fallback: '저축', title: '잔돈 저축', desc: '결제 후 남는 잔돈을 여행 통장으로 보내요.' },
      { icon: 'heart', fallback: '하트', title: '약속 전 예산 확인', desc: '약속이 있는 날만 지출 한도를 다시 확인해요.' },
    ],
    buildSummary: '패션 지출을 조절하면서 여행 목표를 유지하는 균형 빌드예요.',
  },
]

export const mateAdventurer = {
  species: 'otter' as MateSpecies,
  name: '익명 모험가 A',
  age: 24,
  tagline: '카페를 즐기지만 저축은 꾸준히!',
  matchPercent: 92,
  badges: [
    { icon: 'saving', label: '방어형 성향 20%' },
    { icon: 'saving', label: 'HP 만피 유지 중' },
    { icon: 'stocks', label: '적립 스트릭 5개월' },
    { icon: 'spark', label: 'Lv 12' },
  ],
}

export const mateHabitSummary: Array<{ id: string; icon: RpgIconName; fallback: string; title: string; desc: string; pill: string }> = [
  { id: 'h1', icon: 'coffee', fallback: '☕', title: '카페비 관리 우수', desc: '월 평균 카페비 효율적으로 관리', pill: '관리 상위 15%' },
  { id: 'h2', icon: 'piggy', fallback: '🐷', title: '꾸준한 자동저축', desc: '자동저축으로 저축률 유지 중', pill: '저축률 상위 25%' },
  { id: 'h3', icon: 'shield', fallback: '🛡️', title: '안정형 투자', desc: '위험은 줄이고 꾸준히 성장 중', pill: '안정형 상위 20%' },
]

export const mateBuildProfile = {
  species: 'otter' as MateSpecies,
  name: '익명 모험가 A의 빌드',
  meta: '24세 · 사회초년생',
}

export type MateBuildOption = { id: string; icon: RpgIconName; fallback: string; title: string; desc: string; defaultOn: boolean }
export const mateBuildOptions: MateBuildOption[] = [
  { id: 'saving-gear', icon: 'shield', fallback: '🛡️', title: '이 사람의 적금 장비 장착해보기', desc: '꾸준한 자동저축 + 지출 관리 습관', defaultOn: true },
  { id: 'invest-routine', icon: 'swords', fallback: '⚔️', title: '이 사람의 투자 루틴 따라해보기', desc: '분산 투자 + 정기 리밸런싱 루틴', defaultOn: false },
  { id: 'saving-rate', icon: 'potion', fallback: '🧪', title: '이 사람의 저축률을 따라해보기', desc: '소득 대비 저축률 20% 이상 유지', defaultOn: false },
]

export const mateBuildChart = {
  months: ['현재', '1개월 후', '2개월 후', '3개월 후', '4개월 후', '5개월 후', '6개월 후'],
  withBuild: [400, 432, 462, 491, 520, 548, 552],
  asIs: [400, 415, 428, 442, 465, 480, 505],
  hpGainMonths: 1.2,
}
