import { useQuery } from '@tanstack/react-query'
import { apiGet, type GoalResponse, type HomeResponse } from './client'

export interface AnimalReport {
  title: string
  summary: string
  animal: string
  action: string
}

export interface MateGroup {
  id: string
  name: string
  members: number
  routine: string
  description: string
}

export interface Adventurer {
  alias: string
  level: number
  routine: string
  insight: string
}

export interface Quest {
  id: string
  title: string
  description: string
  status: 'READY' | 'DONE'
}

export interface JourneyDay {
  day: number
  label: string
  complete: boolean
  note: string
}

export const useHome = () => useQuery({ queryKey: ['home'], queryFn: () => apiGet<HomeResponse>('/home') })
export const useGoal = () => useQuery({ queryKey: ['goal'], queryFn: () => apiGet<GoalResponse>('/goals/active') })
export const useAnimalReport = () => useQuery({ queryKey: ['animal-report'], queryFn: () => apiGet<AnimalReport>('/animal-report') })
export const useMateGroups = () => useQuery({ queryKey: ['mate-groups'], queryFn: () => apiGet<MateGroup[]>('/mate-groups') })
export const useAdventurer = () => useQuery({ queryKey: ['adventurer'], queryFn: () => apiGet<Adventurer>('/adventurers/anonymous-minji') })
export const useQuests = () => useQuery({ queryKey: ['quests'], queryFn: () => apiGet<Quest[]>('/quests') })
export const useJourney = () => useQuery({ queryKey: ['journey'], queryFn: () => apiGet<JourneyDay[]>('/journey') })
