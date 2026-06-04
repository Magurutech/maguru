/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { JSONContent, Editor } from '@tiptap/react'

// Mock EditorToolbar to avoid ES module issues
jest.mock('@/features/cms/components/creator/EditorToolbar', () => ({
  EditorToolbar: () => <div data-testid="editor-toolbar">Toolbar</div>,
}))

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}))

// Import after mocks
import { useLocalStorageDraft } from '@/features/cms/hooks/manage/useLocalStorageDraft'
import { toast } from 'sonner'

// Mock Editor for testing hook
const createMockEditor = (
  content: JSONContent = { type: 'doc', content: [] },
): Partial<Editor> => ({
  getJSON: jest.fn(() => content),
  commands: {
    setContent: jest.fn(),
  } as Partial<Editor['commands']>,
  on: jest.fn(),
  off: jest.fn(),
})

describe('Feature 4: localStorage Auto-Draft Integration Tests', () => {
  const DRAFT_KEY = 'lesson-draft-lesson-123'
  const DEBOUNCE_DELAY = 5000 // 5 seconds

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear()

    // Clear all mocks
    jest.clearAllMocks()
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    localStorage.clear()
  })

  describe('Auto-save Draft', () => {
    it('should auto-save draft to localStorage after 5 seconds of inactivity', async () => {
      const mockEditor = createMockEditor() as Editor
      const TestComponent = () => {
        useLocalStorageDraft({
          lessonId: 'lesson-123',
          title: 'Modified Title',
          editor: mockEditor,
          isDirty: true,
        })

        return <div>Test</div>
      }

      render(<TestComponent />)

      // Verify no draft saved yet (before debounce)
      expect(localStorage.getItem(DRAFT_KEY)).toBeNull()

      // Fast-forward time by 5 seconds
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY)
      })

      // Wait for auto-save to complete
      await waitFor(
        () => {
          const draft = localStorage.getItem(DRAFT_KEY)
          expect(draft).not.toBeNull()

          const parsed = JSON.parse(draft!)
          expect(parsed.title).toBe('Modified Title')
          expect(parsed.savedAt).toBeTruthy()

          // Verify toast was called
          expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Draft tersimpan'))
        },
        { timeout: 1000 },
      )
    })

    it('should NOT auto-save if isDirty is false', async () => {
      const mockEditor = createMockEditor() as Editor
      const TestComponent = () => {
        useLocalStorageDraft({
          lessonId: 'lesson-123',
          title: 'Title',
          editor: mockEditor,
          isDirty: false, // Not dirty
        })

        return <div>Test</div>
      }

      render(<TestComponent />)

      // Fast-forward time by 5 seconds
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY)
      })

      // Verify no draft saved
      expect(localStorage.getItem(DRAFT_KEY)).toBeNull()
    })

    it('should NOT auto-save if lessonId is undefined', async () => {
      const mockEditor = createMockEditor() as Editor
      const TestComponent = () => {
        useLocalStorageDraft({
          lessonId: undefined, // No lesson ID
          title: 'Title',
          editor: mockEditor,
          isDirty: true,
        })

        return <div>Test</div>
      }

      render(<TestComponent />)

      // Fast-forward time by 5 seconds
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY)
      })

      // Verify no draft saved
      expect(localStorage.getItem(DRAFT_KEY)).toBeNull()
    })

    it('should display toast notification after auto-save', async () => {
      const mockEditor = createMockEditor() as Editor
      const TestComponent = () => {
        useLocalStorageDraft({
          lessonId: 'lesson-123',
          title: 'Modified Title',
          editor: mockEditor,
          isDirty: true,
        })

        return <div>Test</div>
      }

      render(<TestComponent />)

      // Clear previous toast calls
      jest.clearAllMocks()

      // Trigger auto-save
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY)
      })

      // Toast should be called
      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            expect.stringContaining('💾 Draft tersimpan pada'),
          )
        },
        { timeout: 1000 },
      )
    })
  })

  describe('Get and Check Draft', () => {
    it('getDraft() should return draft from localStorage', () => {
      const mockDraft = {
        title: 'Draft Title',
        content: { type: 'doc', content: [] } as JSONContent,
        savedAt: '2026-01-01T10:00:00.000Z',
      }

      localStorage.setItem(DRAFT_KEY, JSON.stringify(mockDraft))

      const mockEditor = createMockEditor() as Editor
      let getDraftResult: ReturnType<typeof useLocalStorageDraft>['getDraft'] | null = null

      const TestComponent = () => {
        const hook = useLocalStorageDraft({
          lessonId: 'lesson-123',
          title: 'Title',
          editor: mockEditor,
          isDirty: false,
        })

        // Call getDraft in useEffect to avoid calling during render
        React.useEffect(() => {
          getDraftResult = hook.getDraft
        }, [hook.getDraft])

        return <div>Test</div>
      }

      render(<TestComponent />)

      expect(getDraftResult).toBeTruthy()
      expect(getDraftResult!()).toEqual(mockDraft)
    })

    it('hasDraft() should return true if draft exists', () => {
      const mockDraft = {
        title: 'Draft Title',
        content: { type: 'doc', content: [] } as JSONContent,
        savedAt: '2026-01-01T10:00:00.000Z',
      }

      localStorage.setItem(DRAFT_KEY, JSON.stringify(mockDraft))

      const mockEditor = createMockEditor() as Editor
      let hasDraftResult: ReturnType<typeof useLocalStorageDraft>['hasDraft'] | null = null

      const TestComponent = () => {
        const hook = useLocalStorageDraft({
          lessonId: 'lesson-123',
          title: 'Title',
          editor: mockEditor,
          isDirty: false,
        })

        // Call hasDraft in useEffect to avoid calling during render
        React.useEffect(() => {
          hasDraftResult = hook.hasDraft
        }, [hook.hasDraft])

        return <div>Test</div>
      }

      render(<TestComponent />)

      expect(hasDraftResult).toBeTruthy()
      expect(hasDraftResult!()).toBe(true)
    })

    it('hasDraft() should return false if no draft exists', () => {
      const mockEditor = createMockEditor() as Editor
      let hasDraftResult: ReturnType<typeof useLocalStorageDraft>['hasDraft'] | null = null

      const TestComponent = () => {
        const hook = useLocalStorageDraft({
          lessonId: 'lesson-123',
          title: 'Title',
          editor: mockEditor,
          isDirty: false,
        })

        // Call hasDraft in useEffect to avoid calling during render
        React.useEffect(() => {
          hasDraftResult = hook.hasDraft
        }, [hook.hasDraft])

        return <div>Test</div>
      }

      render(<TestComponent />)

      expect(hasDraftResult).toBeTruthy()
      expect(hasDraftResult!()).toBe(false)
    })
  })

  describe('Clear Draft', () => {
    it('clearDraft() should remove draft from localStorage', () => {
      const mockDraft = {
        title: 'Draft Title',
        content: { type: 'doc', content: [] } as JSONContent,
        savedAt: '2026-01-01T10:00:00.000Z',
      }

      localStorage.setItem(DRAFT_KEY, JSON.stringify(mockDraft))
      expect(localStorage.getItem(DRAFT_KEY)).not.toBeNull()

      const mockEditor = createMockEditor() as Editor

      const TestComponent = () => {
        const { clearDraft } = useLocalStorageDraft({
          lessonId: 'lesson-123',
          title: 'Title',
          editor: mockEditor,
          isDirty: false,
        })

        return (
          <button data-testid="clear-btn" onClick={clearDraft}>
            Clear
          </button>
        )
      }

      render(<TestComponent />)

      const clearBtn = screen.getByTestId('clear-btn')
      act(() => {
        clearBtn.click()
      })

      expect(localStorage.getItem(DRAFT_KEY)).toBeNull()
    })

    it('clearDraft() should reset state', async () => {
      const mockEditor = createMockEditor() as Editor

      const TestComponent = () => {
        const { clearDraft } = useLocalStorageDraft({
          lessonId: 'lesson-123',
          title: 'Modified Title',
          editor: mockEditor,
          isDirty: true,
        })

        return (
          <button data-testid="clear-btn" onClick={clearDraft}>
            Clear
          </button>
        )
      }

      render(<TestComponent />)

      // Trigger auto-save
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY)
      })

      // Wait for save
      await waitFor(() => {
        expect(localStorage.getItem(DRAFT_KEY)).not.toBeNull()
      })

      // Clear draft
      const clearBtn = screen.getByTestId('clear-btn')
      act(() => {
        clearBtn.click()
      })

      // Draft should be cleared
      expect(localStorage.getItem(DRAFT_KEY)).toBeNull()
    })
  })

  describe('Draft Not Saved if Content Unchanged', () => {
    it('should NOT save draft if content has not changed since last auto-save', async () => {
      const mockEditor = createMockEditor({
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Same content' }] }],
      }) as Editor

      const TestComponent = () => {
        useLocalStorageDraft({
          lessonId: 'lesson-123',
          title: 'Same Title',
          editor: mockEditor,
          isDirty: true,
        })

        return <div>Test</div>
      }

      const { rerender } = render(<TestComponent />)

      // First auto-save
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY)
      })

      await waitFor(() => {
        expect(localStorage.getItem(DRAFT_KEY)).not.toBeNull()
      })

      const firstDraft = localStorage.getItem(DRAFT_KEY)!
      const firstSavedAt = JSON.parse(firstDraft).savedAt

      // Rerender without changing content
      rerender(<TestComponent />)

      // Trigger another save cycle
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY)
      })

      // Wait a bit
      await act(async () => {
        jest.advanceTimersByTime(1000)
      })

      // Verify draft was NOT updated (savedAt should be the same)
      const secondDraft = localStorage.getItem(DRAFT_KEY)!
      const secondSavedAt = JSON.parse(secondDraft).savedAt

      expect(secondSavedAt).toBe(firstSavedAt)
    })
  })
})
