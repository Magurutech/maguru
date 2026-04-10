'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { CourseProgress } from './useCourseLearn'

interface UseProgressHandlersProps {
  setCompletedLessonIds: React.Dispatch<React.SetStateAction<Set<string>>>
  setProgress: React.Dispatch<React.SetStateAction<CourseProgress>>
}

export function useProgressHandlers({
  setCompletedLessonIds,
  setProgress,
}: UseProgressHandlersProps) {
  const [completing, setCompleting] = useState(false)

  const markComplete = useCallback(
    async (lessonId: string) => {
      if (completing) return
      setCompleting(true)
      try {
        const res = await fetch(`/api/progress/lesson/${lessonId}/complete`, {
          method: 'POST',
        })
        if (!res.ok) throw new Error('Gagal menyelesaikan pelajaran')

        // Optimistic update
        setCompletedLessonIds((prev) => new Set([...prev, lessonId]))
        setProgress((prev) => {
          const newCompleted = prev.completedLessons + 1
          return {
            ...prev,
            completedLessons: newCompleted,
            percentage:
              prev.totalLessons > 0
                ? Math.round((newCompleted / prev.totalLessons) * 10000) / 100
                : 0,
          }
        })

        toast.success('Pelajaran berhasil diselesaikan!')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Gagal menyelesaikan pelajaran')
      } finally {
        setCompleting(false)
      }
    },
    [completing, setCompletedLessonIds, setProgress]
  )

  return { completing, markComplete }
}
