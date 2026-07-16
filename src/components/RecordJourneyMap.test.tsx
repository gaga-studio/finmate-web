import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Schema } from '../api/client'
import { RecordJourneyMap } from './RecordJourneyMap'

describe('RecordJourneyMap', () => {
  it('renders a day without a primary financial activity', () => {
    const journey = {
      month: '2026-07',
      recordedDayCount: 0,
      dayCount: 31,
      moneySummary: { incomeKrw: 0, expenseKrw: 0, savingKrw: 0 },
      nodes: [
        {
          date: '2026-07-12',
          status: 'TODAY',
          primaryActivity: null,
          secondaryActivityTypes: [],
          hiddenActivityCount: 0,
          detailAvailable: false,
        },
      ],
      calculationVersion: 'records-v1',
      dataState: 'FRESH',
      lastSyncedAt: '2026-07-11T09:00:00+09:00',
    } satisfies Schema['DailyJourneyMonth']

    render(
      <RecordJourneyMap
        journey={journey}
        pointBalance={0}
        onChangeMonth={vi.fn()}
        onSelectDate={vi.fn()}
      />,
    )

    expect(screen.getByText('12일')).toBeInTheDocument()
    expect(screen.getByText('기록 예정')).toBeInTheDocument()
  })
})
