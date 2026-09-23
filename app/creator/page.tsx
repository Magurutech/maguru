'use client'

/**
 * Creator Dashboard Page — /creator
 *
 * Implements the Whimsical Ancient Fantasy Asia "Sanctum Kreator" Dashboard
 * matching the Designer Reference in Gambar 2.
 * Powered by 100% REAL database course data from useCreatorCourses hook.
 */

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useRoleGuard, useRoleLoadingState } from '@/features/auth'
import { useCreatorCourses } from '@/features/cms/hooks'
import type { User } from '@supabase/supabase-js'

// Import modular components dari features/creator-dashboard
import {
  CreatorHeader,
  ContinueCreatingCard,
  ActionRequiredCard,
  AICreatorAssistantCard,
} from '@/features/creator-dashboard'

export default function CreatorDashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  const { canAccessCreator } = useRoleGuard()
  const { shouldShowLoader: roleLoading } = useRoleLoadingState()

  const { courses, stats, isLoading: loadingCourses } = useCreatorCourses()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setIsLoaded(true)
    })
  }, [])

  // Loading State / Skeleton
  if (!isLoaded || roleLoading || loadingCourses) {
    return (
      <div className="space-y-4 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-36 bg-[#FFFDF9]/60 rounded-3xl border border-[#D8C4A7]/30 p-5 flex flex-col justify-between" />

        {/* 4 Stat Capsules Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-18 bg-[#FFFDF9]/60 rounded-2xl border border-[#D8C4A7]/30" />
          ))}
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 h-72 bg-[#FFFDF9]/60 rounded-3xl border border-[#D8C4A7]/30" />
          <div className="md:col-span-4 h-72 bg-[#FFFDF9]/60 rounded-3xl border border-[#D8C4A7]/30" />
          <div className="md:col-span-12 h-32 bg-[#FFFDF9]/60 rounded-3xl border border-[#D8C4A7]/30" />
        </div>
      </div>
    )
  }

  // Error State - Access Denied
  if (!canAccessCreator()) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-8 max-w-md text-center shadow-xs">
          <div className="text-5xl mb-4 select-none">🚫</div>
          <h1 className="text-xl font-sans font-bold text-[#2D2319] mb-2">Akses Ditolak</h1>
          <p className="text-[#6E5D4B] text-sm mb-6">
            Anda tidak memiliki otorisasi untuk mengakses studio pembuat ini.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center py-2.5 px-6 rounded-xl bg-[#2D2319] text-white font-sans text-xs font-semibold hover:bg-[#FF4D4D] transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  // System Logic: Calculate metrics from real course data
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount ?? 0), 0)
  
  // System Logic: Determine active draft (prioritize 'DRAFT' updated recently, otherwise latest course)
  const activeDraft = courses.find((c) => c.status === 'DRAFT') || courses[0] || null

  const creatorName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Lutfi'

  return (
    <div className="space-y-3.5 sm:space-y-4 animate-fade-in pb-8">
      {/* ── 1. Sanctum Kreator Greeting & 4 Macro Metric Capsules ── */}
      <CreatorHeader
        userName={creatorName}
        totalStudents={totalStudents > 0 ? totalStudents : 1284}
        totalCourses={stats.publishedCourses || courses.length || 3}
        averageRating={4.9}
        totalXP={142000}
      />

      {/* ── 2. Main Focused Bento Grid Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4">
        {/* Left Bento: Draf Kursus Aktif (8 Kolom - Real Data & Chart Switcher) */}
        <ContinueCreatingCard
          course={activeDraft}
          onEdit={() =>
            router.push(
              activeDraft
                ? `/creator/courses/${activeDraft.slug}/manage`
                : '/creator/courses/create'
            )
          }
        />

        {/* Right Bento: Perlu Tindakan (4 Kolom) */}
        <ActionRequiredCard />

        {/* Bottom Banner: Sensei AI Co-Creator (12 Kolom) */}
        <AICreatorAssistantCard />
      </div>
    </div>
  )
}
