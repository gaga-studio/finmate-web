import type { components, paths } from './generated'
import { apiBaseUrl } from './runtime'

export type Schema = components['schemas']
export type OnboardingView = paths['/onboarding']['get']['responses'][200]['content']['application/json']
export type UserGoal = paths['/goals']['post']['responses'][201]['content']['application/json']
export type HomeResponse = paths['/home']['get']['responses'][200]['content']['application/json']
export type RaidView = paths['/raids/current']['get']['responses'][200]['content']['application/json']
export type CharacterReport = paths['/reports/characters/{reportType}']['get']['responses'][200]['content']['application/json']
export type MonthlyReport = paths['/reports/monthly']['get']['responses'][200]['content']['application/json']
export type MateFriendOverview = paths['/mate/friends/overview']['get']['responses'][200]['content']['application/json']
export type MateFriendFeed = paths['/mate/friends/feed']['get']['responses'][200]['content']['application/json']
export type MateStreakPage = paths['/mate/friends/streaks']['get']['responses'][200]['content']['application/json']
export type MateGroupPage = paths['/mate/groups']['get']['responses'][200]['content']['application/json']
export type MateGroupReport = paths['/mate/groups/{groupId}/report']['get']['responses'][200]['content']['application/json']
export type AdventurerPage = paths['/mate/groups/{groupId}/adventurers']['get']['responses'][200]['content']['application/json']
export type Adventurer = paths['/mate/groups/{groupId}/adventurers/{adventurerId}']['get']['responses'][200]['content']['application/json']
export type AdventurerReport = paths['/mate/groups/{groupId}/adventurers/{adventurerId}/report']['get']['responses'][200]['content']['application/json']
export type AdventurerRoutine = paths['/mate/groups/{groupId}/adventurers/{adventurerId}/routines/{routineId}']['get']['responses'][200]['content']['application/json']
export type RoutineRecommendation = paths['/routine-adaptations']['post']['responses'][201]['content']['application/json']
export type ActiveRoutineBuild = paths['/routine-builds/active']['get']['responses'][200]['content']['application/json']
export type RoutineReplacement = paths['/routine-builds/active/replacement']['post']['responses'][200]['content']['application/json']
export type HanaProductInfo = paths['/hana-products/{productId}']['get']['responses'][200]['content']['application/json']
export type QuestPage = paths['/quests']['get']['responses'][200]['content']['application/json']
export type Quest = paths['/quests/{questId}']['get']['responses'][200]['content']['application/json']
export type QuestAcceptance = paths['/quests/{questId}/accept']['post']['responses'][200]['content']['application/json']
export type QuestCompletion = paths['/quests/{questId}/complete']['post']['responses'][200]['content']['application/json']
export type DailyRecordPage = paths['/records']['get']['responses'][200]['content']['application/json']
export type DailyJourneyMonth = paths['/records/journey']['get']['responses'][200]['content']['application/json']
export type DailyRecord = paths['/records/{date}']['get']['responses'][200]['content']['application/json']
export type PointLedger = paths['/rewards/points']['get']['responses'][200]['content']['application/json']
export type CosmeticCatalog = paths['/rewards/cosmetics']['get']['responses'][200]['content']['application/json']
export type DisclosureConsent = paths['/me/disclosures']['get']['responses'][200]['content']['application/json']
export type DisclosurePreview = paths['/me/disclosures/preview']['post']['responses'][200]['content']['application/json']
export type DemoTimeline = paths['/demo/timeline/advance']['post']['responses'][200]['content']['application/json']

type AuthSession = Schema['AuthSession']
type Problem = Schema['Problem']

const sessionStorageKey = 'finmate.auth-session'
export const sessionChangedEvent = 'finmate:session-changed'
let session: AuthSession | null = null
let refreshInFlight: Promise<AuthSession | null> | null = null
const commandKeys = new Map<string, string>()

function restoreStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  const stored = window.sessionStorage.getItem(sessionStorageKey)
  if (!stored) return null
  try {
    return JSON.parse(stored) as AuthSession
  } catch {
    window.sessionStorage.removeItem(sessionStorageKey)
    return null
  }
}

