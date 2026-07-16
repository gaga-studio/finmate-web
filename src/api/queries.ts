import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  apiGet,
  apiRequest,
  type ActiveRoutineBuild,
  type Adventurer,
  type AdventurerPage,
  type AdventurerReport,
  type AdventurerRoutine,
  type CharacterReport,
  type DailyJourneyMonth,
  type DailyRecordPage,
  type DemoTimeline,
  type HanaProductInfo,
  type HomeResponse,
  type MateGroupReport,
  type MateGroupPage,
  type MateFriendOverview,
  type MateFriendFeed,
  type MateStreakPage,
  type MonthlyReport,
  type OnboardingView,
  type QuestPage,
  type Quest,
  type QuestAcceptance,
  type QuestCompletion,
  type DailyRecord,
  type PointLedger,
  type CosmeticCatalog,
  type DisclosureConsent,
  type DisclosurePreview,
  type RaidView,
  type RoutineRecommendation,
  type RoutineReplacement,
  type Schema,
  type UserGoal,
} from './client'

type CompleteOnboarding = Schema['CompleteOnboardingRequest']
type ConfirmGoal = Schema['ConfirmUserGoalRequest']
type CreateRecommendation = Schema['CreateRoutineRecommendationRequest']
type ReplaceRoutine = Schema['ReplaceActiveRoutineBuildRequest']

const invalidateRoutineViews = (queryClient: ReturnType<typeof useQueryClient>) =>
  Promise.all([queryClient.invalidateQueries({ queryKey: ['home'] }), queryClient.invalidateQueries({ queryKey: ['active-routine'] })])

