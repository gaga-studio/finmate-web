import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Schema } from '../api/client'
import { RecordJourneyMap } from './RecordJourneyMap'

const journeyWithPlannedDay: Schema['DailyJourneyMonth'] = {
  month: '2026-07',
  recordedDayCount: 0,
  dayCount: 31,
  moneySummary: { incomeKrw: 0, expenseKrw: 0, savingKrw: 0 },
  nodes: [
    {
      date: '2026-07-12',
      status: 'PLANNED',
      primaryActivity: {
        activityId: 'planned-12',
        activityType: 'QUEST',
        title: '기록 예정',
        occurredAt: '2026-07-11T09:00:00+09:00',
        primary: true,
        categoryLabels: ['잠김'],
      },
      secondaryActivityTypes: [],
      hiddenActivityCount: 0,
      detailAvailable: false,
    },
  ],
  calculationVersion: 'journey-calc-v1',
  dataState: 'FRESH',
  lastSyncedAt: '2026-07-11T09:00:00+09:00',
}

const renderMap = (onAdvanceDemo?: () => void) => render(
  <RecordJourneyMap
    journey={journeyWithPlannedDay}
    pointBalance={0}
    onChangeMonth={vi.fn()}
    onSelectDate={vi.fn()}
    {...(onAdvanceDemo ? { onAdvanceDemo } : {})}
  />,
)

describe('RecordJourneyMap', () => {
  it('renders a planned day with the placeholder activity', () => {
    const { container } = renderMap()

    expect(screen.getByText('12일')).toBeInTheDocument()
    expect(screen.getByText('기록 예정')).toBeInTheDocument()
    expect(container.querySelector('.roadmap-stage')).not.toBeNull()
    expect(container.querySelector('.roadmap-stone.is-planned')).not.toBeNull()
  })

  it('shows the demo advance control only when the handler is provided', () => {
    const { unmount } = renderMap()
    expect(screen.queryByRole('button', { name: '시연 시간 진행' })).toBeNull()
    unmount()

    const onAdvanceDemo = vi.fn()
    renderMap(onAdvanceDemo)
    screen.getByRole('button', { name: '시연 시간 진행' }).click()
    expect(onAdvanceDemo).toHaveBeenCalledTimes(1)
  })
})
