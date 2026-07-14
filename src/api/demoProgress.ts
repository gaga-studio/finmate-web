const prefix = 'finmate.demo-expected-frame.'

export function getDemoExpectedFrameIndex(goalId: string): number {
  if (typeof window === 'undefined') return 0
  const value = Number(window.sessionStorage.getItem(`${prefix}${goalId}`))
  return Number.isInteger(value) && value >= 0 && value <= 6 ? value : 0
}

export function saveDemoExpectedFrameIndex(goalId: string, frameIndex: number): void {
  if (typeof window !== 'undefined') window.sessionStorage.setItem(`${prefix}${goalId}`, String(frameIndex))
}
