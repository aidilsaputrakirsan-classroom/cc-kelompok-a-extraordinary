import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ItemListPage from '../pages/ItemListPage'
import { api } from '@/config/api'

vi.mock('@/config/api', () => ({
  api: {
    get: vi.fn()
  }
}))

describe('ItemListPage Component', () => {
  it('renders loading state initially', () => {
    api.get.mockReturnValue(new Promise(() => {}))
    render(<MemoryRouter><ItemListPage /></MemoryRouter>)
    expect(screen.getByText('Memuat daftar barang...')).toBeInTheDocument()
  })

  it('renders empty state when no items', async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } })
    render(<MemoryRouter><ItemListPage /></MemoryRouter>)
    await waitFor(() => {
      expect(screen.getByText('Belum ada barang yang didata.')).toBeInTheDocument()
    })
  })

  it('renders items successfully', async () => {
    api.get.mockResolvedValueOnce({ 
      data: { 
        data: [{ id: '1', title: 'Dompet Hitam', type: 'lost', status: 'open', description: 'tes' }] 
      } 
    })
    render(<MemoryRouter><ItemListPage /></MemoryRouter>)
    await waitFor(() => {
      expect(screen.getByText('Dompet Hitam')).toBeInTheDocument()
    })
  })
})
