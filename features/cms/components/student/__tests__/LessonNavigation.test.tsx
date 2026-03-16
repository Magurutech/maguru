import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LessonNavigation } from '../LessonNavigation'

/**
 * Test Suite: LessonNavigation Component
 * 
 * Tests the previous/next navigation buttons for lessons.
 * 
 * Requirements: 5.7, 5.8, 5.9
 * Task: 9.3, 9.4
 */

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left-icon">←</span>,
  ChevronRight: () => <span data-testid="chevron-right-icon">→</span>,
}))

// Mock shadcn/ui Button component
jest.mock('@/components/ui/button', () => ({
  //eslint-disable-next-line 
  Button: ({ children, onClick, disabled, variant, className, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      data-variant={variant}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}))

describe('LessonNavigation', () => {
  const mockOnNavigate = jest.fn()

  beforeEach(() => {
    mockOnNavigate.mockClear()
  })

  describe('Navigation with Both Lessons', () => {
    it('should render both previous and next buttons when both lessons exist', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Introduction' }}
          nextLesson={{ id: 'lesson-3', title: 'Advanced Topics' }}
          onNavigate={mockOnNavigate}
        />
      )

      expect(screen.getByLabelText(/Previous lesson: Introduction/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Next lesson: Advanced Topics/i)).toBeInTheDocument()
    })

    it('should call onNavigate with previous lesson id when previous button clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Introduction' }}
          nextLesson={{ id: 'lesson-3', title: 'Advanced Topics' }}
          onNavigate={mockOnNavigate}
        />
      )

      const previousButton = screen.getByLabelText(/Previous lesson: Introduction/i)
      await user.click(previousButton)

      expect(mockOnNavigate).toHaveBeenCalledWith('lesson-1')
      expect(mockOnNavigate).toHaveBeenCalledTimes(1)
    })

    it('should call onNavigate with next lesson id when next button clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Introduction' }}
          nextLesson={{ id: 'lesson-3', title: 'Advanced Topics' }}
          onNavigate={mockOnNavigate}
        />
      )

      const nextButton = screen.getByLabelText(/Next lesson: Advanced Topics/i)
      await user.click(nextButton)

      expect(mockOnNavigate).toHaveBeenCalledWith('lesson-3')
      expect(mockOnNavigate).toHaveBeenCalledTimes(1)
    })

    it('should display lesson titles in buttons', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Introduction' }}
          nextLesson={{ id: 'lesson-3', title: 'Advanced Topics' }}
          onNavigate={mockOnNavigate}
        />
      )

      expect(screen.getByText('Introduction')).toBeInTheDocument()
      expect(screen.getByText('Advanced Topics')).toBeInTheDocument()
    })
  })

  describe('First Lesson (No Previous)', () => {
    it('should disable previous button when no previous lesson', () => {
      render(
        <LessonNavigation
          nextLesson={{ id: 'lesson-2', title: 'Next Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      const previousButton = screen.getByLabelText(/No previous lesson/i)
      expect(previousButton).toBeDisabled()
    })

    it('should not call onNavigate when disabled previous button clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <LessonNavigation
          nextLesson={{ id: 'lesson-2', title: 'Next Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      const previousButton = screen.getByLabelText(/No previous lesson/i)
      await user.click(previousButton)

      expect(mockOnNavigate).not.toHaveBeenCalled()
    })

    it('should enable next button when next lesson exists', () => {
      render(
        <LessonNavigation
          nextLesson={{ id: 'lesson-2', title: 'Next Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      const nextButton = screen.getByLabelText(/Next lesson: Next Lesson/i)
      expect(nextButton).not.toBeDisabled()
    })
  })

  describe('Last Lesson (No Next)', () => {
    it('should disable next button when no next lesson', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Previous Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      const nextButton = screen.getByLabelText(/No next lesson/i)
      expect(nextButton).toBeDisabled()
    })

    it('should not call onNavigate when disabled next button clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Previous Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      const nextButton = screen.getByLabelText(/No next lesson/i)
      await user.click(nextButton)

      expect(mockOnNavigate).not.toHaveBeenCalled()
    })

    it('should enable previous button when previous lesson exists', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Previous Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      const previousButton = screen.getByLabelText(/Previous lesson: Previous Lesson/i)
      expect(previousButton).not.toBeDisabled()
    })
  })

  describe('Single Lesson (No Navigation)', () => {
    it('should disable both buttons when no previous or next lesson', () => {
      render(
        <LessonNavigation
          onNavigate={mockOnNavigate}
        />
      )

      const previousButton = screen.getByLabelText(/No previous lesson/i)
      const nextButton = screen.getByLabelText(/No next lesson/i)

      expect(previousButton).toBeDisabled()
      expect(nextButton).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have navigation landmark', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Previous' }}
          nextLesson={{ id: 'lesson-3', title: 'Next' }}
          onNavigate={mockOnNavigate}
        />
      )

      const nav = screen.getByRole('navigation', { name: 'Lesson navigation' })
      expect(nav).toBeInTheDocument()
    })

    it('should have descriptive aria-labels for enabled buttons', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Introduction to HTML' }}
          nextLesson={{ id: 'lesson-3', title: 'CSS Basics' }}
          onNavigate={mockOnNavigate}
        />
      )

      expect(screen.getByLabelText('Previous lesson: Introduction to HTML')).toBeInTheDocument()
      expect(screen.getByLabelText('Next lesson: CSS Basics')).toBeInTheDocument()
    })

    it('should have descriptive aria-labels for disabled buttons', () => {
      render(
        <LessonNavigation
          onNavigate={mockOnNavigate}
        />
      )

      expect(screen.getByLabelText('No previous lesson')).toBeInTheDocument()
      expect(screen.getByLabelText('No next lesson')).toBeInTheDocument()
    })

    it('should hide icons from screen readers', () => {
      const { container } = render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Previous' }}
          nextLesson={{ id: 'lesson-3', title: 'Next' }}
          onNavigate={mockOnNavigate}
        />
      )

      const icons = container.querySelectorAll('[data-testid="chevron-left-icon"], [data-testid="chevron-right-icon"]')
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('Button Labels', () => {
    it('should display "Previous" and "Next" labels', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Intro' }}
          nextLesson={{ id: 'lesson-3', title: 'Advanced' }}
          onNavigate={mockOnNavigate}
        />
      )

      const previousLabels = screen.getAllByText('Previous')
      const nextLabels = screen.getAllByText('Next')

      expect(previousLabels.length).toBeGreaterThan(0)
      expect(nextLabels.length).toBeGreaterThan(0)
    })
  })
})
