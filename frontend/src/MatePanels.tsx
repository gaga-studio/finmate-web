import { useState } from 'react'
import type { Navigate } from './navigation'
import { Chevron, IconBadge } from './uiPrimitives'
import {
  MateAvatar,
  MateCoachCard,
  MateGaugeBar,
  RpgIcon,
  MateSectionCard,
  MateStatBadge,
  type MateAnonymousProfile,
  type MateExploreFilterKey,
  type MateExploreFilters,
  mateAdventurer,
  mateAnonymousProfiles,
  mateFeedItems,
  mateExploreDefaultFilters,
  mateExploreFilters,
  mateFriendInsights,
  mateFriendSignals,
  mateFriendSlots,
  mateHabitSummary,
  matePopularGear,
  matePositionGauges,
  mateSimilarGroup,
  mateStreaks,
} from './MateShared'

/** 메이트 탭 · "친구" — UI_메이트.png */
export function MateFriendsPanel({ navigate }: { navigate: Navigate }) {
  const doneCount = mateFriendSlots.filter((slot) => slot.done).length

  return (
    <div className="mate-tab-stack">
      <MateSectionCard
        className="mate-friend-summary"
        eyebrowIcon="profile"
        title={<>친구 {mateFriendSlots.length}명 중 <b style={{ color: 'var(--teal-600)' }}>{doneCount}</b>명이</>}
        subtitle="오늘의 퀘스트를 완료했어요"
        action={
          <div className="mate-friend-slots">
            {mateFriendSlots.map((slot) => (
              <MateAvatar
                key={slot.id}
                species={slot.species}
                size={54}
                fit="contain"
                locked={!slot.done}
                badge={slot.done ? <CheckGlyph /> : undefined}
              />
            ))}
          </div>
        }
      />

      <MateSectionCard
        eyebrowIcon="spark"
        title="금융 근황 피드"
        action={<button className="mate-card-link" type="button" onClick={() => navigate('/profile/following')}>전체 보기<Chevron /></button>}
      >
        <div className="mate-feed-list">
          {mateFeedItems.map((item) => (
            <div className="mate-feed-item" key={item.id}>
              <MateAvatar species={item.species} size={48} fit="contain" />
              <span className="mate-feed-copy"><b>{item.name}</b>가 {item.text}</span>
              <span className={`mate-feed-stat ${item.tone}`}>{item.statLabel} {item.statValue}</span>
            </div>
          ))}
        </div>
      </MateSectionCard>

      <MateSectionCard
        className="mate-vs-card mate-friend-compare-card"
        eyebrowIcon="chart"
        title="친구들과 나 비교"
        subtitle="금액이 아니라 친구들이 실제로 시작한 금융 행동을 비교해요"
        action={<button className="mate-card-link" type="button" onClick={() => navigate('/compare/results/cmp-001')}>리포트 보기<Chevron /></button>}
      >
        <div className="mate-friend-compare-hero">
          <div className="mate-friend-compare-me">
            <strong>나</strong>
            <MateAvatar species="me" size={104} fit="contain" className="mate-friend-me-avatar" />
            <div className="mate-friend-me-tags">
              <span>청약 없음</span>
              <span>여행저축 준비</span>
              <span>ETF 미시작</span>
            </div>
          </div>
          <div className="mate-friend-compare-summary">
            <b>친구 5명 기준</b>
            <strong>내가 아직 안 한 행동 3개가 보여요</strong>
            <p>친구들은 작은 자동화부터 시작했고, 나는 여행저축만 준비 단계예요.</p>
          </div>
        </div>

        <div className="mate-friend-insight-grid">
          {mateFriendInsights.map((insight) => (
            <div className="mate-friend-insight-card" key={insight.id}>
              <IconBadge icon={insight.icon} tone="teal" />
              <span>
                <small>{insight.label}</small>
                <strong>{insight.value}</strong>
                <em>{insight.note}</em>
              </span>
            </div>
          ))}
        </div>

        <div className="mate-friend-signal-list">
          {mateFriendSignals.map((signal) => (
            <button className="mate-friend-signal-row" type="button" onClick={() => navigate('/compare/results/cmp-001')} key={signal.id}>
              <RpgIcon name={signal.icon} fallback={signal.fallback} size={42} />
              <span className="mate-friend-signal-copy">
                <strong>{signal.title}</strong>
                <small>{signal.subtitle}</small>
                <i><b>{signal.participants}명</b> / {signal.total}명</i>
              </span>
              <span className={`mate-friend-signal-status is-${signal.mine}`}>
                {signal.mine === 'done' ? '나도 완료' : signal.mine === 'ready' ? '준비 중' : '아직'}
              </span>
              <span className="mate-friend-signal-track" aria-hidden="true">
                <span style={{ width: `${Math.round((signal.participants / signal.total) * 100)}%` }} />
              </span>
            </button>
          ))}
        </div>

        <div className="mate-friend-fomo">
          <MateAvatar species="coach" size={52} fit="contain" className="mate-coach-avatar" />
          <p>친구들은 큰돈보다 작은 자동화부터 시작했어요. 지금은 청약 개념 확인과 ETF O/X 퀴즈를 붙이면 따라가기 쉬워요.</p>
          <button type="button" onClick={() => navigate('/missions/add')}>퀘스트 받기</button>
        </div>
      </MateSectionCard>

      <MateSectionCard
        eyebrowIcon="gift"
        title="연속기록"
        action={<button className="mate-card-link" type="button" onClick={() => navigate('/profile/following')}>전체 보기<Chevron /></button>}
      >
        <div className="mate-streak-list">
          {mateStreaks.map((streak) => (
            <div className="mate-streak-row" key={streak.id}>
              <div className="mate-streak-avatars">
                <MateAvatar species={streak.a} size={52} fit="contain" />
                <MateAvatar species={streak.b} size={52} fit="contain" />
              </div>
              <div className="mate-streak-copy">
                <strong>🔥 {streak.name}</strong>
                <span>함께한 시간 {streak.duration}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mate-streak-note">오늘 퀘스트를 완료하면 연속기록이 이어져요!</p>
      </MateSectionCard>

      <div className="mate-banner">
        <MateAvatar species="coach" size={86} fit="contain" className="mate-coach-avatar" />
        <p>친구와 함께하면 금융 습관이 쑥쑥 자라요! 서로 응원하고 보상도 받아보세요 ✨</p>
      </div>
    </div>
  )
}

/** 메이트 탭 · "메이트 찾기" — UI_메이트_메이트찾기.png */
export function MateFindPanel({ navigate }: { navigate: Navigate }) {
  return (
    <div className="mate-tab-stack">
      <MateSectionCard eyebrowIcon="profile" title="나와 비슷한 그룹" className="mate-group-card">
        <div className="mate-group-copy">
          <p><IconBadge icon="profile" tone="teal" />{mateSimilarGroup.title}</p>
          <p><IconBadge icon="cafe" tone="warning" />{mateSimilarGroup.subtitle}</p>
        </div>
        <div className="mate-group-trio">
          <MateAvatar species="otter" size={86} fit="contain" />
          <MateAvatar species="rabbit" size={86} fit="contain" />
          <MateAvatar species="bear" size={86} fit="contain" />
        </div>
        <span className="mate-group-count">그룹 평균 {mateSimilarGroup.memberCount.toLocaleString('ko-KR')}명</span>
      </MateSectionCard>

      <MateSectionCard eyebrowIcon="chart" title="내 위치는 어떤가요?" subtitle="나 vs 또래 평균">
        <div className="mate-position-head">
          <div className="mate-position-col">
            <MateAvatar species="me" size={76} fit="contain" />
            <span>내 캐릭터</span>
          </div>
          <div className="mate-position-level">Lv.18<br />모험가</div>
          <div className="mate-position-col">
            <div className="mate-position-group">
              <MateAvatar species="bear" size={60} fit="contain" locked />
              <MateAvatar species="rabbit" size={60} fit="contain" locked />
              <MateAvatar species="otter" size={60} fit="contain" locked />
            </div>
            <span>또래 평균</span>
          </div>
        </div>
        <div className="mate-vs-gauges">
          {matePositionGauges.map((gauge) => (
            <MateGaugeBar
              key={gauge.id}
              label={gauge.label}
              mine={gauge.mine}
              other={gauge.other}
              otherLabel="또래 평균"
              highlight={gauge.highlight}
            />
          ))}
        </div>
        <div className="mate-gauge-legend">
          <span><i className="mine" />나</span>
          <span><i className="other" />또래 평균</span>
        </div>
      </MateSectionCard>

      <MateSectionCard
        eyebrowIcon="stocks"
        title="이 그룹의 인기 장비"
        action={<button className="mate-card-link" type="button" onClick={() => navigate('/compare/filter')}>전체 보기<Chevron /></button>}
      >
        <div className="mate-gear-list">
          {matePopularGear.map((gear) => (
            <button className="mate-gear-row" type="button" key={gear.id} onClick={() => navigate('/compare/filter')}>
              <RpgIcon name={gear.icon} fallback={gear.fallback} size={38} />
              <span className="mate-gear-copy">
                <strong>{gear.title}</strong>
                <small>{gear.subtitle}</small>
              </span>
              <span className="mate-gear-usage">사용 중 {gear.usage}%<Chevron /></span>
            </button>
          ))}
        </div>
      </MateSectionCard>

      <MateCoachCard message="저축 HP는 튼튼한데, 방어력 관리가 조금 더 필요해요." />

      <div className="mate-insight-grid">
        <div className="mate-insight-card">
          <p>저축 HP는<br />유사 그룹 <b>상위 40%</b>예요!</p>
        </div>
        <div className="mate-insight-card alt">
          <p>소비 방어력은<br /><b>조금 더 강화</b>가 필요해요.</p>
        </div>
      </div>
    </div>
  )
}

/** 메이트 탭 · "비교 탐색" — UI_메이트_익명필터링.png */
export function MateExplorePanel({ navigate }: { navigate: Navigate }) {
  const [filters, setFilters] = useState<MateExploreFilters>(mateExploreDefaultFilters)
  const [openFilter, setOpenFilter] = useState<MateExploreFilterKey | null>(null)
  const [view, setView] = useState<'filters' | 'results' | 'detail'>('filters')
  const [selectedProfile, setSelectedProfile] = useState<MateAnonymousProfile | null>(null)

  const results = filterAnonymousProfiles(filters)
  const selectedFilterCount = mateExploreFilters.filter((filter) => filters[filter.id] !== '전체').length

  const resetFilters = () => {
    setFilters(mateExploreDefaultFilters)
    setOpenFilter(null)
  }

  const selectFilter = (key: MateExploreFilterKey, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }))
    setOpenFilter(null)
  }

  if (view === 'results') {
    return (
      <div className="mate-tab-stack mate-explore-results-stack">
        <section className="mate-card mate-explore-results-head">
          <button className="mate-card-link mate-back-link" type="button" onClick={() => setView('filters')}>‹ 조건 수정</button>
          <div>
            <span>검색 결과</span>
            <h2>익명 프로필 {results.length}명</h2>
            <p>{selectedFilterCount}개 조건으로 금융 습관이 비슷한 메이트를 찾았어요.</p>
          </div>
        </section>

        {results.length > 0 ? (
          <div className="mate-anonymous-list">
            {results.map((profile) => (
              <button
                className="mate-anonymous-card"
                type="button"
                onClick={() => {
                  setSelectedProfile(profile)
                  setView('detail')
                }}
                key={profile.id}
              >
                <MateAvatar species={profile.species} size={82} fit="contain" className="mate-anonymous-avatar" />
                <span className="mate-anonymous-copy">
                  <span className="mate-adventurer-match">매칭도 {profile.matchPercent}%</span>
                  <strong>{profile.name} · {profile.age}세</strong>
                  <small>{profile.tagline}</small>
                  <span className="mate-anonymous-stat-strip">
                    {profile.snapshot.slice(0, 2).map((item) => <i key={item.label}>{item.label} {item.value}</i>)}
                  </span>
                </span>
                <Chevron />
              </button>
            ))}
          </div>
        ) : (
          <section className="mate-card mate-empty-profile-card">
            <RpgIcon name="shield" fallback="검색" size={54} />
            <strong>조건에 맞는 익명 프로필이 없어요</strong>
            <p>조건을 하나 넓히면 더 많은 메이트를 볼 수 있어요.</p>
            <button className="app-button secondary" type="button" onClick={() => setView('filters')}>조건 다시 고르기</button>
          </section>
        )}
      </div>
    )
  }

  if (view === 'detail' && selectedProfile) {
    return (
      <div className="mate-tab-stack mate-profile-detail-stack">
        <section className="mate-card mate-anonymous-detail-card">
          <button className="mate-card-link mate-back-link" type="button" onClick={() => setView('results')}>‹ 목록으로</button>
          <div className="mate-anonymous-detail-hero">
            <MateAvatar species={selectedProfile.species} size={148} fit="contain" className="mate-adventurer-avatar" />
            <div>
              <span className="mate-adventurer-match">매칭도 {selectedProfile.matchPercent}%</span>
              <h2>{selectedProfile.name}</h2>
              <p>{selectedProfile.tagline}</p>
            </div>
          </div>
          <div className="mate-adventurer-badges">
            {selectedProfile.stats.map((stat) => (
              <MateStatBadge key={stat.label} icon={stat.icon} label={`${stat.label} ${stat.value}`} />
            ))}
          </div>
          <div className="mate-profile-snapshot-grid">
            {selectedProfile.snapshot.map((item) => (
              <div className="mate-profile-snapshot-item" key={item.label}>
                <IconBadge icon={item.icon} tone="teal" />
                <span>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                  <em>{item.caption}</em>
                </span>
              </div>
            ))}
          </div>
        </section>

        <MateSectionCard eyebrowIcon="fund" title="금융자산 상세">
          <div className="mate-asset-stack" aria-hidden="true">
            {selectedProfile.assets.map((asset) => (
              <span key={asset.id} className={`mate-asset-stack-segment mate-asset-stack-${asset.id}`} style={{ width: `${asset.sharePercent}%` }} />
            ))}
          </div>
          <div className="mate-asset-breakdown">
            {selectedProfile.assets.map((asset) => (
              <div className="mate-asset-line" key={asset.id}>
                <span>
                  <b>{asset.label}</b>
                  <small>{asset.sharePercent}% · {asset.note}</small>
                </span>
                <strong>{asset.amountLabel}</strong>
              </div>
            ))}
          </div>
        </MateSectionCard>

        <MateSectionCard eyebrowIcon="stocks" title="투자 상세">
          <div className="mate-money-line-list">
            {selectedProfile.investments.map((item) => (
              <div className="mate-money-line" key={item.name}>
                <span>
                  <b>{item.name}</b>
                  <small className={`mate-money-delta is-${item.deltaTone}`}>{item.deltaLabel}</small>
                </span>
                <strong>{item.amountLabel}</strong>
              </div>
            ))}
          </div>
        </MateSectionCard>

        <MateSectionCard eyebrowIcon="saving" title="저축·청약 상세">
          <div className="mate-money-line-list">
            {selectedProfile.savings.map((item) => (
              <div className="mate-money-line" key={item.name}>
                <span>
                  <b>{item.name}</b>
                  <small>{item.note}</small>
                </span>
                <strong>{item.amountLabel}</strong>
              </div>
            ))}
          </div>
        </MateSectionCard>

        <MateSectionCard eyebrowIcon="spend" title="소비 주요 항목">
          <div className="mate-spending-chip-list">
            {selectedProfile.spending.map((item) => (
              <div className="mate-spending-chip" key={item.category}>
                <span>{item.category}</span>
                <strong>{item.amountLabel}</strong>
                <small>{item.note}</small>
              </div>
            ))}
          </div>
        </MateSectionCard>

        <MateSectionCard eyebrowIcon="chart" title="이 익명 프로필의 금융 빌드">
          <p className="mate-anonymous-build-summary">{selectedProfile.buildSummary}</p>
          <div className="mate-habit-grid">
            {selectedProfile.habits.map((habit) => (
              <div className="mate-habit-card" key={habit.title}>
                <RpgIcon name={habit.icon} fallback={habit.fallback} size={42} />
                <strong>{habit.title}</strong>
                <p>{habit.desc}</p>
              </div>
            ))}
          </div>
        </MateSectionCard>

        <MateCoachCard
          name="AI 코치 포비"
          message="이 프로필의 행동을 그대로 복사하기보다, 여행 경비 목표에 맞는 루틴만 골라 적용해보세요."
        />

        <div className="mate-adventurer-actions">
          <button className="app-button primary" type="button" onClick={() => navigate('/compare/build')}>이 빌드 따라하기</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mate-tab-stack">
      <MateSectionCard
        eyebrowIcon="sliders"
        title="비교 조건 설정"
        className="mate-filter-card-head"
        action={<button className="mate-filter-reset" type="button" onClick={resetFilters}>초기화</button>}
      >
        <div className="mate-filter-grid">
          {mateExploreFilters.map((field) => (
            <button
              className={`mate-filter-field${openFilter === field.id ? ' is-open' : ''}`}
              type="button"
              aria-expanded={openFilter === field.id}
              onClick={() => setOpenFilter((current) => current === field.id ? null : field.id)}
              key={field.id}
            >
              <span className="mate-filter-field-label"><RpgIcon name={field.icon} fallback={field.fallback} size={28} />{field.label}</span>
              <strong>{filters[field.id]}</strong>
              <Chevron />
            </button>
          ))}
        </div>
        {openFilter ? (
          <div className="mate-filter-options" aria-label={`${mateExploreFilters.find((filter) => filter.id === openFilter)?.label ?? '조건'} 선택`}>
            {mateExploreFilters.find((filter) => filter.id === openFilter)?.options.map((option) => (
              <button
                className={filters[openFilter] === option ? 'is-active' : ''}
                type="button"
                aria-pressed={filters[openFilter] === option}
                onClick={() => selectFilter(openFilter, option)}
                key={option}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
        <div className="mate-filter-cta">
          <span>조건에 맞는 익명 프로필 {results.length}명을 찾았어요.</span>
          <button type="button" onClick={() => setView('results')}>검색하기</button>
        </div>
      </MateSectionCard>

      <section className="mate-card mate-adventurer-card">
        <div className="mate-adventurer-top">
          <span className="mate-adventurer-match">추천 매칭 {mateAdventurer.matchPercent}%</span>
          <button className="mate-adventurer-like" type="button" onClick={() => navigate('/compare/build')}>♡ 빌드 저장</button>
        </div>
        <div className="mate-adventurer-body">
          <MateAvatar species={mateAdventurer.species} size={118} fit="contain" className="mate-adventurer-avatar" />
          <div>
            <h2 className="mate-adventurer-name">{mateAdventurer.name} · {mateAdventurer.age}세</h2>
            <p className="mate-adventurer-tagline">{mateAdventurer.tagline}</p>
          </div>
        </div>
        <div className="mate-adventurer-badges">
          {mateAdventurer.badges.map((badge) => (
            <MateStatBadge key={badge.label} icon={badge.icon} label={badge.label} />
          ))}
        </div>
        <div className="mate-adventurer-actions">
          <button
            className="app-button secondary"
            type="button"
            onClick={() => {
              setSelectedProfile(mateAnonymousProfiles[0])
              setView('detail')
            }}
          >
            프로필 보기
          </button>
          <button className="app-button primary" type="button" onClick={() => navigate('/compare/build')}>빌드 따라하기</button>
        </div>
      </section>

      <MateSectionCard eyebrowIcon="chart" title="이 모험가의 습관 요약">
        <div className="mate-habit-grid">
          {mateHabitSummary.map((habit) => (
            <div className="mate-habit-card" key={habit.id}>
              <RpgIcon name={habit.icon} fallback={habit.fallback} size={42} />
              <strong>{habit.title}</strong>
              <p>{habit.desc}</p>
              <span className="mate-habit-pill">{habit.pill}</span>
            </div>
          ))}
        </div>
      </MateSectionCard>

      <MateCoachCard
        name="AI 코치 포비"
        message="비슷한 조건의 모험가를 참고하면 내 생활 패턴에 맞는 관리 방법을 찾는 데 도움이 돼요!"
      />
    </div>
  )
}

function filterAnonymousProfiles(filters: MateExploreFilters): MateAnonymousProfile[] {
  const strictResults = mateAnonymousProfiles.filter((profile) => mateExploreFilters.every((filter) => {
    const value = filters[filter.id]
    return value === '전체' || profile.filters[filter.id] === value
  }))

  if (strictResults.length >= 3) {
    return strictResults
  }

  const rankedResults = [...mateAnonymousProfiles]
    .map((profile) => ({
      profile,
      score: mateExploreFilters.reduce((sum, filter) => {
        const value = filters[filter.id]
        return value !== '전체' && profile.filters[filter.id] === value ? sum + 1 : sum
      }, 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.profile.matchPercent - a.profile.matchPercent)
    .map((entry) => entry.profile)

  const mergedResults = [...strictResults]
  rankedResults.forEach((profile) => {
    if (!mergedResults.some((item) => item.id === profile.id)) {
      mergedResults.push(profile)
    }
  })
  return mergedResults.slice(0, 4)
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 13 4 4L19 7" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
