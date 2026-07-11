'use client'

import { useState, useEffect, useCallback } from 'react'

export interface LearnSection {
  id: string
  title: string
  order: number
  lessonCount: number
  isLocked?: boolean
  lessons?: Array<{
    id: string
    title: string
    order: number
    contentPreview: string
  }>
}

export interface CourseProgress {
  percentage: number
  completedLessons: number
  totalLessons: number
}

export function useCourseLearn(courseSlug: string) {
  const [sections, setSections] = useState<LearnSection[]>([])
  const [preTestCompleted, setPreTestCompleted] = useState(false)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState<CourseProgress>({
    percentage: 0,
    completedLessons: 0,
    totalLessons: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch sections with lessons in single request for student learn page
      const [sectionsRes, progressRes, completedRes] = await Promise.all([
        fetch(`/api/courses/${courseSlug}/sections?include=lessons`),
        fetch(`/api/progress/course/${courseSlug}`),
        fetch(`/api/progress/course/${courseSlug}/lessons`),
      ])

      if (!sectionsRes.ok) throw new Error('Gagal memuat data kursus')

      const sectionsData = await sectionsRes.json()
      setSections(sectionsData.sections || [])
      setPreTestCompleted(sectionsData.preTestCompleted ?? false)

      if (progressRes.ok) {
        const progressData = await progressRes.json()
        setProgress({
          percentage: progressData.percentage ?? 0,
          completedLessons: progressData.completedLessons ?? 0,
          totalLessons: progressData.totalLessons ?? 0,
        })
      }

      if (completedRes.ok) {
        const completedData = await completedRes.json()
        setCompletedLessonIds(new Set(completedData.completedLessonIds ?? []))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat kursus')
    } finally {
      setLoading(false)
    }
  }, [courseSlug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    sections,
    preTestCompleted,
    setPreTestCompleted,
    fetchData,
    completedLessonIds,
    setCompletedLessonIds,
    progress,
    setProgress,
    loading,
    error,
  }
}
