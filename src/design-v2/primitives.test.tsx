import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppShell, BottomNav } from './primitives'

describe('frontend-v2 design primitives', () => {
  it('uses the original phone shell and the approved four-tab IA', () => {
    render(
      <MemoryRouter initialEntries={['/record']}>
        <AppShell>
          <div>화면</div>
          <BottomNav />
        </AppShell>
      </MemoryRouter>,
    )

    expect(screen.getByText('화면').closest('.phone-shell')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: '주요 메뉴' })).toHaveTextContent('홈메이트퀘스트기록')
    expect(screen.getByRole('link', { name: '기록' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByText('로드맵')).not.toBeInTheDocument()
  })

  it('keeps the full-width navigation stable while the screen scrolls', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <AppShell>
          <div className="screen">스크롤 화면</div>
          <BottomNav />
        </AppShell>
      </MemoryRouter>,
    )

    fireEvent.scroll(screen.getByText('스크롤 화면'))

    expect(screen.getByRole('navigation', { name: '주요 메뉴' })).not.toHaveClass('is-compact')
  })
})
