/**
 * Section Service Unit Tests
 * Tests for Section CRUD operations using Prisma mock
 * Based on: https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing
 * 
 * Requirements: 1.1-1.8, 9.1, 9.5, 9.8, 12.5, 12.6
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { sectionService } from '../section.service'
import { prismaMock } from '@/prisma/lib/singleton'
import type { Course, Section } from '@/prisma/generated/prisma/client'

describe('SectionService', () => {
  const mockCourseId = 'test-course-id'
  const mockSectionId = 'test-section-id'

  beforeEach(() => {
    // Mocks are automatically reset by the singleton setup
  })

  describe('createSection', () => {
    it('should create a section with valid data', async () => {
      // Requirement: 1.1
      const mockCourse: Pick<Course, 'id'> = { id: mockCourseId }
      const mockSection: Section = {
        id: mockSectionId,
        courseId: mockCourseId,
        title: 'Introduction',
        description: 'Getting started',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaMock.course.findUnique.mockResolvedValue(mockCourse)
      prismaMock.section.findUnique.mockResolvedValue(null)
      prismaMock.section.create.mockResolvedValue(mockSection)

      const result = await sectionService.createSection(mockCourseId, {
        title: 'Introduction',
        description: 'Getting started',
        order: 1,
      })

      expect(result).toEqual(mockSection)
      expect(prismaMock.course.findUnique).toHaveBeenCalledWith({
        where: { id: mockCourseId },
      })
    })

    it('should reject empty title', async () => {
      // Requirement: 9.1
      await expect(
        sectionService.createSection(mockCourseId, {
          title: '',
          order: 1,
        })
      ).rejects.toThrow('Section title is required')
    })

    it('should reject title exceeding 200 characters', async () => {
      // Requirement: 9.1
      await expect(
        sectionService.createSection(mockCourseId, {
          title: 'a'.repeat(201),
          order: 1,
        })
      ).rejects.toThrow('Section title must not exceed 200 characters')
    })

    it('should reject non-positive order', async () => {
      // Requirement: 9.8
      await expect(
        sectionService.createSection(mockCourseId, {
          title: 'Test Section',
          order: 0,
        })
      ).rejects.toThrow('Section order must be a positive integer')
    })

    it('should reject if course does not exist', async () => {
      // Requirement: 9.5
      prismaMock.course.findUnique.mockResolvedValue(null)

      await expect(
        sectionService.createSection(mockCourseId, {
          title: 'Test Section',
          order: 1,
        })
      ).rejects.toThrow('Course not found')
    })

    it('should reject duplicate order within same course', async () => {
      // Requirement: 9.8
      const mockCourse: Pick<Course, 'id'> = { id: mockCourseId }
      const existingSection: Pick<Section, 'id' | 'order'> = { 
        id: 'existing-id', 
        order: 1 
      }

      prismaMock.course.findUnique.mockResolvedValue(mockCourse)
      prismaMock.section.findUnique.mockResolvedValue(existingSection)

      await expect(
        sectionService.createSection(mockCourseId, {
          title: 'Test Section',
          order: 1,
        })
      ).rejects.toThrow('Section with order 1 already exists in this course')
    })
  })

  describe('getSectionsByCourse', () => {
    it('should return sections ordered by order field', async () => {
      // Requirement: 1.2
      type SectionWithCount = Section & { _count: { lessons: number } }
      
      const mockSections: SectionWithCount[] = [
        {
          id: '1',
          courseId: mockCourseId,
          title: 'Section 1',
          description: null,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { lessons: 0 },
        },
        {
          id: '2',
          courseId: mockCourseId,
          title: 'Section 2',
          description: null,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { lessons: 3 },
        },
      ]

      prismaMock.section.findMany.mockResolvedValue(mockSections)

      const result = await sectionService.getSectionsByCourse(mockCourseId)

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Section 1')
      expect(result[0].lessonCount).toBe(0)
      expect(result[1].title).toBe('Section 2')
      expect(result[1].lessonCount).toBe(3)
    })

    it('should return empty array for course with no sections', async () => {
      prismaMock.section.findMany.mockResolvedValue([])

      const result = await sectionService.getSectionsByCourse(mockCourseId)

      expect(result).toEqual([])
    })
  })

  describe('updateSection', () => {
    it('should update section title', async () => {
      // Requirement: 1.3
      const existingSection: Section = {
        id: mockSectionId,
        courseId: mockCourseId,
        title: 'Original Title',
        description: null,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedSection: Section = {
        ...existingSection,
        title: 'Updated Title',
      }

      prismaMock.section.findUnique.mockResolvedValue(existingSection)
      prismaMock.section.update.mockResolvedValue(updatedSection)

      const result = await sectionService.updateSection(mockSectionId, {
        title: 'Updated Title',
      })

      expect(result.title).toBe('Updated Title')
    })

    it('should reject if section does not exist', async () => {
      prismaMock.section.findUnique.mockResolvedValue(null)

      await expect(
        sectionService.updateSection(mockSectionId, { title: 'Test' })
      ).rejects.toThrow('Section not found')
    })

    it('should reject duplicate order when updating', async () => {
      // Requirement: 9.8
      const existingSection: Pick<Section, 'id' | 'courseId' | 'order'> = {
        id: mockSectionId,
        courseId: mockCourseId,
        order: 2,
      }

      const duplicateSection: Pick<Section, 'id' | 'courseId' | 'order'> = {
        id: 'other-id',
        courseId: mockCourseId,
        order: 1,
      }

      prismaMock.section.findUnique
        .mockResolvedValueOnce(existingSection)
        .mockResolvedValueOnce(duplicateSection)

      await expect(
        sectionService.updateSection(mockSectionId, { order: 1 })
      ).rejects.toThrow('Section with order 1 already exists in this course')
    })
  })

  describe('deleteSection', () => {
    it('should delete section and return deleted lesson count', async () => {
      // Requirement: 1.4, 12.6
      type SectionWithCount = Pick<Section, 'id' | 'courseId'> & { 
        _count: { lessons: number } 
      }
      
      const existingSection: SectionWithCount = {
        id: mockSectionId,
        courseId: mockCourseId,
        _count: { lessons: 5 },
      }

      prismaMock.section.findUnique.mockResolvedValue(existingSection)
      prismaMock.section.delete.mockResolvedValue(existingSection)

      const result = await sectionService.deleteSection(mockSectionId)

      expect(result.message).toBe('Section deleted successfully')
      expect(result.deletedLessons).toBe(5)
      expect(prismaMock.section.delete).toHaveBeenCalledWith({
        where: { id: mockSectionId },
      })
    })

    it('should reject if section does not exist', async () => {
      prismaMock.section.findUnique.mockResolvedValue(null)

      await expect(
        sectionService.deleteSection(mockSectionId)
      ).rejects.toThrow('Section not found')
    })
  })
})
