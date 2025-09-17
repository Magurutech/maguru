/**
 * useUserRole Hook
 *
 * Custom hook untuk mengakses dan mengelola user role
 * dengan helper functions dan type safety
 */

import { useMemo } from 'react'
import { useUserRoleContext } from '../context/UserRoleContext'
import type { UseUserRoleReturn, UserRole } from '../types'

/**
 * Main hook untuk role management
 * Provides comprehensive role state dan helper functions
 *
 * @returns UseUserRoleReturn - Complete role state dengan computed helpers
 *
 * @example
 * ```tsx
 * const { role, isAdmin, isLoading, refreshRole } = useUserRole();
 *
 * if (isLoading) return <Spinner />;
 * if (isAdmin) return <AdminPanel />;
 * ```
 */
export function useUserRole(): UseUserRoleReturn {
  const context = useUserRoleContext()

  /**
   * Helper computed values untuk role checking
   * Memoized untuk performance optimization
   */
  const helpers = useMemo(
    () => ({
      isAdmin: context.role === 'admin',
      isCreator: context.role === 'creator',
      isUser: context.role === 'user',
      hasRole: (role: UserRole) => context.role === role,
    }),
    [context.role],
  )

  return {
    ...context,
    ...helpers,
  }
}

/**
 * Hook untuk role guards dengan kondisi spesifik
 * Provides permission checking functions dengan role hierarchy
 *
 * @returns Object dengan berbagai permission checking functions
 *
 * @example
 * ```tsx
 * const { canAccessAdmin, hasMinimumRole, canEditUser } = useRoleGuard();
 *
 * if (canAccessAdmin()) {
 *   return <AdminSection />;
 * }
 * ```
 */
function useRoleGuard() {
  const { role } = useUserRole()

  return useMemo(
    () => ({
      // Basic role checks
      canAccessAdmin: () => role === 'admin',
      canAccessCreator: () => role === 'admin' || role === 'creator',
      canAccessUser: () => role !== null,

      // Permission-based checks
      canManageUsers: () => role === 'admin',
      canCreateContent: () => role === 'admin' || role === 'creator',
      canViewContent: () => role !== null,
      canEditOwnContent: () => role === 'admin' || role === 'creator',
      canDeleteContent: () => role === 'admin',

      // Feature-specific checks
      canAccessDashboard: () => role === 'admin' || role === 'creator',
      canAccessAnalytics: () => role === 'admin',
      canManageSettings: () => role === 'admin',
      canInviteUsers: () => role === 'admin',
      canModerateContent: () => role === 'admin' || role === 'creator',

      // Utility functions
      hasMinimumRole: (minimumRole: UserRole) => {
        const roleHierarchy = { user: 1, creator: 2, admin: 3 }
        const currentRoleLevel = role ? roleHierarchy[role] : 0
        const requiredLevel = roleHierarchy[minimumRole]
        return currentRoleLevel >= requiredLevel
      },

      hasExactRole: (targetRole: UserRole) => role === targetRole,

      hasAnyRole: (targetRoles: UserRole[]) => role !== null && targetRoles.includes(role),

      // Context-aware guards
      canEditUser: (targetUserId: string, currentUserId: string) => {
        if (role === 'admin') return true
        if (role === 'creator' && targetUserId === currentUserId) return true
        return false
      },

      canDeleteUser: (targetUserId: string, currentUserId: string) => {
        if (role === 'admin' && targetUserId !== currentUserId) return true
        return false
      },
    }),
    [role],
  )
}

/**
 * Hook untuk role-based navigation dan redirect
 * Provides navigation helpers dan redirect logic berdasarkan role
 *
 * @returns Object dengan navigation functions dan redirect URLs
 *
 * @example
 * ```tsx
 * const { getDashboardUrl, canNavigateTo, getRedirectUrl } = useRoleNavigation();
 *
 * const dashboardUrl = getDashboardUrl();
 * if (canNavigateTo('/admin')) {
 *   return <AdminPanel />;
 * }
 * ```
 */
