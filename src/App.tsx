import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BookOpen, ChevronRight, Compass, Heart, Home, Search, ShieldCheck, Sparkles, Target, Users } from 'lucide-react'
import { ApiError, apiRequest, currentSession, type Schema } from './api/client'
import { getDemoExpectedFrameIndex, saveDemoExpectedFrameIndex } from './api/demoProgress'
import { getOnboardingDraft, saveGoalDraft, saveOnboardingAnswer } from './api/onboardingDraft'
import { useAcceptQuest, useActiveRoutine, useAdvanceDemo, useAdventurer, useAdventurerReport, useAdventurerRoutine, useAdventurers, useCharacterReport, useCompleteOnboarding, useCompleteQuest, useConfirmGoal, useCreateRecommendation, useDailyJourney, useDailyRecord, useHanaProductInfo, useHome, useImportRoutine, useMateExploreSearch, useMateFriendFeed, useMateFriendOverview, useMateFriendStreaks, useMateGroupReport, useMateGroups, useOnboarding, useQuest, useQuests, useReplaceRoutine, useRaid } from './api/queries'
import { HomeRaidScene } from './components/HomeRaidScene'
import { MateDiscovery } from './components/MateDiscovery'
import { AdventurerRoutineIntro, MateGroupDetailView } from './components/MateJourneyViews'
import { RecordDaySheetView } from './components/RecordDaySheetView'
import { RecordJourneyMap } from './components/RecordJourneyMap'
import { AdventurerProfileView, AdventurerReportView, ExploreResults, FriendOverviewView, GroupInsightView, MateSectionNav } from './components/MateExtendedViews'
import { ProductInfoView } from './components/ProductInfoView'
import { QuestDetailView } from './components/QuestDetailView'
import styles from './App.module.css'

const onboardingSteps = [
  { eyebrow: '생활 맥락', title: '지금의 생활 리듬은 어떤가요?', description: '소득과 주거 환경은 기준선과 유사그룹을 찾는 데만 사용해요.', choices: [{ value: 'REGULAR_RENT_MEDIUM', label: '정기 소득 · 자취 중이에요' }, { value: 'IRREGULAR_RENT_HIGH', label: '소득이 달마다 달라요' }, { value: 'NONE_WITH_FAMILY_LOW', label: '현재 정기 소득이 없어요' }] },
  { eyebrow: '돈 고민 진단', title: '가장 먼저 풀고 싶은 고민은?', description: '이 선택이 목표를 자동으로 만들지는 않아요.', choices: [{ value: 'SAVING', label: '저축을 꾸준히 하고 싶어요' }, { value: 'SPENDING', label: '소비 흐름을 점검하고 싶어요' }, { value: 'EMERGENCY_FUND', label: '비상금을 준비하고 싶어요' }, { value: 'INVESTMENT_JUDGMENT', label: '투자 판단의 기초를 배우고 싶어요' }] },
  { eyebrow: '금융 성향', title: '새로운 금융 행동을 시작할 때', description: '투자상품 추천이 아니라 설명 방식과 행동 강도를 조절해요.', choices: [{ value: 'CAUTIOUS', label: '충분히 이해한 뒤 천천히 시작해요' }, { value: 'BALANCED', label: '안전성과 실행을 함께 봐요' }, { value: 'EXPLORING', label: '여러 방법을 살펴보고 결정해요' }] },
  { eyebrow: '생활 태그', title: '나를 잘 설명하는 맥락은?', description: '메이트에게는 익명 태그만 보이고 정확한 금융값은 기본 비공개예요.', choices: [{ value: '자취|사회초년생', label: '자취 · 사회초년생' }, { value: '가족동거|대학생', label: '가족과 동거 · 대학생' }, { value: '가족동거|취업준비', label: '가족과 동거 · 취업준비' }] },
  { eyebrow: '마이데이터 연결', title: '합성 금융데이터를 연결할까요?', description: 'MVP에서는 실제 계좌가 아닌 합성데이터로 기준선과 레이드를 검증해요.', choices: [{ value: 'CONNECT_SYNTHETIC', label: '동의 범위를 확인하고 연결하기' }] },
] as const
const formatWon = (value: number) => `${new Intl.NumberFormat('ko-KR').format(value)}원`
const formatSyncTime = (value?: string | null) => value ? new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : '확인 중'
const difficultyLabel = (difficulty: Schema['RoutineAdaptationCandidate']['difficulty']) => difficulty === 'LIGHT' ? '가볍게' : difficulty === 'STANDARD' ? '표준' : '도전'
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
  return <section className={styles.state}><Sparkles size={24}/><h2>{content[0]}</h2><p>{content[1]}</p>{onRetry && <button className={styles.secondary} onClick={onRetry}>다시 시도</button>}</section>
}

function DataStateNotice({ dataState, lastSyncedAt }: { dataState: Schema['DataState']; lastSyncedAt?: string | null }) {
  if (dataState === 'FRESH') return null
  const content = dataState === 'PENDING'
    ? ['새 데이터 반영 대기', '완료한 행동을 확인한 뒤 금융 상태를 다시 계산해요.']
    : dataState === 'STALE'
      ? ['데이터 업데이트 필요', '마지막으로 확인된 결과이며 새로운 진행은 잠시 멈춰요.']
      : ['분석 데이터 부족', '기록이 더 쌓일 때까지 가능한 행동형 퀘스트부터 안내해요.']
  return <aside className={styles.dataNotice} role="status"><strong>{content[0]}</strong><span>{content[1]}{lastSyncedAt ? ` · 최근 동기화 ${formatSyncTime(lastSyncedAt)}` : ''}</span></aside>
}

