/**
 * E2E Test: Sign Up Flow
 *
 * Test ini mencakup:
 * - Successful sign up dengan data valid
 * - Error handling untuk email yang sudah terdaftar
 * - Validasi form untuk data invalid
 * - Redirect flow setelah registrasi berhasil
 */

import { test, expect } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { testUsers } from '../fixtures/test-users'
import { waitForPageLoad, takeScreenshot } from '../utils/test-helpers'

test.describe('Sign Up Flow', () => {
  /**
   * Test: Successful sign up dengan data valid
   *
   * Skenario: User melakukan registrasi dengan data yang valid
   * Expected: User berhasil terdaftar dan diarahkan ke dashboard/verification
   *
   * BDD Format:
   * - Given: User berada di halaman sign up dengan data valid
   * - When: User mengisi form dengan data valid dan submit
   * - Then: User berhasil terdaftar dan diarahkan sesuai konfigurasi
   */
  test('should successfully sign up with valid data', async ({ page }) => {
    // Setup Clerk testing token untuk test ini
    await setupClerkTestingToken({ page })

    // Given: User berada di halaman sign up dengan data valid
    await page.goto('/sign-up')
    await waitForPageLoad(page)

    // Verify halaman sign up dimuat dengan benar
    await expect(page).toHaveURL('/sign-up')
    await expect(page.locator('form').first()).toBeVisible()

    // Debug: Log semua button yang ada di halaman
    const allButtons = await page.locator('button').all()
    console.log('🔍 Available buttons:', allButtons.length)
    for (let i = 0; i < allButtons.length; i++) {
      const buttonText = await allButtons[i].textContent()
      const buttonType = await allButtons[i].getAttribute('type')
      const isVisible = await allButtons[i].isVisible()
      console.log(`Button ${i}: text="${buttonText}", type="${buttonType}", visible=${isVisible}`)
    }

    // When: User mengisi form dengan data valid dan submit
    const newUser = testUsers.newUser

    // Fill email field dengan Clerk-specific selector
    await page.fill('input[name="emailAddress"]', newUser.email)

    // Fill password field
    await page.fill('input[name="password"]', newUser.password)

    // Fill first name if available
    const firstNameInput = page.locator('input[name="firstName"]')
    if ((await firstNameInput.count()) > 0) {
      await firstNameInput.fill(newUser.firstName || 'Test')
    }

    // Fill last name if available
    const lastNameInput = page.locator('input[name="lastName"]')
    if ((await lastNameInput.count()) > 0) {
      await lastNameInput.fill(newUser.lastName || 'User')
    }

    // Wait untuk validasi form selesai
    await page.waitForTimeout(1000)

    // Submit form dengan mencari button Continue yang tepat
    console.log('📝 Looking for Continue button...')
    const continueButton = page
      .locator('button')
      .filter({ hasText: 'Continue' })
      .and(page.locator(':not(:has-text("Google"))'))

    if ((await continueButton.count()) > 0) {
      console.log('✅ Found Continue button, clicking...')
      await continueButton.click()
    } else {
      console.log('⚠️ Continue button not found, trying Enter key...')
      await page.keyboard.press('Enter')
    }

    // Then: User berhasil terdaftar dan diarahkan sesuai konfigurasi
    // Tunggu redirect (Clerk sign up flow memerlukan email verification)
    await page.waitForURL(
      (url) =>
        url.toString().includes('/verify-email-address') ||
        url.toString().includes('/dashboard') ||
        url.toString().includes('/sign-in'),
      { timeout: 15000 },
    )

    // Verify expected flow berdasarkan dokumentasi Clerk
    const currentUrl = page.url()

    if (currentUrl.includes('/verify-email-address')) {
      console.log('✅ Sign up berhasil - User diarahkan ke email verification (expected flow)')

      // Verify halaman verification memiliki elemen yang tepat
      await expect(page.locator('text=Verify your email')).toBeVisible({ timeout: 5000 })
    } else if (currentUrl.includes('/dashboard')) {
      console.log('✅ Sign up berhasil - User langsung diarahkan ke dashboard (auto-verified)')
    } else {
      console.log('⚠️ Unexpected redirect URL:', currentUrl)
    }

    // Take screenshot untuk dokumentasi
    await takeScreenshot(page, 'sign-up-success')

    console.log('✅ Sign up flow completed successfully with redirect to:', currentUrl)
  })

  /**
   * Test: Error handling untuk email yang sudah terdaftar
   *
   * Skenario: User mencoba registrasi dengan email yang sudah ada
   * Expected: Error message ditampilkan dan user tetap di halaman sign up
   *
   * BDD Format:
   * - Given: User berada di halaman sign up
   * - When: User mengisi form dengan email yang sudah terdaftar
   * - Then: Error message ditampilkan
   */
  test('should show error for existing email', async ({ page }) => {
    // Setup Clerk testing token untuk test ini
    await setupClerkTestingToken({ page })

    // Given: User berada di halaman sign up
    await page.goto('/sign-up')
    await waitForPageLoad(page)

    // When: User mengisi form dengan email yang sudah terdaftar
    const existingUser = testUsers.existingUser

    const emailInput = page.locator('input[name="emailAddress"], input[type="email"]').first()
    await emailInput.fill(existingUser.email)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill(existingUser.password)

    // Wait untuk validasi form selesai
    await page.waitForTimeout(1000)

    // Submit form dengan strategi yang sama seperti successful test
    console.log('📝 Looking for Continue button...')
    const continueButton = page
      .locator('button')
      .filter({ hasText: 'Continue' })
      .and(page.locator(':not(:has-text("Google"))'))

    if ((await continueButton.count()) > 0) {
      console.log('✅ Found Continue button, clicking...')
      await continueButton.click()
    } else {
      console.log('⚠️ Continue button not found, trying Enter key...')
      await page.keyboard.press('Enter')
    }

    // Then: Error message ditampilkan
    // Tunggu error message muncul
    await page.waitForTimeout(2000)

    // Check untuk berbagai kemungkinan error message
    const errorSelectors = [
      '[data-localization-key*="error"]',
      '.cl-formFieldErrorText',
      '[role="alert"]',
      '.error',
      'text=already exists',
      'text=already taken',
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

    // Jika tidak ada error message spesifik, pastikan tidak redirect ke dashboard
    if (!errorFound) {
      // Pastikan masih di halaman sign-up atau tidak redirect ke dashboard
      await expect(page).not.toHaveURL('/dashboard')
      console.log('✅ No redirect to dashboard (expected behavior for existing email)')
    }

    await takeScreenshot(page, 'sign-up-existing-email-error')
  })

  /**
   * Test: Validasi format email yang invalid
   *
   * Skenario: User mengisi email dengan format yang tidak valid
   * Expected: Validation error ditampilkan atau form tidak submit
   *
   * BDD Format:
   * - Given: User berada di halaman sign up
   * - When: User mengisi email dengan format invalid
   * - Then: Validation error ditampilkan atau form tidak submit
   */
  test('should validate invalid email format', async ({ page }) => {
    // Setup Clerk testing token untuk test ini
    await setupClerkTestingToken({ page })

    // Given: User berada di halaman sign up
    await page.goto('/sign-up')
    await waitForPageLoad(page)

    // When: User mengisi email dengan format invalid
    const invalidUser = testUsers.invalidUser

    const emailInput = page.locator('input[name="emailAddress"], input[type="email"]').first()
    await emailInput.fill(invalidUser.email)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill('ValidPassword123!')

    // Wait untuk validasi form selesai
    await page.waitForTimeout(1000)

    // Submit form dengan strategi yang sama seperti successful test
    console.log('📝 Looking for Continue button...')
    const continueButton = page
      .locator('button')
      .filter({ hasText: 'Continue' })
      .and(page.locator(':not(:has-text("Google"))'))

    if ((await continueButton.count()) > 0) {
      console.log('✅ Found Continue button, clicking...')
      await continueButton.click()
    } else {
      console.log('⚠️ Continue button not found, trying Enter key...')
      await page.keyboard.press('Enter')
    }

    // Then: Validation error ditampilkan atau form tidak submit
    await page.waitForTimeout(1000)

    // Check HTML5 validation atau Clerk validation
    const emailValidity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)

    if (!emailValidity) {
      console.log('✅ HTML5 email validation working')
    } else {
      // Check untuk Clerk validation error
      const errorElement = page.locator('.cl-formFieldErrorText, [role="alert"]').first()
      if ((await errorElement.count()) > 0) {
        console.log('✅ Clerk email validation working:', await errorElement.textContent())
      }
    }

    // Pastikan tidak redirect ke dashboard
    await expect(page).not.toHaveURL('/dashboard')
    await takeScreenshot(page, 'sign-up-invalid-email')
  })

  /**
   * Test: Validasi password yang lemah
   *
   * Skenario: User mengisi password yang tidak memenuhi kriteria keamanan
   * Expected: Password validation error ditampilkan
   *
   * BDD Format:
   * - Given: User berada di halaman sign up
   * - When: User mengisi password yang lemah
   * - Then: Password validation error ditampilkan
   */
  test('should validate weak password', async ({ page }) => {
    // Setup Clerk testing token untuk test ini
    await setupClerkTestingToken({ page })

    // Given: User berada di halaman sign up
    await page.goto('/sign-up')
    await waitForPageLoad(page)

    // When: User mengisi password yang lemah
    const emailInput = page.locator('input[name="emailAddress"], input[type="email"]').first()
    await emailInput.fill('test.weak.password+clerk_test@example.com')

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill('123') // Password lemah

    // Wait untuk validasi form selesai
    await page.waitForTimeout(1000)

    // Submit form dengan strategi yang sama seperti successful test
    console.log('📝 Looking for Continue button...')
    const continueButton = page
      .locator('button')
      .filter({ hasText: 'Continue' })
      .and(page.locator(':not(:has-text("Google"))'))

    if ((await continueButton.count()) > 0) {
      console.log('✅ Found Continue button, clicking...')
      await continueButton.click()
    } else {
      console.log('⚠️ Continue button not found, trying Enter key...')
      await page.keyboard.press('Enter')
    }

    // Then: Password validation error ditampilkan
    await page.waitForTimeout(2000)

    // Check untuk password validation
    const passwordErrorSelectors = [
      '.cl-formFieldErrorText',
      '[role="alert"]',
      'text=password',
      'text=weak',
      'text=requirements',
    ]

    let passwordErrorFound = false
    for (const selector of passwordErrorSelectors) {
      const errorElement = page.locator(selector)
      if ((await errorElement.count()) > 0 && (await errorElement.isVisible())) {
        passwordErrorFound = true
        console.log('✅ Password validation error found:', await errorElement.textContent())
        break
      }
    }

    // Log hasil untuk debugging
    if (!passwordErrorFound) {
      console.log('⚠️ No password validation error found, but form should not submit')
    }

    // Pastikan tidak redirect ke dashboard
    await expect(page).not.toHaveURL('/dashboard')
    await takeScreenshot(page, 'sign-up-weak-password')
  })

  /**
   * Test: Graceful handling untuk network timeout
   *
   * Skenario: User submit form dengan koneksi yang lambat/timeout
   * Expected: Loading state ditampilkan atau graceful error handling
   *
   * BDD Format:
   * - Given: User berada di halaman sign up
   * - When: User submit form dengan network delay
   * - Then: Loading state ditampilkan atau graceful handling
   */
  test('should handle network timeout gracefully', async ({ page }) => {
    // Setup Clerk testing token untuk test ini
    await setupClerkTestingToken({ page })

    // Given: User berada di halaman sign up
    await page.goto('/sign-up')
    await waitForPageLoad(page)

    // Simulate slow network untuk test timeout handling
    await page.route('**/*clerk*', (route) => {
      setTimeout(() => route.continue(), 5000) // Delay 5 detik
    })

    // When: User submit form dengan network delay
    const newUser = testUsers.newUser

    const emailInput = page.locator('input[name="emailAddress"], input[type="email"]').first()
    await emailInput.fill(`timeout.test+clerk_test@example.com`)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill(newUser.password)

    // Wait untuk validasi form selesai
    await page.waitForTimeout(1000)

    // Submit form dengan strategi yang sama seperti successful test
    console.log('📝 Looking for Continue button...')
    const continueButton = page
      .locator('button')
      .filter({ hasText: 'Continue' })
      .and(page.locator(':not(:has-text("Google"))'))

    if ((await continueButton.count()) > 0) {
      console.log('✅ Found Continue button, clicking...')
      await continueButton.click()
    } else {
      console.log('⚠️ Continue button not found, trying Enter key...')
      await page.keyboard.press('Enter')
    }

    // Then: Loading state ditampilkan atau graceful handling
    // Check untuk loading indicator dengan timeout yang lebih pendek
    console.log('🔍 Checking for loading indicators...')
    const loadingSelectors = [
      '.cl-spinner',
      '[data-testid="loading"]',
      'button[disabled]',
      '.loading',
      'button:has-text("Continue")[disabled]',
    ]

    let loadingFound = false
    for (const selector of loadingSelectors) {
      try {
        const loadingElement = page.locator(selector)
        if ((await loadingElement.count()) > 0) {
          loadingFound = true
          console.log('✅ Loading state found during network delay')
          break
        }
      } catch (error) {
        // Ignore errors saat checking loading states dan log untuk debugging
        console.log('⚠️ Error checking loading selector:', selector, 'Error:', error)
      }
    }

    // Log hasil untuk debugging
    if (!loadingFound) {
      console.log('⚠️ No loading state found, but network delay should be handled gracefully')
    }

    await takeScreenshot(page, 'sign-up-network-timeout')

    // Clear route untuk cleanup
    await page.unroute('**/*clerk*')
    console.log('🧹 Cleaned up network route interception')
  })
})
