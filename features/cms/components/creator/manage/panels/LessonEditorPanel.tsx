'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import Image from '@tiptap/extension-image'
import { toast } from 'sonner'
import { EditorToolbar } from '@/features/cms/components/creator/EditorToolbar'
import { useManageContext } from '../../../../Context/creator/ManageContext'
import { useUnsavedChanges } from '@/features/cms/hooks/manage/useUnsavedChanges'
import { useLocalStorageDraft } from '@/features/cms/hooks/manage/useLocalStorageDraft'

// Simple Editor node styles
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-templates/simple/simple-editor.scss'

// ── Editor extensions (module-level, created once) ─────────────────────────

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

// ── Component ──────────────────────────────────────────────────────────────

interface LessonEditorPanelProps {
  sectionId: string
  lessonId?: string
}

export function LessonEditorPanel({ sectionId, lessonId }: LessonEditorPanelProps) {
  const { setActiveView, submitLessonFromPanel, lessonsMap } = useManageContext()
  const isEditMode = !!lessonId

  // Initialize with cached values to prevent false dirty state
  const [title, setTitle] = useState(() => {
    if (lessonId) {
      const cached = lessonsMap[sectionId]?.find((l) => l.id === lessonId)
      if (cached) {
        return cached.title
      }
    }
    return ''
  })

  const [saving, setSaving] = useState(false)
  const [loadingLesson, setLoadingLesson] = useState(!!lessonId)

  // Initial values for dirty state tracking - use cached values if available
  const [initialTitle, setInitialTitle] = useState(() => {
    if (lessonId) {
      const cached = lessonsMap[sectionId]?.find((l) => l.id === lessonId)
      if (cached) {
        return cached.title
      }
    }
    return ''
  })

  const [initialContent, setInitialContent] = useState<JSONContent | null>(() => {
    // Note: lessonsMap contains ManagedLesson which doesn't have content property
    // Content will be loaded via API fetch in useEffect
    return null
  })

  // Ref bridge so SaveShortcut always calls latest handleSave
  const saveRef = useRef<() => void>(() => {})

  // SaveShortcut extension — initialized once, never changes
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
    }),
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
      handlePaste: (view, event) => {
        // Handle image paste from clipboard
        const items = event.clipboardData?.items
        if (!items || !lessonId) return false

        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item.type.indexOf('image') === 0) {
            event.preventDefault()
            const file = item.getAsFile()
            if (file) {
              // Import uploadLessonImage dynamically to avoid circular dependency
              import('@/lib/tiptap/image-upload')
                .then(({ uploadLessonImage }) => uploadLessonImage(file, lessonId))
                .then((url) => {
                  view.dispatch(
                    view.state.tr.replaceSelectionWith(
                      view.state.schema.nodes.image.create({ src: url }),
                    ),
                  )
                  toast.success('Gambar berhasil diupload')
                })
                .catch((err) => {
                  const message = err instanceof Error ? err.message : 'Gagal mengupload gambar'
                  toast.error(message)
                })
            }
            return true
          }
        }
        return false
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
      Image.configure({ inline: false, allowBase64: false }),
      HeadingShortcuts,
      saveShortcutExtension,
    ],
    content: { type: 'doc', content: [] },
  })

  // Track unsaved changes - disabled during loading to prevent false dirty state
  const { isDirty, resetDirty, updateSavedContent } = useUnsavedChanges({
    editor,
    title,
    initialTitle,
    initialContent,
    enabled: !loadingLesson, // Skip dirty check while loading
  })

  // Auto-save draft to localStorage
  const { clearDraft, getDraft } = useLocalStorageDraft({
    lessonId,
    title,
    editor,
    isDirty,
  })

  // Load lesson data in edit mode
  useEffect(() => {
    if (!isEditMode || !lessonId || !editor) return

    fetch(`/api/courses/_/sections/${sectionId}/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((data) => {
        const loadedTitle = data.title || ''
        const loadedContent = data.content?.content || null
        const lessonLastEdit = data.content?.lastEdit || ''

        // Check for draft in localStorage
        const draft = getDraft()
        const hasDraftNewer =
          draft && lessonLastEdit && new Date(draft.savedAt) > new Date(lessonLastEdit)

        // Auto-restore draft if newer (no dialog, direct update)
        if (hasDraftNewer && draft) {
          setTitle(draft.title)
          setInitialTitle(draft.title)
          setInitialContent(draft.content)

          if (draft.content) {
            editor.commands.setContent(draft.content as JSONContent)

            const editorContent = editor.getJSON()
            updateSavedContent(editorContent)

            setTimeout(() => {
              setLoadingLesson(false)
            }, 0)
          } else {
            setLoadingLesson(false)
          }
        } else {
          // Load server content (no draft or draft is older)
          setTitle(loadedTitle)
          setInitialTitle(loadedTitle)
          setInitialContent(loadedContent)

          if (loadedContent) {
            editor.commands.setContent(loadedContent as JSONContent)

            // CRITICAL FIX: Use editor.getJSON() as single source of truth
            // This prevents false dirty state from JSON stringify differences between
            // raw initialContent and editor's normalized JSON output
            const editorContent = editor.getJSON()
            updateSavedContent(editorContent)

            // CRITICAL: Enable dirty check in next tick to ensure all refs are synced
            // This prevents race condition where checkDirty runs before savedContentRef is stable
            setTimeout(() => {
              setLoadingLesson(false)
            }, 0)
          } else {
            console.warn('[LessonEditorPanel] no content.content found', data.content)
            setLoadingLesson(false)
          }
        }
      })
      .catch(() => {
        toast.error('Gagal memuat pelajaran')
        setLoadingLesson(false)
      })
    // ✅ CRITICAL FIX: Remove title, initialTitle, updateSavedContent from dependencies
    // These cause unnecessary re-fetches when user types or after data loads
    // Only re-fetch when lesson ID or editor instance changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, lessonId, sectionId, editor])

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      toast.error('Judul pelajaran tidak boleh kosong')
      return
    }
    if (!editor) return

    setSaving(true)
    // Version always sent as 1 from client — server handles increment on UPDATE
    const content = {
      content: editor.getJSON() as JSONContent,
      version: 1,
      lastEdit: new Date().toISOString(),
    }
    const resultId = await submitLessonFromPanel(
      sectionId,
      { title: title.trim(), content },
      lessonId,
    )
    setSaving(false)

    if (resultId) {
      resetDirty()
      clearDraft() // Clear draft from localStorage after successful save
      setActiveView({ type: 'lesson', sectionId, lessonId: resultId })
    }
  }, [
    title,
    editor,
    sectionId,
    lessonId,
    submitLessonFromPanel,
    setActiveView,
    resetDirty,
    clearDraft,
  ])

  // Keep saveRef in sync
  useEffect(() => {
    saveRef.current = handleSave
  }, [handleSave])

  const handleCancel = () => {
    resetDirty()
    setActiveView(
      lessonId ? { type: 'lesson', sectionId, lessonId } : { type: 'section', sectionId },
    )
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
        {/* Header: Kembali | Toolbar | Save/Cancel */}
        <div className="sticky top-0 z-10 bg-beige-50 border-b border-beige-200 mb-6 pb-2 pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-sm text-beige-500 hover:text-beige-800 transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
            <div className="flex-1 min-w-0">
              <EditorToolbar lessonId={lessonId} />
            </div>
            <div className="flex items-center shrink-0">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || !title.trim() || (isEditMode && !isDirty)}
                data-testid="lesson-save-btn"
                className="bg-merah-500 hover:bg-merah-600 text-white rounded-r-none border-r border-merah-400"
              >
                {saving ? 'Menyimpan...' : isEditMode ? 'Save' : 'Create'}
                {isDirty && !saving && (
                  <span
                    className="ml-1.5 text-red-200"
                    aria-label="Perubahan belum disimpan"
                    data-testid="dirty-indicator"
                  >
                    •
                  </span>
                )}
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

        <div
          className="min-h-100 cursor-text max-w-full lesson-editor-body"
          onClick={() => editor?.commands.focus()}
        >
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
