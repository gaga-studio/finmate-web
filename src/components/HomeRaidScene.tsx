import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { Schema } from '../api/client'
import { AppIcon } from '../design-v2/primitives'
import { HOME_ASSET_DIR, HomeCharacterImg, HomeHPBar } from '../design-v2/HomeShared'
import { MateAvatar } from '../design-v2/MateShared'
import type { CharacterAssetStem, HomeBattleViewModel } from '../design-v2/viewModels'
import {
  ORBIT_CONFIGS,
  buildAllSchedules,
  enforceBossClearance,
  mulberry32,
  resolveOverlaps,
  sampleSchedule,
  updateDirection,
  type Direction,
  type SampleResult,
  type Segment,
  type StageMetrics,
} from '../design-v2/homeBattleOrbit'

type HomeSpecies = CharacterAssetStem

type FloatNumber = { id: string; kind: 'dmg' | 'heal'; value: string; left: number; top: number }
type HitSpark = { id: string; left: number; top: number }

// 2분 분량을 미리 계산해 두고 계속 재생한다 — 10초가 지나도 끊기거나
// 텔레포트하지 않고, 같은(재현 가능한) 패턴으로 자연스럽게 이어진다.
const SCHEDULE_HORIZON_MS = 120_000

function damageForImpact(seed: number): number {
  const rng = mulberry32(seed)
  return Math.floor(rng() * 3800) + 1200
}

type HomeBattleSceneProps = {
  view: HomeBattleViewModel
  quests?: Schema['Quest'][]
  displayName: string
  onOpenQuest: () => void
  onOpenReport: (type: Schema['CharacterReportType']) => void
  onOpenSettings: () => void
}

