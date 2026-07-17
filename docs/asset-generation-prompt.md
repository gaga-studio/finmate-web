# FinMate 턴제 배틀 에셋 생성 프롬프트 (Codex 전달용)

> 이 문서 전체를 Codex에게 전달하면 됩니다. 목표는 홈 레이드 배틀(턴제 RPG 진형)에 쓰는
> 캐릭터/보스 스프라이트를 **상태별 포즈로, 통일된 캔버스 계약** 아래 생성하는 것입니다.
> 생성물은 `public/assets/home/turn/`에 두고, 코드는 파일명 규약만으로 읽습니다.

## 0. 배경 — 왜 이 계약이 필요한가

현재 버그의 뿌리는 세 가지입니다.

1. **정면 시선**: 모든 캐릭터·보스가 정면(3/4 뷰)을 보고 있어, 좌우로 마주 보는 턴제 배틀 연출과 어색하게 충돌합니다.
2. **크기 점프**: 캐릭터마다 캔버스 크기·남는 여백이 달라(366×435~527×527) 같은 슬롯에서 시각 크기가 들쭉날쭉하고, 대기↔공격 스프라이트 교체 시 크기가 튑니다.
3. **잘린 소품**: 캔버스 가장자리에 지팡이 같은 소품이 닿아 있어 원형 크롭에서 잘려 보입니다.

아래 계약대로 뽑으면 이 세 가지가 모두 사라집니다.

## 1. 스타일 앵커 (반드시 유지)

- 기존 에셋과 같은 **3D 클레이/파스텔 렌더**: 둥근 실루엣, 솜씨 좋은 장난감 같은 질감, 큰 눈, 볼터치.
- 참고 원본(리포에 있음): `public/assets/characters/mate/mate-char-bear.png`, `mate-char-rabbit.png`, `mate-char-otter.png`, `mate-char-bird.png`, `public/assets/home/home-boss.png`.
- 조명: 좌상단 소프트 스튜디오 라이트. **그림자(드롭 섀도/바닥 그림자)를 아트에 구우지 말 것** — 코드에서 CSS로 처리합니다.
- 배경: 완전 투명 (alpha). 테두리선·워터마크·텍스트 금지.

## 2. 캔버스 계약 (가장 중요)

파티 캐릭터 4종은 전부 같은 계약을 지킵니다.

| 항목 | 값 |
| --- | --- |
| 캔버스 | 512×512 px, 투명 PNG |
| 발바닥 기준선 | y = 460 (모든 포즈에서 동일 — 점프 포즈도 기준선에 착지한 상태로) |
| 몸통 중심 | x = 256 |
| 시각적 신장 | 400~420 px (모든 캐릭터·모든 포즈에서 ±3% 이내) |
| 안전 여백 | 실루엣 어느 부분도 캔버스 가장자리 40px 안에 들어오지 않게 (무기·소품 포함) |
| 시선 | `*-right`는 오른쪽을, `*-left`는 왼쪽을 보는 옆모습(프로필 뷰) |

보스는 768×768 px로만 키우고 나머지 비율은 동일하게 적용합니다(기준선 y≈690, 중심 x=384).

## 3. 생성할 에셋 목록 (총 15장)

### 파티 4종 × 포즈 3종 = 12장 → `public/assets/home/turn/`

| 파일명 | 캐릭터 | 정체성(색/소품) |
| --- | --- | --- |
| `invest-idle-right.png` | 튼튼곰(소비 방어) | 노란 곰, 초록 스카프, 손에 나무 지팡이(파란 구슬) |
| `invest-attack-right.png` | 〃 | 지팡이를 앞으로 내찍는 돌진 자세 |
| `invest-victory.png` | 〃 | 정면, 두 팔 들어 환호 |
| `save-idle-right.png` | 모아썰(저축 HP) | 파란 물개, 하트 문양 방패, 망토 |
| `save-attack-right.png` | 〃 | 방패로 몸을 앞세워 밀어붙이는 자세 |
| `save-victory.png` | 〃 | 정면, 방패 들어 환호 |
| `consume-idle-right.png` | 살펴토끼(투자 판단) | 흰 토끼, 민트 모자·작업복, 클립보드 |
| `consume-attack-right.png` | 〃 | 클립보드를 앞으로 남미는 돌진 자세 |
| `consume-victory.png` | 〃 | 정면, 깡총 뛰어 환호 |
| `mission-idle-right.png` | 핵냄새(퀘스트 XP) | 연병라 새, 둥근 안경, 낡은 책 |
| `mission-attack-right.png` | 〃 | 책을 앞으로 펼치며 주문 캐스팅 자세 |
| `mission-victory.png` | 〃 | 정면, 날개 파닥이며 환호 |

