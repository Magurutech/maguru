/**
 * Progress Type Definitions
 * Types for progress tracking functionality
 */

export interface LessonProgressData {
  id: string
  lessonId: string
  userId: string
  completed: boolean
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface LessonProgressResponse {
  lessonId: string
  userId: string
  completed: boolean
  completedAt: string | null
}

export interface CourseProgressData {
  courseId: string
  userId: string
  percentage: number
  completedLessons: number
  totalLessons: number
  completed: boolean
  completedAt: Date | null
}

export interface CourseProgressResponse {
  courseId: string
  userId: string
  percentage: number
  completedLessons: number
  totalLessons: number
  completed: boolean
  completedAt: string | null
}

export interface MarkLessonCompleteResult {
  id: string
  lessonId: string
  userId: string
  completed: boolean
  completedAt: string | null
  createdAt: string
}
