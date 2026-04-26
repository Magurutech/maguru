/**
 * E2E Tests: Creator Course List Page (/creator/courses)
 *
 * Tests untuk halaman daftar semua kursus creator dalam bentuk card grid.
 * Requirements: 4.3, 4.4
 *
 * Task 17.x
 */

import { test, expect } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { testUsers } from '../../fixtures/test-users'
import { waitForPageLoad } from '../../utils/test-helpers'

test.describe('Creator Course List Page — Authenticated Creator', () => {
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
  })

  test('page loads with correct heading and stats', async ({ page }) => {
    await page.goto('/creator/courses')
    await waitForPageLoad(page)

    // Tunggu loading skeleton selesai — h1 muncul setelah role check + data fetch
    await page.waitForSelector('h1', { timeout: 15000 })

    await expect(page.locator('h1')).toContainText('Kursus Saya')

    // Stats text: total · published · draft
    await expect(page.locator('body')).toContainText(/kursus/)
    await expect(page.locator('body')).toContainText(/published/)
    await expect(page.locator('body')).toContainText(/draft/)
  })

  test('course grid shows cards when courses exist', async ({ page }) => {
    await page.goto('/creator/courses')
    await waitForPageLoad(page)

    // Wait for data to load
    await page.waitForSelector('[data-testid="course-grid"], [data-testid="empty-state"]', { timeout: 15000 })

    const emptyState = page.getByTestId('empty-state')
    const hasEmpty = await emptyState.isVisible().catch(() => false)

    if (hasEmpty) {
      console.log('ℹ️ Creator has no courses, skipping grid test')
      return
    }

    const courseGrid = page.getByTestId('course-grid')
    await expect(courseGrid).toBeVisible()

    const cards = courseGrid.getByTestId('course-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('"Manage" button on card redirects to manage page', async ({ page }) => {
    await page.goto('/creator/courses')
    await waitForPageLoad(page)

    await page.waitForSelector('[data-testid="course-grid"], [data-testid="empty-state"]', { timeout: 15000 })

    const emptyState = page.getByTestId('empty-state')
    const hasEmpty = await emptyState.isVisible().catch(() => false)

    if (hasEmpty) {
      console.log('ℹ️ Creator has no courses, skipping manage button test')
      return
    }

    // Klik link Manage langsung (lebih reliable dari button di dalam Link)
    const manageLink = page.locator('a[href*="/creator/courses/"][href*="/manage"]').first()
    await expect(manageLink).toBeVisible({ timeout: 10000 })
    await manageLink.click()

    await page.waitForURL(/\/creator\/courses\/.+\/manage/, { timeout: 15000 })
    expect(page.url()).toMatch(/\/creator\/courses\/.+\/manage/)
  })

  test('"Buat Kursus Baru" button redirects to create page', async ({ page }) => {
    await page.goto('/creator/courses')
    await waitForPageLoad(page)

    await page.waitForSelector('[data-testid="course-grid"], [data-testid="empty-state"]', { timeout: 15000 })

    const createBtn = page.getByRole('link', { name: /buat kursus baru/i }).first()
    await expect(createBtn).toBeVisible({ timeout: 10000 })
    await createBtn.click()

    await page.waitForURL('/creator/courses/create', { timeout: 15000 })
    await expect(page).toHaveURL('/creator/courses/create')
  })

  test('empty state shows "Buat Kursus Pertama" CTA', async ({ page }) => {
    await page.goto('/creator/courses')
    await waitForPageLoad(page)

    // Wait for data to load
    await page.waitForSelector('[data-testid="course-grid"], [data-testid="empty-state"]', { timeout: 15000 })

    const emptyState = page.getByTestId('empty-state')
    const hasEmpty = await emptyState.isVisible().catch(() => false)

    if (!hasEmpty) {
      console.log('ℹ️ Creator has courses, skipping empty state test')
      return
    }

    await expect(emptyState).toContainText(/buat kursus pertama/i)
    const ctaBtn = emptyState.getByRole('link', { name: /buat kursus pertama/i })
    await expect(ctaBtn).toBeVisible()
    await ctaBtn.click()

    await page.waitForURL('/creator/courses/create', { timeout: 5000 })
    await expect(page).toHaveURL('/creator/courses/create')
  })

  test('back button redirects to /creator dashboard', async ({ page }) => {
    await page.goto('/creator/courses')
    await waitForPageLoad(page)

    // Wait for data to load — back button renders after loading skeleton resolves
    await page.waitForSelector('[data-testid="course-grid"], [data-testid="empty-state"]', { timeout: 15000 })

    const backBtn = page.getByTestId('back-to-dashboard-btn')
    await expect(backBtn).toBeVisible({ timeout: 10000 })
    await backBtn.click()

    await page.waitForURL('/creator', { timeout: 5000 })
    await expect(page).toHaveURL('/creator')
  })
})

// ─── Access Control ───────────────────────────────────────────────────────────

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
