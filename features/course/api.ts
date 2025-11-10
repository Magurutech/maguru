import { Course, CourseListItem, CourseProgress, CourseDetailResponse, CourseListResponse } from './types/course.types'

// Client-side API functions (for client components)

export async function getCourses(): Promise<CourseListResponse> {
  try {
    const response = await fetch('/api/courses')
    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching courses:', error)
    return {
      courses: [],
      total: 0
    }
  }
}

export async function getCourse(slug: string): Promise<CourseDetailResponse | null> {
  try {
    const response = await fetch(`/api/courses/${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch course')
    }

    const data = await response.json()
    const progress = getCourseProgress(slug)

    return {
      course: data.course,
      progress
    }
  } catch (error) {
    console.error(`Error fetching course ${slug}:`, error)
    return null
  }
}

export async function getCourseContent(contentPath: string): Promise<string> {
  try {
    const response = await fetch('/api/courses/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentPath }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch content')
    }

    const data = await response.json()
    return data.content
  } catch (error) {
    console.error('Error loading course content:', error)
    return '# Content Not Found\n\nThe requested content could not be loaded.'
  }
}

// Progress tracking functions (client-side)

export function getCourseProgress(courseId: string): CourseProgress | undefined {
  if (typeof window === 'undefined') return undefined

  try {
    const stored = localStorage.getItem('maguru_course_progress')
    if (!stored) return undefined

    const allProgress: Record<string, CourseProgress> = JSON.parse(stored)
    return allProgress[courseId]
  } catch (error) {
    console.error('Error getting course progress:', error)
    return undefined
  }
}

export function saveCourseProgress(progress: CourseProgress): void {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem('maguru_course_progress')
    const allProgress: Record<string, CourseProgress> = stored ? JSON.parse(stored) : {}

    allProgress[progress.courseId] = progress
    localStorage.setItem('maguru_course_progress', JSON.stringify(allProgress))
  } catch (error) {
    console.error('Error saving course progress:', error)
  }
}

export function markItemCompleted(courseId: string, sectionId: string, itemId: string): CourseProgress {
  const existingProgress = getCourseProgress(courseId) || {
    courseId,
    completedItems: [],
    currentSectionId: sectionId,
    currentItemId: itemId,
    lastAccessedAt: new Date().toISOString(),
    completionPercentage: 0,
    isCompleted: false
  }

  // Add item to completed items if not already present
  if (!existingProgress.completedItems.includes(itemId)) {
    existingProgress.completedItems.push(itemId)
  }

  // Update current item
  existingProgress.currentSectionId = sectionId
  existingProgress.currentItemId = itemId
  existingProgress.lastAccessedAt = new Date().toISOString()

  // In a real implementation, you'd calculate completion percentage based on total items
  // For now, we'll use a simple calculation
  const totalCompleted = existingProgress.completedItems.length
  existingProgress.completionPercentage = Math.min(totalCompleted * 10, 100) // Assume 10 items per course

  if (existingProgress.completionPercentage >= 100) {
    existingProgress.isCompleted = true
    existingProgress.completedAt = new Date().toISOString()
  }

  saveCourseProgress(existingProgress)
  return existingProgress
}

export function getAllCourseProgress(): Record<string, CourseProgress> {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem('maguru_course_progress')
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error getting all course progress:', error)
    return {}
  }
}