### 보스 3장 → 같은 디렉터리

| 파일명 | 내용 |
| --- | --- |
| `boss-idle-left.png` | 파소비 나무그루터기 몬스터, 왼쪽(파티)을 노려보는 대기 자세, 이끼·버섯 디테일 |
| `boss-hit-left.png` | 같은 자세에서 피격으로 움찔(눈 감고 살짝 뒤로 젖힘) |
| `boss-defeated.png` | 주저앉아 축 늘어진 격파 자세, 채도 낮은 톤 |

## 4. 이미지 모델용 영문 프롬프트 블록 (각 에셋에 적용)

공통 접두사(모든 프롬프트 앞에 붙이기):

```text
3D clay render, Pixar-like collectible toy style, soft studio lighting from upper left,
pastel palette, transparent background, no ground shadow, full body visible,
side profile view facing right, feet baseline at y=460 of a 512x512 canvas,
body center at x=256, character height 410px, no props within 40px of canvas edges,
no text, no watermark, PNG with alpha channel
```

캐릭터별 본문(접두사 뒤에 이어 붙이기):

```text
[invest-idle-right] A brave yellow bear knight-cub with a green scarf, holding a wooden
staff with a blue orb, relaxed idle stance, gentle smile

[invest-attack-right] Same yellow bear character, mid-lunge thrusting the staff forward,
dynamic action pose, scarf flowing back

[invest-victory] Same yellow bear character, front view, jumping with both arms raised
in celebration, joyful open mouth

[save-idle-right] A gentle blue seal paladin with a small cape, holding a round shield
with a heart emblem, calm idle stance

[save-attack-right] Same blue seal character, charging forward behind the shield,
determined expression, cape flowing

[save-victory] Same blue seal character, front view, raising the shield high in triumph

[consume-idle-right] A clever white rabbit scholar in a mint cap and overalls, holding
a clipboard, curious idle stance

[consume-attack-right] Same white rabbit character, lunging forward presenting the
clipboard like a dash attack, ears flapping back

[consume-victory] Same white rabbit character, front view, hopping high with joy

[mission-idle-right] A wise lavender bird mage with round glasses, holding an old
leather book, composed idle stance

[mission-attack-right] Same lavender bird character, casting a spell with the book
opened forward, small sparkles

[mission-victory] Same lavender bird character, front view, flapping wings happily

[boss-idle-left] (side profile view facing LEFT, 768x768 canvas) A grumpy tree-stump
monster boss with moss and tiny mushrooms, glaring left, thick bark texture

[boss-hit-left] Same tree-stump monster, flinching from a hit, eyes squeezed shut,
slight backward recoil

[boss-defeated] Same tree-stump monster, slumped and defeated, desaturated tones,
drooping posture
```

## 5. 검수 체크리스트 (Codex가 납품 전 확인)

- [ ] 15장 모두 alpha 투명 PNG, 캔버스 크기 정확(파티 512², 보스 768²)
- [ ] 발바닥 기준선 y=460(보스 690)에 모든 포즈의 발이 닿아 있음
- [ ] 모든 캐릭터·포즈의 시각 신장이 400~420px로 일치
- [ ] 소품 포함 실루엣이 캔버스 가장자리 40px 밖
- [ ] `idle`/`attack`은 옆모습 프로필 뷰, `victory`만 정면
- [ ] 텍스트·워터마크·배경색 없음
- [ ] 배치: `public/assets/home/turn/` 아래 §3 표의 파일명 그대로

## 6. 코드 연동 (참고)

파일명 규약만 지키면 코드 변경 없이 플러그인됩니다. 앱은 상태별 스프라이트 맵으로 읽습니다.

- 대기: `{stem}-idle-right.png` (진형에서 적을 바라봄)
- 공격 턴: `{stem}-attack-right.png` (돌진 0.7s 동안 교체)
- 클리어: `victory.png` 파티 전체 환호 + `boss-defeated.png`
- 보스 피격: `boss-hit-left.png` 0.3s 플래시
