import { Course, CourseStatus } from '@/features/course/types'

export interface MockCourse {
  id: string
  title: string
  description: string
  thumbnail: string | null
  status: CourseStatus
  students: number
  lessons: number
  duration: string
  rating: number
  category: string
  creatorId: string
  createdAt: string
  updatedAt: string
}

/**
 * Menghasilkan daftar kursus palsu untuk keperluan testing
 * @param count Jumlah kursus yang akan dibuat
 * @returns Array berisi data kursus palsu
 */
export function generateMockCourses(count = 10): MockCourse[] {
  const courses: MockCourse[] = []

  for (let i = 1; i <= count; i++) {
    courses.push({
      id: `course-${i}`,
      title: `Test Course ${i}`,
      description: `Test Description ${i}`,
      thumbnail: `/test-thumbnail-${i}.jpg`,
      status: 'DRAFT',
      students: Math.floor(Math.random() * 100),
      lessons: Math.floor(Math.random() * 20),
      duration: `${Math.floor(Math.random() * 10)} jam`,
      rating: Math.random() * 5,
      category: ['Programming', 'Design', 'Business', 'Marketing'][i % 4],
      creatorId: `creator-${(i % 3) + 1}`,
      createdAt: new Date(2024, 0, i).toISOString(),
      updatedAt: new Date(2024, 0, i).toISOString(),
    })
  }

  return courses
}

/**
 * Memfilter dan mengembalikan data kursus berdasarkan parameter filter
 * @param creatorId Filter berdasarkan creator ID
 * @param page Halaman yang diminta
 * @param limit Jumlah item per halaman
 * @returns Object berisi data kursus yang difilter dan metadata pagination
 */
export function getMockCoursesResponse(creatorId: string | null, page = 1, limit = 10) {
  // Menghasilkan dataset yang lebih besar untuk pagination
  let courses = generateMockCourses(50)

  // Filter berdasarkan creator jika parameter creatorId ada
  if (creatorId) {
    courses = courses.filter((course) => course.creatorId === creatorId)
  }

  // Menghitung data pagination
  const totalItems = courses.length
  const totalPages = Math.ceil(totalItems / limit)
  const currentPage = Math.min(page, totalPages)
  const offset = (currentPage - 1) * limit

  // Mengembalikan data sesuai pagination
  return {
    courses: courses.slice(offset, offset + limit),
    pagination: {
      page: currentPage,
      limit,
      total: totalItems,
      totalPages,
    },
  }
}

/**
 * Mendapatkan kursus berdasarkan ID
 * @param id ID kursus yang dicari
 * @returns Kursus dengan ID yang sesuai atau null
 */
export function getMockCourseById(id: string): MockCourse | null {
  const courses = generateMockCourses(50)
  return courses.find((course) => course.id === id) || null
}

/**
 * Membuat kursus baru
 * @param courseData Data kursus yang akan dibuat
 * @param creatorId ID creator
 * @returns Kursus yang baru dibuat
 */

export function createMockCourse(courseData: Course, creatorId: string): MockCourse {
  return {
    id: `course-${Date.now()}`,
    title: courseData.title,
    description: courseData.description,
    thumbnail: courseData.thumbnail || null,
    status: 'DRAFT',
    students: 0,
    lessons: 0,
    duration: '0 jam',
    rating: 0,
    category: courseData.category,
    creatorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Update kursus
 * @param id ID kursus
 * @param courseData Data update
 * @param creatorId ID creator
 * @returns Kursus yang diupdate atau null jika tidak ditemukan
 */
export function updateMockCourse(
  id: string,
  courseData: Course,
  creatorId: string,
): MockCourse | null {
  const courses = generateMockCourses(50)
  const existingCourse = courses.find(
    (course) => course.id === id && course.creatorId === creatorId,
  )

  if (!existingCourse) {
    return null
  }

  return {
    ...existingCourse,
    ...courseData,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Update status kursus
 * @param id ID kursus
 * @param status Status baru
 * @param creatorId ID creator
 * @returns Kursus yang diupdate statusnya atau null jika tidak ditemukan
 */
export function updateMockCourseStatus(
  id: string,
  status: CourseStatus,
  creatorId: string,
): MockCourse | null {
  const courses = generateMockCourses(50)
  const existingCourse = courses.find(
    (course) => course.id === id && course.creatorId === creatorId,
  )

  if (!existingCourse) {
    return null
  }

  return {
    ...existingCourse,
    status,
    updatedAt: new Date().toISOString(),
  }
}
