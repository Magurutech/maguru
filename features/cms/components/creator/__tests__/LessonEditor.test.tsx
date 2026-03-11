/**
 * Unit Tests for Tiptap Editor Components
 * 
 * Tests for LessonEditor, EditorToolbar, and LessonPreview components
 * 
 * Requirements: 4.1-4.9
 * Task: 7.4
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LessonEditor } from '../LessonEditor'
import { EditorToolbar } from '../EditorToolbar'
import { LessonPreview } from '../LessonPreview'
import { useEditor, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// Mock Tiptap
jest.mock('@tiptap/react', () => ({
  useEditor: jest.fn(),
  EditorContent: ({ editor, className }: { editor: unknown; className?: string }) => (
    <div data-testid="editor-content" className={className}>
      {editor ? 'Editor Content' : 'Loading...'}
    </div>
  ),
}))

jest.mock('@tiptap/starter-kit', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('LessonEditor Component', () => {
  const mockOnSave = jest.fn()
  const mockOnCancel = jest.fn()
  
  const mockEditor = {
    getJSON: jest.fn(() => ({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Test content' }],
        },
      ],
    })),
    chain: jest.fn(() => ({
      focus: jest.fn(() => ({
        toggleBold: jest.fn(() => ({ run: jest.fn() })),
        toggleItalic: jest.fn(() => ({ run: jest.fn() })),
        toggleCode: jest.fn(() => ({ run: jest.fn() })),
        toggleHeading: jest.fn(() => ({ run: jest.fn() })),
        toggleBulletList: jest.fn(() => ({ run: jest.fn() })),
        toggleOrderedList: jest.fn(() => ({ run: jest.fn() })),
        setLink: jest.fn(() => ({ run: jest.fn() })),
        toggleCodeBlock: jest.fn(() => ({ run: jest.fn() })),
      })),
    })),
    isActive: jest.fn(() => false),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useEditor as jest.Mock).mockReturnValue(mockEditor)
  })

  describe('Editor Initialization', () => {
    it('should initialize editor with StarterKit extension', () => {
      render(<LessonEditor onSave={mockOnSave} />)

      expect(useEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          extensions: [StarterKit],
          editable: true,
        })
      )
    })

    it('should initialize with provided initial content', () => {
      const initialContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Initial content' }],
          },
        ],
      }

      render(<LessonEditor initialContent={initialContent} onSave={mockOnSave} />)

      expect(useEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          content: initialContent,
        })
      )
    })

    it('should show loading state when editor is not ready', () => {
      ;(useEditor as jest.Mock).mockReturnValue(null)

      render(<LessonEditor onSave={mockOnSave} />)

      expect(screen.getByText('Loading editor...')).toBeInTheDocument()
    })

    it('should render editor content when editor is ready', () => {
      render(<LessonEditor onSave={mockOnSave} />)

      expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    })
  })

  describe('Save Functionality', () => {
    it('should call onSave with correct content structure when save button clicked', async () => {
      render(<LessonEditor onSave={mockOnSave} />)

      const saveButton = screen.getByText('Save Lesson')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.any(Object),
            version: expect.any(Number),
            lastEdit: expect.any(String),
          })
        )
      })
    })

    it('should call editor.getJSON() when saving', async () => {
      render(<LessonEditor onSave={mockOnSave} />)

      const saveButton = screen.getByText('Save Lesson')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockEditor.getJSON).toHaveBeenCalled()
      })
    })

    it('should increment version number on save', async () => {
      render(<LessonEditor onSave={mockOnSave} />)

      const saveButton = screen.getByText('Save Lesson')
      
      // First save
      fireEvent.click(saveButton)
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({ version: 2 })
        )
      })

      // Second save
      fireEvent.click(saveButton)
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({ version: 3 })
        )
      })
    })

    it('should update lastEdit timestamp on save', async () => {
      const beforeSave = new Date().toISOString()
      
      render(<LessonEditor onSave={mockOnSave} />)

      const saveButton = screen.getByText('Save Lesson')
      fireEvent.click(saveButton)

      await waitFor(() => {
        const callArgs = mockOnSave.mock.calls[0][0]
        expect(callArgs.lastEdit).toBeDefined()
        expect(new Date(callArgs.lastEdit).getTime()).toBeGreaterThanOrEqual(
          new Date(beforeSave).getTime()
        )
      })
    })

    it('should show saving state during save operation', async () => {
      mockOnSave.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(<LessonEditor onSave={mockOnSave} />)

      const saveButton = screen.getByText('Save Lesson')
      fireEvent.click(saveButton)

      expect(screen.getByText('Saving...')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Save Lesson')).toBeInTheDocument()
      })
    })

    it('should disable save button during save operation', async () => {
      mockOnSave.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(<LessonEditor onSave={mockOnSave} />)

      const saveButton = screen.getByText('Save Lesson') as HTMLButtonElement
      fireEvent.click(saveButton)

      expect(saveButton).toBeDisabled()

      await waitFor(() => {
        expect(saveButton).not.toBeDisabled()
      })
    })
  })

  describe('Cancel Functionality', () => {
    it('should render cancel button when onCancel is provided', () => {
      render(<LessonEditor onSave={mockOnSave} onCancel={mockOnCancel} />)

      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('should not render cancel button when onCancel is not provided', () => {
      render(<LessonEditor onSave={mockOnSave} />)

      expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
    })

    it('should call onCancel when cancel button clicked', () => {
      render(<LessonEditor onSave={mockOnSave} onCancel={mockOnCancel} />)

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should disable cancel button during save operation', async () => {
      mockOnSave.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(<LessonEditor onSave={mockOnSave} onCancel={mockOnCancel} />)

      const saveButton = screen.getByText('Save Lesson')
      fireEvent.click(saveButton)

      const cancelButton = screen.getByText('Cancel') as HTMLButtonElement
      expect(cancelButton).toBeDisabled()

      await waitFor(() => {
        expect(cancelButton).not.toBeDisabled()
      })
    })
  })

  describe('getJSON() Returns Valid Structure', () => {
    it('should return valid Tiptap JSON structure', async () => {
      const expectedJSON = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Test content' }],
          },
        ],
      }

      mockEditor.getJSON.mockReturnValue(expectedJSON)

      render(<LessonEditor onSave={mockOnSave} />)

      const saveButton = screen.getByText('Save Lesson')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expectedJSON,
          })
        )
      })
    })

    it('should handle complex content with multiple node types', async () => {
      const complexJSON = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Heading' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Bold text', marks: [{ type: 'bold' }] },
            ],
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'List item' }],
                  },
                ],
              },
            ],
          },
        ],
      }

      mockEditor.getJSON.mockReturnValue(complexJSON)

      render(<LessonEditor onSave={mockOnSave} />)

      const saveButton = screen.getByText('Save Lesson')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: complexJSON,
          })
        )
      })
    })
  })
})

describe('EditorToolbar Component', () => {
  const mockEditor = {
    chain: jest.fn(() => ({
      focus: jest.fn(() => ({
        toggleBold: jest.fn(() => ({ run: jest.fn() })),
        toggleItalic: jest.fn(() => ({ run: jest.fn() })),
        toggleCode: jest.fn(() => ({ run: jest.fn() })),
        toggleHeading: jest.fn(() => ({ run: jest.fn() })),
        toggleBulletList: jest.fn(() => ({ run: jest.fn() })),
        toggleOrderedList: jest.fn(() => ({ run: jest.fn() })),
        setLink: jest.fn(() => ({ run: jest.fn() })),
        toggleCodeBlock: jest.fn(() => ({ run: jest.fn() })),
      })),
    })),
    isActive: jest.fn((type: string, attrs?: { level?: number }) => {
      if (type === 'bold') return true
      if (type === 'heading' && attrs?.level === 2) return true
      return false
    }),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window.prompt
    global.prompt = jest.fn()
  })

  it('should return null when editor is null', () => {
    const { container } = render(<EditorToolbar editor={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render all formatting buttons', () => {
    render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

    expect(screen.getByText('Bold')).toBeInTheDocument()
    expect(screen.getByText('Italic')).toBeInTheDocument()
    expect(screen.getByText('Code')).toBeInTheDocument()
    expect(screen.getByText('H1')).toBeInTheDocument()
    expect(screen.getByText('H2')).toBeInTheDocument()
    expect(screen.getByText('H3')).toBeInTheDocument()
    expect(screen.getByText('Bullet List')).toBeInTheDocument()
    expect(screen.getByText('Ordered List')).toBeInTheDocument()
    expect(screen.getByText('Link')).toBeInTheDocument()
    expect(screen.getByText('Code Block')).toBeInTheDocument()
  })

  describe('Toolbar Button Functionality', () => {
    it('should toggle bold when bold button clicked', () => {
      const chainMock = {
        focus: jest.fn(() => ({
          toggleBold: jest.fn(() => ({ run: jest.fn() })),
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const boldButton = screen.getByText('Bold')
      fireEvent.click(boldButton)

      expect(mockEditor.chain).toHaveBeenCalled()
      expect(chainMock.focus).toHaveBeenCalled()
    })

    it('should toggle italic when italic button clicked', () => {
      const chainMock = {
        focus: jest.fn(() => ({
          toggleItalic: jest.fn(() => ({ run: jest.fn() })),
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const italicButton = screen.getByText('Italic')
      fireEvent.click(italicButton)

      expect(mockEditor.chain).toHaveBeenCalled()
      expect(chainMock.focus).toHaveBeenCalled()
    })

    it('should toggle inline code when code button clicked', () => {
      const chainMock = {
        focus: jest.fn(() => ({
          toggleCode: jest.fn(() => ({ run: jest.fn() })),
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const codeButton = screen.getByText('Code')
      fireEvent.click(codeButton)

      expect(mockEditor.chain).toHaveBeenCalled()
      expect(chainMock.focus).toHaveBeenCalled()
    })

    it('should toggle heading level 1 when H1 button clicked', () => {
      const toggleHeadingMock = jest.fn(() => ({ run: jest.fn() }))
      const chainMock = {
        focus: jest.fn(() => ({
          toggleHeading: toggleHeadingMock,
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const h1Button = screen.getByText('H1')
      fireEvent.click(h1Button)

      expect(toggleHeadingMock).toHaveBeenCalledWith({ level: 1 })
    })

    it('should toggle heading level 2 when H2 button clicked', () => {
      const toggleHeadingMock = jest.fn(() => ({ run: jest.fn() }))
      const chainMock = {
        focus: jest.fn(() => ({
          toggleHeading: toggleHeadingMock,
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const h2Button = screen.getByText('H2')
      fireEvent.click(h2Button)

      expect(toggleHeadingMock).toHaveBeenCalledWith({ level: 2 })
    })

    it('should toggle heading level 3 when H3 button clicked', () => {
      const toggleHeadingMock = jest.fn(() => ({ run: jest.fn() }))
      const chainMock = {
        focus: jest.fn(() => ({
          toggleHeading: toggleHeadingMock,
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const h3Button = screen.getByText('H3')
      fireEvent.click(h3Button)

      expect(toggleHeadingMock).toHaveBeenCalledWith({ level: 3 })
    })

    it('should toggle bullet list when bullet list button clicked', () => {
      const chainMock = {
        focus: jest.fn(() => ({
          toggleBulletList: jest.fn(() => ({ run: jest.fn() })),
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const bulletButton = screen.getByText('Bullet List')
      fireEvent.click(bulletButton)

      expect(mockEditor.chain).toHaveBeenCalled()
      expect(chainMock.focus).toHaveBeenCalled()
    })

    it('should toggle ordered list when ordered list button clicked', () => {
      const chainMock = {
        focus: jest.fn(() => ({
          toggleOrderedList: jest.fn(() => ({ run: jest.fn() })),
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const orderedButton = screen.getByText('Ordered List')
      fireEvent.click(orderedButton)

      expect(mockEditor.chain).toHaveBeenCalled()
      expect(chainMock.focus).toHaveBeenCalled()
    })

    it('should set link when link button clicked and URL provided', () => {
      const setLinkMock = jest.fn(() => ({ run: jest.fn() }))
      const chainMock = {
        focus: jest.fn(() => ({
          setLink: setLinkMock,
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)
      ;(global.prompt as jest.Mock).mockReturnValue('https://example.com')

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const linkButton = screen.getByText('Link')
      fireEvent.click(linkButton)

      expect(global.prompt).toHaveBeenCalledWith('Enter URL:')
      expect(setLinkMock).toHaveBeenCalledWith({ href: 'https://example.com' })
    })

    it('should not set link when link button clicked and URL cancelled', () => {
      const setLinkMock = jest.fn(() => ({ run: jest.fn() }))
      const chainMock = {
        focus: jest.fn(() => ({
          setLink: setLinkMock,
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)
      ;(global.prompt as jest.Mock).mockReturnValue(null)

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const linkButton = screen.getByText('Link')
      fireEvent.click(linkButton)

      expect(global.prompt).toHaveBeenCalledWith('Enter URL:')
      expect(setLinkMock).not.toHaveBeenCalled()
    })

    it('should toggle code block when code block button clicked', () => {
      const chainMock = {
        focus: jest.fn(() => ({
          toggleCodeBlock: jest.fn(() => ({ run: jest.fn() })),
        })),
      }
      mockEditor.chain.mockReturnValue(chainMock)

      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const codeBlockButton = screen.getByText('Code Block')
      fireEvent.click(codeBlockButton)

      expect(mockEditor.chain).toHaveBeenCalled()
      expect(chainMock.focus).toHaveBeenCalled()
    })
  })

  describe('Active State Highlighting', () => {
    it('should highlight bold button when bold is active', () => {
      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const boldButton = screen.getByText('Bold')
      expect(boldButton).toHaveClass('is-active')
    })

    it('should highlight H2 button when heading level 2 is active', () => {
      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const h2Button = screen.getByText('H2')
      expect(h2Button).toHaveClass('is-active')
    })

    it('should not highlight inactive buttons', () => {
      render(<EditorToolbar editor={mockEditor as unknown as Editor} />)

      const italicButton = screen.getByText('Italic')
      expect(italicButton).not.toHaveClass('is-active')
    })
  })
})

describe('LessonPreview Component', () => {
  const mockEditor = {
    getJSON: jest.fn(),
    chain: jest.fn(),
    isActive: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useEditor as jest.Mock).mockReturnValue(mockEditor)
  })

  describe('Preview Initialization', () => {
    it('should initialize editor with StarterKit extension', () => {
      const content = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Preview content' }],
          },
        ],
      }

      render(<LessonPreview content={content} />)

      expect(useEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          extensions: [StarterKit],
          content: content,
          editable: false,
        })
      )
    })

    it('should set editable to false for read-only mode', () => {
      const content = {
        type: 'doc',
        content: [],
      }

      render(<LessonPreview content={content} />)

      expect(useEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          editable: false,
        })
      )
    })

    it('should show loading state when editor is not ready', () => {
      ;(useEditor as jest.Mock).mockReturnValue(null)

      const content = {
        type: 'doc',
        content: [],
      }

      render(<LessonPreview content={content} />)

      expect(screen.getByText('Loading preview...')).toBeInTheDocument()
    })

    it('should render preview content when editor is ready', () => {
      const content = {
        type: 'doc',
        content: [],
      }

      render(<LessonPreview content={content} />)

      expect(screen.getByText('Preview (Student View)')).toBeInTheDocument()
      expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    })
  })

  describe('Preview Renders Same as Editor', () => {
    it('should use same extensions as editor', () => {
      const content = {
        type: 'doc',
        content: [],
      }

      render(<LessonPreview content={content} />)

      expect(useEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          extensions: [StarterKit],
        })
      )
    })

    it('should render provided content', () => {
      const content = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Test Heading' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Test paragraph' }],
          },
        ],
      }

      render(<LessonPreview content={content} />)

      expect(useEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          content: content,
        })
      )
    })

    it('should handle complex content with marks', () => {
      const content = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Bold and italic',
                marks: [{ type: 'bold' }, { type: 'italic' }],
              },
            ],
          },
        ],
      }

      render(<LessonPreview content={content} />)

      expect(useEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          content: content,
        })
      )
    })
  })
})
