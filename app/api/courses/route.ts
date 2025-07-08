import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/features/course/services/courseService'
import { CourseSchema, DEFAULT_COURSE_THUMBNAIL } from '@/features/course/types'
import { requireAuth, requireRole } from '@/lib/auth-middleware'
import { storageUtils } from '@/lib/supabase'
import { logger } from '@/services/logger'

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

    // 🔥 TAMBAHAN: Extract search parameters
    const searchQuery = searchParams.get('search') || undefined
    const statusFilter = searchParams.get('status') || undefined
    const categoryFilter = searchParams.get('category') || undefined

    logger.info('API_Courses', 'GET', 'Processing request with filters', {
      page,
      limit,
      creatorId,
      searchQuery,
      statusFilter,
      categoryFilter,
    })

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
        logger.info('API_Courses', 'GET', 'No authentication for GET /api/courses - public access')
      } else {
        authenticatedUser = authResult.user
      }
    } catch {
      // Continue without authentication for public access
      logger.info(
        'API_Courses',
        'GET',
        'Authentication failed for GET /api/courses - continuing with public access',
      )
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

    // 🔥 TAMBAHAN: Pass search parameters ke service
    const result = await courseService.getCourses(page, limit, finalCreatorId, {
      searchQuery,
      statusFilter,
      categoryFilter,
    })

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 },
    )
  } catch (error) {
    logger.error('API_Courses', 'GET', 'Error fetching courses', error as Error)
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
  const timer = logger.startTimer('API_Courses', 'POST', 'Course creation')

  try {
    logger.info('API_Courses', 'POST', 'Starting course creation process')

    // Authentication check
    const authResult = await requireAuth()
    if (authResult.error) {
      logger.warn('API_Courses', 'POST', 'Authentication failed', { error: authResult.error })
      return authResult.error
    }

    logger.info('API_Courses', 'POST', 'Authentication successful', {
      userId: authResult.user.clerkId,
    })

    // Role authorization check
    const roleCheck = requireRole(['creator', 'admin'], authResult.user)
    if (roleCheck) {
      logger.warn('API_Courses', 'POST', 'Role authorization failed', {
        role: authResult.user.role,
      })
      return roleCheck
    }

    logger.info('API_Courses', 'POST', 'Role authorization successful', {
      role: authResult.user.role,
    })

    // Parse FormData (kompatibel dengan Next.js App Router)
    let formData: FormData
    try {
      formData = await request.formData()
      logger.info('API_Courses', 'POST', 'FormData parsed successfully')
    } catch (parseError) {
      logger.error('API_Courses', 'POST', 'Failed to parse FormData', parseError as Error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse form data',
        },
        { status: 400 },
      )
    }

    // Extract fields dari FormData
    const fields: Record<string, string> = {}
    const files: Record<string, File> = {}

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files[key] = value
      } else {
        fields[key] = value as string
      }
    }

    logger.info('API_Courses', 'POST', 'FormData extracted', {
      fields: Object.keys(fields),
      files: Object.keys(files),
    })

    // Validasi input menggunakan Zod
    const validationResult = CourseSchema.safeParse(fields)
    if (!validationResult.success) {
      logger.warn('API_Courses', 'POST', 'Validation failed', {
        errors: validationResult.error.errors,
      })
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

    logger.info('API_Courses', 'POST', 'Validation successful')

    // Handle thumbnail upload dengan fallback ke default
    let thumbnailUrl = fields.thumbnail || ''
    if (files.thumbnail) {
      logger.info('API_Courses', 'POST', 'Starting thumbnail upload')

      try {
        const file = files.thumbnail
        const fileExt = file.name.split('.').pop()
        const fileName = `course-${Date.now()}.${fileExt}`

        // Upload ke bucket 'course-thumbnails' sesuai dengan arsitektur
        // Menggunakan storageUtils yang sudah diimplementasi untuk Supabase
        thumbnailUrl = await storageUtils.uploadThumbnail(file, fileName)

        logger.info('API_Courses', 'POST', 'Thumbnail upload successful', {
          fileName,
          bucket: 'course-thumbnails',
          url: thumbnailUrl,
        })
      } catch (uploadError) {
        logger.error('API_Courses', 'POST', 'Thumbnail upload error', uploadError as Error)
        return NextResponse.json(
          { success: false, error: 'Gagal upload thumbnail' },
          { status: 500 },
        )
      }
    } else {
      // Jika tidak ada thumbnail upload, gunakan default
      thumbnailUrl = DEFAULT_COURSE_THUMBNAIL.URL
      logger.info('API_Courses', 'POST', 'Using default thumbnail', { thumbnailUrl })
    }

    // Extract creatorId dari authenticated user
    const creatorId = authResult.user.clerkId

    logger.info('API_Courses', 'POST', 'Creating course in database', { creatorId })

    // Service layer hanya menerima string URL, bukan File
    const course = await courseService.createCourse(
      { ...validationResult.data, thumbnail: thumbnailUrl },
      creatorId,
    )

    const duration = timer.end('Course created successfully')
    logger.info('API_Courses', 'POST', 'Course creation completed', {
      courseId: course.id,
      duration: `${duration}ms`,
    })

    return NextResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 201 },
    )
  } catch (error) {
    timer.end('Course creation failed')
    logger.error('API_Courses', 'POST', 'Error creating course', error as Error)

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
