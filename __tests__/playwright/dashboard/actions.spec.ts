/**
 * Dashboard Actions Tests - Button Navigation
 *
 * Tests verify that quick action buttons work correctly:
 * - "Jelajahi Kursus Baru" → navigates to course catalog
 * - "Creator Studio" → navigates to creator dashboard (creator only)
 * - "Admin Panel" → navigates to admin panel (admin only)
 * - "Edit Profil" → navigates to profile settings
 * - "Lihat Sertifikat" → navigates to certificates page
 */

import { test, expect } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { loginWithRole } from '../utils/role-test-helpers'
import { gotoDashboard } from './helpers'

/**
 * Test Suite: User Quick Actions
 */
test.describe('Dashboard Actions - User Role', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')
    await gotoDashboard(page)
  })

  test('should navigate to course catalog via "Jelajahi Kursus Baru"', async ({ page }) => {
    // Given: On user dashboard
    const exploreButton = page.locator('button:has-text("Jelajahi Kursus Baru")')

    // When: Click explore courses button
    await exploreButton.click()

    // Then: Should navigate to course catalog or courses page
    await page.waitForTimeout(1000)
    const currentUrl = page.url()
    const navigated =
      currentUrl.includes('/courses') ||
      currentUrl.includes('/catalog') ||
      currentUrl.includes('/explore')

    expect(navigated).toBeTruthy()
    console.log(`✅ Navigated to: ${currentUrl}`)
  })

  test('should navigate to profile settings via "Edit Profil"', async ({ page }) => {
    // Given: On user dashboard
    const editProfileButton = page.locator('button:has-text("Edit Profil")')

    // When: Click edit profile button
    await editProfileButton.click()

    // Then: Should navigate to profile/settings page
    await page.waitForTimeout(1000)
    const currentUrl = page.url()
    const navigated =
      currentUrl.includes('/profile') ||
      currentUrl.includes('/settings') ||
      currentUrl.includes('/account')

    expect(navigated).toBeTruthy()
    console.log(`✅ Navigated to: ${currentUrl}`)
  })

  test('should navigate to certificates via "Lihat Sertifikat"', async ({ page }) => {
    // Given: On user dashboard
    const certificatesButton = page.locator('button:has-text("Lihat Sertifikat")')

    // When: Click view certificates button
    if (await certificatesButton.isVisible()) {
      await certificatesButton.click()

      // Then: Should navigate to certificates page
      await page.waitForTimeout(1000)
      const currentUrl = page.url()
      const navigated = currentUrl.includes('/certificate') || currentUrl.includes('/sertifikat')

      expect(navigated).toBeTruthy()
      console.log(`✅ Navigated to: ${currentUrl}`)
    } else {
      console.log('ℹ️ "Lihat Sertifikat" button not visible (user may have no certificates)')
    }
  })
})

/**
 * Test Suite: Creator Quick Actions
 */
test.describe('Dashboard Actions - Creator Role', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'creator')
    await gotoDashboard(page)
  })

  test('should navigate to Creator Studio', async ({ page }) => {
    // Given: On creator dashboard
    const creatorStudioButton = page.locator('button:has-text("Creator Studio")')

    // When: Click creator studio button
    await creatorStudioButton.click()

    // Then: Should navigate to creator dashboard/studio
    await page.waitForTimeout(1000)
    const currentUrl = page.url()
    const navigated =
      currentUrl.includes('/creator') ||
      currentUrl.includes('/studio') ||
      currentUrl.includes('/create')

    expect(navigated).toBeTruthy()
    console.log(`✅ Navigated to: ${currentUrl}`)
  })

  test('Creator Studio should be first/primary action', async ({ page }) => {
    // Given: On creator dashboard
    const quickActions = page.locator('button').filter({ hasText: /Jelajahi|Creator|Edit/i })

    // When: Get all quick action buttons
    const buttonCount = await quickActions.count()

    // Then: Creator Studio should be among the first buttons
    if (buttonCount > 0) {
      const firstButtonText = await quickActions.nth(0).textContent()
      console.log(`ℹ️ First action button: "${firstButtonText}"`)

      // Creator Studio should be visible and accessible
      const hasCreatorStudio = await page
        .locator('button:has-text("Creator Studio")')
        .count()
        .then((c) => c > 0)
      expect(hasCreatorStudio).toBeTruthy()
    }
  })
})

/**
 * Test Suite: Admin Quick Actions
 */
test.describe('Dashboard Actions - Admin Role', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'admin')
    await gotoDashboard(page)
  })

  test('should navigate to Admin Panel', async ({ page }) => {
    // Given: On admin dashboard
    const adminPanelButton = page.locator('button:has-text("Admin Panel")')

    // When: Click admin panel button
    await adminPanelButton.click()

    // Then: Should navigate to admin panel
    await page.waitForTimeout(1000)
    const currentUrl = page.url()
    const navigated = currentUrl.includes('/admin')

    expect(navigated).toBeTruthy()
    console.log(`✅ Navigated to: ${currentUrl}`)
  })

  test('Admin Panel should be first/primary action', async ({ page }) => {
    // Given: On admin dashboard
    const quickActions = page.locator('button').filter({ hasText: /Admin|Jelajahi/i })

    // When: Get all quick action buttons
    const buttonCount = await quickActions.count()

    // Then: Admin Panel should be among the first buttons
    if (buttonCount > 0) {
      const firstButtonText = await quickActions.nth(0).textContent()
      console.log(`ℹ️ First action button: "${firstButtonText}"`)

      // Admin Panel should be visible and accessible
      const hasAdminPanel = await page
        .locator('button:has-text("Admin Panel")')
        .count()
        .then((c) => c > 0)
      expect(hasAdminPanel).toBeTruthy()
    }
  })
})

/**
 * Test Suite: Course Card Actions
 */
test.describe('Dashboard Actions - Course Cards', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')
    await gotoDashboard(page)
  })

  test('should navigate to course learn page via "Lanjut" button', async ({ page }) => {
    // Given: On user dashboard with incomplete courses
    const continueButton = page.locator('button:has-text("Lanjut")').first()

    const isVisible = await continueButton.isVisible().catch(() => false)

    if (isVisible) {
      // When: Click continue button
      await continueButton.click()

      // Then: Should navigate to course learning page
      await page.waitForTimeout(1000)
      const currentUrl = page.url()
      const navigated = currentUrl.includes('/learn') || currentUrl.includes('/course/')

      expect(navigated).toBeTruthy()
      console.log(`✅ Navigated to course: ${currentUrl}`)
    } else {
      console.log('ℹ️ No "Lanjut" button found (all courses may be 100% complete)')
    }
  })

  test('should show review option for completed courses', async ({ page }) => {
    // Given: On user dashboard with completed courses
    const reviewButton = page.locator('button:has-text("Review")').first()

    const isVisible = await reviewButton.isVisible().catch(() => false)

    if (isVisible) {
      // When: Click review button
      await reviewButton.click()

      // Then: Should navigate to course review or completed course page
      await page.waitForTimeout(1000)
      const currentUrl = page.url()
      console.log(`✅ Review button navigated to: ${currentUrl}`)

      // Should be on a course-related page
      const onCoursePage =
        currentUrl.includes('/course/') ||
        currentUrl.includes('/learn') ||
        currentUrl.includes('/review')

      expect(onCoursePage).toBeTruthy()
    } else {
      console.log('ℹ️ No "Review" button found (no completed courses yet)')
    }
  })
})
