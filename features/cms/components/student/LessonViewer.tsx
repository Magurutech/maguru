'use client'

import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { Typography } from '@tiptap/extension-typography'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Selection } from '@tiptap/extensions'
import { useState } from 'react'

// Import Tiptap node styles for proper rendering (same as creator)
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-templates/simple/simple-editor.scss'

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
}

export function LessonViewer({ lesson }: LessonViewerProps) {
  const [error, setError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
      Selection,
    ],
    content: lesson.content.content,
    editable: false,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: 'simple-editor',
        'aria-label': 'Konten pelajaran',
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
    <div className="lesson-viewer w-full max-w-none text-beige-900 dark:text-beige-900 p-6 rounded-lg
      [&_.simple-editor-content]:h-auto [&_.simple-editor-content]:flex-none [&_.simple-editor-content]:max-w-none
      [&_.tiptap.ProseMirror.simple-editor]:pb-4 [&_.tiptap.ProseMirror.simple-editor]:pt-0">
      <h1 data-testid="lesson-title" className="text-3xl font-bold text-beige-900 mb-6">{lesson.title}</h1>
      <EditorContent 
        editor={editor} 
        className="simple-editor-content max-w-none! w-full [&_.tiptap]:px-0 [&_.tiptap]:max-w-none! [&_.tiptap]:w-full"
        role="presentation"
      />
    </div>
  )
}