function MobileShell({ children }: { children: React.ReactNode }) { return <main className={styles.shell}>{children}</main> }
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
  return <MobileShell><section className={styles.auth}><span className={styles.brand}>FinMate</span><div><p className={styles.eyebrow}>돈과 목표를 함께 보는 여정</p><h1>{login ? '다시 만나서 반가워요' : '돈과 조금 더 친해져 볼까요?'}</h1><p>금융 정보는 MyData 결과로만 보여 드리고, 보상은 꾸미기와 콘텐츠 안에서만 사용돼요.</p></div><form onSubmit={form.handleSubmit(submit)} className={styles.form}>{!login && <><label>이름<input aria-label="이름" {...form.register('displayName')}/></label><small>{message(form.formState.errors.displayName?.message)}</small></>}<label>이메일<input aria-label="이메일" type="email" {...form.register('email')}/></label><small>{message(form.formState.errors.email?.message)}</small><label>비밀번호<input aria-label="비밀번호" type="password" {...form.register('password')}/></label><small>{message(form.formState.errors.password?.message)}</small>{error !== null && <small role="alert">{errorState(error) === 'error' ? '입력 내용을 다시 확인해 주세요.' : '지금은 진행할 수 없어요.'}</small>}<button className={styles.primary} type="submit">{login ? '로그인' : '시작하기'}</button></form><Link to={login ? '/signup' : '/login'}>{login ? '처음이라면 가입하기' : '이미 계정이 있다면 로그인'}</Link></section></MobileShell>
}

function Onboarding() {
  const navigate = useNavigate(); const { step } = useParams(); const requested = Number(step); const currentStep = Number.isInteger(requested) && requested >= 1 && requested <= onboardingSteps.length ? requested : 1; const [draft, setDraft] = useState(getOnboardingDraft); const complete = useCompleteOnboarding()
  const next = async () => {
    if (currentStep < onboardingSteps.length) { navigate(`/onboarding/${currentStep + 1}`); return }
    try { await complete.mutateAsync(onboardingCompletion()); navigate('/onboarding/baseline') } catch { /* rendered below */ }
  }
  const choose = (answer: string) => setDraft(saveOnboardingAnswer(currentStep, answer))
  const config = onboardingSteps[currentStep - 1]
  return <MobileShell><section className={styles.page}><div className={styles.progress}><span>{currentStep} / {onboardingSteps.length}</span><i style={{ width: `${currentStep / onboardingSteps.length * 100}%` }}/></div><p className={styles.eyebrow}>{config.eyebrow}</p><h1>{config.title}</h1><p>{config.description}</p><div className={styles.choiceList}>{config.choices.map((choice) => <button aria-pressed={draft.answers[currentStep] === choice.value} className={styles.choice} key={choice.value} onClick={() => choose(choice.value)}>{choice.label}</button>)}</div>{currentStep === 5 && <aside className={styles.calculationNotice}><ShieldCheck size={20}/><p>계좌번호와 실제 거래 원문은 사용하지 않으며, 공개 설정은 기본 비공개예요.</p></aside>}{complete.error && <small role="alert">연결을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.</small>}<button className={styles.primary} disabled={!draft.answers[currentStep] || complete.isPending} onClick={() => void next()}>{currentStep === onboardingSteps.length ? '연결하고 기준선 보기' : '다음'}<ChevronRight size={20}/></button></section></MobileShell>
}

