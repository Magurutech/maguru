import { prisma } from '@/lib/prisma'
import type { Course, CreateCourseRequest, PaginationInfo } from '../types'
import { CourseStatus, DEFAULT_COURSE_THUMBNAIL } from '../types'
import type { Prisma } from '@prisma/client'

/**
 * Service class untuk mengelola operasi CRUD kursus
 *
 * Service ini menangani semua logika bisnis terkait kursus termasuk:
 * - Pembuatan kursus baru
 * - Pengambilan daftar kursus dengan pagination
 * - Update dan penghapusan kursus
 * - Manajemen status kursus
 *
 * Semua operasi memastikan bahwa hanya creator yang memiliki akses ke kursusnya sendiri
 */
export class CourseService {
  /**
   * Membuat kursus baru dengan metadata dasar
   *
   * @param data - Data kursus yang akan dibuat (title, description, thumbnail, category)
   * @param creatorId - ID creator yang membuat kursus (akan diintegrasikan dengan Clerk di TSK-48)
   * @returns Promise<Course> - Kursus yang berhasil dibuat
   *
   * @throws {Error} Jika terjadi error saat menyimpan ke database
   */
  async createCourse(data: CreateCourseRequest, creatorId: string): Promise<Course> {
    // Handle thumbnail fallback ke default jika tidak ada
    // Service layer hanya menerima string URL, bukan File
    const thumbnailUrl =
      typeof data.thumbnail === 'string' ? data.thumbnail : DEFAULT_COURSE_THUMBNAIL.URL

    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        thumbnail: thumbnailUrl, // Selalu string di database
        category: data.category,
        status: data.status || CourseStatus.DRAFT, // Use provided status or default to DRAFT
        students: 0,
        lessons: 0, // Akan di-update saat ada modules/lessons
        duration: '0 jam', // Akan di-update saat ada content
        rating: 0.0,
        creatorId,
      },
    })

    return course
  }

  /**
   * Get default thumbnail URL
   *
   * @returns string - URL default thumbnail
   */
  getDefaultThumbnailUrl(): string {
    return DEFAULT_COURSE_THUMBNAIL.URL
  }

  /**
   * Check if thumbnail is default
   *
   * @param thumbnail - Thumbnail URL to check
   * @returns boolean - True if thumbnail is default
   */
  isDefaultThumbnail(thumbnail: string | null): boolean {
    return !thumbnail || thumbnail === DEFAULT_COURSE_THUMBNAIL.URL
  }

  /**
   * Get display thumbnail URL dengan fallback ke default
   *
   * @param thumbnail - Thumbnail URL
   * @returns string - Display thumbnail URL
   */
  getDisplayThumbnail(thumbnail: string | null): string {
    return thumbnail || DEFAULT_COURSE_THUMBNAIL.URL
  }

  /**
   * Mengambil daftar kursus dengan pagination dan filter opsional
   *
   * @param page - Nomor halaman (default: 1)
   * @param limit - Jumlah item per halaman (default: 10, max: 50)
   * @param creatorId - Filter opsional untuk mengambil kursus berdasarkan creator ID
   * @param filters - Filter opsional untuk search, status, dan category
   * @returns Promise<{courses: Course[], pagination: PaginationInfo}> - Daftar kursus dan info pagination
   *
   * @throws {Error} Jika terjadi error saat query database
   */
  async getCourses(
    page: number = 1,
    limit: number = 10,
    creatorId?: string,
    filters?: {
      searchQuery?: string
      statusFilter?: string
      categoryFilter?: string
    },
  ): Promise<{ courses: Course[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit
    const take = Math.min(limit, 50) // Max 50 items per page

    // 🔥 TAMBAHAN: Build comprehensive where clause
    const where: Prisma.CourseWhereInput = {}

    // Creator filter
    if (creatorId) {
      where.creatorId = creatorId
    }

    // Status filter
    if (filters?.statusFilter && filters.statusFilter !== 'all') {
      where.status = filters.statusFilter as CourseStatus
    }

    // Category filter
    if (filters?.categoryFilter && filters.categoryFilter !== 'all') {
      where.category = filters.categoryFilter
    }

    // Search filter (title dan description)
    if (filters?.searchQuery) {
      where.OR = [
        {
          title: {
            contains: filters.searchQuery,
            mode: 'insensitive', // Case insensitive search
          },
        },
        {
          description: {
            contains: filters.searchQuery,
            mode: 'insensitive',
          },
        },
      ]
    }

    // Get courses with pagination
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.course.count({ where }),
    ])

    const totalPages = Math.ceil(total / take)

    return {
      courses,
      pagination: {
        page,
        limit: take,
        total,
        totalPages,
      },
    }
  }

  /**
   * Mengambil detail kursus berdasarkan ID
   *
   * @param id - ID kursus yang akan diambil
   * @returns Promise<Course | null> - Detail kursus atau null jika tidak ditemukan
   *
   * @throws {Error} Jika terjadi error saat query database
   *
   */
  async getCourseById(id: string): Promise<Course | null> {
    return await prisma.course.findUnique({
      where: { id },
    })
  }

  /**
   * Update metadata kursus berdasarkan ID
   *
   * @param id - ID kursus yang akan diupdate
   * @param data - Data baru untuk kursus (title, description, thumbnail, category)
   * @param creatorId - ID creator untuk verifikasi ownership
   * @returns Promise<Course> - Kursus yang berhasil diupdate
   *
   * @throws {Error} Jika kursus tidak ditemukan atau creator tidak memiliki akses
   * @throws {Error} Jika terjadi error saat update database
   *
   */
  async updateCourse(id: string, data: CreateCourseRequest, creatorId: string): Promise<Course> {
    // Verifikasi ownership
    const existingCourse = await prisma.course.findFirst({
      where: { id, creatorId },
    })

    if (!existingCourse) {
      throw new Error('Course not found or access denied')
    }

    // Handle thumbnail - service layer hanya menerima string URL
    const thumbnailUrl =
      typeof data.thumbnail === 'string' ? data.thumbnail : existingCourse.thumbnail // Keep existing if not string

    // Update course
    const course = await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        thumbnail: thumbnailUrl, // Selalu string di database
        category: data.category,
        status: data.status, // 🔥 TAMBAHAN: Update status juga
      },
    })

    return course
  }

  /**
   * Hapus kursus secara permanen (hard delete)
   *
   * @param id - ID kursus yang akan dihapus
   * @param creatorId - ID creator untuk verifikasi ownership
   * @returns Promise<void>
   *
   * @throws {Error} Jika kursus tidak ditemukan atau creator tidak memiliki akses
   * @throws {Error} Jika terjadi error saat delete database
   *
   */
  async deleteCourse(id: string, creatorId: string): Promise<void> {
    // Verifikasi ownership
    const course = await prisma.course.findFirst({
      where: { id, creatorId },
    })

    if (!course) {
      throw new Error('Course not found or access denied')
    }

    // Hard delete
    await prisma.course.delete({
      where: { id },
    })
  }

  /**
   * Update status kursus (DRAFT, PUBLISHED, ARCHIVED)
   *
   * @param id - ID kursus yang akan diupdate statusnya
   * @param status - Status baru untuk kursus
   * @param creatorId - ID creator untuk verifikasi ownership
   * @returns Promise<Course> - Kursus yang berhasil diupdate statusnya
   *
   * @throws {Error} Jika kursus tidak ditemukan atau creator tidak memiliki akses
   * @throws {Error} Jika terjadi error saat update database
   *
   */
  async updateCourseStatus(id: string, status: CourseStatus, creatorId: string): Promise<Course> {
    // Verifikasi ownership
    const course = await prisma.course.findFirst({
      where: { id, creatorId },
    })

    if (!course) {
      throw new Error('Course not found or access denied')
    }

    return await prisma.course.update({
      where: { id },
      data: { status },
    })
  }

  /**
   * Mengambil kursus berdasarkan creator ID (untuk dashboard creator)
   *
   * @param creatorId - ID creator yang kursusnya akan diambil
   * @param page - Nomor halaman (default: 1)
   * @param limit - Jumlah item per halaman (default: 10)
   * @returns Promise<{courses: Course[], pagination: PaginationInfo}> - Daftar kursus creator dan info pagination
   *
   * @throws {Error} Jika terjadi error saat query database
   */
  async getCoursesByCreator(
    creatorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ courses: Course[]; pagination: PaginationInfo }> {
    return this.getCourses(page, limit, creatorId)
  }
}
