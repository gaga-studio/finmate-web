import type { components, paths } from './generated'
import { apiBaseUrl } from './runtime'

export type Schema = components['schemas']
export type OnboardingView = paths['/onboarding']['get']['responses'][200]['content']['application/json']
export type HomeResponse = paths['/home']['get']['responses'][200]['content']['application/json']
export type RaidView = paths['/raids/current']['get']['responses'][200]['content']['application/json']
export type MonthlyReport = paths['/reports/monthly']['get']['responses'][200]['content']['application/json']
export type MateGroupPage = paths['/mate/groups']['get']['responses'][200]['content']['application/json']
export type AdventurerPage = paths['/mate/groups/{groupId}/adventurers']['get']['responses'][200]['content']['application/json']
export type AdventurerRoutine = paths['/mate/groups/{groupId}/adventurers/{adventurerId}/routines/{routineId}']['get']['responses'][200]['content']['application/json']
export type RoutineAdaptationDraft = paths['/routine-adaptations']['post']['responses'][201]['content']['application/json']
export type RoutineAdaptationSet = paths['/routine-adaptations/{adaptationId}/choice']['put']['responses'][200]['content']['application/json']
export type ActiveRoutineBuild = paths['/routine-builds/active']['get']['responses'][200]['content']['application/json']
export type RoutineReplacement = paths['/routine-builds/active/replacement']['post']['responses'][200]['content']['application/json']
export type QuestPage = paths['/quests']['get']['responses'][200]['content']['application/json']
export type QuestCompletion = paths['/quests/{questId}/complete']['post']['responses'][200]['content']['application/json']
export type DailyRecordPage = paths['/records']['get']['responses'][200]['content']['application/json']
export type DailyRecord = paths['/records/{date}']['get']['responses'][200]['content']['application/json']
export type DemoTimeline = paths['/demo/timeline/advance']['post']['responses'][200]['content']['application/json']

type AuthSession = Schema['AuthSession']
type Problem = Schema['Problem']

const sessionStorageKey = 'finmate.auth-session'
let session: AuthSession | null = null

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
  session = nextSession
  if (typeof window !== 'undefined') window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(nextSession))
}

export function clearSession(): void {
  session = null
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(sessionStorageKey)
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
  return !path.startsWith('/auth/')
}

function needsIdempotencyKey(path: string, method: string): boolean {
  return method !== 'GET' && (
    path === '/onboarding'
    || path.includes('/candidates/')
    || path === '/routine-builds/active/replacement'
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
  method?: 'GET' | 'POST' | 'PUT'
  body?: object
  protected?: boolean
  retrying?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET'
  const protectedRequest = options.protected ?? isProtected(path)
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (protectedRequest && session?.accessToken) headers.Authorization = `Bearer ${session.accessToken}`
  if (needsIdempotencyKey(path, method)) headers['Idempotency-Key'] = crypto.randomUUID()

  const response = await fetch(requestUrl(path), {
    method,
    credentials: 'include',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (response.status === 401 && protectedRequest && !options.retrying) {
    const refreshed = await refreshSession()
    if (refreshed) return request<T>(path, { ...options, retrying: true })
  }

  if (!response.ok) throw new ApiError(response.status, await problemFrom(response))
  if (response.status === 204) return undefined as T
  const result = await response.json() as T
  if (isAuthSession(result)) saveSession(result)
  return result
}

export async function refreshSession(): Promise<AuthSession | null> {
  try {
    return await request<AuthSession>('/auth/refresh', { method: 'POST', protected: false })
  } catch {
    clearSession()
    return null
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path)
}

export async function apiRequest<T>(path: string, method: 'POST' | 'PUT', body?: object): Promise<T> {
  return request<T>(path, { method, body })
}

export async function apiLogout(): Promise<void> {
  try {
    await request<void>('/auth/logout', { method: 'POST' })
  } finally {
    clearSession()
  }
}
