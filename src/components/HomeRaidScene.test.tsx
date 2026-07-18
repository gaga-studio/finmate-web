import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { HomeBattleViewModel } from '../design-v2/viewModels'
import { HomeRaidScene } from './HomeRaidScene'

const party: HomeBattleViewModel['party'] = [
  {
    animal: 'BEAR',
    assetStem: 'invest',
    label: '소비 방어력',
    shortLabel: '소비',
    characterName: '든든곰',
    meaning: '예산 안에서 소비를 지키는 힘',
    reportType: 'SPENDING_DEFENSE',
    scorePercent: 70,
    scoreDisplay: '70점',
    tone: 'teal',
    emoji: '🐻',
    skillEmoji: '🛡️',
  },
  {
    animal: 'SEAL',
    assetStem: 'save',
    label: '저축 HP',
    shortLabel: '저축',
    characterName: '모아씰',
    meaning: '목표를 꾸준히 지키는 힘',
    reportType: 'SAVING_HP',
    scorePercent: 60,
    scoreDisplay: '60점',
    tone: 'green',
    emoji: '🦦',
    skillEmoji: '♥',
  },
  {
    animal: 'RABBIT',
    assetStem: 'consume',
    label: '투자 판단력',
    shortLabel: '투자 판단',
    characterName: '살펴토끼',
    meaning: '위험과 분산을 점검하는 힘',
    reportType: 'INVESTMENT_JUDGMENT',
    scorePercent: 50,
    scoreDisplay: '50점',
    tone: 'blue',
    emoji: '🐰',
    skillEmoji: '◈',
  },
  {
    animal: 'BIRD',
    assetStem: 'mission',
    label: '퀘스트 XP',
    shortLabel: '퀘스트 XP',
    characterName: '해냄새',
    meaning: '작은 행동을 이어온 경험',
    reportType: 'QUEST_XP',
    scorePercent: 40,
    scoreDisplay: '40 XP',
    tone: 'purple',
    emoji: '🐦',
    skillEmoji: '✦',
  },
]

function makeView(overrides: Partial<HomeBattleViewModel> = {}): HomeBattleViewModel {
  return {
    mode: 'GOAL_ACTIVE',
    goalTitle: '유럽 여행',
    goalCurrentAmountKrw: 2_000_000,
    goalTargetAmountKrw: 5_000_000,
    goalProgressPercent: 40,
    stage: 3,
    bossName: '과소비 수호자',
    bossHpPercent: 60,
    raidStatus: 'ACTIVE',
    party,
    nextQuest: null,
    questXp: 40,
    pointBalance: 120,
    rewardProgressPercent: 60,
    activeRoutineLabel: '월급날 저축',
    dataState: 'FRESH',
    lastSyncedAt: '2026-07-18T06:00:00+09:00',
    ...overrides,
  }
}

