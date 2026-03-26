'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  useCourseManage,
  useLessonHandlers,
  useSectionHandlers,
  useManageView,
} from '@/features/cms/hooks/manage'
import type { ManagedSection, ManagedLesson, ActiveView } from '@/features/cms/hooks/manage'

// ── Context type ───────────────────────────────────────────────────────────

interface ManageContextValue {
  course: ReturnType<typeof useCourseManage>['course']
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
  sectionFormOpen: boolean
  editingSection: ManagedSection | null
  openAddSection: () => void
  openEditSection: (section: ManagedSection) => void
  closeSectionDialog: () => void
  handleSectionSubmit: (data: { title: string; description: string; order: number }) => Promise<void>
  lessonFormOpen: boolean
  editingLesson: { lesson: ManagedLesson; sectionId: string } | null
  addingLessonToSection: string | null
  openAddLesson: (sectionId: string) => Promise<void>
  openEditLesson: (lesson: ManagedLesson, sectionId: string) => void
  closeLessonDialog: () => void
  handleLessonSubmit: (data: { title: string; content: unknown; order: number }) => Promise<void>
}

const ManageContext = createContext<ManageContextValue | null>(null)

export function useManageContext() {
  const ctx = useContext(ManageContext)
  if (!ctx) throw new Error('useManageContext must be used within ManageProvider')
  return ctx
}

// ── Provider ───────────────────────────────────────────────────────────────

export function ManageProvider({ courseSlug, children }: { courseSlug: string; children: ReactNode }) {
  const { course, sections, setSections, loading, error, publishing, handleTogglePublish } =
    useCourseManage(courseSlug)

  const { activeView, setActiveView } = useManageView()

  const {
    lessonsMap, setLessonsMap, expandedSections,
    toggleSection, handleLessonSubmit: submitLesson, handleDeleteLesson,
  } = useLessonHandlers({ courseSlug, setSections, activeView, setActiveView })

  const { handleSectionSubmit: submitSection, handleDeleteSection } = useSectionHandlers({
    courseSlug, setSections, setLessonsMap, activeView, setActiveView,
  })

  const [sectionFormOpen, setSectionFormOpen] = useState(false)
  const [lessonFormOpen, setLessonFormOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<ManagedSection | null>(null)
  const [editingLesson, setEditingLesson] = useState<{ lesson: ManagedLesson; sectionId: string } | null>(null)
  const [addingLessonToSection, setAddingLessonToSection] = useState<string | null>(null)

  const openAddSection = () => { setEditingSection(null); setSectionFormOpen(true) }
  const openEditSection = (s: ManagedSection) => { setEditingSection(s); setSectionFormOpen(true) }
  const closeSectionDialog = () => { setSectionFormOpen(false); setEditingSection(null) }
  const handleSectionSubmit = async (data: { title: string; description: string; order: number }) =>
    submitSection(data, editingSection, closeSectionDialog)

  const openAddLesson = async (sectionId: string) => {
    if (!expandedSections.has(sectionId)) await toggleSection(sectionId)
    setAddingLessonToSection(sectionId)
    setEditingLesson(null)
    setLessonFormOpen(true)
  }
  const openEditLesson = (lesson: ManagedLesson, sectionId: string) => {
    setEditingLesson({ lesson, sectionId })
    setAddingLessonToSection(null)
    setLessonFormOpen(true)
  }
  const closeLessonDialog = () => {
    setLessonFormOpen(false)
    setEditingLesson(null)
    setAddingLessonToSection(null)
  }
  const handleLessonSubmit = async (data: { title: string; content: unknown; order: number }) =>
    submitLesson(data, editingLesson, addingLessonToSection, closeLessonDialog)

  return (
    <ManageContext.Provider value={{
      course, sections, loading, error, publishing, handleTogglePublish,
      activeView, setActiveView,
      lessonsMap, expandedSections, toggleSection, handleDeleteSection, handleDeleteLesson,
      sectionFormOpen, editingSection, openAddSection, openEditSection, closeSectionDialog, handleSectionSubmit,
      lessonFormOpen, editingLesson, addingLessonToSection,
      openAddLesson, openEditLesson, closeLessonDialog, handleLessonSubmit,
    }}>
      {children}
    </ManageContext.Provider>
  )
}