/** frontend-v2의 전투 DOM과 모션을 유지하고, 표시값만 vNext API view model에서 받는다. */
export function HomeRaidScene({
  view,
  quests = [],
  displayName,
  onOpenQuest,
  onOpenReport,
  onOpenSettings,
}: HomeBattleSceneProps) {
  const [autoBattle, setAutoBattle] = useState(true)
  const [autoCollect, setAutoCollect] = useState(true)
  const [bossHit, setBossHit] = useState(false)
  const [bossDrift, setBossDrift] = useState<'left' | 'right' | 'up'>('left')
  const [floatNumbers, setFloatNumbers] = useState<FloatNumber[]>([])
  const [hitSparks, setHitSparks] = useState<HitSpark[]>([])
  const [brokenSprites, setBrokenSprites] = useState<Partial<Record<HomeSpecies, boolean>>>({})

  // DOM 요소는 ref로만 다룬다 — 위치/방향/z-index를 매 프레임 갱신해도 컴포넌트가 재렌더되지 않는다.
  const stageRef = useRef<HTMLDivElement | null>(null)
  const bossRef = useRef<HTMLButtonElement | null>(null)
  const wrapperRefs = useRef<Partial<Record<HomeSpecies, HTMLButtonElement>>>({})
  const spriteRefs = useRef<Partial<Record<HomeSpecies, HTMLImageElement>>>({})

  const schedulesRef = useRef<Record<HomeSpecies, Segment[]> | null>(null)
  const metricsRef = useRef<StageMetrics | null>(null)
  const directionRef = useRef<Partial<Record<HomeSpecies, Direction>>>({})
  const segmentIndexRef = useRef<Partial<Record<HomeSpecies, number>>>({})
  const startTimeRef = useRef<number | null>(null)
  const bossHitTokenRef = useRef(0)

  const spawnFloatNumber = useCallback((kind: FloatNumber['kind'], value: string, left: number, top: number) => {
    const id = `${Date.now()}-${Math.random()}`
    setFloatNumbers((list) => [...list, { id, kind, value, left, top }])
    window.setTimeout(() => {
      setFloatNumbers((list) => list.filter((entry) => entry.id !== id))
    }, 1300)
  }, [])

  const spawnHitSpark = useCallback((left: number, top: number) => {
    const id = `${Date.now()}-${Math.random()}`
    setHitSparks((list) => [...list, { id, left, top }])
    window.setTimeout(() => {
      setHitSparks((list) => list.filter((entry) => entry.id !== id))
    }, 450)
  }, [])

  // 무대 크기를 측정해 궤도 스케줄을 만들고, 매 프레임 위치를 DOM에 직접 반영한다.
  // 화면 크기가 바뀌면(리사이즈/회전) ResizeObserver가 다시 측정해 좌표계를 새로 잡는다.
  useLayoutEffect(() => {
    if (!autoBattle) return undefined
    const stageEl = stageRef.current
    const bossEl = bossRef.current
    if (!stageEl || !bossEl) return undefined

    const rebuild = () => {
      const stageRect = stageEl.getBoundingClientRect()
      const bossRect = bossEl.getBoundingClientRect()
      if (stageRect.width === 0 || stageRect.height === 0 || bossRect.width === 0) return
      const metrics: StageMetrics = {
        stageW: stageRect.width,
        stageH: stageRect.height,
        bossCenter: {
          x: bossRect.left - stageRect.left + bossRect.width / 2,
          y: bossRect.top - stageRect.top + bossRect.height / 2,
        },
        bossHalfWidth: bossRect.width / 2,
        bossHitRadius: (bossRect.width / 2) * 0.58,
      }
      metricsRef.current = metrics
      schedulesRef.current = buildAllSchedules(metrics, SCHEDULE_HORIZON_MS)
      // 보스도 같은 좌표계(y값) 기준으로 깊이를 잡아야 캐릭터와의 앞/뒤 비교가 정확하다.
      bossEl.style.zIndex = String(Math.round(metrics.bossCenter.y))
      // 좌표계가 바뀌었으니 타임라인/세그먼트 커서를 리셋해 순간이동처럼 보이지 않게 한다.
      startTimeRef.current = null
      segmentIndexRef.current = {}
    }

    rebuild()

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => rebuild())
    resizeObserver?.observe(stageEl)

    let rafId = 0
    const step = (now: number) => {
      if (startTimeRef.current === null) startTimeRef.current = now
      const elapsed = now - startTimeRef.current
      const schedules = schedulesRef.current
      const metrics = metricsRef.current

      if (schedules && metrics) {
        const samples: Partial<Record<HomeSpecies, SampleResult>> = {}

        for (const config of ORBIT_CONFIGS) {
          const id = config.id
          const schedule = schedules[id]
          if (!schedule) continue

          const prevIdx = segmentIndexRef.current[id] ?? -1
          const sample = sampleSchedule(schedule, elapsed, metrics.bossCenter, metrics.bossHitRadius, prevIdx)
          segmentIndexRef.current[id] = sample.segmentIndex
          samples[id] = sample
        }

        // 스케줄이 각도로 서로를 피해도, 우연히 궤적이 스치는 순간까지는 못 막으므로
        // 같은 프레임에 계산된 4명의 좌표를 한 번 더 비교해 너무 가까우면 밀어낸다.
        const rawPositions: Partial<Record<HomeSpecies, { x: number; y: number }>> = {}
        for (const id of Object.keys(samples) as HomeSpecies[]) {
          const sample = samples[id]
          if (sample) rawPositions[id] = sample.position
        }
        const resolvedPositions = resolveOverlaps(rawPositions, 34)

        for (const config of ORBIT_CONFIGS) {
          const id = config.id
          const sample = samples[id]
          const wrapperEl = wrapperRefs.current[id]
          const resolved = resolvedPositions[id]
          if (!sample || !wrapperEl || !resolved) continue

          // 캐릭터 간 밀어내기로 다시 보스 반지름 안쪽에 들어갔을 수 있으니 한 번 더 바깥으로 고정한다.
          const position = enforceBossClearance(resolved, metrics.bossCenter, metrics.bossHitRadius)

          // 바깥 wrapper: 위치 이동 전용 transform (translate3d만 사용)
          wrapperEl.style.transform = `translate3d(calc(${position.x}px - 50%), calc(${position.y}px - 50%), 0)`
          // 보스보다 위에 있으면 뒤로, 아래에 있으면 앞으로 — y좌표 기준 깊이 정렬
          wrapperEl.style.zIndex = String(Math.round(position.y))

          // 안쪽 sprite: 좌우 반전은 여기서 "이미지 교체"로만 처리 (wrapper의 위치 transform과 절대 섞지 않는다)
          const prevDirection = directionRef.current[id] ?? 'right'
          const nextDirection = updateDirection(position.x, metrics.bossCenter.x, prevDirection)
          if (nextDirection !== prevDirection) {
            directionRef.current[id] = nextDirection
            const spriteEl = spriteRefs.current[id]
            if (spriteEl) spriteEl.src = `${HOME_ASSET_DIR}/home-char-${id}-atk-${nextDirection}.png`
          }

          if (sample.isImpactStart) {
            const leftPct = (position.x / metrics.stageW) * 100
            const topPct = (position.y / metrics.stageH) * 100
            const damage = damageForImpact(config.seed + sample.segmentIndex * 97)
            spawnFloatNumber('dmg', `-${damage.toLocaleString('ko-KR')}`, leftPct, topPct)
            spawnHitSpark(leftPct, topPct)

            // 보스는 화면에 고정 — 피격 시에만 아주 짧게 흔들린다. 겹치는 타격끼리
            // 서로 애니메이션을 끊어먹지 않도록 토큰으로 "가장 마지막 타격만" 흔들림을 종료시킨다.
            const token = ++bossHitTokenRef.current
            setBossDrift(token % 3 === 0 ? 'up' : token % 2 === 0 ? 'right' : 'left')
            setBossHit(true)
            window.setTimeout(() => {
              if (bossHitTokenRef.current === token) setBossHit(false)
            }, 300)
          }
        }
      }

      rafId = window.requestAnimationFrame(step)
    }

    rafId = window.requestAnimationFrame(step)

    return () => {
      resizeObserver?.disconnect()
      window.cancelAnimationFrame(rafId)
    }
  }, [autoBattle, spawnFloatNumber, spawnHitSpark])

  const completedQuests = quests.filter((quest) => quest.status === 'COMPLETED')
  const questIcons = quests.slice(0, 3)
  const animalName: Record<HomeBattleViewModel['party'][number]['animal'], string> = {
    BEAR: '곰',
    SEAL: '물개',
    RABBIT: '토끼',
    BIRD: '새',
  }

  return (
    <div className="screen screen-home screen-home-battle">
      <div className="home-status roadmap-status" aria-hidden="true">
        <strong>9:41</strong>
        <span><i /><i /><i /></span>
      </div>
      <header className="home-identity-bar">
        <img className="home-brand-logo" src="/FinMate_Logo.png" alt="FinMate" draggable={false} />
        <div className="home-identity-currency" aria-label="내부 성장 자원">
          <span className="home-currency-pill coin"><b>XP {view.questXp.toLocaleString('ko-KR')}</b></span>
          <span className="home-currency-pill gem"><b>P {view.pointBalance.toLocaleString('ko-KR')}</b></span>
        </div>
        <button className="home-menu-button" type="button" aria-label="공개 범위와 설정" onClick={onOpenSettings}>
          <AppIcon name="settings" />
        </button>
        <div className="home-profile-strip">
          <button className="home-identity-avatar" type="button" onClick={onOpenSettings} aria-label="공개 범위와 설정 열기">
            <HomeCharacterImg src={`${HOME_ASSET_DIR}/home-avatar-me.png`} emoji="🐰" />
          </button>
          <div className="home-identity-meta">
            <strong>{displayName}</strong>
            <span>{view.goalTitle ?? '탐색 중'}</span>
            <HomeHPBar percent={view.goalProgressPercent} tone="blue" />
          </div>
        </div>
      </header>

      <section className="home-battle-scene" aria-labelledby="home-raid-title">
        <div className="home-scene-toggles">
          <button className={autoBattle ? 'is-active' : ''} type="button" onClick={() => setAutoBattle((value) => !value)}>AUTO</button>
          <button className={autoCollect ? 'is-active' : ''} type="button" onClick={() => setAutoCollect((value) => !value)}>연출</button>
        </div>

        <button className="home-quest-scroll" type="button" onClick={onOpenQuest}>
          <span className="home-quest-scroll-icon" aria-hidden="true">📜</span>
          <span className="home-quest-scroll-copy">
            <b>{view.nextQuest ? '추천 퀘스트' : '퀘스트 준비 중'}</b>
            <span>{view.nextQuest?.title ?? '새 금융데이터를 확인하고 있어요'}</span>
            <em>{view.nextQuest ? `${view.nextQuest.currentValue}/${view.nextQuest.targetValue}` : '대기'}</em>
          </span>
        </button>

        <div className="home-stage-head">
          <span className="home-stage-badge">◈ STAGE {view.stage ?? '-'} ◈</span>
          <h1 className="home-boss-name" id="home-raid-title">{view.goalTitle ? `${view.goalTitle.includes('자금') ? view.goalTitle : `${view.goalTitle} 자금`} 레이드` : '목표 레이드'}</h1>
          <div className="home-boss-hp-row">
            <HomeHPBar percent={view.bossHpPercent} tone="red" />
            <span>{view.bossHpPercent}%</span>
          </div>
        </div>

        <div className="home-scene-stage" ref={stageRef}>
          <button
            className={`home-boss${bossHit ? ` is-hit drift-${bossDrift}` : ''}`}
            type="button"
            onClick={onOpenQuest}
            aria-label={`${view.bossName} 퀘스트 보기`}
            ref={bossRef}
          >
            <HomeCharacterImg src={`${HOME_ASSET_DIR}/home-boss.png`} emoji="🧳" className="home-boss-img" />
            <span className="home-boss-plate">{view.bossName}</span>
          </button>

          {floatNumbers.map((entry) => (
            <span className={`home-float-number ${entry.kind}`} style={{ left: `${entry.left}%`, top: `${entry.top}%` }} key={entry.id}>{entry.value}</span>
          ))}
          {hitSparks.map((entry) => (
            <span className="home-hit-spark" style={{ left: `${entry.left}%`, top: `${entry.top}%` }} key={entry.id} aria-hidden="true" />
          ))}

          {view.party.map((member) => (
            <button
              className="home-party-slot"
              type="button"
              onClick={() => onOpenReport(member.reportType)}
              aria-label={`${animalName[member.animal]} ${member.shortLabel} 리포트 보기`}
              key={member.animal}
              ref={(el) => { if (el) wrapperRefs.current[member.assetStem] = el }}
            >
              <HomeHPBar percent={member.scorePercent} tone={member.tone === 'blue' ? 'blue' : 'green'} />
              {brokenSprites[member.assetStem] ? (
                <span className="home-char-fallback home-party-img" aria-hidden="true">{member.emoji}</span>
              ) : (
                <img
                  className="home-party-img"
                  alt=""
                  draggable={false}
                  ref={(el) => {
                    if (!el) return
                    spriteRefs.current[member.assetStem] = el
                    if (!el.src) {
                      directionRef.current[member.assetStem] = 'right'
                      el.src = `${HOME_ASSET_DIR}/home-char-${member.assetStem}-atk-right.png`
                    }
                  }}
                  onError={() => setBrokenSprites((prev) => ({ ...prev, [member.assetStem]: true }))}
                />
              )}
            </button>
          ))}
        </div>

        {view.goalTitle && view.goalCurrentAmountKrw !== null && view.goalTargetAmountKrw !== null ? (
          <section className="home-goal-progress" aria-label="목표 진행 현황">
            <div className="home-goal-progress-head">
              <strong>{view.goalTitle}</strong>
              <b>달성률 {view.goalProgressPercent}%</b>
            </div>
            <div className="home-goal-progress-body">
              <HomeHPBar percent={view.goalProgressPercent} tone="green" />
              <span>현재 {view.goalCurrentAmountKrw.toLocaleString('ko-KR')}원 · 목표까지 {Math.max(0, view.goalTargetAmountKrw - view.goalCurrentAmountKrw).toLocaleString('ko-KR')}원</span>
            </div>
          </section>
        ) : null}

        <div className="home-action-row">
          {view.party.map((member) => (
            <div className="home-action-slot" key={member.animal}>
              <button
                className={`home-stat-card tone-${member.tone}`}
                type="button"
                onClick={() => onOpenReport(member.reportType)}
                aria-label={`${animalName[member.animal]} ${member.shortLabel} 리포트 보기`}
              >
                <span className="home-stat-card-top">
                  <HomeCharacterImg src={`${HOME_ASSET_DIR}/home-char-${member.assetStem}.png`} emoji={member.emoji} className="home-action-portrait" />
                  <span className={`home-skill-button tone-${member.tone}`} aria-hidden="true">{member.skillEmoji}</span>
                </span>
                <span className="home-stat-copy">
                  <b>{member.characterName}</b>
                  <em>{member.label}</em>
                  <small>{member.scoreDisplay}</small>
                </span>
                <HomeHPBar percent={member.scorePercent} tone={member.tone === 'blue' ? 'blue' : 'green'} />
              </button>
            </div>
          ))}
          <div className="home-chest-slot">
            <img className="home-chest-icon" src="/assets/rpg-icons/rpg-icon-chest.png" alt="" draggable={false} />
            <span className="home-chest-timer">꾸미기 {view.rewardProgressPercent}%</span>
            <button className="home-chest-claim" type="button" onClick={onOpenSettings}>보기</button>
          </div>
        </div>
      </section>

      <section className="mate-tab-stack home-below-stack">
        <div className="home-below-grid">
          <section className="mate-card home-today-card">
            <div className="home-today-head">
              <strong>오늘 완료한 퀘스트</strong>
              <span>{completedQuests.length}/{quests.length}개</span>
            </div>
            <div className="home-today-icons">
              {questIcons.map((quest) => (
                <span className="home-today-icon" key={quest.questId}>
                  <img src={quest.title.includes('투자') ? '/assets/quest/quest-icon-invest.png' : quest.title.includes('퀴즈') ? '/assets/quest/quest-icon-knowledge.png' : '/assets/quest/quest-icon-saving.png'} alt="" draggable={false} />
                  {quest.status === 'COMPLETED' ? <i className="home-today-check" aria-hidden="true">✓</i> : null}
                </span>
              ))}
            </div>
            <button className="home-today-note" type="button" onClick={onOpenQuest}>
              <img src="/assets/rpg-icons/rpg-icon-xp.png" alt="" draggable={false} />
              <span>XP와 금융 성장은 따로 반영돼요</span>
            </button>
          </section>

          <section className="mate-card home-streak-card">
            <div className="home-streak-copy">
              <span>{view.dataState === 'FRESH' ? '반영 완료' : '데이터 대기'}</span>
              <small>{view.activeRoutineLabel ? `현재 루틴: ${view.activeRoutineLabel}` : '적용 중인 루틴 없음'}</small>
            </div>
            <HomeCharacterImg src={`${HOME_ASSET_DIR}/home-char-streak.png`} emoji="👑" className="home-streak-img" />
          </section>
        </div>

        <section className="mate-coach-card">
          <MateAvatar species="coach" size={86} fit="contain" className="mate-coach-avatar"/>
          <div className="mate-coach-copy">
            <span className="mate-coach-name">AI 코치</span>
            <p>{view.raidStatus === 'WAITING_FOR_DATA' ? '행동은 기록됐어요. 새 금융데이터가 확인되면 레이드가 갱신돼요.' : '퀘스트는 XP를, 확인된 금융데이터는 레이드 진행을 바꿔요.'}</p>
          </div>
        </section>
      </section>
    </div>
  )
}
