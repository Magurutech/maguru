/**
 * Middleware Authorization Utilities
 *
 * Utility functions untuk middleware otorisasi yang mendukung:
 * - Route pattern matching
 * - Role validation dengan hierarchy
 * - Redirect handling
 * - Development mode support
 */

import type { UserRole } from '../types'

/**
 * Route protection configuration
 */
export interface RouteProtection {
  pattern: string | string[]
  requiredRole: UserRole | UserRole[]
  allowBypass?: boolean // development only
  redirectTo?: string
  description?: string
}

/**
 * Role hierarchy definition
 * Higher number = higher privileges
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  creator: 2,
  admin: 3,
}

/**
 * Protected routes configuration - Updated for simplified app structure
 * /dashboard = user area (default)
 * /admin/* = admin area
 * /creator/* = creator area
 */
export const PROTECTED_ROUTES: Record<string, RouteProtection> = {
  // Admin-only routes - /admin/*
  adminRoutes: {
    pattern: ['/admin', '/admin/(.*)'],
    requiredRole: 'admin',
    redirectTo: '/unauthorized',
    description: 'Admin control panel dan management tools',
  },

  // Creator routes - /creator/* (accessible by creator and admin)
  creatorRoutes: {
    pattern: ['/creator', '/creator/(.*)'],
    requiredRole: ['admin', 'creator'],
    redirectTo: '/unauthorized',
    description: 'Creator studio dan content management',
  },

  // User dashboard - /dashboard (accessible by all authenticated users)
  userDashboard: {
    pattern: ['/dashboard'],
    requiredRole: ['admin', 'creator', 'user'],
    redirectTo: '/sign-in',
    description: 'User dashboard utama',
  },

  // Additional protected areas that require authentication
  settings: {
    pattern: ['/settings', '/settings/(.*)'],
    requiredRole: ['admin', 'creator', 'user'],
    redirectTo: '/sign-in',
    description: 'User settings dan preferences',
  },

  profile: {
    pattern: ['/profile', '/profile/(.*)'],
    requiredRole: ['admin', 'creator', 'user'],
    redirectTo: '/sign-in',
    description: 'User profile management',
  },

  // Legacy routes compatibility (redirect to new structure)
  legacyUserDashboard: {
    pattern: ['/user/dashboard', '/user/(.*)'],
    requiredRole: ['admin', 'creator', 'user'],
    redirectTo: '/dashboard',
    description: 'Legacy user dashboard redirect',
  },

  legacyAdminDashboard: {
    pattern: ['/dashboard/admin', '/dashboard/admin/(.*)'],
    requiredRole: 'admin',
    redirectTo: '/admin/dashboard',
    description: 'Legacy admin dashboard redirect',
  },

  legacyContentDashboard: {
    pattern: ['/dashboard/content', '/dashboard/content/(.*)'],
    requiredRole: ['admin', 'creator'],
    redirectTo: '/creator/dashboard',
    description: 'Legacy content dashboard redirect',
  },
}

/**
 * Check if a route path matches any of the given patterns
 *
 * @param pathname - The pathname to check
 * @param patterns - Pattern or array of patterns to match against
 * @returns boolean indicating if path matches any pattern
 *
 * @example
 * ```typescript
 * isRouteMatch('/admin/dashboard', ['/admin', '/admin/(.*)'])
 * // Returns: true
 * ```
 */
export function isRouteMatch(pathname: string, patterns: string | string[]): boolean {
  const patternsArray = Array.isArray(patterns) ? patterns : [patterns]

  return patternsArray.some((pattern) => {
    // Convert pattern to regex
    // Replace :param with [^/]+ and (.*) with .*
    const regexPattern = pattern
      .replace(/:[^/]+/g, '[^/]+') // Named parameters
      .replace(/\(\.\*\)/g, '.*') // Wildcard
      .replace(/\*/g, '.*') // Simple wildcard

    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(pathname)
  })
}

/**
 * Find route protection config for a given pathname
 *
 * @param pathname - The pathname to check
 * @returns RouteProtection config if route is protected, null otherwise
 *
 * @example
 * ```typescript
 * const protection = findRouteProtection('/admin/dashboard')
 * // Returns: { pattern: [...], requiredRole: 'admin', ... }
 * ```
 */
export function findRouteProtection(pathname: string): RouteProtection | null {
  for (const protection of Object.values(PROTECTED_ROUTES)) {
    if (isRouteMatch(pathname, protection.pattern)) {
      return protection
    }
  }
  return null
}

/**
 * Check if user has sufficient role for access
 * Supports both single role and array of allowed roles
 *
 * @param userRole - Current user's role
 * @param requiredRole - Required role(s) for access
 * @returns boolean indicating if user has sufficient access
 *
 * @example
 * ```typescript
 * hasRequiredRole('creator', ['admin', 'creator'])  // Returns: true
 * hasRequiredRole('user', 'admin')                  // Returns: false
 * ```
 */
