import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderApp(initialEntry = '/signup') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('FinMate representative flow', () => {
  it('starts signup and advances into six-step onboarding', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByLabelText('이메일'), 'minji@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'finmate1234')
    await user.click(screen.getByRole('button', { name: '시작하기' }))

    expect(await screen.findByText('금융 습관을 알아볼게요')).toBeInTheDocument()
    expect(screen.getByText('1 / 6')).toBeInTheDocument()
  })

  it('requires confirmation before replacing the globally active routine', async () => {
    const user = userEvent.setup()
    renderApp('/mates/group/savers')

    await user.click(await screen.findByRole('button', { name: '이 루틴으로 바꾸기' }))
    expect(screen.getByRole('dialog', { name: '루틴 변경 확인' })).toBeInTheDocument()
    expect(screen.getByText('여행 목표는 그대로 유지돼요.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '교체 확정' }))
    expect(await screen.findByText('주 3회 저축 챌린지')).toBeInTheDocument()
  })
})
