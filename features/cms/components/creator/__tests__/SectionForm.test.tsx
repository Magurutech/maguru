/**
 * Unit Tests for SectionForm Component
 * Requirements: 1.1, 1.3, 9.1, 9.5
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SectionForm } from '../SectionForm'

const mockOnSubmit = jest.fn()
const mockOnCancel = jest.fn()

const defaultProps = {
  onSubmit: mockOnSubmit,
  onCancel: mockOnCancel,
}

describe('SectionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render Create Section heading by default', () => {
      render(<SectionForm {...defaultProps} />)
      expect(screen.getByRole('heading', { name: 'Create Section' })).toBeInTheDocument()
    })

    it('should render Edit Section heading when isEditing=true', () => {
      render(<SectionForm {...defaultProps} isEditing />)
      expect(screen.getByRole('heading', { name: 'Edit Section' })).toBeInTheDocument()
    })

    it('should populate fields with initialData', () => {
      render(
        <SectionForm
          {...defaultProps}
          initialData={{ title: 'Intro', description: 'Desc', order: 3 }}
        />
      )
      expect(screen.getByDisplayValue('Intro')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Desc')).toBeInTheDocument()
      expect(screen.getByDisplayValue('3')).toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('should show error when title is empty on submit', async () => {
      render(<SectionForm {...defaultProps} />)

      fireEvent.click(screen.getByText('Create Section', { selector: 'button' }))

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show error when title exceeds 200 characters', async () => {
      render(<SectionForm {...defaultProps} />)

      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'a'.repeat(201) },
      })
      fireEvent.click(screen.getByText('Create Section', { selector: 'button' }))

      await waitFor(() => {
        expect(screen.getByText('Title must not exceed 200 characters')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show error when order is not an integer', async () => {
      // The handler uses parseInt || 1, so we test via initialData with a float
      render(<SectionForm {...defaultProps} initialData={{ order: 1.5 }} />)

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Title' } })
      const form = document.querySelector('form')
      if (form) fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Order must be an integer')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should clear field error when user types in that field', async () => {
      render(<SectionForm {...defaultProps} />)

      // Trigger error
      fireEvent.click(screen.getByText('Create Section', { selector: 'button' }))
      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument()
      })

      // Type to clear error
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } })
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
    })
  })

  describe('submission', () => {
    it('should call onSubmit with correct data when form is valid', async () => {
      mockOnSubmit.mockResolvedValue(undefined)
      render(<SectionForm {...defaultProps} />)

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'My Section' } })
      fireEvent.change(screen.getByLabelText(/order/i), { target: { value: '2' } })
      fireEvent.click(screen.getByText('Create Section', { selector: 'button' }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'My Section', order: 2 })
        )
      })
    })

    it('should show Saving... during submission', async () => {
      mockOnSubmit.mockImplementation(() => new Promise((r) => setTimeout(r, 100)))
      render(<SectionForm {...defaultProps} />)

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'My Section' } })
      fireEvent.click(screen.getByText('Create Section', { selector: 'button' }))

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument()
      })
    })

    it('should call onCancel when cancel button clicked', () => {
      render(<SectionForm {...defaultProps} />)
      fireEvent.click(screen.getByText('Cancel'))
      expect(mockOnCancel).toHaveBeenCalled()
    })
  })
})