function useRoleNavigation() {
  const { role } = useUserRole()

  return useMemo(
    () => ({
      // Get dashboard URL berdasarkan role
      getDashboardUrl: () => {
        switch (role) {
          case 'admin':
            return '/admin'
          case 'creator':
            return '/creator'
          case 'user':
            return '/dashboard'
          default:
            return '/dashboard' // Default fallback
        }
      },

      // Check if user can navigate to specific route
      canNavigateTo: (route: string) => {
        if (!role) return false

        // Admin dapat akses semua
        if (role === 'admin') return true

        // Creator dapat akses creator dan user routes
        if (role === 'creator') {
          return route.startsWith('/creator') || route.startsWith('/dashboard')
        }

        // User hanya dapat akses user routes
        if (role === 'user') {
          return route.startsWith('/dashboard')
        }

        return false
      },

      // Get redirect URL for unauthorized access
      getRedirectUrl: (attemptedRoute: string) => {
        const dashboardUrl = (() => {
          switch (role) {
            case 'admin':
              return '/admin'
            case 'creator':
              return '/creator'
            case 'user':
              return '/dashboard'
            default:
              return '/unauthorized'
          }
        })()
        return `${dashboardUrl}?redirect=${encodeURIComponent(attemptedRoute)}`
      },

      // Get role-specific navigation items
      getNavigationItems: () => {
        const items = []

        if (role === 'admin') {
          items.push(
            { label: 'Admin Dashboard', href: '/admin', icon: 'shield' },
            { label: 'Creator Panel', href: '/creator', icon: 'edit' },
            { label: 'User Panel', href: '/dashboard', icon: 'users' },
          )
        } else if (role === 'creator') {
          items.push(
            { label: 'Creator Dashboard', href: '/creator', icon: 'edit' },
            { label: 'User Panel', href: '/dashboard', icon: 'users' },
          )
        } else if (role === 'user') {
          items.push({ label: 'User Dashboard', href: '/dashboard', icon: 'users' })
        }

        return items
      },

      // Check if route requires authentication
      isProtectedRoute: (route: string) => {
        const protectedRoutes = ['/admin', '/creator', '/dashboard']
        return protectedRoutes.some((protectedRoute) => route.startsWith(protectedRoute))
      },

      // Get role hierarchy level
      getRoleLevel: () => {
        const hierarchy = { user: 1, creator: 2, admin: 3 }
        return role ? hierarchy[role] : 0
      },
    }),
    [role],
  )
}

/**
 * Hook untuk loading states dengan smart defaults
 * Provides intelligent loading state management dan UI helpers
 *
 * @returns Object dengan loading states dan helper functions
 *
 * @example
 * ```tsx
 * const { isReady, shouldShowLoader, getStatusMessage } = useRoleLoadingState();
 *
 * if (shouldShowLoader) return <LoadingSpinner />;
 * return <div>{getStatusMessage()}</div>;
 * ```
 */
function useRoleLoadingState() {
  const { isLoading, error, role } = useUserRole()

  return useMemo(
    () => ({
      isLoading,
      hasError: error !== null,
      error,
      isReady: !isLoading && role !== null,
      isAuthenticated: role !== null,

      // Smart loading states
      shouldShowLoader: isLoading && role === null,
      shouldShowError: error !== null && !isLoading,
      shouldRenderContent: !isLoading && role !== null,

      // Status messages
      getStatusMessage: () => {
        if (isLoading) return 'Memuat informasi pengguna...'
        if (error) return `Error: ${error}`
        if (role === null) return 'Tidak ada informasi role pengguna'
        return `Role aktif: ${role}`
      },

      getLoadingPercentage: () => {
        if (!isLoading) return 100
        if (role === null) return 30
        return 70
      },
    }),
    [isLoading, error, role],
  )
}

/**
 * Hook untuk development utilities
 * Provides role switching dan debugging tools untuk development mode
 *
 * @returns Object dengan development utilities dan testing functions
 *
 * @example
 * ```tsx
 * const { switchToAdmin, logRoleInfo, testRoleTransitions } = useRoleDevelopment();
 *
 * // Switch role untuk testing
 * switchToAdmin();
 *
 * // Debug role information
 * logRoleInfo();
 * ```
 */
function useRoleDevelopment() {
  const { setRole, role } = useUserRoleContext()

  return useMemo(() => {
    if (process.env.NODE_ENV !== 'development') {
      return {
        switchToAdmin: () => console.warn('Role switching only available in development'),
        switchToCreator: () => console.warn('Role switching only available in development'),
        switchToUser: () => console.warn('Role switching only available in development'),
        getCurrentRole: () => role,
        isDevMode: false,
      }
    }

    return {
      switchToAdmin: () => setRole('admin'),
      switchToCreator: () => setRole('creator'),
      switchToUser: () => setRole('user'),
      getCurrentRole: () => role,
      isDevMode: true,

      // Development helpers
      logRoleInfo: () => {
        console.group('🔐 Role Development Info')
        console.log('Current Role:', role)
        console.log('Is Admin:', role === 'admin')
        console.log('Is Creator:', role === 'creator')
        console.log('Is User:', role === 'user')
        console.log('Role Hierarchy Level:', role ? { user: 1, creator: 2, admin: 3 }[role] : 0)
        console.groupEnd()
      },

      testRoleTransitions: () => {
        console.log('🧪 Testing role transitions...')
        const roles: UserRole[] = ['user', 'creator', 'admin']
        let index = 0

        const interval = setInterval(() => {
          const newRole = roles[index]
          console.log(`Switching to: ${newRole}`)
          setRole(newRole)
          index = (index + 1) % roles.length

          if (index === 0) {
            clearInterval(interval)
            console.log('✅ Role transition test completed')
          }
        }, 2000)
      },
    }
  }, [setRole, role])
}

