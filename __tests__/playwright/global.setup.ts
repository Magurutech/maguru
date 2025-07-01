/**
 * Global Setup untuk Playwright E2E Testing dengan Clerk Authentication State
 *
 * Setup ini mengikuti dokumentasi resmi Clerk Test Authenticated Flows:
 * 1. Configure Playwright dengan Clerk menggunakan clerkSetup() (setup terpisah)
 * 2. Authenticate user dan save auth state ke storage file (setup terpisah)
 * 3. Auth state akan di-reuse oleh semua tests untuk performance
 *
 * Referensi:
 * - https://clerk.com/docs/testing/playwright/test-authenticated-flows
 * - https://clerk.com/docs/testing/playwright/overview
 * - https://clerk.com/docs/testing/playwright/test-helpers
 */

import { clerk, clerkSetup } from '@clerk/testing/playwright'
import { test as setup } from '@playwright/test'
import path from 'path'

// CRITICAL: Setup must be run serially sesuai dokumentasi Overview
// https://clerk.com/docs/testing/playwright/overview
setup.describe.configure({ mode: 'serial' })

// Setup 1: Configure Clerk ONLY - sesuai dokumentasi
setup('global setup', async () => {
  console.log('🎉  NODE_ENV:', process.env.NODE_ENV)
  await clerkSetup()
  if (
    !process.env.E2E_CLERK_USER_USERNAME ||
    !process.env.E2E_CLERK_USER_PASSWORD ||
    !process.env.E2E_CLERK_USER_EMAIL
  ) {
    throw new Error(
      'Please provide E2E_CLERK_USER_USERNAME, E2E_CLERK_USER_PASSWORD, and E2E_CLERK_USER_EMAIL environment variables in .env.test file.',
    )
  }
})
// Define the path to the storage file, which is `user.json`
// Path disesuaikan dengan struktur directory proyek kita
const authFile = path.join(__dirname, '.clerk/user.json')

// Setup 2: Authenticate dan save state - sesuai dokumentasi Test Authenticated Flows
setup('authenticate', async ({ page }) => {
  console.log('🔐 Authenticating user and saving state to storage...')
  console.log('  NODE_ENV:', process.env.NODE_ENV)

  // ✅ FIX: More detailed debugging
  console.log('- 🔍 Global Setup Environment variables values:')
  console.log('  E2E_CLERK_USER_USERNAME:', process.env.E2E_CLERK_USER_USERNAME)
  console.log('  E2E_CLERK_USER_EMAIL:', process.env.E2E_CLERK_USER_EMAIL)
  console.log('  E2E_CLERK_USER_PASSWORD:', process.env.E2E_CLERK_USER_PASSWORD)
  console.log('  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
  console.log('  CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY)
  console.log('  CLERK_TEST_MODE:', process.env.CLERK_TEST_MODE)

  // Navigate to unprotected page that loads Clerk - sesuai dokumentasi Test Helpers
  await page.goto('/')
  console.log('✅ Navigated to homepage')

  // Wait for Clerk to load - sesuai dokumentasi Test Helpers
  // await clerk.loaded({ page })
  // console.log('✅ Clerk loaded successfully')

  // Perform authentication - sesuai dokumentasi Test Helpers
  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  })
  console.log('✅ Sign in completed')

  // Navigate ke protected page untuk verify authentication berhasil
  await page.goto('/dashboard')
  console.log('✅ Navigated to protected page')

  // Ensure user berhasil access protected page
  await page.waitForSelector('main', { timeout: 10000 })
  console.log('✅ User successfully authenticated and accessed protected page')

  // Save authentication state - sesuai dokumentasi Test Authenticated Flows
  await page.context().storageState({ path: authFile })
  console.log('✅ Auth state saved to:', authFile)
  console.log('🎉 Authentication setup completed successfully!')
})
