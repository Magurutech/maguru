'use client'

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
   * Reorder sections — optimistic update + persist to API
   */
  const reorderSections = async (newSections: ManagedSection[]) => {
    const previousSections = newSections // caller already has previous via closure
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
      // Rollback
      setSections(previousSections)
      toast.error('Gagal menyimpan urutan seksi')
    }
  }

  /**
   * Reorder lessons within a section — optimistic update + persist to API
   */
  const reorderLessons = async (sectionId: string, newLessons: ManagedLesson[]) => {
    const previousLessons = newLessons // caller already has previous via closure
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
      // Rollback
      setLessonsMap((prev) => ({ ...prev, [sectionId]: previousLessons }))
      toast.error('Gagal menyimpan urutan pelajaran')
    }
  }

  return { reorderSections, reorderLessons }
}
