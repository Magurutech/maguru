'use client'

import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

/**
 * LessonViewer Component
 * 
 * Display lesson content to students with Tiptap renderer.
 * Uses same Tiptap extensions as creator editor for WYSIWYG consistency.
 * 
 * Requirements: 5.3, 5.4, 5.5, 6.1, 6.4, 6.5
 * Task: 8.1
 * 
 * @param lesson - Lesson object with id, title, and LessonContent
 * @param onMarkComplete - Optional callback to mark lesson as complete
 * @param isCompleted - Whether the lesson is already completed
 */

interface LessonContent {
  content: JSONContent
  version: number
  lastEdit: string
}

interface LessonViewerProps {
  lesson: {
    id: string
    title: string
    content: LessonContent
  }
  onMarkComplete?: () => Promise<void>
  isCompleted: boolean
  completing?: boolean
}

export function LessonViewer({ lesson, onMarkComplete, isCompleted, completing = false }: LessonViewerProps) {
  const [error, setError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson.content.content,
    editable: false,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
      },
    },
    onCreate: ({ editor }) => {
      // Validate content structure on creation
      try {
        if (!editor.getJSON()) {
          setError('Failed to load lesson content. Please try refreshing the page.')
        }
      } catch (err) {
        console.error('Tiptap initialization error:', err)
        setError('Failed to load lesson content. Please try refreshing the page.')
      }
    },
  })

  if (error) {
    return (
      <div className="lesson-viewer-error" role="alert">
        <p className="error-message">{error}</p>
      </div>
    )
  }

  if (!editor) {
    return (
      <div className="lesson-viewer-loading" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true"></div>
        <span>Loading lesson...</span>
      </div>
    )
  }

  return (
    <div className="lesson-viewer">
      <h1 data-testid="lesson-title">{lesson.title}</h1>
      <EditorContent editor={editor} className="lesson-content" />
      <div className="lesson-meta" data-testid="lesson-metadata">
        <span>Version: {lesson.content.version}</span>
        <span>Last updated: {new Date(lesson.content.lastEdit).toLocaleDateString()}</span>
      </div>
      {!isCompleted && onMarkComplete && (
        <button 
          onClick={onMarkComplete}
          disabled={completing}
          className="mark-complete-btn"
          aria-label="Mark this lesson as complete"
          data-testid="mark-complete-btn"
        >
          {completing ? 'Menyimpan...' : 'Tandai Selesai'}
        </button>
      )}
      {isCompleted && (
        <div className="completed-badge" role="status" aria-label="Lesson completed" data-testid="completion-badge">
          ✓ Completed
        </div>
      )}
    </div>
  )
}
