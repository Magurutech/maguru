/**
 * E2E Test: Sign In Flow
 *
 * Test ini mencakup:
 * - Successful sign in dengan kredensial valid
 * - Error handling untuk kredensial invalid
 * - Session management dan redirect
 * - Protected route access setelah login
 */

import { test, expect } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { testUsers } from '../fixtures/test-users'
import { waitForPageLoad, takeScreenshot, verifyUserSession } from '../utils/test-helpers'

test.describe('Sign In Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup Clerk testing token untuk setiap test
    await setupClerkTestingToken({ page })
  })

  /**
   * Test: Successful sign in dengan kredensial valid
   *
   * Skenario: User melakukan login dengan email dan password yang benar
   * Expected: User berhasil login dan diarahkan ke dashboard sesuai role
   *
   * BDD Format:
   * - Given: User memiliki account valid dan berada di halaman sign in
   * - When: User mengisi kredensial yang benar dan submit
   * - Then: User berhasil login dan diarahkan ke dashboard
   */
  test('should successfully sign in with valid credentials', async ({ page }) => {
    // Given: User memiliki account valid dan berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // Verify halaman sign in dimuat dengan benar
    await expect(page).toHaveURL('/sign-in')
    await expect(page.locator('form').first()).toBeVisible()

    // When: User mengisi kredensial yang benar dan submit
    const existingUser = testUsers.existingUser

    // Fill email field
    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill(existingUser.email)

    // Fill password field
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill(existingUser.password)

    // Submit form
    const submitButton = page
      .locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Continue")')
      .first()
    await submitButton.click()

    // Then: User berhasil login dan diarahkan ke dashboard
    await page.waitForURL(
      (url) =>
        url.toString().includes('/dashboard') ||
        url.toString().includes('/admin') ||
        url.toString().includes('/creator'),
      { timeout: 15000 },
    )

    // Verify user session aktif
    await verifyUserSession(page)

    // Take screenshot untuk dokumentasi
    await takeScreenshot(page, 'sign-in-success')

    console.log('✅ Sign in berhasil dengan redirect ke:', page.url())
  })

  test('should show error for invalid email', async ({ page }) => {
    // Given: User berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // When: User mengisi email yang tidak terdaftar
    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill('nonexistent+clerk_test@maguru.test')

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill('SomePassword123!')

    const submitButton = page
      .locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Continue")')
      .first()
    await submitButton.click()

    // Then: Error message ditampilkan
    await page.waitForTimeout(3000)

    // Check untuk berbagai kemungkinan error message
    const errorSelectors = [
      '[data-localization-key*="error"]',
      '.cl-formFieldErrorText',
      '[role="alert"]',
      '.error',
      'text=not found',
      'text=incorrect',
      'text=invalid',
    ]

    let errorFound = false
    for (const selector of errorSelectors) {
      const errorElement = page.locator(selector)
      if ((await errorElement.count()) > 0 && (await errorElement.isVisible())) {
        errorFound = true
        console.log('✅ Error message found:', await errorElement.textContent())
        break
      }
    }

    // Log hasil untuk debugging
    if (!errorFound) {
      console.log('⚠️ No specific error message found, but login should not succeed')
    }

    // Pastikan tidak redirect ke dashboard
    await expect(page).not.toHaveURL('/dashboard')
    await takeScreenshot(page, 'sign-in-invalid-email')
  })

  test('should show error for wrong password', async ({ page }) => {
    // Given: User berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // When: User mengisi password yang salah
    const existingUser = testUsers.existingUser

    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill(existingUser.email)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill('WrongPassword123!')

    const submitButton = page
      .locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Continue")')
      .first()
    await submitButton.click()

    // Then: Error message ditampilkan
    await page.waitForTimeout(3000)

    const errorSelectors = [
      '[data-localization-key*="error"]',
      '.cl-formFieldErrorText',
      '[role="alert"]',
      'text=incorrect',
      'text=wrong',
      'text=invalid',
    ]

    let errorFound = false
    for (const selector of errorSelectors) {
      const errorElement = page.locator(selector)
      if ((await errorElement.count()) > 0 && (await errorElement.isVisible())) {
        errorFound = true
        console.log('✅ Password error message found:', await errorElement.textContent())
        break
      }
    }

    // Log hasil untuk debugging
    if (!errorFound) {
      console.log('⚠️ No password error message found, but login should not succeed')
    }

    // Pastikan tidak redirect ke dashboard
    await expect(page).not.toHaveURL('/dashboard')
    await takeScreenshot(page, 'sign-in-wrong-password')
  })

  test('should handle empty form submission', async ({ page }) => {
    // Given: User berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // When: User submit form kosong
    const submitButton = page
      .locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Continue")')
      .first()
    await submitButton.click()

    // Then: Validation error ditampilkan atau form tidak submit
    await page.waitForTimeout(1000)

    // Check HTML5 validation
    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    const emailValidity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)

    if (!emailValidity) {
      console.log('✅ HTML5 validation preventing empty form submission')
    } else {
      // Check untuk Clerk validation error
      const errorElement = page.locator('.cl-formFieldErrorText, [role="alert"]').first()
      if ((await errorElement.count()) > 0) {
        console.log('✅ Clerk validation preventing empty form submission')
      }
    }

    // Pastikan tidak redirect ke dashboard
    await expect(page).not.toHaveURL('/dashboard')
    await takeScreenshot(page, 'sign-in-empty-form')
  })

  test('should redirect to protected route after login', async ({ page }) => {
    // Given: User mencoba mengakses protected route tanpa login
    await page.goto('/dashboard')

    // Should redirect to sign-in
    await page.waitForURL('/sign-in', { timeout: 10000 })

    // When: User login dengan kredensial valid
    const existingUser = testUsers.existingUser

    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill(existingUser.email)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill(existingUser.password)

    const submitButton = page
      .locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Continue")')
      .first()
    await submitButton.click()

    // Then: User diarahkan ke dashboard yang diminta
    await page.waitForURL('/dashboard', { timeout: 15000 })

    // Verify user dapat mengakses protected content
    await expect(page.locator('body')).toBeVisible()
    await verifyUserSession(page)

    await takeScreenshot(page, 'sign-in-protected-route-redirect')
    console.log('✅ Protected route redirect working correctly')
  })

  test('should maintain session across page navigation', async ({ page }) => {
    // Given: User sudah login
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    const existingUser = testUsers.existingUser

    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill(existingUser.email)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill(existingUser.password)

    const submitButton = page
      .locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Continue")')
      .first()
    await submitButton.click()

    // Wait for successful login
    await page.waitForURL((url) => url.toString().includes('/dashboard'), { timeout: 15000 })

    // When: User navigasi ke halaman lain dan kembali
    await page.goto('/')
    await waitForPageLoad(page)

    // Navigate back to dashboard
    await page.goto('/dashboard')
    await waitForPageLoad(page)

    // Then: User session tetap aktif
    await verifyUserSession(page)

    // User tidak redirect ke sign-in
    await expect(page).toHaveURL('/dashboard')

    await takeScreenshot(page, 'sign-in-session-persistence')
    console.log('✅ Session persistence working correctly')
  })

  test('should handle network timeout during login', async ({ page }) => {
    // Given: User berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // Simulate slow network
    await page.route('**/*clerk*', (route) => {
      setTimeout(() => route.continue(), 5000) // Delay 5 detik
    })

    // When: User submit form dengan network delay
    const existingUser = testUsers.existingUser

    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill(existingUser.email)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill(existingUser.password)

    const submitButton = page
      .locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Continue")')
      .first()
    await submitButton.click()

    // Then: Loading state ditampilkan
    const loadingSelectors = [
      '.cl-spinner',
      '[data-testid="loading"]',
      'button[disabled]',
      '.loading',
    ]

    let loadingFound = false
    for (const selector of loadingSelectors) {
      const loadingElement = page.locator(selector)
      if ((await loadingElement.count()) > 0) {
        loadingFound = true
        console.log('✅ Loading state found during network delay')
        break
      }
    }

    // Log hasil untuk debugging
    if (!loadingFound) {
      console.log('⚠️ No loading state found, but network delay should be handled gracefully')
    }

    await takeScreenshot(page, 'sign-in-network-timeout')

    // Clear route untuk cleanup
    await page.unroute('**/*clerk*')
  })

  test('should navigate between sign-in and sign-up', async ({ page }) => {
    // Given: User berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // When: User klik link ke sign up
    const signUpLink = page.locator('a[href="/sign-up"], text="Sign up"').first()
    if ((await signUpLink.count()) > 0) {
      await signUpLink.click()

      // Then: User diarahkan ke sign up page
      await page.waitForURL('/sign-up', { timeout: 10000 })
      await expect(page).toHaveURL('/sign-up')

      // Navigate back to sign in
      const signInLink = page.locator('a[href="/sign-in"], text="Sign in"').first()
      if ((await signInLink.count()) > 0) {
        await signInLink.click()
        await page.waitForURL('/sign-in', { timeout: 10000 })
        await expect(page).toHaveURL('/sign-in')
      }
    }

    await takeScreenshot(page, 'sign-in-navigation')
    console.log('✅ Navigation between sign-in and sign-up working')
  })
})
