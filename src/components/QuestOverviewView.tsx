import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Schema } from '../api/client'
import { IconBadge } from '../design-v2/primitives'
import { QuestIcon, QuestMascot, QuestNumberedHeading, QuestProgressBar, QUEST_ASSET_DIR } from '../design-v2/QuestShared'

type Tab = 'available' | 'completed' | 'cosmetics'

const statusLabel: Record<Schema['Quest']['status'], string> = {
  AVAILABLE: '참여 가능', ACTIVE: '진행 중', DATA_PENDING: '데이터 반영 대기', COMPLETED: '완료', EXPIRED: '기간 종료', CANCELLED: '취소',
}

const iconFor = (quest: Schema['Quest']) => quest.title.includes('투자') || quest.title.includes('ETF')
  ? `${QUEST_ASSET_DIR}/quest-icon-invest.png`
  : quest.title.includes('소비') || quest.title.includes('카페')
    ? `${QUEST_ASSET_DIR}/quest-icon-spend.png`
    : quest.title.includes('퀴즈') || quest.title.includes('학습')
      ? `${QUEST_ASSET_DIR}/quest-icon-xp.png`
      : `${QUEST_ASSET_DIR}/quest-icon-heart.png`

export function QuestOverviewView({ page, pointLedger, cosmetics }: { page: Schema['QuestPage']; pointLedger: Schema['PointLedgerView']; cosmetics: Schema['CosmeticCatalogView'] }) {
  const [tab, setTab] = useState<Tab>('available')
  const available = page.items.filter((quest) => ['AVAILABLE', 'ACTIVE', 'DATA_PENDING'].includes(quest.status))
  const completed = page.items.filter((quest) => quest.status === 'COMPLETED')
  const recommended = available[0]
  const nextCosmetic = cosmetics.items.find((item) => !item.owned)
  const tabs: Array<{ id: Tab; label: string }> = [{ id: 'available', label: '참여 가능' }, { id: 'completed', label: '완료' }, { id: 'cosmetics', label: '꾸미기' }]

  return <>
    <div className="quest-tabs" role="tablist" aria-label="퀘스트 보기">{tabs.map((item) => <span className="quest-tab-slot" key={item.id}><button className={`quest-tab${tab === item.id ? ' is-active' : ''}`} type="button" role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)}>{item.label}{item.id === 'available' && available.length ? <span className="quest-tab-badge">{available.length}</span> : null}</button></span>)}</div>
    {tab === 'available' ? <div className="mate-tab-stack">
      <div className="quest-summary-section">
        <QuestNumberedHeading n={1} title="퀘스트 요약"/>
        <section className="mate-card quest-summary-card">
          <div className="quest-summary-top">
            <div className="quest-summary-left">
              <div className="quest-stat-row">
                <div className="quest-stat-box">
                  <span>오늘 퀘스트 진행 현황</span>
                  <strong>완료 {page.completedTodayCount} / {page.totalTodayCount}개</strong>
                  <div className="quest-summary-dots" aria-hidden="true">{Array.from({ length: page.totalTodayCount }, (_, index) => <i className={index < page.completedTodayCount ? 'is-complete' : ''} key={index}/>)}</div>
                  <QuestProgressBar value={page.totalTodayCount > 0 ? page.completedTodayCount / page.totalTodayCount * 100 : 0}/>
                  <small>서버에서 확인된 완료 건수예요.</small>
                </div>
                <div className="quest-stat-box">
                  <span>누적 퀘스트 보상</span>
                  <strong className="quest-stat-pills">
                    <span className="quest-pill xp"><img src={`${QUEST_ASSET_DIR}/quest-icon-xp.png`} alt=""/><b>{page.totalXp}</b><small>경험치</small></span>
                    <span className="quest-pill point"><img src={`${QUEST_ASSET_DIR}/quest-icon-chest.png`} alt=""/><b>{pointLedger.balance}</b><small>포인트</small></span>
                  </strong>
                </div>
              </div>
              {nextCosmetic ? <div className="quest-reward-box"><QuestIcon src={`${QUEST_ASSET_DIR}/quest-icon-chest.png`} tone="teal" size={44}/><span className="quest-reward-copy"><b>다음 꾸미기 해금</b><strong>{nextCosmetic.name}</strong><small>{nextCosmetic.pricePoints.toLocaleString('ko-KR')}P 필요 · 확정형 보상</small></span><img className="quest-reward-chest" src={`${QUEST_ASSET_DIR}/quest-icon-chest.png`} alt=""/></div> : null}
            </div>
            <div className="quest-summary-mascot"><QuestMascot size={176}/></div>
          </div>
          {recommended ? <Link aria-label={`추천 퀘스트: ${recommended.title}`} className="quest-ai-box" to={`/quests/${recommended.questId}`}><span className="quest-ai-recommend"><QuestIcon src={iconFor(recommended)} size={40}/><span><small>현재 홈 목표와 연결된 추천 퀘스트</small><strong>{recommended.title}</strong></span></span><i className="quest-ai-divider" aria-hidden="true"/><span className="quest-ai-message"><span className="quest-ai-tag">TIP</span><span><b>코치 설명</b><p>작은 행동을 먼저 기록하고 금융 성장은 새 데이터가 확인된 뒤 반영해요.</p></span></span></Link> : null}
        </section>
      </div>
      <aside className="mate-banner"><IconBadge icon="shield" tone="teal"/><p><strong>퀘스트 보상과 금융 성장은 분리돼요.</strong> 퀘스트는 XP와 꾸미기 포인트를 쌓고, 금융 스탯과 레이드는 데이터 동기화 후 다시 계산해요.</p></aside>
      <div className="quest-progress-section">
        <QuestNumberedHeading n={2} title="진행 중·참여 가능" action={<span className="quest-count-pill">{available.length}개</span>}/>
        <section className="mate-card quest-progress-card"><div className="quest-progress-list">{available.map((quest) => <Link aria-label={`퀘스트 상세: ${quest.title}`} className="quest-progress-row" to={`/quests/${quest.questId}`} key={quest.questId}><span className="quest-progress-main"><span className="quest-progress-heading"><QuestIcon src={iconFor(quest)} size={58}/><strong>{quest.title}</strong></span><span className="quest-progress-detail"><QuestProgressBar value={quest.targetValue > 0 ? quest.currentValue / quest.targetValue * 100 : 0}/><span className="quest-progress-meta"><span>{statusLabel[quest.status]}</span><span>{quest.durationLabel}</span></span><small className="quest-progress-value">현재 {quest.currentValue.toLocaleString('ko-KR')} / 목표 {quest.targetValue.toLocaleString('ko-KR')} {quest.unit === 'KRW' ? '원' : quest.unit === 'BASIS_POINTS' ? 'bp' : '회'}</small></span></span><span className="quest-progress-reward"><strong>XP {quest.xpReward}</strong><span>꾸미기 {quest.pointReward}P</span><em>금융 스탯 즉시 변경 없음</em></span></Link>)}</div></section>
      </div>
    </div> : null}
    {tab === 'completed' ? <section className="mate-card"><QuestNumberedHeading n={3} title="완료한 퀘스트"/><div className="quest-completed-list">{completed.length ? completed.map((quest) => <Link className="quest-completed-row" to={`/quests/${quest.questId}`} key={quest.questId}><QuestIcon src={iconFor(quest)} size={44}/><span className="quest-completed-copy"><strong>{quest.title}</strong><small>XP {quest.xpReward}와 기록 반영 완료</small></span><span className="quest-completed-badge">완료</span></Link>) : <p className="mate-streak-note">아직 완료한 퀘스트가 없어요.</p>}</div></section> : null}
    {tab === 'cosmetics' ? <div className="mate-tab-stack"><section className="quest-points-hero"><div><span className="quest-points-hero-label">보유 꾸미기 포인트</span><strong>{pointLedger.balance.toLocaleString('ko-KR')}P</strong><p>현금 전환과 랜덤 보상 없이 확정형 꾸미기에만 사용해요.</p></div><IconBadge icon="gift" tone="warning"/></section><section className="mate-card"><QuestNumberedHeading n={4} title="꾸미기 카탈로그"/><div className="quest-point-ledger">{cosmetics.items.map((item) => <div className="quest-point-row" key={item.id}><QuestIcon src={`${QUEST_ASSET_DIR}/quest-icon-chest.png`} size={42}/><span className="quest-point-copy"><strong>{item.name}</strong><small>{item.description}</small></span><span className="quest-point-amount">{item.owned ? '보유 중' : `${item.pricePoints.toLocaleString('ko-KR')}P`}</span></div>)}</div></section></div> : null}
  </>
}
