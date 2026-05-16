/**
 * Lesson Fixture
 * 
 * Provides auto-created lesson for tests.
 * Depends on course and section fixtures.
 */

import { sectionTest } from './section.fixture'
import { createLessonViaAPI, Lesson } from '../utils/api-helpers'

export type LessonFixtures = {
  testLesson: Lesson
}

/**
 * Lesson test fixture
 * 
 * Usage:
 * ```typescript
 * lessonTest('my test', async ({ 
 *   page, 
 *   testCourse, 
 *   testSection,
 *   testLesson 
 * }) => {
 *   // testCourse, testSection, and testLesson are already created
 *   await page.goto(`/creator/courses/${testCourse.slug}/manage`)
 * })
 * ```
 */
export const lessonTest = sectionTest.extend<LessonFixtures>({
  testLesson: async ({ page, testCourse, testSection }, use) => {
    const timestamp = Date.now()

    // SETUP: Create lesson via API
    const lesson = await createLessonViaAPI(
      page,
      testCourse.slug,
      testSection.id,
      {
        title: `E2E Test Lesson ${timestamp}`,
        order: 1,
        content: {
          version: 1,
          lastEdit: new Date().toISOString(),
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'This is test content for E2E testing',
                  },
                ],
              },
            ],
          },
        },
      }
    )

    // USE: Provide lesson to test
    await use(lesson)

    // TEARDOWN: Lesson will be auto-deleted when course is deleted
  },
})
