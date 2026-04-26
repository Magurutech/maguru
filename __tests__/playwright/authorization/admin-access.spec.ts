/**
 * E2E Test: Admin Access Verification
 *
 * 3 core tests:
 * 1. Admin dapat akses semua routes (admin, creator, dashboard)
 * 2. Admin tidak ada restricted routes (no block test needed)
 * 3. Admin UI elements tersedia di dashboard
 *
 * Referensi: docs/docs/clerk_test.md
 */

import { test, expect } from '@playwright/test'
import { validateRoleTestEnvironment } from '../fixtures/role-test-users'
import { loginWithRole, logoutFromRoleSession } from '../utils/role-test-helpers'
import { waitForPageLoad } from '../utils/test-helpers'

test.beforeAll(async () => {
  const { availableRoles, missingVars } = validateRoleTestEnvironment()
  if (!availableRoles.includes('admin')) {
    throw new Error(`Admin role not available. Missing: ${missingVars.join(', ')}`)
  }
})

test.describe('Admin Access', () => {
  test.afterEach(async ({ page }) => {
    await logoutFromRoleSession(page)
  })

  /**
   * Admin dapat akses semua protected routes tanpa restriction
   */
  test('should access all routes: admin, creator, dashboard', async ({ page }) => {
    await loginWithRole(page, 'admin')

    const routes = ['/admin', '/creator', '/dashboard']
    for (const route of routes) {
      await page.goto(route)
      await waitForPageLoad(page)
      await expect(page).toHaveURL(route)
      await expect(page).not.toHaveURL('/unauthorized')
      await expect(page).not.toHaveURL('/sign-in')
    }
  })

  /**
   * Admin melihat admin-specific UI elements di dashboard
   */
  test('should display admin UI elements', async ({ page }) => {
    await loginWithRole(page, 'admin')

    await page.goto('/dashboard')
    await waitForPageLoad(page)

    // Admin layout has link to /admin in sidebar
    await expect(page.locator('a[href="/admin"]').first()).toBeVisible()
    await expect(page).not.toHaveURL('/unauthorized')
  })

  /**
   * Admin session tetap stabil saat navigate antar areas
   */
  test('should maintain session across navigation', async ({ page }) => {
    await loginWithRole(page, 'admin')

    // Navigate back and forth
    await page.goto('/admin')
    await waitForPageLoad(page)
    await page.goto('/creator')
    await waitForPageLoad(page)
    await page.goto('/dashboard')
    await waitForPageLoad(page)
    await page.reload()
    await waitForPageLoad(page)

    await expect(page).not.toHaveURL('/sign-in')
    await expect(page).not.toHaveURL('/unauthorized')
    await expect(page.locator('body')).toBeVisible()
  })
})
