/**
 * Global Setup untuk Playwright E2E Testing
 *
 * Setup ini dijalankan sekali sebelum semua test untuk:
 * - Mengkonfigurasi Clerk testing environment
 * - Setup test users dan authentication
 * - Memastikan aplikasi dalam keadaan siap untuk testing
 */

import { test as setup } from '@playwright/test'
import { clerkSetup } from '@clerk/testing/playwright'

setup.describe.configure({ mode: 'serial' })

setup('global setup', async ({}) => {
  console.log('🚀 Starting global setup for E2E tests...')

  // Setup Clerk testing environment
  await clerkSetup()

  console.log('✅ Global setup completed successfully')
})