export function hasRequiredRole(
  userRole: UserRole | null,
  requiredRole: UserRole | UserRole[],
): boolean {
  if (!userRole) return false

  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

  // Check if user role is in the allowed roles list
  if (requiredRoles.includes(userRole)) {
    return true
  }

  // For single required role, check hierarchy
  if (!Array.isArray(requiredRole)) {
    const userLevel = ROLE_HIERARCHY[userRole]
    const requiredLevel = ROLE_HIERARCHY[requiredRole]
    return userLevel >= requiredLevel
  }

  return false
}

/**
 * Determine appropriate redirect URL based on context
 *
 * @param protection - Route protection config
 * @param userRole - Current user's role (null if no session)
 * @param pathname - Current pathname for context
 * @returns Redirect URL
 *
 * @example
 * ```typescript
 * getRedirectUrl(adminProtection, null, '/admin/dashboard')
 * // Returns: '/sign-in?redirect=/admin/dashboard'
 * ```
 */
export function getRedirectUrl(
  protection: RouteProtection,
  userRole: UserRole | null,
  pathname: string,
): string {
  // Handle legacy route redirects
  if (
    protection.redirectTo &&
    !protection.redirectTo.startsWith('/sign-in') &&
    !protection.redirectTo.startsWith('/unauthorized')
  ) {
    return protection.redirectTo
  }

  // If no session, redirect to sign-in with return URL
  if (!userRole) {
    const signInUrl = '/sign-in'
    const returnUrl = encodeURIComponent(pathname)
    return `${signInUrl}?redirect=${returnUrl}`
  }

  // Use configured redirect or default to unauthorized
  return protection.redirectTo || '/unauthorized'
}

/**
 * Development mode utilities - Edge Runtime compatible
 */
export const DevUtils = {
  /**
   * Check if development bypass is allowed
   */
  isDevelopmentBypassEnabled(): boolean {
    return (
      process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MIDDLEWARE_BYPASS === 'true'
    )
  },

  /**
   * Log middleware decision for debugging - Edge Runtime compatible
   * Uses simple console.log instead of console.group which is not available in Edge Runtime
   */
  logMiddlewareDecision(
    pathname: string,
    userRole: UserRole | null,
    protection: RouteProtection | null,
    decision: 'allow' | 'deny' | 'bypass',
  ): void {
    if (process.env.NODE_ENV === 'development') {
      // Use simple logging compatible with Edge Runtime
      console.log(
        `🛡️ [Middleware] ${pathname} | Role: ${userRole || 'No session'} | Decision: ${decision.toUpperCase()}`,
      )
      if (protection) {
        console.log(
          `   Protection: ${protection.description || 'Unknown'} | Required: ${Array.isArray(protection.requiredRole) ? protection.requiredRole.join(', ') : protection.requiredRole}`,
        )
      } else {
        console.log('   Protection: Public route')
      }
      if (decision === 'bypass') {
        console.log('   ⚠️ Development bypass enabled')
      }
    }
  },

  /**
   * Get development info for debugging
   */
  getDebugInfo(pathname: string) {
    const protection = findRouteProtection(pathname)
    return {
      pathname,
      isProtected: !!protection,
      protection,
      allRoutes: Object.keys(PROTECTED_ROUTES),
      bypassEnabled: this.isDevelopmentBypassEnabled(),
    }
  },
}

/**
 * Validation utilities
 */
export const ValidationUtils = {
  /**
   * Validate if role is a valid UserRole
   */
  isValidRole(role: unknown): role is UserRole {
    return typeof role === 'string' && ['admin', 'creator', 'user'].includes(role)
  },

  /**
   * Sanitize pathname for security
   */
  sanitizePathname(pathname: string): string {
    // Remove query params and hash
    const cleaned = pathname.split('?')[0].split('#')[0]

    // Normalize path (remove double slashes, etc.)
    return cleaned.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  },

  /**
   * Check if URL is safe for redirect (for client-side usage only)
   */
  isSafeRedirectUrl(url: string): boolean {
    try {
      // Only allow relative URLs or same origin
      if (url.startsWith('/')) return true

      // Note: window is not available in Edge Runtime, so this is for client-side only
      if (typeof window !== 'undefined') {
        const urlObj = new URL(url)
        return urlObj.origin === window.location.origin
      }

      return false
    } catch {
      return false
    }
  },
}

/**
 * Type guards
 */
export function isRouteProtection(obj: unknown): obj is RouteProtection {
  return typeof obj === 'object' && obj !== null && 'pattern' in obj && 'requiredRole' in obj
}

/**
 * Export types untuk external usage
 */
export { type UserRole } from '../types'
