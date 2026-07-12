import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { BookOpen, ChevronRight, Compass, Heart, Home, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { apiPost } from './api/client'
import { useAdventurer, useAnimalReport, useHome, useJourney, useMateGroups, useQuests } from './api/queries'
import styles from './App.module.css'

const formatKrw = (value: number) => new Intl.NumberFormat('ko-KR').format(value) + ' KRW'

function StateView({ state, onRetry }: { state: 'loading' | 'empty' | 'stale' | 'error'; onRetry?: () => void }) {
  const content = {
    loading: ['불러오는 중', 'MyData 결과와 루틴을 확인하고 있어요.'],
    empty: ['아직 쌓인 기록이 없어요', '오늘의 작은 선택부터 시작해 볼까요?'],
    stale: ['데이터가 조금 오래됐어요', '마지막 MyData 반영 결과를 표시하고 있어요.'],
    error: ['불러오지 못했어요', '잠시 후 다시 시도해 주세요.'],
  }[state]
  return <section className={styles.state}><Sparkles size={24} /><h2>{content[0]}</h2><p>{content[1]}</p>{onRetry && <button className={styles.secondary} onClick={onRetry}>다시 시도</button>}</section>
}

function MobileShell({ children }: { children: React.ReactNode }) {
  return <main className={styles.shell}>{children}</main>
}

const signupSchema = z.object({ email: z.string().email('이메일을 확인해 주세요.'), password: z.string().min(8, '비밀번호는 8자 이상 입력해 주세요.') })
type SignupValues = z.infer<typeof signupSchema>

function AuthScreen({ login = false }: { login?: boolean }) {
  const navigate = useNavigate()
  const form = useForm<SignupValues>({ resolver: zodResolver(signupSchema), defaultValues: { email: '', password: '' } })
  const submit = async (values: SignupValues) => {
    await apiPost(login ? '/auth/login' : '/auth/signup', values)
    navigate(login ? '/home' : '/onboarding/1')
  }
  return <MobileShell><section className={styles.auth}><span className={styles.brand}>FinMate</span><div><p className={styles.eyebrow}>돈과 목표를 함께 보는 여정</p><h1>{login ? '다시 만나서 반가워요' : '돈과 조금 더 친해져 볼까요?'}</h1><p>금융 정보는 MyData 결과로만 보여 드리고, 보상은 꾸미기와 콘텐츠 안에서만 사용돼요.</p></div><form onSubmit={form.handleSubmit(submit)} className={styles.form}><label>이메일<input aria-label="이메일" type="email" {...form.register('email')} /></label><small>{form.formState.errors.email?.message}</small><label>비밀번호<input aria-label="비밀번호" type="password" {...form.register('password')} /></label><small>{form.formState.errors.password?.message}</small><button className={styles.primary} type="submit">{login ? '로그인' : '시작하기'}</button></form><Link to={login ? '/signup' : '/login'}>{login ? '처음이라면 가입하기' : '이미 계정이 있다면 로그인'}</Link></section></MobileShell>
}

const onboardingSteps = ['생활 패턴', '저축 습관', '소비 우선순위', '투자 이해도', '알림 방식', '여정 준비']
function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const next = () => step === 6 ? navigate('/goal/confirm') : setStep((value) => value + 1)
  return <MobileShell><section className={styles.page}><div className={styles.progress}><span>{step} / 6</span><i style={{ width: `${step / 6 * 100}%` }} /></div><p className={styles.eyebrow}>{onboardingSteps[step - 1]}</p><h1>금융 습관을 알아볼게요</h1><p>정답은 없어요. 지금의 생활 리듬에 맞는 작은 루틴부터 골라요.</p><div className={styles.choiceList}><button className={styles.choice}>매달 목표를 정하고 싶어요</button><button className={styles.choice}>자동저축부터 만들고 싶어요</button><button className={styles.choice}>소비 흐름을 먼저 보고 싶어요</button></div><button className={styles.primary} onClick={next}>{step === 6 ? '여행 목표 보기' : '다음'}<ChevronRight size={20} /></button></section></MobileShell>
}

