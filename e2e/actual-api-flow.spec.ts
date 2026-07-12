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
})