session = restoreStoredSession()

export function currentSession(): AuthSession | null {
  return session
}

export function saveSession(nextSession: AuthSession): void {
  const previousUserId = session?.user.userId
  session = nextSession
  if (typeof window !== 'undefined') window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(nextSession))
  if (typeof window !== 'undefined' && previousUserId !== nextSession.user.userId) {
    commandKeys.clear()
    window.dispatchEvent(new Event(sessionChangedEvent))
  }
}

export function clearSession(): void {
  const hadSession = session !== null
  session = null
  commandKeys.clear()
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(sessionStorageKey)
  if (typeof window !== 'undefined' && hadSession) window.dispatchEvent(new Event(sessionChangedEvent))
}

export class ApiError extends Error {
  readonly status: number
  readonly problem: Problem | undefined

  constructor(status: number, problem?: Problem) {
    super(problem?.detail ?? `Request failed: ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }

  get code(): Problem['code'] | undefined {
    return this.problem?.code
  }
}

function requestUrl(path: string): string {
  return `${apiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
}

function isProtected(path: string): boolean {
  return !['/auth/signup', '/auth/login', '/auth/refresh'].includes(path)
}

function needsIdempotencyKey(path: string, method: string): boolean {
  return method !== 'GET' && (
    path === '/onboarding'
    || path === '/goals'
    || path.includes('/candidates/')
    || path === '/routine-builds/active/replacement'
    || path.endsWith('/accept')
    || path.endsWith('/complete')
    || path === '/demo/timeline/advance'
  )
}

async function problemFrom(response: Response): Promise<Problem | undefined> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('json')) return undefined
  try {
    return await response.json() as Problem
  } catch {
    return undefined
  }
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false
  return 'accessToken' in value && 'user' in value
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: object
  protected?: boolean
  retrying?: boolean
  idempotencyKey?: string
  commandFingerprint?: string
}

function commandFingerprint(path: string, method: string, body: object | undefined): string {
  return `${session?.user.userId ?? 'anonymous'}:${method}:${path}:${JSON.stringify(body ?? null)}`
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET'
  const protectedRequest = options.protected ?? isProtected(path)
  const fingerprint = needsIdempotencyKey(path, method)
    ? options.commandFingerprint ?? commandFingerprint(path, method, options.body)
    : undefined
  const idempotencyKey = fingerprint
    ? options.idempotencyKey ?? commandKeys.get(fingerprint) ?? crypto.randomUUID()
    : undefined
  if (fingerprint && idempotencyKey) commandKeys.set(fingerprint, idempotencyKey)
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (protectedRequest && session?.accessToken) headers.Authorization = `Bearer ${session.accessToken}`
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey

  const response = await fetch(requestUrl(path), {
    method,
    credentials: 'include',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (response.status === 401 && protectedRequest && !options.retrying) {
    const refreshed = await refreshSession()
    if (refreshed) return request<T>(path, { ...options, retrying: true, idempotencyKey, commandFingerprint: fingerprint })
  }

  if (!response.ok) {
    if (fingerprint && response.status < 500) commandKeys.delete(fingerprint)
    throw new ApiError(response.status, await problemFrom(response))
  }
  if (response.status === 204) {
    if (fingerprint) commandKeys.delete(fingerprint)
    return undefined as T
  }
  const result = await response.json() as T
  if (fingerprint) commandKeys.delete(fingerprint)
  if (isAuthSession(result)) saveSession(result)
  return result
}

export async function refreshSession(): Promise<AuthSession | null> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    try {
      return await request<AuthSession>('/auth/refresh', { method: 'POST', protected: false })
    } catch {
      clearSession()
      return null
    } finally {
      refreshInFlight = null
    }
  })()
  return refreshInFlight
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path)
}

export async function apiRequest<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: object, idempotencyKey?: string): Promise<T> {
  return request<T>(path, { method, body, idempotencyKey })
}

export async function apiLogout(): Promise<void> {
  await request<void>('/auth/logout', { method: 'POST' })
  clearSession()
}
