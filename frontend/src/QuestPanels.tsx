import { Chevron, IconBadge } from './uiPrimitives'
import { MatePointPill } from './MateShared'
import {
  QuestIcon,
  QuestMascot,
  QuestNumberedHeading,
  QuestProgressBar,
  questCategories,
  questCompleted,
  questInProgress,
  questPointLedger,
  questPointSummary,
  questSummary,
  QUEST_ASSET_DIR,
} from './QuestShared'
import type { Navigate } from './navigation'

export type QuestMainTab = 'available' | 'completed' | 'points'

export function QuestTabs({
  activeTab,
  onChange,
  availableCount,
}: {
  activeTab: QuestMainTab
  onChange: (tab: QuestMainTab) => void
  availableCount: number
}) {
  const tabs: Array<{ id: QuestMainTab; label: string }> = [
    { id: 'available', label: '참여 가능' },
    { id: 'completed', label: '완료' },
    { id: 'points', label: '포인트' },
  ]

  return (
    <div className="quest-tabs" role="tablist" aria-label="퀘스트 보기">
      {tabs.map((tab, index) => {
        const active = tab.id === activeTab
        const prevInactive = index > 0 && tabs[index - 1].id !== activeTab
        return (
          <span className="quest-tab-slot" key={tab.id}>
            {prevInactive && !active ? <i className="quest-tab-divider" aria-hidden="true" /> : null}
            <button
              className={`quest-tab${active ? ' is-active' : ''}`}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
              {tab.id === 'available' && availableCount > 0 ? (
                <span className="quest-tab-badge">{availableCount}</span>
              ) : null}
            </button>
          </span>
        )
      })}
    </div>
  )
}

