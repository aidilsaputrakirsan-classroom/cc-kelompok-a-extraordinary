import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusBadge } from '../components/ui/StatusBadge'

describe('StatusBadge Component', () => {
  it('renders open status correctly', () => {
    render(<StatusBadge type="item" status="open" />)
    expect(screen.getByText('Tersedia')).toBeInTheDocument()
  })

  it('renders in_claim status correctly', () => {
    render(<StatusBadge type="item" status="in_claim" />)
    expect(screen.getByText('Sedang Diklaim')).toBeInTheDocument()
  })

  it('renders pending claim status correctly', () => {
    render(<StatusBadge type="claim" status="pending" />)
    expect(screen.getByText('Menunggu')).toBeInTheDocument()
  })

  it('falls back to default when status is unknown', () => {
    render(<StatusBadge type="item" status="unknown_status" />)
    expect(screen.getByText('unknown_status')).toBeInTheDocument()
  })
})
