import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '../mocks/server'
import { resetMockState } from '../mocks/handlers'
import { clearOnboardingDraft } from '../api/onboardingDraft'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => { server.resetHandlers(); resetMockState(); clearOnboardingDraft() })
afterAll(() => server.close())
