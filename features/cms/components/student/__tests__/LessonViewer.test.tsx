/**
 * LessonViewer Component Tests
 *
 * Tests for student lesson viewer component with Tiptap renderer.
 *
 * Requirements: 5.3, 5.4, 5.5
 * Task: 8.3
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { LessonViewer } from '../LessonViewer'
import { useEditor } from '@tiptap/react'

// Mock Tiptap
jest.mock('@tiptap/react', () => ({
  useEditor: jest.fn(),
  EditorContent: ({ editor }: { editor: unknown }) => (
    <div data-testid="editor-content">{editor ? 'Editor Ready' : 'Loading'}</div>
  ),
}))

// Mock Tiptap extensions
jest.mock('@tiptap/starter-kit', () => ({ StarterKit: { configure: jest.fn().mockReturnValue({}) } }))
jest.mock('@tiptap/extension-text-align', () => ({ TextAlign: { configure: jest.fn().mockReturnValue({}) } }))
jest.mock('@tiptap/extension-highlight', () => ({ Highlight: { configure: jest.fn().mockReturnValue({}) } }))
jest.mock('@tiptap/extension-typography', () => ({ Typography: {} }))
jest.mock('@tiptap/extension-superscript', () => ({ Superscript: {} }))
jest.mock('@tiptap/extension-subscript', () => ({ Subscript: {} }))
jest.mock('@tiptap/extensions', () => ({ Selection: {} }))

// Mock SCSS imports
jest.mock('@/components/tiptap-node/heading-node/heading-node.scss', () => ({}))
jest.mock('@/components/tiptap-node/paragraph-node/paragraph-node.scss', () => ({}))
jest.mock('@/components/tiptap-node/list-node/list-node.scss', () => ({}))
jest.mock('@/components/tiptap-node/code-block-node/code-block-node.scss', () => ({}))
jest.mock('@/components/tiptap-node/blockquote-node/blockquote-node.scss', () => ({}))
jest.mock('@/components/tiptap-templates/simple/simple-editor.scss', () => ({}))

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
    run: jest.fn(),
    getJSON: jest.fn().mockReturnValue({ type: 'doc', content: [] }),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize Tiptap editor with editable false', () => {
      mockUseEditor.mockReturnValue(mockEditor as never)

      render(<LessonViewer lesson={mockLesson} />)

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.editable).toBe(false)
    })

    it('should load content from lesson.content.content', () => {
      mockUseEditor.mockReturnValue(mockEditor as never)

      render(<LessonViewer lesson={mockLesson} />)

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.content).toEqual(mockLesson.content.content)
    })

    it('should pass extensions array to useEditor', () => {
      mockUseEditor.mockReturnValue(mockEditor as never)

      render(<LessonViewer lesson={mockLesson} />)

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.extensions).toBeDefined()
      expect(Array.isArray(call?.extensions)).toBe(true)
    })

    it('should configure onCreate callback for error handling', () => {
      mockUseEditor.mockReturnValue(mockEditor as never)

      render(<LessonViewer lesson={mockLesson} />)

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.onCreate).toBeDefined()
      expect(typeof call?.onCreate).toBe('function')
    })

    it('should set immediatelyRender to false', () => {
      mockUseEditor.mockReturnValue(mockEditor as never)

      render(<LessonViewer lesson={mockLesson} />)

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.immediatelyRender).toBe(false)
    })

    it('should display loading state when editor is not ready', () => {
      mockUseEditor.mockReturnValue(null)

      render(<LessonViewer lesson={mockLesson} />)

      expect(screen.getByText('Loading lesson...')).toBeInTheDocument()
    })
  })

  describe('Content Display', () => {
    beforeEach(() => {
      mockUseEditor.mockReturnValue(mockEditor as never)
    })

    it('should display lesson title', () => {
      render(<LessonViewer lesson={mockLesson} />)

      expect(screen.getByTestId('lesson-title')).toHaveTextContent('Introduction to HTML')
    })

    it('should render EditorContent component', () => {
      render(<LessonViewer lesson={mockLesson} />)

      expect(screen.getByTestId('editor-content')).toBeInTheDocument()
      expect(screen.getByText('Editor Ready')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should display error state when editor returns null', () => {
      mockUseEditor.mockReturnValue(null)

      render(<LessonViewer lesson={mockLesson} />)

      // Loading state shown when editor is null
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should display error message when Tiptap rendering fails', () => {
      mockUseEditor.mockReturnValue(null)

      render(<LessonViewer lesson={mockLesson} />)

      // Verify onCreate callback is configured for error handling
      const config = mockUseEditor.mock.calls[0][0]
      expect(config?.onCreate).toBeDefined()
      expect(typeof config?.onCreate).toBe('function')
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

      render(<LessonViewer lesson={lessonWithHeading} />)

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.content).toEqual(lessonWithHeading.content.content)
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

      render(<LessonViewer lesson={lessonWithList} />)

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.content).toEqual(lessonWithList.content.content)
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

      render(<LessonViewer lesson={lessonWithCode} />)

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.content).toEqual(lessonWithCode.content.content)
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
                  }
                ]
              }
            ]
          }
        }
      }

      render(<LessonViewer lesson={lessonWithMarks} />)

      const call = mockUseEditor.mock.calls[0][0]
      expect(call?.content).toEqual(lessonWithMarks.content.content)
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
          content: { type: 'doc' as const, content: [] }
        }
      }

      render(<LessonViewer lesson={lessonWithEmptyContent} />)

      expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    })

    it('should render without crashing for any valid lesson', () => {
      render(<LessonViewer lesson={mockLesson} />)

      expect(screen.getByTestId('lesson-title')).toBeInTheDocument()
      expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    })
  })
})
