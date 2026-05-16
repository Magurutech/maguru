/**
 * Authenticated Fixture
 * 
 * Provides auto-authenticated page for tests.
 * No need to manually login in each test.
 */

import { test as base } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { testUsers } from './test-users'

export type AuthenticatedFixtures = Record<string, never>

/**
 * Authenticated test fixture
 * 
 * Usage:
 * ```typescript
 * authenticatedTest('my test', async ({ page }) => {
 *   // Page is already logged in as creator
 *   await page.goto('/creator')
 * })
 * ```
 */
export const authenticatedTest = base.extend<AuthenticatedFixtures>({
  page: async ({ page }, use) => {
    // SETUP: Auto login as creator
    await page.goto('/')
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: testUsers.creatorUser.identifier,
        password: testUsers.creatorUser.password,
      },
    })

    // Wait for auth to complete - ensure cookies are set
    await page.waitForTimeout(1000)
    
    // Verify auth cookie exists
    const cookies = await page.context().cookies()
    const hasAuthCookie = cookies.some(c => c.name === '__session' || c.name.includes('clerk'))
    if (!hasAuthCookie) {
      console.warn('⚠️ No auth cookies found after login')
    }

    console.log('🔐 Auto-authenticated as creator')

    // USE: Provide authenticated page to test
    await use(page)

    // TEARDOWN: Nothing needed (Playwright handles page cleanup)
  },
})