function GoalConfirmation() {
  const navigate = useNavigate()
  return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>목표 확인</p><h1>유럽 여행을 위한 준비</h1><div className={styles.goalHero}><span>EUROPE TRIP</span><strong>2,000,000</strong><small>/ 5,000,000 KRW</small><div className={styles.goalTrack}><i style={{ width: '40%' }} /></div><p>현재 MyData 기반으로 확인된 저축 금액이에요.</p></div><p>메이트는 이 목표를 바꾸지 않아요. 함께할 루틴만 제안해요.</p><button className={styles.primary} onClick={() => navigate('/goal/success')}>유럽 여행 목표 만들기</button></section></MobileShell>
}

function GoalSuccess() { const navigate = useNavigate(); return <MobileShell><section className={styles.page}><ShieldCheck size={42} className={styles.successIcon}/><p className={styles.eyebrow}>목표가 시작됐어요</p><h1>유럽 여행까지 한 걸음</h1><p>목표 금액과 현재 저축 흐름을 바탕으로 홈 레이드를 준비했어요.</p><button className={styles.primary} onClick={() => navigate('/home')}>홈으로 가기</button></section></MobileShell> }

function HomeScreen() {
  const navigate = useNavigate(); const { data, isLoading, isError, refetch } = useHome()
  if (isLoading) return <MobileShell><StateView state="loading" /></MobileShell>
  if (isError || !data) return <MobileShell><StateView state="error" onRetry={() => void refetch()} /></MobileShell>
  const home = data as unknown as { greeting: string; activeGoal: { title: string; targetKrw: number; savedKrw: number }; raid: { stage: number; boss: string; hp: number }; dataFreshness: { label: string } }
  return <MobileShell><section className={styles.page}><header className={styles.topline}><span className={styles.brand}>FinMate</span><button aria-label="동물 리포트" className={styles.iconButton} onClick={() => navigate('/report')}><Heart size={20} /></button></header><p className={styles.muted}>{home.dataFreshness.label}</p><h1>{home.greeting}</h1><div className={styles.raid}><span>RAID STAGE {home.raid.stage}</span><h2>{home.raid.boss}</h2><div className={styles.boss}><i style={{ width: `${home.raid.hp}%` }} /></div><p>이번 주 저축 루틴으로 보스를 약하게 만들고 있어요.</p></div><div className={styles.goalRow}><div><span>{home.activeGoal.title}</span><strong>{formatKrw(home.activeGoal.savedKrw)}</strong></div><span>{Math.round(home.activeGoal.savedKrw / home.activeGoal.targetKrw * 100)}%</span></div><button className={styles.secondary} onClick={() => navigate('/report')}>동물 리포트 보기</button></section><Tabs /></MobileShell>
}

function AnimalReportScreen() { const { data, isLoading, isError, refetch } = useAnimalReport(); const navigate = useNavigate(); if (isLoading) return <MobileShell><StateView state="loading" /></MobileShell>; if (isError || !data) return <MobileShell><StateView state="error" onRetry={() => void refetch()} /></MobileShell>; return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>{data.animal}</p><h1>{data.title}</h1><div className={styles.report}><Heart size={36}/><h2>{data.summary}</h2><p>금융 통계는 MyData 계산 결과이며 퀘스트 보상으로 늘어나지 않아요.</p></div><button className={styles.primary} onClick={() => navigate('/mates')}>{data.action}</button></section><Tabs /></MobileShell> }

function MateGroups() { const { data, isLoading, isError, refetch } = useMateGroups(); if (isLoading) return <MobileShell><StateView state="loading"/></MobileShell>; if (isError || !data) return <MobileShell><StateView state="error" onRetry={() => void refetch()}/></MobileShell>; return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>메이트</p><h1>함께 갈 루틴을 고르세요</h1><p>메이트는 여행 목표 대신, 현재의 루틴 빌드를 바꿔요.</p><div className={styles.groupList}>{data.map((group) => <Link className={styles.group} to={`/mates/group/${group.id}`} key={group.id}><Users size={22}/><div><strong>{group.name}</strong><span>{group.members}명 · {group.routine}</span></div><ChevronRight size={20}/></Link>)}</div></section><Tabs /></MobileShell> }

