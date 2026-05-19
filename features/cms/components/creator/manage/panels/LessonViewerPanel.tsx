'use client'

import { useState, useEffect } from 'react'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { Typography } from '@tiptap/extension-typography'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Selection } from '@tiptap/extensions'
import { toast } from 'sonner'
import { useManageContext } from '../../../../Context/creator/ManageContext'

// Simple Editor node styles
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-templates/simple/simple-editor.scss'

interface LessonViewerPanelProps {
  sectionId: string
  lessonId: string
}

export function LessonViewerPanel({ sectionId, lessonId }: LessonViewerPanelProps) {
  const { openEditLesson, lessonsMap } = useManageContext()
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState(() => {
    return lessonsMap[sectionId]?.find((l) => l.id === lessonId)?.title ?? ''
  })
  const [lessonData, setLessonData] = useState<{ version?: number; order?: number } | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'simple-editor',
        'aria-label': 'Konten pelajaran',
      },
    },
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
      Selection,
    ],
    content: { type: 'doc', content: [] },
    editable: false,
  })

  useEffect(() => {
    if (!editor) return

    fetch(`/api/courses/_/sections/${sectionId}/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title || '')
        setLessonData({
          version: data.content?.version || 1,
          order: data.order || 1,
        })
        if (data.content?.content) {
          editor.commands.setContent(data.content.content as JSONContent)
        }
      })
      .catch((e) => {
        console.error('[LessonViewerPanel] failed to load lesson', e)
        toast.error('Gagal memuat konten pelajaran')
      })
      .finally(() => setLoading(false))
  }, [lessonId, sectionId, editor])

  const lesson = lessonsMap[sectionId]?.find((l) => l.id === lessonId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-merah-500" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-none">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-beige-900 leading-tight">{title}</h1>
        <div className="flex items-center gap-3 shrink-0">
          {lessonData && (
            <div className="flex items-center gap-3 text-xs text-beige-600 border border-beige-200 rounded-lg px-3 py-1.5 bg-beige-50">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Order:</span>
                <span className="font-mono font-semibold text-beige-900">{lessonData.order}</span>
              </div>
              <div className="h-3 w-px bg-beige-300" />
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Version:</span>
                <span className="font-mono font-semibold text-beige-900">{lessonData.version}</span>
              </div>
            </div>
          )}
          {lesson && (
            <Button
              size="sm"
              variant="outline"
              className="border-beige-300 text-beige-700 hover:bg-beige-50"
              onClick={() => openEditLesson(lesson, sectionId)}
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit Pelajaran
            </Button>
          )}
        </div>
      </div>

      <hr className="border-beige-200 mb-6" />

      <div className="lesson-editor-body">
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content max-w-full [&_.simple-editor-content]:h-auto [&_.tiptap]:px-0 [&_.tiptap.ProseMirror.simple-editor]:pb-4 [&_.tiptap.ProseMirror.simple-editor]:pt-0"
        />
      </div>
    </div>
  )
}
