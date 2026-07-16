import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
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
  it('starts signup and advances into five-step onboarding', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByLabelText('이름'), '민지')
    await user.type(screen.getByLabelText('이메일'), 'minji@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'finmate12345')
    await user.click(screen.getByRole('button', { name: '회원가입' }))

    expect(await screen.findByRole('heading', { name: '지금의 생활 리듬은 어떤가요?' })).toBeInTheDocument()
    expect(screen.getByLabelText('1단계 생활 맥락 (현재 단계)')).toHaveAttribute('aria-current', 'step')
  })

  it('retains onboarding choices locally and opens an editable Europe travel goal draft', async () => {
    const user = userEvent.setup()
    renderApp('/onboarding/1')

    const choice = screen.getByRole('button', { name: '정기 소득 · 자취 중이에요' })
    await user.click(choice)
    expect(choice).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: '다음' }))
    await user.click(screen.getByRole('button', { name: '저축을 꾸준히 하고 싶어요' }))
    await user.click(screen.getByRole('button', { name: '다음' }))
    await user.click(screen.getByRole('button', { name: '안전성과 실행을 함께 봐요' }))
    await user.click(screen.getByRole('button', { name: '다음' }))
    await user.click(screen.getByRole('button', { name: '자취 · 사회초년생' }))
    await user.click(screen.getByRole('button', { name: '다음' }))
    await user.click(screen.getByRole('button', { name: '동의 범위를 확인하고 연결하기' }))
    await user.click(screen.getByRole('button', { name: '연결하고 기준선 보기' }))
    await user.click(await screen.findByRole('link', { name: '목표 설정하기' }))

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

  it('explains the calculated baseline before goal confirmation', async () => {
    renderApp('/onboarding/baseline')

    expect(await screen.findByRole('heading', { name: '1,100,000원' })).toBeInTheDocument()
    expect(screen.getByText('52%')).toBeInTheDocument()
    expect(screen.getByText('18%')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '목표 설정하기' })).toHaveAttribute('href', '/goal/confirm')
    expect(screen.getByRole('link', { name: '일단 메이트 탐색하기' })).toHaveAttribute('href', '/home')
  })

  it('presents the active goal as a travel raid with four report entry points', async () => {
    renderApp('/home')

    expect(await screen.findByRole('heading', { name: '유럽 여행 자금 레이드' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '곰 소비 리포트 보기' })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: '물개 저축 리포트 보기' })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: '토끼 투자 판단 리포트 보기' })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: '새 퀘스트 XP 리포트 보기' })).toHaveLength(2)
    expect(screen.queryByText('생활비 드래곤')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'AUTO' })).toBeInTheDocument()
    expect(document.querySelector('.home-identity-bar')).not.toContainElement(document.querySelector('.home-profile-strip'))
  })

  it('switches the character report status bar background after the report sheet reaches the top', async () => {
    renderApp('/report?type=SPENDING_DEFENSE')

    expect(await screen.findByRole('heading', { name: '든든곰' })).toBeInTheDocument()
    const reportScreen = document.querySelector<HTMLElement>('.screen-home-report')
    const reportStatus = document.querySelector('.home-report-status')
    expect(reportScreen).not.toBeNull()
    expect(reportStatus).not.toHaveClass('is-on-sheet')

    Object.defineProperty(reportScreen, 'scrollTop', { configurable: true, value: 252 })
    fireEvent.scroll(reportScreen!)

    expect(reportStatus).toHaveClass('is-on-sheet')
  })

  it('persists a confirmed routine replacement while preserving the active main goal', async () => {
    const user = userEvent.setup()
    renderApp('/mates/group/savers')

    await user.click(await screen.findByRole('link', { name: /북쪽의 모험가/ }))
    await user.click(await screen.findByRole('link', { name: /루틴 보기/ }))
    await user.click(await screen.findByRole('link', { name: '루틴을 내 생활에 맞추기' }))
    await user.click(await screen.findByRole('button', { name: '내 기준으로 추천 받기' }))
    await user.click(await screen.findByRole('button', { name: '표준 · 월급날 50만원 먼저 저축' }))
    await user.click(screen.getByRole('button', { name: '이 루틴으로 퀘스트 시작하기' }))
    expect(screen.getByRole('dialog', { name: '루틴 변경 확인' })).toBeInTheDocument()
    expect(screen.getByText(/여행 목표는 그대로 유지돼요/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '교체 확정' }))
    expect(await screen.findByRole('heading', { name: '활성 루틴이 바뀌었어요' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '홈' }))
    expect(await screen.findByText('현재 루틴: 월급 입금일 확인')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '유럽 여행 자금 레이드' })).toBeInTheDocument()
  })

  it('resolves the mate group from the route parameter', async () => {
    renderApp('/mates/group/budget')

    expect(await screen.findByRole('heading', { name: '생활비 탐험대' })).toBeInTheDocument()
  })

  it('frames mate discovery around anonymous routines without public ranking', async () => {
    renderApp('/mates')

    expect(await screen.findByRole('heading', { name: '나와 비슷한 그룹' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '추천 유사그룹' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /꾸준저축 원정대/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /생활비 탐험대/ })).toBeInTheDocument()
    expect(screen.queryByText(/1위|랭킹/)).not.toBeInTheDocument()
  })

  it('shows read-only friend activity without amounts or ranking', async () => {
    renderApp('/mates/friends')

    expect(await screen.findByRole('heading', { name: /친구 4명 중 3명이/ })).toBeInTheDocument()
    expect(screen.getByText('오늘의 퀘스트를 완료했어요')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '금융 근황 피드' }).closest('section')).toHaveTextContent('자동저축 확인 루틴을 이어갔어요.')
    expect(screen.getByText(/12일째/)).toBeInTheDocument()
    expect(screen.queryByText(/원|랭킹|1위/)).not.toBeInTheDocument()
  })

  it('searches approved comparison filters and opens an anonymous adventurer', async () => {
    const user = userEvent.setup()
    renderApp('/mates/explore')

    expect(await screen.findByRole('heading', { name: '비교 조건 설정' })).toBeInTheDocument()
	  await user.click(screen.getByRole('button', { name: /검색하기/ }))
	  expect(await screen.findByText(/Mock 데이터/)).toBeInTheDocument()
	  expect(await screen.findByText('6명의 익명 모험가')).toBeInTheDocument()
	  expect(screen.getByText(/일부 생활 조건을 넓혀 찾았어요/)).toBeInTheDocument()
	  const results = await screen.findAllByRole('link', { name: /익명 모험가/ })
	  expect(results).toHaveLength(6)
	  expect(results[0]).toHaveAttribute('href', '/mates/group/synthetic-runtime/adventurer/adv-0000000000000001')
	})

  it('separates the adventurer profile, comparison report, and routine action', async () => {
    const user = userEvent.setup()
    renderApp('/mates/group/savers/adventurer/adventurer-saver')

    expect(await screen.findByRole('heading', { name: '북쪽의 모험가' })).toBeInTheDocument()
    expect(screen.getByText('42일 유지 · 저축')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /나와 비교한 리포트 보기/ }))
    expect(await screen.findByRole('heading', { name: '나와 북쪽의 모험가' })).toBeInTheDocument()
    expect(screen.getByText('10–20%')).toBeInTheDocument()
    expect(screen.getByText('20–30%')).toBeInTheDocument()
    expect(screen.getByText('차이는 부담 없는 저축 행동부터 줄일 수 있어요.')).toBeInTheDocument()
    expect(screen.queryByText('SAVING GAP IS ACTIONABLE')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /이 루틴을 내 상황에 맞추기/ })).toBeInTheDocument()
  })

  it('keeps reviewed Hana product information separate from game progress', async () => {
    renderApp('/products/hana-saving-info-001')

    expect(await screen.findByRole('heading', { name: '하나 합 저축 정보' })).toBeInTheDocument()
    expect(screen.getByText(/루틴과 상품 정보는 분리돼요/)).toBeInTheDocument()
    expect(screen.getByText(/XP, 금융 스탯, 레이드 진행률은 바뀌지 않아요/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /공식 정보에서 확인/ })).toHaveAttribute('target', '_blank')
    expect(screen.queryByRole('button', { name: /가입/ })).not.toBeInTheDocument()
  })

  it('shows synthetic financial quests as waiting for MyData evidence', async () => {
    const user = userEvent.setup()
    renderApp('/quests')

    await user.click(await screen.findByRole('link', { name: /퀘스트 상세: 자동저축 입금 반영 확인하기/ }))
    await user.click(await screen.findByRole('button', { name: '퀘스트 수락' }))
    await user.click(await screen.findByRole('button', { name: '완료 확인' }))

    expect(await screen.findByText(/새 데이터 반영을 기다리고 있어요/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '기록에서 반영 상태 보기' })).toBeInTheDocument()
  })

  it('explains that quest rewards and financial growth are calculated separately', async () => {
    renderApp('/quests')

    expect(await screen.findByText(/퀘스트 보상과 금융 성장은 분리돼요/)).toBeInTheDocument()
    expect(screen.getByText(/금융 스탯과 레이드는 데이터 동기화 후 다시 계산해요/)).toBeInTheDocument()
    expect(screen.queryByText(/보스 진행률 \+\d/)).not.toBeInTheDocument()
    expect(screen.queryByText(/저축 HP \+\d/)).not.toBeInTheDocument()
  })

  it('shows the current week as large chronological journey steps', async () => {
    renderApp('/record')

    expect(await screen.findByRole('heading', { name: '30일 금융 여정' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /기록 상세 보기$/ })).toHaveLength(7)
    const visibleDates = [7, 8, 9, 10, 11, 12, 13].map((day) => screen.getByRole('button', { name: `2026-07-${String(day).padStart(2, '0')} 기록 상세 보기` }))
    expect(visibleDates).toHaveLength(7)
    expect(screen.getByRole('button', { name: '2026-07-09 기록 상세 보기' })).toHaveTextContent('통신비 자동이체')
    expect(screen.getByRole('button', { name: '2026-07-10 기록 상세 보기' })).toHaveTextContent('비상금 자동저축')
    expect(screen.getByRole('button', { name: '2026-07-11 기록 상세 보기' })).toHaveTextContent('저축투자+2')
    expect(visibleDates[0]).not.toHaveClass('undefined')
  })

  it('loads another record month when the month navigation is used', async () => {
    const user = userEvent.setup()
    renderApp('/record')

    expect(await screen.findByText('2026년 7월')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '다음 달' }))

    expect(await screen.findByText('2026년 8월')).toBeInTheDocument()
  })

  it('opens an activity-first day sheet without duplicate summaries or footer actions', async () => {
    const user = userEvent.setup()
    renderApp('/record')

    await user.click(await screen.findByRole('button', { name: '2026-07-11 기록 상세 보기' }))

    const sheet = await screen.findByRole('dialog', { name: '7월 11일 토요일' })
    expect(sheet).toHaveTextContent('월급 입금')
    expect(sheet).toHaveTextContent('+2,800,000원')
    expect(sheet).toHaveTextContent('지출 3건')
    expect(sheet).toHaveTextContent('-19,600원')
    expect(sheet).toHaveTextContent('비상금 자동저축')
    expect(sheet).toHaveTextContent('+100,000원')
    expect(sheet).toHaveTextContent('투자계좌 입금')
    expect(sheet).toHaveTextContent('+50,000원')
    expect(sheet).toHaveTextContent('카페비 기록 퀘스트 완료')
    expect(sheet).toHaveTextContent('12,400원 남음')
    expect(sheet).toHaveTextContent('데이터 반영 후 금융 스탯을 다시 계산해요')
    expect(screen.queryByText('오늘의 돈 흐름')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '기록 수정' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '상세 기록 보기' })).not.toBeInTheDocument()
  })

  it('returns an expired protected session to login', async () => {
    const unauthorized = { type: 'https://finmate.example/problems/unauthorized', title: 'Unauthorized', status: 401, detail: 'Session expired.', instance: '/api/v1/home', code: 'UNAUTHORIZED', traceId: 'trace-expired' }
    server.use(
      http.get('/api/v1/home', () => HttpResponse.json(unauthorized, { status: 401 })),
      http.post('/api/v1/auth/refresh', () => HttpResponse.json(unauthorized, { status: 401 })),
    )

    renderApp('/home')

    expect(await screen.findByRole('heading', { name: '금융 루틴으로 다시 들어가기' })).toBeInTheDocument()
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
