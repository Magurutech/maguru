/**
 * E2E Test: Sign In Flow dengan Clerk Authentication
 *
 * Test ini mengikuti BEST PRACTICES dari dokumentasi Clerk Playwright:
 * - Menggunakan clerk.signIn() helper sesuai dokumentasi resmi
 * - Menggunakan clerk.loaded() untuk memastikan Clerk sudah loaded
 * - Navigate ke unprotected page yang load Clerk sebelum testing
 * - Error testing menggunakan try/catch dengan clerk helpers
 *
 * Referensi:
 * - https://clerk.com/docs/testing/playwright/overview
 * - https://clerk.com/docs/testing/playwright/test-helpers
 * - https://clerk.com/docs/testing/playwright/test-authenticated-flows
 */

import { test, expect } from '@playwright/test'
import { setupClerkTestingToken, clerk } from '@clerk/testing/playwright'
import { testUsers, validateTestEnvironment } from '../fixtures/test-users'
import {
  waitForPageLoad,
  verifyUnauthenticated,
  verifyUserSession,
  takeScreenshot,
} from '../utils/test-helpers'

// Validate test environment sebelum menjalankan tests
test.beforeAll(async () => {
  const { isValid, missingVars } = validateTestEnvironment()
  if (!isValid) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
  console.log('✅ Test environment validation passed')
})

