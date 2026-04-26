'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Edit, Check, X, ArrowLeft, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEditor, EditorContent, JSONContent, Extension, EditorContext } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { Typography } from '@tiptap/extension-typography'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Selection } from '@tiptap/extensions'
import { toast } from 'sonner'
import { EditorToolbar } from '@/features/cms/components/creator/EditorToolbar'
import { useManageContext } from '../../../context/creator/ManageContext'

// Simple Editor node styles — same as simple-editor.tsx
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-templates/simple/simple-editor.scss'

// ── Inline description editor ──────────────────────────────────────────────

function DescriptionEditor({
  courseSlug, initialText, onSave, onCancel,
}: { courseSlug: string; initialText: string; onSave: (t: string) => void; onCancel: () => void }) {
  const [saving, setSaving] = useState(false)
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialText ? `<p>${initialText}</p>` : '<p></p>',
    editable: true,
    immediatelyRender: false,
  })

  const handleSave = useCallback(async () => {
    if (!editor) return
    setSaving(true)
    try {
      const text = editor.getText()
      const res = await fetch(`/api/courses/${courseSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text }),
      })
      if (!res.ok) throw new Error()
      onSave(text)
      toast.success('Deskripsi berhasil disimpan')
    } catch {
      toast.error('Gagal menyimpan deskripsi')
    } finally {
      setSaving(false)
    }
  }, [editor, courseSlug, onSave])

  return (
    <div className="mt-4">
      <div className="min-h-30 rounded-lg border border-merah-300 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-merah-200 transition-all">
        <EditorContent editor={editor} />
      </div>
      <div className="flex gap-2 mt-2">
        <Button size="sm" onClick={handleSave} disabled={saving} className="bg-merah-500 hover:bg-merah-600 text-white">
          <Check className="h-3.5 w-3.5 mr-1" />{saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} disabled={saving} className="text-beige-600">
          <X className="h-3.5 w-3.5 mr-1" />Batal
        </Button>
      </div>
    </div>
  )
}

// ── Lesson Viewer Panel (read-only, full Tiptap render) ───────────────────

function LessonViewerPanel({ sectionId, lessonId }: { sectionId: string; lessonId: string }) {
  const { openEditLesson, lessonsMap } = useManageContext()
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState(() => {
    // Initialize from cache synchronously to avoid setState-in-effect
    return lessonsMap[sectionId]?.find((l) => l.id === lessonId)?.title ?? ''
  })

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'simple-editor',
        'aria-label': 'Konten pelajaran',
      },
    },
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
    content: { type: 'doc', content: [] },
    editable: false,
  })

  useEffect(() => {
    if (!editor) return

    fetch(`/api/courses/_/sections/${sectionId}/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title || '')
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
        {lesson && (
          <Button size="sm" variant="outline" className="border-beige-300 text-beige-700 hover:bg-beige-50 shrink-0"
            onClick={() => openEditLesson(lesson, sectionId)}>
            <Edit className="h-3.5 w-3.5 mr-1.5" />Edit Pelajaran
          </Button>
        )}
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
// ── Editor extensions (module-level) ──────────────────────────────────────

const HeadingShortcuts = Extension.create({
  name: 'headingShortcuts',
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-1': () => this.editor.commands.toggleHeading({ level: 1 }),
      'Mod-Shift-2': () => this.editor.commands.toggleHeading({ level: 2 }),
      'Mod-Shift-3': () => this.editor.commands.toggleHeading({ level: 3 }),
    }
  },
})

// ── Lesson Editor Panel (Confluence-style) ─────────────────────────────────

function LessonEditorPanel({ sectionId, lessonId }: { sectionId: string; lessonId?: string }) {
  const { setActiveView, submitLessonFromPanel, lessonsMap } = useManageContext()
  const isEditMode = !!lessonId
  const [title, setTitle] = useState(() => {
    // Initialize from cache if available (edit mode)
    if (lessonId) {
      const cached = lessonsMap[sectionId]?.find((l) => l.id === lessonId)
      if (cached) return cached.title
    }
    return ''
  })
  const [saving, setSaving] = useState(false)
  const [loadingLesson, setLoadingLesson] = useState(!!lessonId) // always load in edit mode

  // Ref bridge so SaveShortcut extension always calls latest handleSave
  const saveRef = useRef<() => void>(() => {})

  // Extension instance stored in state (initialized once, never changes)
  const [saveShortcutExtension] = useState(() =>
    Extension.create({
      name: 'saveShortcut',
      addKeyboardShortcuts() {
        return {
          'Mod-Enter': () => {
            saveRef.current()
            return true
          },
        }
      },
    })
  )

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Tulis konten pelajaran di sini.',
        class: 'simple-editor',
      },
    },
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, enableClickSelection: true },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
      Selection,
      HeadingShortcuts,
      saveShortcutExtension,
    ],
    content: { type: 'doc', content: [] },
  })

  useEffect(() => {
    if (!isEditMode || !lessonId || !editor) return

    // Always fetch full content — cache only has contentPreview, not Tiptap JSON
    fetch(`/api/courses/_/sections/${sectionId}/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title || '')
        if (data.content?.content) {
          editor.commands.setContent(data.content.content as JSONContent)
        } else {
          console.warn('[LessonEditorPanel] no content.content found', data.content)
        }
      })
      .catch((e) => {
        console.error('[LessonEditorPanel] fetch failed', e)
        toast.error('Gagal memuat pelajaran')
      })
      .finally(() => setLoadingLesson(false))
  }, [isEditMode, lessonId, sectionId, editor])

  const handleSave = useCallback(async () => {
    if (!title.trim()) { toast.error('Judul pelajaran tidak boleh kosong'); return }
    if (!editor) return
    setSaving(true)
    const content = { content: editor.getJSON() as JSONContent, version: 1, lastEdit: new Date().toISOString() }
    const resultId = await submitLessonFromPanel(sectionId, { title: title.trim(), content }, lessonId)
    setSaving(false)
    if (resultId) setActiveView({ type: 'lesson', sectionId, lessonId: resultId })
  }, [title, editor, sectionId, lessonId, submitLessonFromPanel, setActiveView])

  // Keep saveRef in sync so Tiptap SaveShortcut extension always calls latest version
  useEffect(() => { saveRef.current = handleSave }, [handleSave])

  const handleCancel = () => {
    setActiveView(lessonId ? { type: 'lesson', sectionId, lessonId } : { type: 'section', sectionId })
  }

  if (loadingLesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-merah-500" />
      </div>
    )
  }

  return (
    <EditorContext.Provider value={{ editor }}>
    <div className="w-full max-w-none">
      {/* Header bar: Kembali | Toolbar | Batal + Simpan */}
      <div className="sticky top-0 z-10 bg-beige-50 border-b border-beige-200 mb-6 pb-2 pt-1">
        <div className="flex items-center gap-3">
          <button onClick={handleCancel} className="flex items-center gap-1.5 text-sm text-beige-500 hover:text-beige-800 transition-colors shrink-0">
            <ArrowLeft className="h-4 w-4" />Kembali
          </button>
          <div className="flex-1 min-w-0">
            <EditorToolbar />
          </div>
          <div className="flex items-center shrink-0">
            {/* Split button: Create/Save | ∨ Cancel */}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || !title.trim()}
              data-testid="lesson-save-btn"
              className="bg-merah-500 hover:bg-merah-600 text-white rounded-r-none border-r border-merah-400"
            >
              {saving ? 'Menyimpan...' : isEditMode ? 'Save' : 'Create'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  disabled={saving}
                  className="bg-merah-500 hover:bg-merah-600 text-white rounded-l-none px-2"
                  aria-label="Opsi lainnya"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={handleCancel} className="text-beige-700">
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && editor?.commands.focus()}
        placeholder="Judul pelajaran..."
        className="w-full text-3xl font-bold text-beige-900 bg-transparent border-none outline-none placeholder:text-beige-300 mb-2"
        maxLength={200}
        autoFocus={!isEditMode}
        data-testid="lesson-title-input"
      />

      <hr className="border-beige-200 mb-4" />

    <div className="min-h-100 cursor-text max-w-full lesson-editor-body" onClick={() => editor?.commands.focus()}>
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content max-w-full [&_.tiptap]:min-h-[200px] [&_.tiptap]:px-0 [&_.tiptap.ProseMirror.simple-editor]:pb-8"
        />
      </div>
    </div>
    </EditorContext.Provider>
  )
}

// ── Overview panel ─────────────────────────────────────────────────────────

function CourseOverview() {
  const { course, setCourse, sections, lessonsMap } = useManageContext()
  const [editingDesc, setEditingDesc] = useState(false)
  if (!course) return null

  const isPublished = course.status === 'PUBLISHED'
  const totalLessons = sections.reduce((sum, s) => sum + (lessonsMap[s.id]?.length ?? s.lessonCount), 0)
  const difficultyLabel: Record<string, string> = { BEGINNER: 'Pemula', INTERMEDIATE: 'Menengah', ADVANCED: 'Mahir' }

  return (
    <div className="max-w-full" data-testid="course-overview-panel">
      <h1 className="text-3xl font-bold text-beige-900 leading-tight mb-3">{course.title}</h1>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {course.category && (
          <Badge variant="outline" className="bg-beige-100 text-beige-700 border-beige-300 text-xs font-normal">{course.category}</Badge>
        )}
        {course.difficulty && (
          <Badge variant="outline" className="bg-beige-100 text-beige-700 border-beige-300 text-xs font-normal">
            {difficultyLabel[course.difficulty] ?? course.difficulty}
          </Badge>
        )}
        <Badge variant="outline" className={isPublished
          ? 'bg-hijau-50 text-hijau-700 border-hijau-200 text-xs font-normal'
          : 'bg-kuning-50 text-kuning-700 border-kuning-200 text-xs font-normal'}>
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
        <span className="text-xs text-beige-400 ml-1">{sections.length} seksi &middot; {totalLessons} pelajaran</span>
      </div>
      <hr className="border-beige-200 mb-6" />
      <div className="group">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-beige-600">Deskripsi</span>
          {!editingDesc && (
            <button onClick={() => setEditingDesc(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-beige-100 text-beige-400 hover:text-beige-700">
              <Edit className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {editingDesc ? (
          <DescriptionEditor
            courseSlug={course.slug}
            initialText={course.description ?? ''}
            onSave={(text) => { setCourse((prev) => prev ? { ...prev, description: text } : prev); setEditingDesc(false) }}
            onCancel={() => setEditingDesc(false)}
          />
        ) : (
          <p className="text-beige-700 text-base leading-relaxed cursor-text hover:bg-beige-100/50 rounded-lg px-2 py-1 -mx-2 transition-colors"
            onClick={() => setEditingDesc(true)}>
            {course.description || <span className="text-beige-400 italic">Tambahkan deskripsi kursus...</span>}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────

export function ManageContent() {
  const { course, sections, activeView } = useManageContext()
  if (!course) return null

  if (activeView.type === 'overview') return <CourseOverview />

  if (activeView.type === 'lesson-editor') {
    return <LessonEditorPanel sectionId={activeView.sectionId} lessonId={activeView.lessonId} />
  }

  if (activeView.type === 'section') {
    const section = sections.find((s) => s.id === activeView.sectionId)
    if (!section) return null
    return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-beige-900 mb-2">{section.title}</h2>
        {section.description && <p className="text-beige-600 mb-6">{section.description}</p>}
        <p className="text-sm text-beige-500">{section.lessonCount} pelajaran dalam seksi ini.</p>
      </div>
    )
  }

  if (activeView.type === 'lesson') {
    return <LessonViewerPanel sectionId={activeView.sectionId} lessonId={activeView.lessonId} />
  }

  return null
}
