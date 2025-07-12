/**
 * Unit Test: courseTransformers
 *
 * @description
 * Test untuk utility functions courseTransformers yang menangani transformasi data
 * antara database model (Course) dan display models (CourseCatalogItem, CourseDetailView).
 *
 * Test ini fokus pada:
 * - Transformasi data dengan hybrid approach (backend + mock)
 * - User context integration (enrollment, wishlist)
 * - Mock data enrichment
 * - Fallback handling
 */

import { courseTransformers, mockCourseTransformers } from './courseTransformers'
import type { Course } from '../types'

// Mock course data untuk testing
const mockCourse: Course = {
  id: '1',
  title: 'Test Course',
  description: 'Test Description',
  thumbnail: '/test-thumbnail.jpg',
  status: 'PUBLISHED',
  students: 100,
  lessons: 10,
  duration: '2 hours',
  rating: 4.5,
  category: 'Programming',
  creatorId: 'user-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockCourseWithoutMockData: Course = {
  id: '999',
  title: 'Course Without Mock Data',
  description: 'This course has no mock data',
  thumbnail: null,
  status: 'DRAFT',
  students: 0,
  lessons: 5,
  duration: '1 hour',
  rating: 0,
  category: 'Test',
  creatorId: 'user-2',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

describe('courseTransformers', () => {
  describe('toCatalogItem', () => {
    test('should transform course to catalog item with mock data enrichment', () => {
      const result = courseTransformers.toCatalogItem(mockCourse)

      expect(result.id).toBe('1')
      expect(result.title).toBe('Test Course')
      expect(result.description).toBe('Test Description')
      expect(result.creator).toBe('Master Li Wei') // From mock data
      expect(result.duration).toBe('8 weeks') // From mock data
      expect(result.price).toBe(299) // From mock data
      expect(result.enrolled).toBe(false)
      expect(result.wishlist).toBe(false)
    })

    test('should transform course without mock data with fallbacks', () => {
      const result = courseTransformers.toCatalogItem(mockCourseWithoutMockData)

      expect(result.id).toBe('999')
      expect(result.title).toBe('Course Without Mock Data')
      expect(result.creator).toBe('Creator Name') // Fallback
      expect(result.duration).toBe('2 hours') // Default fallback
      expect(result.price).toBe(0) // Default fallback
      expect(result.longDescription).toBe('This course has no mock data') // Fallback to description
      expect(result.curriculum).toEqual([]) // Empty array fallback
    })

    test('should handle user context for enrollment and wishlist', () => {
      const userContext = {
        userId: 'user-1',
        enrolledCourses: ['1'],
        wishlistCourses: ['1'],
      }

      const result = courseTransformers.toCatalogItem(mockCourse, userContext)

      expect(result.enrolled).toBe(true)
      expect(result.wishlist).toBe(true)
    })

    test('should handle null thumbnail with fallback', () => {
      const courseWithNullThumbnail = { ...mockCourse, thumbnail: null }
      const result = courseTransformers.toCatalogItem(courseWithNullThumbnail)

      expect(result.thumbnail).toBe('/images/default-course-thumbnail.svg')
    })
  })

  describe('toDetailView', () => {
    test('should transform course to detail view with mock data enrichment', () => {
      const result = courseTransformers.toDetailView(mockCourse)

      expect(result.id).toBe('1')
      expect(result.title).toBe('Test Course')
      expect(result.instructor.name).toBe('Master Li Wei') // From mock data
      expect(result.duration).toBe('8 weeks') // From mock data
      expect(result.price).toBe(299) // From mock data
      expect(result.originalPrice).toBe(358.8) // 20% markup
      expect(result.enrolled).toBe(false)
      expect(result.inWishlist).toBe(false)
    })

    test('should transform course without mock data with fallbacks', () => {
      const result = courseTransformers.toDetailView(mockCourseWithoutMockData)

      expect(result.id).toBe('999')
      expect(result.instructor.name).toBe('Instructor Name') // Fallback
      expect(result.duration).toBe('2 hours') // Default fallback
      expect(result.price).toBe(0) // Default fallback
      expect(result.originalPrice).toBe(0) // No markup if no price
    })

    test('should handle user context for enrollment and wishlist', () => {
      const userContext = {
        userId: 'user-1',
        enrolledCourses: ['1'],
        wishlistCourses: ['1'],
      }

      const result = courseTransformers.toDetailView(mockCourse, userContext)

      expect(result.enrolled).toBe(true)
      expect(result.inWishlist).toBe(true)
    })

    test('should transform curriculum from mock data', () => {
      const result = courseTransformers.toDetailView(mockCourse)

      expect(result.curriculum).toEqual([
        { title: 'Basic Dragon Stances', duration: '30 min' },
        { title: 'Flowing Movements', duration: '30 min' },
        { title: 'Combat Applications', duration: '30 min' },
        { title: 'Meditation & Philosophy', duration: '30 min' },
      ])
    })
  })

  describe('toCatalogItems', () => {
    test('should transform array of courses to catalog items', () => {
      const courses = [mockCourse, mockCourseWithoutMockData]
      const result = courseTransformers.toCatalogItems(courses)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('1')
      expect(result[1].id).toBe('999')
    })

    test('should handle empty array', () => {
      const result = courseTransformers.toCatalogItems([])

      expect(result).toEqual([])
    })
  })

  describe('toDetailViews', () => {
    test('should transform array of courses to detail views', () => {
      const courses = [mockCourse, mockCourseWithoutMockData]
      const result = courseTransformers.toDetailViews(courses)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('1')
      expect(result[1].id).toBe('999')
    })
  })

  describe('enrichWithMockData', () => {
    test('should enrich course with mock data flag', () => {
      const result = courseTransformers.enrichWithMockData(mockCourse)

      expect(result.mockEnriched).toBe(true)
      expect(result.id).toBe('1')
      expect(result.title).toBe('Test Course')
    })

    test('should mark course without mock data as not enriched', () => {
      const result = courseTransformers.enrichWithMockData(mockCourseWithoutMockData)

      expect(result.mockEnriched).toBe(false)
      expect(result.id).toBe('999')
    })
  })

  describe('hasMockData', () => {
    test('should return true for course with mock data', () => {
      const result = courseTransformers.hasMockData('1')

      expect(result).toBe(true)
    })

    test('should return false for course without mock data', () => {
      const result = courseTransformers.hasMockData('999')

      expect(result).toBe(false)
    })
  })
})

describe('mockCourseTransformers', () => {
  describe('toCatalogItem', () => {
    test('should transform course to catalog item with mock data', () => {
      const result = mockCourseTransformers.toCatalogItem(mockCourse)

      expect(result.id).toBe('1')
      expect(result.title).toBe('Test Course')
      expect(result.creator).toBe('Mock Creator')
      expect(result.price).toBe(299)
      expect(result.curriculum).toEqual(['Lesson 1', 'Lesson 2', 'Lesson 3'])
    })
  })

  describe('toDetailView', () => {
    test('should transform course to detail view with mock data', () => {
      const result = mockCourseTransformers.toDetailView(mockCourse)

      expect(result.id).toBe('1')
      expect(result.title).toBe('Test Course')
      expect(result.instructor.name).toBe('Mock Instructor')
      expect(result.price).toBe(299)
      expect(result.originalPrice).toBe(399)
      expect(result.curriculum).toHaveLength(3)
    })
  })
})
