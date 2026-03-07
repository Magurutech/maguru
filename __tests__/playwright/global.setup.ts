/**
 * Global Setup for Playwright with Clerk Integration
 *
 * This file runs once before all tests to initialize Clerk testing tokens.
 * It uses clerkSetup() from @clerk/testing/playwright to obtain a testing
 * token that will be available for all subsequent tests.
 *
 * References:
 * - https://clerk.com/docs/guides/development/testing/playwright/overview
 * - https://clerk.com/docs/guides/development/testing/playwright/test-authenticated-flows
 *
 * CRITICAL: This must run in serial mode to ensure testing token is obtained
 * before any parallel tests start executing.
 */

import { clerkSetup } from '@clerk/testing/playwright'
import { test as setup } from '@playwright/test'
import dotenv from 'dotenv'

// Load .env.test untuk memastikan environment variables tersedia
dotenv.config({ path: '.env.test' })

// Setup must be run serially, this is necessary if Playwright is configured to run fully parallel
// See: https://playwright.dev/docs/test-parallel
setup.describe.configure({ mode: 'serial' })

setup('global setup', async ({ }) => {
  console.log('🔐 Setting up Clerk testing token...')

  // Verify environment variables loaded
  const requiredVars = ['E2E_CLERK_USER_USERNAME', 'E2E_CLERK_USER_PASSWORD', 'E2E_CLERK_USER_EMAIL']
  const missingVars = requiredVars.filter(v => !process.env[v])
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars.join(', '))
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  console.log('✅ Environment variables loaded successfully')

  // Initialize Clerk testing token
  // This obtains a testing token from Clerk's Backend API and makes it available
  // for all subsequent tests to use via setupClerkTestingToken()
  await clerkSetup()

  console.log('✅ Clerk testing token initialized successfully')
})
