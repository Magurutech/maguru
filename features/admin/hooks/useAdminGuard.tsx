/**
 * Admin Guard Hook
 *
 * Reusable hook untuk admin authentication dan role checking
 * Extracted dari existing admin page logic untuk reusability
 */

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { useUserRole, useRoleGuard, useRoleLoadingState } from '@/features/auth'

export interface AdminAuthState {
  user: ReturnType<typeof useUser>['user']
  role: string | null
  isAdmin: boolean
  isLoaded: boolean
  canAccessAdmin: () => boolean
  shouldShowLoader: boolean
  isAuthorized: boolean
}

export function useAdminGuard(): AdminAuthState {
  const { user, isLoaded } = useUser()
  const { role, isAdmin } = useUserRole()
  const { canAccessAdmin } = useRoleGuard()
  const { shouldShowLoader } = useRoleLoadingState()

  const isAuthorized = isLoaded && !shouldShowLoader && canAccessAdmin()

  return {
    user,
    role,
    isAdmin,
    isLoaded,
    canAccessAdmin,
    shouldShowLoader,
    isAuthorized
  }
}

/**
 * Admin Loading Component
 * Reusable loading state untuk admin pages dengan Ancient Fantasy styling
 */
export function AdminLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-beige-200 rounded mb-4 animate-shimmer"></div>
        <div className="h-4 w-32 bg-beige-200 rounded animate-shimmer"></div>
      </div>
    </div>
  )
}

/**
 * Admin Access Denied Component
 * Reusable access denied screen dengan Ancient Fantasy styling
 */
export function AdminAccessDenied({ role }: { role: string | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-neu border border-beige-200 animate-fade-in">
        <div className="text-merah-500 text-6xl mb-4 animate-float">🚫</div>
        <h1 className="text-2xl font-bold mb-2 text-beige-900 font-serif">Akses Ditolak</h1>
        <p className="text-beige-600">Anda tidak memiliki izin administrator.</p>
        <p className="text-sm text-beige-500 mt-2">Role saat ini: {role || 'Tidak ada'}</p>
      </div>
    </div>
  )
}

/**
 * Render Guard Function
 * Simplified rendering logic untuk admin pages
 */
export function renderAdminGuard(
  authState: AdminAuthState,
  children: React.ReactNode
): React.ReactNode {
  const { isLoaded, shouldShowLoader, isAuthorized, role } = authState

  if (!isLoaded || shouldShowLoader) {
    return <AdminLoadingScreen />
  }

  if (!isAuthorized) {
    return <AdminAccessDenied role={role} />
  }

  return children
}