function BaselineDiagnosis() {
  const onboarding = useOnboarding(); const waiting = QueryState({ loading: onboarding.isLoading, error: onboarding.error, retry: () => void onboarding.refetch() }); if (waiting) return waiting; if (!onboarding.data) return null
  if (onboarding.data.status !== 'COMPLETED') return <Navigate to="/onboarding/5" replace/>
  const baseline = onboarding.data.baseline
  return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>내 금융 기준선</p><h1>지금의 출발점을 확인했어요</h1><p>목표와 메이트 추천은 이 기준선을 바탕으로 계산해요.</p><DataStateNotice dataState={onboarding.data.dataState} lastSyncedAt={onboarding.data.lastSyncedAt}/><section className={styles.baselineHero}><div><span>월 여윳돈</span><strong>{formatWon(baseline.disposableIncomeKrw)}</strong></div><p>최근 소득에서 필수지출을 뺀 합성데이터 기준이에요.</p></section><section className={styles.baselineGrid}><article><span>소비율</span><strong>{baseline.spendingRateBps / 100}%</strong><small>여윳돈 대비 재량지출</small></article><article><span>저축률</span><strong>{baseline.savingRateBps / 100}%</strong><small>여윳돈 대비 저축 순유입</small></article><article><span>투자 판단</span><strong>{baseline.investmentJudgmentBps / 100}점</strong><small>위험성향·점검 행동</small></article></section><aside className={styles.calculationNotice}><ShieldCheck size={20}/><p>이 수치는 평가나 순위가 아니라 내 목표와 실행 강도를 정하는 기준이에요.</p></aside><Link className={styles.primary} to="/goal/confirm">목표 설정하기</Link><Link className={styles.secondary} to="/home">일단 메이트 탐색하기</Link></section></MobileShell>
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
  const progress = watchedGoal.targetAmountKrw ? Math.min(100, watchedGoal.currentAmountKrw / watchedGoal.targetAmountKrw * 100) : 0
  const goalError = onboarding.error ?? complete.error ?? confirmGoal.error
  const waiting = QueryState({ loading: onboarding.isLoading, error: null, retry: () => void onboarding.refetch() })
  if (waiting) return waiting
  return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>목표 확인</p><h1>{watchedGoal.title || '유럽 여행 자금'}을 위한 준비</h1><form className={styles.form} onSubmit={form.handleSubmit(confirm)}><label>목표 이름<input aria-label="목표 이름" {...form.register('title')}/></label><label>현재 금액<input aria-label="현재 금액" type="number" {...form.register('currentAmountKrw', { valueAsNumber: true })}/></label><label>목표 금액<input aria-label="목표 금액" type="number" {...form.register('targetAmountKrw', { valueAsNumber: true })}/></label><label>목표 월<input aria-label="목표 월" type="month" {...form.register('targetMonth')}/></label><div className={styles.goalHero}><span>주 목표</span><strong>{formatWon(watchedGoal.currentAmountKrw || 0)}</strong><small>/ {formatWon(watchedGoal.targetAmountKrw || 0)}</small><div className={styles.goalTrack}><i style={{ width: `${progress}%` }}/></div><p>현재 합성 금융데이터로 확인된 저축 금액이에요.</p></div><p>메이트는 이 목표를 바꾸지 않아요. 함께할 루틴만 제안해요.</p>{goalError && <small role="alert">{errorState(goalError) === 'stale' ? '데이터가 조금 오래됐어요.' : '목표를 만들지 못했어요.'}</small>}<button className={styles.primary} disabled={complete.isPending || confirmGoal.isPending} type="submit">{watchedGoal.title || '유럽 여행 자금'} 목표 만들기</button><button className={styles.secondary} disabled={complete.isPending || confirmGoal.isPending} type="button" onClick={() => void explore()}>일단 탐색하기</button></form></section></MobileShell>
}

function GoalSuccess() { const navigate = useNavigate(); return <MobileShell><section className={styles.page}><ShieldCheck size={42} className={styles.successIcon}/><p className={styles.eyebrow}>목표가 시작됐어요</p><h1>여행까지 한 걸음</h1><p>목표 금액과 현재 저축 흐름을 바탕으로 홈 레이드를 준비했어요.</p><button className={styles.primary} onClick={() => navigate('/home')}>홈으로 가기</button></section></MobileShell> }

function HomeScreen() {
  const navigate = useNavigate(); const home = useHome(); const waiting = QueryState({ loading: home.isLoading, error: home.error, retry: () => void home.refetch() }); if (waiting) return waiting; if (!home.data) return null
  const { mainGoal, raid, activeRoutineBuild } = home.data
  if (home.data.mode === 'EXPLORE_ONLY' || !mainGoal || !raid) return <MobileShell><section className={`${styles.page} ${styles.homePage}`}><AppHeader totalAssetsKrw={home.data.totalAssetsKrw}/><div className={styles.emptyRaid}><Target size={38}/><p className={styles.eyebrow}>탐색 모드</p><h1>목표를 정하면 레이드가 시작돼요</h1><p>메이트의 루틴은 먼저 둘러볼 수 있어요. 퀘스트 수락과 루틴 적용은 목표를 정한 뒤 열립니다.</p><Link className={styles.primary} to="/goal/confirm">목표 설정</Link><Link className={styles.secondary} to="/mates">메이트 둘러보기</Link></div></section><Tabs/></MobileShell>
  const progress = Math.round(mainGoal.currentAmountKrw / mainGoal.targetAmountKrw * 100); const goalCompleted = mainGoal.state === 'COMPLETED' || raid.status === 'COMPLETED'
  const openReport = (type: Schema['CharacterReportType']) => navigate(`/report?type=${type}`)
  return <MobileShell><section className={`${styles.page} ${styles.homePage}`}><AppHeader totalAssetsKrw={home.data.totalAssetsKrw}/><DataStateNotice dataState={home.data.dataState} lastSyncedAt={home.data.lastSyncedAt}/><section className={styles.goalSummary}><div><span>현재 목표</span><h1>{mainGoal.title} 목표를 향해 가고 있어요.</h1><p>최근 동기화 {formatSyncTime(home.data.lastSyncedAt)}</p></div><strong>{progress}%</strong><div className={styles.goalTrack}><i style={{ width: `${progress}%` }}/></div><p><b>{formatWon(mainGoal.currentAmountKrw)}</b><span>/ {formatWon(mainGoal.targetAmountKrw)}</span></p></section><HomeRaidScene goalTitle={mainGoal.title} goalProgress={progress} stage={raid.stage} bossHpBps={raid.bossHpBps} stats={raid.financialStats} onOpenQuest={() => navigate('/quests')} onOpenReport={openReport}/><section className={styles.homeActions}>{activeRoutineBuild && <article className={styles.routineCard}><span>적용 중인 루틴</span><h2>현재 루틴: {activeRoutineBuild.steps[0]}</h2><p>{activeRoutineBuild.difficulty === 'LIGHT' ? '가볍게' : activeRoutineBuild.difficulty === 'STANDARD' ? '표준' : '도전'} · 목표는 그대로 유지돼요.</p></article>}<button aria-label="동물 리포트" className={styles.reportShortcut} onClick={() => navigate('/report')}><Heart size={20}/><span><strong>분야별 금융 리포트</strong><small>곰·물개·토끼·새의 계산 근거 보기</small></span><ChevronRight size={20}/></button><button className={styles.questShortcut} onClick={() => navigate('/quests')}><Compass size={20}/><span><strong>{goalCompleted ? '완료 기록 확인하기' : '다음 퀘스트 확인하기'}</strong><small>{raid.status === 'WAITING_FOR_DATA' ? '새 금융데이터 반영을 기다리고 있어요.' : '실행할 작은 행동을 확인해요.'}</small></span><ChevronRight size={20}/></button></section></section><Tabs/></MobileShell>
}

