import { useCallback, useEffect, useRef, useState } from 'react'
import type { Schema } from '../api/client'
import { AppIcon } from '../design-v2/primitives'
import { HOME_ASSET_DIR, HomeCharacterImg, HomeHPBar } from '../design-v2/HomeShared'
import { MateAvatar } from '../design-v2/MateShared'
import type { CharacterAssetStem, HomeBattleViewModel } from '../design-v2/viewModels'

type HomeSpecies = CharacterAssetStem
type PartySpriteState = 'idle' | 'attack' | 'victory'
type BossSpriteState = 'idle' | 'hit' | 'defeated'

type FloatNumber = { id: string; kind: 'dmg' | 'heal'; value: string; left: number; top: number }
type HitSpark = { id: string; left: number; top: number }

const TURN_ASSET_DIR = `${HOME_ASSET_DIR}/turn`

// 턴제 연출 타이밍 — 한 캐릭터가 돌진→타격→귀환을 마치면 다음 캐릭터의 턴이 온다.
const ATTACK_INTERVAL_MS = 1700
const ATTACK_IMPACT_MS = 320
const ATTACK_TOTAL_MS = 700
const SHORT_LIVED_TURN_SPRITES = [
  `${TURN_ASSET_DIR}/invest-attack-right.png`,
  `${TURN_ASSET_DIR}/save-attack-right.png`,
  `${TURN_ASSET_DIR}/consume-attack-right.png`,
  `${TURN_ASSET_DIR}/mission-attack-right.png`,
  `${TURN_ASSET_DIR}/boss-hit-left.png`,
]

function firstWorkingSprite(candidates: string[], brokenPaths: Record<string, true>): string | null {
  return candidates.find((path) => !brokenPaths[path]) ?? null
}

function partySpriteCandidates(stem: HomeSpecies, state: PartySpriteState): string[] {
  const idle = `${TURN_ASSET_DIR}/${stem}-idle-right.png`
  const legacyIdle = `${HOME_ASSET_DIR}/home-char-${stem}.png`

  if (state === 'victory') return [`${TURN_ASSET_DIR}/${stem}-victory.png`, idle, legacyIdle]
  if (state === 'attack') {
    return [
      `${TURN_ASSET_DIR}/${stem}-attack-right.png`,
      `${HOME_ASSET_DIR}/home-char-${stem}-atk-right.png`,
      idle,
      legacyIdle,
    ]
  }
  return [idle, legacyIdle]
}

function bossSpriteCandidates(state: BossSpriteState): string[] {
  const turnSprite = state === 'defeated'
    ? `${TURN_ASSET_DIR}/boss-defeated.png`
    : `${TURN_ASSET_DIR}/boss-${state}-left.png`
  return [turnSprite, `${HOME_ASSET_DIR}/home-boss.png`]
}

// 재현 가능한 데미지 패턴을 위한 시드 난수 — 시연을 여러 번 반복해도 같은 흐름으로 보인다.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

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

