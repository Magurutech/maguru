import { useEffect, useState, useCallback, useRef } from 'react'
import { Editor, JSONContent } from '@tiptap/react'

interface UseUnsavedChangesProps {
  editor: Editor | null
  title: string
  initialTitle: string
  initialContent: JSONContent | null
  enabled?: boolean // Skip dirty check when false (e.g., during loading)
}

export function useUnsavedChanges({
  editor,
  title,
  initialTitle,
  initialContent,
  enabled = true, // Default to enabled
}: UseUnsavedChangesProps) {
  const [isDirty, setIsDirty] = useState(false)
  const savedTitleRef = useRef(initialTitle)
  const savedContentRef = useRef(initialContent)

  // Update saved title ref when initial title changes
  // Note: We don't update savedContentRef here because editor.getJSON() is the source of truth
  // Content sync is handled manually via updateSavedContent() after editor.setContent()
  useEffect(() => {
    savedTitleRef.current = initialTitle
  }, [initialTitle])

  // Helper to manually update saved content ref (for immediate sync after editor.setContent)
  const updateSavedContent = useCallback((content: JSONContent) => {
    savedContentRef.current = content
  }, [])

  // Check if content or title has changed
  const checkDirty = useCallback(() => {
    // Skip check if disabled
    if (!enabled) {
      return false
    }

    // Check title first
    if (title !== savedTitleRef.current) {
      return true
    }

    // Check content if editor exists
    if (editor) {
      const currentContent = editor.getJSON()
      const savedContent = savedContentRef.current || { type: 'doc', content: [] }

      const currentContentStr = JSON.stringify(currentContent)
      const savedContentStr = JSON.stringify(savedContent)

      const contentChanged = currentContentStr !== savedContentStr

      return contentChanged
    }

    return false
  }, [editor, title, enabled])

  // Listen to editor content updates
  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      const dirty = checkDirty()

      setIsDirty(dirty)
    }

    editor.on('update', handleUpdate)
    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor, checkDirty, isDirty, enabled])

  // Check dirty state when title changes
  useEffect(() => {
    const dirty = checkDirty()

    if (dirty !== isDirty) {
      setIsDirty(dirty)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, checkDirty]) // isDirty intentionally excluded to prevent infinite loop

  // Attach beforeunload listener for browser warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = '' // Required for Chrome
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])

  // Reset dirty state and update saved values
  const resetDirty = useCallback(() => {
    if (editor) {
      savedContentRef.current = editor.getJSON()
    }
    savedTitleRef.current = title
    setIsDirty(false)
  }, [editor, title])

  return { isDirty, resetDirty, updateSavedContent }
}
