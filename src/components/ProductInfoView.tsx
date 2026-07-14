import { ArrowLeft, CalendarDays, ExternalLink, Info, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Schema } from '../api/client'
import { MateSectionCard, RpgIcon } from '../design-v2/MateShared'

export function ProductInfoView({ product }: { product: Schema['RelatedHanaProductInfo'] }) {
  return (
    <section className="screen screen-compare compare-flow-screen product-info-screen">
      <header className="compare-flow-header"><Link className="mate-back-link" to="/mates"><ArrowLeft size={19}/>메이트로</Link><h1>하나 상품 정보</h1></header>
      <section className="compare-flow-body mate-tab-stack"><section className="mate-card product-info-hero"><RpgIcon name="piggy" fallback="₩" size={72}/><span className="mate-adventurer-match">관련 금융 정보</span><h1>{product.displayName}</h1><p>{product.category} · {product.relatedRoutineDomain === 'SAVING' ? '저축 루틴 참고' : '생활 루틴 참고'}</p></section>
      <aside className="mate-banner"><ShieldCheck size={22}/><p><strong>루틴과 상품 정보는 분리돼요.</strong> 이 페이지를 열어도 XP, 금융 스탯, 레이드 진행률은 바뀌지 않아요.</p></aside>
      <MateSectionCard title="주요 조건" action={<Info size={21}/>}><ul className="mate-reason-list">{product.keyConditions.map((condition) => <li key={condition}>{condition}</li>)}</ul></MateSectionCard>
      <MateSectionCard title="확인할 점" action={<ShieldCheck size={21}/>}><ul className="mate-reason-list">{product.cautions.map((caution) => <li key={caution}>{caution}</li>)}</ul></MateSectionCard>
      <div className="product-as-of"><CalendarDays size={18}/><span>정보 기준일 {product.informationAsOf}</span><strong>{product.reviewedCatalog ? '검수 카탈로그' : '확인 필요'}</strong></div>
      <a className="app-button primary" href={product.officialInformationUrl} target="_blank" rel="noreferrer">공식 정보에서 확인<ExternalLink size={19}/></a>
      <p className="mate-build-note">앱 안에서는 가입할 수 없으며, 최종 조건은 공식 정보를 다시 확인해야 해요.</p></section>
    </section>
  )
}