function AppHeader({ totalAssetsKrw }: { totalAssetsKrw: number }) {
  return <header className={styles.appHeader}><img className={styles.logo} src="/FinMate_Logo.png" alt="FinMate"/><div className={styles.assetPill}><span>총자산</span><strong>{formatWon(totalAssetsKrw)}</strong></div><img className={styles.profileAvatar} src="/assets/home/home-avatar-me.png" alt="내 프로필"/></header>
}

const reportTypes: Array<{ type: Schema['CharacterReportType']; label: string }> = [
  { type: 'SPENDING_DEFENSE', label: '곰 · 소비' },
  { type: 'SAVING_HP', label: '물개 · 저축' },
  { type: 'INVESTMENT_JUDGMENT', label: '토끼 · 투자 판단' },
  { type: 'QUEST_XP', label: '새 · 퀘스트' },
]

const reportCharacter: Record<Schema['CharacterReportType'], { image: string; title: string; description: string }> = {
  SPENDING_DEFENSE: { image: '/assets/characters/mate/mate-char-bear.png', title: '곰 · 소비 방어력', description: '여윳돈 안에서 소비 흐름을 지키는 힘이에요.' },
  SAVING_HP: { image: '/assets/home/home-char-save.png', title: '물개 · 저축 HP', description: '목표를 향해 저축을 이어가는 힘이에요.' },
  INVESTMENT_JUDGMENT: { image: '/assets/characters/mate/mate-char-rabbit.png', title: '토끼 · 투자 판단력', description: '위험을 이해하고 점검하는 힘이에요.' },
  QUEST_XP: { image: '/assets/characters/mate/mate-char-bird.png', title: '새 · 퀘스트 XP', description: '작은 금융 행동과 학습을 이어간 기록이에요.' },
}

function AnimalReportScreen() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedType = searchParams.get('type') as Schema['CharacterReportType'] | null
  const initialType = reportTypes.some((item) => item.type === requestedType) ? requestedType ?? 'SAVING_HP' : 'SAVING_HP'
  const [reportType, setReportType] = useState<Schema['CharacterReportType']>(initialType)
  const report = useCharacterReport(reportType); const navigate = useNavigate(); const waiting = QueryState({ loading: report.isLoading, error: report.error, retry: () => void report.refetch() }); if (waiting) return waiting; if (!report.data) return null
  const meta = reportCharacter[reportType]
  const selectReport = (type: Schema['CharacterReportType']) => { setReportType(type); setSearchParams({ type }) }
  return <MobileShell><section className={styles.page}><header className={styles.sectionHeader}><div><p className={styles.eyebrow}>금융 리포트</p><h1>분야별 동물 리포트</h1><span>실제값과 산정 이유를 함께 확인해요.</span></div></header><div className={styles.characterTabs}>{reportTypes.map((item) => <button aria-label={`${item.label} 리포트`} aria-pressed={reportType === item.type} key={item.type} onClick={() => selectReport(item.type)}><img src={reportCharacter[item.type].image} alt=""/><span>{item.label}</span></button>)}</div><DataStateNotice dataState={report.data.dataState} lastSyncedAt={report.data.lastSyncedAt}/><section className={styles.characterReport}><img src={meta.image} alt=""/><div><p>{meta.title}</p><h2>{report.data.scoreBps / 100}점</h2><span>{meta.description}</span></div></section><section className={styles.metricList}>{report.data.metrics.map((metric) => <article key={metric.label}><span>{metric.label}</span><strong>{metric.displayValue}</strong><small>검증된 금융데이터 기준</small></article>)}</section><aside className={styles.calculationNotice}><ShieldCheck size={20}/><p>금융 스탯은 데이터 동기화 후 API가 계산하고, 퀘스트 XP는 완료 기록으로 분리해 계산해요.</p></aside><button className={styles.primary} onClick={() => navigate('/mates')}>메이트 루틴 살펴보기</button></section><Tabs/></MobileShell>
}

