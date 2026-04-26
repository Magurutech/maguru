/**
 * Role-Based Test Helper Utilities untuk Authorization E2E Testing
 *
 * Referensi:
 * - https://clerk.com/docs/testing/playwright/overview
 * - https://clerk.com/docs/testing/playwright/test-authenticated-flows
 */

import { Page, expect } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { RoleTestUser, getRoleTestUser, hasAccess } from '../fixtures/role-test-users'
import { waitForPageLoad, takeScreenshot, verifyUserSession } from './test-helpers'
import { UserRole } from '../../../features/auth/types'

/**
 * Login dengan specific role menggunakan Clerk testing helpers.
 * Per Clerk docs: page.goto('/') MUST be called before clerk.signIn().
 */
export async function loginWithRole(page: Page, role: UserRole): Promise<RoleTestUser> {
  const testUser = getRoleTestUser(role)
  console.log(`Logging in as ${role}: ${testUser.identifier}`)

  // CRITICAL: navigate to unprotected page FIRST before any auth operations
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')

  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: testUser.identifier,
      password: testUser.password,
    },
  })

  console.log(`Successfully logged in as ${role}`)
  await verifyUserSession(page)
  return testUser
}

/**
 * Test akses ke route dengan role tertentu
 */
export async function testRoleBasedAccess(
  page: Page,
  route: string,
  role: UserRole,
  shouldHaveAccess?: boolean,
) {
  const expectedAccess = shouldHaveAccess ?? hasAccess(role, route)
  console.log(`Testing ${role} access to ${route}, expected: ${expectedAccess}`)

  await page.goto(route)
  await waitForPageLoad(page)

  console.log(`Current URL: ${page.url()}`)

  if (expectedAccess) {
    await expect(page).not.toHaveURL('/unauthorized')
    await expect(page).not.toHaveURL('/sign-in')
    await expect(page.locator('body')).toBeVisible()
    console.log(`${role} successfully accessed ${route}`)
  } else {
    await expect(page).toHaveURL('/unauthorized', { timeout: 10000 })
    await expect(page.locator('h1')).toContainText(/Akses Ditolak/i)
    console.log(`${role} correctly blocked from ${route}`)
  }

  await takeScreenshot(
    page,
    `${role}-access-${route.replace(/\//g, '-')}-${expectedAccess ? 'allowed' : 'blocked'}`,
  )
}

/**
 * Test semua allowed routes untuk role tertentu
 */
export async function testAllowedRoutesForRole(page: Page, role: UserRole) {
  const testUser = getRoleTestUser(role)
  console.log(`Testing all allowed routes for ${role}`)
  for (const route of testUser.allowedRoutes) {
    await testRoleBasedAccess(page, route, role, true)
  }
  console.log(`All allowed routes tested for ${role}`)
}

/**
 * Test semua restricted routes untuk role tertentu
 */
export async function testRestrictedRoutesForRole(page: Page, role: UserRole) {
  const testUser = getRoleTestUser(role)
  console.log(`Testing all restricted routes for ${role}`)
  for (const route of testUser.restrictedRoutes) {
    await testRoleBasedAccess(page, route, role, false)
  }
  console.log(`All restricted routes tested for ${role}`)
}

/**
 * Verify role-specific UI elements pada halaman tertentu.
 * Matches actual layout files (creator/layout.tsx, dashboard/layout.tsx, admin/layout.tsx).
 */
