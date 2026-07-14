/**
 * 홈 탭 보스 전투 — 궤도/상태 머신 순수 로직.
 *
 * DOM/React에 전혀 의존하지 않는다. 이렇게 분리해 두면
 * (1) HomeBattleScene.tsx의 requestAnimationFrame 루프에서 매 프레임 그대로 사용하고,
 * (2) `node --experimental-strip-types` 로 이 파일만 불러와 좌표/방향을 검증할 수 있다.
 *
 * 좌표계: 모두 `.home-scene-stage` 기준 px (좌상단 0,0, x=오른쪽+, y=아래쪽+).
 * 실제 px 값은 호출 쪽(getBoundingClientRect)에서 측정해 넘겨준다 — 그래야
 * 모바일 화면 크기가 바뀌어도 좌표가 깨지지 않는다.
 */

export type HomeSpecies = 'invest' | 'consume' | 'mission' | 'save'

export type Vec2 = { x: number; y: number }

export type Phase = 'REPOSITION' | 'WIND_UP' | 'LUNGE' | 'IMPACT' | 'RETREAT' | 'COOLDOWN' | 'ENTRY'

export type Direction = 'left' | 'right'

export type StageMetrics = {
  stageW: number
  stageH: number
  bossCenter: Vec2
  bossHalfWidth: number
  bossHitRadius: number
}

export type Segment = {
  phase: Phase
  tStart: number
  tEnd: number
  from: Vec2
  to: Vec2
  /** 존재하면 quadratic bezier로 보간(휘어진 경로), 없으면 직선 보간 */
  control?: Vec2
  /** IMPACT 진입 시 데미지 표시/보스 피격 트리거용 */
  isImpact?: boolean
}

export type CharacterOrbitConfig = {
  id: HomeSpecies
  /** 시작 각도(도, 0=보스 오른쪽/동쪽, 90=보스 아래/남쪽, 180=왼쪽/서쪽, 270=위쪽/북쪽, 시계방향) */
  startAngleDeg: number
  /** 각속도(도/초). 부호로 회전 방향 결정 */
  angularSpeedDegPerSec: number
  /** 보스 반폭 대비 수평 반지름 배율 (0.9~1.5 권장) */
  hRadiusRatio: number
  /** 수평 반지름 대비 수직 반지름 배율 (0.45~0.65 권장) */
  vRadiusRatio: number
  /** 첫 공격 시작 지연(ms) */
  staggerMs: number
  /** 이 캐릭터 전용 시드(재현 가능한 난수) */
  seed: number
}

// ── 캐릭터별 기본 설정 (요청 스펙의 예시 지연시간/초기 배치를 그대로 반영) ──
export const ORBIT_CONFIGS: CharacterOrbitConfig[] = [
  { id: 'consume', startAngleDeg: 135, angularSpeedDegPerSec: 55, hRadiusRatio: 1.15, vRadiusRatio: 0.55, staggerMs: 0, seed: 1001 }, // 토끼: 보스 왼쪽 아래
  { id: 'mission', startAngleDeg: 315, angularSpeedDegPerSec: -42, hRadiusRatio: 1.35, vRadiusRatio: 0.5, staggerMs: 220, seed: 2003 }, // 새: 보스 오른쪽 위
  { id: 'save', startAngleDeg: 45, angularSpeedDegPerSec: 38, hRadiusRatio: 1.0, vRadiusRatio: 0.6, staggerMs: 470, seed: 3007 }, // 물개: 보스 오른쪽 아래
  { id: 'invest', startAngleDeg: 225, angularSpeedDegPerSec: -60, hRadiusRatio: 1.5, vRadiusRatio: 0.48, staggerMs: 730, seed: 4013 }, // 곰: 보스 왼쪽 위
]

export const PHASE_RANGE_MS: Record<'REPOSITION' | 'WIND_UP' | 'LUNGE' | 'IMPACT' | 'RETREAT' | 'COOLDOWN', [number, number]> = {
  REPOSITION: [350, 700],
  WIND_UP: [80, 140],
  LUNGE: [150, 240],
  IMPACT: [60, 110],
  RETREAT: [250, 500],
  COOLDOWN: [100, 300],
}

