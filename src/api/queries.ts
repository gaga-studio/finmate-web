import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  apiGet,
  apiRequest,
  type ActiveRoutineBuild,
  type AdventurerPage,
  type AdventurerRoutine,
  type DailyRecordPage,
  type DemoTimeline,
  type HomeResponse,
  type MateGroupPage,
  type MonthlyReport,
  type OnboardingView,
  type QuestPage,
  type QuestCompletion,
  type DailyRecord,
  type RaidView,
  type RoutineAdaptationDraft,
  type RoutineAdaptationSet,
  type RoutineReplacement,
  type Schema,
} from './client'

type CompleteOnboarding = Schema['CompleteOnboardingRequest']
type CreateAdaptation = Schema['CreateRoutineAdaptationRequest']
type ChooseDomain = Schema['ChooseAdaptationDomainRequest']
type ReplaceRoutine = Schema['ReplaceActiveRoutineBuildRequest']

const invalidateRoutineViews = (queryClient: ReturnType<typeof useQueryClient>) =>
  Promise.all([queryClient.invalidateQueries({ queryKey: ['home'] }), queryClient.invalidateQueries({ queryKey: ['active-routine'] })])

export const useOnboarding = () => useQuery({ queryKey: ['onboarding'], queryFn: () => apiGet<OnboardingView>('/onboarding') })
export const useCompleteOnboarding = () => useMutation({ mutationFn: (body: CompleteOnboarding) => apiRequest<OnboardingView>('/onboarding', 'PUT', body) })
export const useHome = () => useQuery({ queryKey: ['home'], queryFn: () => apiGet<HomeResponse>('/home') })
export const useRaid = () => useQuery({ queryKey: ['raid'], queryFn: () => apiGet<RaidView>('/raids/current') })
export const useMonthlyReport = () => useQuery({ queryKey: ['monthly-report'], queryFn: () => apiGet<MonthlyReport>('/reports/monthly?month=2026-07') })
export const useMateGroups = () => useQuery({ queryKey: ['mate-groups'], queryFn: () => apiGet<MateGroupPage>('/mate/groups') })
export const useAdventurers = (groupId: string) => useQuery({ queryKey: ['adventurers', groupId], queryFn: () => apiGet<AdventurerPage>(`/mate/groups/${groupId}/adventurers`), enabled: Boolean(groupId) })
export const useAdventurerRoutine = (groupId: string, adventurerId: string, routineId: string) => useQuery({ queryKey: ['routine', groupId, adventurerId, routineId], queryFn: () => apiGet<AdventurerRoutine>(`/mate/groups/${groupId}/adventurers/${adventurerId}/routines/${routineId}`), enabled: Boolean(groupId && adventurerId && routineId) })
export const useActiveRoutine = () => useQuery({ queryKey: ['active-routine'], queryFn: () => apiGet<ActiveRoutineBuild>('/routine-builds/active') })
export const useCreateAdaptation = () => useMutation({ mutationFn: (body: CreateAdaptation) => apiRequest<RoutineAdaptationDraft>('/routine-adaptations', 'POST', body) })
export const useChooseAdaptation = () => useMutation({ mutationFn: ({ adaptationId, body }: { adaptationId: string; body: ChooseDomain }) => apiRequest<RoutineAdaptationSet>(`/routine-adaptations/${adaptationId}/choice`, 'PUT', body) })
export const useImportRoutine = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: ({ adaptationId, candidateId }: { adaptationId: string; candidateId: string }) => apiRequest<ActiveRoutineBuild>(`/routine-adaptations/${adaptationId}/candidates/${candidateId}/import`, 'POST', {}), onSuccess: () => invalidateRoutineViews(queryClient) })
}
export const useReplaceRoutine = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (body: ReplaceRoutine) => apiRequest<RoutineReplacement>('/routine-builds/active/replacement', 'POST', body), onSuccess: () => invalidateRoutineViews(queryClient) })
}
export const useQuests = () => useQuery({ queryKey: ['quests'], queryFn: () => apiGet<QuestPage>('/quests') })
export const useCompleteQuest = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (questId: string) => apiRequest<QuestCompletion>(`/quests/${questId}/complete`, 'POST'), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quests'] }) })
}
export const useRecords = () => useQuery({ queryKey: ['records'], queryFn: () => apiGet<DailyRecordPage>('/records?from=2026-07-01&to=2026-07-30') })
export const useDailyRecord = (date: string | null) => useQuery({ queryKey: ['record', date], queryFn: () => apiGet<DailyRecord>(`/records/${date}`), enabled: Boolean(date) })
export const useAdvanceDemo = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (expectedStage: number) => apiRequest<DemoTimeline>('/demo/timeline/advance', 'POST', { fixtureId: 'EUROPE_TRAVEL_JANUARY', expectedStage }), onSuccess: () => Promise.all([queryClient.refetchQueries({ queryKey: ['home'] }), queryClient.refetchQueries({ queryKey: ['raid'] }), queryClient.invalidateQueries({ queryKey: ['goal'] })]) })
}
