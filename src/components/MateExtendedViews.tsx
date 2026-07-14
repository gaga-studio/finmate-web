import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Schema } from '../api/client'
import styles from './MateExtendedViews.module.css'

const avatarFor = (code: string) => {
  const value = code.toLowerCase()
  if (value.includes('bear') || value.includes('budget')) return '/assets/characters/mate/mate-char-bear.png'
  if (value.includes('bird')) return '/assets/characters/mate/mate-char-bird.png'
  if (value.includes('otter')) return '/assets/characters/mate/mate-char-otter.png'
  return '/assets/characters/mate/mate-char-rabbit.png'
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
    <nav className={styles.segmented} aria-label="메이트 화면">
      <Link aria-current={active === 'friends' ? 'page' : undefined} to="/mates/friends">친구</Link>
      <Link aria-current={active === 'groups' ? 'page' : undefined} to="/mates">메이트 찾기</Link>
      <Link aria-current={active === 'explore' ? 'page' : undefined} to="/mates/explore">비교 탐색</Link>
    </nav>
  )
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
  return (
    <section className={styles.page}>
      <header className={styles.titleHeader}>
        <div><p>메이트</p><h1>친구와 이어온 작은 습관</h1><span>합성 친구의 금액 없는 활동만 보여드려요.</span></div>
        <Users size={34} aria-hidden="true" />
      </header>
      <MateSectionNav active="friends" />

      <section className={styles.friendSummary}>
        <div><span>오늘 퀘스트</span><strong>{overview.completedToday} / {overview.friendCount}명 완료</strong></div>
        <div className={styles.avatarRow}>
          {overview.friends.map((friend) => (
            <span className={friend.questCompletedToday ? styles.avatarDone : undefined} key={friend.friendId} title={friend.alias}>
              <img src={avatarFor(friend.avatarCode)} alt="" />
              {friend.questCompletedToday && <CheckCircle2 size={15} />}
            </span>
          ))}
        </div>
        <small>친구 추가와 팔로우 관리는 다음 단계에서 제공해요.</small>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}><div><p>금융 근황</p><h2>완료 여부만 가볍게 확인해요</h2></div><span className={styles.readOnly}>읽기 전용</span></div>
        <div className={styles.feedList}>
          {feed.items.length === 0 && <p className={styles.emptyCopy}>아직 새로운 친구 활동이 없어요.</p>}
          {feed.items.map((item) => (
            <article key={`${item.friendId}-${item.occurredAt}`}>
              <img src={avatarFor(item.avatarCode)} alt="" />
              <div><strong>{item.alias}</strong><p>{item.message}</p><small>{item.completed ? '완료' : '진행 중'} · 금액 비공개</small></div>
              {item.completed ? <CheckCircle2 size={19} /> : <Clock3 size={19} />}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}><div><p>연속기록</p><h2>친구와 함께 이어온 시간</h2></div><CalendarDays size={23} /></div>
        <div className={styles.streakGrid}>
          {streaks.items.map((item) => <article key={item.friendId}><strong>{item.daysTogether}일</strong><span>{item.alias}</span><small>{item.label}</small></article>)}
        </div>
      </section>

      <aside className={styles.safety}><ShieldCheck size={20} /><p>친구 화면은 경쟁 순위 없이 함께 이어온 행동만 보여줘요.</p></aside>
    </section>
  )
}

