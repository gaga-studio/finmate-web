import { ChevronRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './MateDiscovery.module.css'

type MateGroup = {
  groupId: string
  name: string
  memberCount: number
}

const groupPresentation: Record<string, { image: string; description: string; badge: string }> = {
  savers: {
    image: '/assets/characters/mate/mate-char-rabbit.png',
    description: '먼저 저축하는 익명 루틴',
    badge: '저축 습관',
  },
  budget: {
    image: '/assets/characters/mate/mate-char-bear.png',
    description: '예산을 확인하는 익명 루틴',
    badge: '소비 점검',
  },
}

const fallbackPresentation = {
  image: '/assets/characters/mate/mate-char-otter.png',
  description: '비슷한 생활 조건에서 이어온 익명 금융 루틴',
  badge: '검증된 루틴',
}

export function MateDiscovery({ groups }: { groups: MateGroup[] }) {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p>메이트</p>
          <h1 aria-label="비슷한 출발점의 루틴을 발견해요">비슷한 출발점의<br />루틴을 발견해요</h1>
          <span>목표를 바꾸지 않고, 지금 실행할 루틴만 가져올 수 있어요.</span>
        </div>
        <div className={styles.party} aria-hidden="true">
          <img src="/assets/characters/mate/mate-char-bird.png" alt="" />
          <img src="/assets/characters/mate/mate-char-otter.png" alt="" />
          <img src="/assets/characters/mate/mate-char-rabbit.png" alt="" />
        </div>
      </header>

      <aside className={styles.safetyNotice}>
        <ShieldCheck size={20} />
        <p>정확한 금액과 순위는 숨기고, 검증된 루틴만 보여드려요.</p>
      </aside>

      <div className={styles.groupList}>
        {groups.map((group) => {
          const presentation = groupPresentation[group.groupId] ?? fallbackPresentation
          return (
            <Link className={styles.groupCard} to={`/mates/group/${group.groupId}`} key={group.groupId}>
              <div className={styles.characterStage}>
                <img src={presentation.image} alt={`${group.name} 대표 캐릭터`} />
              </div>
              <div className={styles.groupCopy}>
                <span>{presentation.badge}</span>
                <h2>{group.name}</h2>
                <p>{presentation.description}</p>
                <small>{group.memberCount}명의 익명 모험가</small>
              </div>
              <ChevronRight size={22} aria-hidden="true" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
