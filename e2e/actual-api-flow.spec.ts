import { expect, test } from '@playwright/test'

async function completeOnboarding(page: import('@playwright/test').Page) {
  for (const [choice, next] of [
    ['정기 소득 · 자취 중이에요', '다음'],
    ['저축을 꾸준히 하고 싶어요', '다음'],
    ['안전성과 실행을 함께 봐요', '다음'],
    ['자취 · 사회초년생', '다음'],
    ['동의 범위를 확인하고 연결하기', '연결하고 기준선 보기'],
  ] as const) {
    await page.getByRole('button', { name: choice }).click()
    await page.getByRole('button', { name: next }).click()
  }
  await page.getByRole('link', { name: '목표 설정하기' }).click()
}

test('runs the representative flow against the demo-profile API', async ({ page }) => {
  const email = `playwright-${Date.now()}@example.com`

  await page.goto('/signup')
  await page.getByLabel('이름').fill('민지')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill('FinMate!2026#')
  await page.getByRole('button', { name: '회원가입' }).click()

  await completeOnboarding(page)
  await page.getByRole('button', { name: '유럽 여행 자금 목표 만들기' }).click()
  await page.getByRole('button', { name: '홈으로 가기' }).click()
  await expect(page.getByRole('heading', { name: '유럽 여행 자금 레이드' })).toBeVisible()

  for (const [label, characterName] of [
    ['곰 소비 리포트 보기', '든든곰'],
    ['물개 저축 리포트 보기', '모아씰'],
    ['토끼 투자 판단 리포트 보기', '살펴토끼'],
    ['새 퀘스트 XP 리포트 보기', '해냄새'],
  ]) {
    await page.goto('/home')
    await page.getByRole('button', { name: label }).first().click()
    await expect(page.getByRole('heading', { name: characterName })).toBeVisible()
  }
  await page.getByRole('button', { name: '홈으로' }).click()

  const contractViews = await page.evaluate(async () => {
    const auth = JSON.parse(sessionStorage.getItem('finmate.auth-session') ?? '{}') as { accessToken?: string }
    const headers = { Authorization: `Bearer ${auth.accessToken ?? ''}`, 'Content-Type': 'application/json' }
    const supported = await fetch('http://127.0.0.1:18080/api/v1/mate/explore/search', { method: 'POST', credentials: 'include', headers, body: JSON.stringify({ ageBand: 'AGE_24_29', occupationGroup: 'EARLY_CAREER', incomeBand: 'FROM_200_TO_300', spendingTendency: 'BALANCED', savingRateBand: 'FROM_10_TO_20', investmentTendency: 'BALANCED' }) }).then((response) => response.json()) as { items: unknown[] }
    const unsupported = await fetch('http://127.0.0.1:18080/api/v1/mate/explore/search', { method: 'POST', credentials: 'include', headers, body: JSON.stringify({ ageBand: 'AGE_30_34', occupationGroup: 'FREELANCER', incomeBand: 'OVER_300', spendingTendency: 'VARIABLE', savingRateBand: 'UNDER_10', investmentTendency: 'LEARNING' }) }).then((response) => response.json()) as { items: unknown[] }
    const product = await fetch('http://127.0.0.1:18080/api/v1/hana-products/hana-saving-info-001', { credentials: 'include', headers }).then((response) => response.json()) as { reviewedCatalog: boolean; inAppEnrollmentAvailable: boolean; affectsProgress: boolean }
    return { supported: supported.items.length, unsupported: unsupported.items.length, product }
  })
  expect(contractViews.supported).toBeGreaterThan(0)
  expect(contractViews.unsupported).toBe(0)
  expect(contractViews.product).toEqual(
    expect.objectContaining({ reviewedCatalog: true, inAppEnrollmentAvailable: false, affectsProgress: false }),
  )

  await page.goto('/mates/friends')
  await expect(page.getByRole('heading', { name: /친구 \d+명 중 3명이/ })).toBeVisible()
  await expect(page.getByText('읽기 전용').first()).toBeVisible()
  await page.goto('/mates/explore')
  await page.getByRole('button', { name: /검색하기/ }).click()
  await expect(page.locator('a[href*="/adventurer/"]').first()).toBeVisible()
  await page.goto('/products/hana-saving-info-001')
  await expect(page.getByText('루틴과 상품 정보는 분리돼요')).toBeVisible()
  await expect(page.getByRole('link', { name: /공식 정보에서 확인/ })).toBeVisible()

  await page.getByRole('link', { name: '메이트', exact: true }).click()
  await page.getByRole('link', { name: /Travel saving party/ }).click()
  await page.getByRole('link', { name: /Cobalt Compass/ }).click()
  await page.getByRole('link', { name: /나와 비교한 리포트 보기/ }).click()
  await expect(page.getByText('순위가 아니라 습관 범위를 비교해요.')).toBeVisible()
  await page.getByRole('link', { name: '모험가로' }).click()
  await page.getByRole('link', { name: /루틴 보기/ }).click()
  await expect(page.getByRole('heading', { name: 'Weekly travel saving' })).toBeVisible()
  await page.getByRole('link', { name: '루틴을 내 생활에 맞추기' }).click()
  await page.getByRole('button', { name: '내 기준으로 추천 받기' }).click()
  await expect(page.getByRole('button', { name: '표준 · 월급날 50만원 먼저 저축' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: '이 루틴으로 퀘스트 시작하기' }).click()
  await expect(page.getByRole('heading', { name: '활성 루틴이 바뀌었어요' })).toBeVisible()
  await page.getByRole('link', { name: '홈' }).click()
  await expect(page.getByText('현재 루틴: 월급 입금일 확인')).toBeVisible()

  await page.getByRole('link', { name: '메이트' }).click()
  await page.getByRole('link', { name: /Travel saving party/ }).click()
  await page.getByRole('link', { name: /Cobalt Compass/ }).click()
  await page.getByRole('link', { name: /루틴 보기/ }).click()
  await page.getByRole('link', { name: '루틴을 내 생활에 맞추기' }).click()
  await page.getByRole('button', { name: '내 기준으로 추천 받기' }).click()
  await page.getByRole('button', { name: '도전 · 월급날 70만원 먼저 저축' }).click()
  await page.getByRole('button', { name: '이 루틴으로 퀘스트 시작하기' }).click()
  await expect(page.getByRole('dialog', { name: '루틴 변경 확인' })).toBeVisible()
  await page.getByRole('button', { name: '교체 확정' }).click()
  await expect(page.getByRole('heading', { name: '활성 루틴이 바뀌었어요' })).toBeVisible()

  await page.getByRole('link', { name: '퀘스트' }).click()
  await page.locator('a[href^="/quests/"]').first().click()
  await page.getByRole('button', { name: '퀘스트 수락' }).click()
  await page.getByRole('button', { name: '완료 확인' }).click()
  await expect(page.getByText(/완료했어요|행동을 기록했어요/)).toBeVisible()

  await page.getByRole('link', { name: '기록', exact: true }).click()
  await page.getByRole('button', { name: /기록 상세 보기$/ }).first().click()
  const recordDialog = page.getByRole('dialog')
  await expect(recordDialog).toBeVisible()
  await expect(recordDialog.getByRole('heading', { name: '활동 내역' })).toBeVisible()
  await page.getByRole('button', { name: '상세 기록 닫기' }).last().click()
  await page.getByRole('button', { name: '시연 시간 진행' }).click()
  await page.getByRole('button', { name: '목표 완료 보기' }).click()
  await expect(page.getByText('유럽 여행 자금 목표를 완주했어요')).toBeVisible()
  await page.getByRole('link', { name: '홈으로 돌아가기' }).click()
  await expect(page.getByRole('heading', { name: '유럽 여행 자금 레이드' })).toBeVisible()
  await expect(page.getByText('STAGE 3')).toBeVisible()
  await expect(page.getByText('0%', { exact: true })).toBeVisible()

  const journeyMonths = await page.evaluate(async () => {
    const auth = JSON.parse(sessionStorage.getItem('finmate.auth-session') ?? '{}') as { accessToken?: string }
    const headers = { Authorization: `Bearer ${auth.accessToken ?? ''}` }
    const month = async (value: string) => fetch(`http://127.0.0.1:18080/api/v1/records/journey?month=${value}`, { credentials: 'include', headers }).then((response) => response.json()) as Promise<{ recordedDayCount: number; moneySummary: { savingKrw: number } }>
    return { august: await month('2026-08'), january: await month('2027-01') }
  })
  expect(journeyMonths.august).toMatchObject({ recordedDayCount: 1, moneySummary: { savingKrw: 500000 } })
  expect(journeyMonths.january).toMatchObject({ recordedDayCount: 1, moneySummary: { savingKrw: 500000 } })

  const revoked = await page.evaluate(async () => {
    const session = JSON.parse(sessionStorage.getItem('finmate.auth-session') ?? '{}') as { accessToken?: string }
    const logout = await fetch('http://127.0.0.1:18080/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { Authorization: `Bearer ${session.accessToken ?? ''}` },
    })
    const refresh = await fetch('http://127.0.0.1:18080/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })
    return { logoutStatus: logout.status, refreshStatus: refresh.status }
  })
  expect(revoked).toEqual({ logoutStatus: 204, refreshStatus: 401 })

  await page.goto('/login')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill('FinMate!2026#')
  await page.getByRole('button', { name: '로그인' }).click()
  await expect(page.getByText('STAGE 3')).toBeVisible()
  await expect(page.getByText('0%', { exact: true })).toBeVisible()
})

test('resumes a partially advanced demo after logout and login', async ({ page }) => {
  const email = `playwright-resume-${Date.now()}@example.com`
  await page.goto('/signup')
  await page.getByLabel('이름').fill('민지')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill('FinMate!2026#')
  await page.getByRole('button', { name: '회원가입' }).click()
  await completeOnboarding(page)
  await page.getByRole('button', { name: '유럽 여행 자금 목표 만들기' }).click()
  await page.getByRole('button', { name: '홈으로 가기' }).click()

  const partial = await page.evaluate(async () => {
    const auth = JSON.parse(sessionStorage.getItem('finmate.auth-session') ?? '{}') as { accessToken?: string }
    const headers = { Authorization: `Bearer ${auth.accessToken ?? ''}`, 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() }
    const home = await fetch('http://127.0.0.1:18080/api/v1/home', { credentials: 'include', headers }).then((response) => response.json()) as { mainGoal: { goalId: string } }
    const advance = await fetch('http://127.0.0.1:18080/api/v1/demo/timeline/advance', { method: 'POST', credentials: 'include', headers, body: JSON.stringify({ fixtureId: 'EUROPE_TRAVEL_JANUARY', expectedFrameIndex: 0 }) })
    sessionStorage.setItem(`finmate.demo-expected-frame.${home.mainGoal.goalId}`, '1')
    const logout = await fetch('http://127.0.0.1:18080/api/v1/auth/logout', { method: 'POST', credentials: 'include', headers })
    sessionStorage.removeItem('finmate.auth-session')
    return { advanceStatus: advance.status, logoutStatus: logout.status }
  })
  expect(partial).toEqual({ advanceStatus: 200, logoutStatus: 204 })

  await page.goto('/login')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill('FinMate!2026#')
  await page.getByRole('button', { name: '로그인' }).click()
  await expect(page.getByRole('heading', { name: '유럽 여행 자금 레이드' })).toBeVisible()
  await page.goto('/demo')
  await page.getByRole('button', { name: '목표 완료 보기' }).click()
  await expect(page.getByText('유럽 여행 자금 목표를 완주했어요')).toBeVisible()
})

test('starts in explore mode and confirms a goal later without replaying onboarding', async ({ page }) => {
  const email = `playwright-explore-${Date.now()}@example.com`
  await page.goto('/signup')
  await page.getByLabel('이름').fill('민지')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill('FinMate!2026#')
  await page.getByRole('button', { name: '회원가입' }).click()
  await completeOnboarding(page)

  await page.getByRole('button', { name: '일단 탐색하기' }).click()
  await expect(page.getByRole('heading', { name: '목표를 정하면 레이드가 시작돼요' })).toBeVisible()
  await page.getByRole('link', { name: '목표 설정' }).click()
  await expect(page.getByRole('button', { name: '유럽 여행 자금 목표 만들기' })).toBeVisible()
  await page.getByRole('button', { name: '유럽 여행 자금 목표 만들기' }).click()
  await expect(page.getByRole('heading', { name: '여행까지 한 걸음' })).toBeVisible()
})
