'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  useCourseManage,
  useLessonHandlers,
  useSectionHandlers,
  useManageView,
  useReorderHandlers,
} from '@/features/cms/hooks/manage'
import type { ManagedSection, ManagedLesson, ActiveView } from '@/features/cms/hooks/manage'

// ── Context type ───────────────────────────────────────────────────────────

interface ManageContextValue {
  course: ReturnType<typeof useCourseManage>['course']
  setCourse: ReturnType<typeof useCourseManage>['setCourse']
  sections: ReturnType<typeof useCourseManage>['sections']
  loading: boolean
  error: string | null
  publishing: boolean
  handleTogglePublish: () => void
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
  lessonsMap: Record<string, ManagedLesson[]>
  expandedSections: Set<string>
  toggleSection: (sectionId: string) => void
  handleDeleteSection: (sectionId: string) => void
  handleDeleteLesson: (sectionId: string, lessonId: string) => void
  // Delete section confirmation
  pendingDeleteSectionId: string | null
  confirmDeleteSection: () => Promise<void>
  cancelDeleteSection: () => void
  // Delete lesson confirmation
  pendingDeleteLesson: { sectionId: string; lessonId: string; title: string } | null
  confirmDeleteLesson: () => Promise<void>
  cancelDeleteLesson: () => void
  // Delete course confirmation
  courseDeleteDialogOpen: boolean
  setCourseDeleteDialogOpen: (open: boolean) => void
  isDeletingCourse: boolean
  confirmDeleteCourse: () => Promise<void>
  // Inline section creation
  isAddingSection: boolean
  newSectionTitle: string
  setNewSectionTitle: (title: string) => void
  startAddingSection: () => void
  cancelAddingSection: () => void
  confirmAddSection: () => Promise<void>
  updateSectionTitle: (sectionId: string, newTitle: string, oldTitle: string) => Promise<void>
  // Edit section dialog
  sectionFormOpen: boolean
  editingSection: ManagedSection | null
  openEditSection: (section: ManagedSection) => void
  closeSectionDialog: () => void
  handleSectionSubmit: (data: { title: string; description: string; order: number }) => Promise<void>
  // Lesson panel (Confluence-style — no dialog)
  openAddLesson: (sectionId: string) => void
  openEditLesson: (lesson: ManagedLesson, sectionId: string) => void
  submitLessonFromPanel: (sectionId: string, data: { title: string; content: unknown }, lessonId?: string) => Promise<string | null>
  // Reorder
  reorderSections: (newSections: ManagedSection[], previousSections: ManagedSection[]) => Promise<void>
  reorderLessons: (sectionId: string, newLessons: ManagedLesson[], previousLessons: ManagedLesson[]) => Promise<void>
}


const ManageContext = createContext<ManageContextValue | null>(null)

export function useManageContext() {
  const ctx = useContext(ManageContext)
  if (!ctx) throw new Error('useManageContext must be used within ManageProvider')
  return ctx
}

// ── Provider ───────────────────────────────────────────────────────────────

