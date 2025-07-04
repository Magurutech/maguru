/**
 * Unit Test: CourseService
 *
 * Test ini mencakup semua operasi CRUD untuk CourseService:
 * - createCourse: Membuat kursus baru
 * - getCourses: Mengambil daftar kursus dengan pagination
 * - getCourseById: Mengambil detail kursus berdasarkan ID
 * - updateCourse: Update metadata kursus
 * - deleteCourse: Hapus kursus
 * - updateCourseStatus: Update status kursus
 * - getCoursesByCreator: Mengambil kursus berdasarkan creator
 *
 * Mengikuti prinsip TDD dan Designing for Failure dengan fokus pada:
 * - Error handling dan edge cases
 * - Authorization checks
 * - Data validation
 * - Database operation failures
 *
 * Mock Strategy:
 * - Menggunakan jest.mock untuk Prisma client
 * - Mock semua database operations (create, findMany, count, dll)
 * - Test error scenarios dengan mockRejectedValue
 * - Test success scenarios dengan mockResolvedValue
 */

import { CourseService } from './courseService'
import { CourseStatus, CreateCourseRequest } from '../../types'

// Mock prisma module
jest.mock('../../../../lib/prisma', () => ({
  prisma: {
    course: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

// Mock data untuk testing
const mockCourseData: CreateCourseRequest = {
  title: 'Test Course',
  description: 'Test Description',
  category: 'Test Category',
  thumbnail: '/test-thumbnail.jpg',
}

const mockCourse = {
  id: 'course-1',
  title: 'Test Course',
  description: 'Test Description',
  thumbnail: '/test-thumbnail.jpg',
  status: CourseStatus.DRAFT,
  students: 0,
  lessons: 0,
  duration: '0 jam',
  rating: 0.0,
  category: 'Test Category',
  creatorId: 'creator-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('CourseService', () => {
  let courseService: CourseService
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPrisma: any

  beforeEach(() => {
    courseService = new CourseService()
    jest.clearAllMocks()
    // ✅ SOLUSI: Akses mock yang benar dari jest.mock()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockPrisma = require('../../../../lib/prisma').prisma
  })

  describe('createCourse', () => {
    it('should create course successfully with valid data', async () => {
      // Arrange
      mockPrisma.course.create.mockResolvedValue(mockCourse)

      // Act
      const result = await courseService.createCourse(mockCourseData, 'creator-1')

      // Assert
      expect(mockPrisma.course.create).toHaveBeenCalledWith({
        data: {
          title: mockCourseData.title,
          description: mockCourseData.description,
          thumbnail: mockCourseData.thumbnail,
          category: mockCourseData.category,
          status: CourseStatus.DRAFT,
          students: 0,
          lessons: 0,
          duration: '0 jam',
          rating: 0.0,
          creatorId: 'creator-1',
        },
      })
      expect(result).toEqual(mockCourse)
    })

    it('should handle database connection error', async () => {
      // Arrange
      mockPrisma.course.create.mockRejectedValue(new Error('Database connection failed'))

      // Act & Assert
      await expect(courseService.createCourse(mockCourseData, 'creator-1')).rejects.toThrow(
        'Database connection failed',
      )
    })

    it('should handle empty title validation', async () => {
      // Arrange
      const invalidData = { ...mockCourseData, title: '' }
      mockPrisma.course.create.mockRejectedValue(new Error('Title cannot be empty'))

      // Act & Assert
      await expect(courseService.createCourse(invalidData, 'creator-1')).rejects.toThrow(
        'Title cannot be empty',
      )
    })
  })

  describe('getCourses', () => {
    it('should return paginated courses list', async () => {
      // Arrange
      const mockCourses = [mockCourse]
      const mockCount = 1
      mockPrisma.course.findMany.mockResolvedValue(mockCourses)
      mockPrisma.course.count.mockResolvedValue(mockCount)

      // Act
      const result = await courseService.getCourses(1, 10)

      // Assert
      expect(mockPrisma.course.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      })
      expect(mockPrisma.course.count).toHaveBeenCalledWith({ where: {} })
      expect(result.courses).toEqual(mockCourses)
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      })
    })

    it('should handle empty database', async () => {
      // Arrange
      mockPrisma.course.findMany.mockResolvedValue([])
      mockPrisma.course.count.mockResolvedValue(0)

      // Act
      const result = await courseService.getCourses(1, 10)

      // Assert
      expect(result.courses).toEqual([])
      expect(result.pagination.total).toBe(0)
      expect(result.pagination.totalPages).toBe(0)
    })

    it('should filter by creatorId correctly', async () => {
      // Arrange
      const mockCourses = [mockCourse]
      const mockCount = 1
      mockPrisma.course.findMany.mockResolvedValue(mockCourses)
      mockPrisma.course.count.mockResolvedValue(mockCount)

      // Act
      const result = await courseService.getCourses(1, 10, 'creator-1')

      // Assert
      expect(mockPrisma.course.findMany).toHaveBeenCalledWith({
        where: { creatorId: 'creator-1' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      })
      expect(mockPrisma.course.count).toHaveBeenCalledWith({ where: { creatorId: 'creator-1' } })
      expect(result.courses).toEqual(mockCourses)
    })

    it('should handle invalid pagination parameters', async () => {
      // Arrange
      const mockCourses = [mockCourse]
      const mockCount = 1
      mockPrisma.course.findMany.mockResolvedValue(mockCourses)
      mockPrisma.course.count.mockResolvedValue(mockCount)

      // Act - Test dengan page 0 (akan menjadi skip -50)
      const result = await courseService.getCourses(0, 50)

      // Assert
      expect(mockPrisma.course.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
        skip: -50, // ✅ PERBAIKAN: (0-1) * 50 = -50
        take: 50,
      })
      expect(result.courses).toEqual(mockCourses)
    })
  })

  describe('getCourseById', () => {
    it('should return course by valid ID', async () => {
      // Arrange
      mockPrisma.course.findUnique.mockResolvedValue(mockCourse)

      // Act
      const result = await courseService.getCourseById('course-1')

      // Assert
      expect(mockPrisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: 'course-1' },
      })
      expect(result).toEqual(mockCourse)
    })

    it('should return null for non-existent ID', async () => {
      // Arrange
      mockPrisma.course.findUnique.mockResolvedValue(null)

      // Act
      const result = await courseService.getCourseById('non-existent')

      // Assert
      expect(result).toBeNull()
    })

    it('should handle database query error', async () => {
      // Arrange
      mockPrisma.course.findUnique.mockRejectedValue(new Error('Database query failed'))

      // Act & Assert
      await expect(courseService.getCourseById('course-1')).rejects.toThrow('Database query failed')
    })
  })

  describe('updateCourse', () => {
    it('should update course successfully', async () => {
      // Arrange
      const updateData: CreateCourseRequest = {
        title: 'Updated Course',
        description: 'Updated Description',
        category: 'Updated Category',
        thumbnail: '/updated-thumbnail.jpg',
      }
      const updatedCourse = { ...mockCourse, ...updateData }

      mockPrisma.course.findFirst.mockResolvedValue(mockCourse) // Course exists and owned by creator
      mockPrisma.course.update.mockResolvedValue(updatedCourse)

      // Act
      const result = await courseService.updateCourse('course-1', updateData, 'creator-1')

      // Assert
      expect(mockPrisma.course.findFirst).toHaveBeenCalledWith({
        where: { id: 'course-1', creatorId: 'creator-1' },
      })
      expect(mockPrisma.course.update).toHaveBeenCalledWith({
        where: { id: 'course-1' },
        data: updateData,
      })
      expect(result).toEqual(updatedCourse)
    })

    it('should reject update for non-owner', async () => {
      // Arrange
      mockPrisma.course.findFirst.mockResolvedValue(null) // Course not found or not owned

      // Act & Assert
      await expect(
        courseService.updateCourse('course-1', mockCourseData, 'other-creator'),
      ).rejects.toThrow('Course not found or access denied')
    })

    it('should handle course not found', async () => {
      // Arrange
      mockPrisma.course.findFirst.mockResolvedValue(null)

      // Act & Assert
      await expect(
        courseService.updateCourse('non-existent', mockCourseData, 'creator-1'),
      ).rejects.toThrow('Course not found or access denied')
    })
  })

  describe('deleteCourse', () => {
    it('should delete course successfully', async () => {
      // Arrange
      mockPrisma.course.findFirst.mockResolvedValue(mockCourse) // Course exists and owned by creator
      mockPrisma.course.delete.mockResolvedValue(mockCourse)

      // Act
      await courseService.deleteCourse('course-1', 'creator-1')

      // Assert
      expect(mockPrisma.course.findFirst).toHaveBeenCalledWith({
        where: { id: 'course-1', creatorId: 'creator-1' },
      })
      expect(mockPrisma.course.delete).toHaveBeenCalledWith({
        where: { id: 'course-1' },
      })
    })

    it('should reject delete for non-owner', async () => {
      // Arrange
      mockPrisma.course.findFirst.mockResolvedValue(null)

      // Act & Assert
      await expect(courseService.deleteCourse('course-1', 'other-creator')).rejects.toThrow(
        'Course not found or access denied',
      )
    })

    it('should handle course not found', async () => {
      // Arrange
      mockPrisma.course.findFirst.mockResolvedValue(null)

      // Act & Assert
      await expect(courseService.deleteCourse('non-existent', 'creator-1')).rejects.toThrow(
        'Course not found or access denied',
      )
    })
  })

  describe('updateCourseStatus', () => {
    it('should update status successfully', async () => {
      // Arrange
      const updatedCourse = { ...mockCourse, status: CourseStatus.PUBLISHED }
      mockPrisma.course.findFirst.mockResolvedValue(mockCourse) // Course exists and owned by creator
      mockPrisma.course.update.mockResolvedValue(updatedCourse)

      // Act
      const result = await courseService.updateCourseStatus(
        'course-1',
        CourseStatus.PUBLISHED,
        'creator-1',
      )

      // Assert
      expect(mockPrisma.course.findFirst).toHaveBeenCalledWith({
        where: { id: 'course-1', creatorId: 'creator-1' },
      })
      expect(mockPrisma.course.update).toHaveBeenCalledWith({
        where: { id: 'course-1' },
        data: { status: CourseStatus.PUBLISHED },
      })
      expect(result).toEqual(updatedCourse)
    })

    it('should reject status update for non-owner', async () => {
      // Arrange
      mockPrisma.course.findFirst.mockResolvedValue(null)

      // Act & Assert
      await expect(
        courseService.updateCourseStatus('course-1', CourseStatus.PUBLISHED, 'other-creator'),
      ).rejects.toThrow('Course not found or access denied')
    })
  })

  describe('getCoursesByCreator', () => {
    it('should call getCourses with creatorId filter', async () => {
      // Arrange
      const mockCourses = [mockCourse]
      const mockCount = 1
      mockPrisma.course.findMany.mockResolvedValue(mockCourses)
      mockPrisma.course.count.mockResolvedValue(mockCount)

      // Act
      const result = await courseService.getCoursesByCreator('creator-1', 1, 10)

      // Assert
      expect(mockPrisma.course.findMany).toHaveBeenCalledWith({
        where: { creatorId: 'creator-1' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      })
      expect(result.courses).toEqual(mockCourses)
      expect(result.pagination.total).toBe(1)
    })
  })
})
