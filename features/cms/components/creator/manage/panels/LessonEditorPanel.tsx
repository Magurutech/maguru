'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Check,
  Sparkles,
  Trash2,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
  Download,
  Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEditor, EditorContent, JSONContent, Extension, EditorContext } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { Typography } from '@tiptap/extension-typography'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Selection } from '@tiptap/extensions/selection'
import Image from '@tiptap/extension-image'
import { toast } from 'sonner'
import { EditorToolbar } from '@/features/cms/components/creator/EditorToolbar'
import { useManageContext } from '../../../../Context/creator/ManageContext'
import { useUnsavedChanges } from '@/features/cms/hooks/manage/useUnsavedChanges'
import { useLocalStorageDraft } from '@/features/cms/hooks/manage/useLocalStorageDraft'

import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { SlashCommand } from '../editor/extensions/SlashCommand'
import { Small } from '../editor/extensions/Small'
import { Columns, Column } from '../editor/extensions/Columns'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { Details, DetailsSummary, DetailsContent } from '@tiptap/extension-details'
import { PasteMarkdown } from '../editor/extensions/PasteMarkdown'
import { BrowseModal } from '../editor/components/BrowseModal'
import { Callout } from '../editor/extensions/Callout'
import { CustomCodeBlock } from '../editor/extensions/CustomCodeBlock'
import { EditorBubbleMenu } from '../editor/components/EditorBubbleMenu'
import { StudentPreviewModal } from '../editor/components/StudentPreviewModal'
import { AIWritingAssistantModal } from '../editor/components/AIWritingAssistantModal'
import { exportEditorToMarkdown, downloadMarkdownFile } from '../editor/lib/markdown-helpers'