export const useOnboarding = () => useQuery({ queryKey: ['onboarding'], queryFn: () => apiGet<OnboardingView>('/onboarding') })
export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CompleteOnboarding) => apiRequest<OnboardingView>('/onboarding', 'PUT', body),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
      queryClient.invalidateQueries({ queryKey: ['home'] }),
    ]),
  })
}
export const useConfirmGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ConfirmGoal) => apiRequest<UserGoal>('/goals', 'POST', body),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
      queryClient.invalidateQueries({ queryKey: ['home'] }),
    ]),
  })
}
export const useHome = () => useQuery({ queryKey: ['home'], queryFn: () => apiGet<HomeResponse>('/home') })
export const useRaid = () => useQuery({ queryKey: ['raid'], queryFn: () => apiGet<RaidView>('/raids/current') })
export const useCharacterReport = (reportType: Schema['CharacterReportType']) => useQuery({ queryKey: ['character-report', reportType], queryFn: () => apiGet<CharacterReport>(`/reports/characters/${reportType}`) })
export const useMonthlyReport = () => useQuery({ queryKey: ['monthly-report'], queryFn: () => apiGet<MonthlyReport>('/reports/monthly?month=2026-07') })
export const useMateFriendOverview = () => useQuery({ queryKey: ['mate-friends', 'overview'], queryFn: () => apiGet<MateFriendOverview>('/mate/friends/overview') })
export const useMateFriendFeed = () => useQuery({ queryKey: ['mate-friends', 'feed'], queryFn: () => apiGet<MateFriendFeed>('/mate/friends/feed') })
export const useMateFriendStreaks = () => useQuery({ queryKey: ['mate-friends', 'streaks'], queryFn: () => apiGet<MateStreakPage>('/mate/friends/streaks') })
export const useMateGroups = () => useQuery({ queryKey: ['mate-groups'], queryFn: () => apiGet<MateGroupPage>('/mate/groups') })
export const useMateGroupReport = (groupId: string) => useQuery({ queryKey: ['mate-group-report', groupId], queryFn: () => apiGet<MateGroupReport>(`/mate/groups/${groupId}/report`), enabled: Boolean(groupId) })
export const useAdventurers = (groupId: string) => useQuery({ queryKey: ['adventurers', groupId], queryFn: () => apiGet<AdventurerPage>(`/mate/groups/${groupId}/adventurers`), enabled: Boolean(groupId) })
export const useAdventurer = (groupId: string, adventurerId: string) => useQuery({ queryKey: ['adventurer', groupId, adventurerId], queryFn: () => apiGet<Adventurer>(`/mate/groups/${groupId}/adventurers/${adventurerId}`), enabled: Boolean(groupId && adventurerId) })
export const useAdventurerReport = (groupId: string, adventurerId: string) => useQuery({ queryKey: ['adventurer-report', groupId, adventurerId], queryFn: () => apiGet<AdventurerReport>(`/mate/groups/${groupId}/adventurers/${adventurerId}/report`), enabled: Boolean(groupId && adventurerId) })
export const useAdventurerRoutine = (groupId: string, adventurerId: string, routineId: string) => useQuery({ queryKey: ['routine', groupId, adventurerId, routineId], queryFn: () => apiGet<AdventurerRoutine>(`/mate/groups/${groupId}/adventurers/${adventurerId}/routines/${routineId}`), enabled: Boolean(groupId && adventurerId && routineId) })
export const useMateExploreSearch = () => useMutation({ mutationFn: (body: Schema['MateExploreSearchRequest']) => apiRequest<AdventurerPage>('/mate/explore/search', 'POST', body) })
export const useActiveRoutine = () => useQuery({ queryKey: ['active-routine'], queryFn: () => apiGet<ActiveRoutineBuild>('/routine-builds/active') })
export const useCreateRecommendation = () => useMutation({ mutationFn: (body: CreateRecommendation) => apiRequest<RoutineRecommendation>('/routine-adaptations', 'POST', body) })
export const useImportRoutine = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: ({ adaptationId, candidateId }: { adaptationId: string; candidateId: string }) => apiRequest<ActiveRoutineBuild>(`/routine-adaptations/${adaptationId}/candidates/${candidateId}/import`, 'POST', {}), onSuccess: () => invalidateRoutineViews(queryClient) })
}
export const useReplaceRoutine = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (body: ReplaceRoutine) => apiRequest<RoutineReplacement>('/routine-builds/active/replacement', 'POST', body), onSuccess: () => invalidateRoutineViews(queryClient) })
}
export const useQuests = () => useQuery({ queryKey: ['quests'], queryFn: () => apiGet<QuestPage>('/quests') })
export const useQuest = (questId: string) => useQuery({ queryKey: ['quest', questId], queryFn: () => apiGet<Quest>(`/quests/${questId}`), enabled: Boolean(questId) })
export const useAcceptQuest = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (questId: string) => apiRequest<QuestAcceptance>(`/quests/${questId}/accept`, 'POST'), onSuccess: (result, questId) => { queryClient.setQueryData(['quest', questId], result.quest); return queryClient.invalidateQueries({ queryKey: ['quests'] }) } })
}
export const useCompleteQuest = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (questId: string) => apiRequest<QuestCompletion>(`/quests/${questId}/complete`, 'POST'), onSuccess: (result, questId) => { queryClient.setQueryData(['quest', questId], result.quest); return queryClient.invalidateQueries({ queryKey: ['quests'] }) } })
}
export const useRecords = () => useQuery({ queryKey: ['records'], queryFn: () => apiGet<DailyRecordPage>('/records?from=2026-07-01&to=2026-07-30') })
export const useDailyJourney = (month = '2026-07') => useQuery({ queryKey: ['records', 'journey', month], queryFn: () => apiGet<DailyJourneyMonth>(`/records/journey?month=${month}`) })
export const useDailyRecord = (date: string | null) => useQuery({ queryKey: ['record', date], queryFn: () => apiGet<DailyRecord>(`/records/${date}`), enabled: Boolean(date) })
export const useHanaProductInfo = (productId: string | null) => useQuery({ queryKey: ['hana-product', productId], queryFn: () => apiGet<HanaProductInfo>(`/hana-products/${productId}`), enabled: Boolean(productId) })
export const usePointLedger = () => useQuery({ queryKey: ['rewards', 'points'], queryFn: () => apiGet<PointLedger>('/rewards/points') })
export const useCosmetics = () => useQuery({ queryKey: ['rewards', 'cosmetics'], queryFn: () => apiGet<CosmeticCatalog>('/rewards/cosmetics') })
export const useDisclosureConsent = () => useQuery({ queryKey: ['disclosures'], queryFn: () => apiGet<DisclosureConsent>('/me/disclosures') })
export const usePreviewDisclosure = () => useMutation({ mutationFn: (body: Schema['DisclosureRequest']) => apiRequest<DisclosurePreview>('/me/disclosures/preview', 'POST', body) })
export const useUpdateDisclosure = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (body: Schema['DisclosureRequest']) => apiRequest<DisclosureConsent>('/me/disclosures', 'PUT', body), onSuccess: (result) => queryClient.setQueryData(['disclosures'], result) })
}
export const useWithdrawDisclosure = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: () => apiRequest<void>('/me/disclosures', 'DELETE'), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['disclosures'] }) })
}
export const useAdvanceDemo = () => {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (expectedFrameIndex: number) => apiRequest<DemoTimeline>('/demo/timeline/advance', 'POST', { fixtureId: 'EUROPE_TRAVEL_JANUARY', expectedFrameIndex }), onSuccess: () => Promise.all([queryClient.refetchQueries({ queryKey: ['home'] }), queryClient.refetchQueries({ queryKey: ['raid'] }), queryClient.invalidateQueries({ queryKey: ['goal'] })]) })
}
