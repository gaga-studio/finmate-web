import type { AppMetric, AppScreenResponse, AppSection } from './types'
import type { Navigate } from './navigation'
import { AppIcon, IconBadge } from './uiPrimitives'
import { HOME_ASSET_DIR, HomeCharacterImg, HomeHPBar, homeParty, type HomePartyMember } from './HomeShared'
import './home.css'

type ReportTone = HomePartyMember['tone']

export function HomeCharacterReportPage({ screen, navigate }: { screen: AppScreenResponse; navigate: Navigate }) {
  const detail = screen.screenId.split(':')[1] ?? 'consume'
  const member = homeParty.find((item) => item.id === detail) ?? homeParty[0]
  const lead = sectionById(screen.sections, 'report-lead')
  const score = sectionById(screen.sections, 'report-score')
  const ai = sectionById(screen.sections, 'report-ai')
  const history = sectionById(screen.sections, 'report-history')
  const [mainMetric, ...subMetrics] = score?.metrics ?? []
  const scoreProgress = metricProgress(mainMetric)

  return (
    <div className={`screen screen-home-report tone-${member.tone}`}>
      <div className="home-report-status roadmap-status" aria-hidden="true">
        <strong>9:41</strong>
        <span><i /><i /><i /></span>
      </div>

      <header className="home-report-topbar">
        <button type="button" onClick={() => window.history.back()} aria-label="뒤로">
          <AppIcon name="back" />
        </button>
        <strong>{screen.title}</strong>
        <button type="button" onClick={() => navigate('/home')} aria-label="홈으로">
          <AppIcon name="home" />
        </button>
      </header>

      <section className="home-report-arena" aria-labelledby="home-report-title">
        <div className="home-report-arc" aria-hidden="true" />
        <div className="home-report-gridmark" aria-hidden="true" />
        <div className="home-report-character-wrap">
          <HomeCharacterImg
            src={`${HOME_ASSET_DIR}/home-char-${member.id}.png`}
            emoji={member.emoji}
            className="home-report-character"
            alt=""
          />
        </div>
      </section>

      <section className="home-report-sheet" aria-label={`${member.name} 캐릭터 능력치`}>
        <div className="home-report-nameplate">
          <span>{member.label}</span>
          <h1 id="home-report-title">{member.name}</h1>
          <p>{member.meaning}</p>
          <div className="home-report-hp">
            <HomeHPBar percent={scoreProgress} tone={member.id === 'invest' ? 'blue' : 'green'} />
            <strong>{mainMetric?.value ?? `${scoreProgress}점`}</strong>
          </div>
        </div>

        <div className="home-report-primary-stat">
          <div>
            <span>{mainMetric?.label ?? '능력치'}</span>
            <strong>{mainMetric?.value ?? `${scoreProgress}점`}</strong>
            <p>{lead?.subtitle ?? member.reportTitle}</p>
          </div>
          <div className="home-report-medal" aria-hidden="true">
            <AppIcon name={member.id === 'consume' ? 'spend' : member.id === 'save' ? 'saving' : member.id === 'invest' ? 'stocks' : 'check-square'} />
          </div>
        </div>

        <div className="home-report-stat-grid">
          {subMetrics.map((metric) => (
            <ReportStat metric={metric} tone={member.tone} key={metric.label} />
          ))}
        </div>

        <section className="home-report-ai-card">
          <div className="home-report-section-head">
            <IconBadge icon="spark" tone="teal" />
            <div>
              <span>AI 코치 분석</span>
              <strong>{ai?.title ?? 'AI 분석'}</strong>
            </div>
          </div>
          {ai?.subtitle ? <p>{ai.subtitle}</p> : null}
          <div className="home-report-action-row">
            <span>{ai?.metrics?.[0]?.value ?? '추천 행동 확인'}</span>
            <button type="button" onClick={() => navigate(ai?.actions?.[0]?.path ?? '/missions/add')}>
              {ai?.actions?.[0]?.label ?? '퀘스트 보기'}
            </button>
          </div>
        </section>

        <section className="home-report-history">
          <div className="home-report-section-head">
            <IconBadge icon={member.id === 'consume' ? 'cart' : 'calendar'} tone="teal" />
            <div>
              <span>점수 근거</span>
              <strong>{history?.title ?? '관련 기록'}</strong>
            </div>
          </div>
          <div className="home-report-history-list">
            {history?.items?.map((item) => (
              <button type="button" onClick={() => item.detailPath && navigate(item.detailPath)} key={item.id}>
                <IconBadge icon={item.icon ?? 'check'} tone={item.tone ?? 'teal'} />
                <span>
                  <strong>{item.title}</strong>
                  {item.subtitle ? <small>{item.subtitle}</small> : null}
                </span>
                <em>
                  {item.value}
                  {item.caption ? <small>{item.caption}</small> : null}
                </em>
              </button>
            ))}
          </div>
        </section>
      </section>

    </div>
  )
}

function ReportStat({ metric, tone }: { metric: AppMetric; tone: ReportTone }) {
  const progress = metricProgress(metric)
  return (
    <div className="home-report-stat">
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
      {metric.caption ? <small>{metric.caption}</small> : null}
      <div className="home-report-stat-bars" data-tone={tone} aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <i className={progress >= (index + 1) * 33 ? 'is-filled' : ''} key={index} />
        ))}
      </div>
    </div>
  )
}

function metricProgress(metric?: AppMetric | null) {
  return Math.max(0, Math.min(100, metric?.progress ?? 0))
}

function sectionById(sections: AppSection[], id: string) {
  return sections.find((section) => section.id === id)
}
