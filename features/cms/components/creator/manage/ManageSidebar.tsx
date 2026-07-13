'use client'

/**
 * ManageSidebar Component
 *
 * Sidebar struktur kurikulum (Course Structure sidebar) untuk Ruang Kerja Penulisan.
 * Menyediakan daftar modul dan pelajaran interaktif, drag-and-drop reordering,
 * penambahan seksi/pelajaran inline, serta dilengkapi Course Overview Card
 * di bagian atas sesuai dengan Atelier Zero design system.
 */

import { useRef, useEffect, useState, memo } from 'react'
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Settings,
  GripVertical,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Trophy,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useManageContext } from '../../../Context/creator/ManageContext'
import type { ManagedLesson } from '@/features/cms/hooks/manage'

// ── Sortable Lesson Item ───────────────────────────────────────────────────

const SortableLessonItem = memo(function SortableLessonItem({
  lesson,
  isActive,
  openLessonMenuId,
  setOpenLessonMenuId,
  onSelect,
  onEdit,
  onDelete,
}: {
  lesson: ManagedLesson
  isActive: boolean
  openLessonMenuId: string | null
  setOpenLessonMenuId: (id: string | null) => void
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all border border-transparent cursor-pointer select-none ${
        isActive
          ? 'bg-accent-coral/5 text-accent-coral border-accent-coral/10 font-semibold'
          : 'hover:bg-bg-surface-accent text-text-secondary hover:text-text-primary'
      }`}
      onClick={onSelect}
      data-testid={`lesson-item-${lesson.id}`}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 cursor-grab active:cursor-grabbing text-text-faint hover:text-text-muted touch-none"
        aria-label="Tarik untuk memindahkan pelajaran"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <FileText
        className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-accent-coral' : 'text-text-muted'}`}
      />
      <span className="text-xs flex-1 truncate">{lesson.title}</span>

      {/* Dropdown Menu trigger */}
      <div
        className={`items-center shrink-0 ${openLessonMenuId === lesson.id ? 'flex' : 'hidden group-hover:flex'}`}
      >
        <DropdownMenu
          open={openLessonMenuId === lesson.id}
          onOpenChange={(open) => setOpenLessonMenuId(open ? lesson.id : null)}
        >
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className={`p-1 rounded-full text-text-muted hover:text-text-primary transition-colors ${
                openLessonMenuId === lesson.id
                  ? 'bg-bg-surface-accent text-text-primary'
                  : 'hover:bg-bg-surface-accent'
              }`}
              title="Opsi pelajaran"
              data-testid={`lesson-menu-btn-${lesson.id}`}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-36 paper-texture">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              data-testid={`lesson-edit-btn-${lesson.id}`}
            >
              <Edit className="h-3.5 w-3.5 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              data-testid={`lesson-delete-btn-${lesson.id}`}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
})

// ── Sortable Section Item ──────────────────────────────────────────────────

