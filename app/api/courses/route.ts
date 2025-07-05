import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/features/course/services/courseService'
import { CourseSchema } from '@/features/course/types'
import { requireAuth, requireRole } from '@/lib/auth-middleware'

const courseService = new CourseService()

/**
 * GET /api/courses
 *
 * Mendapatkan daftar kursus dengan pagination dan filter opsional
 *
 * @description
 * Endpoint ini menyediakan akses untuk mengambil daftar kursus dengan pagination.
 * Access control:
 * - Public access untuk GET (tanpa auth)
 * - Creator dapat melihat kursus miliknya sendiri
 * - Admin dapat melihat semua kursus
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
 * // Mengambil kursus milik creator tertentu (authenticated)
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

    // Authentication check (optional untuk GET)
    let authenticatedUser = null
    try {
      const authResult = await requireAuth()
      if (authResult.error) {
        // Jika tidak ada auth, tetap bisa akses public courses
        console.log('No authentication for GET /api/courses - public access')
      } else {
        authenticatedUser = authResult.user
      }
    } catch {
      // Continue without authentication for public access
      console.log('Authentication failed for GET /api/courses - continuing with public access')
    }

    // Role-based filtering
    let finalCreatorId = creatorId
    if (authenticatedUser) {
      if (authenticatedUser.role === 'creator') {
        // Creator hanya bisa lihat kursus miliknya sendiri
        finalCreatorId = authenticatedUser.clerkId
      } else if (authenticatedUser.role === 'admin') {
        // Admin bisa lihat semua kursus (creatorId tetap sesuai parameter)
        finalCreatorId = creatorId
      } else {
        // User biasa tidak bisa akses creator-specific data
        finalCreatorId = undefined
      }
    } else {
      // Public access - tidak ada creatorId filter
      finalCreatorId = undefined
    }

    const result = await courseService.getCourses(page, limit, finalCreatorId)

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
 * Endpoint ini memungkinkan creator dan admin untuk membuat kursus baru.
 *
 * Authentication & Authorization:
 * - ✅ Authentication required
 * - ✅ Role validation: creator, admin
 * - ✅ CreatorId otomatis dari session
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
 * @throws {401} Jika user tidak terautentikasi
 * @throws {403} Jika user tidak memiliki permission
 * @throws {500} Jika terjadi error internal server
 */
export async function POST(request: NextRequest) {
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

    // Extract creatorId dari authenticated user
    const creatorId = authResult.user.clerkId

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
