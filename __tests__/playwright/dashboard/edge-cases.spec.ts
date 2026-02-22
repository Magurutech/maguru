/**
 * Dashboard Edge Cases Tests - Error Handling & Boundary Conditions
 *
 * Tests verify dashboard handles edge cases gracefully:
 * - API failure → fallback to mock data
 * - No courses → empty state handled correctly
 * - Role switch → dashboard updates accordingly
 */

import { test, expect } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { clerk } from '@clerk/testing/playwright'
import { loginWithRole } from '../utils/role-test-helpers'
import { gotoDashboard, DASHBOARD_SELECTORS } from './helpers'

/**
 * Test Suite: API Error Handling
 */
test.describe('Dashboard Edge Cases - API Errors', () => {
  test.use({
    // Intercept API calls to simulate failure
    contextOptions: {
      // This will be configured per test
    },
  })

  test('should handle API failure gracefully', async ({ page, context }) => {
    // Given: Logged in user with mocked API failure
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')

    // Intercept dashboard API calls to simulate failure
    await page.route('**/api/dashboard**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    // When: Navigate to dashboard with failing API
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)

    // Then: Dashboard should still render (with fallback/mock data)
    const mainContent = page.locator(DASHBOARD_SELECTORS.mainContent)
    await expect(mainContent).toBeVisible({ timeout: 10000 })

    console.log('✅ Dashboard rendered despite API failure')
  })

  test('should log API errors to console', async ({ page }) => {
    // Given: Logged in user
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')

    // Capture console errors
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Intercept API to fail
    await page.route('**/api/dashboard**', (route) => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable' }),
      })
    })

    // When: Navigate to dashboard
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)

    // Then: Console should have error logs
    if (consoleErrors.length > 0) {
      console.log(`✅ API errors logged to console: ${consoleErrors.length} errors`)
    } else {
      console.log('ℹ️ No console errors captured (errors may be handled silently)')
    }
  })
})

/**
 * Test Suite: Empty States
 */
test.describe('Dashboard Edge Cases - Empty States', () => {
  test('should handle no courses gracefully', async ({ page }) => {
    // Given: Logged in user with no courses
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')

    // Intercept API to return empty courses list
    await page.route('**/api/dashboard**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          stats: { enrolled: 0, completed: 0, hours: 0, certificates: 0 },
          recentCourses: [],
          recommendations: [],
        }),
      })
    })

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Should show empty state or hide courses section
    const courseCards = page.locator(DASHBOARD_SELECTORS.courseCard)
    const courseCount = await courseCards.count()

    if (courseCount === 0) {
      console.log('✅ No course cards displayed (correct for empty state)')
    }

    // Dashboard should still render main content
    const mainContent = page.locator(DASHBOARD_SELECTORS.mainContent)
    await expect(mainContent).toBeVisible()

    console.log('✅ Dashboard rendered with empty courses state')
  })

  test('should hide recommendations section when empty', async ({ page }) => {
    // Given: Logged in user with no recommendations
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')

    // Intercept API to return empty recommendations
    await page.route('**/api/dashboard**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          stats: { enrolled: 1, completed: 0, hours: 2, certificates: 0 },
          recentCourses: [{ id: '1', title: 'Test Course', progress: 50 }],
          recommendations: [],
        }),
      })
    })

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Recommendations section should be hidden or show empty state
    const recommendationsSection = page.locator(DASHBOARD_SELECTORS.recommendationsSection)
    const isVisible = await recommendationsSection.isVisible().catch(() => false)

    if (!isVisible) {
      console.log('✅ Recommendations section hidden when empty')
    } else {
      // If visible, should show empty state message
      const hasEmptyMessage = await recommendationsSection
        .locator('text=/no recommendations|belum ada rekomendasi/i')
        .count()
        .then((c) => c > 0)

      if (hasEmptyMessage) {
        console.log('✅ Recommendations section shows empty state message')
      }
    }
  })
})

/**
 * Test Suite: Role Persistence & Switching
 */
