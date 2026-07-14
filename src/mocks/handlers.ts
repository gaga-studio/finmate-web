import { delay, http, HttpResponse } from 'msw'
import type { Schema } from '../api/client'

const now = '2026-07-24T00:06:31Z'
const initialGoal: Schema['UserGoal'] = { goalId: 'europe-trip', title: '유럽 여행', domain: 'SAVING', currentAmountKrw: 2000000, targetAmountKrw: 5000000, targetMonth: '2026-12', state: 'ACTIVE', confirmedAt: now, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now }
const groups: Schema['MateGroup'][] = [
  { groupId: 'savers', name: '꾸준저축 원정대', memberCount: 34, syntheticDemo: false, eligibleForProductionAggregation: true },
  { groupId: 'budget', name: '생활비 탐험대', memberCount: 31, syntheticDemo: false, eligibleForProductionAggregation: true },
]
const friendOverview: Schema['MateFriendOverview'] = {
  friendCount: 4,
  completedToday: 3,
  readOnly: true,
  friends: [
    { friendId: 'friend-bear', alias: '단단한 곰', avatarCode: 'bear', questCompletedToday: true },
    { friendId: 'friend-rabbit', alias: '차분한 토끼', avatarCode: 'rabbit', questCompletedToday: true },
    { friendId: 'friend-bird', alias: '배우는 새', avatarCode: 'bird', questCompletedToday: true },
    { friendId: 'friend-otter', alias: '꾸준한 수달', avatarCode: 'otter', questCompletedToday: false },
  ],
}
const friendFeed: Schema['MateFriendFeed'] = {
  readOnly: true,
  items: [
    { friendId: 'friend-rabbit', alias: '차분한 토끼', avatarCode: 'rabbit', eventType: 'ROUTINE', message: '자동저축 확인 루틴을 이어갔어요.', completed: true, occurredAt: now },
    { friendId: 'friend-bird', alias: '배우는 새', avatarCode: 'bird', eventType: 'QUEST', message: '오늘의 금융 퀴즈를 완료했어요.', completed: true, occurredAt: now },
    { friendId: 'friend-otter', alias: '꾸준한 수달', avatarCode: 'otter', eventType: 'STREAK', message: '예산 확인 연속기록을 이어가고 있어요.', completed: false, occurredAt: now },
  ],
}
const friendStreaks: Schema['MateStreakPage'] = { readOnly: true, items: [{ friendId: 'friend-rabbit', alias: '차분한 토끼', label: '자동저축 확인', daysTogether: 12 }, { friendId: 'friend-otter', alias: '꾸준한 수달', label: '예산 먼저 보기', daysTogether: 7 }] }
const baseRoutine: Schema['ActiveRoutineBuild'] = { buildId: 'build-current', candidateId: 'candidate-current', sourceRoutineId: 'routine-current', domain: 'SAVING', difficulty: 'LIGHT', status: 'ACTIVE', steps: ['월급날 자동저축'], activatedAt: now, replacesBuildId: null, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now }
const lightCandidate = { candidateId: 'candidate-light', difficulty: 'LIGHT', domain: 'SAVING', title: '월급날 30만원 먼저 저축', targetKind: 'AMOUNT_KRW', targetAmountKrw: 300000, durationDays: 180, steps: ['월급 입금일 확인', '입금 당일 자동저축 확인'] } satisfies Schema['RoutineAdaptationCandidate']
const standardCandidate = { candidateId: 'candidate-standard', difficulty: 'STANDARD', domain: 'SAVING', title: '월급날 50만원 먼저 저축', targetKind: 'AMOUNT_KRW', targetAmountKrw: 500000, durationDays: 180, steps: ['월급 입금일 확인', '입금 당일 자동저축 확인'] } satisfies Schema['RoutineAdaptationCandidate']
const challengeCandidate = { candidateId: 'candidate-challenge', difficulty: 'CHALLENGE', domain: 'SAVING', title: '월급날 70만원 먼저 저축', targetKind: 'AMOUNT_KRW', targetAmountKrw: 700000, durationDays: 180, steps: ['월급 입금일 확인', '입금 당일 자동저축 확인'] } satisfies Schema['RoutineAdaptationCandidate']
const recommendation: Schema['RoutineRecommendation'] = { adaptationId: 'adaptation-europe', sourceRoutineId: 'routine-savers', selectedDomain: 'SAVING', recommendedCandidate: standardCandidate, recommendationReasonCopyKey: 'PAYDAY_SAVE_STANDARD_FROM_BASELINE_V1', relatedProductId: 'hana-saving-info-001', intensityOptions: [lightCandidate, standardCandidate, challengeCandidate], calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now }

