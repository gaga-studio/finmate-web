# 2026-07-14 프론트 디자인 인수 기록

## 인수 결과 요약

- 원본: `gaga-studio/finmate-frontend-v2`
- 고정 commit: `e7faff88b7469f742e5661b58306365cec391b65`
- 고정 tree: `28d6a65653b05ce773793b7e8d5d60492f1f5b45`
- 보존 branch: `design-handoff/2026-07-14`
- 보존 tag: `design-handoff-2026-07-14`
- 운영 이식 branch: `codex/integrate-design-handoff`

원본은 2026-07-14에 Git으로 받았고 수정 없이 별도 branch와 tag로 동결했다.
원본의 설치, lint, production build는 성공했다. 상세 결과는
[`HANDOFF_MANIFEST.md`](HANDOFF_MANIFEST.md)에 기록한다.

전달본은 화이트·민트 금융 UI, 3D 동물 에셋, 홈 전투 장면, 메이트 카드,
대형 발판 기록 화면의 시각 기준으로 사용한다. 아래 런타임 구조는 운영 코드로
가져오지 않는다.

- 구 `/api/app/*` API 계층과 자체 라우터
- 생일펀드, FOMO, 프로필을 포함한 5탭 IA
- 퀘스트 클릭이 금융 스탯이나 보스 진행률을 직접 올리는 규칙
- 포인트 잠금, 보상 상자, 코인·보석 충전, 투자 공격력
- 웹 저장소에 포함된 전체 합성 데이터와 오래된 destructive E2E

운영 이식 원칙은 `최신 OpenAPI·React Router·TanStack Query·MSW·제품 테스트를
유지하고 전달본의 토큰·에셋·레이아웃만 선별 적용`하는 것이다. 제품 정책이
다르면 시각을 유지하더라도 컴포넌트는 운영 구조에서 다시 구현한다.

## 대표 흐름 이식 결과

- 계약 기준: `gaga-studio/finmate-api`의 `codex/close-vnext-runtime-gaps`
  commit `f50deff7591eb674c768bb01eca3518b214f307b`
- 구현 범위: `가입 → 온보딩 → 목표 → 홈 레이드·동물 리포트 → 메이트 그룹·모험가
  → 루틴 적용·교체 → 퀘스트 → 기록·일일 바텀시트 → 데모 완료`
- 유지된 제품 규칙: 4탭, 주 목표 유지, 퀘스트 XP와 금융데이터 재계산 분리,
  루틴 교체 확인, 빈 미래 월과 마지막 동기화 상태
- 이번 이식 제외: 친구 상세, 비교 탐색, 하나 상품 정보, 개별 퀘스트 상세 등
  화면 인벤토리의 `Planned` 항목
- 배포 차단 조건: Paperlogy 폰트와 전달 이미지의 소유권·라이선스 서면 확인

최종 검증 수치와 화면별 상태는 [`HANDOFF_MANIFEST.md`](HANDOFF_MANIFEST.md)와
[`docs/screen-inventory.md`](docs/screen-inventory.md)에 기록한다.

## 1차 판정

| 범위 | 판정 | 이유 |
| --- | --- | --- |
| 화이트·민트·네이비·골드 시각 토큰 | `KEEP` | 현재 RPG 금융앱 방향과 일치 |
| 홈 배경과 곰·물개·토끼·새 에셋 | `KEEP` | 캐릭터 역할이 현재 IA와 일치 |
| 홈 전투 장면 | `REFINE` | 시각은 유지하되 자동전투·보상·과소비 보스 규칙 제거 필요 |
| 메이트 카드·그룹·모험가 레이아웃 | `REFINE` | 정확 금액·상품·종목·직접 스탯 상승 문구 정리 필요 |
| 퀘스트 목록 레이아웃 | `REFINE` | XP와 금융데이터 반영 대기를 분리해야 함 |
| 대형 발판 기록 여정 | `KEEP` | 현재 기록 IA와 가장 잘 일치 |
| 일일 기록 바텀시트 | `REFINE` | 직접 금융 스탯 보상 대신 재계산 결과를 표시해야 함 |
| 인증·온보딩·목표 확정 | `REBUILD` | 현재 6단계 온보딩·목표 후확정 계약으로 재구현 필요 |
| API·라우팅·Mock·E2E | `DROP` | 현재 vNext 계약 및 테스트와 불일치 |
| 생일펀드·FOMO·5번째 프로필 탭 | `DROP` | 현재 MVP와 IA에서 제외 |

