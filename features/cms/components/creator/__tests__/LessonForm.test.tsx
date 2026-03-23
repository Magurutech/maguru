/**
 * Unit Tests for LessonForm Component
 * Requirements: 2.1, 2.4, 9.2, 9.6
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LessonForm } from '../LessonForm'

// Mock LessonEditor to avoid Tiptap complexity in form tests
jest.mock('../LessonEditor', () => ({
  LessonEditor: ({ onSave }: { onSave: (content: unknown) => void }) => (
    <div data-testid="lesson-editor">
      <button
        type="button"
        onClick={() =>
          onSave({
            content: { type: 'doc', content: [] },
            version: 1,
            lastEdit: new Date().toISOString(),
          })
        }
      >
        Save Content
      </button>
    </div>
  ),
}))

const mockOnSubmit = jest.fn()
const mockOnCancel = jest.fn()

const defaultProps = {
  onSubmit: mockOnSubmit,
  onCancel: mockOnCancel,
}

describe('LessonForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render Create Lesson heading by default', () => {
      render(<LessonForm {...defaultProps} />)
      expect(screen.getByRole('heading', { name: 'Create Lesson' })).toBeInTheDocument()
    })

    it('should render Edit Lesson heading when isEditing=true', () => {
      render(<LessonForm {...defaultProps} isEditing />)
      expect(screen.getByRole('heading', { name: 'Edit Lesson' })).toBeInTheDocument()
    })

    it('should populate title and order with initialData', () => {
      render(
        <LessonForm
          {...defaultProps}
          initialData={{
            title: 'Intro Lesson',
            order: 2,
            content: {
              content: { type: 'doc', content: [] },
              version: 1,
              lastEdit: new Date().toISOString(),
            },
          }}
        />
      )
      expect(screen.getByDisplayValue('Intro Lesson')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2')).toBeInTheDocument()
    })

    it('should render LessonEditor', () => {
      render(<LessonForm {...defaultProps} />)
      expect(screen.getByTestId('lesson-editor')).toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('should show error when title is empty on submit', async () => {
      render(<LessonForm {...defaultProps} />)

      fireEvent.click(screen.getByText('Create Lesson', { selector: 'button' }))

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show error when title exceeds 200 characters', async () => {
      render(<LessonForm {...defaultProps} />)

      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'a'.repeat(201) },
      })
      fireEvent.click(screen.getByText('Create Lesson', { selector: 'button' }))

      await waitFor(() => {
        expect(screen.getByText('Title must not exceed 200 characters')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show error when order is not an integer', async () => {
      render(<LessonForm {...defaultProps} initialData={{ order: 1.5 }} />)

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Title' } })
      fireEvent.submit(document.querySelector('form')!)

      await waitFor(() => {
        expect(screen.getByText('Order must be an integer')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should clear field error when user types in that field', async () => {
      render(<LessonForm {...defaultProps} />)

      fireEvent.click(screen.getByText('Create Lesson', { selector: 'button' }))
      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } })
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
    })
  })

  describe('submission', () => {
    it('should call onSubmit with correct data when form is valid', async () => {
      mockOnSubmit.mockResolvedValue(undefined)
      render(<LessonForm {...defaultProps} />)

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'My Lesson' } })
      fireEvent.change(screen.getByLabelText(/order/i), { target: { value: '3' } })
      fireEvent.click(screen.getByText('Create Lesson', { selector: 'button' }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'My Lesson', order: 3 })
        )
      })
    })

    it('should show Saving... during submission', async () => {
      mockOnSubmit.mockImplementation(() => new Promise((r) => setTimeout(r, 100)))
      render(<LessonForm {...defaultProps} />)

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'My Lesson' } })
      fireEvent.click(screen.getByText('Create Lesson', { selector: 'button' }))

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument()
      })
    })

    it('should call onCancel when cancel button clicked', () => {
      render(<LessonForm {...defaultProps} />)
      fireEvent.click(screen.getByText('Cancel'))
      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should update content when LessonEditor saves', async () => {
      mockOnSubmit.mockResolvedValue(undefined)
      render(<LessonForm {...defaultProps} />)

      // Trigger content save from editor
      fireEvent.click(screen.getByText('Save Content'))

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'My Lesson' } })
      fireEvent.click(screen.getByText('Create Lesson', { selector: 'button' }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              content: { type: 'doc', content: [] },
            }),
          })
        )
      })
    })
  })
})