function MateGroups() { const groups = useMateGroups(); const waiting = QueryState({ loading: groups.isLoading, error: groups.error, retry: () => void groups.refetch() }); if (waiting) return waiting; if (!groups.data) return null; return <MobileShell><section className={styles.mateNavWrap}><MateSectionNav active="groups"/></section><MateDiscovery groups={groups.data.items}/><Tabs/></MobileShell> }

function MateFriends() {
  const overview = useMateFriendOverview(); const feed = useMateFriendFeed(); const streaks = useMateFriendStreaks(); const error = overview.error ?? feed.error ?? streaks.error
  const waiting = QueryState({ loading: overview.isLoading || feed.isLoading || streaks.isLoading, error, retry: () => { void overview.refetch(); void feed.refetch(); void streaks.refetch() } }); if (waiting) return waiting
  if (!overview.data || !feed.data || !streaks.data) return null
  return <MobileShell><FriendOverviewView overview={overview.data} feed={feed.data} streaks={streaks.data}/><Tabs/></MobileShell>
}

const initialExploreFilters: Schema['MateExploreSearchRequest'] = { ageBand: 'AGE_24_29', occupationGroup: 'EARLY_CAREER', incomeBand: 'FROM_200_TO_300', spendingTendency: 'BALANCED', savingRateBand: 'FROM_10_TO_20', investmentTendency: 'BALANCED' }

function MateExplore() {
  const search = useMateExploreSearch(); const [filters, setFilters] = useState(initialExploreFilters)
  const update = <K extends keyof Schema['MateExploreSearchRequest']>(key: K, value: Schema['MateExploreSearchRequest'][K]) => setFilters((current) => ({ ...current, [key]: value }))
  return <MobileShell><section className={`${styles.page} ${styles.explorePage}`}><header className={styles.sectionHeader}><div><p className={styles.eyebrow}>비교 탐색</p><h1>조건으로 익명 모험가 찾기</h1><span>검수된 필터 조합 안에서 합성 모험가를 찾아요.</span></div><Search size={30}/></header><MateSectionNav active="explore"/><section className={styles.filterPanel}><label>나이<select value={filters.ageBand} onChange={(event) => update('ageBand', event.target.value as Schema['MateExploreSearchRequest']['ageBand'])}><option value="AGE_19_23">19–23세</option><option value="AGE_24_29">24–29세</option><option value="AGE_30_34">30–34세</option></select></label><label>직업<select value={filters.occupationGroup} onChange={(event) => update('occupationGroup', event.target.value as Schema['MateExploreSearchRequest']['occupationGroup'])}><option value="STUDENT">학생</option><option value="EARLY_CAREER">사회초년생</option><option value="FREELANCER">프리랜서</option><option value="JOB_SEEKER">취업준비</option></select></label><label>월소득 구간<select value={filters.incomeBand} onChange={(event) => update('incomeBand', event.target.value as Schema['MateExploreSearchRequest']['incomeBand'])}><option value="NONE">정기소득 없음</option><option value="UNDER_200">200만원 미만</option><option value="FROM_200_TO_300">200–300만원</option><option value="OVER_300">300만원 초과</option></select></label><label>소비 성향<select value={filters.spendingTendency} onChange={(event) => update('spendingTendency', event.target.value as Schema['MateExploreSearchRequest']['spendingTendency'])}><option value="PLANNED">계획형</option><option value="BALANCED">균형형</option><option value="VARIABLE">변동형</option></select></label><label>저축률<select value={filters.savingRateBand} onChange={(event) => update('savingRateBand', event.target.value as Schema['MateExploreSearchRequest']['savingRateBand'])}><option value="UNDER_10">10% 미만</option><option value="FROM_10_TO_20">10–20%</option><option value="OVER_20">20% 초과</option></select></label><label>투자 성향<select value={filters.investmentTendency} onChange={(event) => update('investmentTendency', event.target.value as Schema['MateExploreSearchRequest']['investmentTendency'])}><option value="CAUTIOUS">신중형</option><option value="BALANCED">균형형</option><option value="LEARNING">학습 중</option></select></label><button className={styles.primary} disabled={search.isPending} onClick={() => search.mutate(filters)}>모험가 찾기<Search size={18}/></button></section>{search.error && <StateView state={errorState(search.error)} onRetry={() => search.mutate(filters)}/>}<ExploreResults results={search.data ?? null}/></section><Tabs/></MobileShell>
}

function GroupDetail() {
  const { groupId = '' } = useParams(); const groups = useMateGroups(); const report = useMateGroupReport(groupId); const adventurers = useAdventurers(groupId); const waiting = QueryState({ loading: groups.isLoading || report.isLoading || adventurers.isLoading, error: groups.error ?? report.error ?? adventurers.error, retry: () => { void groups.refetch(); void report.refetch(); void adventurers.refetch() } }); if (waiting) return waiting
  const group = groups.data?.items.find((item) => item.groupId === groupId); if (!group) return <MobileShell><StateView state="empty"/></MobileShell>
  return <MobileShell>{adventurers.data && report.data && <><section className={styles.mateNavWrap}><MateSectionNav active="groups"/><DataStateNotice dataState={adventurers.data.dataState} lastSyncedAt={adventurers.data.lastSyncedAt}/><GroupInsightView report={report.data}/></section><MateGroupDetailView group={group} adventurers={adventurers.data.items}/></>}<Tabs/></MobileShell>
}

