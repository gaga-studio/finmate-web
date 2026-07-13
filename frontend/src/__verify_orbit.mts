/**
 * homeBattleOrbit.ts 검증용 스크립트 (제품 코드 아님, DOM/React 없이 순수 로직만 확인).
 *
 * 실행: node --experimental-strip-types src/__verify_orbit.mts
 *
 * HomeBattleScene.tsx를 고치고 나서 궤도 좌표/방향/충돌회피가 완료 기준을 만족하는지
 * 브라우저 없이 빠르게 재확인하고 싶을 때 쓰는 용도로 남겨둔다.
 */
import {
  buildAllSchedules,
  enforceBossClearance,
  resolveOverlaps,
  sampleSchedule,
  simulateDirectionAt,
  updateDirection,
  type Direction,
  type HomeSpecies,
  type StageMetrics,
} from './homeBattleOrbit.ts'

const metrics: StageMetrics = {
  stageW: 338,
  stageH: 300,
  bossCenter: { x: 240, y: 84 },
  bossHalfWidth: 77.75,
  bossHitRadius: 77.75 * 0.58,
}

const HORIZON = 120000
const schedules = buildAllSchedules(metrics, HORIZON)

const checkpoints = [0, 2000, 4000, 6000, 8000, 10000]

console.log('=== 무대 기준값 (대표 모바일 폭 예시) ===')
console.log(metrics)
console.log('')

console.log('=== 체크포인트별 위치/단계/방향 ===')
for (const id of Object.keys(schedules) as HomeSpecies[]) {
  const schedule = schedules[id]
  console.log(`\n[${id}]`)
  for (const t of checkpoints) {
    const sample = sampleSchedule(schedule, t, metrics.bossCenter, metrics.bossHitRadius)
    const direction = simulateDirectionAt(schedule, metrics.bossCenter, metrics.bossHitRadius, t)
    const dist = Math.hypot(sample.position.x - metrics.bossCenter.x, sample.position.y - metrics.bossCenter.y)
    console.log(
      `  t=${String(t).padStart(5)}ms  phase=${sample.phase.padEnd(11)} x=${sample.position.x.toFixed(1).padStart(7)} y=${sample.position.y.toFixed(1).padStart(7)} dir=${direction.padEnd(5)} distFromBoss=${dist.toFixed(1)}`,
    )
  }
}

console.log('\n=== 완료 기준 검증 ===')

// 1) 좌우 최소 1회 이상 이동했는지 (direction 타임라인에 left/right 둘 다 존재)
console.log('\n[기준] 각 캐릭터가 보스 좌/우를 최소 1회 이상 지나가는가')
for (const id of Object.keys(schedules) as HomeSpecies[]) {
  const schedule = schedules[id]
  const seen = new Set<Direction>()
  let dir: Direction = 'right'
  let prevIdx = -1
  for (let t = 0; t <= 10000; t += 40) {
    const sample = sampleSchedule(schedule, t, metrics.bossCenter, metrics.bossHitRadius, prevIdx)
    prevIdx = sample.segmentIndex
    dir = updateDirection(sample.position.x, metrics.bossCenter.x, dir)
    seen.add(dir)
  }
  console.log(`  ${id}: ${[...seen].join(', ')}  ${seen.size >= 2 ? 'PASS' : 'FAIL'}`)
}

// HomeBattleScene.tsx의 rAF 루프와 동일한 파이프라인: 원시 샘플 → resolveOverlaps → enforceBossClearance
const ids = Object.keys(schedules) as HomeSpecies[]
const MIN_SEPARATION = 34
function resolvedPositionsAt(t: number) {
  const raw: Partial<Record<HomeSpecies, { x: number; y: number }>> = {}
  for (const id of ids) raw[id] = sampleSchedule(schedules[id], t, metrics.bossCenter, metrics.bossHitRadius).position
  const resolved = resolveOverlaps(raw, MIN_SEPARATION)
  const final: Partial<Record<HomeSpecies, { x: number; y: number }>> = {}
  for (const id of ids) {
    const p = resolved[id]
    if (p) final[id] = enforceBossClearance(p, metrics.bossCenter, metrics.bossHitRadius)
  }
  return final
}

// 2) 보스 중앙에 완전히 겹치지 않는지 (최종 렌더 좌표 기준, 전 구간)
console.log('\n[기준] 보스 중심 좌표에 캐릭터가 겹치지 않는가 (최종 좌표의 최소 거리 >= bossHitRadius)')
{
  const minDistById: Partial<Record<HomeSpecies, number>> = {}
  for (let t = 0; t <= 10000; t += 20) {
    const final = resolvedPositionsAt(t)
    for (const id of ids) {
      const p = final[id]
      if (!p) continue
      const dist = Math.hypot(p.x - metrics.bossCenter.x, p.y - metrics.bossCenter.y)
      minDistById[id] = Math.min(minDistById[id] ?? Infinity, dist)
    }
  }
  for (const id of ids) {
    const minDist = minDistById[id] ?? Infinity
    const pass = minDist >= metrics.bossHitRadius - 1
    console.log(`  ${id}: minDist=${minDist.toFixed(2)}px (bossHitRadius=${metrics.bossHitRadius.toFixed(2)}px)  ${pass ? 'PASS' : 'FAIL'}`)
  }
}

// 3) 캐릭터끼리 겹치지 않는가 (최종 렌더 좌표 기준, 동시 시각 최소 페어 거리)
console.log('\n[기준] 캐릭터끼리 정확히 같은 위치에 겹치지 않는가 (최종 좌표 페어간 최소 거리)')
{
  let globalMinPair = Infinity
  let globalMinPairAt = 0
  for (let t = 0; t <= 10000; t += 20) {
    const final = resolvedPositionsAt(t)
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = final[ids[i]]
        const b = final[ids[j]]
        if (!a || !b) continue
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < globalMinPair) {
          globalMinPair = d
          globalMinPairAt = t
        }
      }
    }
  }
  console.log(
    `  최소 페어 거리=${globalMinPair.toFixed(2)}px (목표 최소 분리 거리=${MIN_SEPARATION}px, t=${globalMinPairAt}ms)  ${globalMinPair > 0.5 ? 'PASS(완전히 겹치지 않음)' : 'FAIL'}`,
  )
}

// 4) 항상 최소 2개 이상 이동/공격 중인가 (COOLDOWN이 아닌 상태)
console.log('\n[기준] 항상 최소 2개 이상의 캐릭터가 이동/공격 중인가')
let minActive = 4
let minActiveAt = 0
for (let t = 1000; t <= 10000; t += 20) {
  let active = 0
  for (const id of ids) {
    const sample = sampleSchedule(schedules[id], t, metrics.bossCenter, metrics.bossHitRadius)
    if (sample.phase !== 'COOLDOWN' && sample.phase !== 'ENTRY') active++
  }
  if (active < minActive) {
    minActive = active
    minActiveAt = t
  }
}
console.log(`  최소 동시 활동 캐릭터 수=${minActive} (t=${minActiveAt}ms)  ${minActive >= 2 ? 'PASS' : 'FAIL'}`)

// 5) 공격(IMPACT) 타이밍이 서로 다른가
console.log('\n[기준] 네 캐릭터의 공격(IMPACT) 타이밍이 서로 다른가')
for (const id of ids) {
  const impactStarts = schedules[id].filter((s) => s.isImpact).slice(0, 4).map((s) => s.tStart)
  console.log(`  ${id}: 처음 4회 IMPACT 시작 시각(ms) = ${impactStarts.map((v) => v.toFixed(0)).join(', ')}`)
}
