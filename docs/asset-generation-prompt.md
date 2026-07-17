# FinMate 턴제 배틀 에셋 생성·연동 사양

홈 레이드의 파티 4종과 과소비 보스를 상태별 스프라이트로 생성할 때 사용하는 기준이다. 새 이미지는 기존 캐릭터를 교체하는 리디자인이 아니라, 현재 정체성을 보존한 턴제 전투 포즈 확장이다.

## 1. 정체성 참조

각 캐릭터의 기존 홈 이미지와 공격 이미지를 정체성 참조로 사용한다. 메이트 이미지나 텍스트 설명만으로 새 캐릭터를 재해석하지 않는다.

| stem | 이름·역할 | 반드시 유지할 요소 |
| --- | --- | --- |
| `invest` | 든든곰 · 소비 방어력 | 노란 곰, 크림색 배와 주둥이, 초록 스카프, 갈색 배낭, 파란 구슬 나무 지팡이 |
| `save` | 모아씰 · 저축 HP | 파란 회색 수호자, 흰 배와 주둥이, 은빛 망토, 빨간 하트 방패, 짧은 검 |
| `consume` | 살펴토끼 · 투자 판단력 | 흰 토끼, 민트 모자와 탐험복, 갈색 배낭과 클립보드 |
| `mission` | 해냄새 · 퀘스트 XP | 연보라 새, 둥근 검정 안경, 청록색 겉옷, 낡은 가죽 책 |
| `boss` | 과소비 보스 | 캐러멜색 컵 몸체, 크림색 테두리, 불투명한 얼음 결정, 굽은 갈색 빨대, 주먹과 발, 금색 장식, 빈 육각 가슴판 |

보스 가슴판에는 글자를 생성하지 않는다. 보스 이름은 앱의 별도 이름판이 표시한다.

## 2. 스타일·방향

- 둥근 3D 클레이 수집형 완구, 파스텔 재질, 큰 눈, 볼터치, 손으로 다듬은 듯한 표면을 사용한다.
- 조명은 좌상단 소프트 스튜디오 라이트로 통일한다.
- `idle-right`, `attack-right`는 오른쪽 적을 바라보는 전투형 3/4 측면이다. 양쪽 눈은 보이되 코·부리·몸·발의 방향이 오른쪽으로 읽혀야 한다.
- `boss-idle-left`, `boss-hit-left`는 왼쪽 파티를 바라보는 전투형 3/4 측면이다.
- `victory`는 정면이며 발을 바닥에 둔다. 점프 포즈를 사용하지 않는다.
- 이미지 내부에는 텍스트, 워터마크, 바닥, 접지 그림자, 드롭 섀도, 반사면을 넣지 않는다.
- 특정 애니메이션 스튜디오나 브랜드 이름으로 스타일을 지시하지 않는다.

## 3. 생성 파일

최종 파일은 `public/assets/home/turn/`에 둔다.

```text
invest-idle-right.png
invest-attack-right.png
invest-victory.png
save-idle-right.png
save-attack-right.png
save-victory.png
consume-idle-right.png
consume-attack-right.png
consume-victory.png
mission-idle-right.png
mission-attack-right.png
mission-victory.png
boss-idle-left.png
boss-hit-left.png
boss-defeated.png
```

토끼 공격은 클립보드를 앞으로 내미는 분석 대시이고, 새 공격은 책을 펼치는 주문 동작이다. 총기·맨주먹·발사체를 추가하지 않는다.

## 4. 이미지 모델 공통 프롬프트

아래 블록을 기본으로 사용하고, 캐릭터 표의 정체성과 상태별 동작만 교체한다.

```text
Use case: stylized-concept
Asset type: FinMate mobile turn-based battle character sprite
Primary request: Create a NEW full-body sprite of the exact character from the
provided identity reference. Preserve the face, proportions, palette, costume,
accessories, props, and material language.
Style/medium: premium rounded 3D clay collectible toy render, soft pastel
materials, subtle handcrafted surface, large expressive eyes.
Composition/framing: one isolated full-body character, compact near-square
silhouette, centered with generous padding on every side.
Lighting/mood: soft studio light from upper left, friendly and readable at small
mobile size.
Constraints: no cast shadow, no contact shadow, no floor plane, no reflection,
no detached particles, no text, no logo, no watermark.
```

