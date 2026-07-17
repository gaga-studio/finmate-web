import { CheckCircle2, ChevronLeft, Clock3, Database, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Schema } from '../api/client'
import { QuestIcon, QUEST_ASSET_DIR } from '../design-v2/QuestShared'

const formatValue = (value: number, unit: Schema['Quest']['unit']) => {
  if (unit === 'KRW') return `${new Intl.NumberFormat('ko-KR').format(value)}원`
  if (unit === 'BASIS_POINTS') return `${value / 100}%`
  return `${value}회`
}

const statusLabel: Record<Schema['Quest']['status'], string> = {
  AVAILABLE: '참여 가능',
  ACTIVE: '진행 중',
  DATA_PENDING: '데이터 반영 대기',
  COMPLETED: '완료',
  EXPIRED: '기간 종료',
  CANCELLED: '취소',
}

export function QuestDetailView({
  quest,
  onAccept,
  onComplete,
  pending,
  message,
}: {
  quest: Schema['Quest']
  onAccept: () => void
  onComplete: () => void
  pending: boolean
  message?: string
}) {
  const available = quest.status === 'AVAILABLE'
  const active = quest.status === 'ACTIVE'
  const waiting = quest.status === 'DATA_PENDING'
  const completed = quest.status === 'COMPLETED'
  return (
    <section className="screen screen-compare compare-flow-screen quest-detail-screen">
      <header className="compare-flow-header"><Link className="mate-back-link" to="/quests"><ChevronLeft size={18}/>퀘스트 목록</Link><h1>퀘스트 상세</h1></header>
      <section className="compare-flow-body mate-tab-stack">
        <section className="mate-card quest-detail-hero"><QuestIcon src={`${QUEST_ASSET_DIR}/${quest.verificationKind === 'SYNTHETIC_MYDATA' ? 'quest-icon-heart.png' : 'quest-icon-xp.png'}`} size={72}/><span className="quest-count-pill">{statusLabel[quest.status]}</span><h1>{quest.title}</h1><p>{quest.verificationKind === 'SYNTHETIC_MYDATA' ? '합성 금융데이터로 행동 결과를 확인해요.' : '앱 안의 행동 완료로 확인해요.'}</p></section>
        <section className="mate-card"><div className="quest-numbered-heading"><div className="quest-numbered-heading-title"><span className="quest-number-badge">1</span><h2>현재 진행</h2></div><strong>{formatValue(quest.currentValue, quest.unit)} / {formatValue(quest.targetValue, quest.unit)}</strong></div><p className="mate-build-note">진행률은 서버 계산 결과가 제공될 때만 표시해요. · {quest.durationLabel}</p></section>
        <section className="mate-card"><div className="quest-detail-grid"><article><Target size={21}/><span>완료 조건</span><strong>{quest.verificationKind === 'SYNTHETIC_MYDATA' ? '데이터 동기화 확인' : '행동 완료 확인'}</strong></article><article><Clock3 size={21}/><span>기간</span><strong>{quest.durationLabel}</strong></article><article><Sparkles size={21}/><span>퀘스트 보상</span><strong>XP {quest.xpReward} · 꾸미기 {quest.pointReward}P</strong></article><article><ShieldCheck size={21}/><span>금융 스탯</span><strong>즉시 변경 없음</strong></article></div></section>
        {waiting ? <aside className="mate-banner" role="status"><Database size={21}/><p><strong>새 데이터 반영을 기다리고 있어요.</strong> 확인 전에는 레이드와 금융 스탯이 바뀌지 않아요.</p></aside> : null}
        {completed ? <aside className="mate-banner" role="status"><CheckCircle2 size={22}/><p><strong>완료한 퀘스트예요.</strong> XP와 기록은 반영됐고 금융 성장은 데이터 계산 결과와 분리돼요.</p></aside> : null}
        <p className="mate-build-note">퀘스트 완료는 금융상품 가입이나 투자 거래를 요구하지 않아요.</p>
      </section>
      {(available || active || waiting || completed || message) ? <div className="compare-flow-bottom-cta">
        {message ? <p className="mate-streak-note" role="status">{message}</p> : null}
        {available ? <button className="app-button primary" disabled={pending} onClick={onAccept}>퀘스트 수락</button> : null}
        {active ? <button className="app-button primary" disabled={pending} onClick={onComplete}>완료 확인</button> : null}
        {(waiting || completed) ? <Link className="app-button secondary" to={waiting ? '/record' : '/quests'}>{waiting ? '기록에서 반영 상태 보기' : '다른 퀘스트 보기'}</Link> : null}
      </div> : null}
    </section>
  )
}