const DIRECTION_THRESHOLD_PX = 8

// ── 시드 난수 (mulberry32) — 10초 데모가 매번 동일하게 재현되도록 ──
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min)
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function normalizeAngle(deg: number): number {
  let a = deg % 360
  if (a < 0) a += 360
  return a
}

function angularDist(a: number, b: number): number {
  const d = Math.abs(normalizeAngle(a) - normalizeAngle(b)) % 360
  return d > 180 ? 360 - d : d
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

function quadraticBezier(p0: Vec2, p1: Vec2, p2: Vec2, t: number): Vec2 {
  const mt = 1 - t
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  }
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

function easeInCubic(t: number): number {
  return t * t * t
}

const EASING: Record<Phase, (t: number) => number> = {
  ENTRY: (t) => t,
  REPOSITION: easeInOutQuad,
  WIND_UP: easeOutQuad,
  LUNGE: easeInCubic,
  IMPACT: (t) => t,
  RETREAT: easeInOutQuad,
  COOLDOWN: (t) => t,
}

/** 보스 중심 기준 타원 궤도 위의 한 점 */
export function pointOnOrbit(bossCenter: Vec2, angleDeg: number, hRadius: number, vRadius: number): Vec2 {
  const rad = toRad(angleDeg)
  return {
    x: bossCenter.x + Math.cos(rad) * hRadius,
    y: bossCenter.y + Math.sin(rad) * vRadius,
  }
}

/**
 * 캐릭터 위치에서 보스 중심으로 향하는 방향 벡터를 정규화한 뒤,
 * 보스 중심에서 bossHitRadius 만큼 바깥쪽 지점을 돌려준다.
 * → 공격 도착점은 항상 보스 "중심"이 아니라 보스 "외곽"이다.
 */
export function attackPointTowardBoss(from: Vec2, bossCenter: Vec2, bossHitRadius: number): Vec2 {
  const dx = from.x - bossCenter.x
  const dy = from.y - bossCenter.y
  const length = Math.hypot(dx, dy) || 1
  return {
    x: bossCenter.x + (dx / length) * bossHitRadius,
    y: bossCenter.y + (dy / length) * bossHitRadius,
  }
}

/** 보스 반대 방향으로 pullDist만큼 물러난 지점(WIND_UP용) */
function pullBackPoint(from: Vec2, bossCenter: Vec2, pullDist: number): Vec2 {
  const dx = from.x - bossCenter.x
  const dy = from.y - bossCenter.y
  const length = Math.hypot(dx, dy) || 1
  return { x: from.x + (dx / length) * pullDist, y: from.y + (dy / length) * pullDist }
}

function clampToBounds(point: Vec2, bounds: { minX: number; maxX: number; minY: number; maxY: number }): Vec2 {
  return {
    x: clamp(point.x, bounds.minX, bounds.maxX),
    y: clamp(point.y, bounds.minY, bounds.maxY),
  }
}

/** from→to 중점에서 수직으로 살짝 밀어낸 베지어 제어점 — 직선이 아닌 곡선 경로를 만든다 */
function curveControlPoint(from: Vec2, to: Vec2, rng: () => number): Vec2 {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const bend = randRange(rng, 18, 46) * (rng() < 0.5 ? -1 : 1)
  return { x: midX + nx * bend, y: midY + ny * bend }
}

/**
 * 방향 전환 히스테리시스: 보스 중심 근처에서 이미지가 빠르게 깜빡이지 않도록
 * threshold(6~10px) 안에서는 이전 방향을 유지한다.
 */
export function updateDirection(characterX: number, bossX: number, previousDirection: Direction, threshold = DIRECTION_THRESHOLD_PX): Direction {
  const difference = bossX - characterX
  if (difference > threshold) return 'right'
  if (difference < -threshold) return 'left'
  return previousDirection
}

/**
 * 캐릭터 한 명의 전체 스케줄(REPOSITION→WIND_UP→LUNGE→IMPACT→RETREAT→COOLDOWN 반복)을
 * horizonMs 만큼 미리 계산한다. 다른 캐릭터의 각도 함수(otherAngleAt)와 비교해
 * 너무 가까운 위치로 재배치하지 않도록 회피한다.
 */
export function buildCharacterSchedule(
  config: CharacterOrbitConfig,
  metrics: StageMetrics,
  horizonMs: number,
  otherAngleAt: Array<(tMs: number) => number>,
): Segment[] {
  const rng = mulberry32(config.seed)
  const bounds = { minX: 6, maxX: metrics.stageW - 6, minY: 6, maxY: metrics.stageH - 6 }
  const hRadius = metrics.bossHalfWidth * config.hRadiusRatio
  const vRadius = hRadius * config.vRadiusRatio

  const angleAtLive = (tMs: number) => config.startAngleDeg + (config.angularSpeedDegPerSec * tMs) / 1000

  const spawnPoint = clampToBounds(pointOnOrbit(metrics.bossCenter, config.startAngleDeg, hRadius, vRadius), bounds)

  const segments: Segment[] = []
  let t = 0

  // ENTRY: 전투 시작 시점부터 자신의 지연시간까지는 이미 보스 주변 자리에 분산되어 대기한다.
  segments.push({ phase: 'ENTRY', tStart: 0, tEnd: config.staggerMs, from: spawnPoint, to: spawnPoint })
  t = config.staggerMs
  let currentPos = spawnPoint
  let currentAngle = config.startAngleDeg

  const pickFreeAngle = (rawAngle: number, atTime: number): number => {
    let angle = rawAngle
    for (const otherAt of otherAngleAt) {
      const otherAngle = normalizeAngle(otherAt(atTime))
      if (angularDist(angle, otherAngle) < 34) {
        angle += 52 * (rng() < 0.5 ? -1 : 1)
      }
    }
    return angle
  }

  while (t < horizonMs) {
    // REPOSITION: 보스 주변 새 위치로 곡선 이동 (다른 캐릭터 위치 회피)
    const repoDur = randRange(rng, PHASE_RANGE_MS.REPOSITION[0], PHASE_RANGE_MS.REPOSITION[1])
    const repoEndTime = t + repoDur
    const nextAngleRaw = angleAtLive(repoEndTime) + randRange(rng, -14, 14)
    const nextAngle = pickFreeAngle(nextAngleRaw, repoEndTime)
    const radiusJitter = randRange(rng, 0.86, 1.12)
    const meleeAnchor = clampToBounds(pointOnOrbit(metrics.bossCenter, nextAngle, hRadius * radiusJitter, vRadius * radiusJitter), bounds)
    const repoControl = curveControlPoint(currentPos, meleeAnchor, rng)
    segments.push({ phase: 'REPOSITION', tStart: t, tEnd: repoEndTime, from: currentPos, to: meleeAnchor, control: repoControl })
    t = repoEndTime
    currentPos = meleeAnchor
    currentAngle = nextAngle

    // WIND_UP: 보스 반대 방향으로 5~10px 후퇴하며 공격 준비
    const windDur = randRange(rng, PHASE_RANGE_MS.WIND_UP[0], PHASE_RANGE_MS.WIND_UP[1])
    const pullDist = randRange(rng, 5, 10)
    const windTarget = pullBackPoint(currentPos, metrics.bossCenter, pullDist)
    segments.push({ phase: 'WIND_UP', tStart: t, tEnd: t + windDur, from: currentPos, to: windTarget })
    t += windDur
    currentPos = windTarget

    // LUNGE: 보스 외곽 충돌 지점까지 빠르게 돌진 (보스 중심으로는 들어가지 않는다)
    const lungeDur = randRange(rng, PHASE_RANGE_MS.LUNGE[0], PHASE_RANGE_MS.LUNGE[1])
    const attackPoint = attackPointTowardBoss(meleeAnchor, metrics.bossCenter, metrics.bossHitRadius)
    segments.push({ phase: 'LUNGE', tStart: t, tEnd: t + lungeDur, from: currentPos, to: attackPoint })
    t += lungeDur
    currentPos = attackPoint

    // IMPACT: 짧게 정지 + 피격 이펙트 트리거
    const impactDur = randRange(rng, PHASE_RANGE_MS.IMPACT[0], PHASE_RANGE_MS.IMPACT[1])
    segments.push({ phase: 'IMPACT', tStart: t, tEnd: t + impactDur, from: currentPos, to: currentPos, isImpact: true })
    t += impactDur

    // RETREAT: 원래 출발 자리가 아니라 보스 주변의 "새" 위치로 빠져나간다
    const retreatDur = randRange(rng, PHASE_RANGE_MS.RETREAT[0], PHASE_RANGE_MS.RETREAT[1])
    const retreatEndTime = t + retreatDur
    const retreatAngleRaw = angleAtLive(retreatEndTime) + randRange(rng, 24, 78) * (rng() < 0.5 ? -1 : 1)
    const retreatAngle = pickFreeAngle(retreatAngleRaw, retreatEndTime)
    const retreatRadiusJitter = randRange(rng, 0.86, 1.12)
    const retreatTarget = clampToBounds(pointOnOrbit(metrics.bossCenter, retreatAngle, hRadius * retreatRadiusJitter, vRadius * retreatRadiusJitter), bounds)
    const retreatControl = curveControlPoint(currentPos, retreatTarget, rng)
    segments.push({ phase: 'RETREAT', tStart: t, tEnd: retreatEndTime, from: currentPos, to: retreatTarget, control: retreatControl })
    t = retreatEndTime
    currentPos = retreatTarget
    currentAngle = retreatAngle

    // COOLDOWN: 짧게 대기 후 다시 REPOSITION으로
    const cooldownDur = randRange(rng, PHASE_RANGE_MS.COOLDOWN[0], PHASE_RANGE_MS.COOLDOWN[1])
    segments.push({ phase: 'COOLDOWN', tStart: t, tEnd: t + cooldownDur, from: currentPos, to: currentPos })
    t += cooldownDur
  }

  void currentAngle
  return segments
}

/** 모든 캐릭터의 스케줄을 함께 만든다 (뒤 캐릭터가 앞 캐릭터의 실시간 각도를 참고해 자리를 피한다) */
export function buildAllSchedules(metrics: StageMetrics, horizonMs: number, configs: CharacterOrbitConfig[] = ORBIT_CONFIGS): Record<HomeSpecies, Segment[]> {
  const result = {} as Record<HomeSpecies, Segment[]>
  const liveAngleFns: Array<(tMs: number) => number> = []

  for (const config of configs) {
    const others = liveAngleFns.slice()
    const schedule = buildCharacterSchedule(config, metrics, horizonMs, others)
    result[config.id] = schedule
    liveAngleFns.push((tMs: number) => config.startAngleDeg + (config.angularSpeedDegPerSec * tMs) / 1000)
  }

  return result
}

/** tMs가 속한 세그먼트를 찾는다(세그먼트는 시간순으로 이어져 있으므로 이진 탐색) */
export function findSegmentIndex(schedule: Segment[], tMs: number): number {
  if (schedule.length === 0) return -1
  let lo = 0
  let hi = schedule.length - 1
  if (tMs >= schedule[hi].tEnd) return hi
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (tMs < schedule[mid].tEnd) {
      hi = mid
    } else {
      lo = mid + 1
    }
  }
  return lo
}

