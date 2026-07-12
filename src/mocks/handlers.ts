import { delay, http, HttpResponse } from 'msw'

const journey = Array.from({ length: 30 }, (_, index) => ({
  day: index + 1,
  label: `${index + 1}일`,
  complete: index < 18,
  note: index < 18 ? '자동저축 루틴을 지켰어요.' : '내일의 기록을 기다리고 있어요.',
}))

export const handlers = [
  http.post('/api/auth/signup', async () => {
    await delay(100)
    return HttpResponse.json({ memberId: 'member-minji', nickname: '민지' })
  }),
  http.post('/api/auth/login', () => HttpResponse.json({ memberId: 'member-minji', nickname: '민지' })),
  http.get('/api/home', () => HttpResponse.json({
    greeting: '민지님, 저축 루틴이 1단계를 지나고 있어요.',
    activeGoal: { title: '유럽 여행', targetKrw: 5000000, savedKrw: 2000000 },
    raid: { stage: 2, boss: '생활비 드래곤', hp: 58 },
    dataFreshness: { state: 'FRESH', label: 'MyData 기준 오늘 08:30 반영' },
  })),
  http.get('/api/goals/active', () => HttpResponse.json({
    goalId: 'europe-trip', title: '유럽 여행', targetKrw: 5000000, savedKrw: 2000000, state: 'ACTIVE',
  })),
  http.get('/api/animal-report', () => HttpResponse.json({
    title: '오늘의 동물 리포트', animal: '해달', summary: '저축 HP가 지난주보다 안정적으로 자랐어요.', action: '자동저축 입금 반영 확인하기',
  })),
  http.get('/api/mate-groups', () => HttpResponse.json([
    { id: 'savers', name: '꾸준저축 원정대', members: 18, routine: '주 3회 저축 챌린지', description: '작은 금액도 끊기지 않게, 익명으로 서로의 루틴을 응원해요.' },
    { id: 'budget', name: '생활비 탐험대', members: 12, routine: '하루 한 번 지출 점검', description: '소비를 기록하고 다음 날의 선택을 가볍게 정리해요.' },
  ])),
  http.get('/api/adventurers/anonymous-minji', () => HttpResponse.json({
    alias: '북쪽의 모험가', level: 12, routine: '주 3회 저축 챌린지', insight: '급여일 다음 날 자동저축을 설정했어요.',
  })),
  http.get('/api/quests', () => HttpResponse.json([
    { id: 'routine', title: '자동저축 입금 반영 확인하기', description: 'MyData에서 이번 주 저축 흐름을 확인해요.', status: 'READY' },
    { id: 'etf', title: 'ETF O/X 한 문제 풀기', description: '투자는 상품 추천이 아니라 위험 이해부터 시작해요.', status: 'READY' },
  ])),
  http.get('/api/journey', () => HttpResponse.json(journey)),
]
