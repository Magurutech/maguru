'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'
import { CourseHeader } from '@/features/course/components/CourseHeader'
import { CourseTabs } from '@/features/course/components/CourseTabs'
import { OverviewRenderer } from '@/features/course/components/OverviewRenderer'
import { TimelinePreview } from '@/features/course/components/TimelinePreview'
import { Course, CourseProgress } from '@/features/course/types/course.types'
import { getCourse } from '@/features/course/api'
import {
  BookOpen,
  Loader2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function CourseDetailContent() {
  const params = useParams()
  const slug = params.slug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [progress, setProgress] = useState<CourseProgress | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load course data
  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true)
        setError(null)

        const response = await getCourse(slug)
        if (!response) {
          throw new Error('Course not found')
        }

        setCourse(response.course)
        setProgress(response.progress)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course')
        console.error('Error loading course:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadCourse()
    }
  }, [slug])

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-beige-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-secondary-600" />
              <p className="text-lg text-beige-700">Loading course...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-beige-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-beige-900 mb-2">Course Not Found</h1>
              <p className="text-beige-700 mb-6">
                {error || 'The course you are looking for does not exist or could not be loaded.'}
              </p>
              <Link href="/course">
                <Button className="btn-primary hover-glow">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-beige-50">
      {/* Decorative Elements */}
      <div className="fixed top-10 right-10 text-6xl opacity-10 whimsical-bounce">📚</div>
      <div className="fixed bottom-10 left-10 text-4xl opacity-20 whimsical-bounce animation-delay-1000">
        🎓
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <CourseHeader
          course={course}
          progress={progress}
          showStartButton={true}
          startButtonHref={`/course/${slug}/learn`}
        />

        {/* Tab Interface */}
        <CourseTabs course={course} progress={progress} />
      </div>
    </div>
  )
}

export default function CourseDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-beige-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-secondary-600" />
                <p className="text-lg text-beige-700">Loading course...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CourseDetailContent />
    </Suspense>
  )
}