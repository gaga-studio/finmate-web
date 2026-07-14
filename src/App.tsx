import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BookOpen, ChevronRight, Compass, Heart, Home, ShieldCheck, Sparkles, Target, Users } from 'lucide-react'
import { ApiError, apiRequest, currentSession, type Schema } from './api/client'
import { getDemoExpectedFrameIndex, saveDemoExpectedFrameIndex } from './api/demoProgress'
import { getOnboardingDraft, saveGoalDraft, saveOnboardingAnswer } from './api/onboardingDraft'
import { useAcceptQuest, useActiveRoutine, useAdvanceDemo, useAdventurerRoutine, useAdventurers, useCharacterReport, useCompleteOnboarding, useCompleteQuest, useConfirmGoal, useCreateRecommendation, useDailyJourney, useDailyRecord, useHome, useImportRoutine, useMateGroups, useOnboarding, useQuests, useReplaceRoutine, useRaid } from './api/queries'
import { HomeRaidScene } from './components/HomeRaidScene'
import { MateDiscovery } from './components/MateDiscovery'
import { AdventurerRoutineIntro, MateGroupDetailView } from './components/MateJourneyViews'
import { RecordDaySheetView } from './components/RecordDaySheetView'
import { RecordJourneyMap } from './components/RecordJourneyMap'
import styles from './App.module.css'

const onboardingSteps = ['생활 패턴', '저축 습관', '소비 우선순위', '투자 이해도', '알림 방식', '여정 준비']
const formatWon = (value: number) => `${new Intl.NumberFormat('ko-KR').format(value)}원`
const formatSyncTime = (value?: string | null) => value ? new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : '확인 중'
const difficultyLabel = (difficulty: Schema['RoutineAdaptationCandidate']['difficulty']) => difficulty === 'LIGHT' ? '가볍게' : difficulty === 'STANDARD' ? '표준' : '도전'
const onboardingCompletion = (): Schema['CompleteOnboardingRequest'] => ({
  displayName: currentSession()?.user.displayName ?? '민지',
  context: { incomeRegularity: 'REGULAR', housingType: 'RENT', fixedCostBurden: 'MEDIUM' },
  moneyConcern: 'SAVING',
  financialTendency: 'BALANCED',
  lifestyleTags: ['자취', '사회초년생'],
  anonymousShareConsent: true,
  syntheticMyDataConsent: true,
  finishMode: 'EXPLORE_ONLY',
})

function StateView({ state, onRetry }: { state: 'loading' | 'empty' | 'stale' | 'error'; onRetry?: () => void }) {
  const content = { loading: ['불러오는 중', 'MyData 결과와 루틴을 확인하고 있어요.'], empty: ['아직 쌓인 기록이 없어요', '오늘의 작은 선택부터 시작해 볼까요?'], stale: ['데이터가 조금 오래됐어요', '마지막 MyData 반영 결과를 표시하고 있어요.'], error: ['불러오지 못했어요', '잠시 후 다시 시도해 주세요.'] }[state]
  return <section className={styles.state}><Sparkles size={24}/><h2>{content[0]}</h2><p>{content[1]}</p>{onRetry && <button className={styles.secondary} onClick={onRetry}>다시 시도</button>}</section>
}

