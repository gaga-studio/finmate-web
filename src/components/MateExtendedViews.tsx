import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MateExploreSearchPage, Schema } from '../api/client'
import { developmentDataSourceLabel } from '../api/runtime'
import { EmptyState } from '../design-v2/components'
import { MateAvatar, MateCoachCard, MatePointPill, MateSectionCard, MateStatBadge, RpgIcon, type MateSpecies } from '../design-v2/MateShared'

const speciesFor = (code: string): MateSpecies => {
  const value = code.toLowerCase()
  if (value.includes('bear') || value.includes('budget')) return 'bear'
  if (value.includes('bird')) return 'bird'
  if (value.includes('otter')) return 'otter'
  return 'rabbit'
}

const percent = (basisPoints: number) => `${(basisPoints / 100).toFixed(basisPoints % 100 === 0 ? 0 : 1)}%`

const interpretationCopy: Record<string, string> = {
  SAVING_GAP_IS_ACTIONABLE: '차이는 부담 없는 저축 행동부터 줄일 수 있어요.',
  CHECK_BEFORE_SPENDING: '지출 전에 예산을 확인한 빈도를 참고해 보세요.',
  MAINTENANCE_OVER_AMOUNT: '금액보다 루틴을 유지한 기간을 참고해요.',
}

const approvedCopy = (value: string) => interpretationCopy[value] ?? (/[가-힣]/.test(value) ? value : '검증된 행동 범위를 참고해 보세요.')

export function MateSectionNav({ active }: { active: 'friends' | 'groups' | 'explore' }) {
  return (
    <nav className="segmented-control" aria-label="메이트 화면">
      <Link className={active === 'friends' ? 'is-active' : ''} aria-current={active === 'friends' ? 'page' : undefined} to="/mates/friends">친구</Link>
      <Link className={active === 'groups' ? 'is-active' : ''} aria-current={active === 'groups' ? 'page' : undefined} to="/mates">메이트 찾기</Link>
      <Link className={active === 'explore' ? 'is-active' : ''} aria-current={active === 'explore' ? 'page' : undefined} to="/mates/explore">비교 탐색</Link>
    </nav>
  )
}

export function MateTopHeader({ subtitle, pointBalance }: { subtitle: string; pointBalance: number }) {
  return <><div className="mate-reference-status roadmap-status" aria-hidden="true"><strong>9:41</strong><span><i/><i/><i/></span></div><header className="mate-hero-header mate-reference-topline"><div><h1>메이트</h1><p>{subtitle}</p></div><div className="mate-top-bar"><MatePointPill value={pointBalance}/><Link className="mate-top-avatar-button" to="/settings" aria-label="공개 범위와 설정"><MateAvatar species="me" size={52} fit="contain" className="mate-top-avatar"/></Link></div></header></>
}

export function FriendOverviewView({
  overview,
  feed,
  streaks,
}: {
  overview: Schema['MateFriendOverview']
  feed: Schema['MateFriendFeed']
  streaks: Schema['MateStreakPage']
}) {
  return <div className="mate-tab-stack"><MateSectionCard className="mate-friend-summary" eyebrowIcon="profile" title={<>친구 {overview.friendCount}명 중 <b style={{ color: 'var(--teal-600)' }}>{overview.completedToday}</b>명이</>} subtitle="오늘의 퀘스트를 완료했어요" action={<div className="mate-friend-slots">{overview.friends.map((friend) => <MateAvatar key={friend.friendId} species={speciesFor(friend.avatarCode)} size={54} fit="contain" locked={!friend.questCompletedToday} badge={friend.questCompletedToday ? '✓' : undefined}/>)}</div>}/>
    <MateSectionCard eyebrowIcon="spark" title="금융 근황 피드" action={<span className="mate-card-link">읽기 전용</span>}><div className="mate-feed-list">{feed.items.map((item) => <div className="mate-feed-item" key={`${item.friendId}-${item.occurredAt}`}><MateAvatar species={speciesFor(item.avatarCode)} size={48} fit="contain"/><span className="mate-feed-copy"><b>{item.alias}</b>가 {item.message}</span><span className={`mate-feed-stat ${item.completed ? 'teal' : 'warning'}`}>{item.completed ? '완료' : '진행 중'}</span></div>)}</div></MateSectionCard>
    <MateSectionCard eyebrowIcon="gift" title="연속기록"><div className="mate-streak-list">{streaks.items.map((item) => <div className="mate-streak-row" key={item.friendId}><div className="mate-streak-avatars"><MateAvatar species="me" size={52} fit="contain"/><MateAvatar species="rabbit" size={52} fit="contain"/></div><div className="mate-streak-copy"><strong>🔥 {item.alias}와 {item.daysTogether}일째</strong><span>{item.label}</span></div></div>)}</div><p className="mate-streak-note">공개 순위 없이 함께 이어온 행동만 확인해요.</p></MateSectionCard>
    <div className="mate-banner"><MateAvatar species="coach" size={86} fit="contain" className="mate-coach-avatar"/><p>정확한 금액 없이 친구가 이어온 금융 행동만 가볍게 확인해요.</p></div>
  </div>
}