export function ManageProvider({ courseSlug, children }: { courseSlug: string; children: ReactNode }) {
  const router = useRouter()
  const {
    course,
    setCourse,
    sections,
    setSections,
    loading,
    error,
    publishing,
    handleTogglePublish,
    isDeletingCourse,
    handleDeleteCourse,
  } = useCourseManage(courseSlug)

  const [courseDeleteDialogOpen, setCourseDeleteDialogOpen] = useState(false)

  const confirmDeleteCourse = async () => {
    await handleDeleteCourse(() => {
      setCourseDeleteDialogOpen(false)
      router.push('/creator/courses')
    })
  }

  const { activeView, setActiveView } = useManageView()

  const {
    lessonsMap, setLessonsMap, expandedSections,
    toggleSection, submitLessonFromPanel, deleteLessonOptimistic,
  } = useLessonHandlers({ courseSlug, setSections, activeView, setActiveView })

  const { handleSectionSubmit: submitSection, handleDeleteSection: triggerDelete, executeDeleteSection } = useSectionHandlers({
    courseSlug, setSections, setLessonsMap, activeView, setActiveView,
  })

  const { reorderSections, reorderLessons } = useReorderHandlers({
    courseSlug, setSections, setLessonsMap,
  })

  // ── Delete section confirmation ──────────────────────────────────────────
  const [pendingDeleteSectionId, setPendingDeleteSectionId] = useState<string | null>(null)

  const handleDeleteSection = (sectionId: string) => {
    triggerDelete(sectionId, () => setPendingDeleteSectionId(sectionId))
  }
  const confirmDeleteSection = async () => {
    if (!pendingDeleteSectionId) return
    const id = pendingDeleteSectionId
    setPendingDeleteSectionId(null)
    await executeDeleteSection(id)
  }
  const cancelDeleteSection = () => setPendingDeleteSectionId(null)

  // ── Delete lesson confirmation ───────────────────────────────────────────
  const [pendingDeleteLesson, setPendingDeleteLesson] = useState<{ sectionId: string; lessonId: string; title: string } | null>(null)

  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    const lesson = lessonsMap[sectionId]?.find((l) => l.id === lessonId)
    setPendingDeleteLesson({ sectionId, lessonId, title: lesson?.title ?? '' })
  }
  const confirmDeleteLesson = async () => {
    if (!pendingDeleteLesson) return
    const { sectionId, lessonId } = pendingDeleteLesson
    setPendingDeleteLesson(null)
    await deleteLessonOptimistic(sectionId, lessonId)
  }
  const cancelDeleteLesson = () => setPendingDeleteLesson(null)

  // ── Inline section creation ──────────────────────────────────────────────
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [newSectionTitle, setNewSectionTitle] = useState('')

  const startAddingSection = () => {
    if (!isAddingSection) { setNewSectionTitle(''); setIsAddingSection(true) }
  }
  const cancelAddingSection = () => { setIsAddingSection(false); setNewSectionTitle('') }
  const confirmAddSection = async () => {
    const title = newSectionTitle.trim()
    if (!title) { cancelAddingSection(); return }

    const tempId = `temp-${Date.now()}`
    const optimisticSection: ManagedSection = { id: tempId, title, description: null, order: 9999, lessonCount: 0 }
    setIsAddingSection(false)
    setNewSectionTitle('')
    setSections((prev) => [...prev, optimisticSection])

    try {
      const res = await fetch(`/api/courses/${courseSlug}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Gagal membuat seksi')
      }
      const created = await res.json()
      setSections((prev) => prev.map((s) => s.id === tempId ? { ...created, lessonCount: 0 } : s))
    } catch (err) {
      setSections((prev) => prev.filter((s) => s.id !== tempId))
      const { toast } = await import('sonner')
      toast.error(err instanceof Error ? err.message : 'Gagal membuat seksi')
    }
  }

  const updateSectionTitle = async (sectionId: string, newTitle: string, oldTitle: string) => {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, title: newTitle } : s))
    try {
      const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Gagal memperbarui seksi')
      }
      const { toast } = await import('sonner')
      toast.success('Seksi berhasil diperbarui')
    } catch (err) {
      setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, title: oldTitle } : s))
      const { toast } = await import('sonner')
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui seksi')
    }
  }

  // ── Edit section dialog ──────────────────────────────────────────────────
  const [sectionFormOpen, setSectionFormOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<ManagedSection | null>(null)

  const openEditSection = (s: ManagedSection) => { setEditingSection(s); setSectionFormOpen(true) }
  const closeSectionDialog = () => { setSectionFormOpen(false); setEditingSection(null) }
  const handleSectionSubmit = async (data: { title: string; description: string; order: number }) =>
    submitSection(data, editingSection, closeSectionDialog)

  // ── Lesson panel (Confluence-style) ─────────────────────────────────────
  const openAddLesson = (sectionId: string) => {
    // Expand section in sidebar if not already
    if (!expandedSections.has(sectionId)) toggleSection(sectionId)
    setActiveView({ type: 'lesson-editor', sectionId })
  }

  const openEditLesson = (lesson: ManagedLesson, sectionId: string) => {
    setActiveView({ type: 'lesson-editor', sectionId, lessonId: lesson.id })
  }

  return (
    <ManageContext.Provider value={{
      course, setCourse, sections, loading, error, publishing, handleTogglePublish,
      activeView, setActiveView,
      lessonsMap, expandedSections, toggleSection, handleDeleteSection, handleDeleteLesson,
      pendingDeleteSectionId, confirmDeleteSection, cancelDeleteSection,
      pendingDeleteLesson, confirmDeleteLesson, cancelDeleteLesson,
      courseDeleteDialogOpen, setCourseDeleteDialogOpen, isDeletingCourse, confirmDeleteCourse,
      isAddingSection, newSectionTitle, setNewSectionTitle,
      startAddingSection, cancelAddingSection, confirmAddSection, updateSectionTitle,
      sectionFormOpen, editingSection, openEditSection, closeSectionDialog, handleSectionSubmit,
      openAddLesson, openEditLesson, submitLessonFromPanel,
      reorderSections, reorderLessons,
    }}>
      {children}
    </ManageContext.Provider>
  )
}
