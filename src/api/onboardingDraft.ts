import type { components } from './generated'

type Schema = components['schemas']

export type OnboardingDraft = {
  answers: Record<number, string>
  mainGoal: Schema['UserGoalDraft']
}

const storageKey = 'finmate.onboarding-draft'
const defaultDraft: OnboardingDraft = {
  answers: {},
  mainGoal: {
    title: '유럽 여행 자금',
    domain: 'SAVING',
    currentAmountKrw: 2000000,
    targetAmountKrw: 5000000,
    targetMonth: '2027-01',
  },
}

function cloneDefaultDraft(): OnboardingDraft {
  return { answers: {}, mainGoal: { ...defaultDraft.mainGoal } }
}

export function getOnboardingDraft(): OnboardingDraft {
  if (typeof window === 'undefined') return cloneDefaultDraft()
  const stored = window.sessionStorage.getItem(storageKey)
  if (!stored) return cloneDefaultDraft()

  try {
    const draft = JSON.parse(stored) as Partial<OnboardingDraft>
    if (!draft.mainGoal) return cloneDefaultDraft()
    return { answers: draft.answers ?? {}, mainGoal: { ...defaultDraft.mainGoal, ...draft.mainGoal } }
  } catch {
    return cloneDefaultDraft()
  }
}

export function saveOnboardingDraft(draft: OnboardingDraft): OnboardingDraft {
  if (typeof window !== 'undefined') window.sessionStorage.setItem(storageKey, JSON.stringify(draft))
  return draft
}

export function saveOnboardingAnswer(step: number, answer: string): OnboardingDraft {
  const draft = getOnboardingDraft()
  return saveOnboardingDraft({ ...draft, answers: { ...draft.answers, [step]: answer } })
}

export function saveGoalDraft(mainGoal: Schema['UserGoalDraft']): OnboardingDraft {
  return saveOnboardingDraft({ ...getOnboardingDraft(), mainGoal })
}

export function clearOnboardingDraft(): void {
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(storageKey)
}