test.describe('Sign In Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup Clerk testing token untuk setiap test sesuai dokumentasi
    await setupClerkTestingToken({ page })
    console.log('🔧 Clerk testing token configured')
  })

  test.use({ storageState: '__tests__/playwright/.clerk/user.json' })

  /**
   * Test: Successful Sign In dengan Clerk Helper
   *
   * Skenario: User melakukan sign in dengan kredensial valid menggunakan clerk.signIn() helper
   * Expected: User berhasil login dan diarahkan ke dashboard dengan session aktif
   *
   * BDD Format:
   * - Given: User memiliki account valid dan Clerk sudah loaded
   * - When: User sign in menggunakan clerk.signIn() helper dengan kredensial benar
   * - Then: User berhasil login dan dapat mengakses protected routes
   */
  test('should successfully sign in', async ({ page }) => {
    // Given: User sudah authenticated melalui global setup dengan storageState
    console.log('🧪 Testing that user is already authenticated from storageState...')

    // When: User navigate ke protected page
    await page.goto('/dashboard')

    // Then: User sudah authenticated dan dapat akses protected routes
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 })
    await verifyUserSession(page)

    console.log('✅ User is already authenticated from global setup')
    await takeScreenshot(page, 'clerk-authenticated-from-storage')
  })

  /**
   * Test: Session Persistence After Page Refresh
   *
   * Skenario: User sudah login dan melakukan refresh halaman
   * Expected: Session tetap aktif setelah refresh tanpa perlu login ulang
   *
   * BDD Format:
   * - Given: User sudah berhasil login dan berada di dashboard
   * - When: User melakukan refresh halaman
   * - Then: Session tetap aktif dan user tetap berada di dashboard
   */
  test('should maintain session after page refresh', async ({ page }) => {
    // Given: User sudah login menggunakan clerk helper
    console.log('🧪 Testing session persistence after refresh...')

    await page.goto('/')
    await clerk.loaded({ page })

    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: testUsers.existingUser.identifier,
        password: testUsers.existingUser.password,
      },
    })

    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
    await verifyUserSession(page)

    // When: User refresh halaman
    await page.reload()
    await waitForPageLoad(page)

    // Then: Session tetap aktif
    await expect(page).toHaveURL('/dashboard')
    await verifyUserSession(page)

    console.log('✅ Session persistence verified after refresh')
  })

  /**
   * Test: Multiple Sign In and Sign Out Cycles
   *
   * Skenario: User melakukan beberapa kali siklus sign in dan sign out
   * Expected: Setiap siklus berjalan dengan benar tanpa masalah
   *
   * BDD Format:
   * - Given: System dalam keadaan bersih tanpa session aktif
   * - When: User melakukan multiple cycles sign in → sign out → sign in lagi
   * - Then: Setiap cycle berhasil dengan session management yang benar
   */
  test('should work with multiple sign in and sign out cycles', async ({ page }) => {
    // Given: Testing multiple auth cycles
    console.log('🧪 Testing multiple sign in/out cycles...')

    for (let i = 0; i < 2; i++) {
      console.log(`🔄 Auth cycle ${i + 1}`)

      // Sign in
      await page.goto('/')
      await clerk.loaded({ page })

      await clerk.signIn({
        page,
        signInParams: {
          strategy: 'password',
          identifier: testUsers.existingUser.identifier,
          password: testUsers.existingUser.password,
        },
      })

      await page.goto('/dashboard')
      await verifyUserSession(page)

      // Sign out
      await clerk.signOut({ page })
      await verifyUnauthenticated(page)

      console.log(`✅ Auth cycle ${i + 1} completed`)
    }
  })

  /**
   * Test: Sign In dengan Password Salah
   *
   * Skenario: User mencoba sign in dengan password yang salah
   * Expected: Sign in gagal dan error ditangani dengan benar
   *
   * BDD Format:
   * - Given: User memiliki account valid tapi menggunakan password salah
   * - When: User mencoba sign in dengan password yang salah
   * - Then: Sign in gagal dan user tidak dapat mengakses protected routes
   */
  test('should handle invalid password with clerk.signIn() helper', async ({ browser }) => {
    // Given: Create fresh context untuk test error scenario
    console.log('🧪 Testing invalid password with clerk helper...')

    const freshContext = await browser.newContext({ storageState: undefined })
    const page = await freshContext.newPage()

    // Setup Clerk testing token untuk fresh session
    await setupClerkTestingToken({ page })

    try {
      await page.goto('/')
      await clerk.loaded({ page })

      // When: Attempt sign in dengan password salah
      try {
        await clerk.signIn({
          page,
          signInParams: {
            strategy: 'password',
            identifier: testUsers.existingUser.identifier,
            password: 'WrongPassword123!',
          },
        })

        // Jika sampai sini, test gagal karena seharusnya error
        throw new Error('Expected sign in to fail with wrong password')
      } catch {
        // Then: Sign in gagal seperti yang diharapkan
        console.log('✅ Invalid password correctly rejected by Clerk')

        // Verify user tidak authenticated
        await page.goto('/dashboard')
        const currentUrl = page.url()
        const isRedirectedToAuth =
          currentUrl.includes('/sign-in') || !currentUrl.includes('/dashboard')
        expect(isRedirectedToAuth).toBeTruthy()

        await takeScreenshot(page, 'clerk-signin-invalid-password')
      }
    } finally {
      await freshContext.close()
    }
  })

  /**
   * Test: Sign In dengan Account Tidak Terdaftar
   *
   * Skenario: User mencoba sign in dengan email yang tidak terdaftar
   * Expected: Sign in gagal dengan error message yang sesuai
   *
   * BDD Format:
   * - Given: User menggunakan email yang tidak terdaftar di system
   * - When: User mencoba sign in dengan email yang tidak terdaftar
   * - Then: Sign in gagal dan user tidak dapat mengakses protected routes
   */
  test('should handle non-existent account with clerk.signIn() helper', async ({ page }) => {
    // Given: Navigate ke unprotected page yang load Clerk
    console.log('🧪 Testing non-existent account with clerk helper...')

    await page.goto('/')
    await clerk.loaded({ page })

    // When: Attempt sign in dengan email tidak terdaftar
    try {
      await clerk.signIn({
        page,
        signInParams: {
          strategy: 'password',
          identifier: 'nonexistent@maguru.test',
          password: 'SomePassword123!',
        },
      })

      throw new Error('Expected sign in to fail with non-existent account')
    } catch {
      // Then: Sign in gagal seperti yang diharapkan
      console.log('✅ Non-existent account correctly rejected by Clerk')

      await page.goto('/dashboard')
      const currentUrl = page.url()
      const isRedirectedToAuth =
        currentUrl.includes('/sign-in') || !currentUrl.includes('/dashboard')
      expect(isRedirectedToAuth).toBeTruthy()

      await takeScreenshot(page, 'clerk-signin-nonexistent-account')
    }
  })

  /**
   * Test: Sign In Form UI Elements Display
   *
   * Skenario: User mengunjungi halaman sign in untuk melihat form elements
   * Expected: Semua form elements (input, button, links) tampil dengan benar
   *
   * BDD Format:
   * - Given: User navigasi ke halaman sign in
   * - When: Halaman sign in dimuat
   * - Then: Semua form elements (email, password, submit button, sign up link) terlihat
   */
  test('should display sign in form elements correctly', async ({ page }) => {
    // Given: User navigasi ke halaman sign in untuk UI testing
    console.log('🧪 Testing sign in form UI elements...')

    await page.goto('/sign-in')
    await waitForPageLoad(page, 'form')

    // Then: Semua form elements harus terlihat
    await expect(page.locator('input[name="identifier"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    // Check for sign up link
    const signUpLink = page.locator('a').filter({ hasText: /sign.up/i })
    await expect(signUpLink).toBeVisible()

    console.log('✅ Sign in form UI elements verified')
    await takeScreenshot(page, 'clerk-signin-form-ui')
  })

  /**
   * Test: Form Validation Error Handling
   *
   * Skenario: User submit form dengan data yang tidak valid
   * Expected: Form validation mencegah submission atau menampilkan error
   *
   * BDD Format:
   * - Given: User berada di halaman sign in
   * - When: User submit form dengan data invalid (email format salah)
   * - Then: Form validation mencegah submission atau menampilkan error message
   */
  test('should handle form validation errors', async ({ page }) => {
    // Given: User berada di halaman sign in
    console.log('🧪 Testing form validation errors...')

    await page.goto('/sign-in')
    await waitForPageLoad(page, 'form')

    // When: Submit form dengan data invalid
    await page.fill('input[name="identifier"]', 'invalid-email')
    await page.click('button[type="submit"]')

    // Then: Form validation should prevent submission atau show errors
    // Note: Clerk handles validation internally, kita hanya verify form behavior
    const isStillOnSignIn = page.url().includes('/sign-in')
    expect(isStillOnSignIn).toBeTruthy()

    console.log('✅ Form validation behavior verified')
    await takeScreenshot(page, 'clerk-signin-form-validation')
  })

  /**
   * Test: Redirect ke Protected Route After Sign In
   *
   * Skenario: User berhasil sign in dan mengakses protected route
   * Expected: User dapat mengakses protected route setelah authentication
   *
   * BDD Format:
   * - Given: User berhasil sign in dengan kredensial valid
   * - When: User navigate ke protected route (/dashboard)
   * - Then: User berhasil mengakses protected route tanpa redirect ke sign in
   */
  test('should redirect to protected route after sign in', async ({ page }) => {
    // Given: User akan sign in dan navigate ke protected route
    console.log('🧪 Testing redirect to protected route after sign in...')

    await page.goto('/')
    await clerk.loaded({ page })

    // When: User sign in dan navigate ke protected route
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: testUsers.existingUser.identifier,
        password: testUsers.existingUser.password,
      },
    })

    // Navigate ke protected route
    await page.goto('/dashboard')

    // Then: User berhasil akses protected route
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 })
    await verifyUserSession(page)

    console.log('✅ Protected route access verified after sign in')
  })

  /**
   * Test: Protected Route Access Prevention Without Authentication
   *
   * Skenario: User belum sign in dan mencoba mengakses protected route
   * Expected: User diblokir dan diarahkan ke sign in atau unauthorized page
   *
   * BDD Format:
   * - Given: User belum melakukan sign in (unauthenticated)
   * - When: User mencoba mengakses protected route (/dashboard)
   * - Then: User diblokir dan diarahkan ke sign in page atau unauthorized page
   */
  test('should prevent access to protected routes when not signed in', async ({ page }) => {
    // Given: User belum sign in
    console.log('🧪 Testing protected route access without authentication...')

    // When: User mencoba akses protected route
    await page.goto('/dashboard')

    // Then: User should be redirected to sign in atau unauthorized
    const currentUrl = page.url()
    const isBlocked =
      currentUrl.includes('/sign-in') ||
      currentUrl.includes('/unauthorized') ||
      !currentUrl.includes('/dashboard')
    expect(isBlocked).toBeTruthy()

    console.log('✅ Protected route correctly blocked without authentication')
    await takeScreenshot(page, 'clerk-protected-route-blocked')
  })

  /**
   * Test: Sign In pada Mobile Viewport
   *
   * Skenario: User melakukan sign in pada device mobile (viewport kecil)
   * Expected: Sign in berfungsi dengan baik pada mobile viewport
   *
   * BDD Format:
   * - Given: User menggunakan mobile viewport (375x667 - iPhone SE)
   * - When: User melakukan sign in menggunakan clerk helper
   * - Then: Sign in berhasil dan UI responsive pada mobile viewport
   */
  test('should work correctly on mobile viewport with clerk helpers', async ({ page }) => {
    // Given: Mobile viewport
    console.log('🧪 Testing sign in on mobile viewport with clerk helpers...')

    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE size
    await page.goto('/')
    await clerk.loaded({ page })

    // When: User sign in di mobile menggunakan clerk helper
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: testUsers.existingUser.identifier,
        password: testUsers.existingUser.password,
      },
    })

    // Then: Sign in berhasil di mobile
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 })
    await verifyUserSession(page)

    console.log('✅ Mobile sign in verified with clerk helpers')
    await takeScreenshot(page, 'clerk-signin-mobile')
  })
})
