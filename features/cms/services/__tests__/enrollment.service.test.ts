/**
 * Unit Tests for Enrollment Service
 * Requirements: 3.1, 3.2, 3.6, 7.7, 7.8
 */

import { getMyEnrollments } from '../enrollment.service'
import { prismaMock } from '@/prisma/lib/singleton'

const mockUserId = 'user-123'

const makeCourse = (lessonIds: string[]) => ({
  id: 'course-1',
  title: 'Test Course',
  description: 'Desc',
  category: 'Programming',
  difficulty: 'Pemula',
  status: 'PUBLISHED',
  thumbnail: null,
  sections: [
    {
      lessons: lessonIds.map((id) => ({ id })),
    },
  ],
})

const makeEnrollment = (course: ReturnType<typeof makeCourse>, overrides = {}) => ({
  id: 'enrollment-1',
  enrolledAt: new Date('2026-01-01'),
  completed: false,
  completedAt: null,
  courses: course,
  ...overrides,
})

describe('getMyEnrollments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return enrollments with progress percentage', async () => {
    const lessonIds = ['l1', 'l2', 'l3', 'l4']
    const course = makeCourse(lessonIds)
    const enrollment = makeEnrollment(course)

    prismaMock.enrollments.findMany.mockResolvedValue([enrollment] as never)
    // 2 of 4 lessons completed
    prismaMock.lesson_progress.findMany.mockResolvedValue([
      { lessonId: 'l1' },
      { lessonId: 'l2' },
    ] as never)

    const result = await getMyEnrollments(mockUserId)

    expect(result.enrollments).toHaveLength(1)
    expect(result.enrollments[0].progress).toBe(50)
    expect(result.enrollments[0].completed).toBe(false)
  })

  it('should return 0% progress when no lessons completed', async () => {
    const course = makeCourse(['l1', 'l2'])
    const enrollment = makeEnrollment(course)

    prismaMock.enrollments.findMany.mockResolvedValue([enrollment] as never)
    prismaMock.lesson_progress.findMany.mockResolvedValue([] as never)

    const result = await getMyEnrollments(mockUserId)

    expect(result.enrollments[0].progress).toBe(0)
  })

  it('should return 100% progress when all lessons completed', async () => {
    const lessonIds = ['l1', 'l2']
    const course = makeCourse(lessonIds)
    const enrollment = makeEnrollment(course)

    prismaMock.enrollments.findMany.mockResolvedValue([enrollment] as never)
    prismaMock.lesson_progress.findMany.mockResolvedValue([
      { lessonId: 'l1' },
      { lessonId: 'l2' },
    ] as never)

    const result = await getMyEnrollments(mockUserId)

    expect(result.enrollments[0].progress).toBe(100)
  })

  it('should return 0% for course with no lessons (Req 7.7)', async () => {
    const course = makeCourse([]) // no lessons
    const enrollment = makeEnrollment(course)

    prismaMock.enrollments.findMany.mockResolvedValue([enrollment] as never)
    prismaMock.lesson_progress.findMany.mockResolvedValue([] as never)

    const result = await getMyEnrollments(mockUserId)

    expect(result.enrollments[0].progress).toBe(0)
  })

  it('should return empty enrollments when user has none', async () => {
    prismaMock.enrollments.findMany.mockResolvedValue([] as never)
    prismaMock.lesson_progress.findMany.mockResolvedValue([] as never)

    const result = await getMyEnrollments(mockUserId)

    expect(result.enrollments).toHaveLength(0)
  })

  it('should include correct course data in response', async () => {
    const course = makeCourse(['l1'])
    const enrollment = makeEnrollment(course)

    prismaMock.enrollments.findMany.mockResolvedValue([enrollment] as never)
    prismaMock.lesson_progress.findMany.mockResolvedValue([] as never)

    const result = await getMyEnrollments(mockUserId)

    expect(result.enrollments[0].course).toEqual({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      status: course.status,
      thumbnail: course.thumbnail,
    })
  })

  it('should batch fetch lesson progress for all enrollments', async () => {
    const course1 = { ...makeCourse(['l1', 'l2']), id: 'course-1' }
    const course2 = { ...makeCourse(['l3', 'l4']), id: 'course-2' }

    prismaMock.enrollments.findMany.mockResolvedValue([
      makeEnrollment(course1, { id: 'e1' }),
      { ...makeEnrollment(course2, { id: 'e2' }), courses: course2 },
    ] as never)
    prismaMock.lesson_progress.findMany.mockResolvedValue([{ lessonId: 'l1' }] as never)

    await getMyEnrollments(mockUserId)

    // Should call findMany once with all lesson IDs
    expect(prismaMock.lesson_progress.findMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.lesson_progress.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          lessonId: { in: expect.arrayContaining(['l1', 'l2', 'l3', 'l4']) },
        }),
      })
    )
  })
})
