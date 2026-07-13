import { delay, http, HttpResponse } from 'msw'
import type { Schema } from '../api/client'

const now = '2026-07-24T00:06:31Z'
const initialGoal: Schema['UserGoal'] = { goalId: 'europe-trip', title: '유럽 여행', domain: 'SAVING', currentAmountKrw: 2000000, targetAmountKrw: 5000000, targetMonth: '2026-12', state: 'ACTIVE', confirmedAt: now, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now }
const groups: Schema['MateGroup'][] = [
  { groupId: 'savers', name: '꾸준저축 원정대', memberCount: 34, syntheticDemo: false, eligibleForProductionAggregation: true },
  { groupId: 'budget', name: '생활비 탐험대', memberCount: 31, syntheticDemo: false, eligibleForProductionAggregation: true },
]
const baseRoutine: Schema['ActiveRoutineBuild'] = { buildId: 'build-current', candidateId: 'candidate-current', sourceRoutineId: 'routine-current', domain: 'SAVING', difficulty: 'LIGHT', status: 'ACTIVE', steps: ['월급날 자동저축'], activatedAt: now, replacesBuildId: null, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now }
const lightCandidate = { candidateId: 'candidate-light', difficulty: 'LIGHT', domain: 'SAVING', title: '주 1회 저축 확인', targetKind: 'BEHAVIOR', behaviorTarget: '주 1회 자동저축 확인', steps: ['월요일 저축 확인'] } satisfies Schema['RoutineAdaptationCandidate']
const standardCandidate = { candidateId: 'candidate-standard', difficulty: 'STANDARD', domain: 'SAVING', title: '주 3회 저축 챌린지', targetKind: 'BEHAVIOR', behaviorTarget: '주 3회 10,000원 자동저축 확인', steps: ['월요일 저축 확인', '수요일 저축 확인', '금요일 저축 확인'] } satisfies Schema['RoutineAdaptationCandidate']
const challengeCandidate = { candidateId: 'candidate-challenge', difficulty: 'CHALLENGE', domain: 'SAVING', title: '주 5회 저축 챌린지', targetKind: 'BEHAVIOR', behaviorTarget: '주 5회 자동저축 확인', steps: ['평일 저축 확인'] } satisfies Schema['RoutineAdaptationCandidate']
const recommendation: Schema['RoutineRecommendation'] = { adaptationId: 'adaptation-europe', sourceRoutineId: 'routine-savers', selectedDomain: 'SAVING', recommendedCandidate: standardCandidate, recommendationReasonCopyKey: 'PAYDAY_SAVE_STANDARD_FROM_BASELINE_V1', relatedProductId: 'hana-saving-info-001', intensityOptions: [lightCandidate, standardCandidate, challengeCandidate], calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now }

let activeRoutine: Schema['ActiveRoutineBuild'] = baseRoutine
let demoFrameIndex = 0
let activeGoal: Schema['UserGoal'] = initialGoal
let questStatuses: Record<string, Schema['Quest']['status']> = { 'quest-routine': 'AVAILABLE', 'quest-etf': 'AVAILABLE' }
const demoCommands = new Map<string, { expectedFrameIndex: number; response: Schema['DemoTimelineView'] }>()

export function resetMockState() { activeRoutine = baseRoutine; demoFrameIndex = 0; activeGoal = initialGoal; questStatuses = { 'quest-routine': 'AVAILABLE', 'quest-etf': 'AVAILABLE' }; demoCommands.clear() }