export function GroupInsightView({ report }: { report: Schema['MateGroupReport'] }) {
  return (
    <div className="mate-tab-stack">
      <MateSectionCard eyebrowIcon="spark" title="이 그룹이 추천된 이유" subtitle="정확 금액 대신 생활 맥락과 금융 습관 범위를 비교해요.">
        <ul className="mate-reason-list">{report.selectionReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
      </MateSectionCard>
      <MateSectionCard eyebrowIcon="chart" title="그룹 금융 습관 범위" subtitle="가운데 50% 구간">
        <div className="mate-insight-grid">
          <article className="mate-insight-card"><p>소비율</p><b>{percent(report.spendingRateRange.p25Bps)}–{percent(report.spendingRateRange.p75Bps)}</b></article>
          <article className="mate-insight-card alt"><p>저축률</p><b>{percent(report.savingRateRange.p25Bps)}–{percent(report.savingRateRange.p75Bps)}</b></article>
        </div>
        <p className="mate-streak-note">목표 달성 경험이 확인된 익명 모험가 {report.achieverCount}명 · 순위 없음</p>
      </MateSectionCard>
      <MateCoachCard message="비슷한 출발점의 범위를 참고하되, 실제 목표와 실행 강도는 내 기준선으로 다시 계산해요." />
    </div>
  )
}

const relaxedFilterLabels: Record<MateExploreSearchPage['relaxedFilters'][number], string> = {
  ageBand: '나이',
  occupationGroup: '직업',
  spendingTendency: '소비 성향',
  investmentTendency: '투자 성향',
}

const routineDomainLabel = (domain: Schema['AdaptationDomain']) => domain === 'SAVING' ? '저축' : domain === 'SPENDING' ? '소비' : '투자 판단'

export function ExploreResults({ results }: { results: MateExploreSearchPage | null }) {
  const dataSource = developmentDataSourceLabel()
  if (!results) return <EmptyState title="비교 조건을 정해보세요" subtitle="검수된 조합 안에서 나와 비슷한 합성 모험가를 찾아드려요." />
  if (results.items.length === 0) return <EmptyState title="조건에 맞는 모험가가 없어요" subtitle="금융여력 조건은 유지하고 생활 조건을 한 단계 넓혀보세요." />
  return (
    <section className="mate-card mate-explore-results-card">
      <header className="mate-explore-results-head">
        <span>추천 결과{dataSource ? ` · ${dataSource}` : ''}</span>
        <h2>{results.items.length}명의 익명 모험가</h2>
        <p>{results.matchMode === 'RELAXED' ? `일부 생활 조건을 넓혀 찾았어요 · ${results.relaxedFilters.map((filter) => relaxedFilterLabels[filter]).join(' · ')}` : `정확 조건으로 찾은 ${results.totalEligible}명 중 유사한 순서예요.`}</p>
      </header>
      <div className="mate-anonymous-list">
        {results.items.map((adventurer) => (
          <Link className="mate-anonymous-card" to={`/mates/group/${adventurer.groupId}/adventurer/${adventurer.adventurerId}`} key={adventurer.adventurerId}>
            <MateAvatar species={speciesFor(adventurer.adventurerId)} size={82} fit="contain" className="mate-anonymous-avatar" />
            <span className="mate-anonymous-copy"><strong>{adventurer.alias}</strong><small>{adventurer.representativeRoutine.title} · {adventurer.maintenanceDays}일</small><em>{adventurer.contextTags.join(' · ')}</em></span>
            <span className="mate-anonymous-stat-strip"><i>{routineDomainLabel(adventurer.representativeRoutine.domain)} · 유사도 {percent(adventurer.similarityScoreBps)}</i><ChevronRight size={18} /></span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function AdventurerProfileView({ adventurer }: { adventurer: Schema['RecommendedAdventurerCard'] }) {
  return (
    <section className="screen-stack tab-main-stack mate-profile-detail-stack">
      <Link className="mate-back-link" to={`/mates/group/${adventurer.groupId}`}><ArrowLeft size={19} />그룹으로</Link>
      <section className="mate-card mate-adventurer-card">
        <div className="mate-adventurer-top"><span className="mate-adventurer-match">추천 익명 모험가</span><span className="mate-card-link">검증 {new Date(adventurer.verifiedAt).toLocaleDateString('ko-KR')}</span></div>
        <div className="mate-adventurer-body"><MateAvatar species={speciesFor(adventurer.groupId)} size={118} fit="contain" className="mate-adventurer-avatar"/><div><h1 className="mate-adventurer-name">{adventurer.alias}</h1><p className="mate-adventurer-tagline">{adventurer.goalAchievementLabel}</p></div></div>
        <div className="mate-adventurer-badges">{adventurer.contextTags.map((tag) => <MateStatBadge icon="profile" label={tag} key={tag}/>)}</div>
      </section>
      <MateSectionCard eyebrowIcon="shield" title="출발점이 이렇게 닮았어요"><ul className="mate-reason-list">{adventurer.similarityReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></MateSectionCard>
      <MateSectionCard eyebrowIcon="calendar" title="꾸준히 유지한 행동" subtitle="검증된 루틴만 표시해요">
        <div className="mate-option-list">{adventurer.routines.map((routine) => <div className="mate-option-row" key={routine.routineId}><RpgIcon name={routine.domain === 'SAVING' ? 'piggy' : routine.domain === 'SPENDING' ? 'shield' : 'quiz'} size={40}/><span><strong>{routine.title}</strong><small>{routine.maintenanceDays}일 유지 · {routine.domain === 'SAVING' ? '저축' : routine.domain === 'SPENDING' ? '소비' : '투자 판단'}</small></span><Link aria-label={`루틴 보기: ${routine.title}`} className="mate-card-link" to={`/mates/group/${adventurer.groupId}/adventurer/${adventurer.adventurerId}/routine/${routine.routineId}`}>보기</Link></div>)}</div>
      </MateSectionCard>
      <Link className="app-button primary" to={`/mates/group/${adventurer.groupId}/adventurer/${adventurer.adventurerId}/report`}>나와 비교한 리포트 보기<ChevronRight size={20}/></Link>
      <aside className="mate-build-note"><ShieldCheck size={18}/> 개인정보와 정확 금액 없이 공개 동의된 맥락과 루틴만 보여줘요.</aside>
    </section>
  )
}

export function AdventurerReportView({ report }: { report: Schema['AdventurerReport'] }) {
  const routine = report.adventurer.routines[0]
  return (
    <section className="screen-stack tab-main-stack mate-profile-detail-stack">
      <Link className="mate-back-link" to={`/mates/group/${report.adventurer.groupId}/adventurer/${report.adventurer.adventurerId}`}><ArrowLeft size={19}/>모험가로</Link>
      <section className="mate-card mate-adventurer-card">
        <div className="mate-adventurer-body"><MateAvatar species="me" size={92} fit="contain"/><div><span className="mate-adventurer-match">익명 1:1 비교</span><h1 className="mate-adventurer-name">나와 {report.adventurer.alias}</h1><p className="mate-adventurer-tagline">순위가 아니라 습관 범위를 비교해요.</p></div><MateAvatar species={speciesFor(report.adventurer.groupId)} size={92} fit="contain"/></div>
      </section>
      <MateSectionCard eyebrowIcon="chart" title="금융 습관 비교">
        <div className="mate-vs-gauges">{report.comparisonMetrics.map((metric) => <div className="mate-gauge-row" key={metric.label}><div className="mate-gauge-row-head"><span>{metric.label}</span><b>{approvedCopy(metric.interpretationCopyKey)}</b></div><div className="mate-comparison-ranges"><span>나 <strong>{metric.myRange}</strong></span><span>모험가 <strong>{metric.adventurerRange}</strong></span></div></div>)}</div>
      </MateSectionCard>
      <MateSectionCard eyebrowIcon="shield" title="이 루틴을 추천하는 이유"><ul className="mate-reason-list">{report.routineEvidence.map((evidence) => <li key={evidence}>{approvedCopy(evidence)}</li>)}</ul></MateSectionCard>
      {routine ? <Link className="app-button primary" to={`/routine/${report.adventurer.groupId}/${report.adventurer.adventurerId}/${routine.routineId}`}>이 루틴을 내 상황에 맞추기<ChevronRight size={20}/></Link> : null}
      <p className="mate-build-note">비교 결과는 행동을 고르는 참고 정보이며 금융상품이나 투자를 추천하지 않아요.</p>
    </section>
  )
}
