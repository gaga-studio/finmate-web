import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import { apiGet, type HomeResponse, type Schema } from './api/client'

function renderApp(initialEntry = '/signup') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('FinMate representative flow', () => {
  it('starts signup and advances into six-step onboarding', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByLabelText('이메일'), 'minji@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'finmate1234')
    await user.click(screen.getByRole('button', { name: '시작하기' }))

    expect(await screen.findByText('금융 습관을 알아볼게요')).toBeInTheDocument()
    expect(screen.getByText('1 / 6')).toBeInTheDocument()
  })

  it('persists a confirmed routine replacement while preserving the active main goal', async () => {
    const user = userEvent.setup()
    renderApp('/mates/group/savers')

    await user.click(await screen.findByRole('link', { name: /북쪽의 모험가/ }))
    await user.click(await screen.findByRole('link', { name: '루틴을 내 생활에 맞추기' }))
    await user.click(await screen.findByRole('button', { name: 'STANDARD 후보 선택' }))
    await user.click(await screen.findByRole('button', { name: 'STANDARD · 주 3회 저축 챌린지' }))
    await user.click(screen.getByRole('button', { name: '이 루틴으로 바꾸기' }))
    expect(screen.getByRole('dialog', { name: '루틴 변경 확인' })).toBeInTheDocument()
    expect(screen.getByText('여행 목표는 그대로 유지돼요.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '교체 확정' }))
    expect(await screen.findByRole('heading', { name: '활성 루틴이 바뀌었어요' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '홈' }))
    expect(await screen.findByText('현재 루틴: 월요일 저축 확인')).toBeInTheDocument()
    expect(screen.getByText('유럽 여행')).toBeInTheDocument()
    expect(screen.getByText('2,000,000 KRW')).toBeInTheDocument()
  })

  it('resolves the mate group from the route parameter', async () => {
    renderApp('/mates/group/budget')

    expect(await screen.findByRole('heading', { name: '생활비 탐험대' })).toBeInTheDocument()
  })

  it('rejects an unconfirmed routine replacement without mutating the active build', async () => {
    const before = await apiGet<Schema['ActiveRoutineBuild']>('/routine-builds/active')
    for (const body of [{ adaptationId: 'adaptation-europe', candidateId: 'candidate-standard' }, { confirmReplacement: false }, null]) {
      const response = await fetch('/api/v1/routine-builds/active/replacement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      expect(response.status).toBe(422)
    }

    expect(await apiGet<Schema['ActiveRoutineBuild']>('/routine-builds/active')).toEqual(before)
  })

  it('returns 201 for signup and advances the global demo projection to completed stage 3', async () => {
    const signup = await fetch('/api/v1/auth/signup', { method: 'POST' })
    expect(signup.status).toBe(201)

    expect((await apiGet<HomeResponse>('/home')).raid.stage).toBe(1)
    await fetch('/api/v1/demo/timeline/advance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fixtureId: 'EUROPE_TRAVEL_JANUARY', expectedStage: 2 }) })
    const completedHome = await apiGet<HomeResponse>('/home')

    expect(completedHome.mainGoal.state).toBe('COMPLETED')
    expect(completedHome.raid.stage).toBe(3)
  })
})
