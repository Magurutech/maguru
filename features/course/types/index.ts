import { z } from 'zod'
import { CourseStatus as PrismaCourseStatus } from '@prisma/client'

// Default thumbnail constants
export const DEFAULT_COURSE_THUMBNAIL = {
  URL:
    process.env.NEXT_PUBLIC_DEFAULT_COURSE_THUMBNAIL_URL || '/images/default-course-thumbnail.svg',
  WIDTH: 640,
  HEIGHT: 360,
  FORMAT: 'svg',
}

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

export interface CourseCatalog {
  id: string
  title: string
  creator: string
  thumbnail: string
  rating: number
  students: number
  duration: string
  category: string
  price: number
  enrolled: boolean
  createdAt: string
  description: string
  longDescription: string
  curriculum: string[]
  wishlist: boolean
}

export interface CourseDetail {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor: {
    name: string
    avatar: string
    bio: string
    credentials: string[]
    rating: number
    students: number
  }
  rating: number
  totalRatings: number
  students: number
  duration: string
  level: string
  language: string
  price: number
  originalPrice: number
  category: string
  lastUpdated: string
  certificate: boolean
  downloadableResources: number
  articlesCount: number
  videosCount: number
  totalHours: number
  enrolled: boolean
  inWishlist: boolean
  learningOutcomes: string[]
  requirements: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  curriculum: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviews: any[]
}

// Re-export Prisma enum untuk konsistensi
export { PrismaCourseStatus as CourseStatus }

// Request/Response Types
export interface CreateCourseRequest {
  title: string
  description: string
  category: string
  thumbnail?: string | File
  status: PrismaCourseStatus // Wajib dengan default DRAFT
}

export interface UpdateCourseRequest extends CreateCourseRequest {
  id: string
}

// Form interfaces untuk Create dan Edit dialogs
export interface CreateCourseFormData {
  title: string
  description: string
  category: string
  thumbnail: string | File
  status: PrismaCourseStatus
}

export interface EditCourseFormData {
  title: string
  description: string
  category: string
  thumbnail: string | File
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
  status: z.nativeEnum(PrismaCourseStatus).default(PrismaCourseStatus.DRAFT),
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

// Utility functions untuk thumbnail handling
export const courseThumbnailUtils = {
  /**
   * Get display thumbnail URL dengan fallback ke default
   */
  getDisplayThumbnail: (thumbnail: string | null): string => {
    return thumbnail || DEFAULT_COURSE_THUMBNAIL.URL
  },

  /**
   * Check if thumbnail is default
   */
  isDefaultThumbnail: (thumbnail: string | null): boolean => {
    return !thumbnail || thumbnail === DEFAULT_COURSE_THUMBNAIL.URL
  },

  /**
   * Get default thumbnail URL
   */
  getDefaultThumbnail: (): string => {
    return DEFAULT_COURSE_THUMBNAIL.URL
  },
}
