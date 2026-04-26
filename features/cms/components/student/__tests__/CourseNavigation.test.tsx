import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CourseNavigation } from '../CourseNavigation'

/**
 * Test Suite: CourseNavigation Component
 *
 * Tests the sidebar navigation with sections and lessons.
 *
 * Requirements: 5.1, 5.2, 6.4
 * Task: 9.1, 9.4
 */

// Mock all lucide-react icons used by the component
jest.mock('lucide-react', () => ({
  Check: ({ className, 'aria-label': ariaLabel, 'data-testid': testId }: { className?: string; 'aria-label'?: string; 'data-testid'?: string }) => (
    <span data-testid={testId ?? 'check-icon'} aria-label={ariaLabel} className={className}>✓</span>
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down-icon" className={className}>▼</span>
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="chevron-right-icon" className={className}>▶</span>
  ),
  BookOpen: ({ className }: { className?: string }) => (
    <span data-testid="book-open-icon" className={className} />
  ),
  Folder: ({ className }: { className?: string }) => (
    <span data-testid="folder-icon" className={className} />
  ),
  FolderOpen: ({ className }: { className?: string }) => (
    <span data-testid="folder-open-icon" className={className} />
  ),
  PanelLeftClose: ({ className }: { className?: string }) => (
    <span data-testid="panel-left-close-icon" className={className} />
  ),
  PanelLeftOpen: ({ className }: { className?: string }) => (
    <span data-testid="panel-left-open-icon" className={className} />
  ),
}))

// Mock collapsible — render children directly so lessons are always visible
jest.mock('@/components/ui/collapsible', () => ({
  Collapsible: ({ children, className }: { children: React.ReactNode; open?: boolean; onOpenChange?: () => void; className?: string }) => (
    <div data-testid="collapsible" className={className}>{children}</div>
  ),
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="collapsible-content">{children}</div>
  ),
  CollapsibleTrigger: ({ children, asChild, className }: { children: React.ReactNode; asChild?: boolean; className?: string }) => (
    asChild ? <>{children}</> : <button className={className}>{children}</button>
  ),
}))

