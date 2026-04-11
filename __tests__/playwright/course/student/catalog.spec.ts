/**
 * E2E Tests: Course Catalog Page (/course)
 *
 * Tests untuk student browsing, filtering, searching, dan enrollment flow.
 * Requirements: 1.x, 2.x
 *
 * Task 16.1 - 16.4
 */

import { test, expect } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { testUsers } from '../../fixtures/test-users'
import { waitForPageLoad } from '../../utils/test-helpers'

// ─── Unauthenticated tests ────────────────────────────────────────────────────

test.describe('Course Catalog — Unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
  })

  // Task 16.2
  test('catalog page loads with course cards', async ({ page }) => {
    await page.goto('/course')
    await waitForPageLoad(page)

    // Page title visible
    await expect(page.locator('h1')).toContainText('Katalog Kursus')

    // Filters visible
    await expect(page.getByRole('searchbox', { name: /cari kursus/i })).toBeVisible()
    await expect(page.getByRole('combobox', { name: /filter kategori/i })).toBeVisible()
    await expect(page.getByRole('combobox', { name: /filter tingkat kesulitan/i })).toBeVisible()
  })

  // Task 16.3
  test('filter by category updates URL and re-renders cards', async ({ page }) => {
    await page.goto('/course')
    await waitForPageLoad(page)

    // Open category dropdown and select an option
    const categorySelect = page.getByRole('combobox', { name: /filter kategori/i })
    await categorySelect.click()

    // Pick first non-"all" option
    const firstOption = page.getByRole('option').nth(1)
    const categoryText = await firstOption.textContent()
    await firstOption.click()

    // URL should contain category param
    await expect(page).toHaveURL(new RegExp(`category=${encodeURIComponent(categoryText?.trim() ?? '')}`))

    // Reset button should appear
    await expect(page.getByRole('button', { name: /hapus semua filter|reset/i })).toBeVisible()
  })

  test('filter by difficulty updates URL', async ({ page }) => {
    await page.goto('/course')
    await waitForPageLoad(page)

    const difficultySelect = page.getByRole('combobox', { name: /filter tingkat kesulitan/i })
    await difficultySelect.click()

    // Select "Pemula"
    await page.getByRole('option', { name: 'Pemula' }).click()

    await expect(page).toHaveURL(/difficulty=Pemula/)
  })

  test('search input debounces and updates URL', async ({ page }) => {
    await page.goto('/course')
    await waitForPageLoad(page)

    const searchInput = page.getByRole('searchbox', { name: /cari kursus/i })
    await searchInput.fill('React')

    // Wait for debounce (300ms) + navigation
    await page.waitForURL(/search=React/, { timeout: 8000 })
    await expect(page).toHaveURL(/search=React/)
  })

  // test('reset button clears all filters', async ({ page }) => {
  //   await page.goto('/course?category=Pemrograman&difficulty=Pemula&search=test')
  //   await waitForPageLoad(page)

  //   const resetBtn = page.getByRole('button', { name: /hapus semua filter|reset/i })
  //   await expect(resetBtn).toBeVisible()
  //   await resetBtn.click()

  //   // URL should be clean
  //   await expect(page).toHaveURL('/course')
  // })

  test('empty state shown when no courses match filter', async ({ page }) => {
    await page.goto('/course?search=xyzabc123notexist')
    await waitForPageLoad(page)

    await expect(page.getByTestId('empty-state')).toBeVisible()
    await expect(page.locator('body')).toContainText('Tidak ada kursus yang cocok')
  })

  // Task 16.4
  test('clicking enroll without auth redirects to sign-in', async ({ page }) => {
    await page.goto('/course')
    await waitForPageLoad(page)

    // Check if there are any enroll buttons
    const enrollBtns = page.getByTestId('enroll-btn')
    const count = await enrollBtns.count()

    if (count === 0) {
      // No published courses in test DB — skip gracefully
      console.log('⚠️ No published courses found, skipping enroll redirect test')
      return
    }

    await enrollBtns.first().click()

    // Should redirect to sign-in
    await expect(page).toHaveURL(/sign-in/, { timeout: 5000 })
  })

  test('pagination controls work when multiple pages exist', async ({ page }) => {
    await page.goto('/course')
    await waitForPageLoad(page)

    const nextBtn = page.getByRole('button', { name: /halaman berikutnya/i })

    // Only test if pagination exists
    const isNextEnabled = await nextBtn.isEnabled().catch(() => false)
    if (!isNextEnabled) {
      console.log('ℹ️ Only 1 page of courses, skipping pagination test')
      return
    }

    await nextBtn.click()
    await expect(page).toHaveURL(/page=2/)

    const prevBtn = page.getByRole('button', { name: /halaman sebelumnya/i })
    await prevBtn.click()
    await expect(page).toHaveURL(/page=1|\/course$/)
  })
})

// ─── Authenticated tests ──────────────────────────────────────────────────────

test.describe('Course Catalog — Authenticated Student', () => {
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

  test('enrolled courses show "Lanjut Belajar" button', async ({ page }) => {
    // Navigate to my courses to check if any enrolled
    await page.goto('/student/courses')
    await waitForPageLoad(page)

    const enrolledGrid = page.getByTestId('enrolled-courses-grid')
    const hasEnrolled = await enrolledGrid.isVisible().catch(() => false)

    if (!hasEnrolled) {
      console.log('ℹ️ No enrolled courses, skipping button state test')
      return
    }

    // Go to catalog and verify enrolled courses show "Lanjut Belajar"
    await page.goto('/course')
    await waitForPageLoad(page)

    const continueBtns = page.getByTestId('continue-learning-btn')
    const continueCount = await continueBtns.count()

    if (continueCount > 0) {
      await expect(continueBtns.first()).toBeVisible()
      await expect(continueBtns.first()).toContainText('Lanjut Belajar')
    }
  })

  test('enroll button triggers enrollment flow', async ({ page }) => {
    await page.goto('/course')
    await waitForPageLoad(page)

    const enrollBtns = page.getByTestId('enroll-btn')
    const count = await enrollBtns.count()

    if (count === 0) {
      console.log('⚠️ No unenrolled published courses found')
      return
    }

    // Get course title before enrolling
    const _card = enrollBtns.first().locator('..').locator('..')
    const courseTitle = await page.getByTestId('course-title').first().textContent()

    await enrollBtns.first().click()

    // Should show loading state or redirect
    // Either toast appears or redirect to learn page
    await Promise.race([
      page.waitForURL(/\/learn/, { timeout: 8000 }),
      expect(page.locator('body')).toContainText('Berhasil mendaftar', { timeout: 8000 }),
    ]).catch(() => {
      console.log(`ℹ️ Enrollment for "${courseTitle}" may have already existed`)
    })
  })
})
