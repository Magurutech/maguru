/**
 * Global Setup untuk Playwright E2E Testing
 *
 * Setup ini dijalankan sekali sebelum semua test untuk:
 * - Mengkonfigurasi Clerk testing environment sesuai docs
 * - Setup test users dan authentication
 * - Memastikan aplikasi dalam keadaan siap untuk testing
 *
 * Referensi: https://clerk.com/docs/testing/playwright/overview
 */

import { test as setup } from '@playwright/test'
import { clerkSetup } from '@clerk/testing/playwright'

setup.describe.configure({ mode: 'serial' })

setup('global setup', async ({}) => {
  console.log('🚀 Starting global setup for E2E tests...')

  try {
    // Setup Clerk testing environment sesuai dokumentasi
    // https://clerk.com/docs/testing/playwright/test-helpers
    await clerkSetup({
      frontendApiUrl: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API || 'https://clerk.maguru.test',
    })

    console.log('✅ Clerk testing environment configured')

    // Verify environment variables
    const requiredEnvVars = ['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY']

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.warn(`⚠️ Missing environment variable: ${envVar}`)
      } else {
        console.log(`✅ Environment variable ${envVar} is set`)
      }
    }

    console.log('✅ Global setup completed successfully')
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  }
})
