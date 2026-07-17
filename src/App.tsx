import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, ChevronLeft, Search, ShieldCheck, Target } from 'lucide-react'
import { ApiError, apiRequest, currentSession, type Schema } from './api/client'
import { getDemoExpectedFrameIndex, saveDemoExpectedFrameIndex } from './api/demoProgress'
import { getOnboardingDraft, saveGoalDraft, saveOnboardingAnswer } from './api/onboardingDraft'
import { useAcceptQuest, useActiveRoutine, useAdvanceDemo, useAdventurer, useAdventurerReport, useAdventurerRoutine, useAdventurers, useCharacterReport, useCompleteOnboarding, useCompleteQuest, useConfirmGoal, useCosmetics, useCreateRecommendation, useDailyJourney, useDailyRecord, useDisclosureConsent, useHanaProductInfo, useHome, useImportRoutine, useMateExploreSearch, useMateFriendFeed, useMateFriendOverview, useMateFriendStreaks, useMateGroupReport, useMateGroups, useOnboarding, usePointLedger, usePreviewDisclosure, useQuest, useQuests, useReplaceRoutine, useRaid, useUpdateDisclosure, useWithdrawDisclosure } from './api/queries'
import { HomeRaidScene } from './components/HomeRaidScene'
import { CharacterReportView } from './components/CharacterReportView'
import { MateDiscovery } from './components/MateDiscovery'
import { AdventurerRoutineIntro, MateGroupDetailView } from './components/MateJourneyViews'
import { RecordDaySheetView } from './components/RecordDaySheetView'
import { RecordJourneyMap } from './components/RecordJourneyMap'
import { AdventurerProfileView, AdventurerReportView, ExploreResults, FriendOverviewView, GroupInsightView, MateSectionNav, MateTopHeader } from './components/MateExtendedViews'
import { ProductInfoView } from './components/ProductInfoView'
import { QuestDetailView } from './components/QuestDetailView'
import { QuestOverviewView } from './components/QuestOverviewView'
import { AppShell, BottomNav, IconBadge } from './design-v2/primitives'
import { AppSectionCard, BottomSheet, ConsentRow, SectionHeading } from './design-v2/components'
import { MateAvatar, MatePointPill, MateSectionCard, RoutineSteps, RpgIcon } from './design-v2/MateShared'
import { toHomeBattleView } from './design-v2/viewModels'

const onboardingSteps = [
  { eyebrow: '생활 맥락', title: '지금의 생활 리듬은 어떤가요?', description: '소득과 주거 환경은 기준선과 유사그룹을 찾는 데만 사용해요.', choices: [{ value: 'REGULAR_RENT_MEDIUM', label: '정기 소득 · 자취 중이에요' }, { value: 'IRREGULAR_RENT_HIGH', label: '소득이 달마다 달라요' }, { value: 'NONE_WITH_FAMILY_LOW', label: '현재 정기 소득이 없어요' }] },
  { eyebrow: '돈 고민 진단', title: '가장 먼저 풀고 싶은 고민은?', description: '이 선택이 목표를 자동으로 만들지는 않아요.', choices: [{ value: 'SAVING', label: '저축을 꾸준히 하고 싶어요' }, { value: 'SPENDING', label: '소비 흐름을 점검하고 싶어요' }, { value: 'EMERGENCY_FUND', label: '비상금을 준비하고 싶어요' }, { value: 'INVESTMENT_JUDGMENT', label: '투자 판단의 기초를 배우고 싶어요' }] },
  { eyebrow: '금융 성향', title: '새로운 금융 행동을 시작할 때', description: '투자상품 추천이 아니라 설명 방식과 행동 강도를 조절해요.', choices: [{ value: 'CAUTIOUS', label: '충분히 이해한 뒤 천천히 시작해요' }, { value: 'BALANCED', label: '안전성과 실행을 함께 봐요' }, { value: 'EXPLORING', label: '여러 방법을 살펴보고 결정해요' }] },
  { eyebrow: '생활 태그', title: '나를 잘 설명하는 맥락은?', description: '메이트에게는 익명 태그만 보이고 정확한 금융값은 기본 비공개예요.', choices: [{ value: '자취|사회초년생', label: '자취 · 사회초년생' }, { value: '가족동거|대학생', label: '가족과 동거 · 대학생' }, { value: '가족동거|취업준비', label: '가족과 동거 · 취업준비' }] },
  { eyebrow: '마이데이터 연결', title: '합성 금융데이터를 연결할까요?', description: 'MVP에서는 실제 계좌가 아닌 합성데이터로 기준선과 레이드를 검증해요.', choices: [{ value: 'CONNECT_SYNTHETIC', label: '동의 범위를 확인하고 연결하기' }] },
] as const
const formatWon = (value: number) => `${new Intl.NumberFormat('ko-KR').format(value)}원`
const confettiColors = ['var(--teal)', '#FFD35C', '#FF8BA0', '#7BC96F', '#6EA8FF', '#C6B7F2']
/* 결정적 confetti 조각 배열 — 매 렌더 동일한 낙하 패턴을 유지한다. */
const confettiPieces = Array.from({ length: 42 }, (_, index) => ({
  left: (index * 41 + 7) % 100,
  delay: ((index * 7) % 16) * 0.24,
  duration: 3.6 + (index % 5) * 0.5,
  color: confettiColors[index % confettiColors.length],
  size: 6 + ((index * 5) % 4) * 3,
  round: index % 3 === 0,
}))
const formatSyncTime = (value?: string | null) => value ? new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : '확인 중'
const difficultyLabel = (difficulty: Schema['RoutineAdaptationCandidate']['difficulty']) => difficulty === 'LIGHT' ? '가볍게' : difficulty === 'STANDARD' ? '표준' : '도전'
const candidateTargetLabel = (candidate: Schema['RoutineAdaptationCandidate']) => candidate.targetKind === 'AMOUNT_KRW'
  ? `${(candidate.targetAmountKrw ?? 0).toLocaleString('ko-KR')}원`
  : candidate.targetKind === 'BASIS_POINTS'
    ? `${(candidate.targetBasisPoints ?? 0) / 100}%`
    : candidate.behaviorTarget ?? '행동 목표'
const onboardingCompletion = (): Schema['CompleteOnboardingRequest'] => {
  const answers = getOnboardingDraft().answers
  const context = answers[1] === 'IRREGULAR_RENT_HIGH'
    ? { incomeRegularity: 'IRREGULAR' as const, housingType: 'RENT' as const, fixedCostBurden: 'HIGH' as const }
    : answers[1] === 'NONE_WITH_FAMILY_LOW'
      ? { incomeRegularity: 'NONE' as const, housingType: 'WITH_FAMILY' as const, fixedCostBurden: 'LOW' as const }
      : { incomeRegularity: 'REGULAR' as const, housingType: 'RENT' as const, fixedCostBurden: 'MEDIUM' as const }
  const concern = (['SPENDING', 'SAVING', 'EMERGENCY_FUND', 'INVESTMENT_JUDGMENT'] as const).find((value) => value === answers[2]) ?? 'SAVING'
  const tendency = (['CAUTIOUS', 'BALANCED', 'EXPLORING'] as const).find((value) => value === answers[3]) ?? 'BALANCED'
  return {
    displayName: currentSession()?.user.displayName ?? '민지',
    context,
    moneyConcern: concern,
    financialTendency: tendency,
    lifestyleTags: answers[4]?.split('|') ?? ['자취', '사회초년생'],
    anonymousShareConsent: false,
    syntheticMyDataConsent: true,
    finishMode: 'EXPLORE_ONLY',
  }
}

