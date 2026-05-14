import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProtectedRoute from '../components/auth/ProtectedRoute'

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate">Redirecting to {to}</div>,
  useLocation: () => ({ pathname: '/protected' })
}))

vi.mock('@/app/providers', () => ({
  useAuth: vi.fn()
}))

import { useAuth } from '@/app/providers'

describe('ProtectedRoute Component', () => {
  it('renders loading state when auth is loading', () => {
    useAuth.mockReturnValue({ loading: true, user: null })
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )
    expect(screen.getByText('Memuat data...')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    useAuth.mockReturnValue({ loading: false, user: null })
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )
    expect(screen.getByTestId('navigate')).toHaveTextContent('Redirecting to /login')
  })

  it('renders children when user is authenticated', () => {
    useAuth.mockReturnValue({ loading: false, user: { name: 'User' } })
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
