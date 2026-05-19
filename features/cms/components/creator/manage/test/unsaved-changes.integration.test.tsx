/**
 * Integration Test: Unsaved Changes Warning
 *
 * Tests integration between:
 * - useUnsavedChanges hook
 * - Editor state management
 * - isDirty logic with real editor instance
 *
 * Focus: Hook + Editor integration, NOT full UI rendering
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useUnsavedChanges } from '@/features/cms/hooks/manage/useUnsavedChanges'
import type { Editor, JSONContent } from '@tiptap/react'

describe('Unsaved Changes Warning - Integration', () => {
  // Mock editor instance
  let mockEditor: Partial<Editor>
  let mockContent: JSONContent

  beforeEach(() => {
    mockContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Initial content' }],
        },
      ],
    }

    mockEditor = {
      getJSON: jest.fn(() => mockContent),
      on: jest.fn((event, callback) => {
        // Store callback for manual triggering
        if (event === 'update') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(mockEditor as any).updateCallback = callback
        }
        return mockEditor as Editor
      }),
      off: jest.fn(),
      commands: {
        setContent: jest.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('isDirty State Integration', () => {
    it('should set isDirty=true when title changes', async () => {
      const initialTitle = 'Original Title'
      const { result, rerender } = renderHook(
        ({ title }) =>
          useUnsavedChanges({
            editor: mockEditor as Editor,
            title,
            initialTitle,
            initialContent: mockContent,
            enabled: true,
          }),
        {
          initialProps: { title: initialTitle },
        },
      )

      // Initially not dirty
      expect(result.current.isDirty).toBe(false)

      // Change title
      rerender({ title: 'Modified Title' })

      // Should be dirty
      await waitFor(() => {
        expect(result.current.isDirty).toBe(true)
      })
    })

    it('should set isDirty=true when editor content changes', async () => {
      const initialTitle = 'Test Title'
      const { result } = renderHook(() =>
        useUnsavedChanges({
          editor: mockEditor as Editor,
          title: initialTitle,
          initialTitle,
          initialContent: mockContent,
          enabled: true,
        }),
      )

      // Initially not dirty
      expect(result.current.isDirty).toBe(false)

      // Simulate editor content change
      act(() => {
        mockContent = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Modified content' }],
            },
          ],
        }
        // Trigger update callback
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((mockEditor as any).updateCallback) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(mockEditor as any).updateCallback()
        }
      })

      // Should be dirty
      await waitFor(() => {
        expect(result.current.isDirty).toBe(true)
      })
    })

    it('should set isDirty=false after resetDirty called', async () => {
      const initialTitle = 'Test Title'
      const { result, rerender } = renderHook(
        ({ title }) =>
          useUnsavedChanges({
            editor: mockEditor as Editor,
            title,
            initialTitle,
            initialContent: mockContent,
            enabled: true,
          }),
        {
          initialProps: { title: initialTitle },
        },
      )

      // Change title to make it dirty
      rerender({ title: 'Modified Title' })

      await waitFor(() => {
        expect(result.current.isDirty).toBe(true)
      })

      // Reset dirty
      act(() => {
        result.current.resetDirty()
      })

      // Should not be dirty
      expect(result.current.isDirty).toBe(false)
    })

    it('should set isDirty=false when changes are reverted', async () => {
      const initialTitle = 'Test Title'
      const { result, rerender } = renderHook(
        ({ title }) =>
          useUnsavedChanges({
            editor: mockEditor as Editor,
            title,
            initialTitle,
            initialContent: mockContent,
            enabled: true,
          }),
        {
          initialProps: { title: initialTitle },
        },
      )

      // Change title
      rerender({ title: 'Modified Title' })

      await waitFor(() => {
        expect(result.current.isDirty).toBe(true)
      })

      // Revert title back
      rerender({ title: initialTitle })

      // Should not be dirty (reverted to initial)
      await waitFor(() => {
        expect(result.current.isDirty).toBe(false)
      })
    })
  })

  describe('Race Condition Prevention', () => {
    it('should NOT set isDirty=true on initial load when enabled=false', async () => {
      const initialTitle = 'Test Title'
      const { result } = renderHook(() =>
        useUnsavedChanges({
          editor: mockEditor as Editor,
          title: initialTitle,
          initialTitle,
          initialContent: mockContent,
          enabled: false, // Disabled during loading
        }),
      )

      // Should not be dirty even if there are differences
      expect(result.current.isDirty).toBe(false)
    })

    it('should skip dirty check during loading state', async () => {
      const initialTitle = 'Test Title'
      const { result, rerender } = renderHook(
        ({ enabled }) =>
          useUnsavedChanges({
            editor: mockEditor as Editor,
            title: 'Different Title', // Different from initial
            initialTitle,
            initialContent: mockContent,
            enabled,
          }),
        {
          initialProps: { enabled: false }, // Loading
        },
      )

      // Should not be dirty during loading
      expect(result.current.isDirty).toBe(false)

      // Enable after loading
      rerender({ enabled: true })

      // Now should detect dirty state
      await waitFor(() => {
        expect(result.current.isDirty).toBe(true)
      })
    })

    it('should handle cached title vs empty initialTitle correctly', async () => {
      const cachedTitle = 'Cached Title'
      const { result } = renderHook(() =>
        useUnsavedChanges({
          editor: mockEditor as Editor,
          title: cachedTitle,
          initialTitle: cachedTitle, // Same as title (from cache)
          initialContent: null, // Will be loaded
          enabled: false, // During loading
        }),
      )

      // Should not be dirty (title matches initialTitle from cache)
      expect(result.current.isDirty).toBe(false)
    })
  })

  describe('Save Button Logic Integration', () => {
    it('should enable save when isDirty=true in edit mode', async () => {
      const initialTitle = 'Test Title'
      const { result, rerender } = renderHook(
        ({ title }) =>
          useUnsavedChanges({
            editor: mockEditor as Editor,
            title,
            initialTitle,
            initialContent: mockContent,
            enabled: true,
          }),
        {
          initialProps: { title: initialTitle },
        },
      )

      // Initially not dirty → save should be disabled
      expect(result.current.isDirty).toBe(false)

      // Change title → save should be enabled
      rerender({ title: 'Modified Title' })

      await waitFor(() => {
        expect(result.current.isDirty).toBe(true)
      })
    })

    it('should disable save when isDirty=false in edit mode', async () => {
      const initialTitle = 'Test Title'
      const { result } = renderHook(() =>
        useUnsavedChanges({
          editor: mockEditor as Editor,
          title: initialTitle,
          initialTitle,
          initialContent: mockContent,
          enabled: true,
        }),
      )

      // No changes → save should be disabled
      expect(result.current.isDirty).toBe(false)
    })
  })

  describe('Editor Lifecycle Integration', () => {
    it('should attach editor update listener on mount', () => {
      const initialTitle = 'Test Title'
      renderHook(() =>
        useUnsavedChanges({
          editor: mockEditor as Editor,
          title: initialTitle,
          initialTitle,
          initialContent: mockContent,
          enabled: true,
        }),
      )

      // Verify editor.on was called with 'update'
      expect(mockEditor.on).toHaveBeenCalledWith('update', expect.any(Function))
    })

    it('should detach editor update listener on unmount', () => {
      const initialTitle = 'Test Title'
      const { unmount } = renderHook(() =>
        useUnsavedChanges({
          editor: mockEditor as Editor,
          title: initialTitle,
          initialTitle,
          initialContent: mockContent,
          enabled: true,
        }),
      )

      unmount()

      // Verify editor.off was called
      expect(mockEditor.off).toHaveBeenCalledWith('update', expect.any(Function))
    })

    it('should handle null editor gracefully', () => {
      const initialTitle = 'Test Title'
      const { result } = renderHook(() =>
        useUnsavedChanges({
          editor: null,
          title: initialTitle,
          initialTitle,
          initialContent: mockContent,
          enabled: true,
        }),
      )

      // Should not crash, isDirty based on title only
      expect(result.current.isDirty).toBe(false)
    })
  })

  describe('updateSavedContent Integration', () => {
    it('should provide updateSavedContent function', () => {
      const initialTitle = 'Test Title'
      const { result } = renderHook(() =>
        useUnsavedChanges({
          editor: mockEditor as Editor,
          title: initialTitle,
          initialTitle,
          initialContent: mockContent,
          enabled: true,
        }),
      )

      // Verify updateSavedContent function is available
      expect(result.current.updateSavedContent).toBeDefined()
      expect(typeof result.current.updateSavedContent).toBe('function')

      // Call it without error
      const newContent: JSONContent = {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'New' }] }],
      }

      expect(() => {
        result.current.updateSavedContent(newContent)
      }).not.toThrow()
    })
  })
})