function StateView({ state, onRetry }: { state: 'loading' | 'empty' | 'stale' | 'error'; onRetry?: () => void }) {
  const content = { loading: ['불러오는 중', 'MyData 결과와 루틴을 확인하고 있어요.'], empty: ['아직 쌓인 기록이 없어요', '오늘의 작은 선택부터 시작해 볼까요?'], stale: ['데이터가 조금 오래됐어요', '마지막 MyData 반영 결과를 표시하고 있어요.'], error: ['불러오지 못했어요', '잠시 후 다시 시도해 주세요.'] }[state]
  return <div className="screen screen-compare compare-flow-screen"><section className="compare-flow-body"><div className="empty-state-panel app-section-card"><IconBadge icon={state === 'error' ? 'shield' : 'spark'} tone={state === 'error' ? 'warning' : 'teal'}/><strong>{content[0]}</strong><p>{content[1]}</p>{onRetry && <button className="app-button secondary" onClick={onRetry}>다시 시도</button>}</div></section></div>
}

function DataStateNotice({ dataState, lastSyncedAt }: { dataState: Schema['DataState']; lastSyncedAt?: string | null }) {
  if (dataState === 'FRESH') return null
  const content = dataState === 'PENDING'
    ? ['새 데이터 반영 대기', '완료한 행동을 확인한 뒤 금융 상태를 다시 계산해요.']
    : dataState === 'STALE'
      ? ['데이터 업데이트 필요', '마지막으로 확인된 결과이며 새로운 진행은 잠시 멈춰요.']
      : ['분석 데이터 부족', '기록이 더 쌓일 때까지 가능한 행동형 퀘스트부터 안내해요.']
  return <aside className="mate-banner data-state-notice" role="status"><IconBadge icon="shield" tone={dataState === 'STALE' ? 'warning' : 'teal'}/><p><strong>{content[0]}</strong><span>{content[1]}{lastSyncedAt ? ` · 최근 동기화 ${formatSyncTime(lastSyncedAt)}` : ''}</span></p></aside>
}

function MobileShell({ children }: { children: React.ReactNode }) { return <>{children}</> }
function errorState(error: unknown): 'empty' | 'stale' | 'error' {
  if (error instanceof ApiError && error.code === 'DATA_STALE') return 'stale'
  if (error instanceof ApiError && error.code === 'DATA_INSUFFICIENT') return 'empty'
  return 'error'
}
function QueryState({ loading, error, retry }: { loading: boolean; error: unknown; retry: () => void }) { if (error instanceof ApiError && error.status === 401) return <Navigate to="/login" replace/>; return loading ? <MobileShell><StateView state="loading"/></MobileShell> : error ? <MobileShell><StateView state={errorState(error)} onRetry={retry}/></MobileShell> : null }

const utf8ByteLength = (value: string) => new TextEncoder().encode(value).byteLength
const passwordSchema = (minimum: number) => z.string().refine((value) => utf8ByteLength(value) >= minimum && utf8ByteLength(value) <= 72, `${minimum}-72바이트 비밀번호를 입력해 주세요.`)
const signupSchema = z.object({ displayName: z.string().trim().min(1, '이름을 입력해 주세요.').max(30, '이름은 30자 이하로 입력해 주세요.'), email: z.string().email('이메일을 확인해 주세요.'), password: passwordSchema(12) })
const loginSchema = z.object({ email: z.string().email('이메일을 확인해 주세요.'), password: passwordSchema(1) })
type AuthValues = { displayName?: string; email: string; password: string }

function AuthScreen({ login = false }: { login?: boolean }) {
  const navigate = useNavigate(); const [error, setError] = useState<unknown>(null)
  const form = useForm<AuthValues>({ resolver: zodResolver(login ? loginSchema : signupSchema), defaultValues: { displayName: '', email: '', password: '' } })
  const submit = async (values: AuthValues) => {
    try {
      const body = login ? { email: values.email, password: values.password } : { displayName: values.displayName?.trim() ?? '', email: values.email, password: values.password }
      const auth = await apiRequest<Schema['AuthSession']>(`/auth/${login ? 'login' : 'signup'}`, 'POST', body)
      navigate(auth.user.onboardingStatus === 'COMPLETED' ? '/home' : '/onboarding/1')
    } catch (nextError) { setError(nextError) }
  }
  const message = (value: unknown) => typeof value === 'string' ? value : null
  return <MobileShell><div className="screen auth-screen"><div className="auth-shell"><section className={`auth-hero${login ? ' returning' : ''}`}><img className="auth-brand-logo" src="/FinMate_Logo.png" alt="FinMate"/><h1>{login ? '금융 루틴으로 다시 들어가기' : '나와 비슷한 사람들의 금융 루틴을 비교해보세요'}</h1><p>{login ? '오늘의 목표, 퀘스트와 금융 여정을 바로 확인할 수 있어요.' : '계정을 만든 뒤 생활 맥락과 합성 금융데이터 기준선을 차례로 확인해요.'}</p><img className="auth-hero-mascot" src="/assets/characters/finmate-coach.png" alt=""/></section><form onSubmit={form.handleSubmit(submit)} className="auth-form auth-form-card app-section-card"><SectionHeading eyebrow={login ? '로그인' : '회원가입'} title={login ? '로그인 정보' : '계정 정보'} subtitle={login ? 'FinMate 여정을 이어서 확인해요.' : '이름과 이메일부터 확인합니다.'}/>{!login && <><label className="auth-form-field">이름<input aria-label="이름" {...form.register('displayName')}/></label><small className="error-copy">{message(form.formState.errors.displayName?.message)}</small></>}<label className="auth-form-field">이메일<input aria-label="이메일" type="email" {...form.register('email')}/></label><small className="error-copy">{message(form.formState.errors.email?.message)}</small><label className="auth-form-field">비밀번호<input aria-label="비밀번호" type="password" {...form.register('password')}/></label><small className="error-copy">{message(form.formState.errors.password?.message)}</small>{error !== null && <p className="error-copy" role="alert">{errorState(error) === 'error' ? '입력 내용을 다시 확인해 주세요.' : '지금은 진행할 수 없어요.'}</p>}<button className="app-button primary" type="submit">{login ? '로그인' : '회원가입'}</button></form><Link className="text-link" to={login ? '/signup' : '/login'}>{login ? '처음이라면 회원가입' : '이미 계정이 있어요'}</Link></div></div></MobileShell>
}

