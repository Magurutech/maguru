'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import {
  useCourseLearn,
  useLessonLearn,
  useProgressHandlers,
} from '@/features/cms/hooks/learn'
import type { LearnSection, CourseProgress, LearnLesson, FullLesson } from '@/features/cms/hooks/learn'

// ── Context type ───────────────────────────────────────────────────────────

interface LearnContextValue {
  // Course & sections
  sections: LearnSection[]
  loading: boolean
  error: string | null
  preTestCompleted: boolean
  preTestScore: number | null
  fetchData: () => Promise<void>
  // Progress
  completedLessonIds: Set<string>
  progress: CourseProgress
  completing: boolean
  markComplete: (lessonId: string) => Promise<void>
  // Lessons
  lessonsMap: Record<string, LearnLesson[]>
  expandedSections: Set<string>
  toggleSection: (sectionId: string) => void
  currentLesson: FullLesson | null
  lessonLoading: boolean
  lessonError: string | null
  selectLesson: (lessonId: string, sectionId: string) => Promise<void>
  getAllLessons: (sections: { id: string }[]) => (LearnLesson & { sectionId: string })[]
}

const LearnContext = createContext<LearnContextValue | null>(null)

export function useLearnContext() {
  const ctx = useContext(LearnContext)
  if (!ctx) throw new Error('useLearnContext must be used within LearnProvider')
  return ctx
}

// ── Provider ───────────────────────────────────────────────────────────────

interface LearnProviderProps {
  courseSlug: string
  initialLessonId?: string | null
  children: ReactNode
}

export function LearnProvider({ courseSlug, initialLessonId, children }: LearnProviderProps) {
  const {
    sections,
    preTestCompleted,
    preTestScore,
    fetchData,
    completedLessonIds,
    setCompletedLessonIds,
    progress,
    setProgress,
    loading,
    error,
  } = useCourseLearn(courseSlug)

  const {
    lessonsMap,
    expandedSections,
    currentLesson,
    lessonLoading,
    lessonError,
    toggleSection,
    selectLesson,
    getAllLessons,
    expandAndSelect,
  } = useLessonLearn({ courseSlug, sections })

  const { completing, markComplete } = useProgressHandlers({
    setCompletedLessonIds,
    setProgress,
  })

  // Save last visited lesson to localStorage for auto-resume
  useEffect(() => {
    if (!currentLesson?.id || typeof window === 'undefined') return
    try {
      localStorage.setItem(`maguru_last_lesson_${courseSlug}`, currentLesson.id)
    } catch {
      // Ignore storage access exceptions in private mode
    }
  }, [currentLesson?.id, courseSlug])

  // Auto-load lesson on mount: handles URL param -> localStorage resume -> first uncompleted -> first lesson
  useEffect(() => {
    if (loading || sections.length === 0) return

    const resumeLesson = async () => {
      // 1. If explicit ?lesson= in URL, find and load it
      const targetId =
        initialLessonId ||
        (typeof window !== 'undefined'
          ? localStorage.getItem(`maguru_last_lesson_${courseSlug}`)
          : null)

      if (targetId) {
        for (const section of sections) {
          try {
            const res = await fetch(
              `/api/courses/${courseSlug}/sections/${section.id}/lessons`
            )
            if (!res.ok) continue
            const data = await res.json()
            const lessons = data.lessons || []
            const found = lessons.find((l: { id: string }) => l.id === targetId)
            if (found) {
              await expandAndSelect(section.id, targetId)
              return
            }
          } catch {
            // continue searching next section
          }
        }
      }

      // 2. Otherwise: find the first uncompleted lesson in an unlocked section
      for (const section of sections) {
        if (section.isLocked) continue
        try {
          const res = await fetch(
            `/api/courses/${courseSlug}/sections/${section.id}/lessons`
          )
          if (!res.ok) continue
          const data = await res.json()
          const lessons = data.lessons || []
          const firstUncompleted = lessons.find(
            (l: { id: string }) => !completedLessonIds.has(l.id)
          )
          if (firstUncompleted) {
            await expandAndSelect(section.id, firstUncompleted.id)
            return
          }
        } catch {
          // continue
        }
      }

      // 3. Fallback: first lesson of first section
      await expandAndSelect(sections[0].id)
    }

    resumeLesson()
    // Only run once when sections first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, sections.length === 0 ? 0 : 1])

  return (
    <LearnContext.Provider
      value={{
        sections,
        loading,
        error,
        preTestCompleted,
        preTestScore,
        fetchData,
        completedLessonIds,
        progress,
        completing,
        markComplete,
        lessonsMap,
        expandedSections,
        toggleSection,
        currentLesson,
        lessonLoading,
        lessonError,
        selectLesson,
        getAllLessons,
      }}
    >
      {children}
    </LearnContext.Provider>
  )
}
