import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiGet, apiRequest, clearSession } from './client'
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

  it('sends the generated signup request shape including displayName', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ accessToken: 'access-token', tokenType: 'Bearer', expiresAt: '2026-07-13T12:00:00Z', user: { userId: '7ac43790-7c8d-4e52-a031-1d6f0a527f89', email: 'minji@example.com', displayName: '민지', onboardingStatus: 'NOT_STARTED' } }), { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/auth/signup', 'POST', { displayName: '민지', email: 'minji@example.com', password: 'finmate12345' })

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ displayName: '민지', email: 'minji@example.com', password: 'finmate12345' })
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
