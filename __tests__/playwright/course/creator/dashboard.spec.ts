/**
 * E2E Tests: Creator Dashboard (/creator)
 *
 * Tests untuk creator melihat stats, course list, dan publish/unpublish toggle.
 * Requirements: 4.x
 *
 * Task 17.1 - 17.3
 */

import { expect } from '@playwright/test'
import { courseTest } from '../../fixtures'
import { waitForPageLoad } from '../../utils/test-helpers'

courseTest.describe('Creator Dashboard — Authenticated Creator', () => {
  courseTest.beforeEach(async ({ page }) => {
    await page.goto('/creator')
    await waitForPageLoad(page)
  })

  // Task 17.2
  courseTest('dashboard shows stats with real data', async ({ page }) => {
    // Page title
    await expect(page.locator('h1')).toContainText('Creator Studio')

    // Stats card visible
    await expect(page.getByTestId('stat-total-courses')).toBeVisible()

    // Stats value is a number
    const statsValue = await page.getByTestId('stat-total-courses-value').textContent()
    expect(Number(statsValue?.trim())).toBeGreaterThanOrEqual(0)

    // Published/draft breakdown text visible
    await expect(page.locator('body')).toContainText(/published.*draft|draft.*published/i)
  })

  // Task 17.3
  courseTest(
    'dashboard shows course list with enrollment count',
    async ({ page, testCourse: _testCourse }) => {
      // Wait for loading state to disappear
      await page
        .waitForSelector('[data-testid="course-list-loading"]', { state: 'hidden', timeout: 15000 })
        .catch(() => {})

      const courseItems = page.getByTestId('creator-course-item')
      const count = await courseItems.count()

      // Since we have a course from fixture, count should be > 0
      expect(count).toBeGreaterThan(0)

      // First course item should show title and status
      const firstItem = courseItems.first()
      await expect(firstItem).toBeVisible()

      // Should contain status badge text
      const itemText = await firstItem.textContent()
      expect(itemText).toMatch(/PUBLISHED|DRAFT/)

      // Should show enrollment count (siswa)
      expect(itemText).toContain('siswa')
    },
  )

  // Publish toggle is tested in manage-course.spec.ts (only available on /creator/courses/[id]/manage)
  courseTest('clicking course item redirects to manage page', async ({ page, testCourse }) => {
    const courseItems = page.getByTestId('creator-course-item')
    const count = await courseItems.count()

    expect(count).toBeGreaterThan(0)

    const firstItem = courseItems.first()
    await firstItem.click()

    await page.waitForURL(`/creator/courses/${testCourse.slug}/manage`, { timeout: 15000 })
    await expect(page).toHaveURL(`/creator/courses/${testCourse.slug}/manage`)
  })

  courseTest('"Lihat Semua" button redirects to /creator/courses', async ({ page }) => {
    const viewAllBtn = page.getByTestId('view-all-courses-btn')
    await expect(viewAllBtn).toBeVisible()
    await viewAllBtn.click()

    await page.waitForURL('/creator/courses', { timeout: 15000 })
    await expect(page).toHaveURL('/creator/courses')
  })

  courseTest('"Buat Kursus Baru" button links to create page', async ({ page }) => {
    const createBtn = page.getByRole('link', { name: /buat kursus baru/i }).first()
    await expect(createBtn).toBeVisible()

    await createBtn.click()
    await expect(page).toHaveURL('/creator/courses/create')
  })
})

// ─── Unauthenticated / wrong role ────────────────────────────────────────────

import { test } from '@playwright/test'

test.describe('Creator Dashboard — Access Control', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
  })

  test('unauthenticated user cannot access creator dashboard', async ({ page }) => {
    await page.goto('/creator')
    await waitForPageLoad(page)

    // Should redirect to sign-in or show access denied
    const url = page.url()
    const isBlocked = url.includes('/sign-in') || url.includes('/unauthorized')

    if (!isBlocked) {
      // May show "Akses Ditolak" message
      await expect(page.locator('body')).toContainText(/akses ditolak|sign.in|login/i)
    }
  })
})
