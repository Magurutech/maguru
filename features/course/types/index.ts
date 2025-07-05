import { z } from 'zod'
import { CourseStatus as PrismaCourseStatus } from '@prisma/client'

// Database Models (sesuai dengan Prisma schema)
export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  status: PrismaCourseStatus
  students: number
  lessons: number
  duration: string
  rating: number
  category: string
  creatorId: string // Clerk User ID
  createdAt: Date
  updatedAt: Date
}

// Re-export Prisma enum untuk konsistensi
export { PrismaCourseStatus as CourseStatus }

// Request/Response Types
export interface CreateCourseRequest {
  title: string
  description: string
  category: string
  thumbnail?: string
  status?: PrismaCourseStatus
}

export interface UpdateCourseRequest extends CreateCourseRequest {
  id: string
}

// Form interfaces untuk Create dan Edit dialogs
export interface CreateCourseFormData {
  title: string
  description: string
  category: string
  thumbnail: string
  status: PrismaCourseStatus
}

export interface EditCourseFormData {
  title: string
  description: string
  category: string
  thumbnail: string
  status: PrismaCourseStatus
}

export interface CourseResponse {
  success: boolean
  data?: Course
  error?: string
}

export interface CourseListResponse {
  success: boolean
  data?: {
    courses: Course[]
    pagination: PaginationInfo
  }
  error?: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Zod Schemas untuk validasi
export const CourseSchema = z.object({
  title: z.string().min(1, 'Judul kursus harus diisi').max(100, 'Judul terlalu panjang'),
  description: z.string().min(1, 'Deskripsi harus diisi').max(500, 'Deskripsi terlalu panjang'),
  category: z.string().min(1, 'Kategori harus diisi').max(50, 'Kategori terlalu panjang'),
  thumbnail: z.string().optional(),
  status: z.nativeEnum(PrismaCourseStatus).optional(),
})

// Utility Types
export type CourseStatusType = keyof typeof PrismaCourseStatus

// Metadata untuk frontend (sesuai dengan contoh yang diminta)
export interface CourseMetadata {
  id: string
  title: string
  description: string
  thumbnail: string
  status: PrismaCourseStatus
  students: number
  lessons: number
  duration: string
  rating: number
  category: string
  createdAt: string
}
