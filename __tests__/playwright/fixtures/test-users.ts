/**
 * Test User Fixtures untuk E2E Testing dengan Clerk
 *
 * Data test users yang digunakan untuk authentication dan authorization testing.
 * Menggunakan real user accounts yang sudah terdaftar di Clerk Dashboard sesuai dokumentasi resmi.
 *
 * Referensi:
 * - https://clerk.com/docs/testing/playwright/overview
 * - https://clerk.com/docs/testing/playwright/test-helpers
 * - https://clerk.com/docs/testing/playwright/test-authenticated-flows
 *
 * CRITICAL Setup Required:
 * 1. Create test user di Clerk Dashboard dengan email dan password authentication
 * 2. Enable email dan password dalam Authentication settings
 * 3. Verify bahwa test user dapat login manual di browser
 * 4. Set environment variables di .env.local dengan format yang EXACT
 */

export interface TestUser {
  identifier: string // username atau email sesuai Clerk config
  password: string
  firstName?: string
  lastName?: string
  role?: 'admin' | 'creator' | 'user'
  displayName?: string
}

// Real test users configuration sesuai demo repo Clerk
export const testUsers = {
  // Primary test user - sesuai demo repo format
  existingUser: {
    identifier: process.env.E2E_CLERK_USER_USERNAME!,
    password: process.env.E2E_CLERK_USER_PASSWORD!,
  },

  // Alternative users untuk testing berbagai scenarios (opsional)
  // Harus dibuat di Clerk Dashboard jika digunakan
  adminUser: {
    identifier: process.env.E2E_CLERK_ADMIN_USERNAME || 'admin@maguru.test',
    password: process.env.E2E_CLERK_ADMIN_PASSWORD || 'AdminPassword123!',
    role: 'admin' as const,
    displayName: 'Admin Test User',
  },
  creatorUser: {
    identifier: process.env.E2E_CLERK_CREATOR_USERNAME || 'creator@maguru.test',
    password: process.env.E2E_CLERK_CREATOR_PASSWORD || 'CreatorPassword123!',
    role: 'creator' as const,
    displayName: 'Creator Test User',
  },
  regularUser: {
    identifier: process.env.E2E_CLERK_USER_USERNAME!, // Same as existingUser
    password: process.env.E2E_CLERK_USER_PASSWORD!,
    role: 'user' as const,
    displayName: 'Regular Test User',
  },
}

// Clerk test configuration sesuai demo repo
export const clerkTestConfig = {
  // Environment variables yang diperlukan - sesuai demo repo
  requiredEnvVars: [
    'E2E_CLERK_USER_USERNAME',
    'E2E_CLERK_USER_PASSWORD',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
  ],

  // Strategy yang didukung
  supportedStrategies: [
    'password', // username/email + password
    'phone_code', // phone number + verification code (requires setup)
    'email_code', // email + verification code (requires setup)
  ],

  // Default strategy untuk testing
  defaultStrategy: 'password',
}

// Validation helper untuk memastikan environment variables tersedia
export function validateTestEnvironment(): { isValid: boolean; missingVars: string[] } {
  const missingVars = clerkTestConfig.requiredEnvVars.filter((envVar) => !process.env[envVar])

  return {
    isValid: missingVars.length === 0,
    missingVars,
  }
}
