import { Course } from '../types'
import { mockCourseTransformers } from './courseTransformers'

/**
 * Mock Course Data untuk Development/Testing
 *
 * Data ini menggunakan interface Course (database model) dan bisa
 * ditransform ke display models menggunakan courseTransformers
 */

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Petualangan Matematika Nusantara',
    description: 'Belajar matematika dengan cerita petualangan di kepulauan Indonesia',
    thumbnail: '/globe.svg',
    status: 'PUBLISHED',
    students: 1250,
    lessons: 24,
    duration: '8 jam',
    rating: 4.8,
    category: 'Matematika',
    createdAt: new Date(2024, 0, 15),
    creatorId: '1',
    updatedAt: new Date(2024, 0, 15),
  },
  {
    id: '2',
    title: 'Legenda Bahasa Indonesia',
    description: 'Menguasai bahasa Indonesia melalui cerita rakyat dan legenda',
    thumbnail: '/globe.svg',
    status: 'DRAFT',
    students: 0,
    lessons: 18,
    duration: '6 jam',
    rating: 0,
    category: 'Bahasa',
    createdAt: new Date(2024, 1, 20),
    creatorId: '1',
    updatedAt: new Date(2024, 1, 20),
  },
  {
    id: '3',
    title: 'Sains Alam Magis',
    description: 'Eksplorasi sains dengan pendekatan fantasy dan eksperimen menarik',
    thumbnail: '/globe.svg',
    status: 'PUBLISHED',
    students: 890,
    lessons: 32,
    duration: '12 jam',
    rating: 4.6,
    category: 'Sains',
    createdAt: new Date(2024, 0, 8),
    creatorId: '1',
    updatedAt: new Date(2024, 0, 8),
  },
]

/**
 * Mock Data Utilities
 * 
 * Utility functions untuk mengakses mock data dalam format yang berbeda
 * Berguna untuk development, testing, dan prototyping
 */

export const mockCourseUtils = {
  /**
   * Get courses dalam format database model (Course[])
   */
  getCourses: (): Course[] => {
    return mockCourses
  },

  /**
   * Get courses dalam format catalog display (CourseCatalogItem[])
   */
  getCatalogItems: () => {
    return mockCourses.map((course) => mockCourseTransformers.toCatalogItem(course))
  },

  /**
   * Get courses dalam format detail view (CourseDetailView[])
   */
  getDetailViews: () => {
    return mockCourses.map((course) => mockCourseTransformers.toDetailView(course))
  },

  /**
   * Get single course by ID dalam format database model
   */
  getCourseById: (id: string): Course | undefined => {
    return mockCourses.find((course) => course.id === id)
  },

  /**
   * Get single course by ID dalam format catalog item
   */
  getCatalogItemById: (id: string) => {
    const course = mockCourses.find((course) => course.id === id)
    return course ? mockCourseTransformers.toCatalogItem(course) : undefined
  },

  /**
   * Get single course by ID dalam format detail view
   */
  getDetailViewById: (id: string) => {
    const course = mockCourses.find((course) => course.id === id)
    return course ? mockCourseTransformers.toDetailView(course) : undefined
  },

  /**
   * Filter courses by category
   */
  getCoursesByCategory: (category: string): Course[] => {
    return mockCourses.filter((course) => course.category === category)
  },

  /**
   * Get published courses only
   */
  getPublishedCourses: (): Course[] => {
    return mockCourses.filter((course) => course.status === 'PUBLISHED')
  },

  /**
   * Get courses by status
   */
  getCoursesByStatus: (status: string): Course[] => {
    return mockCourses.filter((course) => course.status === status)
  },

  /**
   * Search courses by title or description
   */
  searchCourses: (query: string): Course[] => {
    const lowerQuery = query.toLowerCase()
    return mockCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery)
    )
  },
}

// Backward compatibility
export const metadataCourse = mockCourses 