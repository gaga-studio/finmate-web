import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiGet, apiLogout, apiRequest, clearSession, currentSession, saveSession } from './client'
import { apiBaseUrl, isMockMode } from './runtime'

const problem = {
  type: 'https://finmate.example/problems/unauthorized',
  title: 'Unauthorized',
  status: 401,
  detail: 'The access token expired.',
  instance: '/api/v1/home',
  code: 'UNAUTHORIZED',
  traceId: 'trace-401',
}

describe('authenticated API requests', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    clearSession()
  })

  it('refreshes the cookie session once after a protected request receives 401 and retries with the new bearer token', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(problem), { status: 401, headers: { 'Content-Type': 'application/problem+json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ accessToken: 'renewed-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiGet<{ ok: boolean }>('/home')).resolves.toEqual({ ok: true })

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock.mock.calls[0][0]).toContain('/api/v1/home')
    expect(fetchMock.mock.calls[1][0]).toContain('/api/v1/auth/refresh')
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ credentials: 'include' })
    expect(fetchMock.mock.calls[2][1]).toMatchObject({ headers: expect.objectContaining({ Authorization: 'Bearer renewed-token' }) })
  })

  it('shares one refresh rotation across concurrent protected requests', async () => {
    saveSession({ accessToken: 'expired-token', tokenType: 'Bearer', expiresAt: '2026-07-13T11:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } })
    let protectedCalls = 0
    let refreshCalls = 0
    const renewedSession = { accessToken: 'renewed-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } }
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/auth/refresh')) {
        refreshCalls += 1
        await Promise.resolve()
        return new Response(JSON.stringify(renewedSession), { status: 200 })
      }
      protectedCalls += 1
      if (protectedCalls <= 2) return new Response(JSON.stringify(problem), { status: 401, headers: { 'Content-Type': 'application/problem+json' } })
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(Promise.all([apiGet<{ ok: boolean }>('/home'), apiGet<{ ok: boolean }>('/raids/current')]))
      .resolves.toEqual([{ ok: true }, { ok: true }])

    expect(refreshCalls).toBe(1)
  })

  it('reuses an idempotency key for the authenticated retry of one command', async () => {
    saveSession({ accessToken: 'expired-token', tokenType: 'Bearer', expiresAt: '2026-07-13T11:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } })
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(problem), { status: 401, headers: { 'Content-Type': 'application/problem+json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ accessToken: 'renewed-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ currentFrameIndex: 0 }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/demo/timeline/advance', 'POST', { fixtureId: 'EUROPE_TRAVEL_JANUARY', expectedFrameIndex: 0 })

    expect(fetchMock.mock.calls[0][1].headers['Idempotency-Key']).toBe(fetchMock.mock.calls[2][1].headers['Idempotency-Key'])
  })

  it('retains the command key after an ambiguous network failure', async () => {
    saveSession({ accessToken: 'active-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } })
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new TypeError('network interrupted'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ currentFrameIndex: 0 }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const body = { fixtureId: 'EUROPE_TRAVEL_JANUARY', expectedFrameIndex: 0 }

    await expect(apiRequest('/demo/timeline/advance', 'POST', body)).rejects.toThrow('network interrupted')
    await expect(apiRequest('/demo/timeline/advance', 'POST', body)).resolves.toEqual({ currentFrameIndex: 0 })

    expect(fetchMock.mock.calls[0][1].headers['Idempotency-Key']).toBe(fetchMock.mock.calls[1][1].headers['Idempotency-Key'])
  })

  it('retains the command key when a successful response body is interrupted', async () => {
    saveSession({ accessToken: 'active-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } })
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('{"stage":', { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ currentFrameIndex: 0 }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const body = { fixtureId: 'EUROPE_TRAVEL_JANUARY', expectedFrameIndex: 0 }

    await expect(apiRequest('/demo/timeline/advance', 'POST', body)).rejects.toThrow()
    await expect(apiRequest('/demo/timeline/advance', 'POST', body)).resolves.toEqual({ currentFrameIndex: 0 })

    expect(fetchMock.mock.calls[0][1].headers['Idempotency-Key']).toBe(fetchMock.mock.calls[1][1].headers['Idempotency-Key'])
  })

  it('adds idempotency keys to goal confirmation, quest acceptance, and routine import commands', async () => {
    saveSession({ accessToken: 'active-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } })
    const fetchMock = vi.fn().mockImplementation(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/goals', 'POST', { goal: { title: '유럽여행경비' }, confirm: true })
    await apiRequest('/quests/quest-saving-capacity/accept', 'POST')
    await apiRequest('/routine-adaptations/adapt-payday-save/candidates/candidate-standard/import', 'POST')

    expect(fetchMock).toHaveBeenCalledTimes(3)
    for (const [, options] of fetchMock.mock.calls) {
      expect(options.headers['Idempotency-Key']).toEqual(expect.any(String))
    }
  })

  it('sends the generated signup request shape including displayName', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ accessToken: 'access-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'NOT_STARTED' } }), { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/auth/signup', 'POST', { displayName: '민지', email: 'minji@example.com', password: 'finmate12345' })

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ displayName: '민지', email: 'minji@example.com', password: 'finmate12345' })
  })

  it('authenticates logout so the server can revoke the refresh session', async () => {
    saveSession({ accessToken: 'active-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } })
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    await apiLogout()

    expect(fetchMock.mock.calls[0][0]).toContain('/api/v1/auth/logout')
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ headers: expect.objectContaining({ Authorization: 'Bearer active-token' }) })
  })

  it('keeps the authenticated session available when server-side logout fails', async () => {
    saveSession({ accessToken: 'active-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' } })
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network interrupted')))

    await expect(apiLogout()).rejects.toThrow('network interrupted')

    expect(currentSession()?.accessToken).toBe('active-token')
  })

  it('announces only account-boundary session changes', () => {
    const listener = vi.fn()
    window.addEventListener('finmate:session-changed', listener)
    const user = { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'COMPLETED' as const }

    saveSession({ accessToken: 'first-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user })
    saveSession({ accessToken: 'refreshed-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:15:00Z', user })
    saveSession({ accessToken: 'other-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:30:00Z', user: { ...user, userId: '2a7ef1ab-bfe8-4ff8-b884-61e1028a5c32', email: 'other@example.com' } })

    expect(listener).toHaveBeenCalledTimes(2)
    window.removeEventListener('finmate:session-changed', listener)
  })
})

describe('API runtime selection', () => {
  it('enables the mock path only for the literal true toggle', () => {
    expect(isMockMode('true')).toBe(true)
    expect(isMockMode('false')).toBe(false)
    expect(isMockMode(undefined)).toBe(false)
    expect(apiBaseUrl()).toBe('/api/v1')
  })
})
