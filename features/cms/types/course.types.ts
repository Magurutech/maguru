/**
 * Course Types
 * Centralized type definitions for all course-related shapes.
 * Consolidates types previously scattered across component files.
 */

// From features/cms/components/student/CourseCard.tsx
export interface CourseCardCourse {
  id: string
  slug: string
  title: string
  description: string | null
  category: string
  difficulty: string | null
  status: string
  sectionCount?: number
  lessonCount?: number
}

// From features/cms/components/creator/dashboard/CourseListItem.tsx (full shape)
export interface CreatorCourse {
  id: string
  title: string
  slug: string
  description: string | null
  status: string
  category: string | null
  difficulty: string | null
  sectionCount: number
  enrollmentCount: number
  createdAt: string | Date
  updatedAt: string | Date
}

export interface EnrolledCourse {
  id: string
  course: CourseCardCourse
  enrolledAt: string | Date
  completed: boolean
  progress: number
}

export interface CourseFormData {
  title: string
  description: string
  category: string
  difficulty: 'Pemula' | 'Menengah' | 'Mahir'
  status: 'DRAFT' | 'PUBLISHED'
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CourseCatalogParams {
  page?: number
  limit?: number
  category?: string
  difficulty?: string
  search?: string
}