function DataStateNotice({ dataState, lastSyncedAt }: { dataState: Schema['DataState']; lastSyncedAt?: string | null }) {
  if (dataState === 'FRESH') return null
  const message = dataState === 'STALE' ? '마지막으로 확인된 데이터를 보여드리고 있어요.' : '데이터가 더 쌓이면 분석 결과를 보여드릴게요.'
  return <aside className={styles.dataNotice} role="status"><strong>{dataState === 'STALE' ? '데이터 업데이트 대기' : '분석 준비 중'}</strong><span>{message}{lastSyncedAt ? ` · ${lastSyncedAt}` : ''}</span></aside>
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
  const navigate = useNavigate(); const { step } = useParams(); const requested = Number(step); const currentStep = Number.isInteger(requested) && requested >= 1 && requested <= 6 ? requested : 1; const [draft, setDraft] = useState(getOnboardingDraft)
  const next = () => currentStep === 6 ? navigate('/goal/confirm') : navigate(`/onboarding/${currentStep + 1}`)
  const choose = (answer: string) => setDraft(saveOnboardingAnswer(currentStep, answer))
  const choices = ['매달 목표를 정하고 싶어요', '자동저축부터 만들고 싶어요', '소비 흐름을 먼저 보고 싶어요']
  return <MobileShell><section className={styles.page}><div className={styles.progress}><span>{currentStep} / 6</span><i style={{ width: `${currentStep / 6 * 100}%` }}/></div><p className={styles.eyebrow}>{onboardingSteps[currentStep - 1]}</p><h1>금융 습관을 알아볼게요</h1><p>정답은 없어요. 지금의 생활 리듬에 맞는 작은 루틴부터 골라요.</p><div className={styles.choiceList}>{choices.map((choice) => <button aria-pressed={draft.answers[currentStep] === choice} className={styles.choice} key={choice} onClick={() => choose(choice)}>{choice}</button>)}</div><button className={styles.primary} onClick={next}>{currentStep === 6 ? '여행 목표 보기' : '다음'}<ChevronRight size={20}/></button></section></MobileShell>
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
  return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>목표 확인</p><h1>{watchedGoal.title || '유럽 여행 자금'}을 위한 준비</h1><form className={styles.form} onSubmit={form.handleSubmit(confirm)}><label>목표 이름<input aria-label="목표 이름" {...form.register('title')}/></label><label>현재 금액<input aria-label="현재 금액" type="number" {...form.register('currentAmountKrw', { valueAsNumber: true })}/></label><label>목표 금액<input aria-label="목표 금액" type="number" {...form.register('targetAmountKrw', { valueAsNumber: true })}/></label><label>목표 월<input aria-label="목표 월" type="month" {...form.register('targetMonth')}/></label><div className={styles.goalHero}><span>주 목표</span><strong>{formatWon(watchedGoal.currentAmountKrw || 0)}</strong><small>/ {formatWon(watchedGoal.targetAmountKrw || 0)}</small><div className={styles.goalTrack}><i style={{ width: `${progress}%` }}/></div><p>현재 MyData 기반으로 확인된 저축 금액이에요.</p></div><p>메이트는 이 목표를 바꾸지 않아요. 함께할 루틴만 제안해요.</p>{goalError && <small role="alert">{errorState(goalError) === 'stale' ? '데이터가 조금 오래됐어요.' : '목표를 만들지 못했어요.'}</small>}<button className={styles.primary} disabled={complete.isPending || confirmGoal.isPending} type="submit">{watchedGoal.title || '유럽 여행 자금'} 목표 만들기</button>{onboarding.data?.status !== 'COMPLETED' && <button className={styles.secondary} disabled={complete.isPending || confirmGoal.isPending} type="button" onClick={() => void explore()}>일단 탐색하기</button>}</form></section></MobileShell>
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

function MateGroups() { const groups = useMateGroups(); const waiting = QueryState({ loading: groups.isLoading, error: groups.error, retry: () => void groups.refetch() }); if (waiting) return waiting; if (!groups.data) return null; return <MobileShell><MateDiscovery groups={groups.data.items}/><Tabs/></MobileShell> }

function GroupDetail() {
  const { groupId = '' } = useParams(); const groups = useMateGroups(); const adventurers = useAdventurers(groupId); const waiting = QueryState({ loading: groups.isLoading || adventurers.isLoading, error: groups.error ?? adventurers.error, retry: () => { void groups.refetch(); void adventurers.refetch() } }); if (waiting) return waiting
  const group = groups.data?.items.find((item) => item.groupId === groupId); if (!group) return <MobileShell><StateView state="empty"/></MobileShell>
  return <MobileShell>{adventurers.data && <><DataStateNotice dataState={adventurers.data.dataState} lastSyncedAt={adventurers.data.lastSyncedAt}/><MateGroupDetailView group={group} adventurers={adventurers.data.items}/></>}<Tabs/></MobileShell>
}

function AdventurerDetail() {
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
  return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>루틴 개인화</p><h1>나에게 맞는 저축 루틴</h1><p>추천 루틴을 그대로 복사하지 않고, 생활에 맞게 강도를 조절해요.</p>{adaptation && <DataStateNotice dataState={adaptation.dataState} lastSyncedAt={adaptation.lastSyncedAt}/>} {!adaptation && <button className={styles.primary} disabled={create.isPending} onClick={prepare}>내 기준으로 추천 받기</button>}{adaptation && <div className={styles.choiceList}>{candidates.map((candidate) => <button aria-pressed={candidateId === candidate.candidateId} className={styles.choice} key={candidate.candidateId} onClick={() => setCandidateId(candidate.candidateId)}>{difficultyLabel(candidate.difficulty)} · {candidate.title}</button>)}</div>}{candidateId && <button className={styles.primary} disabled={active.isLoading || importRoutine.isPending || replace.isPending} onClick={activate}>이 루틴으로 바꾸기</button>}{mutationError && <small role="alert">루틴을 적용하지 못했어요. 잠시 후 다시 시도해 주세요.</small>}</section>{confirming && <div className={styles.scrim}><section className={styles.sheet} role="dialog" aria-label="루틴 변경 확인"><h2>루틴 변경 확인</h2><p>새 루틴으로 교체하면 현재 루틴은 종료돼요.</p><p>여행 목표는 그대로 유지돼요.</p><div className={styles.sheetActions}><button className={styles.secondary} onClick={() => setConfirming(false)}>취소</button><button className={styles.primary} disabled={replace.isPending} onClick={replaceActive}>교체 확정</button></div></section></div>}<Tabs/></MobileShell>
}

function RoutineConfirm() { const navigate = useNavigate(); const active = useActiveRoutine(); const waiting = QueryState({ loading: active.isLoading, error: active.error, retry: () => void active.refetch() }); if (waiting) return waiting; if (!active.data) return null; return <MobileShell><section className={styles.page}><ShieldCheck size={42} className={styles.successIcon}/><p className={styles.eyebrow}>활성 루틴</p><h1>활성 루틴이 바뀌었어요</h1><p>{active.data.steps[0]}</p><button className={styles.primary} onClick={() => navigate('/quests')}>퀘스트 보러 가기</button></section><Tabs/></MobileShell> }

function Quests() {
  const quests = useQuests(); const accept = useAcceptQuest(); const complete = useCompleteQuest(); const [reward, setReward] = useState<Schema['QuestCompletion'] | null>(null); const waiting = QueryState({ loading: quests.isLoading, error: quests.error, retry: () => void quests.refetch() }); if (waiting) return waiting; if (!quests.data) return null
  const rewardPending = reward?.quest.status === 'DATA_PENDING'
  return <MobileShell><section className={`${styles.page} ${styles.questPage}`}><header className={styles.sectionHeader}><div><p className={styles.eyebrow}>퀘스트</p><h1>오늘의 작은 행동</h1><span>목표와 현재 루틴에 맞는 행동을 골라요.</span></div><img src="/assets/quest/quest-mascot-ai.webp" alt="AI 코치"/></header><DataStateNotice dataState={quests.data.dataState} lastSyncedAt={quests.data.lastSyncedAt}/><section className={styles.questSummary}><div><span>오늘 완료</span><strong>{quests.data.completedTodayCount} / {quests.data.totalTodayCount}</strong></div><div><span>누적 XP</span><strong>{quests.data.totalXp}</strong></div><p>퀘스트는 XP를 쌓고, 금융 스탯은 데이터 동기화 후 다시 계산돼요.</p></section>{reward && <div className={styles.questFeedback} role="status"><ShieldCheck size={22}/><div><h2>{rewardPending ? 'MyData 반영을 기다리고 있어요' : '퀘스트를 완료했어요'}</h2><p>{rewardPending ? '실제 금융행동을 확인한 뒤 금융 상태를 다시 계산해요.' : `XP ${reward.xpAwarded} · 꾸미기 포인트 ${reward.pointsAwarded}`}</p></div></div>}<div className={styles.questList}>{quests.data.items.map((quest) => { const available = quest.status === 'AVAILABLE'; const action = available ? '수락' : '완료'; const knowledgeQuest = quest.title.includes('ETF'); return <article className={styles.questCard} key={quest.questId}><span className={styles.questIcon}><img src={knowledgeQuest ? '/assets/quest/quest-icon-knowledge.png' : '/assets/quest/quest-icon-saving.png'} alt=""/></span><div><span className={styles.questStatus}>{quest.status === 'AVAILABLE' ? '참여 가능' : quest.status === 'ACTIVE' ? '진행 중' : quest.status === 'DATA_PENDING' ? '데이터 반영 대기' : '완료'}</span><h2>{quest.title}</h2><p>{quest.verificationKind === 'SYNTHETIC_MYDATA' ? '합성 금융데이터로 확인' : '앱 안의 행동으로 확인'} · {quest.durationLabel}</p><small>XP {quest.xpReward} · 꾸미기 포인트 {quest.pointReward}</small></div><button className={styles.questAction} aria-label={`${quest.title} ${action}`} disabled={accept.isPending || complete.isPending || quest.status === 'DATA_PENDING' || quest.status === 'COMPLETED'} onClick={() => available ? accept.mutate(quest.questId) : complete.mutate(quest.questId, { onSuccess: setReward })}>{available ? '수락' : <ShieldCheck size={20}/>}</button></article>})}</div>{(accept.error ?? complete.error) && <small role="alert">{errorState(accept.error ?? complete.error) === 'stale' ? '데이터가 조금 오래됐어요.' : '퀘스트를 처리하지 못했어요.'}</small>}<aside className={styles.education}><Compass size={22}/><div><strong>투자 판단 O/X</strong><p>“ETF는 원금 손실이 절대 없다”는 X예요. 위험을 이해하는 학습이며 상품 추천이 아니에요.</p></div></aside></section><Tabs/></MobileShell>
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
function Tabs() { const { pathname } = useLocation(); const active = pathname.startsWith('/mates') || pathname.startsWith('/routine') ? 'mates' : pathname.startsWith('/quests') ? 'quests' : pathname.startsWith('/record') || pathname.startsWith('/demo') ? 'record' : 'home'; return <nav className={styles.tabs} aria-label="주요 탐색"><Link aria-current={active === 'home' ? 'page' : undefined} className={active === 'home' ? styles.tabActive : undefined} to="/home"><Home size={19}/><span>홈</span></Link><Link aria-current={active === 'mates' ? 'page' : undefined} className={active === 'mates' ? styles.tabActive : undefined} to="/mates"><Users size={19}/><span>메이트</span></Link><Link aria-current={active === 'quests' ? 'page' : undefined} className={active === 'quests' ? styles.tabActive : undefined} to="/quests"><Compass size={19}/><span>퀘스트</span></Link><Link aria-current={active === 'record' ? 'page' : undefined} className={active === 'record' ? styles.tabActive : undefined} to="/record"><BookOpen size={19}/><span>기록</span></Link></nav> }

export default function App() { return <Routes><Route path="/" element={<Navigate to="/signup" replace/>}/><Route path="/signup" element={<AuthScreen/>}/><Route path="/login" element={<AuthScreen login/>}/><Route path="/onboarding/:step" element={<Onboarding/>}/><Route path="/goal/confirm" element={<GoalConfirmation/>}/><Route path="/goal/success" element={<GoalSuccess/>}/><Route path="/goal/complete" element={<GoalComplete/>}/><Route path="/home" element={<HomeScreen/>}/><Route path="/report" element={<AnimalReportScreen/>}/><Route path="/mates" element={<MateGroups/>}/><Route path="/mates/group/:groupId" element={<GroupDetail/>}/><Route path="/mates/group/:groupId/adventurer/:adventurerId/routine/:routineId" element={<AdventurerDetail/>}/><Route path="/routine/:groupId/:adventurerId/:routineId" element={<RoutineScreen/>}/><Route path="/routine/confirm" element={<RoutineConfirm/>}/><Route path="/quests" element={<Quests/>}/><Route path="/record" element={<RecordJourney/>}/><Route path="/demo" element={<DemoAdvance/>}/><Route path="/dev" element={<DevStates/>}/><Route path="/dev/loading" element={<DevState state="loading"/>}/><Route path="/dev/empty" element={<DevState state="empty"/>}/><Route path="/dev/stale" element={<DevState state="stale"/>}/><Route path="/dev/error" element={<DevState state="error"/>}/><Route path="*" element={<Navigate to="/signup" replace/>}/></Routes> }
