'use client'

import { useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { CourseNavigation } from '@/features/cms/components/student/CourseNavigation'
import { LessonViewer } from '@/features/cms/components/student/LessonViewer'
import { ProgressBar } from '@/features/cms/components/student/ProgressBar'
import { LessonNavigation } from '@/features/cms/components/student/LessonNavigation'
import { LearnHeader } from '@/features/cms/components/student/LearnHeader'
import { LearnProvider, useLearnContext } from '@/features/cms/Context/student/LearnContext'

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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-coral mx-auto" />
          <p className="mt-3 text-text-muted text-sm">Memuat kursus...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3 p-8 bg-card border border-border/10 rounded-3xl paper-texture max-w-sm">
          <p className="text-error text-sm font-bold">{error}</p>
          <button
            onClick={() => router.push(`/course/${slug}`)}
            className="w-full py-2 bg-accent-coral hover:bg-accent-coral/95 text-white rounded-full font-bold text-xs shadow-glow transition-all cursor-pointer"
          >
            Kembali ke Kursus
          </button>
        </div>
      </div>
    )
  }

  const allLessons = getAllLessons(sections)
  const currentIndex = currentLesson ? allLessons.findIndex((l) => l.id === currentLesson.id) : -1
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

  // ponytail: Removed SidebarProvider wrapper. The sidebar navigation handles its own state.
  return (
    <div className="relative flex h-screen w-full flex-col bg-background text-foreground overflow-hidden select-none" data-testid="learn-page">
      {/* Ambient backgrounds - ponytail: added premium ambient radial glow */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-bg-canvas"
      >
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.06] dark:opacity-[0.08] bg-accent-coral" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.05] dark:opacity-[0.07] bg-accent-mustard" />
      </div>

      {/* Compact header — back + dashboard + avatar */}
      <LearnHeader courseSlug={slug} />

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)] relative z-10">
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

        <main className="flex-1 flex flex-col overflow-hidden bg-bg-bone/10">
          {/* Progress bar */}
          <div className="border-b border-border/10 bg-bg-bone/45 px-6 py-4 paper-texture">
            <ProgressBar
              percentage={progress.percentage}
              completedLessons={progress.completedLessons}
              totalLessons={progress.totalLessons}
            />
          </div>

          {/* Lesson area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-transparent animate-fade-in" data-testid="lesson-area">
            {lessonLoading ? (
              <div
                className="space-y-4 animate-pulse max-w-4xl mx-auto"
                data-testid="lesson-loading"
              >
                <div className="h-8 bg-bg-bone/80 rounded w-2/3" />
                <div className="h-4 bg-bg-bone/80 rounded w-full" />
                <div className="h-4 bg-bg-bone/80 rounded w-5/6" />
                <div className="h-32 bg-bg-bone/80 rounded w-full mt-4" />
              </div>
            ) : lessonError ? (
              <div
                className="text-center space-y-3 py-12 max-w-4xl mx-auto"
                data-testid="lesson-error"
              >
                <p className="text-error font-bold text-sm">{lessonError}</p>
              </div>
            ) : currentLesson ? (
              <div className="w-full max-w-4xl mx-auto">
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
              <div className="text-center text-text-muted py-12">
                Pilih pelajaran untuk mulai belajar
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function LearnPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const courseSlug = params.slug as string
  const initialLessonId = searchParams.get('lesson')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <LearnProvider courseSlug={courseSlug} initialLessonId={initialLessonId}>
      <LearnPageInner />
    </LearnProvider>
  )
}

