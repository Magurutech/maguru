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

      let prevCompletedSnapshot: Set<string> | null = null
      let prevProgressSnapshot: CourseProgress | null = null

      // 1. True Optimistic UI Update immediately before network request
      setCompletedLessonIds((prev) => {
        prevCompletedSnapshot = new Set(prev)
        return new Set([...prev, lessonId])
      })
      setProgress((prev) => {
        prevProgressSnapshot = { ...prev }
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

      try {
        const res = await fetch(`/api/progress/lesson/${lessonId}/complete`, {
          method: 'POST',
        })

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Sesi login telah berakhir. Silakan login kembali untuk menyimpan kemajuan.')
          }
          const errData = await res.json().catch(() => null)
          throw new Error(errData?.error || 'Gagal menyelesaikan pelajaran')
        }

        toast.success('Pelajaran berhasil diselesaikan!')
      } catch (err) {
        // Rollback state cleanly to previous snapshot on failure
        if (prevCompletedSnapshot) {
          setCompletedLessonIds(prevCompletedSnapshot)
        }
        if (prevProgressSnapshot) {
          setProgress(prevProgressSnapshot)
        }
        toast.error(err instanceof Error ? err.message : 'Gagal menyelesaikan pelajaran')
      } finally {
        setCompleting(false)
      }
    },
    [completing, setCompletedLessonIds, setProgress]
  )

  return { completing, markComplete }
}
