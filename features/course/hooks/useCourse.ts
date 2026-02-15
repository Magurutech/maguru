'use client'

import { useState, useEffect, useMemo } from 'react'
import { Course, CourseDetailResponse, CourseProgress } from '../types/course.types'
import { getCourse, markItemCompleted } from '../api'

interface UseCourseOptions {
  autoSave?: boolean
}

export function useCourse(slug: string, options: UseCourseOptions = {}) {
  const [course, setCourse] = useState<Course | null>(null)
  const [progress, setProgress] = useState<CourseProgress | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSectionId, setCurrentSectionId] = useState<string>('')
  const [currentItemId, setCurrentItemId] = useState<string>('')

  const { autoSave = true } = options

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

        // Set current item based on progress or default to first item
        if (response.progress?.currentItemId && response.progress?.currentSectionId) {
          setCurrentSectionId(response.progress.currentSectionId)
          setCurrentItemId(response.progress.currentItemId)
        } else if (response.course.sections.length > 0 && response.course.sections[0].items.length > 0) {
          setCurrentSectionId(response.course.sections[0].id)
          setCurrentItemId(response.course.sections[0].items[0].id)
        }
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

  // Navigate to specific item
  const navigateToItem = (sectionId: string, itemId: string) => {
    if (!course) return

    const section = course.sections.find(s => s.id === sectionId)
    const item = section?.items.find(i => i.id === itemId)

    if (!section || !item) {
      console.error('Section or item not found:', { sectionId, itemId })
      return
    }

    setCurrentSectionId(sectionId)
    setCurrentItemId(itemId)

    // Auto-save progress if enabled
    if (autoSave && progress) {
      const updatedProgress = markItemCompleted(progress.courseId, sectionId, itemId)
      setProgress(updatedProgress)
    }
  }

  // Mark current item as completed
  const markCurrentItemCompleted = () => {
    if (!currentSectionId || !currentItemId || !course) return

    const updatedProgress = markItemCompleted(course.slug, currentSectionId, currentItemId)
    setProgress(updatedProgress)
  }

  // Navigate to next item
  const navigateToNextItem = () => {
    if (!course || !currentSectionId || !currentItemId) return null

    const currentSectionIndex = course.sections.findIndex(s => s.id === currentSectionId)
    const currentItemIndex = course.sections[currentSectionIndex]?.items.findIndex(i => i.id === currentItemId)

    if (currentSectionIndex === -1 || currentItemIndex === -1) return null

    // Try next item in current section
    if (currentItemIndex < course.sections[currentSectionIndex].items.length - 1) {
      const nextItem = course.sections[currentSectionIndex].items[currentItemIndex + 1]
      navigateToItem(currentSectionId, nextItem.id)
      return nextItem
    }

    // Try first item in next section
    if (currentSectionIndex < course.sections.length - 1) {
      const nextSection = course.sections[currentSectionIndex + 1]
      if (nextSection.items.length > 0) {
        const nextItem = nextSection.items[0]
        navigateToItem(nextSection.id, nextItem.id)
        return nextItem
      }
    }

    return null
  }

  // Navigate to previous item
  const navigateToPreviousItem = () => {
    if (!course || !currentSectionId || !currentItemId) return null

    const currentSectionIndex = course.sections.findIndex(s => s.id === currentSectionId)
    const currentItemIndex = course.sections[currentSectionIndex]?.items.findIndex(i => i.id === currentItemId)

    if (currentSectionIndex === -1 || currentItemIndex === -1) return null

    // Try previous item in current section
    if (currentItemIndex > 0) {
      const prevItem = course.sections[currentSectionIndex].items[currentItemIndex - 1]
      navigateToItem(currentSectionId, prevItem.id)
      return prevItem
    }

    // Try last item in previous section
    if (currentSectionIndex > 0) {
      const prevSection = course.sections[currentSectionIndex - 1]
      if (prevSection.items.length > 0) {
        const prevItem = prevSection.items[prevSection.items.length - 1]
        navigateToItem(prevSection.id, prevItem.id)
        return prevItem
      }
    }

    return null
  }

  // Get current item content path (memoized untuk mencegah infinite re-render)
  const getCurrentContentPath = useMemo(() => {
    if (!course || !currentSectionId || !currentItemId) return null

    const section = course.sections.find(s => s.id === currentSectionId)
    const item = section?.items.find(i => i.id === currentItemId)

    return item?.contentPath || null
  }, [course, currentSectionId, currentItemId])

  // Get navigation info
  const getNavigationInfo = () => {
    if (!course || !currentSectionId || !currentItemId) {
      return {
        currentIndex: 0,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false,
        progressPercentage: 0
      }
    }

    let currentIndex = 0
    let totalItems = 0

    for (let i = 0; i < course.sections.length; i++) {
      const section = course.sections[i]
      for (let j = 0; j < section.items.length; j++) {
        if (section.id === currentSectionId && section.items[j].id === currentItemId) {
          currentIndex = totalItems
        }
        totalItems++
      }
    }

    const hasNext = currentIndex < totalItems - 1
    const hasPrevious = currentIndex > 0
    const progressPercentage = totalItems > 0 ? Math.round((currentIndex / totalItems) * 100) : 0

    return {
      currentIndex,
      totalItems,
      hasNext,
      hasPrevious,
      progressPercentage
    }
  }

  // Reset course progress
  const resetProgress = () => {
    if (!course) return

    const resetProgressData: CourseProgress = {
      courseId: course.slug,
      completedItems: [],
      currentSectionId: course.sections[0]?.id,
      currentItemId: course.sections[0]?.items[0]?.id,
      lastAccessedAt: new Date().toISOString(),
      completionPercentage: 0,
      isCompleted: false
    }

    setProgress(resetProgressData)
    setCurrentSectionId(course.sections[0]?.id || '')
    setCurrentItemId(course.sections[0]?.items[0]?.id || '')
  }

  return {
    // Data
    course,
    progress,
    loading,
    error,

    // Current state
    currentSectionId,
    currentItemId,

    // Actions
    navigateToItem,
    markCurrentItemCompleted,
    navigateToNextItem,
    navigateToPreviousItem,
    resetProgress,

    // Helpers
    currentContentPath: getCurrentContentPath,
    getNavigationInfo,

    // Computed
    isCompleted: progress?.isCompleted || false,
    completionPercentage: progress?.completionPercentage || 0,
    completedItems: progress?.completedItems || []
  }
}