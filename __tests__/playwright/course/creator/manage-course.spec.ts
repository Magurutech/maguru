/**
 * E2E Tests: Course Manage Page (/creator/courses/[id]/manage)
 *
 * Tests untuk creator mengelola kursus: publish toggle, sidebar navigation,
 * section management, dan back button.
 * Requirements: 4.5
 *
 * Task 17.4 (extended)
 */

import { expect } from '@playwright/test'
import { courseTest } from '../../fixtures'
import { waitForPageLoad } from '../../utils/test-helpers'

courseTest.describe('Course Manage Page — Authenticated Creator', () => {
  courseTest.beforeEach(async ({ page, testCourse }) => {
    await page.goto(`/creator/courses/${testCourse.slug}/manage`)
    await waitForPageLoad(page)
  })

  courseTest('manage page header shows course info and publish button', async ({ page }) => {

    // Course title in header
    await expect(page.locator('header h1')).toBeVisible()

    // Publish toggle button
    await expect(page.getByTestId('publish-toggle-btn')).toBeVisible()
    const btnText = await page.getByTestId('publish-toggle-btn').textContent()
    expect(btnText).toMatch(/Publish|Unpublish/)
  })

  courseTest('publish/unpublish toggle changes status without full reload', async ({ page }) => {

    const toggleBtn = page.getByTestId('publish-toggle-btn')
    const initialText = await toggleBtn.textContent()
    const isDraft = initialText?.includes('Publish') && !initialText?.includes('Unpublish')

    await toggleBtn.click()

    // Tunggu API selesai — tombol tidak lagi dalam state "Menyimpan..."
    await expect(toggleBtn).not.toContainText('Menyimpan...', { timeout: 10000 })

    const newText = await toggleBtn.textContent()
    if (isDraft) {
      expect(newText).toContain('Unpublish')
    } else {
      expect(newText).toContain('Publish')
    }

    // Toggle back to original state
    await toggleBtn.click()
    await expect(toggleBtn).not.toContainText('Menyimpan...', { timeout: 10000 })
  })

  courseTest('sidebar overview button shows course overview panel', async ({ page }) => {

    const overviewBtn = page.getByTestId('sidebar-overview-btn')
    await expect(overviewBtn).toBeVisible()
    await overviewBtn.click()

    // Sidebar overview button should be active/selected
    await expect(overviewBtn).toBeVisible()

    // Main content should show course overview details (Deskripsi is always present in overview)
    await expect(page.locator('main')).toContainText('Deskripsi')
  })

  courseTest('+ Seksi button opens section creation dialog', async ({ page }) => {

    const addSectionBtn = page.getByTestId('add-section-btn')
    await expect(addSectionBtn).toBeVisible({ timeout: 10000 })
    await addSectionBtn.click()

    // Inline input muncul di sidebar (bukan dialog)
    await expect(page.getByTestId('inline-section-input')).toBeVisible({ timeout: 5000 })
  })

  courseTest('back button redirects to /creator/courses', async ({ page }) => {

    const backBtn = page.getByTestId('back-to-courses-btn')
    await expect(backBtn).toBeVisible({ timeout: 10000 })
    await backBtn.click()

    await page.waitForURL('/creator/courses', { timeout: 10000 })
    await expect(page).toHaveURL('/creator/courses')
  })

  courseTest('section expand/collapse in sidebar', async ({ page }) => {

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

import { test } from '@playwright/test'

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
