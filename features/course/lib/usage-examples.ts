/**
 * Usage Examples untuk Layered Interface Pattern
 *
 * File ini menunjukkan cara menggunakan interface baru dan transformation utilities
 */

import { Course, CourseCatalogItem, CourseDetailView } from '../types'
import { courseTransformers, mockCourseTransformers } from './courseTransformers'
import { mockCourseUtils } from './mockData'

// ============================================================================
// CONTOH 1: Database Layer (Course Management)
// ============================================================================

/**
 * Contoh penggunaan di course-manage components
 * Menggunakan interface Course (database model)
 */
export const courseManagementExample = () => {
  // Get courses dalam format database
  const courses: Course[] = mockCourseUtils.getCourses()

  // Filter berdasarkan status
  const publishedCourses = courses.filter((course) => course.status === 'PUBLISHED')

  // Update course (menggunakan database model)
  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    // Logic untuk update course di database
    console.log('Updating course:', courseId, updates)
  }

  return { courses, publishedCourses, updateCourse }
}

// ============================================================================
// CONTOH 2: Display Layer (Course Catalog)
// ============================================================================

/**
 * Contoh penggunaan di course-catalog components
 * Menggunakan interface CourseCatalogItem (display model)
 */
export const courseCatalogExample = () => {
  // Get courses dalam format display
  const catalogItems: CourseCatalogItem[] = mockCourseUtils.getCatalogItems()

  // Filter berdasarkan category
  const mathCourses = catalogItems.filter((item) => item.category === 'Matematika')

  // Handle user interactions
  const handleEnroll = (courseId: string) => {
    const course = catalogItems.find((item) => item.id === courseId)
    console.log('Enrolling in:', course?.title)
  }

  const handleWishlist = (courseId: string) => {
    const course = catalogItems.find((item) => item.id === courseId)
    console.log('Adding to wishlist:', course?.title)
  }

  return { catalogItems, mathCourses, handleEnroll, handleWishlist }
}

// ============================================================================
// CONTOH 3: Detail Layer (Course Detail Page)
// ============================================================================

/**
 * Contoh penggunaan di course-detail components
 * Menggunakan interface CourseDetailView (detail model)
 */
export const courseDetailExample = () => {
  // Get course dalam format detail view
  const courseId = '1'
  const detailView: CourseDetailView | undefined = mockCourseUtils.getDetailViewById(courseId)

  if (detailView) {
    // Access instructor information
    const instructor = detailView.instructor
    console.log('Instructor:', instructor.name, instructor.bio)

    // Access course statistics
    const stats = {
      rating: detailView.rating,
      students: detailView.students,
      duration: detailView.duration,
      price: detailView.price,
    }

    // Handle enrollment
    const handleEnroll = () => {
      console.log('Enrolling in course:', detailView.title)
    }

    return { detailView, instructor, stats, handleEnroll }
  }

  return null
}

// ============================================================================
// CONTOH 4: Transformation Utilities
// ============================================================================

/**
 * Contoh penggunaan transformation utilities
 */
export const transformationExample = () => {
  // Get database courses
  const courses: Course[] = mockCourseUtils.getCourses()

  // Transform ke catalog items dengan user context
  const userContext = {
    userId: 'user123',
    enrolledCourses: ['1', '3'],
    wishlistCourses: ['2'],
  }

  const catalogItems = courseTransformers.toCatalogItems(courses, userContext)

  // Transform ke detail view
  const detailViews = courseTransformers.toDetailViews(courses, userContext)

  // Transform single course
  const course = courses[0]
  const catalogItem = courseTransformers.toCatalogItem(course, userContext)
  const detailView = courseTransformers.toDetailView(course, userContext)

  return {
    courses,
    catalogItems,
    detailViews,
    catalogItem,
    detailView,
  }
}

// ============================================================================
// CONTOH 5: Mock Data untuk Development
// ============================================================================

/**
 * Contoh penggunaan mock data untuk development/testing
 */
export const mockDataExample = () => {
  // Get mock catalog items (tanpa user context)
  const mockCatalogItems = mockCourseUtils.getCatalogItems()

  // Get mock detail views (tanpa user context)
  const mockDetailViews = mockCourseUtils.getDetailViews()

  // Transform dengan mock data
  const course = mockCourseUtils.getCourseById('1')
  if (course) {
    const mockCatalogItem = mockCourseTransformers.toCatalogItem(course)
    const mockDetailView = mockCourseTransformers.toDetailView(course)

    return {
      mockCatalogItems,
      mockDetailViews,
      mockCatalogItem,
      mockDetailView,
    }
  }

  return { mockCatalogItems, mockDetailViews }
}

// ============================================================================
// CONTOH 6: Type Safety Benefits
// ============================================================================

/**
 * Contoh manfaat type safety dari layered interface
 */
export const typeSafetyExample = () => {
  // ✅ CORRECT: Database model untuk CRUD operations
  const course: Course = {
    id: '1',
    title: 'Test Course',
    description: 'Test Description',
    thumbnail: null,
    status: 'DRAFT',
    students: 0,
    lessons: 10,
    duration: '5 jam',
    rating: 0,
    category: 'Test',
    creatorId: 'creator123',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // ✅ CORRECT: Display model untuk UI
  const catalogItem: CourseCatalogItem = {
    id: '1',
    title: 'Test Course',
    creator: 'Test Creator',
    thumbnail: '/default-thumbnail.jpg',
    rating: 4.5,
    students: 100,
    duration: '5 jam',
    category: 'Test',
    price: 299,
    enrolled: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    description: 'Test Description',
    longDescription: 'Test Long Description',
    curriculum: ['Lesson 1', 'Lesson 2'],
    wishlist: false,
  }

  // ❌ WRONG: Type error - tidak bisa assign database model ke display model
  // const wrongAssignment: CourseCatalogItem = course // Type error!

  // ✅ CORRECT: Transform menggunakan utility
  const transformedItem = courseTransformers.toCatalogItem(course)

  return { course, catalogItem, transformedItem }
}

// ============================================================================
// CONTOH 7: Advanced Mock Data Usage
// ============================================================================

/**
 * Contoh penggunaan advanced mock data utilities
 */
export const advancedMockDataExample = () => {
  // Search courses
  const searchResults = mockCourseUtils.searchCourses('matematika')
  console.log('Search results:', searchResults.length)

  // Filter by category
  const mathCourses = mockCourseUtils.getCoursesByCategory('Matematika')
  console.log('Math courses:', mathCourses.length)

  // Filter by status
  const publishedCourses = mockCourseUtils.getPublishedCourses()
  console.log('Published courses:', publishedCourses.length)

  // Get specific course in different formats
  const courseId = '1'
  const dbCourse = mockCourseUtils.getCourseById(courseId)
  const catalogCourse = mockCourseUtils.getCatalogItemById(courseId)
  const detailCourse = mockCourseUtils.getDetailViewById(courseId)

  return {
    searchResults,
    mathCourses,
    publishedCourses,
    dbCourse,
    catalogCourse,
    detailCourse,
  }
}
