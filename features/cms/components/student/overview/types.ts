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
  outcomes?: string[]
}

export interface CreatorProfile {
  name: string | null
  title: string | null
  bio: string | null
  experience: string | null
  avatarUrl: string | null
  socialLinks: {
    linkedin?: string
    youtube?: string
    github?: string
  } | null
  stats: {
    rating: number
    studentsCount: number
    coursesCount: number
  }
}

export interface Review {
  id: string
  name: string
  date: string
  rating: number
  comment: string
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

