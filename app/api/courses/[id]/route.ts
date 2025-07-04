import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/features/course/course-manage/services/courseService'
import { CourseSchema } from '@/features/course/types'

const courseService = new CourseService()

/**
 * GET /api/courses/[id]
 *
 * Mendapatkan detail kursus berdasarkan ID
 *
 * @description
 * Endpoint ini menyediakan akses publik untuk mengambil detail kursus berdasarkan ID.
 * Dapat digunakan untuk:
 * - Menampilkan halaman detail kursus
 * - Preview kursus sebelum edit
 * - API untuk frontend course viewer
 *
 * @param request - NextRequest object
 * @param params - Object yang berisi parameter route (id)
 * @returns NextResponse dengan detail kursus
 *
 * @example
 * ```typescript
 * // Mengambil detail kursus dengan ID tertentu
 * {
 *   "success": true,
 *   "data": {
 *     "id": "course_123",
 *     "title": "Belajar React dari Dasar",
 *     "description": "Kursus lengkap React untuk pemula hingga advanced",
 *     "thumbnail": "https://example.com/thumbnail.jpg",
 *     "category": "Programming",
 *     "status": "DRAFT",
 *     "students": 0,
 *     "lessons": 0,
 *     "duration": "0 jam",
 *     "rating": 0.0,
 *     "creatorId": "user_123",
 *     "createdAt": "2024-01-01T00:00:00Z",
 *     "updatedAt": "2024-01-01T00:00:00Z"
 *   }
 * }
 * ```
 *
 * @throws {400} Jika ID kursus tidak valid
 * @throws {404} Jika kursus tidak ditemukan
 * @throws {500} Jika terjadi error internal server
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course ID is required',
        },
        { status: 400 },
      )
    }

    const course = await courseService.getCourseById(id)

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch course',
      },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/courses/[id]
 *
 * Update metadata kursus berdasarkan ID
 *
 * @description
 * Endpoint ini memungkinkan creator untuk mengupdate metadata kursus yang dimilikinya.
 *
 * TODO: Integrasi Clerk Authentication (TSK-48)
 * - Implementasi middleware auth untuk memverifikasi user session
 * - Extract user ID dari Clerk session untuk creatorId
 * - Validasi ownership: hanya pemilik kursus yang dapat mengupdate
 * - Validasi role user (hanya Creator dan Admin yang dapat mengupdate kursus)
 * - Implementasi audit log untuk tracking perubahan
 *
 * @param request - NextRequest object yang berisi data update dalam body
 * @param params - Object yang berisi parameter route (id)
 * @returns NextResponse dengan data kursus yang berhasil diupdate
 *
 * @example
 * ```typescript
 * // Mengupdate metadata kursus dengan ID tertentu
 * {
 *   "success": true,
 *   "data": {
 *     "id": "course_123",
 *     "title": "React Advanced - Updated",
 *     "description": "Kursus React untuk level advanced dengan konten terbaru",
 *     "thumbnail": "https://example.com/new-thumbnail.jpg",
 *     "category": "Programming",
 *     "status": "DRAFT",
 *     "updatedAt": "2024-01-01T12:00:00Z",
 *     ...
 *   }
 * }
 * ```
 *
 * @throws {400} Jika validasi input gagal atau ID tidak valid
 * @throws {401} Jika user tidak terautentikasi (akan diimplementasi di TSK-48)
 * @throws {403} Jika user tidak memiliki permission (akan diimplementasi di TSK-48)
 * @throws {404} Jika kursus tidak ditemukan atau user tidak memiliki akses
 * @throws {500} Jika terjadi error internal server
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course ID is required',
        },
        { status: 400 },
      )
    }

    // Validasi input menggunakan Zod
    const validationResult = CourseSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    // TODO: Authentication dan authorization akan di-handle di TSK-48
    // Untuk sementara, gunakan placeholder creatorId
    // Di TSK-48 akan diimplementasi:
    // - Middleware auth untuk memverifikasi Clerk session
    // - Extract user ID dari session: const creatorId = auth.userId
    // - Validasi ownership: hanya pemilik kursus yang dapat mengupdate
    // - Validasi role user (Creator/Admin only)
    const creatorId = 'placeholder-creator-id'
    // @ts-expect-error - TODO: TSK-48
    const course = await courseService.updateCourse(id, validationResult.data, creatorId)

    return NextResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error updating course:', error)

    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { status: 404 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update course',
      },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/courses/[id]
 *
 * Hapus kursus secara permanen berdasarkan ID
 *
 * @description
 * Endpoint ini memungkinkan creator untuk menghapus kursus yang dimilikinya secara permanen.
 *
 * TODO: Integrasi Clerk Authentication (TSK-48)
 * - Implementasi middleware auth untuk memverifikasi user session
 * - Extract user ID dari Clerk session untuk creatorId
 * - Validasi ownership: hanya pemilik kursus yang dapat menghapus
 * - Validasi role user (hanya Creator dan Admin yang dapat menghapus kursus)
 * - Implementasi soft delete sebagai alternatif (future enhancement)
 * - Implementasi cascade delete untuk related data (modules, lessons, dll)
 *
 * @param request - NextRequest object
 * @param params - Object yang berisi parameter route (id)
 * @returns NextResponse dengan konfirmasi penghapusan
 *
 * @response
 * ```json
 * {
 *   "success": true,
 *   "message": "Course deleted successfully"
 * }
 * ```
 *
 * @throws {400} Jika ID kursus tidak valid
 * @throws {401} Jika user tidak terautentikasi (akan diimplementasi di TSK-48)
 * @throws {403} Jika user tidak memiliki permission (akan diimplementasi di TSK-48)
 * @throws {404} Jika kursus tidak ditemukan atau user tidak memiliki akses
 * @throws {500} Jika terjadi error internal server
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course ID is required',
        },
        { status: 400 },
      )
    }

    // TODO: Authentication dan authorization akan di-handle di TSK-48
    // Untuk sementara, gunakan placeholder creatorId
    // Di TSK-48 akan diimplementasi:
    // - Middleware auth untuk memverifikasi Clerk session
    // - Extract user ID dari session: const creatorId = auth.userId
    // - Validasi ownership: hanya pemilik kursus yang dapat menghapus
    // - Validasi role user (Creator/Admin only)
    // - Implementasi soft delete sebagai alternatif
    const creatorId = 'placeholder-creator-id'

    await courseService.deleteCourse(id, creatorId)

    return NextResponse.json(
      {
        success: true,
        message: 'Course deleted successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error deleting course:', error)

    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { status: 404 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete course',
      },
      { status: 500 },
    )
  }
}
