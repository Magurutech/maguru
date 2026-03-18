/**
 * E2E Tests: Creator Dashboard (/creator)
 *
 * Tests untuk creator melihat stats, course list, dan publish/unpublish toggle.
 * Requirements: 4.x
 *
 * Task 17.1 - 17.3
 */

import { test, expect } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { testUsers } from '../../fixtures/test-users'
import { waitForPageLoad } from '../../utils/test-helpers'

test.describe('Creator Dashboard — Authenticated Creator', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to unprotected page first so Clerk can load (required by docs)
    await page.goto('/')
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: testUsers.creatorUser.identifier,
        password: testUsers.creatorUser.password,
      },
    })
  })

  // Task 17.2
  test('dashboard shows stats with real data', async ({ page }) => {
    await page.goto('/creator')
    await waitForPageLoad(page)

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
  test('dashboard shows course list with enrollment count', async ({ page }) => {
    await page.goto('/creator')
    await waitForPageLoad(page)

    // Wait for loading state to disappear
    await page.waitForSelector('[data-testid="course-list-loading"]', { state: 'hidden', timeout: 15000 }).catch(() => {})

    const courseItems = page.getByTestId('creator-course-item')
    const count = await courseItems.count()

    if (count === 0) {
      // Empty state should be visible (not loading)
      await expect(page.getByTestId('empty-state')).toBeVisible({ timeout: 5000 })
      console.log('ℹ️ Creator has no courses, empty state shown')
      return
    }

    // First course item should show title and status
    const firstItem = courseItems.first()
    await expect(firstItem).toBeVisible()

    // Should contain status badge text
    const itemText = await firstItem.textContent()
    expect(itemText).toMatch(/PUBLISHED|DRAFT/)

    // Should show enrollment count (siswa)
    expect(itemText).toContain('siswa')
  })

  // Publish toggle is tested in manage-course.spec.ts (only available on /creator/courses/[id]/manage)
  test('clicking course item redirects to manage page', async ({ page }) => {
    await page.goto('/creator')
    await waitForPageLoad(page)

    const courseItems = page.getByTestId('creator-course-item')
    const count = await courseItems.count()

    if (count === 0) {
      console.log('ℹ️ No courses available, skipping redirect test')
      return
    }

    const firstItem = courseItems.first()
    const courseId = await firstItem.getAttribute('data-course-id')
    await firstItem.click()

    await page.waitForURL(`/creator/courses/${courseId}/manage`, { timeout: 5000 })
    await expect(page).toHaveURL(`/creator/courses/${courseId}/manage`)
  })

  test('"Lihat Semua" button redirects to /creator/courses', async ({ page }) => {
    await page.goto('/creator')
    await waitForPageLoad(page)

    const viewAllBtn = page.getByTestId('view-all-courses-btn')
    await expect(viewAllBtn).toBeVisible()
    await viewAllBtn.click()

    await page.waitForURL('/creator/courses', { timeout: 5000 })
    await expect(page).toHaveURL('/creator/courses')
  })

  test('"Buat Kursus Baru" button links to create page', async ({ page }) => {
    await page.goto('/creator')
    await waitForPageLoad(page)

    const createBtn = page.getByRole('link', { name: /buat kursus baru/i }).first()
    await expect(createBtn).toBeVisible()

    await createBtn.click()
    await expect(page).toHaveURL('/creator/courses/create')
  })

  test('empty state shows "Buat Kursus Pertama" CTA', async ({ page }) => {
    await page.goto('/creator')
    await waitForPageLoad(page)

    const emptyState = page.getByTestId('empty-state')
    const hasEmptyState = await emptyState.isVisible().catch(() => false)

    if (!hasEmptyState) {
      console.log('ℹ️ Creator has courses, skipping empty state test')
      return
    }

    await expect(emptyState).toContainText(/buat kursus pertama/i)
    const ctaBtn = emptyState.getByRole('link', { name: /buat kursus pertama/i })
    await expect(ctaBtn).toBeVisible()
  })
})

// ─── Unauthenticated / wrong role ────────────────────────────────────────────

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
