import { CalendarCheck, ChevronRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Schema } from '../api/client'
import { MateAvatar, MateSectionCard, RpgIcon, type MateSpecies } from '../design-v2/MateShared'

const adventurerSpecies = (groupId: string): MateSpecies => groupId.toLowerCase().includes('budget') ? 'bear' : 'rabbit'

export function MateGroupDetailView({
  group,
  adventurers,
}: {
  group: Schema['MateGroup']
  adventurers: Schema['RecommendedAdventurerCard'][]
}) {
  return (
    <div className="mate-tab-stack">
      <MateSectionCard className="mate-group-card" eyebrowIcon="profile" title={group.name} subtitle="비슷한 출발점에서 꾸준히 유지한 루틴을 살펴보세요.">
        <div className="mate-group-copy"><p>{group.memberCount}명의 익명 모험가</p><div className="mate-group-trio"><MateAvatar species="bird" size={86} fit="contain"/><MateAvatar species={adventurerSpecies(group.groupId)} size={86} fit="contain"/><MateAvatar species="otter" size={86} fit="contain"/></div></div>
      </MateSectionCard>
      <aside className="mate-banner"><ShieldCheck size={22}/><p>목표 달성 경험과 루틴 유지 근거가 확인된 익명 모험가예요.</p></aside>
      <section className="mate-card"><header className="mate-card-head"><div className="mate-card-head-title"><RpgIcon name="medal" size={40}/><div><h2>추천 모험가</h2><p>정확 금액과 공개 순위는 표시하지 않아요.</p></div></div></header><div className="mate-anonymous-list">
        {adventurers.map((adventurer) => {
          const routine = adventurer.routines[0]
          return (
          <Link
            className="mate-anonymous-card"
            to={`/mates/group/${group.groupId}/adventurer/${adventurer.adventurerId}`}
            key={adventurer.adventurerId}
          >
            <MateAvatar species={adventurerSpecies(group.groupId)} size={82} fit="contain" className="mate-anonymous-avatar"/>
            <span className="mate-anonymous-copy"><strong>{adventurer.alias}</strong><small>{adventurer.goalAchievementLabel}</small><em>{routine?.title ?? '검증된 금융 루틴'}{routine ? ` · ${routine.maintenanceDays}일 유지` : ''}</em></span>
            <span className="mate-anonymous-stat-strip"><i>{adventurer.contextTags[0]}</i><ChevronRight size={18}/></span>
          </Link>
          )
        })}
      </div></section>
    </div>
  )
}

export function AdventurerRoutineIntro({ routine }: { routine: Schema['AdventurerRoutine'] }) {
  const alias = routine.groupId === 'budget' ? '남쪽의 모험가' : '북쪽의 모험가'
  return (
    <section className="screen-stack tab-main-stack mate-profile-detail-stack">
      <section className="mate-card mate-adventurer-card"><div className="mate-adventurer-body"><MateAvatar species={adventurerSpecies(routine.groupId)} size={118} fit="contain" className="mate-adventurer-avatar"/><div><span className="mate-adventurer-match">추천 익명 모험가</span><h1 className="mate-adventurer-name">{alias}</h1><p className="mate-adventurer-tagline">나와 비슷한 생활 조건에서 목표를 달성했어요.</p></div></div></section>
      <MateSectionCard eyebrowIcon="spark" title={routine.title} subtitle="검증된 루틴"><div className="mate-maintenance-summary"><CalendarCheck size={21}/><strong>{routine.maintenanceDays}일 유지</strong></div><ol className="mate-reason-list">{routine.steps.map((step) => <li key={step}>{step}</li>)}</ol></MateSectionCard>
      <aside className="mate-banner"><ShieldCheck size={20}/><p>상대의 정확한 금액은 복사하지 않고 내 여윳돈과 목표에 맞춰 다시 계산해요.</p></aside>
      <Link className="app-button primary" to={`/routine/${routine.groupId}/${routine.adventurerId}/${routine.routineId}`}>
        루틴을 내 생활에 맞추기
        <ChevronRight size={20} aria-hidden="true" />
      </Link>
    </section>
  )
}
