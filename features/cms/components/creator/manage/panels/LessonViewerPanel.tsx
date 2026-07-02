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
import { Selection } from '@tiptap/extensions/selection'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { toast } from 'sonner'
import { useManageContext } from '../../../../Context/creator/ManageContext'

import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { Details, DetailsSummary, DetailsContent } from '@tiptap/extension-details'
import { Small } from '../editor/extensions/Small'
import { Columns, Column } from '../editor/extensions/Columns'

// Simple Editor node styles
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/components/tiptap-node/image-node/image-node.scss'
import '@/components/tiptap-node/table-node/table-node.scss'
import '@/components/tiptap-node/columns-node/columns-node.scss'
import '@/components/tiptap-node/details-node/details-node.scss'
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
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
      Small,
      Columns,
      Column,
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Details.configure({
        HTMLAttributes: {
          class: 'details-block',
        },
      }),
      DetailsSummary,
      DetailsContent,
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-coral" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-none select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-accent-coral uppercase tracking-widest block leading-none">
            MATERI PELAJARAN
          </span>
          <h1 className="font-sans text-2xl font-medium text-text-primary leading-tight tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {lessonData && (
            <div className="flex items-center gap-3 text-[10px] text-text-secondary border border-border/10 rounded-xl px-3 py-1.5 bg-bg-bone/80 font-mono font-bold uppercase">
              <div className="flex items-center gap-1">
                <span>Urutan:</span>
                <span className="text-text-primary">{lessonData.order}</span>
              </div>
              <div className="h-3 w-px bg-border/15" />
              <div className="flex items-center gap-1">
                <span>Versi:</span>
                <span className="text-text-primary">{lessonData.version}</span>
              </div>
            </div>
          )}
          {lesson && (
            <Button
              size="sm"
              variant="outline"
              className="border-border/10 rounded-full hover:bg-bg-surface-accent text-text-secondary hover:text-text-primary cursor-pointer px-4 font-bold text-xs"
              onClick={() => openEditLesson(lesson, sectionId)}
            >
              <Edit className="h-3.5 w-3.5 mr-1.5 text-accent-coral" />
              Edit Pelajaran
            </Button>
          )}
        </div>
      </div>

      <hr className="border-border/10 mb-6" />

      <div className="lesson-editor-body">
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content max-w-full [&_.simple-editor-content]:h-auto [&_.tiptap]:px-0 [&_.tiptap.ProseMirror.simple-editor]:pb-4 [&_.tiptap.ProseMirror.simple-editor]:pt-0 text-text-secondary leading-relaxed text-sm font-sans"
        />
      </div>
    </div>
  )
}
