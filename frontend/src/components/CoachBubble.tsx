/**
 * 시그니처 컴포넌트 4.8 — AI 코치 말풍선.
 * 분석기가 아니라 행동 추천기 — 항상 미션 CTA로 끝난다.
 */
export function CoachBubble({
  message,
  ctaLabel,
  onCta,
}: {
  message: string
  ctaLabel: string
  onCta: () => void
}) {
  return (
    <div className="fm-coach-row">
      <span className="fm-coach-avatar" aria-hidden="true">
        <img src="/assets/characters/finmate-coach.png" alt="" draggable={false} />
      </span>
      <div className="fm-coach-bubble">
        <p>{message}</p>
        <button className="fm-coach-cta" type="button" onClick={onCta}>
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}
