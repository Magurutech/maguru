import { http, HttpResponse } from 'msw'
import {
  getMockCoursesResponse,
  getMockCourseById,
  createMockCourse,
  updateMockCourse,
  updateMockCourseStatus,
} from './msw/course-data'

/**
 * Handlers untuk mock API response dari endpoint pengguna dan kursus
 * Digunakan dengan MSW untuk integration testing
 */
export const handlers = [
  // ===== COURSE HANDLERS =====
  /**
   * Mock GET endpoint untuk mengambil daftar kursus
   * Mendukung pagination dan filtering berdasarkan creatorId
   */
  http.get('/api/courses', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const creatorId = url.searchParams.get('creatorId')

    // Validasi pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1-50',
        },
        { status: 400 },
      )
    }

    const response = getMockCoursesResponse(creatorId, page, limit)

    return HttpResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 200 },
    )
  }),

  /**
   * Mock GET endpoint untuk mengambil detail kursus berdasarkan ID
   */
  http.get('/api/courses/:id', ({ params }) => {
    const { id } = params
    const course = getMockCourseById(id as string)

    if (!course) {
      return HttpResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    return HttpResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 200 },
    )
  }),

  /**
   * Mock POST endpoint untuk membuat kursus baru
   */
  http.post('/api/courses', async ({ request }) => {
    // Check authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, error: 'Authentication required. Please sign in.' },
        { status: 401 },
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courseData = (await request.json()) as any

    // Validation
    if (!courseData?.title || !courseData?.description || !courseData?.category) {
      return HttpResponse.json({ success: false, error: 'Validation failed' }, { status: 400 })
    }

    const newCourse = createMockCourse(courseData, 'creator-1')

    return HttpResponse.json(
      {
        success: true,
        data: newCourse,
      },
      { status: 201 },
    )
  }),

  /**
   * Mock PUT endpoint untuk update kursus
   */
  http.put('/api/courses/:id', async ({ request, params }) => {
    const { id } = params

    // Check authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, error: 'Authentication required. Please sign in to update a course.' },
        { status: 401 },
      )
    }

    const course = getMockCourseById(id as string)
    if (!course) {
      return HttpResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData = (await request.json()) as any
    const updatedCourse = updateMockCourse(id as string, updateData, 'creator-1')

    if (!updatedCourse) {
      return HttpResponse.json(
        { success: false, error: 'Access denied. Only course owners can update this course.' },
        { status: 403 },
      )
    }

    return HttpResponse.json(
      {
        success: true,
        data: updatedCourse,
      },
      { status: 200 },
    )
  }),

  /**
   * Mock DELETE endpoint untuk menghapus kursus
   */
  http.delete('/api/courses/:id', ({ request, params }) => {
    const { id } = params

    // Check authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, error: 'Authentication required. Please sign in to delete a course.' },
        { status: 401 },
      )
    }

    const course = getMockCourseById(id as string)
    if (!course) {
      return HttpResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    return HttpResponse.json(
      {
        success: true,
        message: 'Course deleted successfully',
      },
      { status: 200 },
    )
  }),

  /**
   * Mock PATCH endpoint untuk update status kursus
   */
  http.patch('/api/courses/:id/status', async ({ request, params }) => {
    const { id } = params

    // Check authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Authentication required. Please sign in to update course status.',
        },
        { status: 401 },
      )
    }

    const course = getMockCourseById(id as string)
    if (!course) {
      return HttpResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { status } = (await request.json()) as any
    const updatedCourse = updateMockCourseStatus(id as string, status, 'creator-1')

    if (!updatedCourse) {
      return HttpResponse.json(
        { success: false, error: 'Access denied. Only course owners can update course status.' },
        { status: 403 },
      )
    }

    return HttpResponse.json(
      {
        success: true,
        data: updatedCourse,
      },
      { status: 200 },
    )
  }),
]
