import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import App from './App'
import { apiGet, apiRequest, type HomeResponse, type Schema } from './api/client'
import { server } from './mocks/server'

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

    await user.type(screen.getByLabelText('이름'), '민지')
    await user.type(screen.getByLabelText('이메일'), 'minji@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'finmate12345')
    await user.click(screen.getByRole('button', { name: '시작하기' }))

    expect(await screen.findByText('금융 습관을 알아볼게요')).toBeInTheDocument()
    expect(screen.getByText('1 / 6')).toBeInTheDocument()
  })

  it('retains onboarding choices locally and opens an editable Europe travel goal draft', async () => {
    const user = userEvent.setup()
    renderApp('/onboarding/1')

    const choice = screen.getByRole('button', { name: '자동저축부터 만들고 싶어요' })
    await user.click(choice)
    expect(choice).toHaveAttribute('aria-pressed', 'true')

    for (let step = 0; step < 5; step += 1) await user.click(screen.getByRole('button', { name: '다음' }))
    await user.click(screen.getByRole('button', { name: '여행 목표 보기' }))

    expect(await screen.findByLabelText('목표 이름')).toHaveValue('유럽 여행 자금')
    expect(screen.getByLabelText('목표 금액')).toHaveValue(5000000)
  })

  it('completes onboarding in explore mode before confirming the goal with a separate command', async () => {
    const user = userEvent.setup()
    const requests: string[] = []
    server.use(
      http.get('/api/v1/onboarding', () => HttpResponse.json({ status: 'IN_PROGRESS', onboardingState: 'EXPLORE_ONLY', baseline: { disposableIncomeKrw: 1100000, spendingRateBps: 5200, savingRateBps: 1800, investmentJudgmentBps: 4000 }, calculationVersion: 'baseline-calc-v2', dataState: 'INSUFFICIENT' })),
      http.put('/api/v1/onboarding', async ({ request }) => {
        requests.push('onboarding')
        expect(await request.json()).toMatchObject({ finishMode: 'EXPLORE_ONLY' })
        return HttpResponse.json({ status: 'COMPLETED', onboardingState: 'EXPLORE_ONLY', displayName: '민지', context: { incomeRegularity: 'REGULAR', housingType: 'RENT', fixedCostBurden: 'MEDIUM' }, baseline: { disposableIncomeKrw: 1100000, spendingRateBps: 5200, savingRateBps: 1800, investmentJudgmentBps: 4000 }, calculationVersion: 'baseline-calc-v2', dataState: 'FRESH', lastSyncedAt: '2026-07-13T09:00:00+09:00' })
      }),
      http.post('/api/v1/goals', async ({ request }) => {
        requests.push('goal')
        expect(await request.json()).toMatchObject({ goal: { title: '유럽 여행 자금' }, confirm: true })
        return HttpResponse.json({ goalId: 'goal-europe-2027', title: '유럽 여행 자금', domain: 'SAVING', currentAmountKrw: 2000000, targetAmountKrw: 5000000, targetMonth: '2027-01', state: 'ACTIVE', confirmedAt: '2026-07-13T09:10:00+09:00', calculationVersion: 'goal-calc-v2', dataState: 'FRESH', lastSyncedAt: '2026-07-13T09:00:00+09:00' }, { status: 201 })
      }),
    )
    renderApp('/goal/confirm')

    await user.click(await screen.findByRole('button', { name: '유럽 여행 자금 목표 만들기' }))

    expect(await screen.findByRole('heading', { name: '여행까지 한 걸음' })).toBeInTheDocument()
    expect(requests).toEqual(['onboarding', 'goal'])
  })

  it('lets an explore-only user confirm a goal later without repeating onboarding', async () => {
    const user = userEvent.setup()
    let completed = false
    let onboardingWrites = 0
    let goalWrites = 0
    server.use(
      http.get('/api/v1/onboarding', () => HttpResponse.json(completed
        ? { status: 'COMPLETED', onboardingState: 'EXPLORE_ONLY', displayName: '민지', context: { incomeRegularity: 'REGULAR', housingType: 'RENT', fixedCostBurden: 'MEDIUM' }, baseline: { disposableIncomeKrw: 1100000, spendingRateBps: 5200, savingRateBps: 1800, investmentJudgmentBps: 4000 }, calculationVersion: 'baseline-calc-v2', dataState: 'FRESH', lastSyncedAt: '2026-07-13T09:00:00+09:00' }
        : { status: 'IN_PROGRESS', onboardingState: 'EXPLORE_ONLY', baseline: { disposableIncomeKrw: 1100000, spendingRateBps: 5200, savingRateBps: 1800, investmentJudgmentBps: 4000 }, calculationVersion: 'baseline-calc-v2', dataState: 'INSUFFICIENT' })),
      http.put('/api/v1/onboarding', () => { completed = true; onboardingWrites += 1; return HttpResponse.json({ status: 'COMPLETED', onboardingState: 'EXPLORE_ONLY', displayName: '민지', context: { incomeRegularity: 'REGULAR', housingType: 'RENT', fixedCostBurden: 'MEDIUM' }, baseline: { disposableIncomeKrw: 1100000, spendingRateBps: 5200, savingRateBps: 1800, investmentJudgmentBps: 4000 }, calculationVersion: 'baseline-calc-v2', dataState: 'FRESH', lastSyncedAt: '2026-07-13T09:00:00+09:00' }) }),
      http.get('/api/v1/home', () => HttpResponse.json({ mode: 'EXPLORE_ONLY', totalAssetsKrw: 4280000, financialStats: { spendingDefenseBps: 5200, savingHpBps: 1800, investmentJudgmentBps: 4000, questXp: 0 }, lockedActions: ['RAID', 'QUEST_ACCEPT', 'ROUTINE_IMPORT', 'PERSONALIZED_PRODUCT_INFO'], calculationVersion: 'home-calc-v2', dataState: 'FRESH', lastSyncedAt: '2026-07-13T09:00:00+09:00' })),
      http.post('/api/v1/goals', async ({ request }) => { goalWrites += 1; const body = await request.json() as Schema['ConfirmUserGoalRequest']; return HttpResponse.json({ goalId: 'goal-after-explore', ...body.goal, state: 'ACTIVE', confirmedAt: '2026-07-13T09:10:00+09:00', calculationVersion: 'goal-calc-v2', dataState: 'FRESH', lastSyncedAt: '2026-07-13T09:00:00+09:00' }, { status: 201 }) }),
    )
    renderApp('/goal/confirm')

    await user.click(await screen.findByRole('button', { name: '일단 탐색하기' }))
    await user.click(await screen.findByRole('link', { name: '목표 설정' }))
    await user.click(await screen.findByRole('button', { name: '유럽 여행 자금 목표 만들기' }))

    expect(await screen.findByRole('heading', { name: '여행까지 한 걸음' })).toBeInTheDocument()
    expect(onboardingWrites).toBe(1)
    expect(goalWrites).toBe(1)
  })

  it('renders an explore-only home without assuming a goal or raid exists', async () => {
    server.use(http.get('/api/v1/home', () => HttpResponse.json({ mode: 'EXPLORE_ONLY', totalAssetsKrw: 4280000, financialStats: { spendingDefenseBps: 5200, savingHpBps: 1800, investmentJudgmentBps: 4000, questXp: 0 }, lockedActions: ['RAID', 'QUEST_ACCEPT', 'ROUTINE_IMPORT', 'PERSONALIZED_PRODUCT_INFO'], calculationVersion: 'home-calc-v2', dataState: 'FRESH', lastSyncedAt: '2026-07-13T09:00:00+09:00' })))

    renderApp('/home')

    expect(await screen.findByRole('heading', { name: '목표를 정하면 레이드가 시작돼요' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '목표 설정' })).toHaveAttribute('href', '/goal/confirm')
  })

  it('persists a confirmed routine replacement while preserving the active main goal', async () => {
    const user = userEvent.setup()
    renderApp('/mates/group/savers')

    await user.click(await screen.findByRole('link', { name: /북쪽의 모험가/ }))
    await user.click(await screen.findByRole('link', { name: '루틴을 내 생활에 맞추기' }))
    await user.click(await screen.findByRole('button', { name: '내 기준으로 추천 받기' }))
    await user.click(await screen.findByRole('button', { name: 'STANDARD · 월급날 50만원 먼저 저축' }))
    await user.click(screen.getByRole('button', { name: '이 루틴으로 바꾸기' }))
    expect(screen.getByRole('dialog', { name: '루틴 변경 확인' })).toBeInTheDocument()
    expect(screen.getByText('여행 목표는 그대로 유지돼요.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '교체 확정' }))
    expect(await screen.findByRole('heading', { name: '활성 루틴이 바뀌었어요' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '홈' }))
    expect(await screen.findByText('현재 루틴: 월급 입금일 확인')).toBeInTheDocument()
    expect(screen.getByText('유럽 여행')).toBeInTheDocument()
    expect(screen.getByText('2,000,000 KRW')).toBeInTheDocument()
  })

  it('resolves the mate group from the route parameter', async () => {
    renderApp('/mates/group/budget')

    expect(await screen.findByRole('heading', { name: '생활비 탐험대' })).toBeInTheDocument()
  })

  it('shows synthetic financial quests as waiting for MyData evidence', async () => {
    const user = userEvent.setup()
    renderApp('/quests')

    await user.click(await screen.findByRole('button', { name: '자동저축 입금 반영 확인하기 수락' }))
    await user.click(await screen.findByRole('button', { name: '자동저축 입금 반영 확인하기 완료' }))

    expect(await screen.findByRole('status')).toHaveTextContent('MyData 반영을 기다리고 있어요')
    expect(screen.getByRole('button', { name: '자동저축 입금 반영 확인하기 완료' })).toBeDisabled()
  })

  it('returns an expired protected session to login', async () => {
    const unauthorized = { type: 'https://finmate.example/problems/unauthorized', title: 'Unauthorized', status: 401, detail: 'Session expired.', instance: '/api/v1/home', code: 'UNAUTHORIZED', traceId: 'trace-expired' }
    server.use(
      http.get('/api/v1/home', () => HttpResponse.json(unauthorized, { status: 401 })),
      http.post('/api/v1/auth/refresh', () => HttpResponse.json(unauthorized, { status: 401 })),
    )

    renderApp('/home')

    expect(await screen.findByRole('heading', { name: '다시 만나서 반가워요' })).toBeInTheDocument()
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

    await apiRequest('/onboarding', 'PUT', onboardingCompletionForTest())
    await apiRequest('/goals', 'POST', { goal: { title: '유럽 여행', domain: 'SAVING', currentAmountKrw: 2000000, targetAmountKrw: 5000000, targetMonth: '2027-01' }, confirm: true })

    expect((await apiGet<HomeResponse>('/home')).raid?.stage).toBe(1)
    for (const expectedFrameIndex of [0, 1, 2, 3, 4, 5]) await apiRequest('/demo/timeline/advance', 'POST', { fixtureId: 'EUROPE_TRAVEL_JANUARY', expectedFrameIndex })
    const completedHome = await apiGet<HomeResponse>('/home')

    expect(completedHome.mainGoal?.state).toBe('COMPLETED')
    expect(completedHome.raid?.stage).toBe(3)
  })
})

function onboardingCompletionForTest(): Schema['CompleteOnboardingRequest'] {
  return { displayName: '민지', context: { incomeRegularity: 'REGULAR', housingType: 'RENT', fixedCostBurden: 'MEDIUM' }, moneyConcern: 'SAVING', financialTendency: 'BALANCED', lifestyleTags: ['자취'], anonymousShareConsent: true, syntheticMyDataConsent: true, finishMode: 'EXPLORE_ONLY' }
}
