import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseListResponse,
  CourseResponse,
} from '../types'
import { DEFAULT_COURSE_THUMBNAIL, courseThumbnailUtils } from '../types'

const API_BASE_URL = '/api/courses'

// Timeout configuration untuk designing for failure
const API_TIMEOUT = 10000 // 10 seconds

/**
 * Course Adapter - Client-side interface untuk komunikasi dengan API
 *
 * @description
 * Adapter ini berfungsi sebagai jembatan antara frontend dan backend API untuk operasi CRUD kursus.
 * Mengikuti arsitektur Maguru untuk Data Access Layer dengan:
 * - Error handling yang konsisten
 * - Type safety dengan TypeScript
 * - Transformasi data untuk frontend consumption
 * - Retry logic dan fallback mechanisms
 * - Clerk authentication integration (via middleware)
 * - Timeout handling dan graceful degradation
 *
 * Semua method mengembalikan response yang konsisten dengan format:
 * - Success: { success: true, data: ... }
 * - Error: { success: false, error: string }
 *
 */
export class CourseAdapter {
  /**
   * Utility function untuk membuat fetch request dengan timeout
   */
  private static async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = API_TIMEOUT,
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - server tidak merespons dalam waktu yang ditentukan')
      }
      throw error
    }
  }

  /**
   * Static wrapper untuk fetchWithTimeout agar dapat diakses dari React Query
   */
  static async fetchWithTimeoutWrapper(
    url: string,
    options: RequestInit,
    timeout: number = API_TIMEOUT,
  ): Promise<Response> {
    return CourseAdapter.fetchWithTimeout(url, options, timeout)
  }

  /**
   * Get default thumbnail URL
   */
  static getDefaultThumbnailUrl(): string {
    return DEFAULT_COURSE_THUMBNAIL.URL
  }

  /**
   * Check if thumbnail is default
   */
  static isDefaultThumbnail(thumbnail: string | null): boolean {
    return courseThumbnailUtils.isDefaultThumbnail(thumbnail)
  }

  /**
   * Get display thumbnail URL dengan fallback ke default
   */
  static getDisplayThumbnail(thumbnail: string | null): string {
    return courseThumbnailUtils.getDisplayThumbnail(thumbnail)
  }

  /**
   * Mengambil daftar kursus dengan pagination dan filter opsional
   *
   * @description
   * Method ini mengirim request GET ke /api/courses dengan query parameters untuk pagination.
   * Dapat digunakan untuk menampilkan daftar kursus di homepage atau dashboard.
   *
   * @param page - Nomor halaman (default: 1)
   * @param limit - Jumlah item per halaman (default: 10, max: 50 sesuai API)
   * @returns Promise<CourseListResponse> - Response dengan daftar kursus dan pagination info
   *
   * @throws {Error} Jika terjadi network error atau API error
   */
  static async getCourses(
    page: number = 1,
    limit: number = 10,
    searchParams?: {
      searchQuery?: string
      selectedStatus?: string
      selectedCategory?: string
    },
  ): Promise<CourseListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      // Add search parameters if provided
      if (searchParams?.searchQuery) {
        params.append('search', searchParams.searchQuery)
      }
      if (searchParams?.selectedStatus && searchParams.selectedStatus !== 'all') {
        params.append('status', searchParams.selectedStatus)
      }
      if (searchParams?.selectedCategory && searchParams.selectedCategory !== 'all') {
        params.append('category', searchParams.selectedCategory)
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      const response = await CourseAdapter.fetchWithTimeout(`${API_BASE_URL}?${params}`, {
        method: 'GET',
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle auth errors specifically
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in.')
        }
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to view courses.')
        }
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.')
        }
        throw new Error(data.error || 'Failed to fetch courses')
      }

      return data
    } catch (error) {
      console.error('Error in getCourses:', error)

      // Graceful fallback untuk network errors
      if (error instanceof Error && error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Koneksi lambat. Silakan coba lagi.',
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch courses',
      }
    }
  }

  /**
   * Mengambil detail kursus berdasarkan ID
   *
   * @description
   * Method ini mengirim request GET ke /api/courses/[id] untuk mendapatkan detail kursus.
   * Dapat digunakan untuk menampilkan halaman detail kursus atau form edit.
   *
   * @param id - ID kursus yang akan diambil
   * @returns Promise<CourseResponse> - Response dengan detail kursus
   *
   * @throws {Error} Jika terjadi network error atau API error
   */
  static async getCourseById(id: string): Promise<CourseResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      const response = await CourseAdapter.fetchWithTimeout(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle auth errors specifically
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in.')
        }
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to view this course.')
        }
        if (response.status === 404) {
          throw new Error('Course not found.')
        }
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.')
        }
        throw new Error(data.error || 'Failed to fetch course')
      }

      return data
    } catch (error) {
      console.error('Error in getCourseById:', error)

      // Graceful fallback untuk network errors
      if (error instanceof Error && error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Koneksi lambat. Silakan coba lagi.',
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch course',
      }
    }
  }

  /**
   * Membuat kursus baru dengan metadata dasar
   *
   * @description
   * Method ini mengirim request POST ke /api/courses untuk membuat kursus baru.
   * Kursus yang dibuat akan memiliki status DRAFT secara default.
   *
   * Authentication & Authorization:
   * - ✅ Authentication handled by Clerk middleware
   * - ✅ Role validation: creator, admin only (server-side)
   * - ✅ No manual auth header needed
   *
   * @param courseData - Data kursus yang akan dibuat (title, description, thumbnail, category)
   * @returns Promise<CourseResponse> - Response dengan kursus yang berhasil dibuat
   *
   * @throws {Error} Jika terjadi network error atau API error
   */
  static async createCourse(courseData: CreateCourseRequest): Promise<CourseResponse> {
    try {
      const headers: Record<string, string> = {}
      // Selalu gunakan FormData untuk POST, agar Content-Type multipart/form-data
      const formData = new FormData()

      Object.entries(courseData).forEach(([key, value]) => {
        if (key === 'thumbnail' && value instanceof File) {
          formData.append('thumbnail', value)
        } else if (typeof value === 'string' && value !== undefined && value !== '') {
          formData.append(key, value)
        }
      })

      // Jangan set Content-Type, browser akan handle

      const response = await CourseAdapter.fetchWithTimeout(API_BASE_URL, {
        method: 'POST',
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle auth errors specifically
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in.')
        }
        if (response.status === 403) {
          throw new Error('Access denied. Only creators and admins can create courses.')
        }
        if (response.status === 422) {
          throw new Error('Data tidak valid. Silakan periksa kembali input Anda.')
        }
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.')
        }
        throw new Error(data.error || 'Failed to create course')
      }
      return data
    } catch (error) {
      console.error('CourseAdapter', 'createCourse', 'Error in createCourse', error as Error)
      // Graceful fallback untuk network errors
      if (error instanceof Error && error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Koneksi lambat. Silakan coba lagi.',
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create course',
      }
    }
  }

  /**
   * Update metadata kursus berdasarkan ID
   *
   * @description
   * Method ini mengirim request PUT ke /api/courses/[id] untuk mengupdate kursus.
   * Hanya pemilik kursus yang dapat mengupdate (akan divalidasi di backend).
   *
   * Authentication & Authorization:
   * - ✅ Authentication handled by Clerk middleware
   * - ✅ Handle 401/403 errors untuk unauthorized access
   * - ✅ Ownership validation: hanya pemilik kursus yang dapat mengupdate
   *
   * @param id - ID kursus yang akan diupdate
   * @param courseData - Data baru untuk kursus (title, description, thumbnail, category)
   * @returns Promise<CourseResponse> - Response dengan kursus yang berhasil diupdate
   *
   * @throws {Error} Jika terjadi network error atau API error
   */
  static async updateCourse(id: string, courseData: UpdateCourseRequest): Promise<CourseResponse> {
    try {
      const headers: Record<string, string> = {}

      // Selalu gunakan FormData untuk konsistensi dengan backend
      const formData = new FormData()

      // Tambahkan semua field ke FormData
      Object.entries(courseData).forEach(([key, value]) => {
        if (key === 'id') return // Skip id karena sudah di URL

        if (key === 'thumbnail' && value instanceof File) {
          formData.append('thumbnail', value)
        } else if (typeof value === 'string' && value !== undefined && value !== '') {
          formData.append(key, value)
        }
      })

      const response = await CourseAdapter.fetchWithTimeout(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle auth errors specifically
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in.')
        }
        if (response.status === 403) {
          throw new Error('Access denied. Only course owners can update this course.')
        }
        if (response.status === 404) {
          throw new Error('Course not found or you do not have access to it.')
        }
        if (response.status === 422) {
          throw new Error('Data tidak valid. Silakan periksa kembali input Anda.')
        }
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.')
        }
        throw new Error(data.error || 'Failed to update course')
      }

      return data
    } catch (error) {
      console.error('CourseAdapter', 'updateCourse', 'Error in updateCourse', error as Error)

      // Graceful fallback untuk network errors
      if (error instanceof Error && error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Koneksi lambat. Silakan coba lagi.',
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update course',
      }
    }
  }

  /**
   * Hapus kursus secara permanen berdasarkan ID
   *
   * @description
   * Method ini mengirim request DELETE ke /api/courses/[id] untuk menghapus kursus.
   * Hanya pemilik kursus yang dapat menghapus (akan divalidasi di backend).
   * Penghapusan bersifat permanen (hard delete).
   *
   * Authentication & Authorization:
   * - ✅ Authentication handled by Clerk middleware
   * - ✅ Handle 401/403 errors untuk unauthorized access
   * - ✅ Ownership validation: hanya pemilik kursus yang dapat menghapus
   *
   * @param id - ID kursus yang akan dihapus
   * @returns Promise<{success: boolean, message?: string, error?: string}> - Response konfirmasi penghapusan
   *
   * @throws {Error} Jika terjadi network error atau API error
   */
  static async deleteCourse(id: string): Promise<CourseResponse> {
    try {
      console.log('CourseAdapter: Starting deleteCourse', { courseId: id })

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      const response = await CourseAdapter.fetchWithTimeout(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle auth errors specifically
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in.')
        }
        if (response.status === 403) {
          throw new Error('Access denied. Only course owners can delete this course.')
        }
        if (response.status === 404) {
          throw new Error('Course not found or you do not have access to it.')
        }
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.')
        }
        throw new Error(data.error || 'Failed to delete course')
      }

      return {
        success: data.success,
        data: data.success ? ({ id } as Course) : undefined, // Minimal course data untuk success
        error: data.error,
      }
    } catch (error) {
      console.error('CourseAdapter: Error in deleteCourse:', error)

      // Graceful fallback untuk network errors
      if (error instanceof Error && error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Koneksi lambat. Silakan coba lagi.',
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete course',
      }
    }
  }

  /**
   * Mengambil kursus berdasarkan creator ID (untuk dashboard creator)
   *
   * @description
   * Method ini mengirim request GET ke /api/courses dengan query parameter creatorId.
   * Digunakan untuk menampilkan dashboard creator dengan kursus miliknya sendiri.
   *
   * Authentication & Authorization:
   * - ✅ Authentication handled by Clerk middleware
   * - ✅ Extract creatorId dari Clerk session otomatis
   * - ✅ Handle 401/403 errors untuk unauthorized access
   *
   * @param creatorId - ID creator yang kursusnya akan diambil
   * @param page - Nomor halaman (default: 1)
   * @param limit - Jumlah item per halaman (default: 10)
   * @returns Promise<CourseListResponse> - Response dengan daftar kursus creator dan pagination info
   *
   * @throws {Error} Jika terjadi network error atau API error
   */
  static async getCoursesByCreator(
    creatorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<CourseListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        creatorId: creatorId,
      })

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      const response = await CourseAdapter.fetchWithTimeout(`${API_BASE_URL}?${params}`, {
        method: 'GET',
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle auth errors specifically
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in.')
        }
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to view these courses.')
        }
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.')
        }
        throw new Error(data.error || 'Failed to fetch creator courses')
      }

      return data
    } catch (error) {
      console.error('Error in getCoursesByCreator:', error)

      // Graceful fallback untuk network errors
      if (error instanceof Error && error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Koneksi lambat. Silakan coba lagi.',
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch creator courses',
      }
    }
  }

  /**
   * Update status kursus (DRAFT, PUBLISHED, ARCHIVED)
   *
   * @description
   * Method ini mengirim request PATCH ke /api/courses/[id]/status untuk mengupdate status kursus.
   * Hanya pemilik kursus yang dapat mengupdate status (akan divalidasi di backend).
   *
   * Authentication & Authorization:
   * - ✅ Authentication handled by Clerk middleware
   * - ✅ Handle 401/403 errors untuk unauthorized access
   * - ✅ Ownership validation: hanya pemilik kursus yang dapat mengupdate status
   *
   * @param id - ID kursus yang akan diupdate statusnya
   * @param status - Status baru untuk kursus (DRAFT, PUBLISHED, ARCHIVED)
   * @returns Promise<CourseResponse> - Response dengan kursus yang berhasil diupdate statusnya
   *
   * @throws {Error} Jika terjadi network error atau API error
   */
  static async updateCourseStatus(id: string, status: string): Promise<CourseResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      const response = await CourseAdapter.fetchWithTimeout(`${API_BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle auth errors specifically
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in.')
        }
        if (response.status === 403) {
          throw new Error('Access denied. Only course owners can update course status.')
        }
        if (response.status === 404) {
          throw new Error('Course not found or you do not have access to it.')
        }
        if (response.status === 422) {
          throw new Error('Status tidak valid. Silakan pilih status yang benar.')
        }
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.')
        }
        throw new Error(data.error || 'Failed to update course status')
      }

      return data
    } catch (error) {
      console.error('Error in updateCourseStatus:', error)

      // Graceful fallback untuk network errors
      if (error instanceof Error && error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Koneksi lambat. Silakan coba lagi.',
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update course status',
      }
    }
  }
}

/**
 * Utility functions untuk transformasi data antara backend dan frontend
 *
 * @description
 * Kumpulan utility functions untuk mengubah format data dari database model
 * ke format yang sesuai untuk frontend consumption.
 *
 * Fungsi-fungsi ini membantu:
 * - Memformat data untuk display di UI
 * - Menyederhanakan struktur data untuk frontend
 * - Memastikan konsistensi format data
 */
export const courseAdapterUtils = {
  /**
   * Transform Course database model ke CourseMetadata untuk frontend
   *
   * @description
   * Mengubah Course model dari database ke format yang lebih sederhana
   * untuk digunakan di frontend components.
   *
   * @param course - Course object dari database
   * @returns Object dengan format yang dioptimalkan untuk frontend
   */
  transformToMetadata: (course: Course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail || '/globe.svg', // Fallback thumbnail
    status: course.status,
    students: course.students,
    lessons: course.lessons,
    duration: course.duration,
    rating: course.rating,
    category: course.category,
    createdAt: course.createdAt.toISOString().split('T')[0], // Format: YYYY-MM-DD
  }),

  /**
   * Transform array Course ke CourseMetadata[]
   *
   * @description
   * Mengubah array Course objects dari database ke array CourseMetadata
   * untuk digunakan di frontend components seperti list atau grid.
   *
   * @param courses - Array Course objects dari database
   * @returns Array CourseMetadata objects
   *
   */
  transformArrayToMetadata: (courses: Course[]) =>
    courses.map(courseAdapterUtils.transformToMetadata),
}
