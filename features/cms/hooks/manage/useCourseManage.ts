'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export interface ManagedCourse {
  id: string
  title: string
  slug: string
  description: string | null
  status: string
  category: string | null
  difficulty: string | null
  outcomes?: string[]
}

export interface ManagedSection {
  id: string
  title: string
  description: string | null
  order: number
  lessonCount: number
}

export interface ManagedLesson {
  id: string
  title: string
  order: number
  contentPreview: string
}

export function useCourseManage(courseSlug: string) {
  const [course, setCourse] = useState<ManagedCourse | null>(null)
  const [sections, setSections] = useState<ManagedSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  const fetchCourse = useCallback(async () => {
    const res = await fetch(`/api/courses/${courseSlug}`)
    if (!res.ok) throw new Error('Course not found')
    return res.json()
  }, [courseSlug])

  const fetchSections = useCallback(async () => {
    const res = await fetch(`/api/courses/${courseSlug}/sections`)
    if (!res.ok) throw new Error('Failed to load sections')
    const data = await res.json()
    return data.sections || []
  }, [courseSlug])

  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        const [courseData, sectionsData] = await Promise.all([fetchCourse(), fetchSections()])
        setCourse(courseData)
        setSections(sectionsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [fetchCourse, fetchSections])

  const handleTogglePublish = async () => {
    if (!course) return
    setPublishing(true)
    try {
      const res = await fetch(`/api/creator/courses/${courseSlug}/publish`, { method: 'PUT' })
      if (!res.ok) throw new Error('Failed to toggle status')
      const data = await res.json()
      setCourse((prev) => prev ? { ...prev, status: data.course.status } : prev)
      toast.success(
        data.course.status === 'PUBLISHED'
          ? 'Kursus berhasil dipublish'
          : 'Kursus berhasil di-unpublish'
      )
    } catch {
      toast.error('Gagal mengubah status kursus')
    } finally {
      setPublishing(false)
    }
  }

  return {
    course, setCourse,
    sections, setSections,
    loading, error,
    publishing, handleTogglePublish,
  }
}
