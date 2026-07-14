# FinMate vNext Screen Inventory

> 제품·IA 원본은 `gaga-studio/finmate-api/docs/vnext`다. 이 문서는 웹의 화면 구현과
> 2026-07-14 디자인 인수 상태를 추적하는 미러이며 제품 정책을 새로 결정하지 않는다.

## 상태 정의

| 상태 | 의미 |
| --- | --- |
| `Implemented` | 현재 운영 브랜치에서 계약 fixture와 실제 API 흐름까지 연결해 검증하는 화면 |
| `Needs alignment` | 현재 프로토타입이 있으나 새 IA·계약으로 구조를 다시 맞춰야 함 |
| `Planned` | 제품 기준과 계약은 확정됐지만 웹 화면은 아직 구현하지 않음 |
| `Synthetic read-only` | MVP에서 합성 fixture를 읽기만 하는 탐색 화면 |
| `Demo-only` | 결정적 발표 환경에서만 노출되는 화면·제어 |
| `Deferred` | IA 맥락은 있으나 MVP 구현 범위 밖 |

2026-07-14 전달본을 `e7faff88`에서 동결하고 모든 화면을 `KEEP`, `REFINE`,
`REBUILD`, `DROP` 중 하나로 분류했다. `KEEP`도 코드를 그대로 병합한다는 뜻은
아니며, 운영 계약에 다시 연결하면서 구조와 시각을 유지한다는 의미다. 상세 근거는
[`HANDOFF.md`](../HANDOFF.md)와 [`HANDOFF_MANIFEST.md`](../HANDOFF_MANIFEST.md)에
남긴다.

## 회원·온보딩

| Screen ID | Route proposal | 화면 책임 | 계약 기준 | MVP 상태 | Web 상태 | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| AUTH-01 | `/signup`, `/login` | 이메일 가입·로그인과 온보딩 복원 | `signUp`, `logIn` | MVP | Implemented | `REBUILD` |
| ONB-01 | `/onboarding/1` | 소득 규칙성·주거·고정비 부담 | onboarding draft | MVP | Implemented | `REBUILD` |
| ONB-02 | `/onboarding/2` | 현재 돈 고민 선택 | onboarding draft | MVP | Implemented | `REBUILD` |
| ONB-03 | `/onboarding/3` | 금융성향·위험성향·학습 선호 | onboarding draft | MVP | Implemented | `REBUILD` |
| ONB-04 | `/onboarding/4` | 생활태그·익명 공개 설정 | onboarding draft | MVP | Implemented | `REBUILD` |
| ONB-05 | `/onboarding/5` | 합성 마이데이터 동의·연결 상태 | onboarding draft | MVP | Implemented | `REBUILD` |
| ONB-06 | `/onboarding/baseline` | 기준선 진단 후 목표 설정/탐색 선택 | `completeOnboarding` | MVP | Implemented | `REBUILD` |
| GOAL-01 | `/goal/confirm` | 목표 이름·현재값·목표값·목표 월 확정 | `confirmUserGoal` | MVP | Implemented | `REBUILD` |

## 홈·리포트

| Screen ID | Route proposal | 화면 책임 | 계약 기준 | MVP 상태 | Web 상태 | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| HOME-01 | `/home` | 목표 없는 빈 레이드와 메이트 탐색·목표 설정 진입 | `getHome` with `EXPLORE_ONLY` | MVP | Implemented | `REBUILD` |
| HOME-02 | `/home` | 목표·자동 레이드·네 동물·루틴·추천 퀘스트·동기화 | `getHome`, `getCurrentRaid` | MVP | Implemented | `REFINE` |
| REPORT-01 | `/report?type=:reportType` | 곰·물개·토끼·새의 실제값·산정 이유·30일 추세 | `getCharacterReport` | MVP | Implemented | `REFINE` |
| HOME-03 | `/goal/complete` | 200만→500만원 달성 근거와 다음 목표 | `getHome`, demo fixture | MVP fixture | Implemented | `REBUILD` |

## 퀘스트

| Screen ID | Route proposal | 화면 책임 | 계약 기준 | MVP 상태 | Web 상태 | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| QUEST-01 | `/quests` | 요약·진행 중·추천·반영 대기·완료 | `listQuests` | MVP | Implemented | `REFINE` |
| QUEST-02 | `/quests/:questId` | 현재값·목표값·검증 방식·XP 확인 후 수락 | `getQuest`, `acceptQuest` | MVP | Implemented | `REBUILD` |

## 메이트

