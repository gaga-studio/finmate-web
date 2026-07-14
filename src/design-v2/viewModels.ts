import type { Schema } from '../api/client'

export type Animal = 'BEAR' | 'SEAL' | 'RABBIT' | 'BIRD'
export type CharacterTone = 'teal' | 'green' | 'blue' | 'purple'
export type CharacterAssetStem = 'invest' | 'save' | 'consume' | 'mission'

export type CharacterViewModel = {
  animal: Animal
  assetStem: CharacterAssetStem
  label: string
  shortLabel: string
  characterName: string
  meaning: string
  reportType: Schema['CharacterReportType']
  scorePercent: number
  scoreDisplay: string
  tone: CharacterTone
  emoji: string
  skillEmoji: string
}

export type HomeBattleViewModel = {
  mode: Schema['OnboardingState']
  goalTitle: string | null
  goalCurrentAmountKrw: number | null
  goalTargetAmountKrw: number | null
  goalProgressPercent: number
  stage: number | null
  bossName: string
  bossHpPercent: number
  raidStatus: Schema['RaidView']['status'] | null
  party: CharacterViewModel[]
  nextQuest: Schema['Quest'] | null
  questXp: number
  pointBalance: number
  rewardProgressPercent: number
  activeRoutineLabel: string | null
  dataState: Schema['DataState']
  lastSyncedAt: string | null
}

const clampPercent = (value: number) => Math.max(0, Math.min(100, value))
const bpsPercent = (value: number) => clampPercent(value / 100)

function fixedCharacters(stats: Schema['FinancialStats']): CharacterViewModel[] {
  return [
    {
      animal: 'BEAR',
      assetStem: 'invest',
      label: '소비 방어력',
      shortLabel: '소비',
      characterName: '든든곰',
      meaning: '예산 안에서 소비를 지키는 힘',
      reportType: 'SPENDING_DEFENSE',
      scorePercent: bpsPercent(stats.spendingDefenseBps),
      scoreDisplay: `${bpsPercent(stats.spendingDefenseBps)}점`,
      tone: 'teal',
      emoji: '🐻',
      skillEmoji: '🛡️',
    },
    {
      animal: 'SEAL',
      assetStem: 'save',
      label: '저축 HP',
      shortLabel: '저축',
      characterName: '모아씰',
      meaning: '목표를 꾸준히 지키는 힘',
      reportType: 'SAVING_HP',
      scorePercent: bpsPercent(stats.savingHpBps),
      scoreDisplay: `${bpsPercent(stats.savingHpBps)}점`,
      tone: 'green',
      emoji: '🦦',
      skillEmoji: '♥',
    },
    {
      animal: 'RABBIT',
      assetStem: 'consume',
      label: '투자 판단력',
      shortLabel: '투자 판단',
      characterName: '살펴토끼',
      meaning: '위험과 분산을 점검하는 힘',
      reportType: 'INVESTMENT_JUDGMENT',
      scorePercent: bpsPercent(stats.investmentJudgmentBps),
      scoreDisplay: `${bpsPercent(stats.investmentJudgmentBps)}점`,
      tone: 'blue',
      emoji: '🐰',
      skillEmoji: '◈',
    },
    {
      animal: 'BIRD',
      assetStem: 'mission',
      label: '퀘스트 XP',
      shortLabel: '퀘스트 XP',
      characterName: '해냄새',
      meaning: '작은 행동을 이어온 경험',
      reportType: 'QUEST_XP',
      scorePercent: clampPercent(stats.questXp),
      scoreDisplay: `${stats.questXp} XP`,
      tone: 'purple',
      emoji: '🐦',
      skillEmoji: '✦',
    },
  ]
}