상태별 동작은 다음으로 고정한다.

- `idle`: 발을 딛고 준비 자세를 취한다. 파티는 오른쪽, 보스는 왼쪽을 본다.
- `attack`: 파티는 오른쪽으로 한 걸음 기울인다. 캐릭터 고유 소품을 몸 가까이 유지해 세로가 가로보다 긴 컴팩트한 실루엣을 만든다.
- `victory`: 정면, 두 발 고정, 한쪽 또는 양쪽 팔·날개를 올리고 기존 소품을 유지한다.
- `boss-hit`: 왼쪽을 본 채 오른쪽으로 살짝 움찔하고 눈을 감는다.
- `boss-defeated`: 왼쪽을 향한 상태에서 무릎과 팔을 늘어뜨리고 채도를 소폭 낮춘다.

## 5. 투명 배경과 정규화

내장 이미지 생성은 평면 크로마키 배경을 사용한다. 초록색 캐릭터 요소가 있는 `invest`와 `consume`은 `#ff00ff`, 나머지는 `#00ff00`을 사용한다. 배경은 단색이어야 하며 피사체에 같은 키 컬러를 사용하지 않는다.

배경 제거는 설치된 공통 도구를 사용한다.

```bash
uv run --with pillow python \
  "${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/remove_chroma_key.py" \
  --input <generated.png> \
  --out <alpha.png> \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 12 \
  --opaque-threshold 220 \
  --despill
```

제거한 15장을 정규화한다.

```bash
uv run --with pillow python scripts/normalize-turn-assets.py \
  --source <alpha-directory> \
  --destination public/assets/home/turn
```

정규화 계약:

| 구분 | 캔버스 | 중심 | 기준선 | 안전 여백 | 실루엣 높이 |
| --- | --- | --- | --- | --- | --- |
| 파티 | 512×512 RGBA | x=256 | y=460 | 40px | 400~420px |
| 보스 | 768×768 RGBA | x=384 | y=690 | 60px | 600~630px |

공격 소품 때문에 40px 여백과 최소 높이를 동시에 충족하지 못하면 계약을 완화하거나 CSS로 숨기지 않고 더 컴팩트한 포즈를 다시 생성한다.

## 6. 코드 상태 연결

`HomeRaidScene`은 다음 우선순위로 파일을 읽는다.

- 파티: 레이드 클리어 `victory` → 현재 공격자 `attack-right` → 나머지 `idle-right`
- 보스: 레이드 클리어 `defeated` → 피격 중 `hit-left` → 나머지 `idle-left`
- 공격 교체 시간 0.7초, 보스 피격 시간 0.3초는 기존 전투 타이밍을 유지한다.

파일 실패는 경로 단위로 격리한다.

- 파티 승리 실패: 새 대기 → 기존 `home-char-{stem}.png`
- 파티 공격 실패: 기존 공격 → 새 대기 → 기존 대기
- 보스 상태 실패: 기존 `home-boss.png`
- 모든 후보 실패: 기존 이모지 fallback

새 보스 스프라이트 자체가 왼쪽을 보므로 CSS 좌우 반전을 적용하지 않는다. 격파 이미지는 포즈와 채도를 직접 표현하므로 강제 회전과 흑백 필터도 적용하지 않는다.

## 7. 납품 검증

```bash
npm run test:assets
shasum -a 256 -c docs/turn-assets.sha256
npm test
npm run typecheck
npm run lint
npm run build
```

`test:assets`는 15개 파일의 존재, PNG/alpha, 캔버스, 기준선, 안전 여백, 실루엣 높이와 중심을 검사한다. 기존 `docs/frontend-v2-assets.sha256`의 58개 자산은 변경하지 않는다.