function AdventurerProfile() {
  const { groupId = '', adventurerId = '' } = useParams(); const adventurer = useAdventurer(groupId, adventurerId); const waiting = QueryState({ loading: adventurer.isLoading, error: adventurer.error, retry: () => void adventurer.refetch() }); if (waiting) return waiting; if (!adventurer.data) return null
  return <MobileShell><AdventurerProfileView adventurer={adventurer.data}/><Tabs/></MobileShell>
}

function AdventurerComparison() {
  const { groupId = '', adventurerId = '' } = useParams(); const report = useAdventurerReport(groupId, adventurerId); const waiting = QueryState({ loading: report.isLoading, error: report.error, retry: () => void report.refetch() }); if (waiting) return waiting; if (!report.data) return null
  return <MobileShell><DataStateNotice dataState={report.data.dataState} lastSyncedAt={report.data.lastSyncedAt}/><AdventurerReportView report={report.data}/><Tabs/></MobileShell>
}

function AdventurerRoutineScreen() {
  const { groupId = '', adventurerId = '', routineId = '' } = useParams(); const routine = useAdventurerRoutine(groupId, adventurerId, routineId); const waiting = QueryState({ loading: routine.isLoading, error: routine.error, retry: () => void routine.refetch() }); if (waiting) return waiting; if (!routine.data) return null
  return <MobileShell><AdventurerRoutineIntro routine={routine.data}/><Tabs/></MobileShell>
}

function RoutineScreen() {
  const { groupId = '', adventurerId = '', routineId = '' } = useParams(); const navigate = useNavigate(); const [adaptation, setAdaptation] = useState<Schema['RoutineRecommendation'] | null>(null); const [candidateId, setCandidateId] = useState<string | null>(null); const [confirming, setConfirming] = useState(false); const create = useCreateRecommendation(); const active = useActiveRoutine(); const importRoutine = useImportRoutine(); const replace = useReplaceRoutine()
  const prepare = () => create.mutate({ groupId, adventurerId, sourceRoutineId: routineId, selectedDomain: 'SAVING' }, { onSuccess: (recommendation) => { setAdaptation(recommendation); setCandidateId(recommendation.recommendedCandidate.candidateId) } })
  const activate = () => { if (!adaptation || !candidateId) return; if (active.data) { setConfirming(true); return } importRoutine.mutate({ adaptationId: adaptation.adaptationId, candidateId }, { onSuccess: () => navigate('/routine/confirm') }) }
  const replaceActive = () => { if (!adaptation || !candidateId) return; replace.mutate({ adaptationId: adaptation.adaptationId, candidateId, confirmReplacement: true }, { onSuccess: () => navigate('/routine/confirm') }) }
  const candidates = adaptation?.intensityOptions ?? []
  const mutationError = create.error ?? importRoutine.error ?? replace.error
  return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>루틴 개인화</p><h1>나에게 맞는 저축 루틴</h1><p>추천 루틴을 그대로 복사하지 않고, 생활에 맞게 강도를 조절해요.</p>{adaptation && <DataStateNotice dataState={adaptation.dataState} lastSyncedAt={adaptation.lastSyncedAt}/>} {!adaptation && <button className={styles.primary} disabled={create.isPending} onClick={prepare}>내 기준으로 추천 받기</button>}{adaptation && <div className={styles.choiceList}>{candidates.map((candidate) => <button aria-pressed={candidateId === candidate.candidateId} className={styles.choice} key={candidate.candidateId} onClick={() => setCandidateId(candidate.candidateId)}>{difficultyLabel(candidate.difficulty)} · {candidate.title}</button>)}</div>}{candidateId && <button className={styles.primary} disabled={active.isLoading || importRoutine.isPending || replace.isPending} onClick={activate}>이 루틴으로 바꾸기</button>}{adaptation?.relatedProductId && <Link className={styles.secondary} to={`/products/${adaptation.relatedProductId}`}>관련 하나 상품 정보 보기</Link>}{adaptation?.relatedProductId && <p className={styles.productBoundary}>상품 정보 열람은 루틴 적용, XP, 레이드 진행에 영향을 주지 않아요.</p>}{mutationError && <small role="alert">루틴을 적용하지 못했어요. 잠시 후 다시 시도해 주세요.</small>}</section>{confirming && <div className={styles.scrim}><section className={styles.sheet} role="dialog" aria-label="루틴 변경 확인"><h2>루틴 변경 확인</h2><p>새 루틴으로 교체하면 현재 루틴은 종료돼요.</p><p>여행 목표는 그대로 유지돼요.</p><div className={styles.sheetActions}><button className={styles.secondary} onClick={() => setConfirming(false)}>취소</button><button className={styles.primary} disabled={replace.isPending} onClick={replaceActive}>교체 확정</button></div></section></div>}<Tabs/></MobileShell>
}

