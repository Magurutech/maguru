/**
 * E2E Tests: My Courses Page (/student/courses)
 *
 * Tests untuk student melihat enrolled courses dan auth protection.
 * Requirements: 3.x
 *
 * Task 16.5 - 16.7
 */

import { test, expect } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { testUsers } from '../../fixtures/test-users'
import { waitForPageLoad } from '../../utils/test-helpers'

// ─── Task 16.6: Unauthenticated redirect ─────────────────────────────────────

test.describe('My Courses — Unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
  })

  // Task 16.6
  test('accessing /student/courses without auth redirects to sign-in', async ({ page }) => {
    await page.goto('/student/courses')
    await waitForPageLoad(page)

    // Should redirect to sign-in
    await expect(page).toHaveURL(/sign-in/, { timeout: 8000 })
  })
})

// ─── Task 16.7: Authenticated student ────────────────────────────────────────

test.describe('My Courses — Authenticated Student', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: testUsers.regularUser.identifier,
        password: testUsers.regularUser.password,
      },
    })
  })

  // Task 16.7
  test('page loads and shows enrolled courses or empty state', async ({ page }) => {
    await page.goto('/student/courses')
    await waitForPageLoad(page)

    // Page title visible
    await expect(page.locator('h1')).toContainText('Kursus Saya')

    // Either enrolled courses grid or empty state should be visible
    const hasGrid = await page.getByTestId('enrolled-courses-grid').isVisible().catch(() => false)
    const hasEmptyState = await page.getByTestId('empty-state').isVisible().catch(() => false)

    expect(hasGrid || hasEmptyState).toBeTruthy()
  })

  test('enrolled course cards show required information', async ({ page }) => {
    await page.goto('/student/courses')
    await waitForPageLoad(page)

    const grid = page.getByTestId('enrolled-courses-grid')
    const hasGrid = await grid.isVisible().catch(() => false)

    if (!hasGrid) {
      console.log('ℹ️ No enrolled courses, skipping card info test')
      return
    }

    const firstCard = page.getByTestId('course-card').first()
    await expect(firstCard).toBeVisible()

    // Card should show title
    await expect(firstCard.getByTestId('course-title')).toBeVisible()

    // Card should show category
    await expect(firstCard.getByTestId('course-category')).toBeVisible()

    // Card should show progress
    await expect(firstCard.getByTestId('course-progress-container')).toBeVisible()
  })

  test('empty state shows link to course catalog', async ({ page }) => {
    await page.goto('/student/courses')
    await waitForPageLoad(page)

    const emptyState = page.getByTestId('empty-state')
    const hasEmptyState = await emptyState.isVisible().catch(() => false)

    if (!hasEmptyState) {
      console.log('ℹ️ Student has enrolled courses, skipping empty state test')
      return
    }

    // Empty state should have link to /course
    const catalogLink = emptyState.getByRole('link', { name: /jelajahi kursus/i })
    await expect(catalogLink).toBeVisible()
    await catalogLink.click()
    await expect(page).toHaveURL('/course')
  })

  test('"Lanjut Belajar" button links to learn page', async ({ page }) => {
    await page.goto('/student/courses')
    await waitForPageLoad(page)

    const continueBtns = page.getByTestId('continue-learning-btn')
    const count = await continueBtns.count()

    if (count === 0) {
      console.log('ℹ️ No enrolled courses, skipping continue button test')
      return
    }

    const href = await continueBtns.first().locator('..').getAttribute('href')
    expect(href).toMatch(/\/course\/.+\/learn/)
  })

  test('page shows enrollment count', async ({ page }) => {
    await page.goto('/student/courses')
    await waitForPageLoad(page)

    const grid = page.getByTestId('enrolled-courses-grid')
    const hasGrid = await grid.isVisible().catch(() => false)

    if (!hasGrid) return

    // Should show count text
    await expect(page.locator('body')).toContainText(/kursus terdaftar/)
  })
})
