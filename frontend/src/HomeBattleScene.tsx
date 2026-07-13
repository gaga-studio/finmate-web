import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { Navigate } from './navigation'
import { MateCoachCard } from './MateShared'
import {
  HOME_ASSET_DIR,
  HomeCharacterImg,
  HomeHPBar,
  formatCountdown,
  homeBoss,
  homeCoachMessage,
  homeParty,
  homePlayer,
  homeQuestBanner,
  homeRewardChestSeconds,
  homeStreak,
  homeTodayQuestCompleted,
  homeTodayQuestTotal,
  homeTodayQuests,
  type HomeSpecies,
} from './HomeShared'
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
} from './homeBattleOrbit'
import './home.css'

type FloatNumber = { id: string; kind: 'dmg' | 'heal'; value: string; left: number; top: number }
type HitSpark = { id: string; left: number; top: number }

// 2분 분량을 미리 계산해 두고 계속 재생한다 — 10초가 지나도 끊기거나
// 텔레포트하지 않고, 같은(재현 가능한) 패턴으로 자연스럽게 이어진다.
const SCHEDULE_HORIZON_MS = 120_000

function damageForImpact(seed: number): number {
  const rng = mulberry32(seed)
  return Math.floor(rng() * 3800) + 1200
}

/** 홈 탭 · RPG 보스 전투 메인 화면 — ref+requestAnimationFrame으로 캐릭터가 보스 주위를 곡선으로 도는 2.5D 연출. */
export function HomeBattleScene({ navigate }: { navigate: Navigate }) {
  const [autoBattle, setAutoBattle] = useState(true)
  const [autoCollect, setAutoCollect] = useState(true)
  const [bossHit, setBossHit] = useState(false)
  const [bossDrift, setBossDrift] = useState<'left' | 'right' | 'up'>('left')
  const [floatNumbers, setFloatNumbers] = useState<FloatNumber[]>([])
  const [hitSparks, setHitSparks] = useState<HitSpark[]>([])
  const [brokenSprites, setBrokenSprites] = useState<Partial<Record<HomeSpecies, boolean>>>({})
  const [secondsLeft, setSecondsLeft] = useState(homeRewardChestSeconds)

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

  // 보상 상자 카운트다운 (데모 루프: 0에 닿으면 다시 채움)
  useLayoutEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((value) => (value <= 0 ? homeRewardChestSeconds : value - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

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

    const resizeObserver = new ResizeObserver(() => rebuild())
    resizeObserver.observe(stageEl)

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
      resizeObserver.disconnect()
      window.cancelAnimationFrame(rafId)
    }
  }, [autoBattle, spawnFloatNumber, spawnHitSpark])

  return (
    <div className="screen screen-home screen-home-battle">
      <div className="home-status roadmap-status" aria-hidden="true">
        <strong>9:41</strong>
        <span><i /><i /><i /></span>
      </div>
      <header className="home-identity-bar">
        <img className="home-brand-logo" src="/FinMate_Logo.png" alt="FinMate" draggable={false} />
        <div className="home-identity-currency">
          <span className="home-currency-pill coin">🪙<b>{homePlayer.coins.toLocaleString('ko-KR')}</b>
            <button type="button" aria-label="코인 충전" onClick={() => navigate('/missions')}>+</button>
          </span>
          <span className="home-currency-pill gem">💎<b>{homePlayer.gems.toLocaleString('ko-KR')}</b>
            <button type="button" aria-label="보석 충전" onClick={() => navigate('/missions')}>+</button>
          </span>
        </div>
        <button className="home-menu-button" type="button" aria-label="메뉴" onClick={() => navigate('/settings/privacy')}>☰</button>
        <div className="home-profile-strip">
          <button className="home-identity-avatar" type="button" onClick={() => navigate('/profile')} aria-label="내 프로필">
            <HomeCharacterImg src={`${HOME_ASSET_DIR}/home-avatar-me.png`} emoji="🐰" />
          </button>
          <div className="home-identity-meta">
            <strong>{homePlayer.name}</strong>
            <span>Lv. {homePlayer.level}</span>
            <HomeHPBar percent={homePlayer.xpPercent} tone="blue" />
          </div>
        </div>
      </header>

      <section className="home-battle-scene">
        <div className="home-scene-toggles">
          <button className={autoBattle ? 'is-active' : ''} type="button" onClick={() => setAutoBattle((value) => !value)}>AUTO</button>
          <button className={autoCollect ? 'is-active' : ''} type="button" onClick={() => setAutoCollect((value) => !value)}>자동</button>
        </div>

        <button className="home-quest-scroll" type="button" onClick={() => navigate('/missions')}>
          <span className="home-quest-scroll-icon" aria-hidden="true">📜</span>
          <span className="home-quest-scroll-copy">
            <b>{homeQuestBanner.title}</b>
            <span>{homeQuestBanner.desc}</span>
            <em>{homeQuestBanner.current}/{homeQuestBanner.target}</em>
          </span>
        </button>

        <div className="home-stage-head">
          <span className="home-stage-badge">◈ {homeBoss.stage} ◈</span>
          <strong className="home-boss-name">{homeBoss.name}</strong>
          <div className="home-boss-hp-row">
            <HomeHPBar percent={homeBoss.hpPercent} tone="red" />
            <span>{homeBoss.hpPercent}%</span>
          </div>
        </div>

        <div className="home-scene-stage" ref={stageRef}>
          <button
            className={`home-boss${bossHit ? ` is-hit drift-${bossDrift}` : ''}`}
            type="button"
            onClick={() => navigate('/missions')}
            aria-label={`${homeBoss.name} 보스 상세 보기`}
            ref={bossRef}
          >
            <HomeCharacterImg src={`${HOME_ASSET_DIR}/home-boss.png`} emoji="🪵" className="home-boss-img" />
            <span className="home-boss-plate">{homeBoss.name}</span>
          </button>

          {floatNumbers.map((entry) => (
            <span className={`home-float-number ${entry.kind}`} style={{ left: `${entry.left}%`, top: `${entry.top}%` }} key={entry.id}>
              {entry.value}
            </span>
          ))}

          {hitSparks.map((entry) => (
            <span className="home-hit-spark" style={{ left: `${entry.left}%`, top: `${entry.top}%` }} key={entry.id} aria-hidden="true" />
          ))}

          {homeParty.map((member) => (
            <button
              className="home-party-slot"
              type="button"
              onClick={() => navigate(member.detailPath)}
              aria-label={`${member.label} 캐릭터 상세 보기`}
              key={member.id}
              ref={(el) => {
                if (el) wrapperRefs.current[member.id] = el
              }}
            >
              <HomeHPBar percent={member.hpPercent} tone="green" />
              {brokenSprites[member.id] ? (
                <span className="home-char-fallback home-party-img" aria-hidden="true">{member.emoji}</span>
              ) : (
                <img
                  className="home-party-img"
                  alt=""
                  draggable={false}
                  ref={(el) => {
                    if (!el) return
                    spriteRefs.current[member.id] = el
                    if (!el.src) {
                      // 초기 방향은 오른쪽으로 시작 — 첫 rAF 프레임에서 곧바로 실제 위치 기준으로 보정된다.
                      directionRef.current[member.id] = 'right'
                      el.src = `${HOME_ASSET_DIR}/home-char-${member.id}-atk-right.png`
                    }
                  }}
                  onError={() => setBrokenSprites((prev) => ({ ...prev, [member.id]: true }))}
                />
              )}
            </button>
          ))}
        </div>

        <div className="home-action-row">
          {homeParty.map((member) => (
          <div className="home-action-slot" key={member.id}>
              <button
                className={`home-stat-card tone-${member.tone}`}
                type="button"
                onClick={() => navigate(member.detailPath)}
                aria-label={`${member.reportTitle} 보기`}
              >
                <span className="home-stat-card-top">
                  <HomeCharacterImg src={`${HOME_ASSET_DIR}/home-char-${member.id}.png`} emoji={member.emoji} className="home-action-portrait" />
                  <span className={`home-skill-button tone-${member.tone}`} aria-hidden="true">{member.skillEmoji}</span>
                </span>
                <span className="home-stat-copy">
                  <b>{member.name}</b>
                  <em>{member.label}</em>
                  <small>{member.meaning}</small>
                </span>
                <HomeHPBar percent={member.hpPercent} tone={member.id === 'invest' ? 'blue' : 'green'} />
              </button>
            </div>
          ))}
          <div className="home-chest-slot">
            <span className="home-chest-icon" aria-hidden="true">🎁</span>
            <span className="home-chest-timer">{formatCountdown(secondsLeft)}</span>
            <button className="home-chest-claim" type="button" onClick={() => navigate('/missions')}>받기</button>
          </div>
        </div>
      </section>

      <section className="mate-tab-stack home-below-stack">
        <div className="home-below-grid">
          <section className="mate-card home-today-card">
            <div className="home-today-head">
              <strong>오늘 완료한 퀘스트</strong>
              <span>{homeTodayQuestCompleted}/{homeTodayQuestTotal}개</span>
            </div>
            <div className="home-today-icons">
              {homeTodayQuests.map((quest) => (
                <span className="home-today-icon" key={quest.id}>
                  <img src={quest.icon} alt="" draggable={false} onError={(event) => { event.currentTarget.replaceWith(document.createTextNode(quest.emoji)) }} />
                  {quest.done ? <i className="home-today-check" aria-hidden="true">✓</i> : null}
                </span>
              ))}
            </div>
            <button className="home-today-note" type="button" onClick={() => navigate('/missions')}>
              <img src="/assets/rpg-icons/rpg-icon-chest.png" alt="" draggable={false} />
              <span>모두 완료하고 보상 받으세요!</span>
            </button>
          </section>

          <section className="mate-card home-streak-card">
            <div className="home-streak-copy">
              <span>🔥 {homeStreak.days}일</span>
              <small>최고 기록 {homeStreak.best}일</small>
            </div>
            <HomeCharacterImg src={`${HOME_ASSET_DIR}/home-char-streak.png`} emoji="👑" className="home-streak-img" />
          </section>
        </div>

        <MateCoachCard message={homeCoachMessage} />
      </section>
    </div>
  )
}
