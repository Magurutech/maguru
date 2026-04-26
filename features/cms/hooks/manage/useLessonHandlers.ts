'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { ManagedSection } from './useCourseManage'
import type { ActiveView } from './useManageView'
import { toastError } from '@/features/cms/utils/error-toast'

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

  /**
   * Submit lesson from inline panel (Confluence-style editor).
   * Returns created/updated lesson id on success, null on failure.
   */
  const submitLessonFromPanel = async (
    sectionId: string,
    data: { title: string; content: unknown },
    lessonId?: string
  ): Promise<string | null> => {
    try {
      if (lessonId) {
        // Edit mode
        const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`, {
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
          [sectionId]: (prev[sectionId] || []).map((l) => l.id === lessonId ? { ...l, ...updated } : l),
        }))
        toast.success('Pelajaran berhasil diperbarui')
        return lessonId
      } else {
        // Create mode — order auto-calculated by backend
        const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}/lessons`, {
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
          [sectionId]: [...(prev[sectionId] || []), created],
        }))
        setSections((prev) =>
          prev.map((s) => s.id === sectionId ? { ...s, lessonCount: s.lessonCount + 1 } : s)
        )
        toast.success('Pelajaran berhasil dibuat')
        return created.id
      }
    } catch (err) {
      toastError(err, 'Terjadi kesalahan')
      return null
    }
  }

  const deleteLessonOptimistic = async (sectionId: string, lessonId: string) => {
    // Optimistic update — remove from UI immediately before API responds
    const previousLessons = lessonsMap[sectionId] || []
    setLessonsMap((prev) => ({
      ...prev,
      [sectionId]: previousLessons.filter((l) => l.id !== lessonId),
    }))
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, lessonCount: s.lessonCount - 1 } : s))
    )
    if (activeView.type === 'lesson' && activeView.lessonId === lessonId) {
      setActiveView({ type: 'section', sectionId })
    }

    const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      // Rollback on failure
      setLessonsMap((prev) => ({ ...prev, [sectionId]: previousLessons }))
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, lessonCount: s.lessonCount + 1 } : s))
      )
      toast.error('Gagal menghapus pelajaran')
      return
    }

    toast.success('Pelajaran berhasil dihapus')
  }

  return {
    lessonsMap, setLessonsMap,
    expandedSections,
    toggleSection,
    submitLessonFromPanel,
    deleteLessonOptimistic,
  }
}
