import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/features/course/services/courseService'
import { CourseSchema } from '@/features/course/types'
import { requireAuth, requireRole } from '@/lib/auth-middleware'
import { storageUtils } from '@/lib/supabase'
import { logger } from '@/services/logger'

const courseService = new CourseService()

export const config = {
  api: {
    bodyParser: false,
  },
}

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
    logger.error('API_Courses_Detail', 'GET', 'Error fetching course', error as Error)
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
  const timer = logger.startTimer('API_Courses_Detail', 'PUT', 'Course update')

  try {
    logger.info('API_Courses_Detail', 'PUT', 'Starting course update process')

    // Authentication check
    const authResult = await requireAuth()
    if (authResult.error) {
      logger.warn('API_Courses_Detail', 'PUT', 'Authentication failed', { error: authResult.error })
      return authResult.error
    }

    logger.info('API_Courses_Detail', 'PUT', 'Authentication successful', {
      userId: authResult.user.clerkId,
    })

    // Role authorization check
    const roleCheck = requireRole(['creator', 'admin'], authResult.user)
    if (roleCheck) {
      logger.warn('API_Courses_Detail', 'PUT', 'Role authorization failed', {
        role: authResult.user.role,
      })
      return roleCheck
    }

    logger.info('API_Courses_Detail', 'PUT', 'Role authorization successful', {
      role: authResult.user.role,
    })

    const { id } = await params
    if (!id) {
      logger.warn('API_Courses_Detail', 'PUT', 'Course ID is missing')
      return NextResponse.json(
        {
          success: false,
          error: 'Course ID is required',
        },
        { status: 400 },
      )
    }

    logger.info('API_Courses_Detail', 'PUT', 'Course ID validated', { courseId: id })

    // Ambil data kursus lama
    const oldCourse = await courseService.getCourseById(id)
    if (!oldCourse) {
      logger.warn('API_Courses_Detail', 'PUT', 'Course not found', { courseId: id })
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
        },
        { status: 404 },
      )
    }

    logger.info('API_Courses_Detail', 'PUT', 'Old course data retrieved', { courseId: id })

    // Parse FormData (kompatibel dengan Next.js App Router)
    let formData: FormData
    try {
      formData = await request.formData()
      logger.info('API_Courses_Detail', 'PUT', 'FormData parsed successfully')
    } catch (parseError) {
      logger.error('API_Courses_Detail', 'PUT', 'Failed to parse FormData', parseError as Error)
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

    logger.info('API_Courses_Detail', 'PUT', 'FormData extracted', {
      fields: Object.keys(fields),
      files: Object.keys(files),
    })

    // Validasi input menggunakan Zod
    const validationResult = CourseSchema.safeParse(fields)
    if (!validationResult.success) {
      logger.warn('API_Courses_Detail', 'PUT', 'Validation failed', {
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

    logger.info('API_Courses_Detail', 'PUT', 'Validation successful')

    // Handle thumbnail upload
    let thumbnailUrl = fields.thumbnail || ''
    let oldThumbnailPath = ''

    if (oldCourse && oldCourse.thumbnail && files.thumbnail) {
      logger.info('API_Courses_Detail', 'PUT', 'Removing old thumbnail')
      // Parse path dari URL lama menggunakan storageUtils
      oldThumbnailPath = storageUtils.extractFilePathFromUrl(oldCourse.thumbnail) || ''
      if (oldThumbnailPath) {
        try {
          // Hapus file lama menggunakan storageUtils
          await storageUtils.deleteThumbnail(oldThumbnailPath)
          logger.info('API_Courses_Detail', 'PUT', 'Old thumbnail removed successfully', {
            oldThumbnailPath,
          })
        } catch (removeError) {
          logger.warn('API_Courses_Detail', 'PUT', 'Exception removing old thumbnail', {
            oldThumbnailPath,
            error: removeError,
          })
          // Continue dengan upload thumbnail baru meski gagal hapus yang lama
        }
      }
    }

    if (files.thumbnail) {
      logger.info('API_Courses_Detail', 'PUT', 'Starting thumbnail upload')

      try {
        const file = files.thumbnail
        const fileExt = file.name.split('.').pop()
        const fileName = `course-${id}-${Date.now()}.${fileExt}`

        // Upload ke bucket 'course-thumbnails' sesuai standar
        thumbnailUrl = await storageUtils.uploadThumbnail(file, fileName)

        logger.info('API_Courses_Detail', 'PUT', 'Thumbnail upload successful', {
          fileName,
          bucket: 'course-thumbnails',
          url: thumbnailUrl,
        })
      } catch (uploadError) {
        logger.error('API_Courses_Detail', 'PUT', 'Thumbnail upload error', uploadError as Error)
        return NextResponse.json(
          { success: false, error: 'Gagal upload thumbnail' },
          { status: 500 },
        )
      }
    }

    // Extract creatorId dari authenticated user
    const creatorId = authResult.user.clerkId

    logger.info('API_Courses_Detail', 'PUT', 'Updating course in database', {
      courseId: id,
      creatorId,
    })

    const course = await courseService.updateCourse(
      id,
      { ...validationResult.data, thumbnail: thumbnailUrl },
      creatorId,
    )

    const duration = timer.end('Course updated successfully')
    logger.info('API_Courses_Detail', 'PUT', 'Course update completed', {
      courseId: id,
      duration: `${duration}ms`,
    })

    return NextResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 200 },
    )
  } catch (error) {
    timer.end('Course update failed')
    logger.error('API_Courses_Detail', 'PUT', 'Error updating course', error as Error)

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
  const timer = logger.startTimer('API_Courses_Detail', 'DELETE', 'Course deletion')

  try {
    logger.info('API_Courses_Detail', 'DELETE', 'Starting course deletion process')

    // Authentication check
    const authResult = await requireAuth()
    if (authResult.error) {
      logger.warn('API_Courses_Detail', 'DELETE', 'Authentication failed', {
        error: authResult.error,
      })
      return authResult.error
    }

    logger.info('API_Courses_Detail', 'DELETE', 'Authentication successful', {
      userId: authResult.user.clerkId,
    })

    // Role authorization check
    const roleCheck = requireRole(['creator', 'admin'], authResult.user)
    if (roleCheck) {
      logger.warn('API_Courses_Detail', 'DELETE', 'Role authorization failed', {
        role: authResult.user.role,
      })
      return roleCheck
    }

    logger.info('API_Courses_Detail', 'DELETE', 'Role authorization successful', {
      role: authResult.user.role,
    })

    const { id } = await params
    if (!id) {
      logger.warn('API_Courses_Detail', 'DELETE', 'Course ID is missing')
      return NextResponse.json(
        {
          success: false,
          error: 'Course ID is required',
        },
        { status: 400 },
      )
    }

    logger.info('API_Courses_Detail', 'DELETE', 'Course ID validated', { courseId: id })

    // Ambil data kursus lama
    const oldCourse = await courseService.getCourseById(id)
    if (oldCourse && oldCourse.thumbnail) {
      logger.info('API_Courses_Detail', 'DELETE', 'Removing course thumbnail')
      const oldThumbnailPath = storageUtils.extractFilePathFromUrl(oldCourse.thumbnail)
      if (oldThumbnailPath) {
        try {
          await storageUtils.deleteThumbnail(oldThumbnailPath)
          logger.info('API_Courses_Detail', 'DELETE', 'Thumbnail removed successfully', {
            oldThumbnailPath,
          })
        } catch (removeError) {
          logger.warn('API_Courses_Detail', 'DELETE', 'Exception removing thumbnail', {
            oldThumbnailPath,
            error: removeError,
          })
          // Continue dengan delete course meski gagal hapus thumbnail
        }
      }
    }

    // Extract creatorId dari authenticated user
    const creatorId = authResult.user.clerkId

    logger.info('API_Courses_Detail', 'DELETE', 'Deleting course from database', {
      courseId: id,
      creatorId,
    })

    await courseService.deleteCourse(id, creatorId)

    const duration = timer.end('Course deleted successfully')
    logger.info('API_Courses_Detail', 'DELETE', 'Course deletion completed', {
      courseId: id,
      duration: `${duration}ms`,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Course deleted successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    timer.end('Course deletion failed')
    logger.error('API_Courses_Detail', 'DELETE', 'Error deleting course', error as Error)

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