| Screen ID | Route proposal | 화면 책임 | 계약 기준 | MVP 상태 | Web 상태 | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| MATE-01 | `/mates/friends` | 오늘 완료 N/M, 금액 없는 근황, 공개 루틴 연속기록 | `getMateFriendOverview`, `getMateFriendFeed`, `getMateStreaks` | Synthetic read-only | Implemented | `REFINE` |
| MATE-02 | `/mates` | 내 유사그룹·목표 달성 그룹·분포·인기 루틴 | `listMateGroups` | MVP | Implemented | `REFINE` |
| MATE-03 | `/mates/explore` | 검수된 필터 조합으로 익명 모험가 탐색 | `searchMateAdventurers` | Synthetic read-only | Implemented | `REFINE` |
| MATE-04 | `/mates/group/:groupId` | 그룹 기준·표본·분포·달성 모험가 목록 | `getMateGroupReport`, `listRecommendedAdventurers` | MVP | Implemented | `REFINE` |
| MATE-05 | `/mates/group/:groupId/adventurer/:adventurerId` | 익명 맥락·유사 이유·달성 여부·루틴 유지기간 | `getRecommendedAdventurer` | MVP | Implemented | `REFINE` |
| MATE-06 | `/mates/group/:groupId/adventurer/:adventurerId/report` | 범위화된 나 vs 모험가 비교와 루틴 근거 | `getAdventurerReport` | MVP | Implemented | `REFINE` |
| ROUTINE-01 | `/routine/recommendation` | 추천 서브퀘스트 하나 우선, 강도 변경은 선택 | `createRoutineRecommendation` | MVP | Implemented | `REFINE` |
| ROUTINE-02 | `/routine/confirm` | 신규 적용 또는 기존 활성 루틴 교체 확인 | `importRoutineAdaptationCandidate`, `replaceActiveRoutineBuild` | MVP | Implemented | `REFINE` |
| PRODUCT-01 | `/products/:productId` | 검수된 하나 상품 조건·기준일·유의사항·공식 링크 | `getRelatedHanaProductInfo` | MVP info-only | Implemented | `REBUILD` |

친구 추가·팔로잉 관리와 자유 조건 검색은 `Deferred`다. 하나 상품 화면은 가입·신청
동작을 제공하지 않으며 열람 전후 XP·금융 스탯·레이드 값이 동일해야 한다.

## 기록·시연

| Screen ID | Route proposal | 화면 책임 | 계약 기준 | MVP 상태 | Web 상태 | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| RECORD-01 | `/record?month=YYYY-MM` | 월간 요약과 1~말일 대형 발판 여정 | `getDailyJourneyMonth` | MVP | Implemented | `KEEP` |
| RECORD-02 | `/record?month=YYYY-MM&date=YYYY-MM-DD` | 활동 목록·예산·퀘스트·데이터 반영 바텀시트 | `getDailyRecord` | MVP | Implemented | `REFINE` |
| DEMO-01 | `/demo` | 8월~1월 50만원×6회 합성 시간 진행 제어 | `advanceDemoTimeline` | Demo-only | Implemented | `REBUILD` |

## 대표 화면 연결

현재 웹과 실제 API에서 연결하고 검증하는 대표 수직 흐름은 다음과 같다.

```text
AUTH-01 → ONB-01~06 → GOAL-01 → HOME-02 → REPORT-01
→ MATE-01 → MATE-02 → MATE-03 → MATE-04 → MATE-05 → MATE-06
→ ROUTINE-01 → PRODUCT-01 → ROUTINE-02
→ QUEST-01 → QUEST-02 → RECORD-01 → RECORD-02 → DEMO-01 → HOME-03
```

아래는 승인된 전체 MVP IA 연결이다.

```text
AUTH-01
→ ONB-01 → ONB-02 → ONB-03 → ONB-04 → ONB-05 → ONB-06
→ GOAL-01
→ HOME-02
→ REPORT-01
→ QUEST-01 → QUEST-02
→ MATE-01 → MATE-02 → MATE-04 → MATE-05 → MATE-06
→ ROUTINE-01 → ROUTINE-02 → PRODUCT-01
→ RECORD-01 → RECORD-02
→ DEMO-01
→ HOME-03
```

`ONB-06 → HOME-01 → MATE-01/02/03`은 목표를 미룬 탐색 흐름이다. 이 상태에서
QUEST-02 수락, ROUTINE-01 적용, PRODUCT-01 개인화 진입을 시도하면 목표 필요
안내 후 GOAL-01로 이동해야 한다.

## 모든 화면의 필수 상태

- `loading`: 이전 값을 새 동기화 결과처럼 표시하지 않는다.
- `empty`: 무엇이 비었는지와 시작 행동 하나를 제공한다.
- `PENDING`: 퀘스트 행동 완료와 금융데이터 검증 대기를 분리한다.
- `STALE`: 마지막 동기화 시각과 복구 행동 하나를 제공한다.
- `INSUFFICIENT`: 부족한 데이터와 가능한 행동형 대안을 설명한다.
- `GOAL_REQUIRED`: 잠긴 이유와 목표 설정 행동을 제공한다.
- `error`: 입력 초안을 보존하고 재시도를 제공한다.
- `replacement confirmation`: 현재·새 루틴을 함께 보여주며 취소 시 현재 루틴을 유지한다.

## 완료 판정

화면은 다음 조건을 모두 만족해야 `Implemented`로 바꿀 수 있다.

1. 화면 ID와 route가 제품 IA에 연결된다.
2. OpenAPI 예시 fixture로 정상 흐름이 동작한다.
3. 위 공통 상태 중 해당 화면에 필요한 상태가 구현된다.
4. 360px·390px·430px에서 텍스트 잘림·겹침이 없다.
5. 목표와 루틴, 퀘스트 XP와 금융 성장, 상품 정보와 진행률이 섞이지 않는다.
6. Mock E2E와 실제 API E2E가 같은 사용자 흐름을 통과한다.