// Simple Editor node styles
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/callout-node/callout-node.scss'
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/components/tiptap-node/image-node/image-node.scss'
import '@/components/tiptap-node/table-node/table-node.scss'
import '@/components/tiptap-node/columns-node/columns-node.scss'
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
  const {
    course,
    setActiveView,
    submitLessonFromPanel,
    lessonsMap,
    syncingKnowledge,
    handleSyncKnowledge,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  } = useManageContext()
  const isEditMode = !!lessonId

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)

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

  const [isBrowseOpen, setIsBrowseOpen] = useState(false)

  useEffect(() => {
    // openBrowseModal is called by suggestion.ts after it has already run
    // deleteRange — so we only need to open the dialog here, no range needed.
    ;(window as any).openBrowseModal = () => setIsBrowseOpen(true)
    return () => {
      delete (window as any).openBrowseModal
    }
  }, [])

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
        spellcheck: 'false',
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
        codeBlock: false,
        link: { openOnClick: false, enableClickSelection: true },
      }),
      CustomCodeBlock,
      Callout,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
      Selection,
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { class: 'tiptap-image' } }),
      TaskList,
      TaskItem.configure({ nested: true }),
      HorizontalRule,
      SlashCommand,
      Small,
      Columns,
      Column,
      Table.configure({
        resizable: true,
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
      PasteMarkdown,
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
  const { clearDraft, getDraft, lastSavedAt } = useLocalStorageDraft({
    lessonId,
    title,
    editor,
    isDirty,
  })

  // Word count & Estimated reading time calculation (reactive to editor changes)
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    if (!editor) return
    const updateStats = () => {
      const text = editor.getText() || ''
      const trimmed = text.trim()
      setWordCount(trimmed ? trimmed.split(/\s+/).length : 0)
    }
    updateStats()
    editor.on('update', updateStats)
    return () => {
      editor.off('update', updateStats)
    }
  }, [editor])

  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180))

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
        // Only consider draft valid if it actually has meaningful title or content blocks
        const isDraftValid =
          draft &&
          (Boolean(draft.title?.trim()) ||
            (draft.content?.content && Array.isArray(draft.content.content) && draft.content.content.length > 0))

        const hasDraftNewer =
          Boolean(isDraftValid && draft && lessonLastEdit && new Date(draft.savedAt) > new Date(lessonLastEdit))

        // Auto-restore draft if newer and valid
        if (hasDraftNewer && draft) {
          const titleToUse = draft.title?.trim() || loadedTitle
          setTitle(titleToUse)
          setInitialTitle(titleToUse)
          setInitialContent(draft.content || loadedContent)

          if (draft.content) {
            editor.commands.setContent(draft.content as JSONContent)
            const editorContent = editor.getJSON()
            updateSavedContent(editorContent)
            setTimeout(() => {
              setLoadingLesson(false)
            }, 0)
          } else if (loadedContent) {
            editor.commands.setContent(loadedContent as JSONContent)
            const editorContent = editor.getJSON()
            updateSavedContent(editorContent)
            setTimeout(() => {
              setLoadingLesson(false)
            }, 0)
          } else {
            setLoadingLesson(false)
          }
          toast.info('Draft tersimpan di browser dipulihkan')
        } else {
          // If draft exists but was empty/invalid, purge it from localStorage
          if (draft && !isDraftValid) {
            clearDraft()
          }

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-coral" />
      </div>
    )
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      {/* ── Floating Bubble Menu for Instant Selection Styling (Should-Have S-3) ─ */}
      <EditorBubbleMenu editor={editor} />

      {/* ── Toolbar strip: full-width, sticky at top:0 of the scroll container ─
           Locked flush to ManageHeader (Confluence style) with Zen Mode & Side-Features */}
      <div className="sticky top-0 z-30 w-full bg-card/95 backdrop-blur border-b border-border/15 flex items-center select-none overflow-x-auto no-scrollbar py-1">
        {/* Zen Mode & Cancel — left */}
        <div className="flex items-center gap-1.5 px-3 shrink-0 border-r border-border/10 h-full py-1">
          <button
            type="button"
            onClick={toggleSidebarCollapse}
            className="flex items-center justify-center p-1.5 rounded-lg border border-border/10 hover:bg-bg-surface-accent text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            title={isSidebarCollapsed ? 'Buka Sidebar (Zen Mode Aktif)' : 'Tutup Sidebar (Zen Writing Mode)'}
            aria-label={isSidebarCollapsed ? 'Buka sidebar modul' : 'Tutup sidebar modul'}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4 text-accent-coral" />
            ) : (
              <PanelLeftClose className="h-4 w-4 text-text-muted" />
            )}
          </button>

          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors font-bold bg-bg-bone/80 border border-border/10 px-3 py-1.5 rounded-full cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Batal
          </button>
        </div>

        {/* Tiptap formatting toolbar — center, left-aligned */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <EditorToolbar lessonId={lessonId} />
        </div>

        {/* AI Writing Assistant Button (Could-Have C-1) */}
        <button
          type="button"
          onClick={() => setIsAIOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent-coral bg-accent-coral/10 hover:bg-accent-coral/15 border border-accent-coral/20 rounded-full transition-all cursor-pointer shrink-0 mx-1.5"
          title="Buka Asisten Menulis AI"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Tulis</span>
        </button>

        {/* Student Preview Button (Should-Have S-1) */}
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-surface-accent border border-border/10 rounded-full transition-colors cursor-pointer shrink-0 mx-1.5 font-medium"
          title="Pratinjau Tampilan Siswa (Reader Mode)"
        >
          <Eye className="w-3.5 h-3.5 text-text-muted" />
          <span>Pratinjau</span>
        </button>

        {/* Word Count & Reading Time Counter (Side-feature) */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 text-[11px] text-text-secondary/75 font-mono shrink-0 border-l border-border/10 select-none">
          <Clock className="h-3 w-3 text-accent-coral/80 shrink-0" />
          <span>{wordCount} kata</span>
          <span className="text-border/40">•</span>
          <span>~{readingTimeMinutes} mnt baca</span>
        </div>

        {/* Inline Save & Sync Status Badge (WCAG 2.2 aria-live polite, replaces toast spam) */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="hidden md:flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium shrink-0 border-l border-border/10 select-none"
        >
          {saving ? (
            <span className="text-accent-coral flex items-center gap-1.5 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-coral animate-ping" />
              Menyimpan...
            </span>
          ) : isDirty ? (
            <span className="text-accent-mustard flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-mustard" />
              {lastSavedAt
                ? `Draf lokal (${new Date(lastSavedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})`
                : 'Belum disimpan'}
            </span>
          ) : (
            <span className="text-accent-forest flex items-center gap-1.5">
              <Check className="h-3 w-3 text-accent-forest" />
              Tersimpan
            </span>
          )}
        </div>

        {/* Save & Actions Dropdown — right */}
        <div className="flex items-center px-3 shrink-0 border-l border-border/10 h-full py-1.5">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || !title.trim() || (isEditMode && !isDirty)}
            data-testid="lesson-save-btn"
            title="Simpan Materi (Ctrl+S)"
            className="bg-accent-coral hover:bg-accent-coral/95 text-white rounded-l-full rounded-r-none border-r border-white/10 px-4 text-xs font-bold cursor-pointer shadow-glow"
          >
            {saving ? 'Menyimpan...' : isEditMode ? 'Simpan' : 'Buat'}
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
                className="bg-accent-coral hover:bg-accent-coral/95 text-white rounded-r-full rounded-l-none px-2.5 cursor-pointer"
                aria-label="Opsi lainnya"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 paper-texture">
              {lessonId && (
                <DropdownMenuItem
                  disabled={syncingKnowledge}
                  onClick={handleSyncKnowledge}
                  className="text-text-primary text-xs cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5 text-accent-coral" />
                  {syncingKnowledge ? 'Menyinkronkan AI...' : 'Sinkronkan Vektor AI'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  const md = exportEditorToMarkdown(editor, title)
                  downloadMarkdownFile(title, md)
                  toast.success('Berkas Markdown (.md) berhasil diunduh')
                }}
                className="text-text-primary text-xs cursor-pointer flex items-center gap-2"
              >
                <Download className="h-3.5 w-3.5 text-accent-forest" />
                Download Markdown (.md)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const md = exportEditorToMarkdown(editor, title)
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(md)
                    toast.success('Markdown berhasil disalin ke clipboard')
                  }
                }}
                className="text-text-primary text-xs cursor-pointer flex items-center gap-2"
              >
                <Copy className="h-3.5 w-3.5 text-accent-coral" />
                Salin sebagai Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/10" />
              <DropdownMenuItem
                onClick={() => {
                  clearDraft()
                  toast.success('Draf lokal berhasil dibersihkan')
                }}
                className="text-text-secondary text-xs cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="h-3.5 w-3.5 text-text-muted" />
                Hapus Draf Lokal
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/10" />
              <DropdownMenuItem onClick={handleCancel} className="text-text-secondary text-xs cursor-pointer">
                Batal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Document Sheet Metaphor (Must-Have M-1 & M-4) ────────────────────── */}
      <div className="min-h-full px-4 sm:px-6 md:px-10 py-6 md:py-10 flex justify-center">
        <div className="w-full max-w-4xl bg-card border border-border/15 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm paper-texture">
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-coral block mb-1">
              MATERI PEMBELAJARAN
            </span>
            {/* Title input with WCAG 2.2 accessibility labels, disabled spellcheck, and clear focus ring */}
            <input
              type="text"
              id="lesson-title-input"
              aria-label="Judul Pelajaran"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && editor?.commands.focus()}
              placeholder="Judul pelajaran..."
              spellCheck={false}
              className="w-full text-2xl md:text-3xl font-bold font-sans text-text-primary bg-transparent border-none outline-none placeholder:text-text-faint/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-coral/30 rounded-md transition-shadow"
              maxLength={200}
              autoFocus={!isEditMode}
              data-testid="lesson-title-input"
            />
          </div>

          <hr className="border-border/10 mb-6" />

          <div
            className="min-h-[450px] cursor-text max-w-full lesson-editor-body"
            onClick={() => editor?.commands.focus()}
          >
            <EditorContent
              editor={editor}
              role="presentation"
              className="simple-editor-content max-w-full [&_.tiptap]:min-h-[250px] [&_.tiptap]:px-0 [&_.tiptap.ProseMirror.simple-editor]:pb-8 text-text-secondary text-sm md:text-base font-sans leading-relaxed"
            />
          </div>
        </div>
      </div>

      <BrowseModal
        isOpen={isBrowseOpen}
        onClose={() => setIsBrowseOpen(false)}
        editor={editor}
      />

      <StudentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        editor={editor}
        wordCount={wordCount}
        readingTimeMinutes={readingTimeMinutes}
        courseTitle={course?.title}
      />

      <AIWritingAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        editor={editor}
        title={title}
        courseTitle={course?.title}
      />
    </EditorContext.Provider>
  )
}
