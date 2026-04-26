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

  // Auto-load initial lesson once sections are ready
  useEffect(() => {
    if (loading || sections.length === 0) return

    if (initialLessonId) {
      // Try each section until we find the one containing the lesson
      const tryFindLesson = async () => {
        for (const section of sections) {
          try {
            const res = await fetch(
              `/api/courses/${courseSlug}/sections/${section.id}/lessons`
            )
            if (!res.ok) continue
            const data = await res.json()
            const lessons = data.lessons || []
            const found = lessons.find((l: { id: string }) => l.id === initialLessonId)
            if (found) {
              await expandAndSelect(section.id, initialLessonId)
              return
            }
          } catch {
            // continue to next section
          }
        }
        // Lesson not found in any section — fall back to first lesson
        await expandAndSelect(sections[0].id)
      }
      tryFindLesson()
    } else {
      // No lesson in URL — auto-select first lesson of first section
      expandAndSelect(sections[0].id)
    }
    // Only run once when sections first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, sections.length === 0 ? 0 : 1])

  return (
    <LearnContext.Provider
      value={{
        sections,
        loading,
        error,
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
