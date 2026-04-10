'use client'

import { useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { SidebarProvider } from '@/components/ui/sidebar'
import { CourseNavigation } from '@/features/cms/components/student/CourseNavigation'
import { LessonViewer } from '@/features/cms/components/student/LessonViewer'
import { ProgressBar } from '@/features/cms/components/student/ProgressBar'
import { LessonNavigation } from '@/features/cms/components/student/LessonNavigation'
import { LearnHeader } from '@/features/cms/components/student/LearnHeader'
import {
  LearnProvider,
  useLearnContext,
} from '@/features/cms/context/student/LearnContext'

/**
 * Student Learn Page
 *
 * Thin orchestrator — state via LearnProvider (Context API).
 * Lives in route group (learn) to avoid CourseLayout Navbar.
 *
 * Requirements: 5.1-5.9, 6.1-6.8, 7.1-7.7
 */

function LearnPageInner() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const {
    sections,
    loading,
    error,
    completedLessonIds,
    progress,
    markComplete,
    lessonsMap,
    toggleSection,
    currentLesson,
    lessonLoading,
    lessonError,
    selectLesson,
    getAllLessons,
  } = useLearnContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-beige-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-merah-500 mx-auto" />
          <p className="mt-3 text-beige-600">Memuat kursus...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-beige-50">
        <div className="text-center space-y-3">
          <p className="text-merah-600">{error}</p>
          <button
            onClick={() => router.push(`/course/${slug}`)}
            className="px-4 py-2 border border-beige-300 rounded-lg hover:bg-beige-100 text-beige-700"
          >
            Kembali ke Kursus
          </button>
        </div>
      </div>
    )
  }

  const allLessons = getAllLessons(sections)
  const currentIndex = currentLesson
    ? allLessons.findIndex((l) => l.id === currentLesson.id)
    : -1
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : undefined
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : undefined

  const handleLessonClick = (lessonId: string) => {
    for (const [sectionId, lessons] of Object.entries(lessonsMap)) {
      if (lessons.some((l) => l.id === lessonId)) {
        selectLesson(lessonId, sectionId)
        return
      }
    }
    for (const section of sections) {
      if (!lessonsMap[section.id]) toggleSection(section.id)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col">
        {/* Compact header — back + dashboard + avatar */}
        <LearnHeader courseSlug={slug} />

        <div className="flex flex-1 overflow-hidden">
          <CourseNavigation
          sections={sections.map((s) => ({
            id: s.id,
            title: s.title,
            lessons: (lessonsMap[s.id] || []).map((l) => ({
              id: l.id,
              title: l.title,
              completed: completedLessonIds.has(l.id),
            })),
          }))}
          currentLessonId={currentLesson?.id || ''}
          onLessonClick={handleLessonClick}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Progress bar */}
          <div className="border-b border-beige-300 bg-beige-100 px-6 py-3">
            <ProgressBar
              percentage={progress.percentage}
              completedLessons={progress.completedLessons}
              totalLessons={progress.totalLessons}
            />
          </div>

          {/* Lesson area */}
          <div className="flex-1 overflow-y-auto p-6 bg-beige-50">
            {lessonLoading ? (
              <div className="space-y-4 animate-pulse max-w-4xl mx-auto">
                <div className="h-8 bg-beige-200 rounded w-2/3" />
                <div className="h-4 bg-beige-200 rounded w-full" />
                <div className="h-4 bg-beige-200 rounded w-5/6" />
                <div className="h-32 bg-beige-200 rounded w-full mt-4" />
              </div>
            ) : lessonError ? (
              <div className="text-center space-y-3 py-12 max-w-4xl mx-auto">
                <p className="text-merah-600">{lessonError}</p>
              </div>
            ) : currentLesson ? (
              <div className="w-full max-w-5xl mx-auto">
                <LessonViewer lesson={currentLesson} />
                <div className="mt-8">
                  <LessonNavigation
                    previousLesson={prevLesson}
                    nextLesson={nextLesson}
                    onNavigate={handleLessonClick}
                    onMarkComplete={() => markComplete(currentLesson.id)}
                    isCompleted={completedLessonIds.has(currentLesson.id)}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-beige-500 py-12">
                Pilih pelajaran untuk mulai belajar
              </div>
            )}
          </div>
        </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default function LearnPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const courseSlug = params.slug as string
  const initialLessonId = searchParams.get('lesson')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <LearnProvider courseSlug={courseSlug} initialLessonId={initialLessonId}>
      <LearnPageInner />
    </LearnProvider>
  )
}
