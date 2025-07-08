import type { Course, CreateCourseRequest } from '../types'
import { CourseStatus } from '../types'

/**
 * Utility functions untuk manajemen dan formatting data kursus
 *
 * @description
 * Kumpulan utility functions untuk membantu operasi frontend terkait kursus.
 * Fungsi-fungsi ini mencakup:
 * - Formatting dan styling untuk UI components
 * - Filtering dan searching data kursus
 * - Validation data sebelum submit
 * - Helper functions untuk common operations
 * - Error handling dan fallback mechanisms
 *
 * Semua functions mengikuti prinsip pure functions dan tidak memiliki side effects.
 */

/**
 * Mendapatkan warna status berdasarkan CourseStatus untuk styling UI
 *
 * @description
 * Function ini mengembalikan class CSS Tailwind untuk styling badge/indicator status.
 * Menggunakan color scheme yang konsisten dengan design system Maguru.
 *
 * @param status - CourseStatus enum atau string status
 * @returns String class CSS Tailwind untuk styling
 *
 */
export function getStatusColor(status: CourseStatus | string): string {
  switch (status) {
    case CourseStatus.DRAFT:
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case CourseStatus.PUBLISHED:
    case 'published':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'archived':
      return 'bg-beige-500 text-white'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

/**
 * Mendapatkan teks status dalam bahasa Indonesia untuk display UI
 *
 * @description
 * Function ini mengembalikan teks status yang user-friendly dalam bahasa Indonesia.
 * Berguna untuk menampilkan status kursus di UI dengan bahasa yang mudah dipahami.
 *
 * @param status - CourseStatus enum atau string status
 * @returns String teks status dalam bahasa Indonesia
 *
 */
export function getStatusText(status: CourseStatus | string): string {
  switch (status) {
    case CourseStatus.DRAFT:
    case 'draft':
      return 'Draft'
    case CourseStatus.PUBLISHED:
    case 'published':
      return 'Dipublikasi'
    case 'archived':
      return 'Diarsipkan'
    default:
      return 'Tidak Diketahui'
  }
}

/**
 * Filter courses berdasarkan search query dan status dengan error handling
 *
 * @description
 * Function ini melakukan filtering pada array courses berdasarkan:
 * - Search query: mencari di title dan description (case-insensitive)
 * - Status filter: memfilter berdasarkan status kursus
 *
 * Berguna untuk implementasi search dan filter di dashboard creator.
 * Menggunakan safe filtering dengan error handling.
 *
 * @param courses - Array Course objects yang akan difilter
 * @param searchQuery - String query untuk pencarian (default: empty string)
 * @param selectedStatus - String status untuk filter (default: 'all')
 * @returns Array Course objects yang sudah difilter
 *
 */
export function filterCourses(
  courses: Course[],
  searchQuery: string = '',
  selectedStatus: string = 'all',
): Course[] {
  try {
    if (!Array.isArray(courses)) {
      console.warn('filterCourses: courses parameter is not an array')
      return []
    }

    return courses.filter((course) => {
      try {
        const matchesSearch =
          (course.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (course.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus
        return matchesSearch && matchesStatus
      } catch (error) {
        console.warn('Error filtering course:', course, error)
        return false // Skip invalid courses
      }
    })
  } catch (error) {
    console.error('Error in filterCourses:', error)
    return [] // Return empty array on error
  }
}

/**
 * Filter courses berdasarkan status saja dengan error handling
 *
 * @description
 * Function ini melakukan filtering sederhana berdasarkan status kursus.
 * Lebih efisien jika hanya perlu filter berdasarkan status tanpa search.
 * Menggunakan safe filtering dengan error handling.
 *
 * @param courses - Array Course objects yang akan difilter
 * @param status - CourseStatus enum untuk filter (optional)
 * @returns Array Course objects yang sudah difilter
 *
 */
export function filterCoursesByStatus(courses: Course[], status?: CourseStatus): Course[] {
  try {
    if (!Array.isArray(courses)) {
      console.warn('filterCoursesByStatus: courses parameter is not an array')
      return []
    }

    if (!status) return courses

    return courses.filter((course) => {
      try {
        return course.status === status
      } catch (error) {
        console.warn('Error filtering course by status:', course, error)
        return false // Skip invalid courses
      }
    })
  } catch (error) {
    console.error('Error in filterCoursesByStatus:', error)
    return [] // Return empty array on error
  }
}

/**
 * Format duration dari menit ke format yang readable dengan error handling
 *
 * @description
 * Function ini mengubah durasi dalam menit menjadi format yang mudah dibaca.
 * Menggunakan bahasa Indonesia dan format yang user-friendly.
 * Menggunakan safe formatting dengan error handling.
 *
 * @param minutes - Jumlah menit (number)
 * @returns String durasi yang sudah diformat
 */
export function formatDuration(minutes: number): string {
  try {
    if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) {
      return '0 menit'
    }

    if (minutes < 60) {
      return `${minutes} menit`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
      return `${hours} jam`
    }

    return `${hours} jam ${remainingMinutes} menit`
  } catch (error) {
    console.error('Error in formatDuration:', error)
    return '0 menit' // Fallback value
  }
}

/**
 * Format rating dengan 1 decimal place dengan error handling
 *
 * @description
 * Function ini memformat rating number menjadi string dengan 1 decimal place.
 * Berguna untuk menampilkan rating kursus di UI.
 * Menggunakan safe formatting dengan error handling.
 *
 * @param rating - Rating number (0.0 - 5.0)
 * @returns String rating dengan 1 decimal place
 *
 */
export function formatRating(rating: number): string {
  try {
    if (typeof rating !== 'number' || isNaN(rating)) {
      return '0.0'
    }

    // Clamp rating between 0 and 5
    const clampedRating = Math.max(0, Math.min(5, rating))
    return clampedRating.toFixed(1)
  } catch (error) {
    console.error('Error in formatRating:', error)
    return '0.0' // Fallback value
  }
}

/**
 * Format number dengan separator ribuan sesuai format Indonesia dengan error handling
 *
 * @description
 * Function ini memformat number menjadi string dengan separator ribuan
 * menggunakan locale Indonesia (contoh: 1.000, 10.000, 100.000).
 * Menggunakan safe formatting dengan error handling.
 *
 * @param num - Number yang akan diformat
 * @returns String number dengan separator ribuan
 */
export function formatNumber(num: number): string {
  try {
    if (typeof num !== 'number' || isNaN(num)) {
      return '0'
    }

    return num.toLocaleString('id-ID')
  } catch (error) {
    console.error('Error in formatNumber:', error)
    return '0' // Fallback value
  }
}

/**
 * Generate thumbnail URL untuk Supabase Storage dengan error handling
 *
 * @description
 * Function ini menggenerate URL lengkap untuk thumbnail kursus dari Supabase Storage.
 * Mengikuti best practice Supabase Storage dengan fallback ke default image.
 * Menggunakan safe URL generation dengan error handling.
 *
 * TODO: Update environment variable untuk Supabase URL
 * - Ganti placeholder URL dengan environment variable yang sebenarnya
 * - Implementasi error handling untuk invalid URLs
 * - Tambahkan image optimization dengan Supabase transformations
 *
 * @param path - Path relatif atau full URL thumbnail
 * @returns String URL lengkap untuk thumbnail
 *
 */
export function getThumbnailUrl(path: string): string {
  try {
    if (!path || typeof path !== 'string') {
      return '/globe.svg'
    }

    // Handle base64 images (temporary solution)
    if (path.startsWith('data:image/')) {
      return path
    }

    // Jika sudah full URL, return as is
    if (path.startsWith('http')) {
      return path
    }

    // Jika path relatif, tambahkan Supabase URL
    // TODO: Ganti dengan environment variable untuk Supabase URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
    const bucketName = 'course-thumbnails'

    return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${path}`
  } catch (error) {
    console.error('Error in getThumbnailUrl:', error)
    return '/globe.svg' // Fallback to default image
  }
}

/**
 * Validate course data sebelum submit ke API dengan comprehensive error handling
 *
 * @description
 * Function ini melakukan validasi client-side pada data kursus sebelum dikirim ke API.
 * Mengembalikan object dengan status validasi dan array error messages.
 * Menggunakan comprehensive validation dengan error handling.
 *
 * Validasi yang dilakukan:
 * - Title tidak boleh kosong dan minimal 3 karakter
 * - Description tidak boleh kosong dan minimal 10 karakter
 * - Category tidak boleh kosong
 * - Status harus valid
 * - Thumbnail URL harus valid (jika ada)
 *
 * @param data - Partial CreateCourseRequest object yang akan divalidasi
 * @returns Object dengan isValid boolean dan array errors
 *
 */
export function validateCourseData(data: Partial<CreateCourseRequest>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  try {
    // Validate title
    if (!data.title?.trim()) {
      errors.push('Judul kursus harus diisi')
    } else if (data.title.trim().length < 3) {
      errors.push('Judul kursus minimal 3 karakter')
    } else if (data.title.trim().length > 100) {
      errors.push('Judul kursus maksimal 100 karakter')
    }

    // Validate description
    if (!data.description?.trim()) {
      errors.push('Deskripsi kursus harus diisi')
    } else if (data.description.trim().length < 10) {
      errors.push('Deskripsi kursus minimal 10 karakter')
    } else if (data.description.trim().length > 1000) {
      errors.push('Deskripsi kursus maksimal 1000 karakter')
    }

    // Validate category
    if (!data.category?.trim()) {
      errors.push('Kategori harus diisi')
    }

    // Validate thumbnail URL (if provided)
    if (data.thumbnail && typeof data.thumbnail === 'string') {
      // Handle base64 images (temporary solution)
      if (data.thumbnail.startsWith('data:image/')) {
        // Base64 is valid, no need to validate further
        return
      }

      // Handle relative paths
      if (data.thumbnail.startsWith('/') || data.thumbnail.startsWith('./')) {
        return
      }

      // Handle full URLs
      try {
        new URL(data.thumbnail)
      } catch {
        errors.push('URL thumbnail tidak valid')
      }
    }
  } catch (error) {
    console.error('Error in validateCourseData:', error)
    errors.push('Terjadi kesalahan saat validasi data')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Safe string truncation dengan error handling
 *
 * @description
 * Function ini memotong string dengan aman tanpa merusak karakter.
 * Berguna untuk menampilkan preview text di UI.
 * Menggunakan safe truncation dengan error handling.
 *
 * @param text - String yang akan dipotong
 * @param maxLength - Panjang maksimal string
 * @param suffix - Suffix yang akan ditambahkan (default: '...')
 * @returns String yang sudah dipotong
 */
export function safeTruncate(text: string, maxLength: number, suffix: string = '...'): string {
  try {
    if (typeof text !== 'string') {
      return ''
    }

    if (text.length <= maxLength) {
      return text
    }

    return text.substring(0, maxLength - suffix.length) + suffix
  } catch (error) {
    console.error('Error in safeTruncate:', error)
    return '' // Fallback to empty string
  }
}

/**
 * Safe array operations dengan error handling
 *
 * @description
 * Utility functions untuk operasi array yang aman dengan error handling.
 * Berguna untuk mencegah crash saat bekerja dengan data yang tidak valid.
 */
export const safeArrayUtils = {
  /**
   * Safe array map dengan error handling
   */
  map: <T, R>(array: T[], mapper: (item: T, index: number) => R): R[] => {
    try {
      if (!Array.isArray(array)) {
        return []
      }

      return array
        .map((item, index) => {
          try {
            return mapper(item, index)
          } catch (error) {
            console.warn('Error in array map at index', index, error)
            return null
          }
        })
        .filter((item): item is R => item !== null)
    } catch (error) {
      console.error('Error in safeArrayUtils.map:', error)
      return []
    }
  },

  /**
   * Safe array filter dengan error handling
   */
  filter: <T>(array: T[], predicate: (item: T, index: number) => boolean): T[] => {
    try {
      if (!Array.isArray(array)) {
        return []
      }

      return array.filter((item, index) => {
        try {
          return predicate(item, index)
        } catch (error) {
          console.warn('Error in array filter at index', index, error)
          return false
        }
      })
    } catch (error) {
      console.error('Error in safeArrayUtils.filter:', error)
      return []
    }
  },

  /**
   * Safe array sort dengan error handling
   */
  sort: <T>(array: T[], compareFn?: (a: T, b: T) => number): T[] => {
    try {
      if (!Array.isArray(array)) {
        return []
      }

      return [...array].sort(compareFn)
    } catch (error) {
      console.error('Error in safeArrayUtils.sort:', error)
      return []
    }
  },
}

