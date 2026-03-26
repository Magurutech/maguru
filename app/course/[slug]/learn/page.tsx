'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { CourseNavigation } from '@/features/cms/components/student/CourseNavigation'
import { LessonViewer } from '@/features/cms/components/student/LessonViewer'
import { ProgressBar } from '@/features/cms/components/student/ProgressBar'
import { LessonNavigation } from '@/features/cms/components/student/LessonNavigation'
import { SidebarProvider } from '@/components/ui/sidebar'
import { toast } from 'sonner'

/**
 * Student Learn Page
 * 
 * Main learning interface for students to view course content and track progress.
 * Integrates all CMS student components into a cohesive learning experience.
 * 
 * Requirements: 5.1-5.9, 6.1-6.8, 7.1-7.7
 * Tasks: 11.1, 11.2, 11.3, 11.4
 */

interface Section {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  order: number
  content: {
    content: Record<string, unknown>
    version: number
    lastEdit: string
  }
  completed: boolean
}

interface CourseProgress {
  percentage: number
  completedLessons: number
  totalLessons: number
}

export default function LearnPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  
  const [sections, setSections] = useState<Section[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<CourseProgress>({
    percentage: 0,
    completedLessons: 0,
    totalLessons: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [lessonLoading, setLessonLoading] = useState(false)
  const [completing, setCompleting] = useState(false)

  // Get lesson ID from URL query params
  const lessonId = searchParams.get('lesson')

  // Task 11.2: Fetch sections and lessons
  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true)
        setError(null)
        // retryCount is a dependency so retries re-trigger this effect

        // Fetch sections with lessons
        const sectionsRes = await fetch(`/api/courses/${slug}/sections`)
        if (!sectionsRes.ok) {
          throw new Error('Failed to load course sections')
        }
        const sectionsData = await sectionsRes.json()
        
        // Fetch progress for all lessons
        const progressRes = await fetch(`/api/progress/course/${slug}`)
        const progressData = progressRes.ok ? await progressRes.json() : null

        // Merge progress data with lessons
        const sectionsWithProgress = sectionsData.sections.map((section: Section) => ({
          ...section,
          lessons: section.lessons.map((lesson: Lesson) => ({
            ...lesson,
            completed: progressData?.completedLessons?.includes(lesson.id) || false
          }))
        }))

        setSections(sectionsWithProgress)
        
        // Set progress
        if (progressData) {
          setProgress({
            percentage: progressData.percentage || 0,
            completedLessons: progressData.completedLessons?.length || 0,
            totalLessons: progressData.totalLessons || 0
          })
        }

        // Load first lesson if no lesson specified
        if (!lessonId && sectionsWithProgress.length > 0 && sectionsWithProgress[0].lessons.length > 0) {
          const firstLesson = sectionsWithProgress[0].lessons[0]
          router.replace(`/course/${slug}/learn?lesson=${firstLesson.id}`)
        }
      } catch (err) {
        console.error('Error fetching course data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load course')
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [slug, router, lessonId, retryCount])

  // Task 11.2: Fetch specific lesson content
  useEffect(() => {
    async function fetchLesson() {
      if (!lessonId || sections.length === 0) return

      try {
        setLessonLoading(true)
        // Find lesson in sections to get sectionId
        let sectionId: string | null = null
        let lessonData: Lesson | null = null

        for (const section of sections) {
          const found = section.lessons.find(l => l.id === lessonId)
          if (found) {
            sectionId = section.id
            lessonData = found
            break
          }
        }

        if (!sectionId) {
          setError('Lesson not found')
          return
        }

        // Fetch full lesson content
        const res = await fetch(`/api/courses/${slug}/sections/${sectionId}/lessons/${lessonId}`)
        if (!res.ok) {
          throw new Error('Failed to load lesson')
        }

        const fullLesson = await res.json()
        setCurrentLesson({
          ...lessonData!,
          content: fullLesson.content
        })
      } catch (err) {
        console.error('Error fetching lesson:', err)
        setError(err instanceof Error ? err.message : 'Failed to load lesson')
      } finally {
        setLessonLoading(false)
      }
    }

    fetchLesson()
  }, [lessonId, sections, slug])

  // Task 11.3: Mark lesson as complete
  const handleMarkComplete = async () => {
    if (!currentLesson || completing) return

    try {
      setCompleting(true)
      const res = await fetch(`/api/progress/lesson/${currentLesson.id}/complete`, {
        method: 'POST'
      })

      if (!res.ok) {
        throw new Error('Failed to mark lesson as complete')
      }

      // Update local state
      setSections(prev => prev.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson =>
          lesson.id === currentLesson.id
            ? { ...lesson, completed: true }
            : lesson
        )
      })))

      setCurrentLesson(prev => prev ? { ...prev, completed: true } : null)

      // Update progress
      setProgress(prev => ({
        ...prev,
        completedLessons: prev.completedLessons + 1,
        percentage: ((prev.completedLessons + 1) / prev.totalLessons) * 100
      }))

      toast.success('Pelajaran berhasil diselesaikan!')
    } catch (err) {
      console.error('Error marking lesson complete:', err)
      toast.error('Gagal menyelesaikan pelajaran. Silakan coba lagi.')
    } finally {
      setCompleting(false)
    }
  }

  // Handle lesson navigation
  const handleLessonClick = (newLessonId: string) => {
    router.push(`/course/${slug}/learn?lesson=${newLessonId}`)
  }

  // Get previous and next lessons
  const getPrevNextLessons = () => {
    if (!currentLesson) return { prev: undefined, next: undefined }

    const allLessons = sections.flatMap(s => s.lessons)
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id)

    return {
      prev: currentIndex > 0 ? allLessons[currentIndex - 1] : undefined,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : undefined
    }
  }

  const { prev, next } = getPrevNextLessons()

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="error-state">
        <div className="text-center space-y-3">
          <p className="text-red-600">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setRetryCount((c) => c + 1)}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              data-testid="retry-btn"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => router.push(`/course/${slug}`)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Kembali ke Kursus
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Task 11.1: Main layout with sidebar, content, and progress bar
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar Navigation */}
        <CourseNavigation
          sections={sections.map(s => ({
            id: s.id,
            title: s.title,
            lessons: s.lessons.map(l => ({
              id: l.id,
              title: l.title,
              completed: l.completed
            }))
          }))}
          currentLessonId={currentLesson?.id || ''}
          onLessonClick={handleLessonClick}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Progress Bar */}
          <div className="border-b p-4">
            <ProgressBar
              percentage={progress.percentage}
              completedLessons={progress.completedLessons}
              totalLessons={progress.totalLessons}
            />
          </div>

          {/* Lesson Content */}
          <div className="flex-1 overflow-y-auto p-6" data-testid="main-content-area">
            {lessonLoading ? (
              <div className="space-y-4 animate-pulse" data-testid="lesson-loading-skeleton">
                <div className="h-8 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
                <div className="h-32 bg-gray-200 rounded w-full mt-4" />
              </div>
            ) : currentLesson ? (
              <>
                <div data-testid="lesson-content-area">
                <LessonViewer
                  lesson={currentLesson}
                  onMarkComplete={handleMarkComplete}
                  isCompleted={currentLesson.completed}
                  completing={completing}
                />
                </div>

                {/* Lesson Navigation */}
                <div className="mt-8">
                  <LessonNavigation
                    previousLesson={prev}
                    nextLesson={next}
                    onNavigate={handleLessonClick}
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-gray-600">
                Select a lesson to begin
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
