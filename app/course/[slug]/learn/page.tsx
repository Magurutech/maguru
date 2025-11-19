'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'
import { CourseSidebar } from '@/features/course/components/Sidebar/CourseSidebar'
import { ContentRenderer } from '@/features/course/components/ContentRenderer'
import { useCourse } from '@/features/course/hooks/useCourse'
import { getCourseContent } from '@/features/course/api'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Loader2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

function LearningModeContent() {
  const params = useParams()
  const slug = params.slug as string
  const [content, setContent] = useState<string>('')
  const [contentLoading, setContentLoading] = useState(false)

  const {
    course,
    progress,
    loading,
    error,
    currentSectionId,
    currentItemId,
    navigateToItem,
    markCurrentItemCompleted,
    navigateToNextItem,
    navigateToPreviousItem,
    currentContentPath,
    getNavigationInfo,
    isCompleted
  } = useCourse(slug)

  // Load content when current item changes
  useEffect(() => {
    async function loadContent() {
      if (!currentContentPath) return

      try {
        setContentLoading(true)
        const courseContent = await getCourseContent(slug, currentContentPath)
        setContent(courseContent)
      } catch (error) {
        console.error('Error loading content:', error)
        setContent('# Content Not Found\n\nThe requested content could not be loaded.')
      } finally {
        setContentLoading(false)
      }
    }

    if (currentSectionId && currentItemId && currentContentPath) {
      loadContent()
    }
  }, [currentSectionId, currentItemId, currentContentPath, slug])

  // Get current item info
  const getCurrentItem = () => {
    if (!course || !currentSectionId || !currentItemId) return null

    const section = course.sections.find(s => s.id === currentSectionId)
    return section?.items.find(i => i.id === currentItemId) || null
  }

  const navigationInfo = getNavigationInfo()
  const currentItem = getCurrentItem()

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
              <Link href={`/course/${slug}`}>
                <Button className="btn-primary hover-glow">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course Overview
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
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timeline Navigation - Desktop */}
          <div className="lg:col-span-1 hidden lg:block">
            <CourseSidebar
              sections={course.sections}
              currentSectionId={currentSectionId}
              currentItemId={currentItemId}
              completedItems={progress?.completedItems || []}
              onItemSelect={navigateToItem}
              className="sticky top-4 max-h-[calc(100vh-200px)]"
            />
          </div>

          {/* Course Content */}
          <div className="lg:col-span-3">
            {/* Mobile Navigation Bar */}
            <div className="lg:hidden mb-4 bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToPreviousItem()}
                  disabled={!navigationInfo.hasPrevious}
                  className="text-beige-700"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <span className="text-sm text-beige-600">
                  {navigationInfo.currentIndex + 1} / {navigationInfo.totalItems}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToNextItem()}
                  disabled={!navigationInfo.hasNext}
                  className="text-beige-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <Progress value={navigationInfo.progressPercentage} className="h-2" />
            </div>

            {/* Content Header */}
            {currentItem && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-beige-900 mb-2">
                      {currentItem.title}
                    </h2>
                    {currentItem.description && (
                      <p className="text-beige-700 mb-4">
                        {currentItem.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-beige-600">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {currentItem.contentType}
                      </span>
                      {currentItem.duration && (
                        <span>{currentItem.duration}</span>
                      )}
                      {currentItem.isOptional && (
                        <span className="bg-beige-100 text-beige-700 px-2 py-1 rounded text-xs">
                          Optional
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Renderer */}
            <div className="bg-white rounded-lg shadow-sm">
              {contentLoading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-secondary-600" />
                  <p className="text-beige-700">Loading content...</p>
                </div>
              ) : content ? (
                <div className="p-6 lg:p-8">
                  <ContentRenderer
                    content={content}
                    contentType={currentItem?.contentType || 'markdown'}
                  />
                </div>
              ) : (
                <div className="p-12 text-center">
                  <BookOpen className="w-12 h-12 text-beige-300 mx-auto mb-4" />
                  <p className="text-beige-700">No content available for this item.</p>
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigateToPreviousItem()}
                  disabled={!navigationInfo.hasPrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-beige-600">
                    Progress: {navigationInfo.progressPercentage}%
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={markCurrentItemCompleted}
                    className="flex items-center gap-2"
                  >
                    Mark as Complete
                  </Button>
                </div>

                <Button
                  onClick={() => navigateToNextItem()}
                  disabled={!navigationInfo.hasNext}
                  className="flex items-center gap-2 btn-primary hover-glow"
                >
                  {isCompleted ? 'Finish Course' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Timeline - Bottom Sheet Style */}
        <div className="lg:hidden mt-8">
          <CourseSidebar
            sections={course.sections}
            currentSectionId={currentSectionId}
            currentItemId={currentItemId}
            completedItems={progress?.completedItems || []}
            onItemSelect={navigateToItem}
            className="max-h-96"
          />
        </div>
      </div>
    </div>
  )
}

export default function LearningModePage() {
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
      <LearningModeContent />
    </Suspense>
  )
}