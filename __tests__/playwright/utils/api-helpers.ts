/**
 * API Helpers for E2E Testing
 * 
 * Direct API calls untuk fast test data setup/teardown.
 * Bypass UI untuk speed up test execution.
 */

import { Page } from '@playwright/test'

// ── Types ──────────────────────────────────────────────────────────────────

export interface CourseData {
  title: string
  description: string
  category?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status?: 'DRAFT' | 'PUBLISHED'
}

export interface SectionData {
  title: string
  order?: number
}

export interface LessonData {
  title: string
  order?: number
  content?: {
    version: number
    lastEdit: string
    content: {
      type: 'doc'
      content: any[]
    }
  }
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  status: string
}

export interface Section {
  id: string
  title: string
  order: number
}

export interface Lesson {
  id: string
  title: string
  order: number
  content: {
    version: number
    lastEdit: string
    content: any
  }
}

// ── Helper Functions ───────────────────────────────────────────────────────

/**
 * Get auth token from page cookies
 */
async function getAuthToken(page: Page): Promise<string> {
  const cookies = await page.context().cookies()
  const sessionCookie = cookies.find(c => c.name === '__session')
  if (!sessionCookie) {
    throw new Error('No __session cookie found. User must be authenticated.')
  }
  return sessionCookie.value
}

/**
 * Make authenticated API request
 */
async function apiRequest(
  page: Page,
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const authToken = await getAuthToken(page)
  const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'
  
  const response = await page.request.fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `__session=${authToken}`,
      ...options.headers,
    },
  })

  return response
}

// ── Course API ─────────────────────────────────────────────────────────────

/**
 * Create course via API
 */
export async function createCourseViaAPI(
  page: Page,
  data: CourseData
): Promise<Course> {
  const response = await apiRequest(page, '/api/creator/courses', {
    method: 'POST',
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      category: data.category || 'programming',
      difficulty: data.difficulty || 'BEGINNER',
      status: data.status || 'PUBLISHED',
    }),
  })

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to create course: ${response.status()} - ${error}`)
  }

  const course = await response.json()
  console.log(`✅ Created course via API: ${course.title} (${course.slug})`)
  return course
}

/**
 * Delete course via API
 */
export async function deleteCourseViaAPI(
  page: Page,
  courseSlug: string
): Promise<void> {
  const response = await apiRequest(page, `/api/courses/${courseSlug}`, {
    method: 'DELETE',
  })

  if (!response.ok()) {
    console.warn(`⚠️ Failed to delete course ${courseSlug}: ${response.status()}`)
    // Don't throw - cleanup should be best-effort
  } else {
    console.log(`🗑️ Deleted course via API: ${courseSlug}`)
  }
}

/**
 * Get course by slug via API
 */
export async function getCourseViaAPI(
  page: Page,
  courseSlug: string
): Promise<Course | null> {
  const response = await apiRequest(page, `/api/courses/${courseSlug}`, {
    method: 'GET',
  })

  if (!response.ok()) {
    return null
  }

  return await response.json()
}

// ── Section API ────────────────────────────────────────────────────────────

/**
 * Create section via API
 */
export async function createSectionViaAPI(
  page: Page,
  courseSlug: string,
  data: SectionData
): Promise<Section> {
  const response = await apiRequest(page, `/api/courses/${courseSlug}/sections`, {
    method: 'POST',
    body: JSON.stringify({
      title: data.title,
      order: data.order || 1,
    }),
  })

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to create section: ${response.status()} - ${error}`)
  }

  const section = await response.json()
  console.log(`✅ Created section via API: ${section.title}`)
  return section
}

/**
 * Delete section via API
 */
export async function deleteSectionViaAPI(
  page: Page,
  courseSlug: string,
  sectionId: string
): Promise<void> {
  const response = await apiRequest(
    page,
    `/api/courses/${courseSlug}/sections/${sectionId}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok()) {
    console.warn(`⚠️ Failed to delete section ${sectionId}: ${response.status()}`)
  } else {
    console.log(`🗑️ Deleted section via API: ${sectionId}`)
  }
}

// ── Lesson API ─────────────────────────────────────────────────────────────

/**
 * Create lesson via API
 */
export async function createLessonViaAPI(
  page: Page,
  courseSlug: string,
  sectionId: string,
  data: LessonData
): Promise<Lesson> {
  const defaultContent = {
    version: 1,
    lastEdit: new Date().toISOString(),
    content: {
      type: 'doc' as const,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Test lesson content' }],
        },
      ],
    },
  }

  const response = await apiRequest(
    page,
    `/api/courses/${courseSlug}/sections/${sectionId}/lessons`,
    {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        order: data.order || 1,
        content: data.content || defaultContent,
      }),
    }
  )

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to create lesson: ${response.status()} - ${error}`)
  }

  const lesson = await response.json()
  console.log(`✅ Created lesson via API: ${lesson.title}`)
  return lesson
}

/**
 * Delete lesson via API
 */
export async function deleteLessonViaAPI(
  page: Page,
  courseSlug: string,
  sectionId: string,
  lessonId: string
): Promise<void> {
  const response = await apiRequest(
    page,
    `/api/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok()) {
    console.warn(`⚠️ Failed to delete lesson ${lessonId}: ${response.status()}`)
  } else {
    console.log(`🗑️ Deleted lesson via API: ${lessonId}`)
  }
}

/**
 * Update lesson via API
 */
export async function updateLessonViaAPI(
  page: Page,
  courseSlug: string,
  sectionId: string,
  lessonId: string,
  data: Partial<LessonData>
): Promise<Lesson> {
  const response = await apiRequest(
    page,
    `/api/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  )

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to update lesson: ${response.status()} - ${error}`)
  }

  const lesson = await response.json()
  console.log(`✅ Updated lesson via API: ${lesson.title}`)
  return lesson
}

// ── Batch Operations ───────────────────────────────────────────────────────

/**
 * Create full course structure (course + section + lesson)
 */
export async function createFullCourseStructure(
  page: Page,
  options: {
    courseTitle?: string
    sectionTitle?: string
    lessonTitle?: string
  } = {}
): Promise<{
  course: Course
  section: Section
  lesson: Lesson
}> {
  const timestamp = Date.now()

  // Create course
  const course = await createCourseViaAPI(page, {
    title: options.courseTitle || `Test Course ${timestamp}`,
    description: 'Test course description',
    category: 'programming',
    status: 'PUBLISHED',
  })

  // Create section
  const section = await createSectionViaAPI(page, course.slug, {
    title: options.sectionTitle || `Test Section ${timestamp}`,
    order: 1,
  })

  // Create lesson
  const lesson = await createLessonViaAPI(page, course.slug, section.id, {
    title: options.lessonTitle || `Test Lesson ${timestamp}`,
    order: 1,
  })

  return { course, section, lesson }
}

/**
 * Cleanup full course structure
 */
export async function cleanupFullCourseStructure(
  page: Page,
  courseSlug: string
): Promise<void> {
  // Deleting course will cascade delete sections and lessons
  await deleteCourseViaAPI(page, courseSlug)
}
