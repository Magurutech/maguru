/**
 * Smoke Test untuk Playwright Setup Verification
 *
 * Test ini memverifikasi bahwa:
 * - Playwright dapat mengakses aplikasi Next.js
 * - Clerk integration berfungsi dengan baik
 * - Basic navigation dan page loading bekerja
 * - Test environment sudah dikonfigurasi dengan benar
 *
 * CRITICAL: Test ini menggunakan fresh browser state tanpa auth state
 * dari global setup untuk memastikan sign-in/sign-up pages dapat diakses
 */

import { test, expect } from '@playwright/test'
import { waitForPageLoad } from './utils/test-helpers'

// CRITICAL: Gunakan fresh browser state tanpa auth state dari global setup
// Ini memastikan sign-in/sign-up pages dapat diakses tanpa redirect
test.use({
  storageState: { cookies: [], origins: [] },
  // Clear any existing auth state
  extraHTTPHeaders: {
    Authorization: '',
  },
})

test.describe('Playwright Setup Verification', () => {
  test.beforeEach(async ({ page }) => {
    // CRITICAL: Clear browser state untuk fresh session
    await page.context().clearCookies()
    await page.context().clearPermissions()

    console.log('🧪 Starting smoke test with fresh browser state...')
  })

  test('should load homepage successfully', async ({ page }) => {
    // Given: Playwright dikonfigurasi dengan benar

    // When: Mengakses homepage aplikasi
    await page.goto('/')
    await waitForPageLoad(page)

    // Then: Homepage dapat dimuat tanpa error
    await expect(page).toHaveTitle(/Maguru/)
    await expect(page.locator('body')).toBeVisible()

    console.log('✅ Homepage loaded successfully')
  })

  test('should access sign-in page', async ({ page }) => {
    // Given: Fresh browser state tanpa authentication

    // When: Mengakses halaman sign-in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // Then: Sign-in page dapat dimuat dengan Clerk component
    await expect(page).toHaveURL('/sign-in')

    // Verify Clerk sign-in component ada dengan multiple selectors
    // Clerk menggunakan berbagai selector untuk form elements
    const signInForm = page
      .locator('form, [data-testid*="sign-in"], .cl-form, [role="form"]')
      .first()
    await expect(signInForm).toBeVisible({ timeout: 10000 })

    // Alternative: Check for Clerk-specific elements
    const hasClerkElements =
      (await page.locator('[data-testid*="clerk"], .cl-form, [role="form"]').count()) > 0
    expect(hasClerkElements).toBeTruthy()

    console.log('✅ Sign-in page loaded successfully')
  })

  test('should access sign-up page', async ({ page }) => {
    // Given: Fresh browser state tanpa authentication

    // When: Mengakses halaman sign-up
    await page.goto('/sign-up')
    await waitForPageLoad(page)

    // Then: Sign-up page dapat dimuat dengan Clerk component
    await expect(page).toHaveURL('/sign-up')

    // Verify Clerk sign-up component ada dengan multiple selectors
    const signUpForm = page
      .locator('form, [data-testid*="sign-up"], .cl-form, [role="form"]')
      .first()
    await expect(signUpForm).toBeVisible({ timeout: 10000 })

    // Alternative: Check for Clerk-specific elements
    const hasClerkElements =
      (await page.locator('[data-testid*="clerk"], .cl-form, [role="form"]').count()) > 0
    expect(hasClerkElements).toBeTruthy()

    console.log('✅ Sign-up page loaded successfully')
  })

  test('should handle navigation between pages', async ({ page }) => {
    // Given: Fresh browser state tanpa authentication

    // When: Navigate dari homepage ke sign-in ke sign-up
    await page.goto('/')
    await waitForPageLoad(page)

    // Navigate ke sign-in
    await page.goto('/sign-in')
    await waitForPageLoad(page)
    await expect(page).toHaveURL('/sign-in')

    // Navigate ke sign-up
    await page.goto('/sign-up')
    await waitForPageLoad(page)
    await expect(page).toHaveURL('/sign-up')

    // Navigate kembali ke homepage
    await page.goto('/')
    await waitForPageLoad(page)
    await expect(page).toHaveURL('/')

    console.log('✅ Navigation between pages working correctly')
  })

  test('should verify test environment configuration', async ({ page }) => {
    // Given: Test environment sudah dikonfigurasi

    // When: Mengakses aplikasi dan check environment indicators
    await page.goto('/')
    await waitForPageLoad(page)

    // Then: Environment configuration benar
    // Check bahwa kita tidak di production (base URL localhost)
    expect(page.url()).toContain('localhost:3000')

    // Verify page dapat diakses tanpa error
    const body = page.locator('body')
    await expect(body).toBeVisible()

    console.log('✅ Test environment configured correctly')
  })

  test('should verify Clerk test mode integration', async ({ page }) => {
    // Given: Fresh browser state dan Clerk test mode sudah diaktifkan

    // When: Mengakses sign-in page
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // Then: Clerk component dapat dimuat dalam test mode
    // Berdasarkan error context, Clerk menggunakan struktur HTML yang berbeda
    const clerkSelectors = [
      // Selectors berdasarkan struktur HTML yang sebenarnya
      'textbox[name="identifier"]', // Email input
      'textbox[name="password"]', // Password input
      'button:has-text("Continue")', // Continue button
      'text:has-text("Sign in to")', // Heading
      'text:has-text("Welcome back!")', // Welcome message
      'text:has-text("Don\'t have an account?")', // Sign up link text
      'link:has-text("Sign up")', // Sign up link
      // Fallback selectors
      'input[name="identifier"]',
      'input[name="password"]',
      'button[type="submit"]',
      'h1:has-text("Sign in")',
      'p:has-text("Welcome back")',
    ]

    let hasClerkElements = false
    for (const selector of clerkSelectors) {
      const count = await page.locator(selector).count()
      if (count > 0) {
        hasClerkElements = true
        console.log(`✅ Found Clerk elements with selector: ${selector}`)
        break
      }
    }

    // Alternative: Check for specific Clerk elements based on error context
    if (!hasClerkElements) {
      const emailInput = page.locator('textbox[name="identifier"], input[name="identifier"]')
      const passwordInput = page.locator('textbox[name="password"], input[name="password"]')
      const continueButton = page.locator('button:has-text("Continue")')

      const hasEmailInput = (await emailInput.count()) > 0
      const hasPasswordInput = (await passwordInput.count()) > 0
      const hasContinueButton = (await continueButton.count()) > 0

      hasClerkElements = hasEmailInput && hasPasswordInput && hasContinueButton

      if (hasClerkElements) {
        console.log('✅ Found Clerk form elements: email input, password input, continue button')
      }
    }

    expect(hasClerkElements).toBeTruthy()

    console.log('✅ Clerk test mode integration verified')
  })

  test('should verify page accessibility without authentication', async ({ page }) => {
    // Given: Fresh browser state tanpa authentication

    // When: Mengakses protected pages
    await page.goto('/dashboard')
    await waitForPageLoad(page)

    // Then: Should redirect to sign-in or show auth required
    // This verifies that auth protection is working
    const currentUrl = page.url()
    const isRedirectedToAuth = currentUrl.includes('/sign-in') || currentUrl.includes('/sign-up')

    if (isRedirectedToAuth) {
      console.log('✅ Auth protection working - redirected to auth page')
    } else {
      // If not redirected, check if we're on dashboard but with auth required message
      const authRequiredMessage = page.locator('text=/sign.in|sign.up|login|authentication/i')
      await expect(authRequiredMessage).toBeVisible({ timeout: 5000 })
      console.log('✅ Auth protection working - showing auth required message')
    }
  })
})
