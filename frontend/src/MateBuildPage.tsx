import { useMemo, useState } from 'react'
import type { Navigate } from './navigation'
import { IconBadge, IconButton, BottomNav } from './uiPrimitives'
import { MateAvatar, MatePointPill, MateToggle, RpgIcon, mateBuildChart, mateBuildOptions, mateBuildProfile } from './MateShared'
import './mate.css'

/** 메이트 · "빌드 따라하기" 상세 화면 — UI_메이트_빌드.png */
export function MateBuildPage({ navigate }: { navigate: Navigate }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(mateBuildOptions.map((option) => [option.id, option.defaultOn])),
  )

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    navigate('/compare')
  }

  return (
    <div className="screen screen-compare compare-flow-screen mate-build-screen">
      <div className="mate-reference-status roadmap-status" aria-hidden="true">
        <strong>9:41</strong>
        <span><i /><i /><i /></span>
      </div>
      <header className="compare-flow-header">
        <IconButton icon="back" label="뒤로" onClick={goBack} />
        <h1>빌드 따라하기</h1>
        <div className="mate-build-top-actions">
          <MatePointPill value={12450} />
          <button className="mate-top-avatar-button" type="button" onClick={() => navigate('/profile')} aria-label="내 프로필">
            <MateAvatar species="me" size={52} fit="contain" className="mate-top-avatar" />
          </button>
        </div>
      </header>

      <section className="compare-flow-body mate-tab-stack">
        <div className="mate-build-profile">
          <MateAvatar species={mateBuildProfile.species} size={56} fit="contain" className="mate-build-profile-avatar" />
          <div>
            <strong>{mateBuildProfile.name}</strong>
            <span>{mateBuildProfile.meta}</span>
          </div>
          <button className="mate-card-link" type="button" onClick={() => navigate('/compare/filter')}>자세히 보기</button>
        </div>

        <section className="mate-card">
          <header className="mate-card-head">
            <div className="mate-card-head-title">
              <IconBadge icon="spark" tone="warning" />
              <div>
                <h2>이 빌드를 적용할 항목을 선택하세요</h2>
              </div>
            </div>
          </header>
          <div className="mate-option-list">
            {mateBuildOptions.map((option) => (
              <div className="mate-option-row" key={option.id}>
                <RpgIcon name={option.icon} fallback={option.fallback} size={40} />
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.desc}</small>
                </span>
                <MateToggle
                  checked={enabled[option.id] ?? false}
                  label={option.title}
                  onChange={(next) => setEnabled((state) => ({ ...state, [option.id]: next }))}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mate-card">
          <header className="mate-card-head mate-chart-card-head">
            <div className="mate-card-head-title">
              <IconBadge icon="chart" tone="teal" />
              <div>
                <h2>6개월 후, 이런 변화가 기대돼요!</h2>
                <p>습관을 바꾸면 모험의 결과가 달라져요</p>
              </div>
            </div>
            <span className="mate-chart-badge">
              <b>+{mateBuildChart.hpGainMonths}</b>개월 HP
              <br />더 회복될 예상!
            </span>
          </header>
          <MateGrowthChart />
          <div className="mate-chart-legend">
            <span><i className="mine" />빌드 적용 시</span>
            <span><i className="other" />지금 습관대로</span>
          </div>
        </section>

        <section className="mate-card mate-preview-card">
          <div className="mate-preview-col">
            <MateAvatar species={mateBuildProfile.species} size={48} fit="contain" />
            <span>모험가 A</span>
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: 14, fontWeight: 800, color: 'var(--ink-800)' }}>모험가 A와 나란히 보기</strong>
            <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 700, color: 'var(--ink-500)' }}>나와 A의 예측 결과를 함께 비교해보세요</p>
          </div>
          <div className="mate-preview-col">
            <MateAvatar species="me" size={48} />
            <span>나</span>
          </div>
        </section>
      </section>

      <div className="compare-flow-bottom-cta">
        <button className="app-button primary compare-flow-primary" type="button" onClick={() => navigate('/missions/add')}>
          ✨ 이 빌드로 퀘스트 시작하기
        </button>
        <p className="mate-build-note">예측은 습관 기준 추정이에요</p>
      </div>
      <BottomNav active="compare" navigate={navigate} />
    </div>
  )
}

function MateGrowthChart() {
  const { months, withBuild, asIs } = mateBuildChart
  const geometry = useMemo(() => buildChartGeometry(withBuild, asIs), [withBuild, asIs])
  const { leftPad, chartWidth, chartHeight, topPad, viewW, viewH, withBuildPoints, asIsPoints, ticks, areaPath } = geometry

  return (
    <div className="mate-chart-svg-wrap">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} role="img" aria-label="6개월 자산 변화 예측 그래프">
        {ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={leftPad}
              x2={leftPad + chartWidth}
              y1={tick.y}
              y2={tick.y}
              stroke="var(--line)"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <text x={leftPad - 8} y={tick.y + 3} textAnchor="end" fontSize="9" fill="var(--ink-400)" fontWeight={700}>
              {tick.label}
            </text>
          </g>
        ))}
        <path d={areaPath} fill="var(--teal-50)" />
        <polyline points={asIsPoints} fill="none" stroke="var(--ink-300)" strokeWidth={2.5} strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={withBuildPoints} fill="none" stroke="var(--teal)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        {months.map((month, index) => {
          const x = leftPad + (index / (months.length - 1)) * chartWidth
          return (
            <text key={month} x={x} y={topPad + chartHeight + 14} textAnchor="middle" fontSize="8.5" fill="var(--ink-400)" fontWeight={700}>
              {index === 0 ? '현재' : `${index}개월`}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

function buildChartGeometry(withBuild: number[], asIs: number[]) {
  const leftPad = 34
  const rightPad = 6
  const topPad = 10
  const bottomPad = 22
  const chartWidth = 280
  const chartHeight = 108
  const viewW = leftPad + chartWidth + rightPad
  const viewH = topPad + chartHeight + bottomPad

  const values = [...withBuild, ...asIs]
  const rawMin = Math.min(...values)
  const rawMax = Math.max(...values)
  const yMin = Math.floor((rawMin - 10) / 50) * 50
  const yMax = Math.ceil((rawMax + 10) / 50) * 50

  const toPoint = (value: number, index: number, total: number) => {
    const x = leftPad + (index / (total - 1)) * chartWidth
    const y = topPad + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight
    return { x, y }
  }

  const withBuildPointList = withBuild.map((value, index) => toPoint(value, index, withBuild.length))
  const asIsPointList = asIs.map((value, index) => toPoint(value, index, asIs.length))

  const withBuildPoints = withBuildPointList.map((point) => `${point.x},${point.y}`).join(' ')
  const asIsPoints = asIsPointList.map((point) => `${point.x},${point.y}`).join(' ')

  const baseline = topPad + chartHeight
  const areaPath = `M${withBuildPointList[0].x},${baseline} ${withBuildPointList.map((point) => `L${point.x},${point.y}`).join(' ')} L${withBuildPointList[withBuildPointList.length - 1].x},${baseline} Z`

  const tickCount = 4
  const ticks = Array.from({ length: tickCount }, (_, index) => {
    const value = yMin + ((yMax - yMin) / (tickCount - 1)) * (tickCount - 1 - index)
    const y = topPad + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight
    return { value, y, label: `${Math.round(value / 10) * 10}만` }
  })

  return { leftPad, chartWidth, chartHeight, topPad, viewW, viewH, withBuildPoints, asIsPoints, ticks, areaPath }
}
