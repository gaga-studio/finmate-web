import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { currentSession, sessionChangedEvent } from './api/client'
import { clearOnboardingDraft } from './api/onboardingDraft'
import { isMockMode } from './api/runtime'
import './design-v2/index.css'
import './design-v2/App.css'
import './design-v2/home.css'
import './design-v2/mate.css'
import './design-v2/quest.css'
import './design-v2/detailedProfile.css'
import './design-v2/signature.css'
import App from './App.tsx'

async function enableMocking() {
  if (import.meta.env.MODE === 'test' || !isMockMode()) return
  const { worker } = await import('./mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 30_000 } } })
window.addEventListener(sessionChangedEvent, () => {
  queryClient.clear()
  clearOnboardingDraft()
  if (!currentSession() && !['/login', '/signup'].includes(window.location.pathname)) window.location.replace('/login')
})

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter><App /></BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  )
})