export function samplePosition(seg: Segment, tMs: number): Vec2 {
  const duration = Math.max(1, seg.tEnd - seg.tStart)
  const raw = clamp((tMs - seg.tStart) / duration, 0, 1)
  const eased = EASING[seg.phase](raw)
  if (seg.control) {
    return quadraticBezier(seg.from, seg.control, seg.to, eased)
  }
  return lerp(seg.from, seg.to, eased)
}

/**
 * 곡선(REPOSITION/RETREAT) 경로의 중간 지점이 두 끝점보다 보스에 더 가까워질 수 있으므로
 * (두 끝점이 보스를 사이에 두고 반대편에 있을 때 특히) 매 프레임 최종 좌표를 다시 한번
 * "보스 외곽 반지름 밖" 으로 강제한다. 이미 반지름 밖이면 그대로 둔다.
 */
export function enforceBossClearance(point: Vec2, bossCenter: Vec2, bossHitRadius: number): Vec2 {
  const dx = point.x - bossCenter.x
  const dy = point.y - bossCenter.y
  const dist = Math.hypot(dx, dy)
  if (dist >= bossHitRadius) return point
  if (dist < 1e-6) return { x: bossCenter.x, y: bossCenter.y - bossHitRadius }
  const scale = bossHitRadius / dist
  return { x: bossCenter.x + dx * scale, y: bossCenter.y + dy * scale }
}