export function toHomeBattleView(
  home: Schema['HomeView'],
  reward: { pointBalance: number; nextCosmeticPrice: number | null },
): HomeBattleViewModel {
  const target = home.mainGoal?.targetAmountKrw ?? null
  const current = home.mainGoal?.currentAmountKrw ?? null
  const rewardProgressPercent = reward.nextCosmeticPrice && reward.nextCosmeticPrice > 0
    ? clampPercent((reward.pointBalance / reward.nextCosmeticPrice) * 100)
    : 0

  return {
    mode: home.mode,
    goalTitle: home.mainGoal?.title ?? null,
    goalCurrentAmountKrw: current,
    goalTargetAmountKrw: target,
    goalProgressPercent: home.raid ? bpsPercent(home.raid.currentProgressBps) : 0,
    stage: home.raid?.stage ?? null,
    bossName: home.mainGoal ? `${home.mainGoal.title} 수호자` : '목표를 기다리는 문',
    bossHpPercent: home.raid ? bpsPercent(home.raid.bossHpBps) : 100,
    raidStatus: home.raid?.status ?? null,
    party: fixedCharacters(home.financialStats),
    nextQuest: home.nextQuest ?? null,
    questXp: home.financialStats.questXp,
    pointBalance: reward.pointBalance,
    rewardProgressPercent,
    activeRoutineLabel: home.activeRoutineBuild?.steps[0] ?? null,
    dataState: home.dataState,
    lastSyncedAt: home.lastSyncedAt,
  }
}

const reportDefinition: Record<Schema['CharacterReportType'], {
  animal: Animal
  assetStem: CharacterAssetStem
  title: string
  meaning: string
  tone: CharacterTone
}> = {
  SPENDING_DEFENSE: { animal: 'BEAR', assetStem: 'invest', title: '소비 방어력', meaning: '예산 안에서 소비를 지키는 힘', tone: 'teal' },
  SAVING_HP: { animal: 'SEAL', assetStem: 'save', title: '저축 HP', meaning: '목표를 꾸준히 지키는 힘', tone: 'green' },
  INVESTMENT_JUDGMENT: { animal: 'RABBIT', assetStem: 'consume', title: '투자 판단력', meaning: '위험과 분산을 점검하는 힘', tone: 'blue' },
  QUEST_XP: { animal: 'BIRD', assetStem: 'mission', title: '퀘스트 XP', meaning: '작은 행동을 이어온 경험', tone: 'purple' },
}

export type CharacterReportViewModel = ReturnType<typeof toCharacterReportView>

export function toCharacterReportView(report: Schema['CharacterReport']) {
  const definition = reportDefinition[report.reportType]
  return {
    ...definition,
    scorePercent: bpsPercent(report.scoreBps),
    scoreDisplay: report.reportType === 'QUEST_XP' ? `${report.scoreBps / 100} XP` : `${bpsPercent(report.scoreBps)}점`,
    metrics: report.metrics.map((metric) => ({
      label: metric.label,
      value: metric.displayValue,
      reasonCopyKey: metric.reasonCopyKey,
    })),
    trend: report.trend30Days.map((point) => ({
      date: point.date,
      value: point.value,
      displayValue: report.reportType === 'QUEST_XP' ? `${point.value / 100} XP` : `${bpsPercent(point.value)}점`,
    })),
    nextQuestId: report.nextQuestId,
    dataState: report.dataState,
    lastSyncedAt: report.lastSyncedAt,
  }
}

export function toJourneyView(journey: Schema['DailyJourneyMonth']) {
  return {
    month: journey.month,
    recordedDayCount: journey.recordedDayCount,
    dayCount: journey.dayCount,
    moneySummary: journey.moneySummary,
    dataState: journey.dataState,
    lastSyncedAt: journey.lastSyncedAt,
    nodes: journey.nodes.map((node) => ({
      date: node.date,
      status: node.status,
      title: node.primaryActivity.title,
      amountKrw: node.primaryActivity.amountKrw,
      activityType: node.primaryActivity.activityType,
      secondaryActivityTypes: node.secondaryActivityTypes,
      hiddenActivityCount: node.hiddenActivityCount,
      detailAvailable: node.detailAvailable,
    })),
  }
}
