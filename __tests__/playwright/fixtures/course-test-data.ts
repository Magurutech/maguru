/**
 * Course Test Data Factory
 *
 * Menyediakan data test yang konsisten untuk E2E testing course management.
 */

import { Course, CourseStatus } from '../../../features/course/types'
import { UserRole } from '../../../features/auth/types'

// export interface CourseTestData {
//   id: string
//   title: string
//   description: string
//   status: 'draft' | 'published'
//   thumbnail?: string
//   creatorId: string
//   createdAt: string
//   updatedAt: string
// }

export interface UserTestData {
  id: string
  email: string
  role: UserRole
  name: string
}

// Test data untuk courses
export const courseTestData: Course[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming language',
    status: CourseStatus.PUBLISHED,
    thumbnail: '/thumbnails/javascript.jpg',
    creatorId: 'creator-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    students: 0,
    lessons: 0,
    duration: '0',
    rating: 0,
    category: 'programming',
  },
  {
    id: '2',
    title: 'React Development',
    description: 'Master React framework for building modern web applications',
    status: CourseStatus.PUBLISHED,
    thumbnail: '/thumbnails/react.jpg',
    creatorId: 'creator-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    students: 0,
    lessons: 0,
    duration: '0',
    rating: 0,
    category: 'programming',
  },
  {
    id: '3',
    title: 'Advanced React Patterns',
    description: 'Advanced patterns and best practices in React development',
    status: CourseStatus.DRAFT,
    thumbnail: '/thumbnails/advanced-react.jpg',
    creatorId: 'creator-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    students: 0,
    lessons: 0,
    duration: '0',
    rating: 0,
    category: 'programming',
  },
  {
    id: '4',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js',
    status: CourseStatus.PUBLISHED,
    thumbnail: '/thumbnails/nodejs.jpg',
    creatorId: 'creator-2',
    createdAt: new Date(),
    updatedAt: new Date(),
    students: 0,
    lessons: 0,
    duration: '0',
    rating: 0,
    category: 'programming',
  },
  {
    id: '5',
    title: 'TypeScript for Beginners',
    description: 'Introduction to TypeScript for JavaScript developers',
    status: CourseStatus.DRAFT,
    thumbnail: '/thumbnails/typescript.jpg',
    creatorId: 'creator-2',
    createdAt: new Date(),
    updatedAt: new Date(),
    students: 0,
    lessons: 0,
    duration: '80',
    rating: 0,
    category: 'programming',
  },
]

// Test data untuk users
export const userTestData: UserTestData[] = [
  {
    id: 'creator-1',
    email: 'creator1@example.com',
    role: 'creator' as UserRole,
    name: 'John Creator',
  },
  {
    id: 'creator-2',
    email: 'creator2@example.com',
    role: 'creator' as UserRole,
    name: 'Jane Creator',
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    name: 'Admin User',
  },
  {
    id: 'user-1',
    email: 'user@example.com',
    role: 'user' as UserRole,
    name: 'Regular User',
  },
]

// Helper functions untuk test data
export const getCourseById = (id: string): Course | undefined => {
  return courseTestData.find((course) => course.id === id)
}

export const getCoursesByCreator = (creatorId: string): Course[] => {
  return courseTestData.filter((course) => course.creatorId === creatorId)
}

export const getCoursesByStatus = (status: CourseStatus): Course[] => {
  return courseTestData.filter((course) => course.status === status)
}

export const getUserByRole = (role: 'creator' | 'admin' | 'user'): UserTestData | undefined => {
  return userTestData.find((user) => user.role === role)
}

export const getUserById = (id: string): UserTestData | undefined => {
  return userTestData.find((user) => user.id === id)
}

// Test data untuk form validation
export const invalidCourseData = {
  emptyTitle: {
    title: '',
    description: 'Valid description',
    category: 'matematika', // ✅ Tambahkan required field
  },
  shortTitle: {
    title: 'AB',
    description: 'Valid description',
    category: 'matematika', // ✅ Tambahkan required field
  },
  emptyDescription: {
    title: 'Valid Title',
    description: '',
    category: 'matematika', // ✅ Tambahkan required field
  },
  longTitle: {
    title: 'A'.repeat(101), // Assuming max 100 characters
    description: 'Valid description',
    category: 'matematika', // ✅ Tambahkan required field
  },
  // ✅ Tambahkan valid test data
  validCourse: {
    title: 'Test Course Title',
    description: 'Test course description',
    category: 'matematika',
  },
}

// Test data untuk search scenarios
export const searchTestData = {
  existingCourse: 'JavaScript',
  nonExistentCourse: 'NonExistentCourse',
  partialMatch: 'React',
  caseInsensitive: 'javascript',
  descriptionKeyword: 'beginner',
}

// Test data untuk performance testing
export const performanceTestData = {
  largeDataset: Array.from({ length: 100 }, (_, i) => ({
    id: `perf-${i + 1}`,
    title: `Performance Test Course ${i + 1}`,
    description: `Description for performance test course ${i + 1}`,
    status: i % 2 === 0 ? 'published' : ('draft' as const),
    creatorId: 'creator-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  })),
}