export type SampleResult = { position: Vec2; phase: Phase; segmentIndex: number; isImpactStart: boolean }

/** schedule에서 tMs 시점의 위치/단계를 구한다. prevSegmentIndex를 넘기면 IMPACT 진입 순간을 감지한다 */
export function sampleSchedule(
  schedule: Segment[],
  tMs: number,
  bossCenter: Vec2,
  bossHitRadius: number,
  prevSegmentIndex = -1,
): SampleResult {
  const idx = findSegmentIndex(schedule, tMs)
  const seg = schedule[idx]
  const rawPosition = samplePosition(seg, tMs)
  const position = enforceBossClearance(rawPosition, bossCenter, bossHitRadius)
  const isImpactStart = Boolean(seg.isImpact) && idx !== prevSegmentIndex
  return { position, phase: seg.phase, segmentIndex: idx, isImpactStart }
}

/**
 * t=0부터 tMs까지 stepMs 간격으로 순차 시뮬레이션하며 방향(히스테리시스 포함)을 추적한다.
 * 라이브 rAF 루프와 검증 스크립트가 동일한 방식으로 방향을 계산하도록 공유하는 함수.
 */
export function simulateDirectionAt(schedule: Segment[], bossCenter: Vec2, bossHitRadius: number, targetMs: number, stepMs = 32): Direction {
  let direction: Direction = 'right'
  let prevIdx = -1
  for (let t = 0; t <= targetMs; t += stepMs) {
    const sample = sampleSchedule(schedule, t, bossCenter, bossHitRadius, prevIdx)
    prevIdx = sample.segmentIndex
    direction = updateDirection(sample.position.x, bossCenter.x, direction)
  }
  return direction
}