function renderScene(view = makeView()) {
  return render(
    <HomeRaidScene
      view={view}
      displayName="민지"
      onOpenQuest={vi.fn()}
      onOpenReport={vi.fn()}
      onOpenSettings={vi.fn()}
    />,
  )
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('HomeRaidScene turn sprites', () => {
  it('preloads short-lived attack and boss-hit sprites when the scene mounts', () => {
    const requestedSources: string[] = []
    class PreloadImage {
      set src(value: string) {
        requestedSources.push(value)
      }
    }
    vi.stubGlobal('Image', PreloadImage)

    renderScene()

    expect(requestedSources).toEqual([
      '/assets/home/turn/invest-attack-right.png',
      '/assets/home/turn/save-attack-right.png',
      '/assets/home/turn/consume-attack-right.png',
      '/assets/home/turn/mission-attack-right.png',
      '/assets/home/turn/boss-hit-left.png',
    ])
  })

  it('uses idle sprites, then swaps the active party member and boss to hit sprites', () => {
    vi.useFakeTimers()
    const { container } = renderScene()

    expect(container.querySelector('.home-party-slot img')).toHaveAttribute(
      'src',
      '/assets/home/turn/invest-idle-right.png',
    )
    expect(container.querySelector('.home-boss-img')).toHaveAttribute(
      'src',
      '/assets/home/turn/boss-idle-left.png',
    )

    act(() => vi.advanceTimersByTime(1_700))
    expect(container.querySelector('.home-party-slot img')).toHaveAttribute(
      'src',
      '/assets/home/turn/invest-attack-right.png',
    )

    act(() => vi.advanceTimersByTime(320))
    expect(container.querySelector('.home-boss-img')).toHaveAttribute(
      'src',
      '/assets/home/turn/boss-hit-left.png',
    )
  })

  it('plays standing, falling, and defeated phases when the raid is cleared', () => {
    vi.useFakeTimers()
    const { container } = renderScene(makeView({
      goalProgressPercent: 100,
      bossHpPercent: 0,
      raidStatus: 'COMPLETED',
    }))

    const partyImages = Array.from(container.querySelectorAll<HTMLImageElement>('.home-party-slot img'))
    expect(partyImages.map((image) => image.getAttribute('src'))).toEqual([
      '/assets/home/turn/invest-victory.png',
      '/assets/home/turn/save-victory.png',
      '/assets/home/turn/consume-victory.png',
      '/assets/home/turn/mission-victory.png',
    ])
    expect(container.querySelector('.home-scene-stage')).toHaveClass('is-cleared', 'is-celebrating')
    expect(container.querySelector('.home-scene-stage')).not.toHaveClass('is-boss-falling')
    expect(container.querySelector('.home-boss-img')).toHaveAttribute(
      'src',
      '/assets/home/turn/boss-idle-left.png',
    )
    expect(container.querySelector('.home-clear-banner')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(450))
    expect(container.querySelector('.home-scene-stage')).toHaveClass('is-boss-falling')
    expect(container.querySelector('.home-boss-img')).toHaveAttribute(
      'src',
      '/assets/home/turn/boss-idle-left.png',
    )
    expect(container.querySelector('.home-clear-banner')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(900))
    expect(container.querySelector('.home-scene-stage')).not.toHaveClass('is-celebrating', 'is-boss-falling')
    expect(container.querySelector('.home-boss-img')).toHaveAttribute(
      'src',
      '/assets/home/turn/boss-defeated.png',
    )
    expect(container.querySelector('.home-clear-banner')).toHaveTextContent('레이드 클리어!')
  })

  it('falls back per failed path without disabling other poses', () => {
    const { container } = renderScene(makeView({
      goalProgressPercent: 100,
      bossHpPercent: 0,
      raidStatus: 'COMPLETED',
    }))
    const firstPartyImage = () => container.querySelector<HTMLImageElement>('.home-party-slot img')
    const bossImage = () => container.querySelector<HTMLImageElement>('.home-boss-img')

    fireEvent.error(firstPartyImage()!)
    expect(firstPartyImage()).toHaveAttribute('src', '/assets/home/turn/invest-idle-right.png')

    fireEvent.error(firstPartyImage()!)
    expect(firstPartyImage()).toHaveAttribute('src', '/assets/home/home-char-invest.png')
    expect(container.querySelectorAll('.home-party-slot img')[1]).toHaveAttribute(
      'src',
      '/assets/home/turn/save-victory.png',
    )

    fireEvent.error(bossImage()!)
    expect(bossImage()).toHaveAttribute('src', '/assets/home/home-boss.png')
  })

  it('uses the complete attack fallback chain and reaches emoji fallbacks', () => {
    vi.useFakeTimers()
    const { container } = renderScene()
    const firstPartySlot = () => container.querySelector<HTMLElement>('.home-party-slot')
    const firstPartyImage = () => firstPartySlot()?.querySelector<HTMLImageElement>('img') ?? null
    const boss = () => container.querySelector<HTMLElement>('.home-boss')
    const bossImage = () => boss()?.querySelector<HTMLImageElement>('img') ?? null

    act(() => vi.advanceTimersByTime(1_700))
    expect(firstPartyImage()).toHaveAttribute('src', '/assets/home/turn/invest-attack-right.png')

    fireEvent.error(firstPartyImage()!)
    expect(firstPartyImage()).toHaveAttribute('src', '/assets/home/home-char-invest-atk-right.png')
    fireEvent.error(firstPartyImage()!)
    expect(firstPartyImage()).toHaveAttribute('src', '/assets/home/turn/invest-idle-right.png')
    fireEvent.error(firstPartyImage()!)
    expect(firstPartyImage()).toHaveAttribute('src', '/assets/home/home-char-invest.png')
    fireEvent.error(firstPartyImage()!)
    expect(firstPartyImage()).toBeNull()
    expect(firstPartySlot()?.querySelector('.home-char-fallback')).toHaveTextContent('🐻')

    fireEvent.error(bossImage()!)
    expect(bossImage()).toHaveAttribute('src', '/assets/home/home-boss.png')
    fireEvent.error(bossImage()!)
    expect(bossImage()).toBeNull()
    expect(boss()?.querySelector('.home-char-fallback')).toHaveTextContent('🧳')

    expect(container.querySelectorAll('.home-party-slot')[1].querySelector('img')).toHaveAttribute(
      'src',
      '/assets/home/turn/save-idle-right.png',
    )
  })
})
