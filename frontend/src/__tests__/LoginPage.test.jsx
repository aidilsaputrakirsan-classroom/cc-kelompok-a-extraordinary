import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import { api } from '@/config/api'

vi.mock('@/config/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

vi.mock('@/app/providers', () => ({
  useAuth: () => ({
    login: vi.fn()
  })
}))

describe('LoginPage Component', () => {
  it('renders login form correctly', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument()
  })

  it('handles form submission with validation', async () => {
    api.post.mockRejectedValueOnce({ response: { data: { detail: 'Invalid credentials' } } })
    
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@student.itk.ac.id' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } })
    
    fireEvent.click(screen.getByRole('button', { name: /masuk/i }))
    
    expect(api.post).toHaveBeenCalledWith('/auth/login/', { email: 'test@student.itk.ac.id', password: 'wrongpass' })
  })
})
