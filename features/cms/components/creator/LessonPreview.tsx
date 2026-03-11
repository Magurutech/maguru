'use client'

import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

/**
 * LessonPreview Component
 * 
 * Read-only preview of lesson content (student view simulation).
 * Uses same Tiptap extensions as editor for WYSIWYG consistency.
 * 
 * Requirements: 4.7, 4.9
 * Task: 7.3
 */

interface LessonPreviewProps {
  content: JSONContent
}

export function LessonPreview({ content }: LessonPreviewProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,  // Read-only mode
  })

  if (!editor) {
    return <div>Loading preview...</div>
  }

  return (
    <div className="lesson-preview">
      <h3>Preview (Student View)</h3>
      <EditorContent editor={editor} className="preview-content" />
    </div>
  )
}
