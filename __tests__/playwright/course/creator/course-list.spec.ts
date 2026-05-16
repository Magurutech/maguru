/**
 * E2E Tests: Creator Course List Page (/creator/courses)
 *
 * Tests untuk halaman daftar semua kursus creator dalam bentuk card grid.
 * Requirements: 4.3, 4.4
 *
 * Task 17.x
 */

import { expect } from '@playwright/test'
import { courseTest } from '../../fixtures'
import { waitForPageLoad } from '../../utils/test-helpers'

courseTest.describe('Creator Course List Page — Authenticated Creator', () => {
  courseTest.beforeEach(async ({ page }) => {
    await page.goto('/creator/courses')
    await waitForPageLoad(page)
  })

  courseTest('page loads with correct heading and stats', async ({ page }) => {

    // Tunggu loading skeleton selesai — h1 muncul setelah role check + data fetch
    await page.waitForSelector('h1', { timeout: 15000 })

    await expect(page.locator('h1')).toContainText('Kursus Saya')

    // Stats text: total · published · draft
    await expect(page.locator('body')).toContainText(/kursus/)
    await expect(page.locator('body')).toContainText(/published/)
    await expect(page.locator('body')).toContainText(/draft/)
  })

  courseTest('course grid shows cards when courses exist', async ({ page, testCourse }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="course-grid"], [data-testid="empty-state"]', { timeout: 15000 })

    // Since we have a course from fixture, grid should be visible
    const courseGrid = page.getByTestId('course-grid')
    await expect(courseGrid).toBeVisible()

    const cards = courseGrid.getByTestId('course-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  courseTest('"Manage" button on card redirects to manage page', async ({ page, testCourse }) => {
    await page.waitForSelector('[data-testid="course-grid"]', { timeout: 15000 })

    // Klik link Manage langsung (lebih reliable dari button di dalam Link)
    const manageLink = page.locator(`a[href*="/creator/courses/${testCourse.slug}/manage"]`).first()
    await expect(manageLink).toBeVisible({ timeout: 10000 })
    await manageLink.click()

    await page.waitForURL(`/creator/courses/${testCourse.slug}/manage`, { timeout: 15000 })
    expect(page.url()).toContain(`/creator/courses/${testCourse.slug}/manage`)
  })

  courseTest('"Buat Kursus Baru" button redirects to create page', async ({ page }) => {

    await page.waitForSelector('[data-testid="course-grid"]', { timeout: 15000 })

    const createBtn = page.getByRole('link', { name: /buat kursus baru/i }).first()
    await expect(createBtn).toBeVisible({ timeout: 10000 })
    await createBtn.click()

    await page.waitForURL('/creator/courses/create', { timeout: 15000 })
    await expect(page).toHaveURL('/creator/courses/create')
  })

  courseTest('back button redirects to /creator dashboard', async ({ page }) => {
    // Wait for data to load — back button renders after loading skeleton resolves
    await page.waitForSelector('[data-testid="course-grid"]', { timeout: 15000 })

    const backBtn = page.getByTestId('back-to-dashboard-btn')
    await expect(backBtn).toBeVisible({ timeout: 10000 })
    await backBtn.click()

    await page.waitForURL('/creator', { timeout: 5000 })
    await expect(page).toHaveURL('/creator')
  })
})

// ─── Access Control ───────────────────────────────────────────────────────────

import { test } from '@playwright/test'

test.describe('Creator Course List Page — Access Control', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
  })

  test('unauthenticated user cannot access /creator/courses', async ({ page }) => {
    await page.goto('/creator/courses')
    await waitForPageLoad(page)

    const url = page.url()
    const isBlocked = url.includes('/sign-in') || url.includes('/unauthorized')

    if (!isBlocked) {
      await expect(page.locator('body')).toContainText(/akses ditolak|sign.in|login/i)
    }
  })
})
