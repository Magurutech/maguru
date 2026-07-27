/**
 * Admin Guard Hook
 *
 * Reusable hook untuk admin authentication dan role checking
 */

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserRole, useRoleGuard, useRoleLoadingState } from '@/features/auth'
import type { User } from '@supabase/supabase-js'

export interface AdminAuthState {
  user: User | null
  role: string | null
  isAdmin: boolean
  isLoaded: boolean
  canAccessAdmin: () => boolean
  shouldShowLoader: boolean
  isAuthorized: boolean
}

export function useAdminGuard(): AdminAuthState {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { role, isAdmin } = useUserRole()
  const { canAccessAdmin } = useRoleGuard()
  const { shouldShowLoader } = useRoleLoadingState()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setIsLoaded(true)
    })
  }, [])

  const isAuthorized = isLoaded && !shouldShowLoader && canAccessAdmin()

  return {
    user,
    role,
    isAdmin,
    isLoaded,
    canAccessAdmin,
    shouldShowLoader,
    isAuthorized,
  }
}

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

export function AdminAccessDenied({ role }: { role: string | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50 p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
        <p className="text-gray-600">
          Anda tidak memiliki izin admin untuk mengakses halaman ini. Role Anda saat ini: {role || 'Pengunjung'}
        </p>
      </div>
    </div>
  )
}

export function renderAdminGuard(guardState: AdminAuthState): React.ReactNode | null {
  if (guardState.shouldShowLoader || !guardState.isLoaded) {
    return <AdminLoadingScreen />
  }
  if (!guardState.isAuthorized) {
    return <AdminAccessDenied role={guardState.role} />
  }
  return null
}