/**
 * E2E Test: User Access Verification
 *
 * 3 core tests:
 * 1. User dapat akses /dashboard
 * 2. User diblokir dari /admin dan /creator
 * 3. Unauthorized page berfungsi dengan benar untuk user
 *
 * Referensi: docs/docs/clerk_test.md
 */

import { test, expect } from '@playwright/test'
import { validateRoleTestEnvironment } from '../fixtures/role-test-users'
import { loginWithRole, logoutFromRoleSession } from '../utils/role-test-helpers'
import { waitForPageLoad } from '../utils/test-helpers'

test.beforeAll(async () => {
  const { availableRoles, missingVars } = validateRoleTestEnvironment()
  if (!availableRoles.includes('user')) {
    throw new Error(`User role not available. Missing: ${missingVars.join(', ')}`)
  }
})

test.describe('User Access', () => {
  test.afterEach(async ({ page }) => {
    await logoutFromRoleSession(page)
  })

  /**
   * User hanya dapat akses /dashboard
   */
  test('should access dashboard route only', async ({ page }) => {
    await loginWithRole(page, 'user')

    await page.goto('/dashboard')
    await waitForPageLoad(page)
    await expect(page).toHaveURL('/dashboard')
    await expect(page).not.toHaveURL('/unauthorized')
    await expect(page).not.toHaveURL('/sign-in')
    await expect(page.locator('body')).toBeVisible()
  })

  /**
   * User diblokir dari /admin dan /creator
   */
  test('should be blocked from admin and creator routes', async ({ page }) => {
    await loginWithRole(page, 'user')

    const restrictedRoutes = ['/admin', '/creator']
    for (const route of restrictedRoutes) {
      await page.goto(route)
      await waitForPageLoad(page)
      await expect(page).toHaveURL('/unauthorized')
      await expect(page.locator('h1')).toContainText('Akses Ditolak')
    }
  })

  /**
   * Unauthorized page menampilkan konten yang benar dan link kembali ke dashboard
   */
  test('should show correct unauthorized page content', async ({ page }) => {
    await loginWithRole(page, 'user')

    await page.goto('/admin')
    await waitForPageLoad(page)

    await expect(page).toHaveURL('/unauthorized')
    await expect(page.locator('h1')).toContainText('Akses Ditolak')
    await expect(page.locator('body')).toContainText('tidak memiliki izin')
    await expect(page.locator('a[href="/dashboard"]')).toBeVisible()
    await expect(page.locator('button:has-text("Kembali ke Halaman Sebelumnya")')).toBeVisible()

    // Verify link back to dashboard works
    await page.click('a[href="/dashboard"]')
    await waitForPageLoad(page)
    await expect(page).toHaveURL('/dashboard')
  })
})