export async function verifyRoleBasedUI(page: Page, role: UserRole, route: string = '/dashboard') {
  console.log(`Verifying role-based UI elements for ${role} on ${route}`)

  await page.goto(route)
  await waitForPageLoad(page)

  switch (role) {
    case 'admin':
      // Admin layout has sidebar links to /admin
      await expect(page.locator('a[href="/admin"]').first()).toBeVisible()
      break
    case 'creator':
      // Creator layout sidebar has link to /creator
      await expect(page.locator('a[href="/creator"]').first()).toBeVisible()
      // Admin links should NOT be visible in creator layout
      await expect(page.locator('a[href="/admin"]')).not.toBeVisible()
      break
    case 'user':
      // Dashboard layout should not have admin or creator links
      await expect(page.locator('a[href="/admin"]')).not.toBeVisible()
      await expect(page.locator('a[href="/creator"]')).not.toBeVisible()
      break
  }

  console.log(`Role-based UI verified for ${role}`)
  await takeScreenshot(page, `${role}-ui-verification-${route.replace(/\//g, '-')}`)
}

/**
 * Test direct URL access untuk memastikan middleware protection berfungsi
 */
export async function testDirectUrlAccess(page: Page, role: UserRole, targetRoute: string) {
  const expectedAccess = hasAccess(role, targetRoute)
  console.log(`Testing direct URL access: ${role} -> ${targetRoute}`)

  await page.goto(targetRoute)
  await waitForPageLoad(page)

  if (expectedAccess) {
    await expect(page).not.toHaveURL('/unauthorized')
    await expect(page).not.toHaveURL('/sign-in')
    await expect(page.locator('body')).toBeVisible()
  } else {
    await expect(page).toHaveURL('/unauthorized')
  }

  console.log(`Direct URL access test completed for ${role} -> ${targetRoute}`)
}

/**
 * Test role persistence across page navigation
 */
export async function testRolePersistence(page: Page, role: UserRole) {
  const testUser = getRoleTestUser(role)
  console.log(`Testing role persistence for ${role}`)

  const testRoutes = testUser.allowedRoutes.slice(0, 3)
  for (const route of testRoutes) {
    await page.goto(route)
    await waitForPageLoad(page)
    await expect(page).not.toHaveURL('/unauthorized')
    await expect(page).not.toHaveURL('/sign-in')
    await verifyUserSession(page)
  }

  await page.reload()
  await waitForPageLoad(page)
  await verifyUserSession(page)

  console.log(`Role persistence verified for ${role}`)
}

/**
 * Verify unauthorized page functionality dan error messaging.
 *
 * Matches actual /unauthorized page content:
 * - h1: "Akses Ditolak"
 * - body: "tidak memiliki izin"
 * - Link button: "Kembali ke Dashboard" (href="/dashboard")
 * - Ghost button: "Kembali ke Halaman Sebelumnya"
 */
export async function verifyUnauthorizedPageFunctionality(
  page: Page,
  role: UserRole,
  attemptedRoute: string,
) {
  console.log(`Verifying unauthorized page functionality for ${role}`)

  await page.goto(attemptedRoute)
  await waitForPageLoad(page)

  await expect(page).toHaveURL('/unauthorized')
  await expect(page.locator('h1')).toContainText('Akses Ditolak')
  await expect(page.locator('body')).toContainText('tidak memiliki izin')
  await expect(page.locator('a[href="/dashboard"]')).toBeVisible()
  await expect(page.locator('button:has-text("Kembali ke Halaman Sebelumnya")')).toBeVisible()

  // Navigate back to dashboard
  await page.click('a[href="/dashboard"]')
  await waitForPageLoad(page)
  await expect(page).toHaveURL('/dashboard')

  console.log(`Unauthorized page functionality verified for ${role}`)
  await takeScreenshot(page, `${role}-unauthorized-page-${attemptedRoute.replace(/\//g, '-')}`)
}

/**
 * Logout user dari role-based session.
 * Per Clerk docs: page.goto('/') MUST be called before clerk.signOut().
 */
export async function logoutFromRoleSession(page: Page) {
  console.log('Logging out from role-based session...')

  try {
    // CRITICAL: must be on a loaded page before signOut
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await clerk.signOut({ page })
    console.log('Logout completed successfully')
  } catch (error) {
    console.log(`Logout error (continuing anyway): ${error}`)
  } finally {
    try {
      await page.context().clearCookies()
    } catch {
      // ignore - context may already be closed
    }
  }
}