화면 단위 판정은 [`docs/screen-inventory.md`](docs/screen-inventory.md)를 기준으로
추적한다.

## 인수 절차 원칙

디자인 구현 원본은 운영 코드와 섞기 전에 그대로 동결한다. 실제 소스를
받은 뒤에만 `design-handoff/2026-07-14` 브랜치와
`design-handoff-2026-07-14` 태그를 만든다.

## 인수 시 받을 자료

- 전체 소스와 lockfile
- Node.js 및 패키지 매니저 버전
- 설치·실행·빌드 명령
- `.env.example`과 Mock 데이터 설명
- 원본 이미지·아이콘·폰트 및 라이선스
- 화면·라우트 목록과 모바일 대응 범위
- Figma 링크와 핵심 인터랙션 녹화
- 미완성 화면, 알려진 오류, 임시 하드코딩 목록

## 원본 동결

Git 저장소로 받으면 원격 URL과 마지막 commit SHA를 기록한다. ZIP으로
받으면 파일명을 바꾸지 않고 SHA-256을 기록한다. 두 경우 모두
[`design-handoff-manifest-template.md`](docs/design-handoff-manifest-template.md)를
복사해 `HANDOFF_MANIFEST.md`로 작성한다.

원본은 아래 이름으로만 보존한다.

- branch: `design-handoff/2026-07-14`
- tag: `design-handoff-2026-07-14`

원본 브랜치에서는 포맷팅, 의존성 교체, 경로 수정도 하지 않는다. 실행에
필요한 조사 결과는 manifest에만 기록한다.

## 전수 감사

원본 브랜치에서 다음을 확인하고 결과를 manifest에 남긴다.

1. 설치·개발 서버·빌드 성공 여부
2. 화면별 진입 경로와 필요한 Mock 값
3. 사용 에셋·폰트·외부 라이선스
4. 모바일 360px, 390px, 430px에서 잘림과 겹침
5. 고정 API URL, 비밀값, 임의 금융 계산, 실명·계좌번호 포함 여부
6. 로딩·빈 화면·오류·오래된 데이터 상태 존재 여부
7. 접근성 이름, 키보드 이동, 색 대비의 기본 상태

## 선별 이식

운영 브랜치에 원본을 통째로 병합하지 않는다. 각 화면과 컴포넌트를
[`screen-inventory.md`](docs/screen-inventory.md)에 등록하고 다음 중 하나로
분류한다.

- `KEEP`: 구조와 시각을 그대로 이식
- `REFINE`: 시각 방향을 유지하고 상태·접근성·반응형을 보완
- `REBUILD`: 화면만 참고하고 운영 구조에서 다시 구현
- `DROP`: MVP에서 제외

이식 순서는 `디자인 토큰·공통 셸 → 인증·온보딩 → 홈 → 메이트 → 퀘스트
→ 기록`이다. API 호출은 `src/api`의 생성 타입과 공통 클라이언트만 사용한다.

## 완료 기준

- 원본 branch와 tag의 tree SHA가 처음 기록한 값과 동일하다.
- 모든 화면이 inventory에 등록되고 담당 상태가 지정됐다.
- Mock E2E와 실제 API E2E가 동일한 대표 흐름을 통과한다.
- 모바일 시각 검수와 접근성 기본 검수가 완료됐다.
- 인수 원본 없이도 `finmate-web`과 `finmate-api`만으로 실행할 수 있다.
