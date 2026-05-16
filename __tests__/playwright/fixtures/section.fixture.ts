/**
 * Section Fixture
 * 
 * Provides auto-created section for tests.
 * Depends on course fixture.
 */

import { courseTest } from './course.fixture'
import { createSectionViaAPI, Section } from '../utils/api-helpers'

export type SectionFixtures = {
  testSection: Section
}

/**
 * Section test fixture
 * 
 * Usage:
 * ```typescript
 * sectionTest('my test', async ({ page, testCourse, testSection }) => {
 *   // testCourse and testSection are already created
 *   await page.goto(`/creator/courses/${testCourse.slug}/manage`)
 * })
 * ```
 */
export const sectionTest = courseTest.extend<SectionFixtures>({
  testSection: async ({ page, testCourse }, use) => {
    const timestamp = Date.now()

    // SETUP: Create section via API
    const section = await createSectionViaAPI(page, testCourse.slug, {
      title: `E2E Test Section ${timestamp}`,
      order: 1,
    })

    // USE: Provide section to test
    await use(section)

    // TEARDOWN: Section will be auto-deleted when course is deleted
  },
})