let activeRoutine: Schema['ActiveRoutineBuild'] = baseRoutine
let demoFrameIndex = 0
let activeGoal: Schema['UserGoal'] | null = initialGoal
let onboardingComplete = true
let questStatuses: Record<string, Schema['Quest']['status']> = { 'quest-routine': 'AVAILABLE', 'quest-etf': 'AVAILABLE' }
const demoCommands = new Map<string, { expectedFrameIndex: number; response: Schema['DemoTimelineView'] }>()

export function resetMockState() { activeRoutine = baseRoutine; demoFrameIndex = 0; activeGoal = initialGoal; onboardingComplete = true; questStatuses = { 'quest-routine': 'AVAILABLE', 'quest-etf': 'AVAILABLE' }; demoCommands.clear() }

const financialStats: Schema['FinancialStats'] = { spendingDefenseBps: 6300, savingHpBps: 5800, investmentJudgmentBps: 5500, questXp: 26 }
const progressBps = () => Math.floor(demoFrameIndex / 6 * 10000)
const stageFor = (progress: number) => progress >= 6600 ? 3 : progress >= 3300 ? 2 : 1
const bossHpFor = (progress: number) => {
  if (progress >= 10000) return 0
  const stage = stageFor(progress)
  const start = stage === 1 ? 0 : stage === 2 ? 3300 : 6600
  const end = stage === 1 ? 3300 : stage === 2 ? 6600 : 10000
  return 10000 - Math.floor((progress - start) * 10000 / (end - start))
}
const raidView = (): Schema['RaidView'] => {
  if (!activeGoal) throw new Error('A raid requires an active goal')
  const progress = progressBps()
  return { raidId: 'raid-europe', goalId: activeGoal.goalId, stage: stageFor(progress), bossHpBps: bossHpFor(progress), currentProgressBps: progress, highestProgressBps: progress, status: progress >= 10000 ? 'COMPLETED' : progress === 0 ? 'WAITING_FOR_DATA' : 'ACTIVE', financialStats, coachCopyKey: progress >= 10000 ? 'GOAL_COMPLETE' : 'SAVING_STEADY', calculationVersion: 'raid-calc-v2', dataState: 'FRESH', lastSyncedAt: now }
}
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
const adventurerFor = (groupId: string, adventurerId?: string) => ({ ...page(groupId).items[0], ...(adventurerId ? { adventurerId } : {}) }) satisfies Schema['RecommendedAdventurerCard']
const reportFor = (groupId: string): Schema['MateGroupReport'] => ({
  group: groups.find((group) => group.groupId === groupId) ?? groups[0],
  selectionReasons: ['소득 규칙성과 주거 부담이 비슷해요.', '저축을 시작한 구간이 가까워요.'],
  spendingRateRange: { p25Bps: 4200, medianBps: 5000, p75Bps: 5800 },
  savingRateRange: { p25Bps: 1400, medianBps: 1900, p75Bps: 2400 },
  averageStats: { spendingDefenseBps: 6100, savingHpBps: 5700, investmentJudgmentBps: 5200, questXp: 22 },
  achieverCount: 9,
  adventurerPreview: page(groupId).items,
  coachCopyKeys: ['SIMILAR_START_POINT', 'ROUTINE_OVER_RANKING'],
  calculationVersion: 'mate-group-v2',
  dataState: 'FRESH',
  lastSyncedAt: now,
})
const adventurerReportFor = (groupId: string, adventurerId: string): Schema['AdventurerReport'] => ({
  adventurer: adventurerFor(groupId, adventurerId),
  comparisonMetrics: [
    { label: '저축률', myRange: '10–20%', adventurerRange: '20–30%', interpretationCopyKey: 'SAVING_GAP_IS_ACTIONABLE' },
    { label: '예산 확인', myRange: '주 1–2회', adventurerRange: '주 3–4회', interpretationCopyKey: 'CHECK_BEFORE_SPENDING' },
    { label: '루틴 유지', myRange: '시작 단계', adventurerRange: '42일 유지', interpretationCopyKey: 'MAINTENANCE_OVER_AMOUNT' },
  ],
  routineEvidence: ['42일 동안 월급날 먼저 저축을 유지했어요.', '정확 금액이 아닌 빈도와 유지 기간만 참고해요.'],
  calculationVersion: 'adventurer-report-v2',
  dataState: 'FRESH',
  lastSyncedAt: now,
})
const hanaProduct: Schema['RelatedHanaProductInfo'] = {
  productId: 'hana-saving-info-001',
  displayName: '하나 합 저축 정보',
  category: '적립식 저축 정보',
  relatedRoutineDomain: 'SAVING',
  keyConditions: ['정기적으로 저축하는 사용자가 확인할 수 있는 상품 정보예요.', '금리와 우대 조건은 공식 정보에서 최신 내용을 확인해야 해요.'],
  cautions: ['중도해지 시 적용 조건이 달라질 수 있어요.', '이 화면은 가입 권유나 개인 맞춤 추천이 아니에요.'],
  informationAsOf: '2026-07-14',
  officialInformationUrl: 'https://www.hanabank.com/',
  reviewedCatalog: true,
  inAppEnrollmentAvailable: false,
  affectsProgress: false,
}
const activity = (activityId: string, activityType: Schema['DailyActivity']['activityType'], title: string, amountKrw: number | undefined, primary: boolean, categoryLabels: string[]): Schema['DailyActivity'] => ({ activityId, activityType, title, ...(amountKrw !== undefined ? { amountKrw } : {}), occurredAt: now, primary, categoryLabels })
const activitiesForDay = (day: number): Schema['DailyActivity'][] => {
  if (day === 7) return [activity('activity-07-expense', 'EXPENSE', '식비·교통 지출', -24500, true, ['식비', '교통'])]
  if (day === 8) return [activity('activity-08-expense', 'EXPENSE', '예산 안에서 지출', -8900, true, ['생활'])]
  if (day === 9) return [activity('activity-09-expense', 'EXPENSE', '통신비 자동이체', -48000, true, ['고정비'])]
  if (day === 10) return [activity('activity-10-saving', 'SAVING', '비상금 자동저축', 100000, true, ['자동저축'])]
  if (day === 11) return [
    activity('activity-11-income', 'INCOME', '월급 입금', 2800000, true, ['정기수입']),
    activity('activity-11-expense', 'EXPENSE', '지출 3건', -19600, false, ['식비 12,000원', '카페 4,600원', '교통 3,000원']),
    activity('activity-11-saving', 'SAVING', '비상금 자동저축', 100000, false, ['자동저축']),
    activity('activity-11-investment', 'INVESTMENT', '투자계좌 입금', 50000, false, ['자산 이동']),
    activity('activity-11-quest', 'QUEST', '카페비 기록 퀘스트 완료', undefined, false, ['행동 완료']),
  ]
  return [activity(`activity-${day}`, 'EXPENSE', '일상 지출', -12000, true, ['생활'])]
}
const journey: Schema['DailyRecord'][] = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1
  const recorded = day <= 11
  const today = day === 11
  const budget = today
    ? { budgetKrw: 32000, spentKrw: 19600, remainingKrw: 12400, usedBps: 6125 }
    : { budgetKrw: 32000, spentKrw: recorded ? 12000 : 0, remainingKrw: recorded ? 20000 : 32000, usedBps: recorded ? 3750 : 0 }
  return {
    date: `2026-07-${String(day).padStart(2, '0')}`,
    status: recorded ? (today ? 'TODAY' : 'RECORDED') : 'PLANNED',
    activities: recorded ? activitiesForDay(day) : [],
    budget,
    xpEarned: today ? 20 : recorded ? 5 : 0,
    reflection: null,
    ...(today ? { recalculationSummary: '데이터 반영 후 금융 스탯을 다시 계산해요' } : {}),
    calculationVersion: 'record-calc-v2',
    dataState: 'FRESH',
    lastSyncedAt: now,
  }
})
const journeyMonth: Schema['DailyJourneyMonth'] = {
  month: '2026-07',
  recordedDayCount: 11,
  dayCount: 31,
  moneySummary: { incomeKrw: 2800000, expenseKrw: 163400, savingKrw: 100000 },
  nodes: journey.map((record, index) => {
    const day = index + 1
    const plannedActivity = day === 12
      ? activity('planned-12', 'ROUTINE', '오늘 예산 28,000원', undefined, true, ['예정 2개'])
      : activity(`planned-${day}`, 'QUEST', day === 13 ? '퀘스트 예정' : '기록 예정', undefined, true, ['잠김'])
    return {
      date: record.date,
      status: day <= 11 ? (day === 11 ? 'TODAY' : 'RECORDED') : day === 12 ? 'PLANNED' : 'LOCKED',
      primaryActivity: record.activities[0] ?? plannedActivity,
      secondaryActivityTypes: day === 11 ? ['SAVING', 'INVESTMENT'] : [],
      hiddenActivityCount: day === 11 ? 2 : 0,
      detailAvailable: day <= 12,
    }
  }),
  calculationVersion: 'journey-calc-v1',
  dataState: 'FRESH',
  lastSyncedAt: now,
}

