/**
 * E2E Tests: Course Manage Page (/creator/courses/[id]/manage)
 *
 * Tests untuk creator mengelola kursus: publish toggle, sidebar navigation,
 * section management, dan back button.
 * Requirements: 4.5
 *
 * Task 17.4 (extended)
 */

import { test, expect } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { testUsers } from '../../fixtures/test-users'
import { waitForPageLoad } from '../../utils/test-helpers'

test.describe('Course Manage Page — Authenticated Creator', () => {
  let managePath: string

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: testUsers.creatorUser.identifier,
        password: testUsers.creatorUser.password,
      },
    })

    // Navigate to dashboard to find a course to manage
    await page.goto('/creator')
    await waitForPageLoad(page)

    const firstItem = page.getByTestId('creator-course-item').first()
    const count = await page.getByTestId('creator-course-item').count()

    if (count === 0) {
      managePath = ''
      return
    }

    const courseId = await firstItem.getAttribute('data-course-id')
    managePath = `/creator/courses/${courseId}/manage`
  })

  test('manage page header shows course info and publish button', async ({ page }) => {
    if (!managePath) {
      console.log('ℹ️ No courses available, skipping test')
      return
    }

    await page.goto(managePath)
    await waitForPageLoad(page)

    // Course title in header
    await expect(page.locator('header h1')).toBeVisible()

    // Publish toggle button
    await expect(page.getByTestId('publish-toggle-btn')).toBeVisible()
    const btnText = await page.getByTestId('publish-toggle-btn').textContent()
    expect(btnText).toMatch(/Publish|Unpublish/)
  })

  test('publish/unpublish toggle changes status without full reload', async ({ page }) => {
    if (!managePath) {
      console.log('ℹ️ No courses available, skipping test')
      return
    }

    await page.goto(managePath)
    await waitForPageLoad(page)

    const toggleBtn = page.getByTestId('publish-toggle-btn')
    const initialText = await toggleBtn.textContent()
    const isDraft = initialText?.includes('Publish') && !initialText?.includes('Unpublish')

    await toggleBtn.click()

    // Wait for optimistic update (no full reload)
    await page.waitForTimeout(2000)

    const newText = await toggleBtn.textContent()
    if (isDraft) {
      expect(newText).toContain('Unpublish')
    } else {
      expect(newText).toContain('Publish')
    }

    // Toggle back to original state
    await toggleBtn.click()
    await page.waitForTimeout(2000)
  })

  test('sidebar overview button shows course overview panel', async ({ page }) => {
    if (!managePath) {
      console.log('ℹ️ No courses available, skipping test')
      return
    }

    await page.goto(managePath)
    await waitForPageLoad(page)

    const overviewBtn = page.getByTestId('sidebar-overview-btn')
    await expect(overviewBtn).toBeVisible()
    await overviewBtn.click()

    // Main content should show overview
    await expect(page.locator('main')).toContainText('Overview Kursus')
  })

  test('+ Seksi button opens section creation dialog', async ({ page }) => {
    if (!managePath) {
      console.log('ℹ️ No courses available, skipping test')
      return
    }

    await page.goto(managePath)
    await waitForPageLoad(page)

    const addSectionBtn = page.getByTestId('add-section-btn')
    await expect(addSectionBtn).toBeVisible()
    await addSectionBtn.click()

    // Dialog should open
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('[role="dialog"]')).toContainText(/buat seksi baru/i)
  })

  test('back button redirects to /creator/courses', async ({ page }) => {
    if (!managePath) {
      console.log('ℹ️ No courses available, skipping test')
      return
    }

    await page.goto(managePath)
    await waitForPageLoad(page)

    const backBtn = page.getByTestId('back-to-courses-btn')
    await expect(backBtn).toBeVisible()
    await backBtn.click()

    await page.waitForURL('/creator/courses', { timeout: 5000 })
    await expect(page).toHaveURL('/creator/courses')
  })

  test('section expand/collapse in sidebar', async ({ page }) => {
    if (!managePath) {
      console.log('ℹ️ No courses available, skipping test')
      return
    }

    await page.goto(managePath)
    await waitForPageLoad(page)

    // Check if there are sections
    const sectionToggleBtns = page.locator('aside nav button').filter({ hasNotText: 'Overview Kursus' })
    const sectionCount = await sectionToggleBtns.count()

    if (sectionCount === 0) {
      console.log('ℹ️ No sections in this course, skipping expand/collapse test')
      return
    }

    // Click first section to expand
    const firstSection = sectionToggleBtns.first()
    await firstSection.click()
    await page.waitForTimeout(500)

    // Click again to collapse
    await firstSection.click()
    await page.waitForTimeout(500)
  })
})

// ─── Access Control ───────────────────────────────────────────────────────────

test.describe('Course Manage Page — Access Control', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
  })

  test('unauthenticated user cannot access manage page', async ({ page }) => {
    await page.goto('/creator/courses/some-course-id/manage')
    await waitForPageLoad(page)

    const url = page.url()
    const isBlocked = url.includes('/sign-in') || url.includes('/unauthorized')

    if (!isBlocked) {
      await expect(page.locator('body')).toContainText(/akses ditolak|sign.in|login/i)
    }
  })
})
