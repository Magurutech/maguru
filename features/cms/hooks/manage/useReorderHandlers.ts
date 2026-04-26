'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import type { ManagedSection } from './useCourseManage'
import type { ManagedLesson } from './useLessonHandlers'

interface UseReorderHandlersProps {
  courseSlug: string
  setSections: React.Dispatch<React.SetStateAction<ManagedSection[]>>
  setLessonsMap: React.Dispatch<React.SetStateAction<Record<string, ManagedLesson[]>>>
}

export function useReorderHandlers({
  courseSlug,
  setSections,
  setLessonsMap,
}: UseReorderHandlersProps) {
  /**
   * Reorder sections — optimistic update + rollback on failure.
   * Caller passes both the new order and the previous order for rollback.
   */
  const reorderSections = useCallback(async (newSections: ManagedSection[], previousSections: ManagedSection[]) => {
    setSections(newSections)

    const items = newSections.map((s, idx) => ({ id: s.id, order: idx + 1 }))

    try {
      const res = await fetch(`/api/courses/${courseSlug}/sections/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      if (!res.ok) throw new Error('Gagal menyimpan urutan seksi')
    } catch {
      setSections(previousSections)
      toast.error('Gagal menyimpan urutan seksi')
    }
  }, [courseSlug, setSections])

  /**
   * Reorder lessons within a section — optimistic update + rollback on failure.
   * Caller passes both the new order and the previous order for rollback.
   */
  const reorderLessons = useCallback(async (sectionId: string, newLessons: ManagedLesson[], previousLessons: ManagedLesson[]) => {
    setLessonsMap((prev) => ({ ...prev, [sectionId]: newLessons }))

    const items = newLessons.map((l, idx) => ({ id: l.id, order: idx + 1 }))

    try {
      const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}/lessons/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      if (!res.ok) throw new Error('Gagal menyimpan urutan pelajaran')
    } catch {
      setLessonsMap((prev) => ({ ...prev, [sectionId]: previousLessons }))
      toast.error('Gagal menyimpan urutan pelajaran')
    }
  }, [courseSlug, setLessonsMap])

  return { reorderSections, reorderLessons }
}
