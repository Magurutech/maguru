'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export interface LearnLesson {
  id: string
  title: string
  order: number
  contentPreview: string
}

export interface FullLesson {
  id: string
  title: string
  order: number
  content: {
    content: Record<string, unknown>
    version: number
    lastEdit: string
  }
  sectionId: string
}

interface UseLessonLearnProps {
  courseSlug: string
  completedLessonIds: Set<string>
  sections: Array<{
    id: string
    lessons?: Array<{
      id: string
      title: string
      order: number
      contentPreview: string
    }>
  }>
}

export function useLessonLearn({ courseSlug, completedLessonIds, sections }: UseLessonLearnProps) {
  const [lessonsMap, setLessonsMap] = useState<Record<string, LearnLesson[]>>({})
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [currentLesson, setCurrentLesson] = useState<FullLesson | null>(null)
  const [lessonLoading, setLessonLoading] = useState(false)
  const [lessonError, setLessonError] = useState<string | null>(null)

  // Pre-populate lessonsMap from sections data (fetched with ?include=lessons)
  useEffect(() => {
    const initialLessonsMap: Record<string, LearnLesson[]> = {}
    const initialExpandedSections = new Set<string>()

    sections.forEach((section) => {
      if (section.lessons && section.lessons.length > 0) {
        initialLessonsMap[section.id] = section.lessons
        initialExpandedSections.add(section.id) // Auto-expand sections with lessons
      }
    })

    setLessonsMap(initialLessonsMap)
    setExpandedSections(initialExpandedSections)
  }, [sections])

  const fetchLessons = useCallback(
    async (sectionId: string) => {
      const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}/lessons`)
      if (!res.ok) throw new Error('Gagal memuat pelajaran')
      const data = await res.json()
      return (data.lessons || []) as LearnLesson[]
    },
    [courseSlug]
  )

  const toggleSection = useCallback(
    async (sectionId: string) => {
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
    },
    [expandedSections, lessonsMap, fetchLessons]
  )

  const selectLesson = useCallback(
    async (lessonId: string, sectionId: string) => {
      setLessonError(null)
      setLessonLoading(true)
      try {
        const res = await fetch(
          `/api/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`
        )
        if (!res.ok) throw new Error('Pelajaran tidak ditemukan')
        const data = await res.json()
        setCurrentLesson({
          id: data.id,
          title: data.title,
          order: data.order,
          content: data.content,
          sectionId,
        })
      } catch (err) {
        setLessonError(err instanceof Error ? err.message : 'Gagal memuat pelajaran')
      } finally {
        setLessonLoading(false)
      }
    },
    [courseSlug]
  )

  // Build flat ordered list of all lessons across all sections (for prev/next nav)
  const getAllLessons = useCallback(
    (sections: { id: string }[]) => {
      return sections.flatMap((s) =>
        (lessonsMap[s.id] || []).map((l) => ({ ...l, sectionId: s.id }))
      )
    },
    [lessonsMap]
  )

  // Expand a section and auto-select first lesson (used on initial load)
  const expandAndSelect = useCallback(
    async (sectionId: string, lessonId?: string) => {
      const next = new Set(expandedSections)
      next.add(sectionId)
      setExpandedSections(next)

      let lessons = lessonsMap[sectionId]
      if (!lessons) {
        try {
          lessons = await fetchLessons(sectionId)
          setLessonsMap((prev) => ({ ...prev, [sectionId]: lessons! }))
        } catch {
          return
        }
      }

      const targetId = lessonId ?? lessons[0]?.id
      if (targetId) {
        await selectLesson(targetId, sectionId)
      }
    },
    [expandedSections, lessonsMap, fetchLessons, selectLesson]
  )

  return {
    lessonsMap,
    expandedSections,
    currentLesson,
    lessonLoading,
    lessonError,
    setLessonError,
    toggleSection,
    selectLesson,
    getAllLessons,
    expandAndSelect,
  }
}
