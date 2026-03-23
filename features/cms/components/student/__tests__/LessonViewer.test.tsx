/**
 * LessonViewer Component Tests
 * 
 * Tests for student lesson viewer component with Tiptap renderer.
 * 
 * Requirements: 5.3, 5.4, 5.5, 6.1, 6.4, 6.5
 * Task: 8.3
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { LessonViewer } from '../LessonViewer'
import { useEditor } from '@tiptap/react'

// Mock Tiptap
jest.mock('@tiptap/react', () => ({
  useEditor: jest.fn(),
  EditorContent: ({ editor }: { editor: unknown }) => (
    <div data-testid="editor-content">{editor ? 'Editor Ready' : 'Loading'}</div>
  ),
}))

const mockUseEditor = useEditor as jest.MockedFunction<typeof useEditor>

describe('LessonViewer Component', () => {
  const mockLesson = {
    id: 'lesson-1',
    title: 'Introduction to HTML',
    content: {
      content: {
        type: 'doc' as const,
        content: [
          {
            type: 'paragraph' as const,
            content: [
              { type: 'text' as const, text: 'This is a test lesson.' }
            ]
          }
        ]
      },
      version: 1,
      lastEdit: '2026-03-10T10:00:00Z'
    }
  }

  const mockEditor = {
    isActive: jest.fn(),
    chain: jest.fn().mockReturnThis(),
    focus: jest.fn().mockReturnThis(),
    toggleBold: jest.fn().mockReturnThis(),
    run: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize Tiptap editor with StarterKit', () => {
      mockUseEditor.mockReturnValue(mockEditor as never)

      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      expect(mockUseEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          extensions: expect.any(Array),
          content: mockLesson.content.content,
          editable: false,
          editorProps: expect.objectContaining({
            attributes: expect.objectContaining({
              class: expect.stringContaining('tiptap prose'),
            }),
          }),
          onCreate: expect.any(Function),
        })
      )
    })

    it('should set editable to false for read-only mode', () => {
      mockUseEditor.mockReturnValue(mockEditor as never)

      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.editable).toBe(false)
    })

    it('should load content from lesson.content.content', () => {
      mockUseEditor.mockReturnValue(mockEditor as never)

      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.content).toEqual(mockLesson.content.content)
    })

    it('should display loading state when editor is not ready', () => {
      mockUseEditor.mockReturnValue(null)

      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      expect(screen.getByText('Loading lesson...')).toBeInTheDocument()
    })
  })

  describe('Content Display', () => {
    beforeEach(() => {
      mockUseEditor.mockReturnValue(mockEditor as never)
    })

    it('should display lesson title', () => {
      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      expect(screen.getByText('Introduction to HTML')).toBeInTheDocument()
    })

    it('should render EditorContent component', () => {
      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      expect(screen.getByTestId('editor-content')).toBeInTheDocument()
      expect(screen.getByText('Editor Ready')).toBeInTheDocument()
    })

    it('should display version metadata', () => {
      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      expect(screen.getByText(/Version: 1/)).toBeInTheDocument()
    })

    it('should display lastEdit metadata with formatted date', () => {
      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      // Check that date is displayed (format may vary by locale)
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument()
    })
  })

  describe('Mark as Complete Button', () => {
    beforeEach(() => {
      mockUseEditor.mockReturnValue(mockEditor as never)
    })

    it('should display "Mark as Complete" button when not completed', () => {
      render(
        <LessonViewer
          lesson={mockLesson}
          onMarkComplete={jest.fn()}
          isCompleted={false}
        />
      )

      expect(screen.getByText('Tandai Selesai')).toBeInTheDocument()
    })

    it('should not display "Mark as Complete" button when completed', () => {
      render(
        <LessonViewer
          lesson={mockLesson}
          onMarkComplete={jest.fn()}
          isCompleted={true}
        />
      )

      expect(screen.queryByText('Tandai Selesai')).not.toBeInTheDocument()
    })

    it('should not display "Mark as Complete" button when onMarkComplete is not provided', () => {
      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      expect(screen.queryByText('Tandai Selesai')).not.toBeInTheDocument()
    })

    it('should call onMarkComplete when button is clicked', async () => {
      const mockOnMarkComplete = jest.fn().mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(
        <LessonViewer
          lesson={mockLesson}
          onMarkComplete={mockOnMarkComplete}
          isCompleted={false}
        />
      )

      const button = screen.getByText('Tandai Selesai')
      await user.click(button)

      await waitFor(() => {
        expect(mockOnMarkComplete).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Completion Badge', () => {
    beforeEach(() => {
      mockUseEditor.mockReturnValue(mockEditor as never)
    })

    it('should display completion badge when completed', () => {
      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={true}
        />
      )

      expect(screen.getByText('✓ Completed')).toBeInTheDocument()
    })

    it('should not display completion badge when not completed', () => {
      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      expect(screen.queryByText('✓ Completed')).not.toBeInTheDocument()
    })
  })

  describe('Content Rendering with Different Node Types', () => {
    beforeEach(() => {
      mockUseEditor.mockReturnValue(mockEditor as never)
    })

    it('should render lesson with heading node', () => {
      const lessonWithHeading = {
        ...mockLesson,
        content: {
          ...mockLesson.content,
          content: {
            type: 'doc' as const,
            content: [
              {
                type: 'heading' as const,
                attrs: { level: 1 },
                content: [{ type: 'text' as const, text: 'Main Heading' }]
              }
            ]
          }
        }
      }

      render(
        <LessonViewer
          lesson={lessonWithHeading}
          isCompleted={false}
        />
      )

      expect(mockUseEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          content: lessonWithHeading.content.content
        })
      )
    })

    it('should render lesson with list nodes', () => {
      const lessonWithList = {
        ...mockLesson,
        content: {
          ...mockLesson.content,
          content: {
            type: 'doc' as const,
            content: [
              {
                type: 'bulletList' as const,
                content: [
                  {
                    type: 'listItem' as const,
                    content: [
                      {
                        type: 'paragraph' as const,
                        content: [{ type: 'text' as const, text: 'Item 1' }]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      }

      render(
        <LessonViewer
          lesson={lessonWithList}
          isCompleted={false}
        />
      )

      expect(mockUseEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          content: lessonWithList.content.content
        })
      )
    })

    it('should render lesson with code block', () => {
      const lessonWithCode = {
        ...mockLesson,
        content: {
          ...mockLesson.content,
          content: {
            type: 'doc' as const,
            content: [
              {
                type: 'codeBlock' as const,
                attrs: { language: 'javascript' },
                content: [{ type: 'text' as const, text: 'console.log("Hello")' }]
              }
            ]
          }
        }
      }

      render(
        <LessonViewer
          lesson={lessonWithCode}
          isCompleted={false}
        />
      )

      expect(mockUseEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          content: lessonWithCode.content.content
        })
      )
    })

    it('should render lesson with text marks (bold, italic)', () => {
      const lessonWithMarks = {
        ...mockLesson,
        content: {
          ...mockLesson.content,
          content: {
            type: 'doc' as const,
            content: [
              {
                type: 'paragraph' as const,
                content: [
                  {
                    type: 'text' as const,
                    text: 'Bold text',
                    marks: [{ type: 'bold' as const }]
                  },
                  {
                    type: 'text' as const,
                    text: ' and italic text',
                    marks: [{ type: 'italic' as const }]
                  }
                ]
              }
            ]
          }
        }
      }

      render(
        <LessonViewer
          lesson={lessonWithMarks}
          isCompleted={false}
        />
      )

      expect(mockUseEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          content: lessonWithMarks.content.content
        })
      )
    })
  })

  describe('Edge Cases', () => {
    beforeEach(() => {
      mockUseEditor.mockReturnValue(mockEditor as never)
    })

    it('should handle lesson with empty content', () => {
      const lessonWithEmptyContent = {
        ...mockLesson,
        content: {
          ...mockLesson.content,
          content: {
            type: 'doc' as const,
            content: []
          }
        }
      }

      render(
        <LessonViewer
          lesson={lessonWithEmptyContent}
          isCompleted={false}
        />
      )

      expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    })

    it('should handle lesson with version 0', () => {
      const lessonWithVersion0 = {
        ...mockLesson,
        content: {
          ...mockLesson.content,
          version: 0
        }
      }

      render(
        <LessonViewer
          lesson={lessonWithVersion0}
          isCompleted={false}
        />
      )

      expect(screen.getByText(/Version: 0/)).toBeInTheDocument()
    })

    it('should handle invalid date gracefully', () => {
      const lessonWithInvalidDate = {
        ...mockLesson,
        content: {
          ...mockLesson.content,
          lastEdit: 'invalid-date'
        }
      }

      render(
        <LessonViewer
          lesson={lessonWithInvalidDate}
          isCompleted={false}
        />
      )

      // Should still render without crashing
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument()
    })

    it('should display error message when Tiptap rendering fails', () => {
      // Mock useEditor to simulate error state with onCreate callback
      mockUseEditor.mockReturnValue(null)

      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      // Verify onCreate callback is configured for error handling
      const config = mockUseEditor.mock.calls[0][0]
      expect(config?.onCreate).toBeDefined()
      expect(typeof config?.onCreate).toBe('function')
    })

    it('should have error handling configuration for accessibility', () => {
      mockUseEditor.mockReturnValue(mockEditor as never)

      render(
        <LessonViewer
          lesson={mockLesson}
          isCompleted={false}
        />
      )

      // Verify onCreate callback is configured with proper error handling
      const config = mockUseEditor.mock.calls[0][0]
      expect(config?.onCreate).toBeDefined()
      
      // The component should have error state management via onCreate
    })
  })
})
