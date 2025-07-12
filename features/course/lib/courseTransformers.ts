import { Course, CourseCatalogItem, CourseDetailView, courseThumbnailUtils } from '../types'
import { mockCoursesCatalog } from './mockData'

/**
 * Course Transformation Utilities
 *
 * Functions untuk mengkonversi antara database model (Course)
 * dan display models (CourseCatalogItem, CourseDetailView)
 *
 * Menggunakan hybrid approach: backend data + mock data untuk fields yang belum ada di backend
 */

export const courseTransformers = {
  /**
   * Transform database Course ke CourseCatalogItem untuk catalog display
   * Menggunakan hybrid data: backend data + mock data untuk missing fields
   */
  toCatalogItem: (
    course: Course,
    userContext?: {
      userId?: string
      enrolledCourses?: string[]
      wishlistCourses?: string[]
    },
  ): CourseCatalogItem => {
    // Find corresponding mock data untuk enrichment
    const mockData = mockCoursesCatalog.find((mock) => mock.id === course.id)

    return {
      id: course.id,
      title: course.title,
      creator: mockData?.creator || 'Creator Name', // Mock data atau fallback
      thumbnail: courseThumbnailUtils.getDisplayThumbnail(course.thumbnail),
      rating: course.rating,
      students: course.students,
      duration: mockData?.duration || '2 hours', // Mock data atau default
      category: course.category,
      price: mockData?.price || 0, // Mock data atau default
      enrolled: userContext?.enrolledCourses?.includes(course.id) || false,
      createdAt: course.createdAt.toISOString(),
      description: course.description,
      longDescription: mockData?.longDescription || course.description, // Mock data atau fallback ke description
      curriculum: mockData?.curriculum || [], // Mock data atau empty array
      wishlist: userContext?.wishlistCourses?.includes(course.id) || false,
    }
  },

  /**
   * Transform database Course ke CourseDetailView untuk detail page
   * Menggunakan hybrid data: backend data + mock data untuk missing fields
   */
  toDetailView: (
    course: Course,
    userContext?: {
      userId?: string
      enrolledCourses?: string[]
      wishlistCourses?: string[]
    },
  ): CourseDetailView => {
    // Find corresponding mock data untuk enrichment
    const mockData = mockCoursesCatalog.find((mock) => mock.id === course.id)

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: courseThumbnailUtils.getDisplayThumbnail(course.thumbnail),
      instructor: {
        name: mockData?.creator || 'Instructor Name', // Mock data atau fallback
        avatar: '/placeholder-avatar.jpg',
        bio: 'Instructor bio...',
        credentials: [],
        rating: 4.5,
        students: 1000,
      },
      rating: course.rating,
      totalRatings: 0, // TODO: Get from reviews service
      students: course.students,
      duration: mockData?.duration || '2 hours', // Mock data atau default
      level: 'Beginner', // TODO: Add to database
      language: 'Indonesian', // TODO: Add to database
      price: mockData?.price || 0, // Mock data atau default
      originalPrice: mockData?.price ? mockData.price * 1.2 : 0, // 20% markup
      category: course.category,
      lastUpdated: course.updatedAt.toISOString(),
      certificate: false, // TODO: Add to database
      downloadableResources: 0, // TODO: Get from resources service
      articlesCount: 0, // TODO: Get from content service
      videosCount: course.lessons, // Temporary mapping
      totalHours: 0, // TODO: Calculate from content
      enrolled: userContext?.enrolledCourses?.includes(course.id) || false,
      inWishlist: userContext?.wishlistCourses?.includes(course.id) || false,
      learningOutcomes: mockData?.curriculum || [], // Use curriculum as learning outcomes
      requirements: [], // TODO: Get from content service
      curriculum: mockData?.curriculum?.map((item) => ({ title: item, duration: '30 min' })) || [], // Transform curriculum
      reviews: [], // TODO: Get from reviews service
    }
  },

  /**
   * Transform array of database Courses ke array of CourseCatalogItems
   */
  toCatalogItems: (
    courses: Course[],
    userContext?: {
      userId?: string
      enrolledCourses?: string[]
      wishlistCourses?: string[]
    },
  ): CourseCatalogItem[] => {
    return courses.map((course) => courseTransformers.toCatalogItem(course, userContext))
  },

  /**
   * Transform array of database Courses ke array of CourseDetailViews
   */
  toDetailViews: (
    courses: Course[],
    userContext?: {
      userId?: string
      enrolledCourses?: string[]
      wishlistCourses?: string[]
    },
  ): CourseDetailView[] => {
    return courses.map((course) => courseTransformers.toDetailView(course, userContext))
  },

  /**
   * Utility function untuk enrich Course dengan mock data
   */
  enrichWithMockData: (course: Course): Course & { mockEnriched: boolean } => {
    const mockData = mockCoursesCatalog.find((mock) => mock.id === course.id)
    return {
      ...course,
      mockEnriched: !!mockData,
    }
  },

  /**
   * Check if course has corresponding mock data
   */
  hasMockData: (courseId: string): boolean => {
    return mockCoursesCatalog.some((mock) => mock.id === courseId)
  },
}

/**
 * Mock data transformers untuk development/testing
 */
export const mockCourseTransformers = {
  /**
   * Transform Course ke CourseCatalogItem dengan mock data
   */
  toCatalogItem: (course: Course): CourseCatalogItem => {
    return {
      id: course.id,
      title: course.title,
      creator: 'Mock Creator',
      thumbnail: courseThumbnailUtils.getDisplayThumbnail(course.thumbnail),
      rating: course.rating,
      students: course.students,
      duration: course.duration,
      category: course.category,
      price: 299, // Mock price
      enrolled: false,
      createdAt: course.createdAt.toISOString(),
      description: course.description,
      longDescription: course.description,
      curriculum: ['Lesson 1', 'Lesson 2', 'Lesson 3'],
      wishlist: false,
    }
  },

  /**
   * Transform Course ke CourseDetailView dengan mock data
   */
  toDetailView: (course: Course): CourseDetailView => {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: courseThumbnailUtils.getDisplayThumbnail(course.thumbnail),
      instructor: {
        name: 'Mock Instructor',
        avatar: '/placeholder-avatar.jpg',
        bio: 'Experienced instructor with years of teaching experience.',
        credentials: ['Master Degree', 'Certified Teacher'],
        rating: 4.8,
        students: 1500,
      },
      rating: course.rating,
      totalRatings: 125,
      students: course.students,
      duration: course.duration,
      level: 'Beginner',
      language: 'Indonesian',
      price: 299,
      originalPrice: 399,
      category: course.category,
      lastUpdated: course.updatedAt.toISOString(),
      certificate: true,
      downloadableResources: 15,
      articlesCount: 8,
      videosCount: course.lessons,
      totalHours: 12,
      enrolled: false,
      inWishlist: false,
      learningOutcomes: [
        'Memahami konsep dasar',
        'Menguasai teknik lanjutan',
        'Menerapkan dalam praktik',
      ],
      requirements: ['Minimal pendidikan SMA', 'Kemauan untuk belajar', 'Akses internet stabil'],
      curriculum: [
        { title: 'Pengenalan', duration: '30 menit' },
        { title: 'Konsep Dasar', duration: '45 menit' },
        { title: 'Praktik', duration: '60 menit' },
      ],
      reviews: [
        { user: 'User 1', rating: 5, comment: 'Sangat bagus!' },
        { user: 'User 2', rating: 4, comment: 'Materi lengkap' },
      ],
    }
  },
}
