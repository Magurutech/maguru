'use client'

/**
 * User Dashboard Page
 *
 * Halaman dashboard utama untuk semua authenticated users.
 * Dapat diakses oleh user, creator, dan admin dengan konten yang sesuai role.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

// Auth hooks
import { useUserRole, useRoleGuard, useRoleLoadingState } from '@/features/auth'

// Dashboard components
import {
  DashboardLayout,
  DashboardHeader,
  StatsGrid,
  RecentCourses,
  QuickActions,
  Recommendations,
  DashboardHeaderSkeleton,
  StatsGridSkeleton,
  RecentCoursesSkeleton,
  QuickActionsSkeleton,
  RecommendationsSkeleton,
} from '@/features/dashboard/components'

// API client
import { getDashboardData } from '@/features/dashboard/api'
import type { DashboardData } from '@/features/dashboard/types'

export default function DashboardPage() {
  // Auth state
  const { user } = useUser()
  const { role } = useUserRole()
  const { canAccessUser } = useRoleGuard()
  const { shouldShowLoader } = useRoleLoadingState()

  // Dashboard data state
  const [data, setData] = useState<DashboardData | null>(null)

  // Fetch dashboard data when role is available
  useEffect(() => {
    if (role) {
      getDashboardData(role)
        .then(setData)
        .catch((err) => {
          console.error('Failed to fetch dashboard data:', err)
        })
    }
  }, [role])

  // Loading state - show skeletons
  if (shouldShowLoader || !data) {
    return (
      <DashboardLayout role={role || 'user'}>
        <header>
          <DashboardHeaderSkeleton />
        </header>

        <main className="space-y-8">
          <section aria-label="Statistik">
            <StatsGridSkeleton />
          </section>

          <section aria-label="Kursus Terbaru">
            <RecentCoursesSkeleton />
          </section>

          <section aria-label="Aksi Cepat">
            <QuickActionsSkeleton />
          </section>

          <section aria-label="Rekomendasi">
            <RecommendationsSkeleton />
          </section>
        </main>
      </DashboardLayout>
    )
  }

  // Error state - access denied
  if (!canAccessUser() || !role) {
    return (
      <div className="min-h-screen bg-ancient-fantasy flex items-center justify-center p-6">
        <div className="glass-panel-light rounded-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-beige-900 mb-2">Akses Ditolak</h1>
          <p className="text-beige-600 mb-6">Anda perlu login untuk mengakses dashboard.</p>
          <Link href="/sign-in">
            <button className="bg-merah-500 hover:bg-merah-600 text-white px-6 py-2 rounded-lg transition-colors">
              Login
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Main dashboard rendering
  return (
    <DashboardLayout role={role}>
      <header>
        <DashboardHeader userName={user?.firstName || 'User'} role={role} />
      </header>

      <main className="space-y-8">
        <section aria-label="Statistik">
          <StatsGrid stats={data.stats} />
        </section>

        <section aria-label="Kursus Terbaru">
          <RecentCourses
            courses={data.recentCourses}
            onContinue={(id) => console.log('Continue course:', id)}
            onViewAll={() => console.log('View all courses')}
          />
        </section>

        <section aria-label="Aksi Cepat">
          <QuickActions actions={data.quickActions} />
        </section>

        {data.recommendations.length > 0 && (
          <section aria-label="Rekomendasi">
            <Recommendations recommendations={data.recommendations} />
          </section>
        )}
      </main>
    </DashboardLayout>
  )
}