/**
 * Verify role hierarchy implementation
 */
export async function verifyRoleHierarchy(page: Page) {
  const results = {
    isValid: true,
    canAccessAdmin: false,
    canAccessCreator: false,
    canAccessUser: false,
    errors: [] as string[],
  }

  try {
    await page.goto('/admin')
    await waitForPageLoad(page)
    results.canAccessAdmin = !page.url().includes('/unauthorized')

    await page.goto('/creator')
    await waitForPageLoad(page)
    results.canAccessCreator = !page.url().includes('/unauthorized')

    await page.goto('/dashboard')
    await waitForPageLoad(page)
    results.canAccessUser = !page.url().includes('/unauthorized')
  } catch (error) {
    results.errors.push(`Hierarchy verification error: ${error}`)
    results.isValid = false
  }

  return results
}

/**
 * Test role switching between different roles
 */
export async function testRoleSwitching(page: Page, fromRole: UserRole, toRole: UserRole) {
  const results = {
    switchSuccessful: false,
    hasPermissionLeakage: false,
    correctPermissions: false,
    errors: [] as string[],
  }

  console.log(`Testing role switch: ${fromRole} to ${toRole}`)

  try {
    await loginWithRole(page, fromRole)
    await waitForPageLoad(page)
    await logoutFromRoleSession(page)
    await page.waitForTimeout(500)
    await loginWithRole(page, toRole)
    await waitForPageLoad(page)

    const toUser = getRoleTestUser(toRole)
    let permissionTest = true

    try {
      await page.goto('/dashboard')
      await waitForPageLoad(page)
      if (page.url().includes('/unauthorized')) {
        permissionTest = false
        results.errors.push(`Should have access to /dashboard but was unauthorized`)
      }
    } catch (error) {
      permissionTest = false
      results.errors.push(`Error testing /dashboard: ${error}`)
    }

    if (toUser.restrictedRoutes.length > 0) {
      const restrictedRoute = toUser.restrictedRoutes[0]
      try {
        await page.goto(restrictedRoute)
        await waitForPageLoad(page)
        if (!page.url().includes('/unauthorized')) {
          permissionTest = false
          results.hasPermissionLeakage = true
          results.errors.push(`Should not have access to ${restrictedRoute} but was allowed`)
        }
      } catch {
        // expected for restricted routes
      }
    }

    results.switchSuccessful = true
    results.correctPermissions = permissionTest
  } catch (error) {
    results.errors.push(`Role switching error: ${error}`)
  }

  return results
}

/**
 * Validate access control matrix
 */
export async function validateAccessControlMatrix(
  page: Page,
  matrix: Record<string, readonly string[]>,
) {
  const results = {
    isValid: true,
    failedCases: [] as Array<{
      role: string
      route: string
      expected: boolean
      actual: boolean
      error?: string
    }>,
    totalTests: 0,
    passedTests: 0,
  }

  const roles = ['admin', 'creator', 'user'] as UserRole[]

  for (const role of roles) {
    await loginWithRole(page, role)

    for (const route of Object.keys(matrix)) {
      results.totalTests++
      const expectedAllowed = matrix[route].includes(role)

      try {
        await page.goto(route)
        await waitForPageLoad(page)
        const actualAllowed = !page.url().includes('/unauthorized')

        if (expectedAllowed === actualAllowed) {
          results.passedTests++
        } else {
          results.failedCases.push({ role, route, expected: expectedAllowed, actual: actualAllowed })
        }
      } catch (error) {
        results.failedCases.push({
          role,
          route,
          expected: expectedAllowed,
          actual: false,
          error: String(error),
        })
      }
    }

    await logoutFromRoleSession(page)
  }

  results.isValid = results.failedCases.length === 0
  return results
}
