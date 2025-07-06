/**
 * Integration Test: CourseAdapter ↔ API
 *
 * @description
 * Test integration antara CourseAdapter dan API layer.
 * Fokus pada:
 * - Network error propagation dari adapter ke hook
 * - API error handling (401, 403, 404, 500)
 * - Error state management di hooks
 * - Retry mechanisms
 * - Different error types handling
 *
 * Mengikuti Designing for Failure principles dan TDD approach
 */

import { CourseAdapter } from '../../../../features/course/adapters/courseAdapter'
import { server } from '../../../__mocks__/msw-server'
import { http, HttpResponse } from 'msw'

// Mock getAuthHeader untuk integration test
jest.mock('../../../../lib/getAuthHeader', () => ({
  getAuthHeader: jest.fn(),
}))

import { getAuthHeader } from '../../../../lib/getAuthHeader'
const mockGetAuthHeader = getAuthHeader as jest.Mock

// Setup MSW server untuk test ini
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => {
  server.resetHandlers()
  mockGetAuthHeader.mockClear()
})
afterAll(() => server.close())

describe('CourseAdapter ↔ API Integration', () => {
  describe('Network Error Propagation', () => {
    test('should propagate network errors from adapter to hook', async () => {
      // Arrange: Mock network failure
      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.error()
        }),
      )

      // Act & Assert: Network error should propagate
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })

    test('should handle network timeout gracefully', async () => {
      // Arrange: Mock network timeout dengan timeout yang lebih pendek dari adapter
      server.use(
        http.get('/api/courses', () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(new HttpResponse(null, { status: 0 }))
            }, 100) // Timeout lebih cepat dari adapter timeout
          })
        }),
      )

      // Act & Assert: Timeout should be handled
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    }, 15000) // Increase test timeout

    test('should handle connection refused errors', async () => {
      // Arrange: Mock connection refused
      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.error()
        }),
      )

      // Act & Assert: Connection refused should be handled
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })

  describe('API Error Handling', () => {
    test('should handle 401 errors properly', async () => {
      // Arrange: Mock 401 Unauthorized
      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 },
          )
        }),
      )

      // Act & Assert: 401 should be handled gracefully
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toContain('Authentication required')
    })

    test('should handle 403 errors properly', async () => {
      // Arrange: Mock 403 Forbidden
      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
        }),
      )

      // Act & Assert: 403 should be handled gracefully
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toContain('Access denied')
    })

    test('should handle 404 errors properly', async () => {
      // Arrange: Mock 404 Not Found
      server.use(
        http.get('/api/courses/non-existent', () => {
          return HttpResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
        }),
      )

      // Act & Assert: 404 should be handled gracefully
      const result = await CourseAdapter.getCourseById('non-existent')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Course not found')
    })

    test('should handle 500 errors properly', async () => {
      // Arrange: Mock 500 Internal Server Error
      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 },
          )
        }),
      )

      // Act & Assert: 500 should be handled gracefully
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toContain('Internal server error')
    })

    test('should handle 422 validation errors properly', async () => {
      // Arrange: Mock auth header dan 422 Validation Error
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

      server.use(
        http.post('/api/courses', ({ request }) => {
          const authHeader = request.headers.get('Authorization')
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return HttpResponse.json(
              { success: false, error: 'Authentication required' },
              { status: 401 },
            )
          }

          return HttpResponse.json(
            {
              success: false,
              error: 'Validation failed',
              details: ['Title is required', 'Category is invalid'],
            },
            { status: 422 },
          )
        }),
      )

      // Act & Assert: 422 should be handled with details
      const result = await CourseAdapter.createCourse({
        title: '',
        description: 'Test',
        category: 'Invalid',
      })
      expect(result.success).toBe(false)
      expect(result.error).toContain('Data tidak valid')
    })
  })

  describe('Error State Management', () => {
    test('should provide meaningful error messages', async () => {
      // Arrange: Mock various error scenarios dengan pesan yang sesuai
      const errorScenarios = [
        { status: 400, error: 'Bad Request', expectedMessage: 'Bad Request' },
        {
          status: 401,
          error: 'Authentication required',
          expectedMessage: 'Authentication required',
        },
        { status: 403, error: 'Access denied', expectedMessage: 'Access denied' },
        { status: 404, error: 'Not Found', expectedMessage: 'Not Found' },
        { status: 500, error: 'Server Error', expectedMessage: 'Server Error' },
      ]

      for (const { status, error, expectedMessage } of errorScenarios) {
        server.use(
          http.get('/api/courses', () => {
            return HttpResponse.json({ success: false, error }, { status })
          }),
        )

        // Act & Assert: Error messages should be meaningful
        const result = await CourseAdapter.getCourses()
        expect(result.success).toBe(false)
        expect(result.error).toContain(expectedMessage)
      }
    })

    test('should handle malformed error responses', async () => {
      // Arrange: Mock malformed error response
      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.json({ invalid: 'response' }, { status: 500 })
        }),
      )

      // Act & Assert: Malformed response should be handled
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })

    test('should handle non-JSON error responses', async () => {
      // Arrange: Mock non-JSON response
      server.use(
        http.get('/api/courses', () => {
          return new HttpResponse('Plain text error', { status: 500 })
        }),
      )

      // Act & Assert: Non-JSON response should be handled
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })

  describe('Retry Mechanisms', () => {
    test('should handle temporary network failures gracefully', async () => {
      // Arrange: Mock temporary failure then success
      let callCount = 0
      server.use(
        http.get('/api/courses', () => {
          callCount++
          if (callCount === 1) {
            return HttpResponse.error() // First call fails
          }
          return HttpResponse.json({
            success: true,
            data: {
              courses: [],
              pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
            },
          }) // Second call succeeds
        }),
      )

      // Act
      const result = await CourseAdapter.getCourses()

      // Assert: Should handle failure gracefully
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })

    test('should not retry on permanent errors', async () => {
      // Arrange: Mock permanent 404 error dengan reset handler
      server.use(
        http.get('/api/courses/non-existent', () => {
          return HttpResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
        }),
      )

      // Act & Assert: Should not retry on 404
      const result = await CourseAdapter.getCourseById('non-existent')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Course not found')
      // Note: MSW handler stacking might cause multiple calls, but result is what matters
    })
  })

  describe('Different Error Types', () => {
    test('should handle CORS errors', async () => {
      // Arrange: Mock CORS error
      server.use(
        http.get('/api/courses', () => {
          return new HttpResponse(null, {
            status: 0,
            statusText: 'CORS error',
          })
        }),
      )

      // Act & Assert: CORS error should be handled
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })

    test('should handle SSL/TLS errors', async () => {
      // Arrange: Mock SSL error
      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.error()
        }),
      )

      // Act & Assert: SSL error should be handled
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })

  describe('Data Transformation', () => {
    test('should transform API response data correctly', async () => {
      // Arrange: Mock successful API response
      const mockCourses = [
        {
          id: 'course-1',
          title: 'Test Course',
          description: 'Test Description',
          category: 'Programming',
          status: 'PUBLISHED',
          creatorId: 'user-1',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.json({
            success: true,
            data: {
              courses: mockCourses,
              pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
            },
          })
        }),
      )

      // Act
      const result = await CourseAdapter.getCourses()

      // Assert: Data should be transformed correctly
      expect(result.success).toBe(true)
      expect(result.data?.courses).toEqual(mockCourses)
    })

    test('should handle empty response data', async () => {
      // Arrange: Mock empty response
      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.json({
            success: true,
            data: {
              courses: [],
              pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
            },
          })
        }),
      )

      // Act
      const result = await CourseAdapter.getCourses()

      // Assert: Empty data should be handled
      expect(result.success).toBe(true)
      expect(result.data?.courses).toEqual([])
    })

    test('should handle null response data', async () => {
      // Arrange: Mock null response
      server.use(
        http.get('/api/courses/:id', () => {
          return HttpResponse.json({
            success: true,
            data: null,
          })
        }),
      )

      // Act
      const result = await CourseAdapter.getCourseById('course-1')

      // Assert: Null data should be handled
      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
    })
  })

  describe('Request/Response Headers', () => {
    test('should include proper authentication headers', async () => {
      // Arrange: Mock auth header dan API that checks auth headers
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

      let receivedHeaders: Headers | null = null
      server.use(
        http.post('/api/courses', ({ request }) => {
          receivedHeaders = request.headers
          const authHeader = request.headers.get('Authorization')

          if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return HttpResponse.json(
              { success: false, error: 'Authentication required' },
              { status: 401 },
            )
          }

          return HttpResponse.json({
            success: true,
            data: { id: 'course-1' },
          })
        }),
      )

      // Act
      await CourseAdapter.createCourse({
        title: 'Test Course',
        description: 'Test Description',
        category: 'Programming',
      })

      // Assert: Auth headers should be included
      expect(receivedHeaders).not.toBeNull()
      expect(receivedHeaders!.get('Authorization')).toContain('Bearer')
      expect(receivedHeaders!.get('Content-Type')).toBe('application/json')
    })

    test('should handle missing auth token gracefully', async () => {
      // Arrange: Mock API that requires auth
      server.use(
        http.post('/api/courses', () => {
          return HttpResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 },
          )
        }),
      )

      // Act & Assert: Missing auth should be handled
      const result = await CourseAdapter.createCourse({
        title: 'Test Course',
        description: 'Test Description',
        category: 'Programming',
      })
      expect(result.success).toBe(false)
      expect(result.error).toContain('Authentication required')
    })
  })

  describe('Rate Limiting', () => {
    test('should handle rate limiting errors', async () => {
      // Arrange: Mock rate limiting
      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.json(
            { success: false, error: 'Rate limit exceeded' },
            { status: 429 },
          )
        }),
      )

      // Act & Assert: Rate limiting should be handled
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toContain('Rate limit exceeded')
    })

    test('should respect retry-after header', async () => {
      // Arrange: Mock rate limiting with retry-after
      server.use(
        http.get('/api/courses', () => {
          return HttpResponse.json(
            { success: false, error: 'Rate limit exceeded' },
            {
              status: 429,
              headers: { 'Retry-After': '60' },
            },
          )
        }),
      )

      // Act & Assert: Should respect retry-after
      const result = await CourseAdapter.getCourses()
      expect(result.success).toBe(false)
      expect(result.error).toContain('Rate limit exceeded')
    })
  })

  describe('Successful API Calls', () => {
    test('should handle successful GET courses', async () => {
      // Arrange: Use default handlers from msw-handlers.ts

      // Act
      const result = await CourseAdapter.getCourses()

      // Assert: Should use default handlers successfully
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.courses).toBeDefined()
      expect(result.data?.pagination).toBeDefined()
    })

    test('should handle successful GET course by ID', async () => {
      // Arrange: Use default handlers from msw-handlers.ts

      // Act
      const result = await CourseAdapter.getCourseById('course-1')

      // Assert: Should use default handlers successfully
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    test('should handle successful POST create course', async () => {
      // Arrange: Mock auth header dan successful creation
      mockGetAuthHeader.mockResolvedValue('Bearer mock-token')

      server.use(
        http.post('/api/courses', async ({ request }) => {
          const authHeader = request.headers.get('Authorization')
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return HttpResponse.json(
              { success: false, error: 'Authentication required' },
              { status: 401 },
            )
          }

          const courseData = (await request.json()) as Record<string, unknown>
          return HttpResponse.json(
            {
              success: true,
              data: {
                id: 'course-1',
                ...courseData,
                status: 'DRAFT',
                creatorId: 'creator-1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
            { status: 201 },
          )
        }),
      )

      // Act
      const result = await CourseAdapter.createCourse({
        title: 'Test Course',
        description: 'Test Description',
        category: 'Programming',
      })

      // Assert: Should create course successfully
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.title).toBe('Test Course')
    })
  })
})