/** 퀘스트 탭 · "참여 가능" — UI_퀘스트.png */
export function QuestAvailablePanel({ navigate }: { navigate: Navigate }) {
  return (
    <div className="mate-tab-stack">
      <section className="mate-card quest-category-card">
        <header className="mate-card-head">
          <div className="mate-card-head-title">
            <IconBadge icon="spark" tone="warning" />
            <h2>참여 가능한 퀘스트</h2>
          </div>
        </header>
        <div className="quest-category-grid">
          {questCategories.map((category) => (
            <div className={`quest-category-tile tone-${category.tone}`} key={category.id}>
              <span className="quest-category-label">{category.label}</span>
              <QuestIcon
                src={`${QUEST_ASSET_DIR}/quest-icon-${category.id}.png`}
                emoji={category.emoji}
                tone={category.tone}
                size={56}
              />
              <p>{category.desc}</p>
              <button className="quest-join-button" type="button" onClick={() => navigate('/missions/add')}>참여하기</button>
            </div>
          ))}
        </div>
        <div className="quest-category-footer">
          <span>🎁 다양한 퀘스트를 참여하고 보상을 받아보세요!</span>
          <button className="mate-card-link" type="button" onClick={() => navigate('/missions/add')}>전체 보기<Chevron /></button>
        </div>
      </section>

      <section className="mate-card quest-summary-card">
        <QuestNumberedHeading n={1} title="퀘스트 요약" />
        <div className="quest-summary-top">
          <div className="quest-summary-left">
            <div className="quest-stat-row">
              <div className="quest-stat-box">
                <span>오늘 퀘스트 진행 현황</span>
                <strong>완료 {questSummary.completed} / {questSummary.total}개</strong>
                <QuestProgressBar value={(questSummary.completed / questSummary.total) * 100} />
              </div>
              <div className="quest-stat-box">
                <span>오늘 획득 가능</span>
                <strong className="quest-stat-pills">
                  <span className="quest-pill xp">XP {questSummary.xp}</span>
                  <span className="quest-pill point">P {questSummary.point}</span>
                </strong>
              </div>
            </div>
            <div className="quest-reward-box">
              <span className="quest-reward-icon" aria-hidden="true">🎁</span>
              <span className="quest-reward-copy">
                <b>보상 상자 진행률</b>
                <strong>{questSummary.rewardBoxProgress}%</strong>
                <QuestProgressBar value={questSummary.rewardBoxProgress} />
              </span>
            </div>
          </div>
          <div className="quest-summary-mascot">
            <QuestMascot size={176} />
          </div>
        </div>
        <button className="quest-ai-box" type="button" onClick={() => navigate('/missions/add')}>
          <span className="quest-ai-recommend">
            <QuestIcon src={`${QUEST_ASSET_DIR}/quest-icon-spend.png`} emoji="☕" tone="mint" size={40} />
            <span>
              <small>현재 홈 보스와 연결된 추천 퀘스트</small>
              <strong>{questSummary.recommendedTitle}</strong>
            </span>
          </span>
          <span className="quest-ai-message">
            <span className="quest-ai-tag">AI</span>
            <span>
              <b>AI 코치 한 줄 추천</b>
              <p>{questSummary.coachMessage}</p>
            </span>
          </span>
        </button>
      </section>

      <section className="mate-card">
        <QuestNumberedHeading
          n={2}
          title="진행 중 퀘스트"
          action={
            <div className="quest-inprogress-actions">
              <span className="quest-count-pill">{questInProgress.length}개 진행 중</span>
              <button className="mate-card-link" type="button" onClick={() => navigate('/missions/add')}>모두 보기<Chevron /></button>
            </div>
          }
        />
        <div className="quest-progress-list">
          {questInProgress.map((item) => (
            <button className="quest-progress-row" type="button" key={item.id} onClick={() => navigate(`/missions/${item.id}`)}>
              <QuestIcon src={`${QUEST_ASSET_DIR}/quest-icon-${item.iconId}.png`} emoji={item.emoji} tone={item.tone} size={48} />
              <div className="quest-progress-body">
                <strong>{item.title}</strong>
                <QuestProgressBar value={(item.current / item.target) * 100} tone={item.barTone} />
                <div className="quest-progress-meta">
                  <span>{item.current.toLocaleString('ko-KR')} / {item.target.toLocaleString('ko-KR')}{item.unit}</span>
                </div>
                <span className="quest-progress-time">🕐 {item.timeLeft}</span>
              </div>
              <div className="quest-progress-reward">
                <strong style={{ color: item.rewardColor }}>{item.rewardEmoji} {item.rewardLabel} {item.rewardValue}</strong>
                <span>추가 효과</span>
                <em>{item.effectEmoji} {item.effectText}</em>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

/** 퀘스트 탭 · "완료" */
export function QuestCompletedPanel({ navigate }: { navigate: Navigate }) {
  return (
    <div className="mate-tab-stack">
      <section className="mate-card">
        <header className="mate-card-head">
          <div className="mate-card-head-title">
            <IconBadge icon="check" tone="teal" />
            <div>
              <h2>완료한 퀘스트</h2>
              <p>최근 완료한 퀘스트 {questCompleted.length}개예요</p>
            </div>
          </div>
        </header>
        <div className="quest-completed-list">
          {questCompleted.map((item) => (
            <button className="quest-completed-row" type="button" key={item.id} onClick={() => navigate(`/missions/${item.id}`)}>
              <QuestIcon src={`${QUEST_ASSET_DIR}/quest-icon-${item.iconId}.png`} emoji={item.emoji} tone={item.tone} size={44} />
              <span className="quest-completed-copy">
                <strong>{item.title}</strong>
                <small>{item.date} 완료 · {item.rewardLabel}</small>
              </span>
              <span className="quest-completed-badge">✓</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

/** 퀘스트 탭 · "포인트" */
export function QuestPointsPanel({ navigate }: { navigate: Navigate }) {
  return (
    <div className="mate-tab-stack">
      <section className="mate-card quest-points-hero">
        <span className="quest-points-hero-label">보유 포인트</span>
        <MatePointPill value={questPointSummary.balance} />
        <p>이번 달 <b>{questPointSummary.earnedThisMonth}P</b>를 새로 모았어요</p>
        <button className="app-button primary" type="button" onClick={() => navigate('/missions/add')}>포인트로 리포트 열람하기</button>
      </section>

      <section className="mate-card">
        <header className="mate-card-head">
          <div className="mate-card-head-title">
            <IconBadge icon="spark" tone="teal" />
            <h2>포인트 적립 내역</h2>
          </div>
        </header>
        <div className="quest-point-ledger">
          {questPointLedger.map((event) => (
            <div className="quest-point-row" key={event.id}>
              <span className="quest-point-copy">
                <strong>{event.title}</strong>
                <small>{event.date}</small>
              </span>
              <b className="quest-point-amount">+{event.amount}P</b>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
