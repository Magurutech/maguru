import { prisma } from '@/lib/prisma'
import type { Course, CreateCourseRequest, UpdateCourseRequest, PaginationInfo } from '../types'
import { CourseStatus } from '../types'

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
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        category: data.category,
        status: CourseStatus.DRAFT,
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
   * Mengambil daftar kursus dengan pagination dan filter opsional
   *
   * @param page - Nomor halaman (default: 1)
   * @param limit - Jumlah item per halaman (default: 10, max: 50)
   * @param creatorId - Filter opsional untuk mengambil kursus berdasarkan creator ID
   * @returns Promise<{courses: Course[], pagination: PaginationInfo}> - Daftar kursus dan info pagination
   *
   * @throws {Error} Jika terjadi error saat query database
   */
  async getCourses(
    page: number = 1,
    limit: number = 10,
    creatorId?: string,
  ): Promise<{ courses: Course[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit
    const take = Math.min(limit, 50) // Max 50 items per page

    // Build where clause
    const where = creatorId ? { creatorId } : {}

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
  async updateCourse(id: string, data: UpdateCourseRequest, creatorId: string): Promise<Course> {
    // Verifikasi ownership
    const existingCourse = await prisma.course.findFirst({
      where: { id, creatorId },
    })

    if (!existingCourse) {
      throw new Error('Course not found or access denied')
    }

    // Update course
    const course = await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        category: data.category,
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
