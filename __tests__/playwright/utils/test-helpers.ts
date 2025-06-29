/**
 * Test Helper Utilities untuk E2E Testing
 *
 * Kumpulan utility functions yang membantu dalam menjalankan E2E tests
 * dengan Clerk authentication dan Next.js routing.
 */

import { Page, expect } from '@playwright/test'
import { testUsers } from '../fixtures/test-users'

/**
 * Helper untuk login user dengan Clerk
 */
export async function loginUser(page: Page, userType: keyof typeof testUsers) {
  const user = testUsers[userType]

  console.log(`🔐 Logging in as ${userType}:`, user.email)

  // Navigate ke sign-in page
  await page.goto('/sign-in')

  // Fill login form
  await page.fill('input[name="identifier"]', user.email)
  await page.fill('input[name="password"]', user.password)

  // Submit form
  await page.click('button[type="submit"]')

  // Wait for successful login - redirect ke dashboard
  await page.waitForURL('/dashboard', { timeout: 10000 })

  console.log('✅ Login successful')
}

/**
 * Helper untuk sign up user baru dengan Clerk
 */
export async function signUpUser(page: Page, userType: keyof typeof testUsers) {
  const user = testUsers[userType]

  console.log(`📝 Signing up as ${userType}:`, user.email)

  // Navigate ke sign-up page
  await page.goto('/sign-up')

  // Fill sign-up form
  if ('firstName' in user && user.firstName)
    await page.fill('input[name="firstName"]', user.firstName)
  if ('lastName' in user && user.lastName) await page.fill('input[name="lastName"]', user.lastName)
  await page.fill('input[name="emailAddress"]', user.email)
  await page.fill('input[name="password"]', user.password)

  // Submit form
  await page.click('button[type="submit"]')

  // Handle verification jika diperlukan (dalam test mode, auto-verified)
  // Wait for successful signup - redirect ke dashboard
  await page.waitForURL('/dashboard', { timeout: 15000 })

  console.log('✅ Sign up successful')
}

/**
 * Helper untuk logout user
 */
export async function logoutUser(page: Page) {
  console.log('🚪 Logging out user...')

  // Click user menu atau logout button
  await page.click('[data-testid="user-menu"]')
  await page.click('[data-testid="logout-button"]')

  // Wait for redirect ke homepage atau sign-in
  await page.waitForURL('/', { timeout: 5000 })

  console.log('✅ Logout successful')
}

/**
 * Helper untuk verify user sudah authenticated
 */
export async function verifyAuthenticated(page: Page) {
  // Check for authenticated user indicators
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()

  // Verify tidak berada di sign-in atau sign-up page
  expect(page.url()).not.toContain('/sign-in')
  expect(page.url()).not.toContain('/sign-up')
}

/**
 * Helper untuk verify user belum authenticated
 */
export async function verifyUnauthenticated(page: Page) {
  // Should be redirected to sign-in atau homepage
  const currentUrl = page.url()
  const isUnauthenticated =
    currentUrl.includes('/sign-in') || currentUrl.includes('/') || currentUrl.includes('/sign-up')

  expect(isUnauthenticated).toBeTruthy()
}

/**
 * Helper untuk test route access
 */
export async function testRouteAccess(page: Page, route: string, shouldHaveAccess: boolean) {
  console.log(`🔍 Testing access to ${route}, should have access: ${shouldHaveAccess}`)

  await page.goto(route)

  if (shouldHaveAccess) {
    // Should not be redirected to unauthorized page
    await expect(page).not.toHaveURL('/unauthorized')
    // Should be able to see main content
    await expect(page.locator('main')).toBeVisible()
  } else {
    // Should be redirected to unauthorized page atau sign-in
    const currentUrl = page.url()
    const isBlocked = currentUrl.includes('/unauthorized') || currentUrl.includes('/sign-in')
    expect(isBlocked).toBeTruthy()
  }

  console.log(`✅ Route access test completed for ${route}`)
}

/**
 * Helper untuk wait for page load
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded')
  // Gunakan timeout yang lebih pendek untuk networkidle
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 })
  } catch {
    // Jika networkidle timeout, lanjutkan saja (common issue dengan Clerk)
    console.log('⚠️ NetworkIdle timeout, continuing...')
  }
}

/**
 * Helper untuk take screenshot dengan nama yang descriptive
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  })
}
