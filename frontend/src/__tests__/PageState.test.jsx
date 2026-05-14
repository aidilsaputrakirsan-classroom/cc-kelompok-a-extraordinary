import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PageState from '../components/PageState'

describe('PageState Component', () => {
  it('renders loading state correctly', () => {
    render(<PageState state="loading" loadingText="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('renders error state correctly', () => {
    render(<PageState state="error" errorText="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', () => {
    const handleRetry = vi.fn()
    render(<PageState state="error" onRetry={handleRetry} />)
    
    const retryButton = screen.getByRole('button', { name: /coba lagi/i })
    fireEvent.click(retryButton)
    
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('renders empty state correctly', () => {
    render(<PageState state="empty" emptyText="No data found" />)
    expect(screen.getByText('No data found')).toBeInTheDocument()
  })
})
