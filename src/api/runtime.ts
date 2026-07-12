export function isMockMode(value = import.meta.env.VITE_USE_MOCKS): boolean {
  return value === 'true'
}

export function apiBaseUrl(): string {
  if (isMockMode() || import.meta.env.MODE === 'test') return '/api/v1'

  const origin = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '')
  return `${origin.replace(/\/api\/v1$/, '')}/api/v1`
}
