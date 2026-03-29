/**
 * Section Types
 * Types for Section entity and related operations
 */

export interface Section {
  id: string
  courseId: string
  order: number
  title: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SectionWithLessonCount extends Section {
  lessonCount: number
}

export interface CreateSectionInput {
  title: string
  description?: string
  order?: number  // Optional — auto-calculated as max+1 if not provided
}

export interface UpdateSectionInput {
  title?: string
  description?: string
  order?: number
}

export interface DeleteSectionResult {
  message: string
  deletedLessons: number
}
