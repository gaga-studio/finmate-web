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

test('moves through the representative FinMate mobile flow', async ({ page }) => {
  await page.goto('/signup')
  await page.getByLabel('이름').fill('민지')
  await page.getByLabel('이메일').fill('minji@example.com')
  await page.getByLabel('비밀번호').fill('finmate12345')
  await page.getByRole('button', { name: '시작하기' }).click()

  await completeOnboarding(page)
  await page.getByRole('button', { name: '유럽 여행 자금 목표 만들기' }).click()
  await expect(page.getByRole('heading', { name: '여행까지 한 걸음' })).toBeVisible()
  await page.getByRole('button', { name: '홈으로 가기' }).click()
  await expect(page.getByRole('heading', { name: '유럽 여행 자금 목표를 향해 가고 있어요.' })).toBeVisible()
  await page.getByRole('button', { name: '동물 리포트', exact: true }).click()
  await expect(page.getByRole('heading', { name: '분야별 동물 리포트' })).toBeVisible()
  await page.getByRole('button', { name: '메이트 루틴 살펴보기' }).click()
  await page.getByRole('link', { name: /꾸준저축 원정대/ }).click()
  await page.getByRole('link', { name: /북쪽의 모험가/ }).click()
  await page.getByRole('link', { name: /루틴 보기/ }).click()
  await expect(page.getByRole('heading', { name: '주 3회 저축 챌린지' })).toBeVisible()
  await page.getByRole('link', { name: '루틴을 내 생활에 맞추기' }).click()
  await page.getByRole('button', { name: '내 기준으로 추천 받기' }).click()
  await page.getByRole('button', { name: '표준 · 월급날 50만원 먼저 저축' }).click()
  await page.getByRole('button', { name: '이 루틴으로 바꾸기' }).click()
  await expect(page.getByRole('dialog', { name: '루틴 변경 확인' })).toBeVisible()
  await page.getByRole('button', { name: '교체 확정' }).click()
  await expect(page.getByRole('heading', { name: '활성 루틴이 바뀌었어요' })).toBeVisible()
  await page.getByRole('link', { name: '홈' }).click()
  await expect(page.getByText('현재 루틴: 월급 입금일 확인')).toBeVisible()
  await expect(page.getByRole('heading', { name: '유럽 여행 자금 목표를 향해 가고 있어요.' })).toBeVisible()
  await expect(page.getByText('2,000,000원')).toBeVisible()
  await page.getByRole('link', { name: '퀘스트' }).click()
  await page.getByRole('link', { name: /자동저축 입금 반영 확인하기/ }).click()
  await page.getByRole('button', { name: '퀘스트 수락' }).click()
  await page.getByRole('button', { name: '완료 확인' }).click()
  await expect(page.getByText('새 데이터 반영을 기다리고 있어요')).toBeVisible()
  await page.getByRole('link', { name: '기록', exact: true }).click()
  await page.getByRole('button', { name: '2026-07-11 기록' }).click()
  await expect(page.getByRole('dialog', { name: '7월 11일 금융 기록' })).toBeVisible()
  await page.getByRole('button', { name: '닫기' }).click()
  await page.getByRole('button', { name: '시연 시간 진행' }).click()
  await page.getByRole('button', { name: '목표 완료 보기' }).click()
  await expect(page.getByText('유럽 여행 자금 목표를 완주했어요')).toBeVisible()
  await page.getByRole('link', { name: '새 여정 시작하기' }).click()
  await expect(page.getByRole('heading', { name: '유럽 여행 자금 목표를 향해 가고 있어요.' })).toBeVisible()
  await expect(page.getByText('STAGE 3')).toBeVisible()
  await expect(page.getByText('완료 기록 확인하기')).toBeVisible()
})