/**
 * 같은 프레임에 계산된 4명의 위치를 서로 비교해, 너무 가까운(minSeparation 이내) 쌍이 있으면
 * 서로 밀어낸다 — 스케줄 생성 시점의 각도 회피만으로는 못 막는(궤적이 우연히 스치는) 순간적
 * 겹침까지 매 프레임 방어한다. 스케줄 자체는 건드리지 않고 "그려지는 좌표"만 보정한다.
 */
export function resolveOverlaps(positions: Partial<Record<HomeSpecies, Vec2>>, minSeparation: number, iterations = 4): Partial<Record<HomeSpecies, Vec2>> {
  const ids = Object.keys(positions) as HomeSpecies[]
  const result: Partial<Record<HomeSpecies, Vec2>> = { ...positions }
  // 4명 모두가 서로 밀어내는 관계라 한 쌍을 밀면 다른 쌍이 다시 가까워질 수 있다 —
  // 몇 차례 반복해서 전체적으로 수렴시킨다(각 반복은 값싼 O(n^2), n=4라 부담 없음).
  for (let iter = 0; iter < iterations; iter++) {
    let movedAny = false
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = result[ids[i]]
        const b = result[ids[j]]
        if (!a || !b) continue
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.hypot(dx, dy)
        if (dist >= minSeparation) continue
        movedAny = true
        if (dist < 1e-6) {
          result[ids[i]] = { x: a.x - minSeparation / 2, y: a.y }
          result[ids[j]] = { x: b.x + minSeparation / 2, y: b.y }
          continue
        }
        const push = (minSeparation - dist) / 2
        const ux = dx / dist
        const uy = dy / dist
        result[ids[i]] = { x: a.x - ux * push, y: a.y - uy * push }
        result[ids[j]] = { x: b.x + ux * push, y: b.y + uy * push }
      }
    }
    if (!movedAny) break
  }
  return result
}