function Onboarding() {
  const navigate = useNavigate(); const { step } = useParams(); const requested = Number(step); const currentStep = Number.isInteger(requested) && requested >= 1 && requested <= onboardingSteps.length ? requested : 1; const [draft, setDraft] = useState(getOnboardingDraft); const complete = useCompleteOnboarding()
  const next = async () => {
    if (currentStep < onboardingSteps.length) { navigate(`/onboarding/${currentStep + 1}`); return }
    try { await complete.mutateAsync(onboardingCompletion()); navigate('/onboarding/baseline') } catch { /* rendered below */ }
  }
  const choose = (answer: string) => setDraft(saveOnboardingAnswer(currentStep, answer))
  const config = onboardingSteps[currentStep - 1]
  return <MobileShell><div className="screen onboarding-screen"><header className="onboarding-top"><span>FinMate 시작 설정</span><strong>{config.eyebrow}</strong>{currentStep === 1 ? <p>{currentSession()?.user.displayName ?? 'FinMate'}님에게 맞는 기준선과 목표를 차례로 정리해요.</p> : null}</header><div className="onboarding-progress" aria-label="온보딩 진행 단계">{onboardingSteps.map((item, index) => <b className={index < currentStep ? 'active' : ''} aria-label={`${index + 1}단계 ${item.eyebrow}${index + 1 === currentStep ? ' (현재 단계)' : ''}`} aria-current={index + 1 === currentStep ? 'step' : undefined} key={item.eyebrow}>{index + 1}</b>)}</div><div className="onboarding-shell"><div className="onboarding-content"><section className="onboarding-card intro-card"><IconBadge icon={currentStep === 5 ? 'chart' : 'spark'} tone="teal"/><div><SectionHeading title={config.title} subtitle={config.description}/></div></section><AppSectionCard className="survey-group"><div className="survey-heading"><p>내 상황에 가장 가까운 항목을 선택해 주세요.</p></div><div className="option-grid">{config.choices.map((choice) => <button aria-label={choice.label} aria-pressed={draft.answers[currentStep] === choice.value} className={`option-card ${draft.answers[currentStep] === choice.value ? 'selected' : ''}`} type="button" key={choice.value} onClick={() => choose(choice.value)}><span>{choice.label}</span><span className="option-card-check" aria-hidden="true">{draft.answers[currentStep] === choice.value ? <Check size={14} strokeWidth={3}/> : null}</span></button>)}</div></AppSectionCard>{currentStep === 5 ? <AppSectionCard className="consent-preview-card"><SectionHeading eyebrow="연결 범위" title="합성 금융데이터로 먼저 검증해요" subtitle="계좌번호와 거래 원문은 사용하지 않으며 공개 설정의 기본값은 비공개예요."/><div className="preview-profile"><IconBadge icon="chart" tone="teal"/><div><strong>기준선 계산과 레이드 갱신</strong><span>마지막 동기화 시각을 모든 진행 화면에 표시해요.</span></div></div></AppSectionCard> : null}</div></div>{complete.error ? <p className="error-copy" role="alert">연결을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.</p> : null}<div className="onboarding-actions"><button className="app-button primary" disabled={!draft.answers[currentStep] || complete.isPending} onClick={() => void next()}>{currentStep === onboardingSteps.length ? '연결하고 기준선 보기' : '다음'}</button></div></div></MobileShell>
}

function BaselineDiagnosis() {
  const onboarding = useOnboarding(); const waiting = QueryState({ loading: onboarding.isLoading, error: onboarding.error, retry: () => void onboarding.refetch() }); if (waiting) return waiting; if (!onboarding.data) return null
  if (onboarding.data.status !== 'COMPLETED') return <Navigate to="/onboarding/5" replace/>
  const baseline = onboarding.data.baseline
  return <MobileShell><div className="screen onboarding-screen"><header className="onboarding-top"><span>FinMate 시작 설정</span><strong>내 금융 기준선</strong><p>목표와 메이트 추천은 이 출발점을 바탕으로 계산해요.</p></header><div className="onboarding-shell"><div className="onboarding-content"><DataStateNotice dataState={onboarding.data.dataState} lastSyncedAt={onboarding.data.lastSyncedAt}/><AppSectionCard className="baseline-hero-card"><SectionHeading eyebrow="월 여윳돈" title={formatWon(baseline.disposableIncomeKrw)} subtitle="최근 소득에서 필수지출을 뺀 합성데이터 기준이에요."/><RpgIcon name="coins" size={72}/></AppSectionCard><div className="baseline-metric-grid"><article className="mate-insight-card"><span>소비율</span><b>{baseline.spendingRateBps / 100}%</b><small>여윳돈 대비 재량지출</small></article><article className="mate-insight-card alt"><span>저축률</span><b>{baseline.savingRateBps / 100}%</b><small>여윳돈 대비 저축 순유입</small></article><article className="mate-insight-card"><span>투자 판단</span><b>{baseline.investmentJudgmentBps / 100}점</b><small>위험성향·점검 행동</small></article></div><aside className="mate-banner"><ShieldCheck size={21}/><p>평가나 순위가 아니라 내 목표와 실행 강도를 정하는 기준이에요.</p></aside></div></div><div className="onboarding-actions"><Link className="app-button primary" to="/goal/confirm">목표 설정하기</Link><Link className="app-button secondary" to="/home">일단 메이트 탐색하기</Link></div></div></MobileShell>
}

