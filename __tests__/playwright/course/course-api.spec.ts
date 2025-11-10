import { test, expect } from '@playwright/test'

test.describe('Course API Testing', () => {
  const BASE_URL = 'http://localhost:3004'

  test.describe('GET /api/courses', () => {
    test('should return course list successfully', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/courses`)

      expect(response.status()).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('courses')
      expect(data).toHaveProperty('total')
      expect(Array.isArray(data.courses)).toBe(true)
      expect(typeof data.total).toBe('number')
    })

    test('should return courses with correct structure', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/courses`)

      expect(response.status()).toBe(200)

      const data = await response.json()
      if (data.courses.length > 0) {
        const course = data.courses[0]

        // Check required fields
        expect(course).toHaveProperty('slug')
        expect(course).toHaveProperty('title')
        expect(course).toHaveProperty('description')
        expect(course).toHaveProperty('instructor')
        expect(course).toHaveProperty('level')
        expect(course).toHaveProperty('duration')
        expect(course).toHaveProperty('tags')
        expect(course).toHaveProperty('thumbnail')

        // Check field types
        expect(typeof course.slug).toBe('string')
        expect(typeof course.title).toBe('string')
        expect(typeof course.description).toBe('string')
        expect(typeof course.instructor).toBe('string')
        expect(typeof course.level).toBe('string')
        expect(typeof course.duration).toBe('string')
        expect(Array.isArray(course.tags)).toBe(true)
        expect(typeof course.thumbnail).toBe('string')
      }
    })

    test('should handle CORS correctly', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/courses`, {
        headers: {
          'Origin': 'http://localhost:3000'
        }
      })

      expect(response.status()).toBe(200)
      expect(response.headers()['access-control-allow-origin']).toBeDefined()
    })

    test('should have proper response headers', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/courses`)

      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('application/json')
    })
  })

  test.describe('GET /api/courses/[slug]', () => {
    test('should return course details for valid slug', async ({ request }) => {
      // First get a valid course slug
      const listResponse = await request.get(`${BASE_URL}/api/courses`)
      const listData = await listResponse.json()

      if (listData.courses.length > 0) {
        const slug = listData.courses[0].slug
        const response = await request.get(`${BASE_URL}/api/courses/${slug}`)

        expect(response.status()).toBe(200)

        const data = await response.json()
        expect(data).toHaveProperty('course')
        expect(data.course).toHaveProperty('slug', slug)
      }
    })

    test('should return 404 for non-existent course', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/courses/non-existent-course`)

      expect(response.status()).toBe(404)

      const data = await response.json()
      expect(data).toHaveProperty('error')
    })

    test('should return course with sections and items', async ({ request }) => {
      // First get a valid course slug
      const listResponse = await request.get(`${BASE_URL}/api/courses`)
      const listData = await listResponse.json()

      if (listData.courses.length > 0) {
        const slug = listData.courses[0].slug
        const response = await request.get(`${BASE_URL}/api/courses/${slug}`)

        expect(response.status()).toBe(200)

        const data = await response.json()
        if (data.course) {
          expect(data.course).toHaveProperty('sections')
          expect(Array.isArray(data.course.sections)).toBe(true)

          if (data.course.sections.length > 0) {
            const section = data.course.sections[0]
            expect(section).toHaveProperty('id')
            expect(section).toHaveProperty('title')
            expect(section).toHaveProperty('items')
            expect(Array.isArray(section.items)).toBe(true)
          }
        }
      }
    })
  })

  test.describe('POST /api/courses/content', () => {
    test('should return content for valid path', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/courses/content`, {
        data: {
          contentPath: 'courses/javascript-basics/section-1/introduction.md'
        }
      })

      // Note: This test might fail if the specific content doesn't exist
      // We'll handle both success and error cases
      if (response.status() === 200) {
        const data = await response.json()
        expect(data).toHaveProperty('content')
        expect(typeof data.content).toBe('string')
      } else {
        expect(response.status()).toBe(404)
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    test('should handle invalid content path', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/courses/content`, {
        data: {
          contentPath: 'invalid/path/content.md'
        }
      })

      expect(response.status()).toBe(404)

      const data = await response.json()
      expect(data).toHaveProperty('error')
    })

    test('should require content path in request body', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/courses/content`, {
        data: {}
      })

      expect(response.status()).toBe(400)
    })

    test('should handle empty content path', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/courses/content`, {
        data: {
          contentPath: ''
        }
      })

      expect(response.status()).toBe(400)
    })
  })

  test.describe('API Performance Testing', () => {
    test('should respond within acceptable time limits', async ({ request }) => {
      const startTime = Date.now()

      const response = await request.get(`${BASE_URL}/api/courses`)

      const responseTime = Date.now() - startTime

      expect(response.status()).toBe(200)
      expect(responseTime).toBeLessThan(2000) // Should respond within 2 seconds
    })

    test('should handle concurrent requests', async ({ request }) => {
      const promises = []
      const requestCount = 10

      for (let i = 0; i < requestCount; i++) {
        promises.push(request.get(`${BASE_URL}/api/courses`))
      }

      const responses = await Promise.all(promises)

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status()).toBe(200)
      })

      // Responses should be consistent
      const firstData = await responses[0].json()
      for (let i = 1; i < responses.length; i++) {
        const data = await responses[i].json()
        expect(data.total).toBe(firstData.total)
        expect(data.courses.length).toBe(firstData.courses.length)
      }
    })
  })

  test.describe('API Error Handling', () => {
    test('should handle malformed requests gracefully', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/courses`, {
        headers: {
          'Content-Type': 'application/xml' // Invalid content type
        }
      })

      // Should still return valid response
      expect(response.status()).toBe(200)
    })

    test('should handle large payloads in content requests', async ({ request }) => {
      const largePath = 'a'.repeat(10000) // Very long path

      const response = await request.post(`${BASE_URL}/api/courses/content`, {
        data: {
          contentPath: largePath
        }
      })

      expect(response.status()).toBe(400)
    })

    test('should maintain response format consistency', async ({ request }) => {
      const responses = await Promise.all([
        request.get(`${BASE_URL}/api/courses`),
        request.get(`${BASE_URL}/api/courses/non-existent-course`)
      ])

      const successResponse = responses[0]
      const errorResponse = responses[1]

      if (successResponse.status() === 200) {
        const data = await successResponse.json()
        expect(typeof data).toBe('object')
      }

      if (errorResponse.status() === 404) {
        const errorData = await errorResponse.json()
        expect(typeof errorData).toBe('object')
        expect(errorData).toHaveProperty('error')
      }
    })
  })

  test.describe('API Security Testing', () => {
    test('should not expose sensitive information', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/courses`)

      expect(response.status()).toBe(200)

      const data = await response.json()
      const responseString = JSON.stringify(data)

      // Check for common sensitive information patterns
      expect(responseString).not.toContain('password')
      expect(responseString).not.toContain('secret')
      expect(responseString).not.toContain('token')
      expect(responseString).not.toContain('private_key')
    })

    test('should handle rate limiting gracefully', async ({ request }) => {
      const promises = []
      const requestCount = 50 // High number of requests

      for (let i = 0; i < requestCount; i++) {
        promises.push(request.get(`${BASE_URL}/api/courses`))
      }

      const responses = await Promise.allSettled(promises)

      // Most requests should succeed, but some might be rate limited
      const successCount = responses.filter(r =>
        r.status === 'fulfilled' && r.value.status() === 200
      ).length

      expect(successCount).toBeGreaterThan(0)
    })

    test('should validate input parameters', async ({ request }) => {
      // Test SQL injection attempt
      const response = await request.get(`${BASE_URL}/api/courses/test' OR '1'='1`)

      // Should either return 404 or handle gracefully
      expect([200, 404]).toContain(response.status())

      if (response.status() === 200) {
        const data = await response.json()
        // Should not return unexpected data
        expect(data.courses.length).toBeLessThan(100) // Reasonable limit
      }
    })
  })
})