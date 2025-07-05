/**
 * Unit Test: courseUtils
 *
 * Test ini mencakup semua utility functions untuk course:
 * - getStatusColor: Mendapatkan warna status untuk UI
 * - getStatusText: Mendapatkan teks status dalam bahasa Indonesia
 * - filterCourses: Filter courses berdasarkan search dan status
 * - filterCoursesByStatus: Filter courses berdasarkan status saja
 * - formatDuration: Format durasi dari menit ke format readable
 * - formatRating: Format rating dengan 1 decimal place
 * - formatNumber: Format number dengan separator ribuan
 * - getThumbnailUrl: Generate thumbnail URL untuk Supabase Storage
 * - validateCourseData: Validate course data sebelum submit
 *
 * Mengikuti prinsip TDD dan Designing for Failure dengan fokus pada:
 * - Edge cases dan invalid input
 * - Fallback values
 * - Data transformation accuracy
 * - Validation logic
 *
 * Test Strategy:
 * - Test semua status values (DRAFT, PUBLISHED, invalid)
 * - Test edge cases (empty strings, null values, extreme numbers)
 * - Test environment variable handling
 * - Test validation error messages
 */

import {
  getStatusColor,
  getStatusText,
  filterCourses,
  filterCoursesByStatus,
  formatDuration,
  formatRating,
  formatNumber,
  getThumbnailUrl,
  validateCourseData,
} from './courseUtils'
import { CourseStatus } from '../types'
import type { Course, CreateCourseRequest } from '../types'