/** 모바일 턴제 RPG 진형(파티 좌측 2열, 보스 우측) 위에 vNext API view model의 표시값을 올린다. */
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
  const [brokenSpritePaths, setBrokenSpritePaths] = useState<Record<string, true>>({})
  const [attacking, setAttacking] = useState<HomeSpecies | null>(null)

  const bossHitTokenRef = useRef(0)
  const turnRef = useRef(0)
  const partyRef = useRef(view.party)
  const spritePreloadsRef = useRef<HTMLImageElement[]>([])
  partyRef.current = view.party

  useEffect(() => {
    spritePreloadsRef.current = SHORT_LIVED_TURN_SPRITES.map((src) => {
      const image = new Image()
      image.src = src
      return image
    })
    return () => {
      spritePreloadsRef.current = []
    }
  }, [])

  // 목표 달성(진행률 100%)이면 레이드를 클리어 상태로 그린다. 턴 루프는 멈추고 보스는 격파된다.
  const isCleared = view.goalProgressPercent >= 100

  // 클리어 1회 연출: 보스가 서 있다가 쓰러지고(standing → falling), 격파 아트와 배너가 나타난다(done).
  // 목표별로 세션에 한 번만 재생한다.
  const [celebratePhase, setCelebratePhase] = useState<'standing' | 'falling' | 'done'>('done')
  const goalKey = view.goalTitle ?? 'goal'
  useEffect(() => {
    if (!isCleared) return undefined
    const key = `finmate.clear-celebrated:${goalKey}`
    let seen = false
    try {
      seen = Boolean(window.sessionStorage.getItem(key))
    } catch {
      // sessionStorage를 쓸 수 없으면 매번 연출한다
    }
    if (seen) return undefined
    setCelebratePhase('standing')
    const standing = window.setTimeout(() => setCelebratePhase('falling'), 450)
    const done = window.setTimeout(() => {
      setCelebratePhase('done')
      try {
        window.sessionStorage.setItem(key, '1')
      } catch {
        // 저장 실패는 무시한다
      }
    }, 450 + 900)
    return () => {
      window.clearTimeout(standing)
      window.clearTimeout(done)
    }
  }, [isCleared, goalKey])

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

  // 턴 스케줄러: AUTO가 켜져 있고 레이드가 진행 중일 때만 돌린다.
  useEffect(() => {
    if (!autoBattle || isCleared) {
      setAttacking(null)
      return undefined
    }
    const timer = window.setInterval(() => {
      const members = partyRef.current
      if (members.length === 0) return
      const turnIndex = turnRef.current
      turnRef.current += 1
      const attacker = members[turnIndex % members.length]
      setAttacking(attacker.assetStem)

      // 돌진이 보스에 닿는 순간 — 타격 이펙트와 보스 피격 셰이크.
      window.setTimeout(() => {
        if (autoCollect) {
          const damage = damageForImpact(turnIndex * 97 + 7)
          const top = 36 + (turnIndex % 3) * 6
          spawnFloatNumber('dmg', `-${damage.toLocaleString('ko-KR')}`, 71, top)
          spawnHitSpark(69, top)
        }
        // 겹치는 타격끼리 서로 애니메이션을 끊어먹지 않도록 토큰으로 "가장 마지막 타격만" 흔들림을 종료시킨다.
        const token = ++bossHitTokenRef.current
        setBossDrift(token % 3 === 0 ? 'up' : token % 2 === 0 ? 'right' : 'left')
        setBossHit(true)
        window.setTimeout(() => {
          if (bossHitTokenRef.current === token) setBossHit(false)
        }, 300)
      }, ATTACK_IMPACT_MS)

      window.setTimeout(() => {
        setAttacking((current) => (current === attacker.assetStem ? null : current))
      }, ATTACK_TOTAL_MS)
    }, ATTACK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [autoBattle, autoCollect, isCleared, spawnFloatNumber, spawnHitSpark])

  const completedQuests = quests.filter((quest) => quest.status === 'COMPLETED')
  const questIcons = quests.slice(0, 3)
  const animalName: Record<HomeBattleViewModel['party'][number]['animal'], string> = {
    BEAR: '곰',
    SEAL: '물개',
    RABBIT: '토끼',
    BIRD: '새',
  }
  const bossSpriteState: BossSpriteState = isCleared ? (celebratePhase === 'done' ? 'defeated' : 'idle') : bossHit ? 'hit' : 'idle'
  const bossSpriteSrc = firstWorkingSprite(
    bossSpriteCandidates(bossSpriteState),
    brokenSpritePaths,
  )

  return (
    <div className="screen screen-home screen-home-battle">
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

        <div className={`home-scene-stage${isCleared ? ' is-cleared' : ''}${isCleared && celebratePhase !== 'done' ? ' is-celebrating' : ''}${celebratePhase === 'falling' ? ' is-boss-falling' : ''}`}>
          <div className="home-formation">
            {view.party.map((member) => {
              const spriteState: PartySpriteState = isCleared
                ? 'victory'
                : attacking === member.assetStem ? 'attack' : 'idle'
              const spriteSrc = firstWorkingSprite(
                partySpriteCandidates(member.assetStem, spriteState),
                brokenSpritePaths,
              )

              return (
                <button
                  className={`home-party-slot${attacking === member.assetStem ? ' is-attacking' : ''}`}
                  type="button"
                  onClick={() => onOpenReport(member.reportType)}
                  aria-label={`${animalName[member.animal]} ${member.shortLabel} 리포트 보기`}
                  data-sprite-state={spriteState}
                  key={member.animal}
                >
                  {spriteSrc ? (
                    <img
                      className="home-party-img"
                      alt=""
                      draggable={false}
                      src={spriteSrc}
                      onError={() => setBrokenSpritePaths((prev) => ({ ...prev, [spriteSrc]: true }))}
                    />
                  ) : (
                    <span className="home-char-fallback home-party-img" aria-hidden="true">{member.emoji}</span>
                  )}
                  <HomeHPBar percent={member.scorePercent} tone={member.tone === 'blue' ? 'blue' : 'green'} />
                </button>
              )
            })}
          </div>

          <button
            className={`home-boss${bossHit ? ` is-hit drift-${bossDrift}` : ''}${isCleared ? ' is-defeated' : ''}`}
            type="button"
            onClick={onOpenQuest}
            aria-label={`${view.bossName} 퀘스트 보기`}
            data-sprite-state={bossSpriteState}
          >
            {bossSpriteSrc ? (
              <img
                className="home-boss-img"
                src={bossSpriteSrc}
                alt=""
                draggable={false}
                onError={() => setBrokenSpritePaths((prev) => ({ ...prev, [bossSpriteSrc]: true }))}
              />
            ) : (
              <span className="home-char-fallback home-boss-img" aria-hidden="true">🧳</span>
            )}
            <span className="home-boss-plate">{view.bossName}</span>
          </button>

          {floatNumbers.map((entry) => (
            <span className={`home-float-number ${entry.kind}`} style={{ left: `${entry.left}%`, top: `${entry.top}%` }} key={entry.id}>{entry.value}</span>
          ))}
          {hitSparks.map((entry) => (
            <span className="home-hit-spark" style={{ left: `${entry.left}%`, top: `${entry.top}%` }} key={entry.id} aria-hidden="true" />
          ))}
          {isCleared && celebratePhase === 'done' ? <span className="home-clear-banner" role="status">🏆 레이드 클리어!</span> : null}
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
