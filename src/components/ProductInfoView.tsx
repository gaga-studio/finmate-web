import { ArrowLeft, CalendarDays, ExternalLink, Info, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Schema } from '../api/client'
import styles from './ProductInfoView.module.css'

export function ProductInfoView({ product }: { product: Schema['RelatedHanaProductInfo'] }) {
  return (
    <section className={styles.page}>
      <Link className={styles.back} to="/mates"><ArrowLeft size={19} />메이트로</Link>
      <header className={styles.hero}>
        <span>관련 금융 정보</span>
        <h1>{product.displayName}</h1>
        <p>{product.category} · {product.relatedRoutineDomain === 'SAVING' ? '저축 루틴 참고' : '생활 루틴 참고'}</p>
      </header>
      <aside className={styles.boundary}><ShieldCheck size={22} /><div><strong>루틴과 상품 정보는 분리돼요</strong><p>이 페이지를 열어도 XP, 금융 스탯, 레이드 진행률은 바뀌지 않아요.</p></div></aside>
      <section className={styles.card}>
        <div className={styles.title}><Info size={21} /><h2>주요 조건</h2></div>
        <ul>{product.keyConditions.map((condition) => <li key={condition}>{condition}</li>)}</ul>
      </section>
      <section className={styles.card}>
        <div className={styles.title}><ShieldCheck size={21} /><h2>확인할 점</h2></div>
        <ul>{product.cautions.map((caution) => <li key={caution}>{caution}</li>)}</ul>
      </section>
      <div className={styles.asOf}><CalendarDays size={18} /><span>정보 기준일 {product.informationAsOf}</span><strong>{product.reviewedCatalog ? '검수 카탈로그' : '확인 필요'}</strong></div>
      <a className={styles.official} href={product.officialInformationUrl} target="_blank" rel="noreferrer">공식 정보에서 확인<ExternalLink size={19} /></a>
      <p className={styles.disclaimer}>앱 안에서는 가입할 수 없으며, 최종 조건은 공식 정보를 다시 확인해야 해요.</p>
    </section>
  )
}