function GoalConfirmation() {
  const navigate = useNavigate(); const onboarding = useOnboarding(); const complete = useCompleteOnboarding(); const confirmGoal = useConfirmGoal(); const draft = getOnboardingDraft(); const form = useForm<Schema['UserGoalDraft']>({ defaultValues: draft.mainGoal })
  const ensureOnboardingCompleted = async () => {
    if (onboarding.data?.status !== 'COMPLETED') await complete.mutateAsync(onboardingCompletion())
  }
  const confirm = async (mainGoal: Schema['UserGoalDraft']) => {
    saveGoalDraft(mainGoal)
    try {
      await ensureOnboardingCompleted()
      await confirmGoal.mutateAsync({ goal: mainGoal, confirm: true })
      navigate('/goal/success')
    } catch {
      // Mutation errors are rendered below without losing the editable goal draft.
    }
  }
  const explore = async () => {
    try {
      await ensureOnboardingCompleted()
      navigate('/home')
    } catch {
      // Mutation errors are rendered below and the user can retry.
    }
  }
  const watchedGoal = form.watch()
  const goalError = onboarding.error ?? complete.error ?? confirmGoal.error
  const waiting = QueryState({ loading: onboarding.isLoading, error: null, retry: () => void onboarding.refetch() })
  if (waiting) return waiting
  return <MobileShell><div className="screen onboarding-screen"><header className="onboarding-top"><span>FinMate 시작 설정</span><strong>목표 확인</strong><p>현재 금액과 목표 금액, 목표 월을 직접 확인하고 확정해요.</p></header><div className="onboarding-shell"><form className="onboarding-content auth-form" onSubmit={form.handleSubmit(confirm)}><AppSectionCard><SectionHeading eyebrow="주 목표" title={`${watchedGoal.title || '유럽 여행 자금'}을 위한 준비`} subtitle="메이트는 이 목표를 바꾸지 않고 실행 루틴만 제안해요."/><label className="auth-form-field">목표 이름<input aria-label="목표 이름" {...form.register('title')}/></label><div className="goal-amount-grid"><label className="auth-form-field">현재 금액<input aria-label="현재 금액" type="number" {...form.register('currentAmountKrw', { valueAsNumber: true })}/></label><label className="auth-form-field">목표 금액<input aria-label="목표 금액" type="number" {...form.register('targetAmountKrw', { valueAsNumber: true })}/></label></div><label className="auth-form-field">목표 월<input aria-label="목표 월" type="month" {...form.register('targetMonth')}/></label></AppSectionCard><AppSectionCard className="goal-summary-card"><div><span>현재 확인 금액</span><strong>{formatWon(watchedGoal.currentAmountKrw || 0)}</strong></div><div><span>최종 목표</span><strong>{formatWon(watchedGoal.targetAmountKrw || 0)}</strong></div><p>레이드 진행률은 목표 확정 후 API가 계산해요.</p></AppSectionCard>{goalError ? <small className="error-copy" role="alert">{errorState(goalError) === 'stale' ? '데이터가 조금 오래됐어요.' : '목표를 만들지 못했어요.'}</small> : null}<button className="app-button primary" disabled={complete.isPending || confirmGoal.isPending} type="submit">{watchedGoal.title || '유럽 여행 자금'} 목표 만들기</button><button className="app-button secondary" disabled={complete.isPending || confirmGoal.isPending} type="button" onClick={() => void explore()}>일단 탐색하기</button></form></div></div></MobileShell>
}

function GoalSuccess() { const navigate = useNavigate(); return <MobileShell><div className="screen onboarding-screen goal-success-screen"><div className="onboarding-shell"><div className="onboarding-content"><AppSectionCard className="completion-card"><MateAvatar species="me" size={132} fit="contain" className="completion-mascot"/><SectionHeading eyebrow="목표가 시작됐어요" title="여행까지 한 걸음" subtitle="목표 금액과 현재 저축 흐름을 바탕으로 홈 레이드를 준비했어요."/><button className="app-button primary" onClick={() => navigate('/home')}>홈으로 가기</button></AppSectionCard></div></div></div></MobileShell> }

function HomeScreen() {
  const navigate = useNavigate()
  const home = useHome()
  const quests = useQuests()
  const points = usePointLedger()
  const cosmetics = useCosmetics()
  const queryError = home.error ?? quests.error ?? points.error ?? cosmetics.error
  const waiting = QueryState({
    loading: home.isLoading || quests.isLoading || points.isLoading || cosmetics.isLoading,
    error: queryError,
    retry: () => {
      void home.refetch()
      void quests.refetch()
      void points.refetch()
      void cosmetics.refetch()
    },
  })
  if (waiting) return waiting
  if (!home.data || !quests.data || !points.data || !cosmetics.data) return null
  const { mainGoal, raid } = home.data
  if (home.data.mode === 'EXPLORE_ONLY' || !mainGoal || !raid) return <MobileShell><div className="screen screen-home screen-home-battle"><header className="home-identity-bar"><img className="home-brand-logo" src="/FinMate_Logo.png" alt="FinMate"/><div className="home-identity-currency"><span className="home-currency-pill coin"><b>XP 0</b></span><span className="home-currency-pill gem"><b>P {points.data.balance.toLocaleString('ko-KR')}</b></span></div><Link className="home-menu-button" aria-label="공개 범위와 설정" to="/settings"><IconBadge icon="settings" tone="muted"/></Link><div className="home-profile-strip"><MateAvatar species="me" size={54} fit="contain"/><div className="home-identity-meta"><strong>{currentSession()?.user.displayName ?? '민지'}</strong><span>탐색 모드</span></div></div></header><section className="home-battle-scene explore-only-arena"><div className="explore-only-card"><Target size={42}/><span>탐색 모드</span><h1>목표를 정하면 레이드가 시작돼요</h1><p>메이트의 루틴은 먼저 둘러볼 수 있어요. 퀘스트 수락과 루틴 적용은 목표를 정한 뒤 열립니다.</p><Link className="app-button primary" to="/goal/confirm">목표 설정</Link><Link className="app-button secondary" to="/mates">메이트 둘러보기</Link></div></section></div><Tabs/></MobileShell>
  const nextCosmetic = cosmetics.data.items.find((item) => !item.owned) ?? null
  const battleView = toHomeBattleView(home.data, {
    pointBalance: points.data.balance,
    nextCosmeticPrice: nextCosmetic?.pricePoints ?? null,
  })
  const openReport = (type: Schema['CharacterReportType']) => navigate(`/report?type=${type}`)
  return <MobileShell><HomeRaidScene view={battleView} quests={quests.data.items} displayName={currentSession()?.user.displayName ?? '민지'} onOpenQuest={() => navigate('/quests')} onOpenReport={openReport} onOpenSettings={() => navigate('/settings')}/><Tabs/></MobileShell>
}

function AnimalReportScreen() {
  const [searchParams] = useSearchParams()
  const requestedType = searchParams.get('type') as Schema['CharacterReportType'] | null
  const allowedTypes: Schema['CharacterReportType'][] = ['SPENDING_DEFENSE', 'SAVING_HP', 'INVESTMENT_JUDGMENT', 'QUEST_XP']
  const reportType = requestedType && allowedTypes.includes(requestedType) ? requestedType : 'SAVING_HP'
  const report = useCharacterReport(reportType); const navigate = useNavigate(); const waiting = QueryState({ loading: report.isLoading, error: report.error, retry: () => void report.refetch() }); if (waiting) return waiting; if (!report.data) return null
  return <MobileShell><CharacterReportView report={report.data} onBack={() => navigate(-1)} onHome={() => navigate('/home')} onQuest={(questId) => navigate(`/quests/${questId}`)}/></MobileShell>
}

function MateGroups() { const groups = useMateGroups(); const points = usePointLedger(); const waiting = QueryState({ loading: groups.isLoading || points.isLoading, error: groups.error ?? points.error, retry: () => { void groups.refetch(); void points.refetch() } }); if (waiting) return waiting; if (!groups.data || !points.data) return null; return <MobileShell><div className="screen screen-compare screen-tab-main screen-mate-main"><MateTopHeader subtitle="나의 금융 습관을 비슷한 사용자와 비교해봐요" pointBalance={points.data.balance}/><MateSectionNav active="groups"/><section className="screen-stack tab-main-stack mate-main-stack"><MateDiscovery groups={groups.data.items}/></section></div><Tabs/></MobileShell> }

