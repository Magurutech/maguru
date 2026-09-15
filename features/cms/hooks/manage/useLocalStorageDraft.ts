import { useEffect, useRef, useCallback, useState } from 'react'
import { Editor, JSONContent } from '@tiptap/react'
import { toast } from 'sonner'

interface LessonDraft {
  title: string
  content: JSONContent
  savedAt: string // ISO 8601
}

interface UseLocalStorageDraftProps {
  lessonId: string | undefined
  title: string
  editor: Editor | null
  isDirty: boolean
}

interface UseLocalStorageDraftReturn {
  clearDraft: () => void
  hasDraft: () => boolean
  getDraft: () => LessonDraft | null
  lastSavedAt: string | null
}

const DRAFT_KEY = (id: string) => `lesson-draft-${id}`
const DEBOUNCE_DELAY = 5000 // 5 seconds

export function useLocalStorageDraft({
  lessonId,
  title,
  editor,
  isDirty,
}: UseLocalStorageDraftProps): UseLocalStorageDraftReturn {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedContentRef = useRef<string>('')
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  // Get draft from localStorage
  const getDraft = useCallback((): LessonDraft | null => {
    if (!lessonId) return null

    try {
      const draftStr = localStorage.getItem(DRAFT_KEY(lessonId))
      if (!draftStr) return null

      const draft = JSON.parse(draftStr) as LessonDraft
      return draft
    } catch (error) {
      console.error('[useLocalStorageDraft] Failed to parse draft:', error)
      return null
    }
  }, [lessonId])

  // Check if draft exists
  const hasDraft = useCallback((): boolean => {
    return getDraft() !== null
  }, [getDraft])

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (!lessonId) return

    localStorage.removeItem(DRAFT_KEY(lessonId))
    lastSavedContentRef.current = ''
    setLastSavedAt(null)
  }, [lessonId])

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    if (!lessonId || !editor) return

    // Don't save empty/uninitialized drafts to localStorage
    const currentContent = editor.getJSON()
    const hasMeaningfulText = Boolean(title.trim()) || Boolean(currentContent.content && currentContent.content.length > 0)
    if (!hasMeaningfulText) return

    const currentContentStr = JSON.stringify({ title, content: currentContent })

    // Don't save if content hasn't changed since last save (requirement 4.12)
    if (currentContentStr === lastSavedContentRef.current) {
      return
    }

    const draft: LessonDraft = {
      title,
      content: currentContent,
      savedAt: new Date().toISOString(),
    }

    try {
      localStorage.setItem(DRAFT_KEY(lessonId), JSON.stringify(draft))
      lastSavedContentRef.current = currentContentStr
      setLastSavedAt(draft.savedAt)
    } catch (error) {
      console.error('[useLocalStorageDraft] Failed to save draft:', error)
    }
  }, [lessonId, title, editor])

  // Debounced auto-save with editor.on('update') tracking
  useEffect(() => {
    if (!editor || !lessonId) return

    // Handler untuk reset debounce timer setiap ada perubahan
    const handleEditorUpdate = () => {
      // Only proceed if isDirty (ada perubahan yang belum disave)
      if (!isDirty) return

      // Clear existing timer (RESET DEBOUNCE)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Start new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        saveDraft()
      }, DEBOUNCE_DELAY)
    }

    // Listen to editor update events
    editor.on('update', handleEditorUpdate)

    // Also trigger on title change
    handleEditorUpdate()

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      editor.off('update', handleEditorUpdate)
    }
  }, [editor, lessonId, isDirty, title, saveDraft])

  return {
    clearDraft,
    hasDraft,
    getDraft,
    lastSavedAt,
  }
}
