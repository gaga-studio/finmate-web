import { expect, test } from '@playwright/test'

test('moves from signup through the travel goal to completion', async ({ page }) => {
  await page.goto('/signup')
  await page.getByLabel('이메일').fill('minji@example.com')
  await page.getByLabel('비밀번호').fill('finmate1234')
  await page.getByRole('button', { name: '시작하기' }).click()

  for (let step = 0; step < 5; step += 1) {
    await page.getByRole('button', { name: '다음' }).click()
  }
  await page.getByRole('button', { name: '여행 목표 보기' }).click()
  await page.getByRole('button', { name: '유럽 여행 목표 만들기' }).click()
  await expect(page.getByRole('heading', { name: '유럽 여행까지 한 걸음' })).toBeVisible()
  await page.getByRole('button', { name: '홈으로 가기' }).click()
  await page.getByRole('link', { name: '기록' }).click()
  await page.getByRole('button', { name: '데모 진행' }).click()
  await page.getByRole('button', { name: '목표 완료 보기' }).click()
  await expect(page.getByText('유럽 여행 목표를 완주했어요')).toBeVisible()
})