function MateFriends() {
  const overview = useMateFriendOverview(); const feed = useMateFriendFeed(); const streaks = useMateFriendStreaks(); const points = usePointLedger(); const error = overview.error ?? feed.error ?? streaks.error ?? points.error
  const waiting = QueryState({ loading: overview.isLoading || feed.isLoading || streaks.isLoading || points.isLoading, error, retry: () => { void overview.refetch(); void feed.refetch(); void streaks.refetch(); void points.refetch() } }); if (waiting) return waiting
  if (!overview.data || !feed.data || !streaks.data || !points.data) return null
  return <MobileShell><div className="screen screen-compare screen-tab-main screen-mate-main"><MateTopHeader subtitle="친구들과 함께 목표를 관리하고 있어요" pointBalance={points.data.balance}/><MateSectionNav active="friends"/><section className="screen-stack tab-main-stack mate-main-stack"><FriendOverviewView overview={overview.data} feed={feed.data} streaks={streaks.data}/></section></div><Tabs/></MobileShell>
}

const initialExploreFilters: Schema['MateExploreSearchRequest'] = { ageBand: 'AGE_24_29', occupationGroup: 'EARLY_CAREER', incomeBand: 'FROM_200_TO_300', spendingTendency: 'BALANCED', savingRateBand: 'FROM_10_TO_20', investmentTendency: 'BALANCED' }

function MateExplore() {
  const search = useMateExploreSearch(); const points = usePointLedger(); const [filters, setFilters] = useState(initialExploreFilters)
  const update = <K extends keyof Schema['MateExploreSearchRequest']>(key: K, value: Schema['MateExploreSearchRequest'][K]) => setFilters((current) => ({ ...current, [key]: value }))
  const waiting = QueryState({ loading: points.isLoading, error: points.error, retry: () => void points.refetch() })
  if (waiting) return waiting
  if (!points.data) return null
  return <MobileShell><div className="screen screen-compare screen-tab-main screen-mate-main"><MateTopHeader subtitle="조건을 설정하고 나와 비슷한 익명 모험가를 찾아보세요" pointBalance={points.data.balance}/><MateSectionNav active="explore"/><section className="screen-stack tab-main-stack mate-main-stack"><div className="mate-tab-stack"><AppSectionCard className="mate-filter-card-head"><SectionHeading eyebrow="비교 탐색" title="비교 조건 설정" subtitle="정해진 조건 안에서 공개 동의된 합성 모험가를 찾아요."/><div className="mate-filter-grid"><label className="mate-filter-field"><span className="mate-filter-field-label">나이</span><select value={filters.ageBand} onChange={(event) => update('ageBand', event.target.value as Schema['MateExploreSearchRequest']['ageBand'])}><option value="AGE_19_23">19–23세</option><option value="AGE_24_29">24–29세</option><option value="AGE_30_34">30–34세</option></select></label><label className="mate-filter-field"><span className="mate-filter-field-label">직업</span><select value={filters.occupationGroup} onChange={(event) => update('occupationGroup', event.target.value as Schema['MateExploreSearchRequest']['occupationGroup'])}><option value="STUDENT">학생</option><option value="EARLY_CAREER">사회초년생</option><option value="FREELANCER">프리랜서</option><option value="JOB_SEEKER">취업준비</option></select></label><label className="mate-filter-field"><span className="mate-filter-field-label">월소득</span><select value={filters.incomeBand} onChange={(event) => update('incomeBand', event.target.value as Schema['MateExploreSearchRequest']['incomeBand'])}><option value="NONE">정기소득 없음</option><option value="UNDER_200">200만원 미만</option><option value="FROM_200_TO_300">200–300만원</option><option value="OVER_300">300만원 초과</option></select></label><label className="mate-filter-field"><span className="mate-filter-field-label">소비 성향</span><select value={filters.spendingTendency} onChange={(event) => update('spendingTendency', event.target.value as Schema['MateExploreSearchRequest']['spendingTendency'])}><option value="PLANNED">계획형</option><option value="BALANCED">균형형</option><option value="VARIABLE">변동형</option></select></label><label className="mate-filter-field"><span className="mate-filter-field-label">저축률</span><select value={filters.savingRateBand} onChange={(event) => update('savingRateBand', event.target.value as Schema['MateExploreSearchRequest']['savingRateBand'])}><option value="UNDER_10">10% 미만</option><option value="FROM_10_TO_20">10–20%</option><option value="OVER_20">20% 초과</option></select></label><label className="mate-filter-field"><span className="mate-filter-field-label">투자 성향</span><select value={filters.investmentTendency} onChange={(event) => update('investmentTendency', event.target.value as Schema['MateExploreSearchRequest']['investmentTendency'])}><option value="CAUTIOUS">신중형</option><option value="BALANCED">균형형</option><option value="LEARNING">학습 중</option></select></label></div><div className="mate-filter-cta"><span>선택한 조건으로 합성 모험가를 탐색해요.</span><button disabled={search.isPending} onClick={() => search.mutate(filters)}>검색하기<Search size={17}/></button></div></AppSectionCard>{search.error ? <StateView state={errorState(search.error)} onRetry={() => search.mutate(filters)}/> : null}<ExploreResults results={search.data ?? null}/></div></section></div><Tabs/></MobileShell>
}

function GroupDetail() {
  const { groupId = '' } = useParams(); const groups = useMateGroups(); const report = useMateGroupReport(groupId); const adventurers = useAdventurers(groupId); const waiting = QueryState({ loading: groups.isLoading || report.isLoading || adventurers.isLoading, error: groups.error ?? report.error ?? adventurers.error, retry: () => { void groups.refetch(); void report.refetch(); void adventurers.refetch() } }); if (waiting) return waiting
  const group = groups.data?.items.find((item) => item.groupId === groupId); if (!group) return <MobileShell><StateView state="empty"/></MobileShell>
  return <MobileShell><div className="screen screen-compare screen-tab-main screen-mate-main">{adventurers.data && report.data ? <><header className="compare-flow-header mate-flow-header"><Link className="mate-back-link" to="/mates"><ChevronLeft size={18}/>메이트 찾기</Link><h1>{group.name}</h1></header><section className="screen-stack tab-main-stack mate-main-stack"><DataStateNotice dataState={adventurers.data.dataState} lastSyncedAt={adventurers.data.lastSyncedAt}/><MateGroupDetailView group={group} adventurers={adventurers.data.items}/><GroupInsightView report={report.data}/></section></> : null}</div><Tabs/></MobileShell>
}

function AdventurerProfile() {
  const { groupId = '', adventurerId = '' } = useParams(); const adventurer = useAdventurer(groupId, adventurerId); const waiting = QueryState({ loading: adventurer.isLoading, error: adventurer.error, retry: () => void adventurer.refetch() }); if (waiting) return waiting; if (!adventurer.data) return null
  return <MobileShell><div className="screen screen-compare screen-tab-main screen-mate-main"><AdventurerProfileView adventurer={adventurer.data}/></div><Tabs/></MobileShell>
}

