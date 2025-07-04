import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/features/course/services/courseService'
import { CourseSchema } from '@/features/course/types'

const courseService = new CourseService()

/**
 * GET /api/courses
 *
 * Mendapatkan daftar kursus dengan pagination dan filter opsional
 *
 * @description
 * Endpoint ini menyediakan akses publik untuk mengambil daftar kursus dengan pagination.
 * Dapat digunakan untuk:
 * - Menampilkan daftar kursus di homepage
 * - Implementasi search dan filter (future enhancement)
 * - Dashboard admin untuk melihat semua kursus
 * - Dashboard creator untuk melihat kursus miliknya sendiri
 *
 * Query Parameters:
 * - page: Nomor halaman (default: 1)
 * - limit: Jumlah item per halaman (default: 10, max: 50)
 * - creatorId: Filter opsional untuk mengambil kursus berdasarkan creator ID
 *
 * @param request - NextRequest object yang berisi query parameters
 * @returns NextResponse dengan data kursus dan pagination info
 *
 * @example
 * ```typescript
 * // Mengambil semua kursus (public)
 * GET /api/courses?page=1&limit=10
 *
 * // Mengambil kursus milik creator tertentu
 * GET /api/courses?page=1&limit=10&creatorId=user_123
 * ```
 *
 * @response
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "courses": [...],
 *     "pagination": {
 *       "page": 1,
 *       "limit": 10,
 *       "total": 25,
 *       "totalPages": 3
 *     }
 *   }
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const creatorId = searchParams.get('creatorId') || undefined

    // Validasi pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1-50',
        },
        { status: 400 },
      )
    }

    const result = await courseService.getCourses(page, limit, creatorId)

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch courses',
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/courses
 *
 * Membuat kursus baru dengan metadata dasar
 *
 * @description
 * Endpoint ini memungkinkan creator untuk membuat kursus baru.
 *
 * TODO: Integrasi Clerk Authentication (TSK-48)
 * - Implementasi middleware auth untuk memverifikasi user session
 * - Extract user ID dari Clerk session untuk creatorId
 * - Validasi role user (hanya Creator dan Admin yang dapat membuat kursus)
 * - Implementasi rate limiting untuk mencegah spam
 *
 * @param request - NextRequest object yang berisi data kursus dalam body
 * @returns NextResponse dengan data kursus yang berhasil dibuat
 *
 * @response
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "id": "course_123",
 *     "title": "Belajar React dari Dasar",
 *     "description": "Kursus lengkap React untuk pemula hingga advanced",
 *     "status": "DRAFT",
 *     "creatorId": "user_123",
 *     "createdAt": "2024-01-01T00:00:00Z",
 *     ...
 *   }
 * }
 * ```
 *
 * @throws {400} Jika validasi input gagal
 * @throws {401} Jika user tidak terautentikasi (akan diimplementasi di TSK-48)
 * @throws {403} Jika user tidak memiliki permission (akan diimplementasi di TSK-48)
 * @throws {500} Jika terjadi error internal server
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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
    // - Validasi role user (Creator/Admin only)
    const creatorId = 'placeholder-creator-id'

    const course = await courseService.createCourse(validationResult.data, creatorId)

    return NextResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating course:', error)

    if (error instanceof Error) {
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
        error: 'Failed to create course',
      },
      { status: 500 },
    )
  }
}