function RoutineConfirm() { const navigate = useNavigate(); const active = useActiveRoutine(); const waiting = QueryState({ loading: active.isLoading, error: active.error, retry: () => void active.refetch() }); if (waiting) return waiting; if (!active.data) return null; return <MobileShell><section className={styles.page}><ShieldCheck size={42} className={styles.successIcon}/><p className={styles.eyebrow}>활성 루틴</p><h1>활성 루틴이 바뀌었어요</h1><p>{active.data.steps[0]}</p><button className={styles.primary} onClick={() => navigate('/quests')}>퀘스트 보러 가기</button></section><Tabs/></MobileShell> }

function Quests() {
  const quests = useQuests(); const waiting = QueryState({ loading: quests.isLoading, error: quests.error, retry: () => void quests.refetch() }); if (waiting) return waiting; if (!quests.data) return null
  return <MobileShell><section className={`${styles.page} ${styles.questPage}`}><header className={styles.sectionHeader}><div><p className={styles.eyebrow}>퀘스트</p><h1>오늘의 작은 행동</h1><span>목표와 현재 루틴에 맞는 행동을 골라요.</span></div><img src="/assets/quest/quest-mascot-ai.webp" alt="AI 코치"/></header><DataStateNotice dataState={quests.data.dataState} lastSyncedAt={quests.data.lastSyncedAt}/><section className={styles.questSummary}><div><span>오늘 완료</span><strong>{quests.data.completedTodayCount} / {quests.data.totalTodayCount}</strong></div><div><span>누적 XP</span><strong>{quests.data.totalXp}</strong></div><p>퀘스트는 XP를 쌓고, 금융 스탯은 데이터 동기화 후 다시 계산돼요.</p></section><div className={styles.questList}>{quests.data.items.map((quest) => { const knowledgeQuest = quest.title.includes('ETF'); return <Link className={styles.questCard} to={`/quests/${quest.questId}`} key={quest.questId}><span className={styles.questIcon}><img src={knowledgeQuest ? '/assets/quest/quest-icon-knowledge.png' : '/assets/quest/quest-icon-saving.png'} alt=""/></span><div><span className={styles.questStatus}>{quest.status === 'AVAILABLE' ? '참여 가능' : quest.status === 'ACTIVE' ? '진행 중' : quest.status === 'DATA_PENDING' ? '데이터 반영 대기' : '완료'}</span><h2>{quest.title}</h2><p>{quest.verificationKind === 'SYNTHETIC_MYDATA' ? '합성 금융데이터로 확인' : '앱 안의 행동으로 확인'} · {quest.durationLabel}</p><small>XP {quest.xpReward} · 꾸미기 포인트 {quest.pointReward}</small></div><ChevronRight size={21}/></Link>})}</div><aside className={styles.education}><Compass size={22}/><div><strong>투자 판단 O/X</strong><p>“ETF는 원금 손실이 절대 없다”는 X예요. 위험을 이해하는 학습이며 상품 추천이 아니에요.</p></div></aside></section><Tabs/></MobileShell>
}

function QuestDetailScreen() {
  const { questId = '' } = useParams(); const quest = useQuest(questId); const accept = useAcceptQuest(); const complete = useCompleteQuest(); const [message, setMessage] = useState<string>(); const error = quest.error ?? accept.error ?? complete.error
  const waiting = QueryState({ loading: quest.isLoading, error: quest.error, retry: () => void quest.refetch() }); if (waiting) return waiting; if (!quest.data) return null
  const acceptQuest = () => accept.mutate(questId, { onSuccess: () => setMessage('퀘스트를 수락했어요. 금융 스탯은 아직 바뀌지 않아요.') })
  const completeQuest = () => complete.mutate(questId, { onSuccess: (result) => setMessage(result.quest.status === 'DATA_PENDING' ? '행동을 기록했어요. 새 금융데이터 확인을 기다려요.' : `완료했어요. XP ${result.xpAwarded}를 받았어요.`) })
  return <MobileShell><QuestDetailView quest={quest.data} onAccept={acceptQuest} onComplete={completeQuest} pending={accept.isPending || complete.isPending} message={message}/>{error && error !== quest.error && <div className={styles.floatingError} role="alert">퀘스트를 처리하지 못했어요. 다시 시도해 주세요.</div>}<Tabs/></MobileShell>
}

function ProductInfoScreen() {
  const { productId = '' } = useParams(); const product = useHanaProductInfo(productId); const waiting = QueryState({ loading: product.isLoading, error: product.error, retry: () => void product.refetch() }); if (waiting) return waiting; if (!product.data) return null
  return <MobileShell><ProductInfoView product={product.data}/><Tabs/></MobileShell>
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
  const navigate = useNavigate()
  const waiting = QueryState({ loading: records.isLoading, error: records.error, retry: () => void records.refetch() })
  if (waiting) return waiting
  if (!records.data) return null
  const changeMonth = (offset: -1 | 1) => {
    setSelectedDate(null)
    setMonth((current) => shiftMonth(current, offset))
  }
  return <MobileShell><section className={styles.recordPage}><RecordJourneyMap journey={records.data} onChangeMonth={changeMonth} onSelectDate={setSelectedDate}/><button className={styles.demoLink} onClick={() => navigate('/demo')}>시연 시간 진행</button></section>{selectedDate && <RecordDaySheet date={selectedDate} onClose={() => setSelectedDate(null)}/>}<Tabs/></MobileShell>
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
  return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>시연 전용</p><h1>30일 여정을 빠르게 진행할까요?</h1><p>데모 전용 화면이에요. 실제 금융 데이터나 저축 금액은 변경하지 않아요.</p><div className={styles.raid}><span>30일 차</span><h2>여행 준비 완료</h2><div className={styles.boss}><i style={{ width: '100%' }}/></div></div>{advance.error && <small role="alert">{errorState(advance.error) === 'stale' ? '데모 단계가 오래되었어요.' : '데모를 진행하지 못했어요.'}</small>}<button className={styles.primary} disabled={advance.isPending} onClick={() => void completeDemo()}>목표 완료 보기</button></section><Tabs/></MobileShell>
}

