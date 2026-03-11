'use client'

import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { EditorToolbar } from './EditorToolbar'

/**
 * LessonEditor Component
 * 
 * Rich text editor for creating and editing lesson content using Tiptap.
 * Supports version tracking and metadata management.
 * 
 * Requirements: 4.1, 4.8, 4.9
 * Task: 7.1
 */

interface LessonContent {
  content: JSONContent
  version: number
  lastEdit: string
}

interface LessonEditorProps {
  initialContent?: JSONContent
  onSave: (content: LessonContent) => Promise<void>
  onCancel?: () => void
}

export function LessonEditor({ initialContent, onSave, onCancel }: LessonEditorProps) {
  const [version, setVersion] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: true,
  })

  const handleSave = async () => {
    if (!editor) return
    
    setIsSaving(true)
    try {
      const content: LessonContent = {
        content: editor.getJSON() as JSONContent,
        version: version + 1,
        lastEdit: new Date().toISOString()
      }
      
      await onSave(content)
      setVersion(v => v + 1)
    } finally {
      setIsSaving(false)
    }
  }

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="lesson-editor">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="editor-content" />
      <div className="editor-actions">
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Lesson'}
        </button>
        {onCancel && (
          <button onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