function AdventurerComparison() {
  const { groupId = '', adventurerId = '' } = useParams(); const report = useAdventurerReport(groupId, adventurerId); const waiting = QueryState({ loading: report.isLoading, error: report.error, retry: () => void report.refetch() }); if (waiting) return waiting; if (!report.data) return null
  return <MobileShell><div className="screen screen-compare screen-tab-main screen-mate-main"><section className="screen-stack tab-main-stack mate-main-stack"><DataStateNotice dataState={report.data.dataState} lastSyncedAt={report.data.lastSyncedAt}/><AdventurerReportView report={report.data}/></section></div><Tabs/></MobileShell>
}

function AdventurerRoutineScreen() {
  const { groupId = '', adventurerId = '', routineId = '' } = useParams(); const routine = useAdventurerRoutine(groupId, adventurerId, routineId); const waiting = QueryState({ loading: routine.isLoading, error: routine.error, retry: () => void routine.refetch() }); if (waiting) return waiting; if (!routine.data) return null
  return <MobileShell><AdventurerRoutineIntro routine={routine.data}/><Tabs/></MobileShell>
}

function RoutineScreen() {
  const { groupId = '', adventurerId = '', routineId = '' } = useParams(); const navigate = useNavigate(); const [adaptation, setAdaptation] = useState<Schema['RoutineRecommendation'] | null>(null); const [candidateId, setCandidateId] = useState<string | null>(null); const [confirming, setConfirming] = useState(false); const create = useCreateRecommendation(); const active = useActiveRoutine(); const points = usePointLedger(); const importRoutine = useImportRoutine(); const replace = useReplaceRoutine()
  const prepare = () => create.mutate({ groupId, adventurerId, sourceRoutineId: routineId, selectedDomain: 'SAVING' }, { onSuccess: (recommendation) => { setAdaptation(recommendation); setCandidateId(recommendation.recommendedCandidate.candidateId) } })
  const activate = () => { if (!adaptation || !candidateId) return; if (active.data) { setConfirming(true); return } importRoutine.mutate({ adaptationId: adaptation.adaptationId, candidateId }, { onSuccess: () => navigate('/routine/confirm') }) }
  const replaceActive = () => { if (!adaptation || !candidateId) return; replace.mutate({ adaptationId: adaptation.adaptationId, candidateId, confirmReplacement: true }, { onSuccess: () => navigate('/routine/confirm') }) }
  const candidates = adaptation?.intensityOptions ?? []
  const selectedCandidate = candidates.find((candidate) => candidate.candidateId === candidateId)
  const mutationError = create.error ?? importRoutine.error ?? replace.error
  return <MobileShell><div className="screen screen-compare compare-flow-screen mate-build-screen"><header className="compare-flow-header"><button className="mate-back-link" type="button" onClick={() => navigate(-1)}><ChevronLeft size={18}/>이전</button><h1>빌드 따라하기</h1><div className="mate-build-top-actions"><MatePointPill value={points.data?.balance ?? 0}/><MateAvatar species="me" size={52} fit="contain" className="mate-top-avatar"/></div></header><section className="compare-flow-body mate-tab-stack"><RoutineSteps current={2}/><div className="mate-build-profile"><MateAvatar species="rabbit" size={56} fit="contain" className="mate-build-profile-avatar"/><div><strong>추천 모험가의 루틴</strong><span>내 목표와 기준선은 그대로 유지돼요.</span></div></div><MateSectionCard eyebrowIcon="spark" title="내 상황에 맞는 실행 강도를 선택하세요" subtitle="상대의 정확 금액은 복사하지 않아요.">{!adaptation ? <button className="app-button primary" disabled={create.isPending} onClick={prepare}>내 기준으로 추천 받기</button> : <div className="mate-option-list">{candidates.map((candidate) => <button aria-label={`${difficultyLabel(candidate.difficulty)} · ${candidate.title}`} aria-pressed={candidateId === candidate.candidateId} className={`mate-option-row routine-candidate${candidateId === candidate.candidateId ? ' is-selected' : ''}`} key={candidate.candidateId} onClick={() => setCandidateId(candidate.candidateId)}><RpgIcon name={candidate.domain === 'SAVING' ? 'piggy' : candidate.domain === 'SPENDING' ? 'shield' : 'quiz'} size={40}/><span><strong>{difficultyLabel(candidate.difficulty)} · {candidate.title}</strong><small>{candidateTargetLabel(candidate)} · {candidate.durationDays ? `${candidate.durationDays}일` : '행동형'}</small></span><i aria-hidden="true">{candidateId === candidate.candidateId ? '✓' : ''}</i></button>)}</div>}</MateSectionCard>{adaptation ? <DataStateNotice dataState={adaptation.dataState} lastSyncedAt={adaptation.lastSyncedAt}/> : null}{selectedCandidate ? <MateSectionCard eyebrowIcon="check" title="선택한 루틴의 실행 단계"><ol className="mate-reason-list">{selectedCandidate.steps.map((step) => <li key={step}>{step}</li>)}</ol></MateSectionCard> : null}{candidateId ? <button className="app-button primary compare-flow-primary" disabled={active.isLoading || importRoutine.isPending || replace.isPending} onClick={activate}>이 루틴으로 퀘스트 시작하기</button> : null}{adaptation?.relatedProductId ? <Link className="app-button secondary" to={`/products/${adaptation.relatedProductId}`}>관련 하나 상품 정보 보기</Link> : null}{adaptation?.relatedProductId ? <p className="mate-build-note">상품 정보 열람은 루틴 적용, XP, 레이드 진행에 영향을 주지 않아요.</p> : null}{mutationError ? <small className="error-copy" role="alert">루틴을 적용하지 못했어요. 잠시 후 다시 시도해 주세요.</small> : null}</section>{confirming ? <BottomSheet title="루틴 변경 확인" onClose={() => setConfirming(false)}><div className="filter-sheet-options"><p>새 루틴으로 교체하면 현재 루틴은 보관되고 여행 목표는 그대로 유지돼요.</p><button className="app-button primary" disabled={replace.isPending} onClick={replaceActive}>교체 확정</button></div></BottomSheet> : null}</div><Tabs/></MobileShell>
}

function RoutineConfirm() { const navigate = useNavigate(); const active = useActiveRoutine(); const waiting = QueryState({ loading: active.isLoading, error: active.error, retry: () => void active.refetch() }); if (waiting) return waiting; if (!active.data) return null; return <MobileShell><div className="screen screen-compare compare-flow-screen mate-build-screen"><section className="compare-flow-body mate-tab-stack"><RoutineSteps current={3}/><MateSectionCard className="completion-card" eyebrowIcon="check" title="활성 루틴이 바뀌었어요" subtitle="주 목표는 그대로 유지됩니다."><MateAvatar species="me" size={120} fit="contain"/><ol className="mate-reason-list">{active.data.steps.map((step) => <li key={step}>{step}</li>)}</ol><button className="app-button primary" onClick={() => navigate('/quests')}>퀘스트 보러 가기</button></MateSectionCard></section></div><Tabs/></MobileShell> }

