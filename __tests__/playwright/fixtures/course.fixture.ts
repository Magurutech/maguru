/**
 * Course Fixture
 *
 * Provides auto-created course for tests.
 * Course is created via API (fast) and auto-deleted after test.
 */

import { authenticatedTest } from './authenticated.fixture'
import { createCourseViaAPI, deleteCourseViaAPI, Course } from '../utils/api-helpers'

export type CourseFixtures = {
  testCourse: Course
}

/**
 * Course test fixture
 *
 * Usage:
 * ```typescript
 * courseTest('my test', async ({ page, testCourse }) => {
 *   // testCourse is already created and PUBLISHED
 *   await page.goto(`/creator/courses/${testCourse.slug}/manage`)
 * })
 * ```
 */
export const courseTest = authenticatedTest.extend<CourseFixtures>({
  testCourse: async ({ page }, use) => {
    const timestamp = Date.now()

    // SETUP: Create course via API
    const course = await createCourseViaAPI(page, {
      title: `E2E Test Course ${timestamp}`,
      description: 'Automated test course - will be deleted after test',
      category: 'programming',
      difficulty: 'BEGINNER',
      status: 'PUBLISHED',
    })

    // USE: Provide course to test
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(course)

    // TEARDOWN: Delete course via API
    await deleteCourseViaAPI(page, course.slug)
  },
})
