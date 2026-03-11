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

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon">✓</span>,
  ChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down-icon" className={className}>▼</span>
  ),
}))

// Mock shadcn/ui components
jest.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar">{children}</div>,
  SidebarContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarGroupContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarGroupLabel: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => (
    asChild ? <>{children}</> : <div>{children}</div>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  SidebarMenuButton: ({ 
    children, 
    onClick, 
    isActive, 
    className,
    ...props 
  }: { 
    children: React.ReactNode
    onClick?: () => void
    isActive?: boolean
    className?: string
    'aria-current'?: string
  }) => (
    <button 
      onClick={onClick} 
      data-active={isActive}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/collapsible', () => ({
  Collapsible: ({ children, defaultOpen, className }: { children: React.ReactNode; defaultOpen?: boolean; className?: string }) => (
    <div data-testid="collapsible" data-default-open={defaultOpen} className={className}>
      {children}
    </div>
  ),
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CollapsibleTrigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button className={className}>{children}</button>
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
    it('should render sidebar container', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
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

      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
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

    it('should default sections to open', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      const collapsibles = screen.getAllByTestId('collapsible')
      collapsibles.forEach(collapsible => {
        expect(collapsible).toHaveAttribute('data-default-open', 'true')
      })
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

      const completedIcon = screen.getByTestId('check-icon')
      expect(completedIcon).toBeInTheDocument()
      expect(completedIcon).toHaveTextContent('✓')
    })

    it('should not show checkmark for incomplete lessons', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-2"
          onLessonClick={mockOnLessonClick}
        />
      )

      const completedIcons = screen.queryAllByTestId('check-icon')
      // Only lesson-1 is completed
      expect(completedIcons).toHaveLength(1)
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

      const completedIcons = screen.getAllByTestId('check-icon')
      expect(completedIcons).toHaveLength(2)
    })
  })

  describe('Active Lesson Highlighting', () => {
    it('should mark current lesson as active', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-2"
          onLessonClick={mockOnLessonClick}
        />
      )

      const lessonButtons = screen.getAllByRole('button').filter(
        button => button.textContent?.includes('HTML Structure')
      )
      
      const activeButton = lessonButtons.find(button => button.getAttribute('data-active') === 'true')
      expect(activeButton).toBeInTheDocument()
    })

    it('should set aria-current for active lesson', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-3"
          onLessonClick={mockOnLessonClick}
        />
      )

      const lessonButtons = screen.getAllByRole('button').filter(
        button => button.textContent?.includes('Semantic HTML')
      )
      
      const activeButton = lessonButtons.find(button => button.getAttribute('aria-current') === 'page')
      expect(activeButton).toBeInTheDocument()
    })

    it('should only mark one lesson as active', () => {
      render(
        <CourseNavigation
          sections={mockSections}
          currentLessonId="lesson-1"
          onLessonClick={mockOnLessonClick}
        />
      )

      const activeButtons = screen.getAllByRole('button').filter(
        button => button.getAttribute('data-active') === 'true'
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

      const lessonButtons = screen.getAllByRole('button').filter(
        button => button.textContent?.includes('HTML Structure')
      )
      
      await user.click(lessonButtons[0])

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

      const semanticButton = screen.getAllByRole('button').filter(
        button => button.textContent?.includes('Semantic HTML')
      )[0]
      
      await user.click(semanticButton)

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

      const activeButton = screen.getAllByRole('button').filter(
        button => button.textContent?.includes('What is HTML?')
      )[0]
      
      await user.click(activeButton)

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

      // Section 1 lessons
      expect(screen.getByText('What is HTML?')).toBeInTheDocument()
      expect(screen.getByText('HTML Structure')).toBeInTheDocument()

      // Section 2 lessons
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
      expect(screen.queryByRole('button', { name: /lesson/i })).not.toBeInTheDocument()
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
              completed: false 
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
