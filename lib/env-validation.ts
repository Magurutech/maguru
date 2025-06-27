/**
 * Environment Variables Validation
 *
 * Sistem validasi untuk memastikan environment variables terkonfigurasi dengan benar
 * sesuai dengan Task TSK-36 dan kebutuhan aplikasi Maguru.
 */

import { z } from 'zod'

/**
 * Schema validasi untuk environment variables
 */
const envSchema = z.object({
  // Application Environment
  NODE_ENV: z.enum(['development', 'staging', 'production'], {
    errorMap: () => ({ message: 'NODE_ENV must be one of: development, staging, production' }),
  }),

  APP_ENV: z.enum(['dev', 'prod'], {
    errorMap: () => ({ message: 'APP_ENV must be one of: dev, prod' }),
  }),

  NEXT_PUBLIC_APP_URL: z.string().url({
    message: 'NEXT_PUBLIC_APP_URL must be a valid URL',
  }),

  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, {
    message: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required',
  }),

  CLERK_SECRET_KEY: z.string().min(1, {
    message: 'CLERK_SECRET_KEY is required',
  }),

  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),

  // Database
  DATABASE_URL: z.string().url({
    message: 'DATABASE_URL must be a valid database connection string',
  }),

  DIRECT_URL: z
    .string()
    .url({
      message: 'DIRECT_URL must be a valid database connection string',
    })
    .optional(),

  // Testing Configuration (optional)
  CLERK_TEST_MODE: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  CLERK_DISABLE_BOT_PROTECTION: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
})

/**
 * Type untuk validated environment variables
 */
export type ValidatedEnv = z.infer<typeof envSchema>

/**
 * Validasi environment variables
 */
export function validateEnv(): ValidatedEnv {
  try {
    const result = envSchema.parse(process.env)
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n')

      throw new Error(`Environment validation failed:\n${errorMessages}`)
    }
    throw error
  }
}

/**
 * Validasi environment variables dengan format yang user-friendly
 */
export function validateEnvSafe(): { success: boolean; data?: ValidatedEnv; error?: string } {
  try {
    const data = validateEnv()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    }
  }
}

/**
 * Helper untuk mengecek environment saat ini
 */
export function getCurrentEnvironment(): 'development' | 'production' {
  const nodeEnv = process.env.NODE_ENV
  if (nodeEnv === 'development' || nodeEnv === 'production') {
    return nodeEnv
  }
  return 'development'  
}

/**
 * Helper untuk mengecek apakah environment adalah development
 */
export function isDevelopment(): boolean {
  return getCurrentEnvironment() === 'development'
}

/**
 * Helper untuk mengecek apakah environment adalah production
 */
export function isProduction(): boolean {
  return getCurrentEnvironment() === 'production'
}


/**
 * Log environment configuration (development only)
 */
export function logEnvironmentInfo(): void {
  if (isDevelopment()) {
    const env = getCurrentEnvironment()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const hasClerkKeys = !!(
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
    )
    const hasDatabase = !!process.env.DATABASE_URL

    console.log('🌍 Environment Configuration:')
    console.log(`   Environment: ${env}`)
    console.log(`   App URL: ${appUrl}`)
    console.log(`   Clerk Keys: ${hasClerkKeys ? '✅' : '❌'}`)
    console.log(`   Database: ${hasDatabase ? '✅' : '❌'}`)

    if (process.env.CLERK_TEST_MODE === 'true') {
      console.log('   🧪 Test Mode: Enabled')
    }
  }
}