export function GroupInsightView({ report }: { report: Schema['MateGroupReport'] }) {
  return (
    <section className={styles.insightPanel}>
      <div className={styles.sectionTitle}><div><p>그룹 리포트</p><h2>이 그룹이 추천된 이유</h2></div><Sparkles size={22} /></div>
      <ul className={styles.reasonList}>{report.selectionReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
      <div className={styles.rangeGrid}>
        <article><span>소비율 중간 50%</span><strong>{percent(report.spendingRateRange.p25Bps)}–{percent(report.spendingRateRange.p75Bps)}</strong></article>
        <article><span>저축률 중간 50%</span><strong>{percent(report.savingRateRange.p25Bps)}–{percent(report.savingRateRange.p75Bps)}</strong></article>
      </div>
      <p className={styles.caption}>목표 달성 경험이 확인된 익명 모험가 {report.achieverCount}명 · 정확 금액과 순위는 표시하지 않아요.</p>
    </section>
  )
}

export function ExploreResults({ results }: { results: Schema['RecommendedAdventurerPage'] | null }) {
  if (!results) return <section className={styles.exploreEmpty}><Compass size={31} /><h2>비교 조건을 정해보세요</h2><p>검수된 조합 안에서 나와 비슷한 합성 모험가를 찾아드려요.</p></section>
  if (results.items.length === 0) return <section className={styles.exploreEmpty}><Users size={31} /><h2>조건에 맞는 모험가가 없어요</h2><p>금융여력 조건은 유지하고 생활 조건을 한 단계 넓혀보세요.</p></section>
  return (
    <section className={styles.results}>
      <div className={styles.sectionTitle}><div><p>추천 결과</p><h2>{results.items.length}명의 익명 모험가</h2></div><span className={styles.readOnly}>합성 데이터</span></div>
      {results.items.map((adventurer) => (
        <Link className={styles.resultCard} to={`/mates/group/${adventurer.groupId}/adventurer/${adventurer.adventurerId}`} key={adventurer.adventurerId}>
          <img src={avatarFor(adventurer.groupId)} alt="" />
          <div><span>{adventurer.goalAchievementLabel}</span><h3>{adventurer.alias}</h3><p>{adventurer.similarityReasons[0]}</p><small>{adventurer.contextTags.join(' · ')}</small></div>
          <ChevronRight size={21} />
        </Link>
      ))}
    </section>
  )
}

export function AdventurerProfileView({ adventurer }: { adventurer: Schema['RecommendedAdventurerCard'] }) {
  return (
    <section className={styles.page}>
      <Link className={styles.backLink} to={`/mates/group/${adventurer.groupId}`}><ArrowLeft size={19} />그룹으로</Link>
      <header className={styles.profileHeader}>
        <img src={avatarFor(adventurer.groupId)} alt="" />
        <div><p>추천 익명 모험가</p><h1>{adventurer.alias}</h1><span>{adventurer.goalAchievementLabel}</span></div>
      </header>
      <div className={styles.tagRow}>{adventurer.contextTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <section className={styles.section}>
        <div className={styles.sectionTitle}><div><p>유사한 이유</p><h2>출발점이 이렇게 닮았어요</h2></div><ShieldCheck size={22} /></div>
        <ul className={styles.reasonList}>{adventurer.similarityReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionTitle}><div><p>검증된 루틴</p><h2>꾸준히 유지한 행동</h2></div><CalendarDays size={22} /></div>
        <div className={styles.routineList}>{adventurer.routines.map((routine) => <article key={routine.routineId}><div><strong>{routine.title}</strong><span>{routine.maintenanceDays}일 유지 · {routine.domain === 'SAVING' ? '저축' : routine.domain === 'SPENDING' ? '소비' : '투자 판단'}</span></div><Link to={`/mates/group/${adventurer.groupId}/adventurer/${adventurer.adventurerId}/routine/${routine.routineId}`}>루틴 보기<ChevronRight size={18} /></Link></article>)}</div>
      </section>
      <Link className={styles.primaryLink} to={`/mates/group/${adventurer.groupId}/adventurer/${adventurer.adventurerId}/report`}>나와 비교한 리포트 보기<ChevronRight size={20} /></Link>
      <aside className={styles.safety}><ShieldCheck size={20} /><p>개인정보와 정확 금액 없이 공개 동의된 생활 맥락과 루틴만 보여줘요.</p></aside>
    </section>
  )
}

export function AdventurerReportView({ report }: { report: Schema['AdventurerReport'] }) {
  const routine = report.adventurer.routines[0]
  return (
    <section className={styles.page}>
      <Link className={styles.backLink} to={`/mates/group/${report.adventurer.groupId}/adventurer/${report.adventurer.adventurerId}`}><ArrowLeft size={19} />모험가로</Link>
      <header className={styles.reportHeader}><div><p>익명 1:1 비교</p><h1>나와 {report.adventurer.alias}</h1><span>순위가 아니라 습관 범위를 비교해요.</span></div><img src={avatarFor(report.adventurer.groupId)} alt="" /></header>
      <section className={styles.comparisonList}>
        {report.comparisonMetrics.map((metric) => <article key={metric.label}><h2>{metric.label}</h2><div><span>나</span><strong>{metric.myRange}</strong></div><div><span>모험가</span><strong>{metric.adventurerRange}</strong></div><p>{approvedCopy(metric.interpretationCopyKey)}</p></article>)}
      </section>
      <section className={styles.section}>
        <div className={styles.sectionTitle}><div><p>유지 근거</p><h2>이 루틴을 추천하는 이유</h2></div><ShieldCheck size={22} /></div>
        <ul className={styles.reasonList}>{report.routineEvidence.map((evidence) => <li key={evidence}>{approvedCopy(evidence)}</li>)}</ul>
      </section>
      {routine && <Link className={styles.primaryLink} to={`/routine/${report.adventurer.groupId}/${report.adventurer.adventurerId}/${routine.routineId}`}>이 루틴을 내 상황에 맞추기<ChevronRight size={20} /></Link>}
      <p className={styles.caption}>비교 결과는 행동을 고르는 참고 정보이며 금융상품이나 투자를 추천하지 않아요.</p>
    </section>
  )
}