function Quests() {
  const quests = useQuests(); const points = usePointLedger(); const cosmetics = useCosmetics(); const error = quests.error ?? points.error ?? cosmetics.error; const waiting = QueryState({ loading: quests.isLoading || points.isLoading || cosmetics.isLoading, error, retry: () => { void quests.refetch(); void points.refetch(); void cosmetics.refetch() } }); if (waiting) return waiting; if (!quests.data || !points.data || !cosmetics.data) return null
  return <MobileShell><div className="screen screen-compare screen-tab-main screen-mate-main screen-quest-main"><MateTopHeader title="퀘스트" subtitle="오늘의 작은 행동으로 금융 루틴을 이어가요" pointBalance={points.data.balance}/><DataStateNotice dataState={quests.data.dataState} lastSyncedAt={quests.data.lastSyncedAt}/><section className="screen-stack tab-main-stack mate-main-stack quest-main-stack"><QuestOverviewView page={quests.data} pointLedger={points.data} cosmetics={cosmetics.data}/></section></div><Tabs/></MobileShell>
}

function QuestDetailScreen() {
  const { questId = '' } = useParams(); const quest = useQuest(questId); const accept = useAcceptQuest(); const complete = useCompleteQuest(); const [message, setMessage] = useState<string>(); const error = quest.error ?? accept.error ?? complete.error
  const waiting = QueryState({ loading: quest.isLoading, error: quest.error, retry: () => void quest.refetch() }); if (waiting) return waiting; if (!quest.data) return null
  const acceptQuest = () => accept.mutate(questId, { onSuccess: () => setMessage('퀘스트를 수락했어요. 금융 스탯은 아직 바뀌지 않아요.') })
  const completeQuest = () => complete.mutate(questId, { onSuccess: (result) => setMessage(result.quest.status === 'DATA_PENDING' ? '행동을 기록했어요. 새 금융데이터 확인을 기다려요.' : `완료했어요. XP ${result.xpAwarded}를 받았어요.`) })
  return <MobileShell><QuestDetailView quest={quest.data} onAccept={acceptQuest} onComplete={completeQuest} pending={accept.isPending || complete.isPending} message={message}/>{error && error !== quest.error && <div className="floating-error error-copy" role="alert">퀘스트를 처리하지 못했어요. 다시 시도해 주세요.</div>}<Tabs/></MobileShell>
}

function ProductInfoScreen() {
  const { productId = '' } = useParams(); const product = useHanaProductInfo(productId); const waiting = QueryState({ loading: product.isLoading, error: product.error, retry: () => void product.refetch() }); if (waiting) return waiting; if (!product.data) return null
  return <MobileShell><ProductInfoView product={product.data}/><Tabs/></MobileShell>
}

const disclosureOptions: Array<{ field: Schema['DisclosureField']; label: string }> = [
  { field: 'ASSETS', label: '총자산과 계정별 자산' },
  { field: 'INCOME', label: '수입과 소득 이력' },
  { field: 'SPENDING', label: '지출과 카테고리 내역' },
  { field: 'SAVING', label: '저축액·저축률·저축상품' },
  { field: 'FINANCIAL_PRODUCTS', label: '금융상품명과 보유 상태' },
  { field: 'INVESTMENT_HOLDINGS', label: '투자종목·보유액·비중' },
  { field: 'TRADES', label: '매수·매도 기록' },
]

function SettingsScreen() {
  const consent = useDisclosureConsent(); const preview = usePreviewDisclosure(); const update = useUpdateDisclosure(); const withdraw = useWithdrawDisclosure(); const [selection, setSelection] = useState<Schema['DisclosureField'][] | null>(null)
  const waiting = QueryState({ loading: consent.isLoading, error: consent.error, retry: () => void consent.refetch() }); if (waiting) return waiting; if (!consent.data) return null
  const fields = selection ?? consent.data.fields
  const request: Schema['DisclosureRequest'] = { fields, consentVersion: consent.data.consentVersion, confirmExactValues: true }
  const toggle = (field: Schema['DisclosureField'], checked: boolean) => setSelection(checked ? [...fields, field] : fields.filter((item) => item !== field))
  return <MobileShell><div className="screen screen-compare compare-flow-screen settings-screen"><header className="compare-flow-header"><Link className="mate-back-link" to="/home"><ChevronLeft size={18}/>이전</Link><h1>공개 범위·설정</h1></header><section className="compare-flow-body mate-tab-stack"><MateSectionCard eyebrowIcon="shield" title="익명 금융정보 공개" subtitle="모든 항목은 기본 비공개이며 선택한 항목만 정확값으로 공개해요."><div className="consent-list">{disclosureOptions.map((option) => <ConsentRow checked={fields.includes(option.field)} title={option.label} onChange={(checked) => toggle(option.field, checked)} key={option.field}/>)}</div></MateSectionCard><aside className="mate-banner"><ShieldCheck size={22}/><p>계좌번호, 거래 원문 메모, 상세 직장·위치와 인증 식별자는 항상 제외돼요.</p></aside>{preview.data ? <MateSectionCard eyebrowIcon="profile" title="공개 미리보기" subtitle={`${preview.data.fields.length}개 항목을 정확값으로 공개합니다.`}><p className="mate-streak-note">제외 항목 {preview.data.permanentlyExcludedFields.length}개 · 철회 즉시 탐색과 추천에서 제거</p></MateSectionCard> : null}<button className="app-button secondary" disabled={preview.isPending} onClick={() => preview.mutate(request)}>공개 미리보기</button><button className="app-button primary" disabled={update.isPending || fields.length === 0} onClick={() => update.mutate(request)}>선택한 범위 저장</button>{consent.data.state === 'ACTIVE' ? <button className="app-button danger" disabled={withdraw.isPending} onClick={() => withdraw.mutate()}>공개 동의 철회</button> : null}{preview.error || update.error || withdraw.error ? <p className="error-copy" role="alert">공개 설정을 처리하지 못했어요. 다시 시도해 주세요.</p> : null}</section></div><Tabs/></MobileShell>
}

function RecordDaySheet({ date, onClose }: { date: string; onClose: () => void }) {
  const record = useDailyRecord(date); const waiting = QueryState({ loading: record.isLoading, error: record.error, retry: () => void record.refetch() }); if (waiting) return waiting; if (!record.data) return null
  return <RecordDaySheetView record={record.data} onClose={onClose}/>
}