describe('courseUtils', () => {
  describe('getStatusColor', () => {
    it('should return correct CSS classes for DRAFT status', () => {
      // Act
      const result = getStatusColor(CourseStatus.DRAFT)
      const resultString = getStatusColor('draft')

      // Assert
      expect(result).toBe('bg-yellow-100 text-yellow-800 border-yellow-200')
      expect(resultString).toBe('bg-yellow-100 text-yellow-800 border-yellow-200')
    })

    it('should return correct CSS classes for PUBLISHED status', () => {
      // Act
      const result = getStatusColor(CourseStatus.PUBLISHED)
      const resultString = getStatusColor('published')

      // Assert
      expect(result).toBe('bg-green-100 text-green-800 border-green-200')
      expect(resultString).toBe('bg-green-100 text-green-800 border-green-200')
    })

    it('should return default color for invalid status', () => {
      // Act
      const result = getStatusColor('invalid-status')

      // Assert
      expect(result).toBe('bg-gray-100 text-gray-800 border-gray-200')
    })
  })

  describe('getStatusText', () => {
    it('should return Indonesian text for DRAFT status', () => {
      // Act
      const result = getStatusText(CourseStatus.DRAFT)
      const resultString = getStatusText('draft')

      // Assert
      expect(result).toBe('Draft')
      expect(resultString).toBe('Draft')
    })

    it('should return Indonesian text for PUBLISHED status', () => {
      // Act
      const result = getStatusText(CourseStatus.PUBLISHED)
      const resultString = getStatusText('published')

      // Assert
      expect(result).toBe('Dipublikasi')
      expect(resultString).toBe('Dipublikasi')
    })

    it('should return default text for invalid status', () => {
      // Act
      const result = getStatusText('invalid-status')

      // Assert
      expect(result).toBe('Tidak Diketahui')
    })
  })

  describe('filterCourses', () => {
    const mockCourses: Course[] = [
      {
        id: 'course-1',
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript basics',
        thumbnail: '/js-thumbnail.jpg',
        category: 'Programming',
        status: CourseStatus.PUBLISHED,
        students: 100,
        lessons: 10,
        duration: '2 jam',
        rating: 4.5,
        creatorId: 'creator-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'course-2',
        title: 'React Development',
        description: 'Build React applications',
        thumbnail: '/react-thumbnail.jpg',
        category: 'Programming',
        status: CourseStatus.DRAFT,
        students: 50,
        lessons: 8,
        duration: '3 jam',
        rating: 4.8,
        creatorId: 'creator-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    it('should filter by title search', () => {
      // Act
      const result = filterCourses(mockCourses, 'JavaScript')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('JavaScript Fundamentals')
    })

    it('should filter by description search', () => {
      // Act
      const result = filterCourses(mockCourses, 'React')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('React Development')
    })

    it('should filter by status', () => {
      // Act
      const result = filterCourses(mockCourses, '', CourseStatus.PUBLISHED)

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe(CourseStatus.PUBLISHED)
    })

    it('should filter by combined search and status', () => {
      // Act
      const result = filterCourses(mockCourses, 'JavaScript', CourseStatus.PUBLISHED)

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('JavaScript Fundamentals')
      expect(result[0].status).toBe(CourseStatus.PUBLISHED)
    })

    it('should return all courses for empty search query', () => {
      // Act
      const result = filterCourses(mockCourses, '')

      // Assert
      expect(result).toHaveLength(2)
    })

    it('should handle case-insensitive search', () => {
      // Act
      const result = filterCourses(mockCourses, 'javascript')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('JavaScript Fundamentals')
    })
  })

  describe('filterCoursesByStatus', () => {
    const mockCourses: Course[] = [
      {
        id: 'course-1',
        title: 'Course 1',
        description: 'Description 1',
        thumbnail: '/thumb1.jpg',
        category: 'Category 1',
        status: CourseStatus.PUBLISHED,
        students: 100,
        lessons: 10,
        duration: '2 jam',
        rating: 4.5,
        creatorId: 'creator-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'course-2',
        title: 'Course 2',
        description: 'Description 2',
        thumbnail: '/thumb2.jpg',
        category: 'Category 2',
        status: CourseStatus.DRAFT,
        students: 50,
        lessons: 8,
        duration: '3 jam',
        rating: 4.8,
        creatorId: 'creator-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    it('should filter by DRAFT status', () => {
      // Act
      const result = filterCoursesByStatus(mockCourses, CourseStatus.DRAFT)

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe(CourseStatus.DRAFT)
    })

    it('should filter by PUBLISHED status', () => {
      // Act
      const result = filterCoursesByStatus(mockCourses, CourseStatus.PUBLISHED)

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe(CourseStatus.PUBLISHED)
    })

    it('should return all courses without status filter', () => {
      // Act
      const result = filterCoursesByStatus(mockCourses)

      // Assert
      expect(result).toHaveLength(2)
    })
  })

  describe('formatDuration', () => {
    it('should format 60 minutes to "1 jam"', () => {
      // Act
      const result = formatDuration(60)

      // Assert
      expect(result).toBe('1 jam')
    })

    it('should format 90 minutes to "1 jam 30 menit"', () => {
      // Act
      const result = formatDuration(90)

      // Assert
      expect(result).toBe('1 jam 30 menit')
    })

    it('should format 30 minutes to "30 menit"', () => {
      // Act
      const result = formatDuration(30)

      // Assert
      expect(result).toBe('30 menit')
    })

    it('should format 0 minutes to "0 menit"', () => {
      // Act
      const result = formatDuration(0)

      // Assert
      expect(result).toBe('0 menit')
    })
  })

  describe('formatRating', () => {
    it('should format 4.8 to "4.8"', () => {
      // Act
      const result = formatRating(4.8)

      // Assert
      expect(result).toBe('4.8')
    })

    it('should format 5.0 to "5.0"', () => {
      // Act
      const result = formatRating(5.0)

      // Assert
      expect(result).toBe('5.0')
    })

    it('should format 0.0 to "0.0"', () => {
      // Act
      const result = formatRating(0.0)

      // Assert
      expect(result).toBe('0.0')
    })
  })

  describe('formatNumber', () => {
    it('should format 1000 to "1.000"', () => {
      // Act
      const result = formatNumber(1000)

      // Assert
      expect(result).toBe('1.000')
    })

    it('should format 10000 to "10.000"', () => {
      // Act
      const result = formatNumber(10000)

      // Assert
      expect(result).toBe('10.000')
    })

    it('should format 100000 to "100.000"', () => {
      // Act
      const result = formatNumber(100000)

      // Assert
      expect(result).toBe('100.000')
    })

    it('should format 0 to "0"', () => {
      // Act
      const result = formatNumber(0)

      // Assert
      expect(result).toBe('0')
    })
  })

  describe('getThumbnailUrl', () => {
    const originalEnv = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...originalEnv }
    })

    afterAll(() => {
      process.env = originalEnv
    })

    it('should return full URL for valid path', () => {
      // Arrange
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'

      // Act
      const result = getThumbnailUrl('test-image.jpg')

      // Assert
      expect(result).toBe(
        'https://test.supabase.co/storage/v1/object/public/course-thumbnails/test-image.jpg',
      )
    })

    it('should return default image for empty path', () => {
      // Act
      const result = getThumbnailUrl('')

      // Assert
      expect(result).toBe('/globe.svg')
    })

    it('should return default image for null/undefined path', () => {
      // Act
      const result = getThumbnailUrl(null as unknown as string)

      // Assert
      expect(result).toBe('/globe.svg')
    })

    it('should return path as is for full URL', () => {
      // Act
      const result = getThumbnailUrl('https://example.com/image.jpg')

      // Assert
      expect(result).toBe('https://example.com/image.jpg')
    })

    it('should use fallback URL when env variable is not set', () => {
      // Arrange
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      // Act
      const result = getThumbnailUrl('test-image.jpg')

      // Assert
      expect(result).toBe(
        'https://your-project.supabase.co/storage/v1/object/public/course-thumbnails/test-image.jpg',
      )
    })
  })

  describe('validateCourseData', () => {
    it('should validate correct course data', () => {
      // Arrange
      const validData: Partial<CreateCourseRequest> = {
        title: 'Valid Course',
        description: 'Valid Description',
        category: 'Valid Category',
      }

      // Act
      const result = validateCourseData(validData)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject empty title', () => {
      // Arrange
      const invalidData: Partial<CreateCourseRequest> = {
        title: '',
        description: 'Valid Description',
        category: 'Valid Category',
      }

      // Act
      const result = validateCourseData(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Judul kursus harus diisi')
    })

    it('should reject empty description', () => {
      // Arrange
      const invalidData: Partial<CreateCourseRequest> = {
        title: 'Valid Title',
        description: '',
        category: 'Valid Category',
      }

      // Act
      const result = validateCourseData(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Deskripsi kursus harus diisi')
    })

    it('should reject empty category', () => {
      // Arrange
      const invalidData: Partial<CreateCourseRequest> = {
        title: 'Valid Title',
        description: 'Valid Description',
        category: '',
      }

      // Act
      const result = validateCourseData(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Kategori harus diisi')
    })

    it('should handle multiple errors', () => {
      // Arrange
      const invalidData: Partial<CreateCourseRequest> = {
        title: '',
        description: '',
        category: '',
      }

      // Act
      const result = validateCourseData(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(3)
      expect(result.errors).toContain('Judul kursus harus diisi')
      expect(result.errors).toContain('Deskripsi kursus harus diisi')
      expect(result.errors).toContain('Kategori harus diisi')
    })

    it('should handle whitespace-only values', () => {
      // Arrange
      const invalidData: Partial<CreateCourseRequest> = {
        title: '   ',
        description: '   ',
        category: '   ',
      }

      // Act
      const result = validateCourseData(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(3)
    })
  })
})