const SortableSectionItem = memo(function SortableSectionItem({
  section,
  isExpanded,
  lessons,
  isActiveSection,
  isPending,
  isMenuOpen,
  isEditing,
  editingSectionTitle,
  editInputRef,
  openLessonMenuId,
  activeView,
  setOpenMenuId,
  setOpenLessonMenuId,
  setEditingSectionTitle,
  onToggle,
  onEditKeyDown,
  onEditBlur,
  onStartEdit,
  onAddLesson,
  onDeleteSection,
  onSelectLesson,
  onEditLesson,
  onDeleteLesson,
  onLessonDragEnd,
  sensors,
  quizQuestionCount = 0,
  onSelectQuiz,
}: {
  section: {
    id: string
    title: string
    description: string | null
    order: number
    lessonCount: number
  }
  isExpanded: boolean
  lessons: ManagedLesson[]
  isActiveSection: boolean
  isPending: boolean
  isMenuOpen: boolean
  isEditing: boolean
  editingSectionTitle: string
  editInputRef: React.RefObject<HTMLInputElement | null>
  openLessonMenuId: string | null
  activeView: any
  setOpenMenuId: (id: string | null) => void
  setOpenLessonMenuId: (id: string | null) => void
  setEditingSectionTitle: (t: string) => void
  onToggle: () => void
  onEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onEditBlur: () => void
  onStartEdit: () => void
  onAddLesson: () => void
  onDeleteSection: () => void
  onSelectLesson: (lessonId: string) => void
  onEditLesson: (lesson: ManagedLesson) => void
  onDeleteLesson: (lessonId: string) => void
  onLessonDragEnd: (event: DragEndEvent) => void
  sensors: ReturnType<typeof useSensors>
  quizQuestionCount?: number
  onSelectQuiz?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-1.5 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <div
        className={`group flex items-center gap-1 px-3 py-2 rounded-xl transition-all border border-transparent ${
          isActiveSection || isMenuOpen || isEditing
            ? 'bg-bg-bone/80 border-border/5'
            : 'hover:bg-bg-surface-accent'
        }`}
        data-testid={`section-item-${section.id}`}
      >
        <button
          {...attributes}
          {...listeners}
          className="shrink-0 cursor-grab active:cursor-grabbing text-text-faint hover:text-text-muted touch-none"
          aria-label="Tarik untuk memindahkan modul"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onToggle}
          className="flex items-center gap-1 shrink-0 cursor-pointer"
          tabIndex={isEditing ? -1 : 0}
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-3.5 w-3.5 text-accent-coral" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-text-muted" />
          )}
        </button>

        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editingSectionTitle}
            onChange={(e) => setEditingSectionTitle(e.target.value)}
            onKeyDown={onEditKeyDown}
            onBlur={onEditBlur}
            className="flex-1 min-w-0 text-xs font-semibold bg-white border border-accent-coral rounded-lg px-2 py-0.5 outline-none focus:ring-1 focus:ring-accent-coral/25 text-text-primary font-sans"
            maxLength={200}
            data-testid={`section-edit-input-${section.id}`}
          />
        ) : (
          <button
            onClick={onToggle}
            className="flex-1 min-w-0 text-left flex items-center gap-1 cursor-pointer"
            data-testid={`section-toggle-${section.id}`}
          >
            <span className="text-xs text-text-primary font-bold truncate font-sans">
              {section.title}
            </span>
            <span className="text-[10px] font-mono text-text-muted bg-bg-bone/80 px-2 py-0.5 rounded-full shrink-0 ml-auto">
              {section.lessonCount}
            </span>
          </button>
        )}

        {!isEditing && (
          <div
            className={`items-center shrink-0 ${isMenuOpen ? 'flex' : 'hidden group-hover:flex'}`}
          >
            <DropdownMenu
              open={isMenuOpen}
              onOpenChange={(open) => setOpenMenuId(open ? section.id : null)}
            >
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className={`p-1 rounded-full text-text-muted hover:text-text-primary transition-colors cursor-pointer ${
                    isMenuOpen
                      ? 'bg-bg-surface-accent text-text-primary'
                      : 'hover:bg-bg-surface-accent'
                  }`}
                  title="Opsi seksi"
                  data-testid={`section-menu-btn-${section.id}`}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-44 paper-texture">
                <DropdownMenuItem
                  onClick={onStartEdit}
                  data-testid={`section-edit-btn-${section.id}`}
                >
                  <Edit className="h-3.5 w-3.5 mr-2" />
                  Edit Nama Modul
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onAddLesson}
                  data-testid={`section-add-lesson-btn-${section.id}`}
                >
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Tambah Pelajaran
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={onDeleteSection}
                  data-testid={`section-delete-btn-${section.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Hapus Modul
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="ml-5 mt-1 pl-2 border-l border-border/5 space-y-1 animate-fade-in">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onLessonDragEnd}
          >
            <SortableContext
              items={lessons.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {lessons.map((lesson) => (
                <SortableLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  isActive={activeView.type === 'lesson' && activeView.lessonId === lesson.id}
                  openLessonMenuId={openLessonMenuId}
                  setOpenLessonMenuId={setOpenLessonMenuId}
                  onSelect={() => onSelectLesson(lesson.id)}
                  onEdit={() => onEditLesson(lesson)}
                  onDelete={() => onDeleteLesson(lesson.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Section Quiz Node */}
          <div
            onClick={onSelectQuiz}
            className={`
              group flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all border border-transparent cursor-pointer select-none
              ${activeView.type === 'quiz-editor' && activeView.quizType === 'SECTION_QUIZ' && activeView.sectionId === section.id
                ? 'bg-accent-coral/5 text-accent-coral border-accent-coral/10 font-bold'
                : 'hover:bg-bg-surface-accent text-text-secondary hover:text-text-primary'
              }
            `}
          >
            <Trophy
              className={`h-3.5 w-3.5 shrink-0 ${
                activeView.type === 'quiz-editor' && activeView.quizType === 'SECTION_QUIZ' && activeView.sectionId === section.id
                  ? 'text-accent-coral animate-pulse'
                  : 'text-accent-mustard'
              }`}
            />
            <span className="text-xs flex-1 truncate">Kuis Bab</span>
            <span className="text-[10px] font-mono text-text-muted bg-bg-bone/80 px-2 py-0.5 rounded-full shrink-0 ml-auto group-hover:bg-bg-surface-accent transition-colors">
              {quizQuestionCount} soal
            </span>
          </div>

          <button
            onClick={onAddLesson}
            className="w-full flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold text-text-muted hover:text-accent-coral hover:bg-accent-coral/5 transition-colors cursor-pointer select-none"
          >
            <Plus className="h-3 w-3" />
            <span>Tambah Pelajaran</span>
          </button>
        </div>
      )}
    </div>
  )
})

// ── Main Sidebar ───────────────────────────────────────────────────────────

export function ManageSidebar() {
  const {
    course,
    sections,
    lessonsMap,
    expandedSections,
    activeView,
    toggleSection,
    setActiveView,
    isAddingSection,
    newSectionTitle,
    setNewSectionTitle,
    startAddingSection,
    cancelAddingSection,
    confirmAddSection,
    updateSectionTitle,
    handleDeleteSection,
    openAddLesson,
    openEditLesson,
    handleDeleteLesson,
    reorderSections,
    reorderLessons,
    questions,
  } = useManageContext()

  const inlineInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [openLessonMenuId, setOpenLessonMenuId] = useState<string | null>(null)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingSectionTitle, setEditingSectionTitle] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    if (isAddingSection) inlineInputRef.current?.focus()
  }, [isAddingSection])
  useEffect(() => {
    if (editingSectionId) editInputRef.current?.select()
  }, [editingSectionId])

  const handleInlineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      confirmAddSection()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      cancelAddingSection()
    }
  }
  const handleInlineBlur = () => {
    if (newSectionTitle.trim()) confirmAddSection()
    else cancelAddingSection()
  }
  const startEditSection = (section: { id: string; title: string }) => {
    setOpenMenuId(null)
    setEditingSectionId(section.id)
    setEditingSectionTitle(section.title)
  }
  const cancelEditSection = () => {
    setEditingSectionId(null)
    setEditingSectionTitle('')
  }
  const confirmEditSection = async (sectionId: string, oldTitle: string) => {
    const title = editingSectionTitle.trim()
    setEditingSectionId(null)
    setEditingSectionTitle('')
    if (!title || title === oldTitle) return
    await updateSectionTitle(sectionId, title, oldTitle)
  }
  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    sectionId: string,
    oldTitle: string,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      confirmEditSection(sectionId, oldTitle)
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      cancelEditSection()
    }
  }

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sections.findIndex((s) => s.id === active.id)
    const newIndex = sections.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const previousSections = [...sections]
    reorderSections(arrayMove(sections, oldIndex, newIndex), previousSections)
  }

  const handleLessonDragEnd = (sectionId: string) => (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const lessons = lessonsMap[sectionId] || []
    const oldIndex = lessons.findIndex((l) => l.id === active.id)
    const newIndex = lessons.findIndex((l) => l.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const previousLessons = [...lessons]
    reorderLessons(sectionId, arrayMove(lessons, oldIndex, newIndex), previousLessons)
  }

  return (
    <aside
      className={`
      relative bg-card border-r border-border/10 flex flex-col shrink-0 h-full
      transition-all duration-300 ease-in-out paper-texture select-none
      ${sidebarOpen ? 'w-76' : 'w-12'}
    `}
      aria-label="Kurikulum"
    >
      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="absolute -right-3.5 top-4 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-border/10 bg-card shadow-sm hover:bg-bg-surface-accent text-text-secondary cursor-pointer select-none transition-all"
        aria-label={sidebarOpen ? 'Tutup panel navigasi' : 'Buka panel navigasi'}
        title={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
      >
        {sidebarOpen ? (
          <PanelLeftClose className="h-3.5 w-3.5 text-text-muted" />
        ) : (
          <PanelLeftOpen className="h-3.5 w-3.5 text-text-muted" />
        )}
      </button>

      {/* Collapsed state — just icon */}
      {!sidebarOpen && (
        <div className="flex flex-col items-center pt-5 gap-4">
          <BookOpen className="h-4 w-4 text-accent-coral animate-float" />
          <div className="h-px w-6 bg-border/5" />
          <Settings className="h-4 w-4 text-text-faint hover:text-text-muted transition-colors cursor-pointer" />
        </div>
      )}

      {/* Expanded state */}
      {sidebarOpen && (
        <>
          {/* 1. Course Overview Card (as mandated by spec) */}
          {course && (
            <div
              onClick={() => setActiveView({ type: 'overview' })}
              className={`mx-4 my-4 p-4 bg-bg-bone/60 border border-border/10 rounded-2xl relative overflow-hidden paper-texture cursor-pointer select-none transition-all duration-180 hover:shadow-sm hover:border-accent-coral/15 hover:bg-bg-bone ${
                activeView.type === 'overview'
                  ? 'border-accent-coral/30 ring-1 ring-accent-coral/10 bg-bg-bone shadow-sm'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Small thumbnail icon wrapper */}
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-accent-coral/15 to-accent-mustard/15 flex items-center justify-center shrink-0 border border-border/10 font-serif italic text-base text-accent-coral font-bold select-none">
                  {course.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-mono text-text-muted uppercase tracking-wider block leading-none mb-0.5">
                    KELAS
                  </span>
                  <h4 className="text-xs font-bold text-text-primary truncate leading-tight hover:text-accent-coral">
                    {course.title}
                  </h4>
                  <p className="text-[9px] text-text-muted font-medium mt-0.5 leading-none">
                    {sections.length} Modul &middot;{' '}
                    {Object.values(lessonsMap).reduce((sum, list) => sum + (list?.length || 0), 0)}{' '}
                    Pelajaran
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 pb-2">
            <div className="h-px w-full bg-border/5" />
          </div>

          {/* 2. Course Structure Modul & Pelajaran Tree */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Pre-test (Initial Assessment) Node */}
            <div
              onClick={() => setActiveView({ type: 'quiz-editor', quizType: 'PRE_TEST' })}
              className={`
                group flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 border cursor-pointer select-none mb-4
                ${activeView.type === 'quiz-editor' && activeView.quizType === 'PRE_TEST'
                  ? 'bg-accent-coral/5 text-accent-coral border-accent-coral/20 font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]'
                  : 'bg-transparent border-border/10 hover:bg-bg-surface-accent text-text-primary'
                }
              `}
            >
              <div className="h-8 w-8 rounded-xl bg-bg-bone/80 dark:bg-bg-surface-accent border border-border/5 flex items-center justify-center shadow-sm shrink-0">
                <Trophy className={`h-4 w-4 ${activeView.type === 'quiz-editor' && activeView.quizType === 'PRE_TEST' ? 'text-accent-coral animate-pulse' : 'text-accent-mustard'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold block truncate leading-tight">
                  Pre-test (Assessment Awal)
                </span>
                <span className="text-[9px] font-medium text-text-muted leading-none block mt-0.5">
                  {questions.filter((q) => q.sectionId !== null).length} soal
                </span>
              </div>
              <Settings className="h-3.5 w-3.5 text-text-faint group-hover:text-text-muted transition-colors shrink-0" />
            </div>

            {sections.length === 0 && !isAddingSection && (
              <p className="text-[10px] text-text-muted font-semibold px-3 py-6 text-center italic bg-bg-bone/40 rounded-2xl border border-dashed border-border/10">
                Belum ada modul terdaftar. Klik tombol Tambah Modul di bawah untuk memulai.
              </p>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSectionDragEnd}
            >
              <SortableContext
                items={sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {sections.map((section) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    isExpanded={expandedSections.has(section.id)}
                    lessons={lessonsMap[section.id] || []}
                    isActiveSection={
                      activeView.type === 'section' && activeView.sectionId === section.id
                    }
                    isPending={section.id.startsWith('temp-')}
                    isMenuOpen={openMenuId === section.id}
                    isEditing={editingSectionId === section.id}
                    editingSectionTitle={editingSectionTitle}
                    editInputRef={editInputRef}
                    openLessonMenuId={openLessonMenuId}
                    activeView={activeView}
                    setOpenMenuId={setOpenMenuId}
                    setOpenLessonMenuId={setOpenLessonMenuId}
                    setEditingSectionTitle={setEditingSectionTitle}
                    onToggle={() => editingSectionId !== section.id && toggleSection(section.id)}
                    onEditKeyDown={(e) => handleEditKeyDown(e, section.id, section.title)}
                    onEditBlur={() => confirmEditSection(section.id, section.title)}
                    onStartEdit={() => startEditSection(section)}
                    onAddLesson={() => openAddLesson(section.id)}
                    onDeleteSection={() => handleDeleteSection(section.id)}
                    onSelectLesson={(lessonId) =>
                      setActiveView({ type: 'lesson', sectionId: section.id, lessonId })
                    }
                    onEditLesson={(lesson) => openEditLesson(lesson, section.id)}
                    onDeleteLesson={(lessonId) => handleDeleteLesson(section.id, lessonId)}
                    onLessonDragEnd={handleLessonDragEnd(section.id)}
                    sensors={sensors}
                    quizQuestionCount={questions.filter((q) => q.sectionId === section.id).length}
                    onSelectQuiz={() => setActiveView({ type: 'quiz-editor', quizType: 'SECTION_QUIZ', sectionId: section.id })}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {/* Inline Add Section Form Input */}
            {isAddingSection && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-bone/80 border border-border/5 mb-1.5 animate-fade-in">
                <ChevronRight className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <Folder className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <input
                  ref={inlineInputRef}
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  onKeyDown={handleInlineKeyDown}
                  onBlur={handleInlineBlur}
                  placeholder="Nama modul baru..."
                  className="flex-1 text-xs bg-transparent outline-none text-text-primary placeholder:text-text-faint font-semibold font-sans"
                  data-testid="inline-section-input"
                />
              </div>
            )}

            {/* Add Section Button */}
            <button
              onClick={startAddingSection}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:text-accent-coral hover:bg-accent-coral/5 border border-border/10 transition-colors mt-2 cursor-pointer select-none"
              data-testid="add-section-btn"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Modul</span>
            </button>
          </nav>
        </>
      )}
    </aside>
  )
}
