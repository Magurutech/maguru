import { z } from 'zod'

// Database Models (sesuai dengan Prisma schema)
export interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  status: CourseStatus
  students: number
  lessons: number
  duration: string
  rating: number
  category: string
  creatorId: string // Clerk User ID
  createdAt: Date
  updatedAt: Date
}

// Enums
export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

// Request/Response Types
export interface CreateCourseRequest {
  title: string
  description: string
  category: string
  thumbnail?: string
}

export interface UpdateCourseRequest extends CreateCourseRequest {
  id: string
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
})

// Utility Types
export type CourseStatusType = keyof typeof CourseStatus

// Metadata untuk frontend (sesuai dengan contoh yang diminta)
export interface CourseMetadata {
  id: string
  title: string
  description: string
  thumbnail: string
  status: CourseStatus
  students: number
  lessons: number
  duration: string
  rating: number
  category: string
  createdAt: string
}
