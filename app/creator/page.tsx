'use client'

/**
 * Creator Dashboard Page
 *
 * Halaman utama dasbor studio pembuat (Creator Studio) yang telah direfaktorisasi secara modular
 * ke dalam subkomponen reusable di features/creator-dashboard untuk kebersihan,
 * keterbacaan, dan pemeliharaan kode yang mudah.
 */

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useRoleGuard, useRoleLoadingState } from '@/features/auth'
import { useCreatorCourses } from '@/features/cms/hooks'

// Import modular components dari features/creator-dashboard
import {
  CreatorHeader,
  ContinueCreatingCard,
  ActionRequiredCard,
  AICreatorAssistantCard,
  CourseOverviewCard,
  LearnerInsightsCard,
  RecentReviewsCard,
  RecentActivitiesCard,
  GrowthOpportunitiesCard,
} from '@/features/creator-dashboard'

export default function CreatorDashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { canAccessCreator } = useRoleGuard()
  const { shouldShowLoader: roleLoading } = useRoleLoadingState()

  const { courses, stats, isLoading: loadingCourses } = useCreatorCourses()

  // Loading State / Skeleton
  if (!isLoaded || roleLoading || loadingCourses) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-28 bg-bg-bone rounded-2xl border border-border/10 p-6 flex flex-col justify-between">
          <div className="h-6 w-1/4 bg-bg-surface-accent rounded"></div>
          <div className="h-4 w-1/3 bg-bg-surface-accent rounded"></div>
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 h-80 bg-bg-bone rounded-2xl border border-border/10"></div>
          <div className="md:col-span-4 h-80 bg-bg-bone rounded-2xl border border-border/10"></div>
          <div className="md:col-span-12 h-72 bg-bg-bone rounded-2xl border border-border/10"></div>
        </div>
      </div>
    )
  }

  // Error State - Access Denied
  if (!canAccessCreator()) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-card border border-border/15 rounded-2xl p-8 max-w-md text-center paper-texture">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-xl font-manrope font-bold text-text-primary mb-2">Akses Ditolak</h1>
          <p className="text-text-secondary text-sm mb-6">
            Anda tidak memiliki otorisasi untuk mengakses studio pembuat ini.
          </p>
          <button onClick={() => router.push('/')} className="btn-primary">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  // Calculate student count from courses
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount ?? 0), 0)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Welcome Header */}
      <CreatorHeader userName={user?.firstName || 'Lutfi'} />

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 2. Continue Creating (Hero Bento - md:col-span-8) */}
        <ContinueCreatingCard onEdit={() => router.push('/creator/course-manage')} />

        {/* 3. Action Required (md:col-span-4) */}
        <ActionRequiredCard />

        {/* 4. AI Creator Assistant (md:col-span-12) */}
        <AICreatorAssistantCard />

        {/* 5. Course Overview (md:col-span-6) */}
        <CourseOverviewCard
          stats={{
            published: stats.publishedCourses || 0,
            draft: stats.draftCourses || 0,
            inReview: 1, // Mock count
            archived: 0,
          }}
        />

        {/* 6. Learner Insights (md:col-span-6) */}
        <LearnerInsightsCard
          stats={{
            activeStudents: totalStudents || 0,
            newEnrollments: 18,
            completionRate: 84,
            rating: 4.9,
          }}
        />

        {/* 7. Recent Reviews (md:col-span-7) */}
        <RecentReviewsCard />

        {/* 8. Recent Activities (md:col-span-5) */}
        <RecentActivitiesCard />

        {/* 9. Growth Opportunities (md:col-span-12) */}
        <GrowthOpportunitiesCard />
      </div>
    </div>
  )
}
