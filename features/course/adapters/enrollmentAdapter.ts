/**
 * EnrollmentAdapter - Data Access Layer
 *
 * @description
 * Adapter untuk komunikasi dengan backend API enrollment.
 * Mengimplementasikan designing for failure patterns:
 * - Retry logic dengan exponential backoff
 * - Timeout handling
 * - Error transformation
 * - Request/response formatting
 *
 * Mengikuti arsitektur Maguru untuk adapters dengan:
 * - Direct API communication
 * - Error handling dan transformation
 * - Request/response formatting
 * - Designing for failure principles
 */

import type {
  EnrollmentRequest,
  EnrollmentResponse,
  EnrollmentStatusResponse,
  EnrollmentListResponse,
} from '../types'

// Base API configuration
const API_BASE_URL = '/api'
const DEFAULT_TIMEOUT = 30000 // 30 seconds

// Utility function untuk timeout handling
const createTimeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeout)
  })
}

// Utility function untuk retry logic
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt === maxRetries || maxRetries === 0) {
        throw lastError
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

// Utility function untuk API request dengan error handling
const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT,
): Promise<T> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await Promise.race([
      fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }),
      createTimeoutPromise(timeout),
    ])

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      )
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }

    throw new Error('Unknown error occurred')
  }
}

// Tambahkan type untuk test injection
type AdapterTestOptions = { maxRetries?: number; timeout?: number }

export const enrollmentAdapter = {
  /**
   * Enroll user ke kursus
   */
  async enrollCourse(
    request: EnrollmentRequest,
    testOptions?: AdapterTestOptions,
  ): Promise<EnrollmentResponse> {
    return retryWithBackoff(async () => {
      return apiRequest<EnrollmentResponse>(
        `${API_BASE_URL}/enrollments`,
        {
          method: 'POST',
          body: JSON.stringify(request),
        },
        testOptions?.timeout ?? DEFAULT_TIMEOUT,
      )
    }, testOptions?.maxRetries ?? 3)
  },

  /**
   * Unenroll user dari kursus
   */
  async unenrollCourse(
    courseId: string,
    testOptions?: AdapterTestOptions,
  ): Promise<EnrollmentResponse> {
    return retryWithBackoff(async () => {
      return apiRequest<EnrollmentResponse>(
        `${API_BASE_URL}/enrollments/${courseId}`,
        {
          method: 'DELETE',
        },
        testOptions?.timeout ?? DEFAULT_TIMEOUT,
      )
    }, testOptions?.maxRetries ?? 3)
  },

  /**
   * Cek status enrollment user untuk kursus tertentu
   */
  async getEnrollmentStatus(
    courseId: string,
    testOptions?: AdapterTestOptions,
  ): Promise<EnrollmentStatusResponse> {
    return retryWithBackoff(async () => {
      return apiRequest<EnrollmentStatusResponse>(
        `${API_BASE_URL}/courses/${courseId}/enrollment-status`,
        {},
        testOptions?.timeout ?? DEFAULT_TIMEOUT,
      )
    }, testOptions?.maxRetries ?? 3)
  },

  /**
   * Dapatkan daftar enrollment user
   */
  async getEnrollments(
    params: { page?: number; limit?: number } = {},
    testOptions?: AdapterTestOptions,
  ): Promise<EnrollmentListResponse> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())

    const queryString = searchParams.toString()
    const url = queryString
      ? `${API_BASE_URL}/enrollments?${queryString}`
      : `${API_BASE_URL}/enrollments`

    return retryWithBackoff(async () => {
      return apiRequest<EnrollmentListResponse>(url, {}, testOptions?.timeout ?? DEFAULT_TIMEOUT)
    }, testOptions?.maxRetries ?? 3)
  },

  /**
   * Batch check enrollment status untuk multiple courses
   */
  async batchCheckEnrollmentStatus(
    courseIds: string[],
    testOptions?: AdapterTestOptions,
  ): Promise<Record<string, boolean>> {
    if (courseIds.length === 0) return {}

    const promises = courseIds.map(async (courseId) => {
      try {
        const response = await this.getEnrollmentStatus(courseId, testOptions)
        return { courseId, isEnrolled: response.isEnrolled }
      } catch (error) {
        console.error(`Failed to check enrollment status for course ${courseId}:`, error)
        return { courseId, isEnrolled: false }
      }
    })

    const results = await Promise.all(promises)
    return results.reduce(
      (acc, { courseId, isEnrolled }) => {
        acc[courseId] = isEnrolled
        return acc
      },
      {} as Record<string, boolean>,
    )
  },
}
