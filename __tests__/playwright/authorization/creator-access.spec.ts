/**
 * E2E Test: Creator Access Verification
 *
 * 3 core tests:
 * 1. Creator dapat akses creator dan dashboard routes
 * 2. Creator diblokir dari admin routes
 * 3. Unauthorized page berfungsi dengan benar untuk creator
 *
 * Referensi: docs/docs/clerk_test.md
 */

import { test, expect } from '@playwright/test'
import { validateRoleTestEnvironment } from '../fixtures/role-test-users'
import { loginWithRole, logoutFromRoleSession } from '../utils/role-test-helpers'
import { waitForPageLoad } from '../utils/test-helpers'

test.beforeAll(async () => {
  const { availableRoles, missingVars } = validateRoleTestEnvironment()
  if (!availableRoles.includes('creator')) {
    throw new Error(`Creator role not available. Missing: ${missingVars.join(', ')}`)
  }
})

test.describe('Creator Access', () => {
  test.afterEach(async ({ page }) => {
    await logoutFromRoleSession(page)
  })

  /**
   * Creator dapat akses /creator dan /dashboard, tidak bisa /admin
   */
  test('should access creator and dashboard routes', async ({ page }) => {
    await loginWithRole(page, 'creator')

    const allowedRoutes = ['/creator', '/dashboard']
    for (const route of allowedRoutes) {
      await page.goto(route)
      await waitForPageLoad(page)
      await expect(page).toHaveURL(route)
      await expect(page).not.toHaveURL('/unauthorized')
      await expect(page).not.toHaveURL('/sign-in')
    }
  })

  /**
   * Creator diblokir dari /admin dan diarahkan ke /unauthorized
   */
  test('should be blocked from admin routes', async ({ page }) => {
    await loginWithRole(page, 'creator')

    await page.goto('/admin')
    await waitForPageLoad(page)
    await expect(page).toHaveURL('/unauthorized')
    await expect(page.locator('h1')).toContainText('Akses Ditolak')
  })

  /**
   * Unauthorized page menampilkan konten yang benar dan link kembali ke dashboard
   */
  test('should show correct unauthorized page content', async ({ page }) => {
    await loginWithRole(page, 'creator')

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
