import { Course, CourseCatalogItem, CourseDetailView, courseThumbnailUtils } from '../types'

/**
 * Course Transformation Utilities
 *
 * Functions untuk mengkonversi antara database model (Course)
 * dan display models (CourseCatalogItem, CourseDetailView)
 */

export const courseTransformers = {
  /**
   * Transform database Course ke CourseCatalogItem untuk catalog display
   */
  toCatalogItem: (
    course: Course,
    userContext?: {
      userId?: string
      enrolledCourses?: string[]
      wishlistCourses?: string[]
    },
  ): CourseCatalogItem => {
    return {
      id: course.id,
      title: course.title,
      creator: 'Creator Name', // TODO: Get from Clerk metadata using course.creatorId
      thumbnail: courseThumbnailUtils.getDisplayThumbnail(course.thumbnail),
      rating: course.rating,
      students: course.students,
      duration: course.duration,
      category: course.category,
      price: 0, // TODO: Get from pricing service
      enrolled: userContext?.enrolledCourses?.includes(course.id) || false,
      createdAt: course.createdAt.toISOString(),
      description: course.description,
      longDescription: course.description, // TODO: Add separate field to database
      curriculum: [], // TODO: Get from curriculum service
      wishlist: userContext?.wishlistCourses?.includes(course.id) || false,
    }
  },

  /**
   * Transform database Course ke CourseDetailView untuk detail page
   */
  toDetailView: (
    course: Course,
    userContext?: {
      userId?: string
      enrolledCourses?: string[]
      wishlistCourses?: string[]
    },
  ): CourseDetailView => {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: courseThumbnailUtils.getDisplayThumbnail(course.thumbnail),
      instructor: {
        name: 'Instructor Name', // TODO: Get from Clerk metadata using course.creatorId
        avatar: '/placeholder-avatar.jpg',
        bio: 'Instructor bio...',
        credentials: [],
        rating: 4.5,
        students: 1000,
      },
      rating: course.rating,
      totalRatings: 0, // TODO: Get from reviews service
      students: course.students,
      duration: course.duration,
      level: 'Beginner', // TODO: Add to database
      language: 'Indonesian', // TODO: Add to database
      price: 0, // TODO: Get from pricing service
      originalPrice: 0,
      category: course.category,
      lastUpdated: course.updatedAt.toISOString(),
      certificate: false, // TODO: Add to database
      downloadableResources: 0, // TODO: Get from resources service
      articlesCount: 0, // TODO: Get from content service
      videosCount: course.lessons, // Temporary mapping
      totalHours: 0, // TODO: Calculate from content
      enrolled: userContext?.enrolledCourses?.includes(course.id) || false,
      inWishlist: userContext?.wishlistCourses?.includes(course.id) || false,
      learningOutcomes: [], // TODO: Get from content service
      requirements: [], // TODO: Get from content service
      curriculum: [], // TODO: Get from curriculum service
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
