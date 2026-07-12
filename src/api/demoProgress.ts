const prefix = 'finmate.demo-expected-stage.'

export function getDemoExpectedStage(goalId: string): number {
  if (typeof window === 'undefined') return 0
  const value = Number(window.sessionStorage.getItem(`${prefix}${goalId}`))
  return Number.isInteger(value) && value >= 0 && value <= 3 ? value : 0
}

export function saveDemoExpectedStage(goalId: string, stage: number): void {
  if (typeof window !== 'undefined') window.sessionStorage.setItem(`${prefix}${goalId}`, String(stage))
}