function GroupDetail() { const { data, isLoading, isError, refetch } = useMateGroups(); const navigate = useNavigate(); const [confirming, setConfirming] = useState(false); const [routine, setRoutine] = useState('월급날 자동저축'); if (isLoading) return <MobileShell><StateView state="loading"/></MobileShell>; if (isError || !data) return <MobileShell><StateView state="error" onRetry={() => void refetch()}/></MobileShell>; const group = data[0]; return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>18명의 익명 모험가</p><h1>{group.name}</h1><p>{group.description}</p><div className={styles.routine}><span>제안 루틴</span><h2>{routine === group.routine ? group.routine : group.routine}</h2><p>현재 루틴: {routine}</p></div><Link className={styles.secondary} to="/mates/adventurer/anonymous-minji">익명 모험가 살펴보기</Link><button className={styles.primary} onClick={() => setConfirming(true)}>이 루틴으로 바꾸기</button></section>{confirming && <div className={styles.scrim}><section className={styles.sheet} role="dialog" aria-label="루틴 변경 확인"><h2>루틴 변경 확인</h2><p>새 루틴으로 교체하면 현재 루틴은 종료돼요.</p><p>여행 목표는 그대로 유지돼요.</p><div className={styles.sheetActions}><button className={styles.secondary} onClick={() => setConfirming(false)}>취소</button><button className={styles.primary} onClick={() => { setRoutine(group.routine); setConfirming(false); navigate('/routine/confirm') }}>교체 확정</button></div></section></div>}<Tabs /></MobileShell> }

function AdventurerDetail() { const { data, isLoading, isError, refetch } = useAdventurer(); if (isLoading) return <MobileShell><StateView state="loading"/></MobileShell>; if (isError || !data) return <MobileShell><StateView state="error" onRetry={() => void refetch()}/></MobileShell>; return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>ANONYMOUS ADVENTURER</p><h1>{data.alias}</h1><div className={styles.avatar}>?</div><p>Lv. {data.level} · {data.routine}</p><blockquote>“{data.insight}”</blockquote><Link className={styles.primary} to="/routine">루틴을 내 생활에 맞추기</Link></section><Tabs /></MobileShell> }

function RoutineScreen() { const navigate = useNavigate(); const [days, setDays] = useState(3); return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>ROUTINE ADAPTATION</p><h1>나에게 맞는 저축 루틴</h1><p>추천 루틴을 그대로 복사하지 않고, 생활에 맞게 강도를 조절해요.</p><label className={styles.sliderLabel}>주 {days}회 저축 챌린지<input aria-label="주간 저축 횟수" type="range" min="1" max="5" value={days} onChange={(event) => setDays(Number(event.target.value))}/></label><div className={styles.routine}><span>STANDARD 후보</span><h2>주 {days}회 저축 챌린지</h2><p>투자 화면은 위험 성향과 ETF O/X 교육만 제공해요.</p></div><button className={styles.primary} onClick={() => navigate('/routine/confirm')}>STANDARD 후보 선택</button></section><Tabs /></MobileShell> }

function RoutineConfirm() { const navigate = useNavigate(); return <MobileShell><section className={styles.page}><ShieldCheck size={42} className={styles.successIcon}/><p className={styles.eyebrow}>ACTIVE ROUTINE</p><h1>주 3회 저축 챌린지</h1><p>이제 모든 화면에서 하나의 활성 루틴으로 진행돼요.</p><button className={styles.primary} onClick={() => navigate('/quests')}>퀘스트 보러 가기</button></section><Tabs /></MobileShell> }

function Quests() { const { data, isLoading, isError, refetch } = useQuests(); const navigate = useNavigate(); if (isLoading) return <MobileShell><StateView state="loading"/></MobileShell>; if (isError || !data) return <MobileShell><StateView state="error" onRetry={() => void refetch()}/></MobileShell>; return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>퀘스트</p><h1>오늘의 작은 행동</h1><div className={styles.questList}>{data.map((quest) => <article className={styles.quest} key={quest.id}><BookOpen size={22}/><div><h2>{quest.title}</h2><p>{quest.description}</p></div><button className={styles.iconButton} aria-label={`${quest.title} 시작`} onClick={() => navigate('/record')}><ChevronRight/></button></article>)}</div><div className={styles.education}><Compass size={22}/><strong>ETF O/X</strong><p>“ETF는 원금 손실이 절대 없다”는 X예요. 위험을 이해하는 교육일 뿐, 상품 추천이 아니에요.</p></div></section><Tabs /></MobileShell> }

