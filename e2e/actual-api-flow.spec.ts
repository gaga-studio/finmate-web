import { expect, test } from '@playwright/test'

test('runs the representative flow against the demo-profile API', async ({ page }) => {
  const email = `playwright-${Date.now()}@example.com`

  await page.goto('/signup')
  await page.getByLabel('이름').fill('민지')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill('FinMate!2026#')
  await page.getByRole('button', { name: '시작하기' }).click()

  for (let step = 0; step < 5; step += 1) await page.getByRole('button', { name: '다음' }).click()
  await page.getByRole('button', { name: '여행 목표 보기' }).click()
  await page.getByRole('button', { name: '유럽 여행 자금 목표 만들기' }).click()
  await page.getByRole('button', { name: '홈으로 가기' }).click()
  await expect(page.getByText('목표 상태: 진행 중')).toBeVisible()

  await page.getByRole('link', { name: '메이트' }).click()
  await page.getByRole('link', { name: /Travel saving party/ }).click()
  await page.getByRole('link', { name: /Cobalt Compass/ }).click()
  await expect(page.getByRole('heading', { name: 'Weekly travel saving' })).toBeVisible()
  await page.getByRole('link', { name: '루틴을 내 생활에 맞추기' }).click()
  await page.getByRole('button', { name: 'STANDARD 후보 선택' }).click()
  await page.getByRole('button', { name: 'STANDARD · Standard weekly routine' }).click()
  await page.getByRole('button', { name: '이 루틴으로 바꾸기' }).click()
  await expect(page.getByRole('heading', { name: '활성 루틴이 바뀌었어요' })).toBeVisible()
  await page.getByRole('link', { name: '홈' }).click()
  await expect(page.getByText('현재 루틴: Complete the weekly routine')).toBeVisible()

  await page.getByRole('link', { name: '메이트' }).click()
  await page.getByRole('link', { name: /Travel saving party/ }).click()
  await page.getByRole('link', { name: /Cobalt Compass/ }).click()
  await page.getByRole('link', { name: '루틴을 내 생활에 맞추기' }).click()
  await page.getByRole('button', { name: 'STANDARD 후보 선택' }).click()
  await page.getByRole('button', { name: 'CHALLENGE · Challenge weekly routine' }).click()
  await page.getByRole('button', { name: '이 루틴으로 바꾸기' }).click()
  await expect(page.getByRole('dialog', { name: '루틴 변경 확인' })).toBeVisible()
  await page.getByRole('button', { name: '교체 확정' }).click()
  await expect(page.getByRole('heading', { name: '활성 루틴이 바뀌었어요' })).toBeVisible()

  await page.getByRole('link', { name: '퀘스트' }).click()
  await page.getByRole('button', { name: /완료$/ }).first().click()
  await expect(page.getByRole('status')).toContainText('XP')

  await page.getByRole('link', { name: '기록' }).click()
  await page.getByRole('button', { name: /기록$/ }).first().click()
  await expect(page.getByRole('heading', { name: /루틴을 지킨 날이에요|기록을 기다리는 날이에요/ })).toBeVisible()
  await page.getByRole('button', { name: '닫기' }).click()
  await page.getByRole('button', { name: '데모 진행' }).click()
  await page.getByRole('button', { name: '목표 완료 보기' }).click()
  await expect(page.getByText('유럽 여행 자금 목표를 완주했어요')).toBeVisible()
  await page.getByRole('link', { name: '새 여정 시작하기' }).click()
  await expect(page.getByText('목표 상태: 완료')).toBeVisible()
  await expect(page.getByText('RAID STAGE 3')).toBeVisible()

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
  await expect(page.getByText('목표 상태: 완료')).toBeVisible()
})

test('resumes a partially advanced demo after logout and login', async ({ page }) => {
  const email = `playwright-resume-${Date.now()}@example.com`
  await page.goto('/signup')
  await page.getByLabel('이름').fill('민지')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill('FinMate!2026#')
  await page.getByRole('button', { name: '시작하기' }).click()
  for (let step = 0; step < 5; step += 1) await page.getByRole('button', { name: '다음' }).click()
  await page.getByRole('button', { name: '여행 목표 보기' }).click()
  await page.getByRole('button', { name: '유럽 여행 자금 목표 만들기' }).click()
  await page.getByRole('button', { name: '홈으로 가기' }).click()

  const partial = await page.evaluate(async () => {
    const auth = JSON.parse(sessionStorage.getItem('finmate.auth-session') ?? '{}') as { accessToken?: string }
    const headers = { Authorization: `Bearer ${auth.accessToken ?? ''}`, 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() }
    const home = await fetch('http://127.0.0.1:18080/api/v1/home', { credentials: 'include', headers }).then((response) => response.json()) as { mainGoal: { goalId: string } }
    const advance = await fetch('http://127.0.0.1:18080/api/v1/demo/timeline/advance', { method: 'POST', credentials: 'include', headers, body: JSON.stringify({ fixtureId: 'EUROPE_TRAVEL_JANUARY', expectedStage: 0 }) })
    sessionStorage.setItem(`finmate.demo-expected-stage.${home.mainGoal.goalId}`, '1')
    const logout = await fetch('http://127.0.0.1:18080/api/v1/auth/logout', { method: 'POST', credentials: 'include', headers })
    sessionStorage.removeItem('finmate.auth-session')
    return { advanceStatus: advance.status, logoutStatus: logout.status }
  })
  expect(partial).toEqual({ advanceStatus: 200, logoutStatus: 204 })

  await page.goto('/login')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill('FinMate!2026#')
  await page.getByRole('button', { name: '로그인' }).click()
  await expect(page.getByText('목표 상태: 진행 중')).toBeVisible()
  await page.goto('/demo')
  await page.getByRole('button', { name: '목표 완료 보기' }).click()
  await expect(page.getByText('유럽 여행 자금 목표를 완주했어요')).toBeVisible()
})
