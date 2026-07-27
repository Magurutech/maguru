import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Authentication middleware untuk memverifikasi user session dan role
 *
 * @returns Object dengan user info atau error response
 */
export async function requireAuth() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        error: NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 },
        ),
      }
    }

    const role = (user.app_metadata?.role || user.user_metadata?.role || 'user') as string

    return {
      user: {
        id: user.id,
        email: user.email,
        role: role,
        clerkId: user.id,
      },
    }
  } catch (error) {
    console.error('Auth error:', error)
    return {
      error: NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 },
      ),
    }
  }
}

/**
 * Middleware untuk memverifikasi role spesifik (misal: 'creator' atau 'admin')
 *
 * @param allowedRoles - Array of roles yang diizinkan
 */
export async function requireRole(allowedRoles: string[]) {
  const authResult = await requireAuth()

  if (authResult.error) {
    return authResult
  }

  const { user } = authResult

  if (!allowedRoles.includes(user.role)) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 },
      ),
    }
  }

  return { user }
}
