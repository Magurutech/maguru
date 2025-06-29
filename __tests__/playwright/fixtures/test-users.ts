/**
 * Test User Fixtures untuk E2E Testing
 *
 * Data test users yang digunakan untuk authentication dan authorization testing.
 * Menggunakan format email Clerk test mode untuk bypass verification.
 */

export interface TestUser {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role?: 'admin' | 'creator' | 'user'
  displayName?: string
}

export const testUsers = {
  // Authentication test users
  newUser: {
    email: 'newuser+clerk_test@maguru.test',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
  },
  existingUser: {
    email: 'existing+clerk_test@maguru.test',
    password: 'ExistingPassword123!',
  },
  invalidUser: {
    email: 'invalid-email',
    password: '123',
  },

  // Role-based test users (untuk authorization testing)
  adminUser: {
    email: 'admin+clerk_test@maguru.test',
    password: 'AdminPassword123!',
    role: 'admin' as const,
    displayName: 'Admin Test User',
  },
  creatorUser: {
    email: 'creator+clerk_test@maguru.test',
    password: 'CreatorPassword123!',
    role: 'creator' as const,
    displayName: 'Creator Test User',
  },
  regularUser: {
    email: 'user+clerk_test@maguru.test',
    password: 'UserPassword123!',
    role: 'user' as const,
    displayName: 'Regular Test User',
  },
}

// Clerk test mode configuration
export const clerkTestConfig = {
  testMode: true,
  verificationCode: '424242', // Fixed verification code untuk test mode
  testEmailSuffix: '+clerk_test',
}