const financialStats: Schema['FinancialStats'] = { spendingDefenseBps: 6300, savingHpBps: 5800, investmentJudgmentBps: 5500, questXp: 26 }
const raidView = (): Schema['RaidView'] => ({ raidId: 'raid-europe', goalId: activeGoal.goalId, stage: demoFrameIndex >= 6 ? 3 : Math.min(3, Math.floor(demoFrameIndex / 2) + 1), bossHpBps: demoFrameIndex >= 6 ? 0 : Math.max(0, 10000 - Math.round(demoFrameIndex / 6 * 10000)), currentProgressBps: demoFrameIndex >= 6 ? 10000 : Math.round(demoFrameIndex / 6 * 10000), highestProgressBps: demoFrameIndex >= 6 ? 10000 : Math.round(demoFrameIndex / 6 * 10000), status: demoFrameIndex >= 6 ? 'COMPLETED' : 'WAITING_FOR_DATA', financialStats, coachCopyKey: demoFrameIndex >= 6 ? 'GOAL_COMPLETE' : 'SAVING_STEADY', calculationVersion: 'raid-calc-v2', dataState: 'FRESH', lastSyncedAt: now })
const questItems = (): Schema['Quest'][] => [
  { questId: 'quest-routine', title: '자동저축 입금 반영 확인하기', status: questStatuses['quest-routine'], verificationKind: 'SYNTHETIC_MYDATA', currentValue: 0, targetValue: 1, unit: 'COUNT', durationLabel: '이번 달', xpReward: 5, pointReward: 2, financialStatsChanged: false, acceptedAt: questStatuses['quest-routine'] === 'AVAILABLE' ? null : now, calculationVersion: 'quest-calc-v2', dataState: 'FRESH', lastSyncedAt: now },
  { questId: 'quest-etf', title: 'ETF O/X 한 문제 풀기', status: questStatuses['quest-etf'], verificationKind: 'BEHAVIOR', currentValue: 0, targetValue: 1, unit: 'COUNT', durationLabel: '오늘까지', xpReward: 3, pointReward: 1, financialStatsChanged: false, acceptedAt: questStatuses['quest-etf'] === 'AVAILABLE' ? null : now, calculationVersion: 'quest-calc-v2', dataState: 'FRESH', lastSyncedAt: now },
]
const problem = (status: number, code: string, detail: string, instance: string) => HttpResponse.json({ type: `https://finmate.example/problems/${code.toLowerCase().replaceAll('_', '-')}`, title: 'Request failed', status, detail, instance, code, traceId: crypto.randomUUID() }, { status })

const page = (groupId: string): Schema['RecommendedAdventurerPage'] => ({
  groupId,
  items: [{ adventurerId: groupId === 'budget' ? 'adventurer-budget' : 'adventurer-saver', groupId, alias: groupId === 'budget' ? '남쪽의 모험가' : '북쪽의 모험가', contextTags: ['사회초년생', '자취'], similarityReasons: ['익명 저축 루틴을 꾸준히 유지했어요.'], goalAchievementLabel: '여행 자금 목표 달성', routines: [{ routineId: groupId === 'budget' ? 'routine-budget' : 'routine-savers', title: groupId === 'budget' ? '하루 한 번 지출 점검' : '주 3회 저축 챌린지', domain: 'SAVING', maintenanceDays: 42 }], verifiedAt: now, approvedAt: now }],
  calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now,
})
const dailyActivity = (index: number): Schema['DailyActivity'] => ({ activityId: `activity-${index}`, activityType: index === 10 ? 'INCOME' : index === 9 ? 'SAVING' : 'EXPENSE', title: index === 10 ? '월급 입금' : index === 9 ? '비상금 자동저축' : '일상 지출', amountKrw: index === 10 ? 2800000 : index === 9 ? 100000 : -12000, occurredAt: now, primary: true, categoryLabels: [index === 10 ? '정기수입' : '생활'] })
const journey: Schema['DailyRecord'][] = Array.from({ length: 30 }, (_, index) => ({ date: `2026-07-${String(index + 1).padStart(2, '0')}`, status: index < 11 ? (index === 10 ? 'TODAY' : 'RECORDED') : 'PLANNED', activities: index < 11 ? [dailyActivity(index)] : [], budget: { budgetKrw: 32000, spentKrw: index < 11 ? 12000 : 0, remainingKrw: index < 11 ? 20000 : 32000, usedBps: index < 11 ? 3750 : 0 }, xpEarned: index < 11 ? 5 : 0, reflection: null, calculationVersion: 'record-calc-v2', dataState: 'FRESH', lastSyncedAt: now }))
const journeyMonth: Schema['DailyJourneyMonth'] = { month: '2026-07', recordedDayCount: 11, dayCount: 30, moneySummary: { incomeKrw: 2800000, expenseKrw: 163400, savingKrw: 100000 }, nodes: journey.map((record, index) => ({ date: record.date, status: index < 11 ? (index === 10 ? 'TODAY' : 'RECORDED') : index === 11 ? 'PLANNED' : 'LOCKED', primaryActivity: record.activities[0] ?? { activityId: `planned-${index}`, activityType: 'QUEST', title: '기록 예정', occurredAt: now, primary: true, categoryLabels: ['잠김'] }, secondaryActivityTypes: index === 10 ? ['SAVING', 'INVESTMENT'] : [], hiddenActivityCount: index === 10 ? 2 : 0, detailAvailable: index <= 11 })), calculationVersion: 'journey-calc-v1', dataState: 'FRESH', lastSyncedAt: now }

