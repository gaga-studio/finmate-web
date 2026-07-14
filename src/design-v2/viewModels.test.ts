import { describe, expect, it } from 'vitest'
import type { Schema } from '../api/client'
import { toHomeBattleView, toCharacterReportView, toJourneyView } from './viewModels'

const home: Schema['HomeView'] = {
  mode: 'GOAL_ACTIVE',
  totalAssetsKrw: 4_280_000,
  mainGoal: {
    goalId: 'goal-europe',
    title: '유럽 여행 자금',
    domain: 'SAVING',
    currentAmountKrw: 2_000_000,
    targetAmountKrw: 5_000_000,
    targetMonth: '2027-01',
    state: 'ACTIVE',
    confirmedAt: '2026-07-13T09:00:00+09:00',
    calculationVersion: 'goal-v1',
    dataState: 'FRESH',
    lastSyncedAt: '2026-07-13T09:00:00+09:00',
  },
  raid: {
    raidId: 'raid-europe',
    goalId: 'goal-europe',
    stage: 2,
    bossHpBps: 5_800,
    currentProgressBps: 4_200,
    highestProgressBps: 4_200,
    status: 'ACTIVE',
    financialStats: {
      spendingDefenseBps: 5_200,
      savingHpBps: 1_800,
      investmentJudgmentBps: 4_000,
      questXp: 72,
    },
    coachCopyKey: 'RAID_KEEP_GOING',
    calculationVersion: 'raid-v1',
    dataState: 'FRESH',
    lastSyncedAt: '2026-07-13T09:00:00+09:00',
  },
  financialStats: {
    spendingDefenseBps: 5_200,
    savingHpBps: 1_800,
    investmentJudgmentBps: 4_000,
    questXp: 72,
  },
  nextQuest: {
    questId: 'quest-saving',
    title: '이번 달 저축 가능액 확인하기',
    status: 'AVAILABLE',
    verificationKind: 'BEHAVIOR',
    currentValue: 0,
    targetValue: 1,
    unit: 'COUNT',
    durationLabel: '오늘',
    xpReward: 80,
    pointReward: 20,
    financialStatsChanged: false,
    calculationVersion: 'quest-v1',
    dataState: 'FRESH',
    lastSyncedAt: '2026-07-13T09:00:00+09:00',
  },
  lockedActions: [],
  calculationVersion: 'home-v1',
  dataState: 'FRESH',
  lastSyncedAt: '2026-07-13T09:00:00+09:00',
}

describe('frontend-v2 view model adapters', () => {
  it('maps API-owned raid and financial stats to the four fixed character roles', () => {
    const view = toHomeBattleView(home, { pointBalance: 140, nextCosmeticPrice: 200 })

    expect(view.goalTitle).toBe('유럽 여행 자금')
    expect(view.bossHpPercent).toBe(58)
    expect(view.party.map(({ animal, label, scorePercent }) => [animal, label, scorePercent])).toEqual([
      ['BEAR', '소비 방어력', 52],
      ['SEAL', '저축 HP', 18],
      ['RABBIT', '투자 판단력', 40],
      ['BIRD', '퀘스트 XP', 72],
    ])
    expect(view.rewardProgressPercent).toBe(70)
    expect(view.nextQuest?.title).toBe('이번 달 저축 가능액 확인하기')
  })

  it('keeps character report metrics and reasons API-owned', () => {
    const report: Schema['CharacterReport'] = {
      reportType: 'SAVING_HP',
      characterName: 'SEAL',
      scoreBps: 6_300,
      metrics: [{ label: '저축률', displayValue: '18%', reasonCopyKey: 'SAVING_RATE_REASON' }],
      trend30Days: [{ date: '2026-07-01', value: 5_500 }, { date: '2026-07-13', value: 6_300 }],
      nextQuestId: 'quest-saving',
      calculationVersion: 'report-v1',
      dataState: 'FRESH',
      lastSyncedAt: '2026-07-13T09:00:00+09:00',
    }

    expect(toCharacterReportView(report)).toMatchObject({
      animal: 'SEAL',
      title: '저축 HP',
      scorePercent: 63,
      metrics: [{ label: '저축률', value: '18%', reasonCopyKey: 'SAVING_RATE_REASON' }],
    })
  })

  it('preserves API journey order and does not synthesize missing financial activities', () => {
    const journey: Schema['DailyJourneyMonth'] = {
      month: '2026-07',
      recordedDayCount: 2,
      dayCount: 31,
      moneySummary: { incomeKrw: 2_800_000, expenseKrw: 19_600, savingKrw: 100_000 },
      nodes: [
        {
          date: '2026-07-10',
          status: 'RECORDED',
          primaryActivity: { activityId: 'saving', activityType: 'SAVING', title: '비상금 자동저축', amountKrw: 100_000, occurredAt: '2026-07-10T09:00:00+09:00', primary: true },
          secondaryActivityTypes: ['EXPENSE'],
          hiddenActivityCount: 0,
          detailAvailable: true,
        },
        {
          date: '2026-07-11',
          status: 'TODAY',
          primaryActivity: { activityId: 'income', activityType: 'INCOME', title: '월급 입금', amountKrw: 2_800_000, occurredAt: '2026-07-11T09:00:00+09:00', primary: true },
          secondaryActivityTypes: ['SAVING', 'INVESTMENT'],
          hiddenActivityCount: 2,
          detailAvailable: true,
        },
      ],
      calculationVersion: 'journey-v1',
      dataState: 'FRESH',
      lastSyncedAt: '2026-07-13T09:00:00+09:00',
    }

    expect(toJourneyView(journey).nodes.map((node) => node.date)).toEqual(['2026-07-10', '2026-07-11'])
    expect(toJourneyView(journey).nodes[1]).toMatchObject({ title: '월급 입금', hiddenActivityCount: 2 })
  })
})
