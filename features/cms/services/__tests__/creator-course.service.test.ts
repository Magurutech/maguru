/**
 * Unit Tests for Creator Course Service
 * Requirements: 5.3-5.9, 6.1-6.5, 8.3-8.6
 */

import { createCourse, togglePublishStatus, generateSlug } from '../creator-course.service'
import { prismaMock } from '@/prisma/lib/singleton'
import { CourseStatus } from '@/prisma/generated/prisma'

const mockCreatorId = 'creator-123'

const validInput = {
  title: 'Belajar TypeScript',
  description: 'Kursus TypeScript dari dasar',
  category: 'Programming',
  difficulty: 'Pemula',
  status: 'DRAFT',
}

describe('generateSlug', () => {
  it('should convert title to lowercase slug', () => {
    expect(generateSlug('Belajar TypeScript')).toBe('belajar-typescript')
  })

  it('should replace spaces with dashes', () => {
    expect(generateSlug('hello world test')).toBe('hello-world-test')
  })

  it('should strip non-alphanumeric characters', () => {
    expect(generateSlug('Hello, World!')).toBe('hello-world')
  })

  it('should collapse multiple dashes', () => {
    expect(generateSlug('hello   world')).toBe('hello-world')
  })

  it('should truncate to 150 characters', () => {
    const longTitle = 'a'.repeat(200)
    expect(generateSlug(longTitle).length).toBeLessThanOrEqual(150)
  })
})

describe('createCourse', () => {
  const mockCourse = {
    id: 'course-1',
    slug: 'belajar-typescript',
    title: 'Belajar TypeScript',
    description: 'Kursus TypeScript dari dasar',
    category: 'Programming',
    difficulty: 'Pemula',
    status: CourseStatus.DRAFT,
    creatorId: mockCreatorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Default: slug is unique
    prismaMock.courses.findUnique.mockResolvedValue(null)
    prismaMock.courses.create.mockResolvedValue(mockCourse as never)
  })

  describe('validation', () => {
    it('should throw when title is empty', async () => {
      await expect(
        createCourse({ ...validInput, title: '' }, mockCreatorId)
      ).rejects.toThrow('Title is required')
    })

    it('should throw when title is only whitespace', async () => {
      await expect(
        createCourse({ ...validInput, title: '   ' }, mockCreatorId)
      ).rejects.toThrow('Title is required')
    })

    it('should throw when title exceeds 100 characters', async () => {
      await expect(
        createCourse({ ...validInput, title: 'a'.repeat(101) }, mockCreatorId)
      ).rejects.toThrow('Title must not exceed 100 characters')
    })

    it('should throw when description is empty', async () => {
      await expect(
        createCourse({ ...validInput, description: '' }, mockCreatorId)
      ).rejects.toThrow('Description is required')
    })

    it('should throw when category is empty', async () => {
      await expect(
        createCourse({ ...validInput, category: '' }, mockCreatorId)
      ).rejects.toThrow('Category is required')
    })

    it('should throw when difficulty is invalid', async () => {
      await expect(
        createCourse({ ...validInput, difficulty: 'Expert' }, mockCreatorId)
      ).rejects.toThrow('Difficulty must be one of: Pemula, Menengah, Mahir')
    })

    it('should accept all valid difficulties', async () => {
      for (const difficulty of ['Pemula', 'Menengah', 'Mahir']) {
        prismaMock.courses.findUnique.mockResolvedValue(null)
        prismaMock.courses.create.mockResolvedValue({ ...mockCourse, difficulty } as never)
        await expect(
          createCourse({ ...validInput, difficulty }, mockCreatorId)
        ).resolves.toBeDefined()
      }
    })

    it('should throw when status is invalid', async () => {
      await expect(
        createCourse({ ...validInput, status: 'ARCHIVED' }, mockCreatorId)
      ).rejects.toThrow('Status must be DRAFT or PUBLISHED')
    })

    it('should accept DRAFT and PUBLISHED status', async () => {
      for (const status of ['DRAFT', 'PUBLISHED']) {
        prismaMock.courses.findUnique.mockResolvedValue(null)
        prismaMock.courses.create.mockResolvedValue({ ...mockCourse, status } as never)
        await expect(
          createCourse({ ...validInput, status }, mockCreatorId)
        ).resolves.toBeDefined()
      }
    })
  })

  describe('course creation', () => {
    it('should create course with correct data', async () => {
      const result = await createCourse(validInput, mockCreatorId)

      expect(prismaMock.courses.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: validInput.title,
            description: validInput.description,
            category: validInput.category,
            difficulty: validInput.difficulty,
            status: CourseStatus.DRAFT,
            creatorId: mockCreatorId,
          }),
        })
      )
      expect(result).toEqual(mockCourse)
    })

    it('should trim whitespace from title and description', async () => {
      await createCourse(
        { ...validInput, title: '  Belajar TypeScript  ', description: '  Deskripsi  ' },
        mockCreatorId
      )

      expect(prismaMock.courses.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Belajar TypeScript',
            description: 'Deskripsi',
          }),
        })
      )
    })

    it('should generate slug from title', async () => {
      await createCourse(validInput, mockCreatorId)

      expect(prismaMock.courses.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'belajar-typescript',
          }),
        })
      )
    })
  })
})

describe('togglePublishStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should toggle DRAFT to PUBLISHED', async () => {
    const draftCourse = {
      id: 'course-1',
      title: 'Test Course',
      status: CourseStatus.DRAFT,
      creatorId: mockCreatorId,
    }
    const publishedCourse = { id: 'course-1', title: 'Test Course', status: CourseStatus.PUBLISHED }

    prismaMock.courses.findUnique.mockResolvedValue(draftCourse as never)
    prismaMock.courses.update.mockResolvedValue(publishedCourse as never)

    const result = await togglePublishStatus('course-1', mockCreatorId)

    expect(prismaMock.courses.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: CourseStatus.PUBLISHED }),
      })
    )
    expect(result.status).toBe(CourseStatus.PUBLISHED)
  })

  it('should toggle PUBLISHED to DRAFT', async () => {
    const publishedCourse = {
      id: 'course-1',
      title: 'Test Course',
      status: CourseStatus.PUBLISHED,
      creatorId: mockCreatorId,
    }
    const draftCourse = { id: 'course-1', title: 'Test Course', status: CourseStatus.DRAFT }

    prismaMock.courses.findUnique.mockResolvedValue(publishedCourse as never)
    prismaMock.courses.update.mockResolvedValue(draftCourse as never)

    const result = await togglePublishStatus('course-1', mockCreatorId)

    expect(prismaMock.courses.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: CourseStatus.DRAFT }),
      })
    )
    expect(result.status).toBe(CourseStatus.DRAFT)
  })

  it('should throw when course not found', async () => {
    prismaMock.courses.findUnique.mockResolvedValue(null)

    await expect(togglePublishStatus('nonexistent', mockCreatorId)).rejects.toThrow(
      'Course not found'
    )
  })

  it('should throw when user does not own the course', async () => {
    const course = {
      id: 'course-1',
      title: 'Test Course',
      status: CourseStatus.DRAFT,
      creatorId: 'other-creator',
    }

    prismaMock.courses.findUnique.mockResolvedValue(course as never)

    await expect(togglePublishStatus('course-1', mockCreatorId)).rejects.toThrow(
      'Forbidden: You do not own this course'
    )
  })
})