export const handlers = [
  http.post('/api/v1/auth/signup', async ({ request }) => { await delay(100); const body = await request.json().catch(() => ({})) as { email?: string; displayName?: string }; return HttpResponse.json({ accessToken: 'access-token', tokenType: 'Bearer', expiresAt: now, user: { userId: '5d8c0a2f-8f86-4fc5-af80-f833fb8d7703', email: body.email ?? 'minji@example.com', displayName: body.displayName ?? '민지', onboardingStatus: 'NOT_STARTED' } }, { status: 201 }) }),
  http.post('/api/v1/auth/login', async ({ request }) => { const body = await request.json().catch(() => ({})) as { email?: string }; return HttpResponse.json({ accessToken: 'access-token', tokenType: 'Bearer', expiresAt: now, user: { userId: '5d8c0a2f-8f86-4fc5-af80-f833fb8d7703', email: body.email ?? 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } }) }),
  http.post('/api/v1/auth/refresh', () => HttpResponse.json({ accessToken: 'renewed-access-token', tokenType: 'Bearer', expiresAt: now, user: { userId: '5d8c0a2f-8f86-4fc5-af80-f833fb8d7703', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } })),
  http.post('/api/v1/auth/logout', () => new HttpResponse(null, { status: 204 })),
  http.get('/api/v1/onboarding', () => HttpResponse.json({ status: 'COMPLETED', onboardingState: 'GOAL_ACTIVE', displayName: '민지', context: { incomeRegularity: 'REGULAR', housingType: 'RENT', fixedCostBurden: 'MEDIUM' }, baseline: { disposableIncomeKrw: 1100000, spendingRateBps: 5200, savingRateBps: 1800, investmentJudgmentBps: 4000 }, mainGoal: activeGoal, calculationVersion: 'baseline-calc-v2', dataState: 'FRESH', lastSyncedAt: now })),
  http.put('/api/v1/onboarding', () => HttpResponse.json({ status: 'COMPLETED', onboardingState: 'EXPLORE_ONLY', displayName: '민지', context: { incomeRegularity: 'REGULAR', housingType: 'RENT', fixedCostBurden: 'MEDIUM' }, baseline: { disposableIncomeKrw: 1100000, spendingRateBps: 5200, savingRateBps: 1800, investmentJudgmentBps: 4000 }, calculationVersion: 'baseline-calc-v2', dataState: 'FRESH', lastSyncedAt: now })),
  http.post('/api/v1/goals', async ({ request }) => { const body = await request.json() as Schema['ConfirmUserGoalRequest']; activeGoal = { goalId: 'europe-trip', ...body.goal, state: 'ACTIVE', confirmedAt: now, calculationVersion: 'goal-calc-v2', dataState: 'FRESH', lastSyncedAt: now }; return HttpResponse.json(activeGoal, { status: 201 }) }),
  http.get('/api/v1/goals/active', () => HttpResponse.json(activeGoal)),
  http.get('/api/v1/home', () => HttpResponse.json({ mode: 'GOAL_ACTIVE', totalAssetsKrw: 4280000, mainGoal: activeGoal, raid: raidView(), financialStats, activeRoutineBuild: activeRoutine, lockedActions: [], calculationVersion: 'home-calc-v2', dataState: 'FRESH', lastSyncedAt: now })),
  http.get('/api/v1/raids/current', () => HttpResponse.json(raidView())),
  http.get('/api/v1/reports/monthly', () => HttpResponse.json({ month: '2026-07', goalProgressBps: 4000, financialStats, xpEarned: 26, completedQuestCount: 4, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now })),
  http.get('/api/v1/mate/groups', () => HttpResponse.json({ items: groups })),
  http.get('/api/v1/mate/groups/:groupId/adventurers', ({ params }) => HttpResponse.json(page(String(params.groupId)))),
  http.get('/api/v1/mate/groups/:groupId/adventurers/:adventurerId/routines/:routineId', ({ params }) => HttpResponse.json({ routineId: String(params.routineId), adventurerId: String(params.adventurerId), groupId: String(params.groupId), title: String(params.routineId) === 'routine-budget' ? '하루 한 번 지출 점검' : '주 3회 저축 챌린지', domain: 'SAVING', maintenanceDays: 42, steps: ['월급날 먼저 저축'], evidenceCopyKeys: ['ROUTINE_MAINTAINED_42_DAYS'] })),
  http.post('/api/v1/routine-adaptations', () => HttpResponse.json(recommendation, { status: 201 })),
  http.post('/api/v1/routine-adaptations/:adaptationId/candidates/:candidateId/import', () => problem(409, 'ACTIVE_ROUTINE_BUILD_EXISTS', 'An active routine build already exists.', '/api/v1/routine-adaptations/import')),
  http.get('/api/v1/routine-builds/active', () => HttpResponse.json(activeRoutine)),
  http.post('/api/v1/routine-builds/active/replacement', async ({ request }) => { const body = await request.json(); if (!body || typeof body !== 'object' || body.confirmReplacement !== true) return problem(422, 'CONFIRMATION_REQUIRED', 'Routine replacement requires explicit confirmation.', '/api/v1/routine-builds/active/replacement'); const archivedBuild = { ...activeRoutine, status: 'ARCHIVED' as const, archivedAt: now }; activeRoutine = { buildId: 'build-standard', candidateId: typeof body.candidateId === 'string' ? body.candidateId : standardCandidate.candidateId, sourceRoutineId: 'routine-savers', domain: 'SAVING', difficulty: 'STANDARD', status: 'ACTIVE', steps: standardCandidate.steps, activatedAt: now, replacesBuildId: archivedBuild.buildId, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now }; return HttpResponse.json({ archivedBuild, activeBuild: activeRoutine, replacedAt: now }) }),
  http.get('/api/v1/quests', () => HttpResponse.json({ items: questItems(), completedTodayCount: questItems().filter((quest) => quest.status === 'COMPLETED').length, totalTodayCount: questItems().length, totalXp: 26, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now })),
  http.post('/api/v1/quests/:questId/accept', ({ params }) => { const questId = String(params.questId); questStatuses[questId] = 'ACTIVE'; const quest = questItems().find((item) => item.questId === questId) ?? questItems()[0]; return HttpResponse.json({ quest, acceptedAt: now, financialStatsChanged: false }) }),
  http.post('/api/v1/quests/:questId/complete', ({ params }) => {
    const questId = String(params.questId)
    const pending = questId === 'quest-routine'
    questStatuses[questId] = pending ? 'DATA_PENDING' : 'COMPLETED'
    const quest = questItems().find((item) => item.questId === questId) ?? questItems()[0]
    return HttpResponse.json({ quest, xpAwarded: pending ? 0 : quest.xpReward, pointsAwarded: pending ? 0 : quest.pointReward, financialStatsChanged: false }, { status: pending ? 202 : 200 })
  }),
  http.get('/api/v1/records', () => HttpResponse.json({ items: journey, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now })),
  http.get('/api/v1/records/journey', () => HttpResponse.json(journeyMonth)),
  http.get('/api/v1/records/:date', ({ params }) => HttpResponse.json(journey.find((record) => record.date === String(params.date)) ?? journey[0])),
  http.post('/api/v1/demo/timeline/advance', async ({ request }) => {
    const key = request.headers.get('Idempotency-Key') ?? ''
    const body = await request.json() as { fixtureId?: string; expectedFrameIndex?: number }
    if (key.length < 16) return problem(400, 'VALIDATION_FAILED', 'Idempotency-Key is required.', '/api/v1/demo/timeline/advance')
    const replay = demoCommands.get(key)
    if (replay) return replay.expectedFrameIndex === body.expectedFrameIndex ? HttpResponse.json(replay.response) : problem(409, 'VALIDATION_FAILED', 'The command key was reused with another frame.', '/api/v1/demo/timeline/advance')
    if (body.fixtureId !== 'EUROPE_TRAVEL_JANUARY' || body.expectedFrameIndex !== demoFrameIndex || demoFrameIndex >= 6) return problem(409, 'VALIDATION_FAILED', 'The demo timeline frame changed.', '/api/v1/demo/timeline/advance')
    const appliedFrameIndex = demoFrameIndex
    demoFrameIndex += 1
    if (questStatuses['quest-routine'] === 'DATA_PENDING') questStatuses['quest-routine'] = 'COMPLETED'
    const completed = demoFrameIndex >= 6
    activeGoal = { ...activeGoal, currentAmountKrw: Math.min(activeGoal.targetAmountKrw, 2500000 + appliedFrameIndex * 500000), state: completed ? 'COMPLETED' : 'ACTIVE' }
    const frames: Schema['DemoTimelineFrame'][] = Array.from({ length: 6 }, (_, index) => ({ frameIndex: index, month: ['2026-08', '2026-09', '2026-10', '2026-11', '2026-12', '2027-01'][index], savingEventKrw: 500000, goalCurrentAmountKrw: 2500000 + index * 500000, goalProgressBps: Math.round((index + 1) / 6 * 10000), dataState: 'FRESH' }))
    const response: Schema['DemoTimelineView'] = { fixtureId: 'EUROPE_TRAVEL_JANUARY', initialGoalAmountKrw: 2000000, targetGoalAmountKrw: 5000000, currentFrameIndex: appliedFrameIndex, frames, mainGoal: activeGoal, raid: raidView(), calculationVersion: 'demo-timeline-v2', dataState: 'FRESH', lastSyncedAt: now }
    demoCommands.set(key, { expectedFrameIndex: body.expectedFrameIndex, response })
    return HttpResponse.json(response)
  }),
]
