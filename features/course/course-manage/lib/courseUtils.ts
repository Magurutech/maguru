import type { Course, CreateCourseRequest } from '../../types'
import { CourseStatus } from '../../types'

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
 * Filter courses berdasarkan search query dan status
 *
 * @description
 * Function ini melakukan filtering pada array courses berdasarkan:
 * - Search query: mencari di title dan description (case-insensitive)
 * - Status filter: memfilter berdasarkan status kursus
 *
 * Berguna untuk implementasi search dan filter di dashboard creator.
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
  return courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus
    return matchesSearch && matchesStatus
  })
}

/**
 * Filter courses berdasarkan status saja
 *
 * @description
 * Function ini melakukan filtering sederhana berdasarkan status kursus.
 * Lebih efisien jika hanya perlu filter berdasarkan status tanpa search.
 *
 * @param courses - Array Course objects yang akan difilter
 * @param status - CourseStatus enum untuk filter (optional)
 * @returns Array Course objects yang sudah difilter
 *
 */
export function filterCoursesByStatus(courses: Course[], status?: CourseStatus): Course[] {
  if (!status) return courses
  return courses.filter((course) => course.status === status)
}

/**
 * Format duration dari menit ke format yang readable
 *
 * @description
 * Function ini mengubah durasi dalam menit menjadi format yang mudah dibaca.
 * Menggunakan bahasa Indonesia dan format yang user-friendly.
 *
 * @param minutes - Jumlah menit (number)
 * @returns String durasi yang sudah diformat
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} menit`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} jam`
  }

  return `${hours} jam ${remainingMinutes} menit`
}

/**
 * Format rating dengan 1 decimal place
 *
 * @description
 * Function ini memformat rating number menjadi string dengan 1 decimal place.
 * Berguna untuk menampilkan rating kursus di UI.
 *
 * @param rating - Rating number (0.0 - 5.0)
 * @returns String rating dengan 1 decimal place
 *
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

/**
 * Format number dengan separator ribuan sesuai format Indonesia
 *
 * @description
 * Function ini memformat number menjadi string dengan separator ribuan
 * menggunakan locale Indonesia (contoh: 1.000, 10.000, 100.000).
 *
 * @param num - Number yang akan diformat
 * @returns String number dengan separator ribuan
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('id-ID')
}

/**
 * Generate thumbnail URL untuk Supabase Storage
 *
 * @description
 * Function ini menggenerate URL lengkap untuk thumbnail kursus dari Supabase Storage.
 * Mengikuti best practice Supabase Storage dengan fallback ke default image.
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
  if (!path) return '/globe.svg'

  // Jika sudah full URL, return as is
  if (path.startsWith('http')) {
    return path
  }

  // Jika path relatif, tambahkan Supabase URL
  // TODO: Ganti dengan environment variable untuk Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
  const bucketName = 'course-thumbnails'

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${path}`
}

/**
 * Validate course data sebelum submit ke API
 *
 * @description
 * Function ini melakukan validasi client-side pada data kursus sebelum dikirim ke API.
 * Mengembalikan object dengan status validasi dan array error messages.
 *
 * Validasi yang dilakukan:
 * - Title tidak boleh kosong
 * - Description tidak boleh kosong
 * - Category tidak boleh kosong
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

  if (!data.title?.trim()) {
    errors.push('Judul kursus harus diisi')
  }

  if (!data.description?.trim()) {
    errors.push('Deskripsi kursus harus diisi')
  }

  if (!data.category?.trim()) {
    errors.push('Kategori harus diisi')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
