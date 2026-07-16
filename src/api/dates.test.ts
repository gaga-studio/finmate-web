import { afterEach, describe, expect, it, vi } from 'vitest'
import { currentSeoulMonth, monthDateRange } from './dates'

describe('Seoul date helpers', () => {
  afterEach(() => vi.useRealTimers())

  it('uses the Seoul calendar month at UTC boundaries', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-31T15:30:00Z'))

    expect(currentSeoulMonth()).toBe('2026-09')
    expect(monthDateRange('2026-09')).toEqual({ from: '2026-09-01', to: '2026-09-30' })
  })

  it('calculates leap-year month boundaries', () => {
    expect(monthDateRange('2028-02')).toEqual({ from: '2028-02-01', to: '2028-02-29' })
  })
})
