import type { components, paths } from './generated'

export type Schema = components['schemas']
export type OnboardingView = paths['/onboarding']['get']['responses'][200]['content']['application/json']
export type HomeResponse = paths['/home']['get']['responses'][200]['content']['application/json']
export type MonthlyReport = paths['/reports/monthly']['get']['responses'][200]['content']['application/json']
export type MateGroupPage = paths['/mate/groups']['get']['responses'][200]['content']['application/json']
export type AdventurerPage = paths['/mate/groups/{groupId}/adventurers']['get']['responses'][200]['content']['application/json']
export type AdventurerRoutine = paths['/mate/groups/{groupId}/adventurers/{adventurerId}/routines/{routineId}']['get']['responses'][200]['content']['application/json']
export type RoutineAdaptationDraft = paths['/routine-adaptations']['post']['responses'][201]['content']['application/json']
export type RoutineAdaptationSet = paths['/routine-adaptations/{adaptationId}/choice']['put']['responses'][200]['content']['application/json']
export type ActiveRoutineBuild = paths['/routine-builds/active']['get']['responses'][200]['content']['application/json']
export type RoutineReplacement = paths['/routine-builds/active/replacement']['post']['responses'][200]['content']['application/json']
export type QuestPage = paths['/quests']['get']['responses'][200]['content']['application/json']
export type DailyRecordPage = paths['/records']['get']['responses'][200]['content']['application/json']
export type DemoTimeline = paths['/demo/timeline/advance']['post']['responses'][200]['content']['application/json']

const apiBase = '/api/v1'

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json() as Promise<T>
}

export async function apiRequest<T>(path: string, method: 'POST' | 'PUT', body: object): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json() as Promise<T>
}