describe('CourseNavigation', () => {
  const mockOnLessonClick = jest.fn()

  const mockSections = [
    {
      id: 'section-1',
      title: 'Introduction',
      lessons: [
        { id: 'lesson-1', title: 'What is HTML?', completed: true },
        { id: 'lesson-2', title: 'HTML Structure', completed: false },
      ],
    },
    {
      id: 'section-2',
      title: 'Advanced Topics',
      lessons: [
        { id: 'lesson-3', title: 'Semantic HTML', completed: false },
        { id: 'lesson-4', title: 'Forms', completed: false },
      ],
    },
  ]

  beforeEach(() => {
    mockOnLessonClick.mockClear()
  })

  describe('Rendering', () => {
    it('should render navigation container', () => {
      const { container } = render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render all section titles', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      expect(screen.getByText('Introduction')).toBeInTheDocument()
      expect(screen.getByText('Advanced Topics')).toBeInTheDocument()
    })

    it('should render all lesson titles', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      expect(screen.getByText('What is HTML?')).toBeInTheDocument()
      expect(screen.getByText('HTML Structure')).toBeInTheDocument()
      expect(screen.getByText('Semantic HTML')).toBeInTheDocument()
      expect(screen.getByText('Forms')).toBeInTheDocument()
    })

    it('should render empty state when no sections', () => {
      render(
        <CourseNavigation
          sections={[]}
          currentLessonId=""
          onLessonClick={mockOnLessonClick}
        />
      )

      expect(screen.getByText(/Belum ada materi/i)).toBeInTheDocument()
    })
  })

  describe('Collapsible Sections', () => {
    it('should render sections as collapsible', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      const collapsibles = screen.getAllByTestId('collapsible')
      expect(collapsibles).toHaveLength(2)
    })
  })

  describe('Lesson Completion Indicators', () => {
    it('should show checkmark for completed lessons', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      // lesson-1 is completed — check-icon with testid lesson-completed-lesson-1
      const completedIcon = screen.getByTestId('lesson-completed-lesson-1')
      expect(completedIcon).toBeInTheDocument()
    })

    it('should not show checkmark for incomplete lessons', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-2"
          onLessonClick={mockOnLessonClick}
        />
      )

      // Only lesson-1 is completed
      expect(screen.getByTestId('lesson-completed-lesson-1')).toBeInTheDocument()
      expect(screen.queryByTestId('lesson-completed-lesson-2')).not.toBeInTheDocument()
      expect(screen.queryByTestId('lesson-completed-lesson-3')).not.toBeInTheDocument()
    })

    it('should show checkmarks for all completed lessons', () => {
      const allCompletedSections = [
        {
          id: 'section-1',
          title: 'Introduction',
          lessons: [
            { id: 'lesson-1', title: 'Lesson 1', completed: true },
            { id: 'lesson-2', title: 'Lesson 2', completed: true },
          ],
        },
      ]

      render(
        <CourseNavigation
          sections={allCompletedSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      expect(screen.getByTestId('lesson-completed-lesson-1')).toBeInTheDocument()
      expect(screen.getByTestId('lesson-completed-lesson-2')).toBeInTheDocument()
    })
  })

  describe('Active Lesson Highlighting', () => {
    it('should mark current lesson as active via aria-current', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-2"
          onLessonClick={mockOnLessonClick}
        />
      )

      const activeLesson = screen.getByTestId('nav-lesson-lesson-2')
      expect(activeLesson).toHaveAttribute('aria-current', 'page')
    })

    it('should set aria-current for active lesson', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-3"
          onLessonClick={mockOnLessonClick}
        />
      )

      const activeLesson = screen.getByTestId('nav-lesson-lesson-3')
      expect(activeLesson).toHaveAttribute('aria-current', 'page')
    })

    it('should only mark one lesson as active', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      const allLessonButtons = [
        screen.getByTestId('nav-lesson-lesson-1'),
        screen.getByTestId('nav-lesson-lesson-2'),
        screen.getByTestId('nav-lesson-lesson-3'),
        screen.getByTestId('nav-lesson-lesson-4'),
      ]

      const activeButtons = allLessonButtons.filter(
        (btn) => btn.getAttribute('aria-current') === 'page'
      )
      expect(activeButtons).toHaveLength(1)
    })
  })

  describe('Lesson Click Handling', () => {
    it('should call onLessonClick when lesson is clicked', async () => {
      const user = userEvent.setup()

      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      await user.click(screen.getByTestId('nav-lesson-lesson-2'))

      expect(mockOnLessonClick).toHaveBeenCalledWith('lesson-2')
      expect(mockOnLessonClick).toHaveBeenCalledTimes(1)
    })

    it('should call onLessonClick with correct lesson id for different lessons', async () => {
      const user = userEvent.setup()

      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      await user.click(screen.getByTestId('nav-lesson-lesson-3'))

      expect(mockOnLessonClick).toHaveBeenCalledWith('lesson-3')
    })

    it('should allow clicking on already active lesson', async () => {
      const user = userEvent.setup()

      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      await user.click(screen.getByTestId('nav-lesson-lesson-1'))

      expect(mockOnLessonClick).toHaveBeenCalledWith('lesson-1')
    })
  })

  describe('Multiple Sections', () => {
    it('should render lessons from different sections separately', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      expect(screen.getByText('What is HTML?')).toBeInTheDocument()
      expect(screen.getByText('HTML Structure')).toBeInTheDocument()
      expect(screen.getByText('Semantic HTML')).toBeInTheDocument()
      expect(screen.getByText('Forms')).toBeInTheDocument()
    })

    it('should handle sections with different lesson counts', () => {
      const unevenSections = [
        {
          id: 'section-1',
          title: 'Short Section',
          lessons: [
            { id: 'lesson-1', title: 'Only Lesson', completed: false },
          ],
        },
        {
          id: 'section-2',
          title: 'Long Section',
          lessons: [
            { id: 'lesson-2', title: 'Lesson 1', completed: false },
            { id: 'lesson-3', title: 'Lesson 2', completed: false },
            { id: 'lesson-4', title: 'Lesson 3', completed: false },
          ],
        },
      ]

      render(
        <CourseNavigation
          sections={unevenSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      expect(screen.getByText('Only Lesson')).toBeInTheDocument()
      expect(screen.getByText('Lesson 1')).toBeInTheDocument()
      expect(screen.getByText('Lesson 2')).toBeInTheDocument()
      expect(screen.getByText('Lesson 3')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle section with no lessons', () => {
      const emptySection = [
        {
          id: 'section-1',
          title: 'Empty Section',
          lessons: [],
        },
      ]

      render(
        <CourseNavigation
          sections={emptySection}
          currentLessonId=""
          onLessonClick={mockOnLessonClick}
        />
      )

      expect(screen.getByText('Empty Section')).toBeInTheDocument()
      expect(screen.queryByTestId(/^nav-lesson-/)).not.toBeInTheDocument()
    })

    it('should handle very long lesson titles', () => {
      const longTitleSections = [
        {
          id: 'section-1',
          title: 'Section',
          lessons: [
            {
              id: 'lesson-1',
              title: 'This is a very long lesson title that might wrap to multiple lines in the sidebar navigation component',
              completed: false,
            },
          ],
        },
      ]

      render(
        <CourseNavigation
          sections={longTitleSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      expect(screen.getByText(/This is a very long lesson title/)).toBeInTheDocument()
    })
  })
})