function shiftMonth(value: string, offset: -1 | 1) {
  const [year, month] = value.split('-').map(Number)
  const shifted = new Date(Date.UTC(year, month - 1 + offset, 1))
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}`
}

function RecordJourney() {
  const [month, setMonth] = useState('2026-07')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const records = useDailyJourney(month)
  const points = usePointLedger()
  const navigate = useNavigate()
  const waiting = QueryState({ loading: records.isLoading || points.isLoading, error: records.error ?? points.error, retry: () => { void records.refetch(); void points.refetch() } })
  if (waiting) return waiting
  if (!records.data || !points.data) return null
  const changeMonth = (offset: -1 | 1) => {
    setSelectedDate(null)
    setMonth((current) => shiftMonth(current, offset))
  }
  return <MobileShell><RecordJourneyMap journey={records.data} pointBalance={points.data.balance} onChangeMonth={changeMonth} onSelectDate={setSelectedDate} onAdvanceDemo={() => navigate('/demo')}/>{selectedDate && <RecordDaySheet date={selectedDate} onClose={() => setSelectedDate(null)}/>}<Tabs/></MobileShell>
}

function DemoAdvance() {
  const navigate = useNavigate(); const home = useHome(); const raid = useRaid(); const advance = useAdvanceDemo(); const waiting = QueryState({ loading: home.isLoading || raid.isLoading, error: home.error ?? raid.error, retry: () => { void home.refetch(); void raid.refetch() } }); if (waiting) return waiting
  const completeDemo = async () => {
    const goalId = home.data?.mainGoal?.goalId
    if (!goalId) return
    let expectedFrameIndex = getDemoExpectedFrameIndex(goalId)
    try {
      while (expectedFrameIndex < 6) {
        const timeline = await advance.mutateAsync(expectedFrameIndex)
        expectedFrameIndex = timeline.currentFrameIndex + 1
        saveDemoExpectedFrameIndex(goalId, expectedFrameIndex)
      }
      navigate('/goal/complete')
    } catch {
      // The mutation exposes the retryable error in the screen while retaining the command key.
    }
  }
  return <MobileShell><div className="screen screen-compare compare-flow-screen demo-advance-screen"><header className="compare-flow-header"><Link className="mate-back-link" to="/record"><ChevronLeft size={18}/>이전</Link><h1>시연 시간 진행</h1></header><section className="compare-flow-body mate-tab-stack"><MateSectionCard eyebrowIcon="records" title="30일 여정을 빠르게 진행할까요?" subtitle="합성 사용자와 demo 환경에서만 실행되는 결정적 시연 기능이에요."><div className="completion-card"><RpgIcon name="medal" size={78}/><span>30일 차</span><h2>여행 준비 완료</h2><p>실제 금융 데이터나 저축 금액은 변경하지 않아요.</p></div></MateSectionCard>{advance.error && <p className="error-copy" role="alert">{errorState(advance.error) === 'stale' ? '데모 단계가 오래되었어요.' : '데모를 진행하지 못했어요.'}</p>}<button className="app-button primary" disabled={advance.isPending} onClick={() => void completeDemo()}>목표 완료 보기</button></section></div><Tabs/></MobileShell>
}

function GoalComplete() { const home = useHome(); const waiting = QueryState({ loading: home.isLoading, error: home.error, retry: () => void home.refetch() }); if (waiting) return waiting; if (!home.data?.mainGoal) return <MobileShell><StateView state="empty"/></MobileShell>; const goal = home.data.mainGoal; return <MobileShell><div className="screen onboarding-screen completion-screen"><div className="completion-confetti" aria-hidden="true">{confettiPieces.map((piece, index) => <i key={index} style={{ left: `${piece.left}%`, width: piece.size, height: piece.round ? piece.size : Math.round(piece.size * 0.45), background: piece.color, borderRadius: piece.round ? '50%' : 2, animationDelay: `${piece.delay}s`, animationDuration: `${piece.duration}s` }}/>)}</div><div className="onboarding-shell"><div className="onboarding-content"><AppSectionCard className="completion-card"><RpgIcon name="medal" size={92} className="completion-medal"/><span>목표 완료</span><h1>{goal.title} 목표를 완주했어요</h1><p className="completion-amount"><strong>{formatWon(goal.currentAmountKrw)}</strong><span>목표 {formatWon(goal.targetAmountKrw)} 달성</span></p><p>확인된 금융 데이터가 목표 달성을 증명했어요. XP와 꾸미기 보상은 금융 성장과 분리해 기록됩니다.</p><Link className="app-button primary" to="/home">홈으로 돌아가기</Link></AppSectionCard></div></div></div></MobileShell> }

function DevStates() { const navigate = useNavigate(); return <MobileShell><div className="screen screen-compare compare-flow-screen"><header className="compare-flow-header"><span/><h1>상태 미리보기</h1></header><section className="compare-flow-body mate-card"><SectionHeading eyebrow="Development states" title="공통 화면 상태" subtitle="원본 카드 문법으로 로딩·빈 상태·오류를 확인해요."/><div className="option-grid">{(['loading', 'empty', 'stale', 'error'] as const).map((state) => <button key={state} className="option-card" onClick={() => navigate(`/dev/${state}`)}>{state}</button>)}</div></section></div></MobileShell> }
function DevState({ state }: { state: 'loading' | 'empty' | 'stale' | 'error' }) { return <MobileShell><StateView state={state}/></MobileShell> }
function Tabs() { return <BottomNav/> }

export default function App() { return <AppShell><Routes><Route path="/" element={<Navigate to="/signup" replace/>}/><Route path="/signup" element={<AuthScreen/>}/><Route path="/login" element={<AuthScreen login/>}/><Route path="/onboarding/baseline" element={<BaselineDiagnosis/>}/><Route path="/onboarding/:step" element={<Onboarding/>}/><Route path="/goal/confirm" element={<GoalConfirmation/>}/><Route path="/goal/success" element={<GoalSuccess/>}/><Route path="/goal/complete" element={<GoalComplete/>}/><Route path="/home" element={<HomeScreen/>}/><Route path="/report" element={<AnimalReportScreen/>}/><Route path="/settings" element={<SettingsScreen/>}/><Route path="/mates" element={<MateGroups/>}/><Route path="/mates/friends" element={<MateFriends/>}/><Route path="/mates/explore" element={<MateExplore/>}/><Route path="/mates/group/:groupId" element={<GroupDetail/>}/><Route path="/mates/group/:groupId/adventurer/:adventurerId" element={<AdventurerProfile/>}/><Route path="/mates/group/:groupId/adventurer/:adventurerId/report" element={<AdventurerComparison/>}/><Route path="/mates/group/:groupId/adventurer/:adventurerId/routine/:routineId" element={<AdventurerRoutineScreen/>}/><Route path="/routine/:groupId/:adventurerId/:routineId" element={<RoutineScreen/>}/><Route path="/routine/confirm" element={<RoutineConfirm/>}/><Route path="/products/:productId" element={<ProductInfoScreen/>}/><Route path="/quests" element={<Quests/>}/><Route path="/quests/:questId" element={<QuestDetailScreen/>}/><Route path="/record" element={<RecordJourney/>}/><Route path="/demo" element={<DemoAdvance/>}/><Route path="/dev" element={<DevStates/>}/><Route path="/dev/loading" element={<DevState state="loading"/>}/><Route path="/dev/empty" element={<DevState state="empty"/>}/><Route path="/dev/stale" element={<DevState state="stale"/>}/><Route path="/dev/error" element={<DevState state="error"/>}/><Route path="*" element={<Navigate to="/signup" replace/>}/></Routes></AppShell> }
