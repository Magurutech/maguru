'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { ManagedSection } from './useCourseManage'
import type { ActiveView } from './useManageView'

export interface ManagedLesson {
  id: string
  title: string
  order: number
  contentPreview: string
}

interface UseLessonHandlersProps {
  courseSlug: string
  setSections: React.Dispatch<React.SetStateAction<ManagedSection[]>>
  activeView: ActiveView
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>
}

export function useLessonHandlers({
  courseSlug,
  setSections,
  activeView,
  setActiveView,
}: UseLessonHandlersProps) {
  const [lessonsMap, setLessonsMap] = useState<Record<string, ManagedLesson[]>>({})
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const fetchLessons = useCallback(async (sectionId: string) => {
    const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}/lessons`)
    if (!res.ok) throw new Error('Failed to load lessons')
    const data = await res.json()
    return data.lessons || []
  }, [courseSlug])

  const toggleSection = async (sectionId: string) => {
    const next = new Set(expandedSections)
    if (next.has(sectionId)) {
      next.delete(sectionId)
    } else {
      next.add(sectionId)
      if (!lessonsMap[sectionId]) {
        try {
          const lessons = await fetchLessons(sectionId)
          setLessonsMap((prev) => ({ ...prev, [sectionId]: lessons }))
        } catch {
          toast.error('Gagal memuat pelajaran')
        }
      }
    }
    setExpandedSections(next)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLessonSubmit = async (
    data: { title: string; content: any; order: number },
    editingLesson: { lesson: ManagedLesson; sectionId: string } | null,
    addingLessonToSection: string | null,
    onDone: () => void
  ) => {
    try {
      if (editingLesson) {
        const { lesson, sectionId } = editingLesson
        const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}/lessons/${lesson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || 'Gagal memperbarui pelajaran')
        }
        const updated = await res.json()
        setLessonsMap((prev) => ({
          ...prev,
          [sectionId]: (prev[sectionId] || []).map((l) => (l.id === lesson.id ? { ...l, ...updated } : l)),
        }))
        toast.success('Pelajaran berhasil diperbarui')
      } else if (addingLessonToSection) {
        const res = await fetch(`/api/courses/${courseSlug}/sections/${addingLessonToSection}/lessons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || 'Gagal membuat pelajaran')
        }
        const created = await res.json()
        setLessonsMap((prev) => ({
          ...prev,
          [addingLessonToSection]: [...(prev[addingLessonToSection] || []), created],
        }))
        setSections((prev) =>
          prev.map((s) => s.id === addingLessonToSection ? { ...s, lessonCount: s.lessonCount + 1 } : s)
        )
        toast.success('Pelajaran berhasil dibuat')
      }
      onDone()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan')
    }
  }

  const handleDeleteLesson = async (sectionId: string, lessonId: string) => {
    if (!confirm('Hapus pelajaran ini?')) return
    const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`, {
      method: 'DELETE',
    })
    if (!res.ok) { toast.error('Gagal menghapus pelajaran'); return }
    setLessonsMap((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).filter((l) => l.id !== lessonId),
    }))
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, lessonCount: s.lessonCount - 1 } : s))
    )
    if (activeView.type === 'lesson' && activeView.lessonId === lessonId) {
      setActiveView({ type: 'section', sectionId })
    }
    toast.success('Pelajaran berhasil dihapus')
  }

  return {
    lessonsMap, setLessonsMap,
    expandedSections,
    toggleSection,
    handleLessonSubmit,
    handleDeleteLesson,
  }
}
