import { CalendarCheck, ChevronRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Schema } from '../api/client'
import styles from './MateJourneyViews.module.css'

const adventurerImage = (groupId: string) => groupId === 'budget'
  ? '/assets/characters/mate/mate-char-bear.png'
  : '/assets/characters/mate/mate-char-rabbit.png'

export function MateGroupDetailView({
  group,
  adventurers,
}: {
  group: Schema['MateGroup']
  adventurers: Schema['RecommendedAdventurerCard'][]
}) {
  return (
    <section className={styles.page}>
      <header className={styles.groupHeader}>
        <div>
          <p>{group.memberCount}명의 익명 모험가</p>
          <h1>{group.name}</h1>
          <span>비슷한 출발점에서 꾸준히 유지한 루틴을 살펴보세요.</span>
        </div>
        <div className={styles.groupCharacters} aria-hidden="true">
          <img src="/assets/characters/mate/mate-char-bird.png" alt="" />
          <img src={adventurerImage(group.groupId)} alt="" />
        </div>
      </header>

      <aside className={styles.groupRule}>
        <ShieldCheck size={20} />
        <p>목표 달성 경험과 루틴 유지 근거가 확인된 익명 모험가예요.</p>
      </aside>

      <div className={styles.adventurerList}>
        {adventurers.flatMap((adventurer) => adventurer.routines.map((routine) => (
          <Link
            className={styles.adventurerCard}
            to={`/mates/group/${group.groupId}/adventurer/${adventurer.adventurerId}/routine/${routine.routineId}`}
            key={routine.routineId}
          >
            <img src={adventurerImage(group.groupId)} alt="" />
            <div>
              <span>{adventurer.goalAchievementLabel}</span>
              <h2>{adventurer.alias}</h2>
              <p>{routine.title}</p>
              <small>{adventurer.contextTags.join(' · ')} · {routine.maintenanceDays}일 유지</small>
            </div>
            <ChevronRight size={22} aria-hidden="true" />
          </Link>
        )))}
      </div>
    </section>
  )
}

export function AdventurerRoutineIntro({ routine }: { routine: Schema['AdventurerRoutine'] }) {
  const alias = routine.groupId === 'budget' ? '남쪽의 모험가' : '북쪽의 모험가'
  return (
    <section className={styles.page}>
      <header className={styles.routineHeader}>
        <img src={adventurerImage(routine.groupId)} alt={`${alias} 캐릭터`} />
        <div>
          <p>추천 익명 모험가</p>
          <h1>{alias}</h1>
          <span>나와 비슷한 생활 조건에서 목표를 달성했어요.</span>
        </div>
      </header>

      <section className={styles.routineSummary}>
        <div className={styles.routineTitle}>
          <span>검증된 루틴</span>
          <h2>{routine.title}</h2>
        </div>
        <div className={styles.maintenance}>
          <CalendarCheck size={21} />
          <p><strong>{routine.maintenanceDays}일</strong><span>유지 기록</span></p>
        </div>
        <ol>
          {routine.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>

      <aside className={styles.adaptationRule}>
        상대의 정확한 금액은 복사하지 않고 내 여윳돈과 목표에 맞춰 다시 계산해요.
      </aside>

      <Link className={styles.primaryAction} to={`/routine/${routine.groupId}/${routine.adventurerId}/${routine.routineId}`}>
        루틴을 내 생활에 맞추기
        <ChevronRight size={20} aria-hidden="true" />
      </Link>
    </section>
  )
}
