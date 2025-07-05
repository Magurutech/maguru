import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/features/course/services/courseService'
import { CourseSchema } from '@/features/course/types'
import { requireAuth, requireRole } from '@/lib/auth-middleware'

const courseService = new CourseService()

/**
 * GET /api/courses/[id]
 *
 * Mendapatkan detail kursus berdasarkan ID
 *
 * @description
 * Endpoint ini menyediakan akses untuk mengambil detail kursus berdasarkan ID.
 * Access control:
 * - Public access untuk GET (tanpa auth)
 * - Creator dapat melihat kursus miliknya sendiri
 * - Admin dapat melihat semua kursus
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
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

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
 * Endpoint ini memungkinkan creator dan admin untuk mengupdate metadata kursus.
 *
 * Authentication & Authorization:
 * - ✅ Authentication required
 * - ✅ Role validation: creator, admin
 * - ✅ Ownership validation: hanya pemilik kursus yang dapat mengupdate
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
 * @throws {401} Jika user tidak terautentikasi
 * @throws {403} Jika user tidak memiliki permission
 * @throws {404} Jika kursus tidak ditemukan atau user tidak memiliki akses
 * @throws {500} Jika terjadi error internal server
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authentication check
    const authResult = await requireAuth()
    if (authResult.error) {
      return authResult.error
    }

    // Role authorization check
    const roleCheck = requireRole(['creator', 'admin'], authResult.user)
    if (roleCheck) {
      return roleCheck
    }

    const { id } = await params
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

    // Extract creatorId dari authenticated user
    const creatorId = authResult.user.clerkId

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
 * Endpoint ini memungkinkan creator dan admin untuk menghapus kursus secara permanen.
 *
 * Authentication & Authorization:
 * - ✅ Authentication required
 * - ✅ Role validation: creator, admin
 * - ✅ Ownership validation: hanya pemilik kursus yang dapat menghapus
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
 * @throws {401} Jika user tidak terautentikasi
 * @throws {403} Jika user tidak memiliki permission
 * @throws {404} Jika kursus tidak ditemukan atau user tidak memiliki akses
 * @throws {500} Jika terjadi error internal server
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authentication check
    const authResult = await requireAuth()
    if (authResult.error) {
      return authResult.error
    }

    // Role authorization check
    const roleCheck = requireRole(['creator', 'admin'], authResult.user)
    if (roleCheck) {
      return roleCheck
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course ID is required',
        },
        { status: 400 },
      )
    }

    // Extract creatorId dari authenticated user
    const creatorId = authResult.user.clerkId

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
