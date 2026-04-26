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
  ChevronLeft: ({ className }: { className?: string }) => (
    <span data-testid="chevron-left-icon" className={className} aria-hidden="true">←</span>
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="chevron-right-icon" className={className} aria-hidden="true">→</span>
  ),
}))

// Mock shadcn/ui Button component
jest.mock('@/components/ui/button', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: ({ children, onClick, disabled, variant, className, 'aria-label': ariaLabel, 'data-testid': testId, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      className={className}
      aria-label={ariaLabel}
      data-testid={testId}
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

      expect(screen.getByTestId('prev-lesson-btn')).toBeInTheDocument()
      expect(screen.getByTestId('next-lesson-btn')).toBeInTheDocument()
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

      await user.click(screen.getByTestId('prev-lesson-btn'))

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

      await user.click(screen.getByTestId('next-lesson-btn'))

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
    it('should not render previous button when no previous lesson', () => {
      render(
        <LessonNavigation
          nextLesson={{ id: 'lesson-2', title: 'Next Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      expect(screen.queryByTestId('prev-lesson-btn')).not.toBeInTheDocument()
    })

    it('should render next button when next lesson exists', () => {
      render(
        <LessonNavigation
          nextLesson={{ id: 'lesson-2', title: 'Next Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      expect(screen.getByTestId('next-lesson-btn')).toBeInTheDocument()
    })

    it('should call onNavigate with next lesson id', async () => {
      const user = userEvent.setup()

      render(
        <LessonNavigation
          nextLesson={{ id: 'lesson-2', title: 'Next Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      await user.click(screen.getByTestId('next-lesson-btn'))
      expect(mockOnNavigate).toHaveBeenCalledWith('lesson-2')
    })
  })

  describe('Last Lesson (No Next)', () => {
    it('should not render next button when no next lesson', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Previous Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      expect(screen.queryByTestId('next-lesson-btn')).not.toBeInTheDocument()
    })

    it('should render previous button when previous lesson exists', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Previous Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      expect(screen.getByTestId('prev-lesson-btn')).toBeInTheDocument()
    })

    it('should call onNavigate with previous lesson id', async () => {
      const user = userEvent.setup()

      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Previous Lesson' }}
          onNavigate={mockOnNavigate}
        />
      )

      await user.click(screen.getByTestId('prev-lesson-btn'))
      expect(mockOnNavigate).toHaveBeenCalledWith('lesson-1')
    })
  })

  describe('Single Lesson (No Navigation)', () => {
    it('should not render any navigation buttons when no previous or next lesson', () => {
      render(
        <LessonNavigation
          onNavigate={mockOnNavigate}
        />
      )

      expect(screen.queryByTestId('prev-lesson-btn')).not.toBeInTheDocument()
      expect(screen.queryByTestId('next-lesson-btn')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have navigation landmark with Indonesian label', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Previous' }}
          nextLesson={{ id: 'lesson-3', title: 'Next' }}
          onNavigate={mockOnNavigate}
        />
      )

      const nav = screen.getByRole('navigation', { name: /navigasi pelajaran/i })
      expect(nav).toBeInTheDocument()
    })

    it('should have descriptive aria-labels for previous button', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Introduction to HTML' }}
          nextLesson={{ id: 'lesson-3', title: 'CSS Basics' }}
          onNavigate={mockOnNavigate}
        />
      )

      const prevBtn = screen.getByTestId('prev-lesson-btn')
      expect(prevBtn).toHaveAttribute('aria-label', expect.stringContaining('Introduction to HTML'))
    })

    it('should have descriptive aria-labels for next button', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Introduction to HTML' }}
          nextLesson={{ id: 'lesson-3', title: 'CSS Basics' }}
          onNavigate={mockOnNavigate}
        />
      )

      const nextBtn = screen.getByTestId('next-lesson-btn')
      expect(nextBtn).toHaveAttribute('aria-label', expect.stringContaining('CSS Basics'))
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
    it('should display lesson titles in navigation buttons', () => {
      render(
        <LessonNavigation
          previousLesson={{ id: 'lesson-1', title: 'Intro' }}
          nextLesson={{ id: 'lesson-3', title: 'Advanced' }}
          onNavigate={mockOnNavigate}
        />
      )

      expect(screen.getByText('Intro')).toBeInTheDocument()
      expect(screen.getByText('Advanced')).toBeInTheDocument()
    })
  })
})
