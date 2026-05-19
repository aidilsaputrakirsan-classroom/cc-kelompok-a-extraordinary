import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog'

describe('Dialog Component', () => {
  it('does not render content initially', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <div data-testid="dialog-content">Content</div>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument()
  })

  it('renders content when trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <div data-testid="dialog-content">Content</div>
        </DialogContent>
      </Dialog>
    )
    
    const trigger = screen.getByRole('button', { name: /open dialog/i })
    fireEvent.click(trigger)
    
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
  })
})
