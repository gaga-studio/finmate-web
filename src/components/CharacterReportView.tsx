import type { Schema } from '../api/client'
import { AppIcon, IconBadge } from '../design-v2/primitives'
import { HOME_ASSET_DIR, HomeCharacterImg, HomeHPBar } from '../design-v2/HomeShared'
import { toCharacterReportView } from '../design-v2/viewModels'

const characterName: Record<Schema['CharacterReportType'], string> = {
  SPENDING_DEFENSE: '든든곰',
  SAVING_HP: '모아씰',
  INVESTMENT_JUDGMENT: '살펴토끼',
  QUEST_XP: '해냄새',
}

const skillIcon: Record<Schema['CharacterReportType'], 'spend' | 'saving' | 'stocks' | 'check-square'> = {
  SPENDING_DEFENSE: 'spend',
  SAVING_HP: 'saving',
  INVESTMENT_JUDGMENT: 'stocks',
  QUEST_XP: 'check-square',
}

export function CharacterReportView({ report, onBack, onHome, onQuest }: { report: Schema['CharacterReport']; onBack: () => void; onHome: () => void; onQuest: (questId: string) => void }) {
  const view = toCharacterReportView(report)
  return <div className={`screen screen-home-report tone-${view.tone}`}>
    <div className="home-report-status roadmap-status" aria-hidden="true"><strong>9:41</strong><span><i/><i/><i/></span></div>
    <header className="home-report-topbar"><button type="button" onClick={onBack} aria-label="뒤로"><AppIcon name="back"/></button><strong>금융 리포트</strong><button type="button" onClick={onHome} aria-label="홈으로"><AppIcon name="home"/></button></header>
    <section className="home-report-arena" aria-labelledby="home-report-title"><div className="home-report-arc" aria-hidden="true"/><div className="home-report-gridmark" aria-hidden="true"/><div className="home-report-character-wrap"><HomeCharacterImg src={`${HOME_ASSET_DIR}/home-char-${view.assetStem}.png`} emoji="●" className="home-report-character" alt=""/></div></section>
    <section className="home-report-sheet" aria-label={`${characterName[report.reportType]} 캐릭터 능력치`}>
      <div className="home-report-nameplate"><span>{view.title}</span><h1 id="home-report-title">{characterName[report.reportType]}</h1><p>{view.meaning}</p><div className="home-report-hp"><HomeHPBar percent={view.scorePercent} tone={view.tone === 'blue' ? 'blue' : 'green'}/><strong>{view.scoreDisplay}</strong></div></div>
      <div className="home-report-primary-stat"><div><span>{view.title}</span><strong>{view.scoreDisplay}</strong><p>최근 동기화된 금융데이터와 행동 기록을 기준으로 표시해요.</p></div><div className="home-report-medal" aria-hidden="true"><AppIcon name={skillIcon[report.reportType]}/></div></div>
      <div className="home-report-stat-grid">{view.metrics.map((metric) => <div className="home-report-stat" key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>검증된 데이터 기준</small><div className="home-report-stat-bars" data-tone={view.tone} aria-hidden="true"><i className="is-filled"/><i className={view.scorePercent >= 66 ? 'is-filled' : ''}/><i className={view.scorePercent >= 99 ? 'is-filled' : ''}/></div></div>)}</div>
      <section className="home-report-ai-card"><div className="home-report-section-head"><IconBadge icon="spark" tone="teal"/><div><span>코치 설명</span><strong>다음 행동을 확인해보세요</strong></div></div><p>금융 수치는 API가 계산하고, 코치는 계산 결과의 의미만 설명해요.</p><div className="home-report-action-row"><span>추천 퀘스트</span><button type="button" onClick={() => onQuest(view.nextQuestId)}>퀘스트 보기</button></div></section>
      <section className="home-report-history"><div className="home-report-section-head"><IconBadge icon="calendar" tone="teal"/><div><span>점수 근거</span><strong>30일 변화 기록</strong></div></div><div className="home-report-history-list">{view.trend.map((point) => <button type="button" key={point.date}><IconBadge icon="chart" tone="teal"/><span><strong>{point.date}</strong><small>동기화 스냅샷</small></span><em>{point.displayValue}</em></button>)}</div></section>
    </section>
  </div>
}