function GoalComplete() { const home = useHome(); const waiting = QueryState({ loading: home.isLoading, error: home.error, retry: () => void home.refetch() }); if (waiting) return waiting; if (!home.data?.mainGoal) return <MobileShell><StateView state="empty"/></MobileShell>; return <MobileShell><section className={styles.page}><ShieldCheck size={48} className={styles.successIcon}/><p className={styles.eyebrow}>목표 완료</p><h1>{home.data.mainGoal.title} 목표를 완주했어요</h1><p>여정에서 얻은 보상은 프로필 꾸미기와 다음 콘텐츠를 여는 데 사용돼요.</p><Link className={styles.primary} to="/home">새 여정 시작하기</Link></section></MobileShell> }

function DevStates() { const navigate = useNavigate(); return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>DEVELOPMENT STATES</p><h1>상태 미리보기</h1><div className={styles.choiceList}>{(['loading', 'empty', 'stale', 'error'] as const).map((state) => <button key={state} className={styles.choice} onClick={() => navigate(`/dev/${state}`)}>{state}</button>)}</div></section></MobileShell> }
function DevState({ state }: { state: 'loading' | 'empty' | 'stale' | 'error' }) { return <MobileShell><StateView state={state}/></MobileShell> }
function Tabs() { const { pathname } = useLocation(); const active = pathname.startsWith('/mates') || pathname.startsWith('/routine') || pathname.startsWith('/products') ? 'mates' : pathname.startsWith('/quests') ? 'quests' : pathname.startsWith('/record') || pathname.startsWith('/demo') ? 'record' : 'home'; return <nav className={styles.tabs} aria-label="주요 탐색"><Link aria-current={active === 'home' ? 'page' : undefined} className={active === 'home' ? styles.tabActive : undefined} to="/home"><Home size={19}/><span>홈</span></Link><Link aria-current={active === 'mates' ? 'page' : undefined} className={active === 'mates' ? styles.tabActive : undefined} to="/mates"><Users size={19}/><span>메이트</span></Link><Link aria-current={active === 'quests' ? 'page' : undefined} className={active === 'quests' ? styles.tabActive : undefined} to="/quests"><Compass size={19}/><span>퀘스트</span></Link><Link aria-current={active === 'record' ? 'page' : undefined} className={active === 'record' ? styles.tabActive : undefined} to="/record"><BookOpen size={19}/><span>기록</span></Link></nav> }

export default function App() { return <Routes><Route path="/" element={<Navigate to="/signup" replace/>}/><Route path="/signup" element={<AuthScreen/>}/><Route path="/login" element={<AuthScreen login/>}/><Route path="/onboarding/baseline" element={<BaselineDiagnosis/>}/><Route path="/onboarding/:step" element={<Onboarding/>}/><Route path="/goal/confirm" element={<GoalConfirmation/>}/><Route path="/goal/success" element={<GoalSuccess/>}/><Route path="/goal/complete" element={<GoalComplete/>}/><Route path="/home" element={<HomeScreen/>}/><Route path="/report" element={<AnimalReportScreen/>}/><Route path="/mates" element={<MateGroups/>}/><Route path="/mates/friends" element={<MateFriends/>}/><Route path="/mates/explore" element={<MateExplore/>}/><Route path="/mates/group/:groupId" element={<GroupDetail/>}/><Route path="/mates/group/:groupId/adventurer/:adventurerId" element={<AdventurerProfile/>}/><Route path="/mates/group/:groupId/adventurer/:adventurerId/report" element={<AdventurerComparison/>}/><Route path="/mates/group/:groupId/adventurer/:adventurerId/routine/:routineId" element={<AdventurerRoutineScreen/>}/><Route path="/routine/:groupId/:adventurerId/:routineId" element={<RoutineScreen/>}/><Route path="/routine/confirm" element={<RoutineConfirm/>}/><Route path="/products/:productId" element={<ProductInfoScreen/>}/><Route path="/quests" element={<Quests/>}/><Route path="/quests/:questId" element={<QuestDetailScreen/>}/><Route path="/record" element={<RecordJourney/>}/><Route path="/demo" element={<DemoAdvance/>}/><Route path="/dev" element={<DevStates/>}/><Route path="/dev/loading" element={<DevState state="loading"/>}/><Route path="/dev/empty" element={<DevState state="empty"/>}/><Route path="/dev/stale" element={<DevState state="stale"/>}/><Route path="/dev/error" element={<DevState state="error"/>}/><Route path="*" element={<Navigate to="/signup" replace/>}/></Routes> }
