import { Link } from 'react-router-dom'
import { Chevron, IconBadge } from '../design-v2/primitives'
import { MateAvatar, MateCoachCard, MateSectionCard } from '../design-v2/MateShared'

type MateGroup = { groupId: string; name: string; memberCount: number }

export function MateDiscovery({ groups }: { groups: MateGroup[] }) {
  const primary = groups[0]
  return <div className="mate-tab-stack">
    {primary ? <MateSectionCard eyebrowIcon="profile" title="나와 비슷한 그룹" className="mate-group-card">
      <div className="mate-group-copy"><p><IconBadge icon="profile" tone="teal"/>{primary.name}</p><p><IconBadge icon="saving" tone="warning"/>비슷한 출발점에서 루틴을 이어온 익명 그룹</p></div>
      <div className="mate-group-trio"><MateAvatar species="otter" size={76} fit="contain"/><MateAvatar species="rabbit" size={76} fit="contain"/><MateAvatar species="bear" size={76} fit="contain"/></div>
      <span className="mate-group-count">그룹 구성원 {primary.memberCount.toLocaleString('ko-KR')}명</span>
    </MateSectionCard> : null}

    <MateSectionCard eyebrowIcon="chart" title="추천 유사그룹" subtitle="정확 금액과 공개 순위 없이 루틴을 살펴봐요">
      <div className="mate-anonymous-list">{groups.map((group, index) => <Link className="mate-anonymous-card" to={`/mates/group/${group.groupId}`} key={group.groupId}><MateAvatar species={index % 2 === 0 ? 'rabbit' : 'bear'} size={82} fit="contain" className="mate-anonymous-avatar"/><span className="mate-anonymous-copy"><span className="mate-adventurer-match">검증된 익명 그룹</span><strong>{group.name}</strong><small>목표를 바꾸지 않고 실행 루틴만 참고해요.</small><span className="mate-anonymous-stat-strip"><i>{group.memberCount}명</i><i>정확 금액 비공개</i></span></span><Chevron/></Link>)}</div>
    </MateSectionCard>

    <MateCoachCard message="금액이 아니라 비슷한 생활 조건에서 꾸준히 유지한 행동을 먼저 확인해보세요."/>
  </div>
}
