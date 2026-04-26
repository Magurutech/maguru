'use client'

import { useRef, useEffect, useState } from 'react'
import {
  Plus, ChevronDown, ChevronRight, Folder, FolderOpen,
  FileText, MoreHorizontal, Edit, Trash2, Settings, GripVertical,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
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
import { useManageContext } from '../../../context/creator/ManageContext'
import type { ManagedLesson } from '@/features/cms/hooks/manage'

// ── Sortable Lesson Item ───────────────────────────────────────────────────

function SortableLessonItem({
  lesson, isActive, openLessonMenuId, setOpenLessonMenuId,
  onSelect, onEdit, onDelete,
}: {
  lesson: ManagedLesson
  isActive: boolean
  openLessonMenuId: string | null
  setOpenLessonMenuId: (id: string | null) => void
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
        isActive ? 'bg-merah-50 text-merah-700' : 'hover:bg-beige-50 text-beige-700'
      }`}
      onClick={onSelect}
      data-testid={`lesson-item-${lesson.id}`}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 cursor-grab active:cursor-grabbing text-beige-300 hover:text-beige-500 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-3 w-3" />
      </button>
      <FileText className="h-3.5 w-3.5 shrink-0 text-beige-400" />
      <span className="text-xs flex-1 truncate">{lesson.title}</span>
      <div className={`items-center shrink-0 ${openLessonMenuId === lesson.id ? 'flex' : 'hidden group-hover:flex'}`}>
        <DropdownMenu
          open={openLessonMenuId === lesson.id}
          onOpenChange={(open) => setOpenLessonMenuId(open ? lesson.id : null)}
        >
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className={`p-1 rounded text-beige-400 hover:text-beige-700 transition-colors ${
                openLessonMenuId === lesson.id ? 'bg-beige-200 text-beige-700' : 'hover:bg-beige-200'
              }`}
              title="Opsi pelajaran"
              data-testid={`lesson-menu-btn-${lesson.id}`}
            >
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-36">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit() }} data-testid={`lesson-edit-btn-${lesson.id}`}>
              <Edit className="h-3.5 w-3.5 mr-2" />Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={(e) => { e.stopPropagation(); onDelete() }} data-testid={`lesson-delete-btn-${lesson.id}`}>
              <Trash2 className="h-3.5 w-3.5 mr-2" />Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// ── Sortable Section Item ──────────────────────────────────────────────────

function SortableSectionItem({
  section, isExpanded, lessons, isActiveSection, isPending,
  isMenuOpen, isEditing, editingSectionTitle, editInputRef,
  openLessonMenuId, activeView, setOpenMenuId, setOpenLessonMenuId,
  setEditingSectionTitle, onToggle, onEditKeyDown, onEditBlur,
  onStartEdit, onAddLesson, onDeleteSection,
  onSelectLesson, onEditLesson, onDeleteLesson, onLessonDragEnd, sensors,
}: {
  section: { id: string; title: string; description: string | null; order: number; lessonCount: number }
  isExpanded: boolean
  lessons: ManagedLesson[]
  isActiveSection: boolean
  isPending: boolean
  isMenuOpen: boolean
  isEditing: boolean
  editingSectionTitle: string
  editInputRef: React.RefObject<HTMLInputElement | null>
  openLessonMenuId: string | null
  activeView: { type: string; sectionId?: string; lessonId?: string }
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
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }

  return (
    <div ref={setNodeRef} style={style} className={`mb-1 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      <div
        className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
          isActiveSection || isMenuOpen || isEditing ? 'bg-beige-100' : 'hover:bg-beige-50'
        }`}
        data-testid={`section-item-${section.id}`}
      >
        <button
          {...attributes}
          {...listeners}
          className="shrink-0 cursor-grab active:cursor-grabbing text-beige-300 hover:text-beige-500 touch-none"
          aria-label="Drag to reorder section"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <button onClick={onToggle} className="flex items-center gap-1 shrink-0" tabIndex={isEditing ? -1 : 0}>
          {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-beige-400" /> : <ChevronRight className="h-3.5 w-3.5 text-beige-400" />}
          {isExpanded ? <FolderOpen className="h-3.5 w-3.5 text-beige-500" /> : <Folder className="h-3.5 w-3.5 text-beige-500" />}
        </button>
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editingSectionTitle}
            onChange={(e) => setEditingSectionTitle(e.target.value)}
            onKeyDown={onEditKeyDown}
            onBlur={onEditBlur}
            className="flex-1 min-w-0 text-sm font-medium bg-white border border-merah-300 rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-merah-300 text-beige-800"
            maxLength={200}
            data-testid={`section-edit-input-${section.id}`}
          />
        ) : (
          <button onClick={onToggle} className="flex-1 min-w-0 text-left flex items-center gap-1" data-testid={`section-toggle-${section.id}`}>
            <span className="text-sm text-beige-800 font-medium truncate">{section.title}</span>
            <span className="text-xs text-beige-400 shrink-0 ml-auto">{section.lessonCount}</span>
          </button>
        )}
        {!isEditing && (
          <div className={`items-center shrink-0 ${isMenuOpen ? 'flex' : 'hidden group-hover:flex'}`}>
            <DropdownMenu open={isMenuOpen} onOpenChange={(open) => setOpenMenuId(open ? section.id : null)}>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className={`p-1 rounded text-beige-400 hover:text-beige-700 transition-colors ${isMenuOpen ? 'bg-beige-200 text-beige-700' : 'hover:bg-beige-200'}`}
                  title="Opsi seksi"
                  data-testid={`section-menu-btn-${section.id}`}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-44">
                <DropdownMenuItem onClick={onStartEdit} data-testid={`section-edit-btn-${section.id}`}>
                  <Edit className="h-3.5 w-3.5 mr-2" />Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddLesson} data-testid={`section-add-lesson-btn-${section.id}`}>
                  <Plus className="h-3.5 w-3.5 mr-2" />Tambah
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={onDeleteSection} data-testid={`section-delete-btn-${section.id}`}>
                  <Trash2 className="h-3.5 w-3.5 mr-2" />Hapus Seksi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="ml-6 mt-0.5 space-y-0.5">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onLessonDragEnd}>
            <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
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
          <button onClick={onAddLesson} className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs text-beige-400 hover:text-hijau-600 hover:bg-hijau-50 transition-colors">
            <Plus className="h-3 w-3" />Tambah
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Sidebar ───────────────────────────────────────────────────────────

export function ManageSidebar() {
  const {
    sections, lessonsMap, expandedSections, activeView,
    toggleSection, setActiveView,
    isAddingSection, newSectionTitle, setNewSectionTitle,
    startAddingSection, cancelAddingSection, confirmAddSection, updateSectionTitle,
    handleDeleteSection, openAddLesson, openEditLesson, handleDeleteLesson,
    reorderSections, reorderLessons,
  } = useManageContext()

  const inlineInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [openLessonMenuId, setOpenLessonMenuId] = useState<string | null>(null)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingSectionTitle, setEditingSectionTitle] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => { if (isAddingSection) inlineInputRef.current?.focus() }, [isAddingSection])
  useEffect(() => { if (editingSectionId) editInputRef.current?.select() }, [editingSectionId])

  const handleInlineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmAddSection() }
    if (e.key === 'Escape') { e.preventDefault(); cancelAddingSection() }
  }
  const handleInlineBlur = () => {
    if (newSectionTitle.trim()) confirmAddSection()
    else cancelAddingSection()
  }
  const startEditSection = (section: { id: string; title: string }) => {
    setOpenMenuId(null); setEditingSectionId(section.id); setEditingSectionTitle(section.title)
  }
  const cancelEditSection = () => { setEditingSectionId(null); setEditingSectionTitle('') }
  const confirmEditSection = async (sectionId: string, oldTitle: string) => {
    const title = editingSectionTitle.trim()
    setEditingSectionId(null); setEditingSectionTitle('')
    if (!title || title === oldTitle) return
    await updateSectionTitle(sectionId, title, oldTitle)
  }
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, sectionId: string, oldTitle: string) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmEditSection(sectionId, oldTitle) }
    if (e.key === 'Escape') { e.preventDefault(); cancelEditSection() }
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
    <aside className={`
      relative bg-white border-r border-beige-200 flex flex-col shrink-0 h-full
      transition-all duration-300 ease-in-out
      ${sidebarOpen ? 'w-72' : 'w-12'}
    `}>
      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="absolute -right-3 top-4 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-beige-200 bg-white shadow-md hover:bg-beige-50 hover:shadow-lg transition-all"
        aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
        title={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
      >
        {sidebarOpen
          ? <PanelLeftClose className="h-3.5 w-3.5 text-beige-500" />
          : <PanelLeftOpen className="h-3.5 w-3.5 text-beige-500" />
        }
      </button>

      {/* Collapsed state — just icon */}
      {!sidebarOpen && (
        <div className="flex flex-col items-center pt-4 gap-3">
          <Settings className="h-4 w-4 text-merah-500" />
        </div>
      )}

      {/* Expanded state */}
      {sidebarOpen && (
        <>
          <div className="p-4 border-b border-beige-100">
            <span className="text-sm font-semibold text-beige-700">Konten Kursus</span>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            <button
              onClick={() => setActiveView({ type: 'overview' })}
              data-testid="sidebar-overview-btn"
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                activeView.type === 'overview' ? 'bg-merah-50 text-merah-700 font-medium' : 'text-beige-700 hover:bg-beige-50'
              }`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              Overview Kursus
            </button>

            {sections.length === 0 && !isAddingSection && (
              <p className="text-xs text-beige-400 px-3 py-4 text-center">
                Belum ada seksi. Klik + Tambah Seksi untuk mulai.
              </p>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                {sections.map((section) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    isExpanded={expandedSections.has(section.id)}
                    lessons={lessonsMap[section.id] || []}
                    isActiveSection={activeView.type === 'section' && activeView.sectionId === section.id}
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
                    onSelectLesson={(lessonId) => setActiveView({ type: 'lesson', sectionId: section.id, lessonId })}
                    onEditLesson={(lesson) => openEditLesson(lesson, section.id)}
                    onDeleteLesson={(lessonId) => handleDeleteLesson(section.id, lessonId)}
                    onLessonDragEnd={handleLessonDragEnd(section.id)}
                    sensors={sensors}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {isAddingSection && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-beige-50 mb-1">
                <ChevronRight className="h-3.5 w-3.5 text-beige-300 shrink-0" />
                <Folder className="h-3.5 w-3.5 text-beige-400 shrink-0" />
                <input
                  ref={inlineInputRef}
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  onKeyDown={handleInlineKeyDown}
                  onBlur={handleInlineBlur}
                  placeholder="Nama seksi..."
                  className="flex-1 text-sm bg-transparent outline-none text-beige-800 placeholder:text-beige-300"
                  data-testid="inline-section-input"
                />
              </div>
            )}

            <button
              onClick={startAddingSection}
              className="w-full flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-beige-700 hover:text-merah-600 hover:bg-merah-50 transition-colors mt-1"
              data-testid="add-section-btn"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Seksi
            </button>
          </nav>
        </>
      )}
    </aside>
  )
}