const emptyJourneyMonth = (month: string): Schema['DailyJourneyMonth'] => {
  const [year, monthNumber] = month.split('-').map(Number)
  const dayCount = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
  return {
    month,
    recordedDayCount: 0,
    dayCount,
    moneySummary: { incomeKrw: 0, expenseKrw: 0, savingKrw: 0 },
    nodes: Array.from({ length: dayCount }, (_, index) => ({
      date: `${month}-${String(index + 1).padStart(2, '0')}`,
      status: 'LOCKED',
      primaryActivity: activity(`planned-${month}-${index + 1}`, 'QUEST', '기록 예정', undefined, true, ['잠김']),
      secondaryActivityTypes: [],
      hiddenActivityCount: 0,
      detailAvailable: false,
    })),
    calculationVersion: 'journey-calc-v1',
    dataState: 'FRESH',
    lastSyncedAt: now,
  }
}

export const handlers = [
  http.post('/api/v1/auth/signup', async ({ request }) => { await delay(100); onboardingComplete = false; activeGoal = null; demoFrameIndex = 0; const body = await request.json().catch(() => ({})) as { email?: string; displayName?: string }; return HttpResponse.json({ accessToken: 'access-token', tokenType: 'Bearer', expiresAt: now, user: { userId: '5d8c0a2f-8f86-4fc5-af80-f833fb8d7703', email: body.email ?? 'minji@example.com', displayName: body.displayName ?? '민지', onboardingStatus: 'NOT_STARTED' } }, { status: 201 }) }),
  http.post('/api/v1/auth/login', async ({ request }) => { const body = await request.json().catch(() => ({})) as { email?: string }; return HttpResponse.json({ accessToken: 'access-token', tokenType: 'Bearer', expiresAt: now, user: { userId: '5d8c0a2f-8f86-4fc5-af80-f833fb8d7703', email: body.email ?? 'minji@example.com', displayName: '민지', onboardingStatus: onboardingComplete ? 'COMPLETED' : 'NOT_STARTED' } }) }),
  http.post('/api/v1/auth/refresh', () => HttpResponse.json({ accessToken: 'renewed-access-token', tokenType: 'Bearer', expiresAt: now, user: { userId: '5d8c0a2f-8f86-4fc5-af80-f833fb8d7703', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } })),
  http.post('/api/v1/auth/logout', () => new HttpResponse(null, { status: 204 })),
  http.get('/api/v1/onboarding', () => onboardingComplete
    ? HttpResponse.json({ status: 'COMPLETED', onboardingState: activeGoal ? 'GOAL_ACTIVE' : 'EXPLORE_ONLY', displayName: '민지', context: { incomeRegularity: 'REGULAR', housingType: 'RENT', fixedCostBurden: 'MEDIUM' }, baseline: { disposableIncomeKrw: 1100000, spendingRateBps: 5200, savingRateBps: 1800, investmentJudgmentBps: 4000 }, ...(activeGoal ? { mainGoal: activeGoal } : {}), calculationVersion: 'baseline-calc-v2', dataState: 'FRESH', lastSyncedAt: now })
    : HttpResponse.json({ status: 'IN_PROGRESS', onboardingState: 'EXPLORE_ONLY', baseline: { disposableIncomeKrw: 1100000, spendingRateBps: 5200, savingRateBps: 1800, investmentJudgmentBps: 4000 }, calculationVersion: 'baseline-calc-v2', dataState: 'INSUFFICIENT', lastSyncedAt: null })),
  http.put('/api/v1/onboarding', () => { onboardingComplete = true; return HttpResponse.json({ status: 'COMPLETED', onboardingState: 'EXPLORE_ONLY', displayName: '민지', context: { incomeRegularity: 'REGULAR', housingType: 'RENT', fixedCostBurden: 'MEDIUM' }, baseline: { disposableIncomeKrw: 1100000, spendingRateBps: 5200, savingRateBps: 1800, investmentJudgmentBps: 4000 }, calculationVersion: 'baseline-calc-v2', dataState: 'FRESH', lastSyncedAt: now }) }),
  http.post('/api/v1/goals', async ({ request }) => { const body = await request.json() as Schema['ConfirmUserGoalRequest']; activeGoal = { goalId: 'europe-trip', ...body.goal, state: 'ACTIVE', confirmedAt: now, calculationVersion: 'goal-calc-v2', dataState: 'FRESH', lastSyncedAt: now }; return HttpResponse.json(activeGoal, { status: 201 }) }),
  http.get('/api/v1/goals/active', () => activeGoal ? HttpResponse.json(activeGoal) : problem(404, 'NOT_FOUND', 'No active goal exists.', '/api/v1/goals/active')),
  http.get('/api/v1/home', () => activeGoal
    ? HttpResponse.json({ mode: 'GOAL_ACTIVE', totalAssetsKrw: 4280000, mainGoal: activeGoal, raid: raidView(), financialStats, activeRoutineBuild: activeRoutine, lockedActions: [], calculationVersion: 'home-calc-v2', dataState: 'FRESH', lastSyncedAt: now })
    : HttpResponse.json({ mode: 'EXPLORE_ONLY', totalAssetsKrw: 4280000, financialStats: { spendingDefenseBps: 5200, savingHpBps: 1800, investmentJudgmentBps: 4000, questXp: 0 }, lockedActions: ['RAID', 'QUEST_ACCEPT', 'ROUTINE_IMPORT', 'PERSONALIZED_PRODUCT_INFO'], calculationVersion: 'home-calc-v2', dataState: 'FRESH', lastSyncedAt: now })),
  http.get('/api/v1/raids/current', () => activeGoal ? HttpResponse.json(raidView()) : problem(409, 'GOAL_REQUIRED', 'Confirm a goal before opening a raid.', '/api/v1/raids/current')),
  http.get('/api/v1/reports/characters/:reportType', ({ params }) => {
    const reportType = String(params.reportType) as Schema['CharacterReportType']
    const data = {
      SPENDING_DEFENSE: { characterName: 'BEAR' as const, scoreBps: financialStats.spendingDefenseBps, label: '소비율', displayValue: '63%' },
      SAVING_HP: { characterName: 'SEAL' as const, scoreBps: financialStats.savingHpBps, label: '저축률', displayValue: '58%' },
      INVESTMENT_JUDGMENT: { characterName: 'RABBIT' as const, scoreBps: financialStats.investmentJudgmentBps, label: '투자 점검', displayValue: '55%' },
      QUEST_XP: { characterName: 'BIRD' as const, scoreBps: financialStats.questXp * 100, label: '퀘스트 XP', displayValue: String(financialStats.questXp) },
    }[reportType]
    if (!data) return problem(404, 'NOT_FOUND', 'Unknown character report.', `/api/v1/reports/characters/${reportType}`)
    return HttpResponse.json({ reportType, characterName: data.characterName, scoreBps: data.scoreBps, metrics: [{ label: data.label, displayValue: data.displayValue, reasonCopyKey: 'VERIFIED_DATA_V1' }], trend30Days: [{ date: '2026-06-12', value: Math.max(0, data.scoreBps - 300) }, { date: '2026-07-11', value: data.scoreBps }], nextQuestId: reportType === 'SAVING_HP' ? 'quest-routine' : 'quest-etf', calculationVersion: 'character-report-v1', dataState: 'FRESH', lastSyncedAt: now })
  }),
  http.get('/api/v1/reports/monthly', () => HttpResponse.json({ month: '2026-07', goalProgressBps: 4000, financialStats, xpEarned: 26, completedQuestCount: 4, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now })),
  http.get('/api/v1/mate/friends/overview', () => HttpResponse.json(friendOverview)),
  http.get('/api/v1/mate/friends/feed', () => HttpResponse.json(friendFeed)),
  http.get('/api/v1/mate/friends/streaks', () => HttpResponse.json(friendStreaks)),
  http.get('/api/v1/mate/groups', () => HttpResponse.json({ items: groups })),
  http.get('/api/v1/mate/groups/:groupId/report', ({ params }) => HttpResponse.json(reportFor(String(params.groupId)))),
  http.get('/api/v1/mate/groups/:groupId/adventurers', ({ params }) => HttpResponse.json(page(String(params.groupId)))),
  http.get('/api/v1/mate/groups/:groupId/adventurers/:adventurerId', ({ params }) => HttpResponse.json(adventurerFor(String(params.groupId), String(params.adventurerId)))),
  http.get('/api/v1/mate/groups/:groupId/adventurers/:adventurerId/report', ({ params }) => HttpResponse.json(adventurerReportFor(String(params.groupId), String(params.adventurerId)))),
  http.get('/api/v1/mate/groups/:groupId/adventurers/:adventurerId/routines/:routineId', ({ params }) => HttpResponse.json({ routineId: String(params.routineId), adventurerId: String(params.adventurerId), groupId: String(params.groupId), title: String(params.routineId) === 'routine-budget' ? '하루 한 번 지출 점검' : '주 3회 저축 챌린지', domain: 'SAVING', maintenanceDays: 42, steps: ['월급날 먼저 저축'], evidenceCopyKeys: ['ROUTINE_MAINTAINED_42_DAYS'] })),
  http.post('/api/v1/mate/explore/search', async ({ request }) => { const body = await request.json() as Schema['MateExploreSearchRequest']; const selectedGroup = body.savingRateBand === 'OVER_20' ? 'savers' : 'budget'; return HttpResponse.json(page(selectedGroup)) }),
  http.post('/api/v1/routine-adaptations', () => HttpResponse.json(recommendation, { status: 201 })),
  http.post('/api/v1/routine-adaptations/:adaptationId/candidates/:candidateId/import', () => problem(409, 'ACTIVE_ROUTINE_BUILD_EXISTS', 'An active routine build already exists.', '/api/v1/routine-adaptations/import')),
  http.get('/api/v1/routine-builds/active', () => HttpResponse.json(activeRoutine)),
  http.post('/api/v1/routine-builds/active/replacement', async ({ request }) => { const body = await request.json(); if (!body || typeof body !== 'object' || body.confirmReplacement !== true) return problem(422, 'CONFIRMATION_REQUIRED', 'Routine replacement requires explicit confirmation.', '/api/v1/routine-builds/active/replacement'); const archivedBuild = { ...activeRoutine, status: 'ARCHIVED' as const, archivedAt: now }; activeRoutine = { buildId: 'build-standard', candidateId: typeof body.candidateId === 'string' ? body.candidateId : standardCandidate.candidateId, sourceRoutineId: 'routine-savers', domain: 'SAVING', difficulty: 'STANDARD', status: 'ACTIVE', steps: standardCandidate.steps, activatedAt: now, replacesBuildId: archivedBuild.buildId, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now }; return HttpResponse.json({ archivedBuild, activeBuild: activeRoutine, replacedAt: now }) }),
  http.get('/api/v1/hana-products/:productId', ({ params }) => String(params.productId) === hanaProduct.productId ? HttpResponse.json(hanaProduct) : problem(404, 'NOT_FOUND', 'Product information was not found.', `/api/v1/hana-products/${String(params.productId)}`)),
  http.get('/api/v1/quests', () => HttpResponse.json({ items: questItems(), completedTodayCount: questItems().filter((quest) => quest.status === 'COMPLETED').length, totalTodayCount: questItems().length, totalXp: 26, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now })),
  http.get('/api/v1/quests/:questId', ({ params }) => { const quest = questItems().find((item) => item.questId === String(params.questId)); return quest ? HttpResponse.json(quest) : problem(404, 'NOT_FOUND', 'Quest was not found.', `/api/v1/quests/${String(params.questId)}`) }),
  http.post('/api/v1/quests/:questId/accept', ({ params }) => { const questId = String(params.questId); questStatuses[questId] = 'ACTIVE'; const quest = questItems().find((item) => item.questId === questId) ?? questItems()[0]; return HttpResponse.json({ quest, acceptedAt: now, financialStatsChanged: false }) }),
  http.post('/api/v1/quests/:questId/complete', ({ params }) => {
    const questId = String(params.questId)
    const pending = questId === 'quest-routine'
    questStatuses[questId] = pending ? 'DATA_PENDING' : 'COMPLETED'
    const quest = questItems().find((item) => item.questId === questId) ?? questItems()[0]
    return HttpResponse.json({ quest, xpAwarded: pending ? 0 : quest.xpReward, pointsAwarded: pending ? 0 : quest.pointReward, financialStatsChanged: false }, { status: pending ? 202 : 200 })
  }),
  http.get('/api/v1/records', () => HttpResponse.json({ items: journey, calculationVersion: 'goal-calc-1.0.0', dataState: 'FRESH', lastSyncedAt: now })),
  http.get('/api/v1/records/journey', ({ request }) => {
    const month = new URL(request.url).searchParams.get('month') ?? journeyMonth.month
    return HttpResponse.json(month === journeyMonth.month ? journeyMonth : emptyJourneyMonth(month))
  }),
  http.get('/api/v1/records/:date', ({ params }) => HttpResponse.json(journey.find((record) => record.date === String(params.date)) ?? journey[0])),
  http.post('/api/v1/demo/timeline/advance', async ({ request }) => {
    const key = request.headers.get('Idempotency-Key') ?? ''
    const body = await request.json() as { fixtureId?: string; expectedFrameIndex?: number }
    if (key.length < 16) return problem(400, 'VALIDATION_FAILED', 'Idempotency-Key is required.', '/api/v1/demo/timeline/advance')
    const replay = demoCommands.get(key)
    if (replay) return replay.expectedFrameIndex === body.expectedFrameIndex ? HttpResponse.json(replay.response) : problem(409, 'VALIDATION_FAILED', 'The command key was reused with another frame.', '/api/v1/demo/timeline/advance')
    if (!activeGoal || body.fixtureId !== 'EUROPE_TRAVEL_JANUARY' || body.expectedFrameIndex !== demoFrameIndex || demoFrameIndex >= 6) return problem(409, 'VALIDATION_FAILED', 'The demo timeline frame changed.', '/api/v1/demo/timeline/advance')
    const appliedFrameIndex = demoFrameIndex
    demoFrameIndex += 1
    if (questStatuses['quest-routine'] === 'DATA_PENDING') questStatuses['quest-routine'] = 'COMPLETED'
    const completed = demoFrameIndex >= 6
    activeGoal = { ...activeGoal, currentAmountKrw: Math.min(activeGoal.targetAmountKrw, 2500000 + appliedFrameIndex * 500000), state: completed ? 'COMPLETED' : 'ACTIVE' }
    const frames: Schema['DemoTimelineFrame'][] = Array.from({ length: 6 }, (_, index) => ({ frameIndex: index, month: ['2026-08', '2026-09', '2026-10', '2026-11', '2026-12', '2027-01'][index], savingEventKrw: 500000, goalCurrentAmountKrw: 2500000 + index * 500000, goalProgressBps: Math.floor((index + 1) / 6 * 10000), dataState: 'FRESH' }))
    const response: Schema['DemoTimelineView'] = { fixtureId: 'EUROPE_TRAVEL_JANUARY', initialGoalAmountKrw: 2000000, targetGoalAmountKrw: 5000000, currentFrameIndex: appliedFrameIndex, frames, mainGoal: activeGoal, raid: raidView(), calculationVersion: 'demo-timeline-v2', dataState: 'FRESH', lastSyncedAt: now }
    demoCommands.set(key, { expectedFrameIndex: body.expectedFrameIndex, response })
    return HttpResponse.json(response)
  }),
]