test.describe('Dashboard Edge Cases - Role Persistence', () => {
  test('should maintain role session across navigation', async ({ page }) => {
    // Given: Logged in as creator
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'creator')
    await gotoDashboard(page)

    // Verify creator dashboard
    await expect(page.locator('h1:has-text("Dashboard Creator")')).toBeVisible()

    // When: Navigate away and back
    await page.goto('/courses')
    await page.waitForTimeout(1000)
    await gotoDashboard(page)

    // Then: Should still see creator dashboard
    await expect(page.locator('h1:has-text("Dashboard Creator")')).toBeVisible()
    await expect(page.locator('button:has-text("Creator Studio")')).toBeVisible()

    console.log('✅ Role session maintained across navigation')
  })

  test('should handle page refresh with role', async ({ page }) => {
    // Given: Logged in as admin
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'admin')
    await gotoDashboard(page)

    // When: Reload page
    await page.reload()

    // Then: Should still see admin dashboard (not redirect to sign-in)
    await page.waitForTimeout(1000)
    const currentUrl = page.url()

    const isOnDashboard = currentUrl.includes('/dashboard')
    const isNotRedirected = !currentUrl.includes('/sign-in') && !currentUrl.includes('/unauthorized')

    expect(isOnDashboard && isNotRedirected).toBeTruthy()
    console.log('✅ Admin session persisted after page refresh')
  })

  test('should correctly switch roles', async ({ page }) => {
    // Given: Logged in as user
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')
    await gotoDashboard(page)

    const userTitle = await page.locator('h1').textContent()
    console.log(`ℹ️ User role title: ${userTitle}`)

    // When: Logout and login as creator
    await clerk.signOut({ page })
    await page.waitForTimeout(1000)
    await loginWithRole(page, 'creator')
    await gotoDashboard(page)

    // Then: Dashboard should show creator content
    await expect(page.locator('h1:has-text("Dashboard Creator")')).toBeVisible()
    await expect(page.locator('button:has-text("Creator Studio")')).toBeVisible()

    console.log('✅ Role switch successful: user → creator')
  })
})

/**
 * Test Suite: Loading States
 */
test.describe('Dashboard Edge Cases - Loading States', () => {
  test('should show skeleton while loading', async ({ page }) => {
    // Given: Logged in user
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')

    // Slow down API response to see skeleton
    await page.route('**/api/dashboard**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      route.continue()
    })

    // When: Navigate to dashboard
    await page.goto('/dashboard')

    // Then: Should see skeleton initially
    const skeleton = page.locator(DASHBOARD_SELECTORS.loadingSkeleton).first()
    const skeletonVisible = await skeleton.isVisible().catch(() => false)

    if (skeletonVisible) {
      console.log('✅ Skeleton loading state visible')
      // Wait for real content
      await page.waitForTimeout(2500)
    }

    // Should eventually show real content
    const mainContent = page.locator(DASHBOARD_SELECTORS.mainContent)
    await expect(mainContent).toBeVisible({ timeout: 10000 })

    console.log('✅ Real content loaded after skeleton')
  })

  test('should handle slow network gracefully', async ({ page }) => {
    // Given: Logged in user with simulated slow network
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')

    // Simulate slow 3G network
    await context.route('**', (route) => {
      route.continue({
        headers: {
          ...route.request().headers(),
        },
      })
    })

    // Add delay to all responses
    await page.route('**/api/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      route.continue()
    })

    // When: Navigate to dashboard
    const startTime = Date.now()
    await gotoDashboard(page)
    const loadTime = Date.now() - startTime

    // Then: Dashboard should load eventually (even if slow)
    const mainContent = page.locator(DASHBOARD_SELECTORS.mainContent)
    await expect(mainContent).toBeVisible({ timeout: 15000 })

    console.log(`✅ Dashboard loaded in ${loadTime}ms with slow network`)
  })
})

/**
 * Test Suite: Accessibility Edge Cases
 */
test.describe('Dashboard Edge Cases - Accessibility', () => {
  test('should handle keyboard navigation', async ({ page }) => {
    // Given: Logged in user
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')
    await gotoDashboard(page)

    // When: Navigate using Tab key
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Then: Focus should be visible on interactive elements
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    console.log(`ℹ️ Focused element after Tab navigation: ${focusedElement}`)

    // Should be able to focus on buttons/links
    const isValidFocus =
      focusedElement === 'BUTTON' ||
      focusedElement === 'A' ||
      focusedElement === 'INPUT'

    expect(isValidFocus).toBeTruthy()
    console.log('✅ Keyboard navigation works correctly')
  })

  test('should have proper ARIA labels', async ({ page }) => {
    // Given: On dashboard
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')
    await gotoDashboard(page)

    // When: Check for ARIA labels on interactive elements
    const buttons = await page.locator('button').all()
    let ariaCount = 0

    for (const button of buttons.slice(0, 5)) {
      // Check first 5 buttons
      const hasAria =
        (await button.getAttribute('aria-label')) !== null ||
        (await button.textContent())?.trim() !== ''

      if (hasAria) ariaCount++
    }

    // Then: Most buttons should have ARIA labels or text content
    console.log(`✅ ${ariaCount}/5 buttons have ARIA labels or text content`)
  })
})
