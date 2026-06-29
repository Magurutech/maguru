/**
 * Types for Course Overview / Detail page
 */

export interface CourseDetail {
  id: string
  title: string
  description: string | null
  category: string
  difficulty: string | null
  status: string
  creatorId: string
  createdAt: string
  updatedAt: string
  slug: string
  students?: number
  duration?: string
  rating?: number
}

export interface OverviewLesson {
  id: string
  title: string
  order: number
}

export interface OverviewSection {
  id: string
  title: string
  order: number
  lessons: OverviewLesson[]
}
