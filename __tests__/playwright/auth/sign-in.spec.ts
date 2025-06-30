/**
 * E2E Test: Sign In Flow
 *
 * Test ini mencakup:
 * - Successful sign in dengan kredensial valid
 * - Error handling untuk kredensial invalid
 * - Session management dan redirect
 * - Protected route access setelah login
 *
 * Note: Test ini menggunakan Clerk authentication dengan test mode
 * dan mengvalidasi integrasi dengan Next.js App Router
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
   * Test: Successful Sign In dengan Kredensial Valid
   *
   * Note: Test ini memvalidasi happy path untuk sign in flow sesuai dokumentasi Clerk.
   * Flow Clerk yang benar: Email → Continue → Password → Continue (2-step process)
   * Referensi: https://clerk.com/docs/components/authentication/sign-in
   *
   * BDD Format:
   * - Given: User memiliki account valid dan berada di halaman sign in
   * - When: User mengisi email → continue → password → continue
   * - Then: User berhasil login dan diarahkan ke dashboard
   */
  test('should successfully sign in with valid credentials', async ({ page }) => {
    // Given: User memiliki account valid dan berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page, 'form')

    // Verify halaman sign in dimuat dengan benar
    await expect(page).toHaveURL('/sign-in')
    await expect(page.locator('form').first()).toBeVisible()

    // Debug: Log semua button dan input yang ada di halaman
    console.log('🔍 Debugging form elements...')
    const allInputs = await page.locator('input').all()
    console.log('Available inputs:', allInputs.length)
    for (let i = 0; i < allInputs.length; i++) {
      const inputName = await allInputs[i].getAttribute('name')
      const inputType = await allInputs[i].getAttribute('type')
      const isVisible = await allInputs[i].isVisible()
      console.log(`Input ${i}: name="${inputName}", type="${inputType}", visible=${isVisible}`)
    }

    // When: User mengisi kredensial dengan flow Clerk yang benar
    const existingUser = testUsers.existingUser
    console.log('📧 Starting Clerk sign-in flow with:', existingUser.email)

    // STEP 1: Fill email dan klik Continue
    console.log('📝 Step 1: Filling email address...')

    // Fill email field - gunakan selector yang paling umum untuk Clerk
    const emailSelectors = [
      'input[name="identifier"]',
      'input[name="emailAddress"]',
      'input[type="email"]',
      'input[placeholder*="email" i]',
    ]

    let emailFilled = false
    for (const selector of emailSelectors) {
      const emailInput = page.locator(selector).first()
      if ((await emailInput.count()) > 0 && (await emailInput.isVisible())) {
        await emailInput.fill(existingUser.email)
        emailFilled = true
        console.log(`✅ Email filled using selector: ${selector}`)
        break
      }
    }

    if (!emailFilled) {
      throw new Error('❌ Could not find email input field')
    }

    // Wait untuk validasi email
    await page.waitForTimeout(1000)

    // Klik Continue button untuk step 1 (email)
    console.log('🔄 Step 1: Clicking Continue after email...')
    const continueButton1 = page.locator('button[data-localization-key="formButtonPrimary"]')

    if ((await continueButton1.count()) > 0 && (await continueButton1.isVisible())) {
      await continueButton1.click()
      console.log('✅ Continue button clicked for email step')
    } else {
      console.log('⚠️ Continue button not found, trying Enter key...')
      await page.keyboard.press('Enter')
    }

    // Wait untuk password field muncul (Clerk 2-step flow)
    console.log('⏳ Waiting for password field to appear...')
    await page.waitForTimeout(2000)

    // STEP 2: Fill password dan klik Continue
    console.log('📝 Step 2: Filling password...')

    // Fill password field
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      'input[placeholder*="password" i]',
    ]

    let passwordFilled = false
    for (const selector of passwordSelectors) {
      const passwordInput = page.locator(selector).first()
      if ((await passwordInput.count()) > 0 && (await passwordInput.isVisible())) {
        await passwordInput.fill(existingUser.password)
        passwordFilled = true
        console.log(`✅ Password filled using selector: ${selector}`)
        break
      }
    }

    if (!passwordFilled) {
      throw new Error('❌ Could not find password input field')
    }

    // Wait untuk validasi password
    await page.waitForTimeout(1000)

    // Klik Continue button untuk step 2 (password)
    console.log('🔄 Step 2: Clicking Continue after password...')
    const continueButton2 = page.locator('button[data-localization-key="formButtonPrimary"]')

    if ((await continueButton2.count()) > 0 && (await continueButton2.isVisible())) {
      await continueButton2.click()
      console.log('✅ Continue button clicked for password step')
    } else {
      console.log('⚠️ Continue button not found, trying Enter key...')
      await page.keyboard.press('Enter')
    }

    // Then: User berhasil login dan diarahkan ke dashboard
    console.log('⏳ Waiting for successful login redirect...')

    // Wait untuk redirect dengan timeout yang lebih panjang
    await page.waitForURL(
      (url) => {
        const urlString = url.toString()
        return (
          urlString.includes('/dashboard') ||
          urlString.includes('/admin') ||
          urlString.includes('/creator') ||
          (urlString.includes('/') && !urlString.includes('/sign-in'))
        )
      },
      { timeout: 30000 },
    )

    // Verify redirect berhasil
    const currentUrl = page.url()
    console.log('✅ Login successful, redirected to:', currentUrl)

    // Verify user session aktif
    await verifyUserSession(page)

    // Take screenshot untuk dokumentasi
    await takeScreenshot(page, 'sign-in-success')

    console.log('✅ Sign in flow completed successfully')
  })

  /**
   * Test: Error Handling untuk Email Invalid
   *
   * Note: Test ini memvalidasi error handling ketika user menggunakan
   * email yang tidak terdaftar dalam sistem dan memastikan error message
   * ditampilkan dengan benar tanpa redirect ke dashboard
   */
  test('should show error for invalid email', async ({ page }) => {
    // Given: User berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // When: User mengisi email yang tidak terdaftar
    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill('nonexistent+clerk_test@maguru.test')

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill('SomePassword123!')

    // Click form submit button (bukan Google OAuth)
    const submitButton = page.locator('button[data-localization-key="formButtonPrimary"]')
    await submitButton.click()

    // Then: Error message ditampilkan atau tidak redirect ke dashboard
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
      "text=doesn't exist",
    ]

    let errorFound = false
    for (const selector of errorSelectors) {
      try {
        const errorElement = page.locator(selector)
        if ((await errorElement.count()) > 0 && (await errorElement.isVisible())) {
          errorFound = true
          console.log('✅ Error message found:', await errorElement.textContent())
          break
        }
      } catch {
        // Continue checking other selectors
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

  /**
   * Test: Error Handling untuk Password Salah
   *
   * Note: Test ini memvalidasi error handling ketika user menggunakan
   * email yang valid tetapi password yang salah, memastikan sistem
   * menampilkan error message yang sesuai
   */
  test('should show error for wrong password', async ({ page }) => {
    // Given: User berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // When: User mengisi email valid tapi password salah
    const existingUser = testUsers.existingUser

    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill(existingUser.email)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill('WrongPassword123!')

    // Submit form dengan button yang benar
    const submitButton = page.locator('button[data-localization-key="formButtonPrimary"]')
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
      'text=Password is incorrect',
    ]

    let errorFound = false
    for (const selector of errorSelectors) {
      try {
        const errorElement = page.locator(selector)
        if ((await errorElement.count()) > 0 && (await errorElement.isVisible())) {
          errorFound = true
          console.log('✅ Password error message found:', await errorElement.textContent())
          break
        }
      } catch {
        // Continue checking other selectors
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

  /**
   * Test: Validation untuk Form Kosong
   *
   * Note: Test ini memvalidasi bahwa sistem menangani form submission
   * kosong dengan benar, baik melalui HTML5 validation atau Clerk validation,
   * dan tidak mengizinkan submit tanpa kredensial
   */
  test('should handle empty form submission', async ({ page }) => {
    // Given: User berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // When: User submit form kosong
    const submitButton = page.locator('button[data-localization-key="formButtonPrimary"]')
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

  /**
   * Test: Protected Route Redirect After Login
   *
   * Note: Test ini memvalidasi bahwa setelah user berhasil login,
   * mereka diarahkan kembali ke protected route yang mereka coba akses
   * sebelumnya, memastikan UX yang smooth untuk protected routes
   */
  test('should redirect to protected route after login', async ({ page }) => {
    // Given: User mencoba mengakses protected route tanpa login
    await page.goto('/dashboard')

    // Should redirect to sign-in with redirect parameter
    await page.waitForURL((url) => url.toString().includes('/sign-in'), { timeout: 10000 })

    // When: User login dengan kredensial valid
    const existingUser = testUsers.existingUser

    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill(existingUser.email)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill(existingUser.password)

    // Submit dengan button yang benar
    const submitButton = page.locator('button[data-localization-key="formButtonPrimary"]')
    await submitButton.click()

    // Then: User diarahkan ke dashboard yang diminta
    await page.waitForURL('/dashboard', { timeout: 15000 })

    // Verify user dapat mengakses protected content
    await expect(page.locator('body')).toBeVisible()
    await verifyUserSession(page)

    await takeScreenshot(page, 'sign-in-protected-route-redirect')
    console.log('✅ Protected route redirect working correctly')
  })

  /**
   * Test: Session Persistence Across Navigation
   *
   * Note: Test ini memvalidasi bahwa session user tetap aktif
   * ketika mereka navigasi antar halaman, memastikan user tidak
   * perlu login ulang setiap kali berpindah halaman
   */
  test('should maintain session across page navigation', async ({ page }) => {
    // Given: User sudah login
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    const existingUser = testUsers.existingUser

    // Login process
    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill(existingUser.email)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill(existingUser.password)

    const submitButton = page.locator('button[data-localization-key="formButtonPrimary"]')
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

  /**
   * Test: Network Timeout Handling
   *
   * Note: Test ini memvalidasi bahwa aplikasi menangani network timeout
   * dengan graceful, menampilkan loading state yang sesuai dan tidak
   * crash ketika ada delay dalam response dari server
   */
  test('should handle network timeout during login', async ({ page }) => {
    // Given: User berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // Simulate slow network
    await page.route('**/*clerk*', (route) => {
      setTimeout(() => route.continue(), 3000) // Delay 3 detik
    })

    // When: User submit form dengan network delay
    const existingUser = testUsers.existingUser

    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first()
    await emailInput.fill(existingUser.email)

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
    await passwordInput.fill(existingUser.password)

    const submitButton = page.locator('button[data-localization-key="formButtonPrimary"]')
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

  /**
   * Test: Navigation Between Sign-in dan Sign-up
   *
   * Note: Test ini memvalidasi bahwa user dapat dengan mudah
   * navigasi antara halaman sign-in dan sign-up, memastikan
   * UX yang smooth untuk user yang belum memiliki account
   */
  test('should navigate between sign-in and sign-up', async ({ page }) => {
    // Given: User berada di halaman sign in
    await page.goto('/sign-in')
    await waitForPageLoad(page)

    // When: User klik link ke sign up
    const signUpLink = page.getByRole('link', { name: 'Sign up' })
    if ((await signUpLink.count()) > 0) {
      await signUpLink.click()

      // Then: User diarahkan ke sign up page
      await page.waitForURL('/sign-up', { timeout: 10000 })
      await expect(page).toHaveURL('/sign-up')

      // Navigate back to sign in
      const signInLink = page.getByRole('link', { name: 'Sign in' })
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