/**
 * Hook untuk role-based conditional rendering
 * Provides utility functions untuk conditional UI rendering berdasarkan role
 *
 * @returns Object dengan rendering helpers dan conditional utilities
 *
 * @example
 * ```tsx
 * const { renderForAdmin, shouldShowNavItem, isFeatureEnabled } = useRoleConditional();
 *
 * return (
 *   <div>
 *     {renderForAdmin(<AdminPanel />)}
 *     {shouldShowNavItem('user-management') && <UserManagementNav />}
 *   </div>
 * );
 * ```
 */
function useRoleConditional() {
  const { role } = useUserRole()
  const roleGuard = useRoleGuard()

  return useMemo(
    () => ({
      // Render helpers
      renderForAdmin: (component: React.ReactNode) => (role === 'admin' ? component : null),

      renderForCreator: (component: React.ReactNode) =>
        role === 'admin' || role === 'creator' ? component : null,

      renderForUser: (component: React.ReactNode) => (role !== null ? component : null),

      renderForRole: (targetRole: UserRole, component: React.ReactNode) =>
        role === targetRole ? component : null,

      renderForRoles: (targetRoles: UserRole[], component: React.ReactNode) =>
        role !== null && targetRoles.includes(role) ? component : null,

      // Conditional class helpers
      getConditionalClasses: (
        baseClasses: string,
        roleClasses: Partial<Record<UserRole, string>>,
      ) => {
        const additionalClasses = role && roleClasses[role] ? roleClasses[role] : ''
        return `${baseClasses} ${additionalClasses}`.trim()
      },

      // Navigation helpers
      shouldShowNavItem: (requiredRole: UserRole | UserRole[]) => {
        if (Array.isArray(requiredRole)) {
          return roleGuard.hasAnyRole(requiredRole)
        }
        return roleGuard.hasMinimumRole(requiredRole)
      },

      // Feature flags
      isFeatureEnabled: (feature: string) => {
        const featureRoles: Record<string, UserRole[]> = {
          analytics: ['admin'],
          'content-management': ['admin', 'creator'],
          'user-management': ['admin'],
          'profile-editing': ['admin', 'creator', 'user'],
          'advanced-settings': ['admin'],
          'content-creation': ['admin', 'creator'],
          dashboard: ['admin', 'creator'],
        }

        const requiredRoles = featureRoles[feature]
        return requiredRoles ? roleGuard.hasAnyRole(requiredRoles) : false
      },
    }),
    [role, roleGuard],
  )
}

/**
 * Hook untuk error handling dan recovery
 * Provides error analysis dan recovery utilities untuk role management
 *
 * @returns Object dengan error handling functions dan recovery actions
 *
 * @example
 * ```tsx
 * const { hasError, getUserFriendlyError, retryRoleFetch } = useRoleErrorHandling();
 *
 * if (hasError) {
 *   return (
 *     <div>
 *       <p>{getUserFriendlyError()}</p>
 *       <button onClick={retryRoleFetch}>Coba Lagi</button>
 *     </div>
 *   );
 * }
 * ```
 */
function useRoleErrorHandling() {
  const { error, refreshRole, clearRole } = useUserRoleContext()

  return useMemo(
    () => ({
      hasError: error !== null,
      error,

      // Recovery actions
      retryRoleFetch: refreshRole,
      resetRole: clearRole,

      // Error categorization
      isNetworkError: () => error?.includes('network') || error?.includes('fetch'),
      isAuthError: () => error?.includes('auth') || error?.includes('token'),
      isPermissionError: () => error?.includes('permission') || error?.includes('access'),

      // Error messages
      getUserFriendlyError: () => {
        if (!error) return null

        if (error.includes('network')) {
          return 'Masalah koneksi internet. Silakan coba lagi.'
        }

        if (error.includes('token') || error.includes('session')) {
          return 'Sesi Anda telah berakhir. Silakan login ulang.'
        }

        if (error.includes('permission')) {
          return 'Anda tidak memiliki izin untuk mengakses fitur ini.'
        }

        return 'Terjadi kesalahan. Silakan coba lagi atau hubungi support.'
      },

      // Suggested actions
      getSuggestedAction: () => {
        if (!error) return null

        if (error.includes('network')) {
          return 'refresh'
        }

        if (error.includes('token') || error.includes('session')) {
          return 'login'
        }

        if (error.includes('permission')) {
          return 'contact_admin'
        }

        return 'retry'
      },
    }),
    [error, refreshRole, clearRole],
  )
}

/**
 * Export all hooks untuk external usage
 * useUserRole sebagai default export untuk convenience
 */
export {
  useUserRole as default,
  useRoleGuard,
  useRoleNavigation,
  useRoleLoadingState,
  useRoleDevelopment,
  useRoleConditional,
  useRoleErrorHandling,
}