function RecordJourney() { const { data, isLoading, isError, refetch } = useJourney(); const [selected, setSelected] = useState<number | null>(null); const navigate = useNavigate(); if (isLoading) return <MobileShell><StateView state="loading"/></MobileShell>; if (isError || !data) return <MobileShell><StateView state="error" onRetry={() => void refetch()}/></MobileShell>; const day = data.find((item) => item.day === selected); return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>30일 기록 여정</p><h1>하루씩 남긴 변화</h1><p>각 날짜를 눌러 MyData 반영과 루틴 기록을 확인해요.</p><div className={styles.calendar}>{data.map((item) => <button aria-label={`${item.day}일 기록`} className={item.complete ? styles.dayDone : styles.day} key={item.day} onClick={() => setSelected(item.day)}>{item.day}</button>)}</div><button className={styles.primary} onClick={() => navigate('/demo')}>데모 진행</button></section>{day && <div className={styles.scrim} onClick={() => setSelected(null)}><section className={styles.sheet} onClick={(event) => event.stopPropagation()}><span>{day.label}</span><h2>{day.complete ? '루틴을 지킨 날이에요' : '기록을 기다리는 날이에요'}</h2><p>{day.note}</p><button className={styles.secondary} onClick={() => setSelected(null)}>닫기</button></section></div>}<Tabs /></MobileShell> }

function DemoAdvance() { const navigate = useNavigate(); return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>DEMO ADVANCE</p><h1>30일 여정을 빠르게 진행할까요?</h1><p>데모 전용 화면이에요. 실제 금융 데이터나 저축 금액은 변경하지 않아요.</p><div className={styles.raid}><span>DAY 30</span><h2>여행 준비 완료</h2><div className={styles.boss}><i style={{width: '100%'}}/></div></div><button className={styles.primary} onClick={() => navigate('/goal/complete')}>목표 완료 보기</button></section><Tabs /></MobileShell> }

function GoalComplete() { return <MobileShell><section className={styles.page}><ShieldCheck size={48} className={styles.successIcon}/><p className={styles.eyebrow}>GOAL COMPLETE</p><h1>유럽 여행 목표를 완주했어요</h1><p>여정에서 얻은 보상은 프로필 꾸미기와 다음 콘텐츠를 여는 데 사용돼요.</p><Link className={styles.primary} to="/home">새 여정 시작하기</Link></section></MobileShell> }

function DevStates() { const navigate = useNavigate(); return <MobileShell><section className={styles.page}><p className={styles.eyebrow}>DEVELOPMENT STATES</p><h1>상태 미리보기</h1><div className={styles.choiceList}>{(['loading','empty','stale','error'] as const).map((state) => <button key={state} className={styles.choice} onClick={() => navigate(`/dev/${state}`)}>{state}</button>)}</div></section></MobileShell> }
function DevState({ state }: { state: 'loading' | 'empty' | 'stale' | 'error' }) { return <MobileShell><StateView state={state}/></MobileShell> }

function Tabs() { return <nav className={styles.tabs} aria-label="주요 탐색"><Link to="/home"><Home size={19}/><span>홈</span></Link><Link to="/mates"><Users size={19}/><span>메이트</span></Link><Link to="/quests"><Compass size={19}/><span>퀘스트</span></Link><Link to="/record"><BookOpen size={19}/><span>기록</span></Link></nav> }

export default function App() { return <Routes><Route path="/" element={<Navigate to="/signup" replace/>}/><Route path="/signup" element={<AuthScreen/>}/><Route path="/login" element={<AuthScreen login/>}/><Route path="/onboarding/:step" element={<Onboarding/>}/><Route path="/goal/confirm" element={<GoalConfirmation/>}/><Route path="/goal/success" element={<GoalSuccess/>}/><Route path="/goal/complete" element={<GoalComplete/>}/><Route path="/home" element={<HomeScreen/>}/><Route path="/report" element={<AnimalReportScreen/>}/><Route path="/mates" element={<MateGroups/>}/><Route path="/mates/group/:id" element={<GroupDetail/>}/><Route path="/mates/adventurer/:id" element={<AdventurerDetail/>}/><Route path="/routine" element={<RoutineScreen/>}/><Route path="/routine/confirm" element={<RoutineConfirm/>}/><Route path="/quests" element={<Quests/>}/><Route path="/record" element={<RecordJourney/>}/><Route path="/demo" element={<DemoAdvance/>}/><Route path="/dev" element={<DevStates/>}/><Route path="/dev/loading" element={<DevState state="loading"/>}/><Route path="/dev/empty" element={<DevState state="empty"/>}/><Route path="/dev/stale" element={<DevState state="stale"/>}/><Route path="/dev/error" element={<DevState state="error"/>}/><Route path="*" element={<Navigate to="/signup" replace/>}/></Routes> }
