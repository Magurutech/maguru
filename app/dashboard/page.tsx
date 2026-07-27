'use client'

/**
 * User Dashboard Page (Learning Command Center)
 *
 * Halaman utama dasbor pengguna MAGURU yang telah direfaktorisasi secara modular
 * ke dalam subkomponen reusable di features/user-dashboard untuk kebersihan,
 * keterbacaan, dan pemeliharaan kode yang mudah.
 */

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useUserRole, useRoleGuard, useRoleLoadingState } from '@/features/auth'
import { getDashboardData } from '@/features/dashboard/api'
import type { DashboardData } from '@/features/dashboard/types'
import type { User } from '@supabase/supabase-js'

// Import modular components dari features/user-dashboard
import {
  DashboardHeader,
  ContinueLearningCard,
  TodaysGoalCard,
  AICoTeacherCard,
  LearningProgressCard,
  LearningStreakCard,
  UpcomingActivitiesCard,
  AchievementsCard,
  RecommendedLearning
} from '@/features/user-dashboard'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const { role } = useUserRole()
  const { canAccessUser } = useRoleGuard()
  const { shouldShowLoader } = useRoleLoadingState()
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  // Dashboard Data State
  const [data, setData] = useState<DashboardData | null>(null)
  
  // Interactive Local States for Goals Checklist
  const [goals, setGoals] = useState([
    { id: 1, text: 'Tonton video Lesson 4.3 (useState vs useReducer)', completed: true },
    { id: 2, text: 'Selesaikan Kuis Mandiri Modul 4', completed: false },
    { id: 3, text: 'Tulis ulang kode contoh useReducer di Sandbox', completed: false },
  ])

  // Fetch dashboard data
  useEffect(() => {
    if (role) {
      // Jika role adalah creator atau admin, alihkan ke dashboard masing-masing
      if (role === 'creator') {
        router.push('/creator')
        return
      }
      if (role === 'admin') {
        router.push('/admin')
        return
      }

      getDashboardData(role)
        .then(setData)
        .catch((err) => {
          console.error('Failed to fetch dashboard data:', err)
        })
    }
  }, [role, router])

  // Toggle Goal status
  const toggleGoal = (id: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g))
  }

  // Calculate Goal Progress
  const completedGoalsCount = goals.filter(g => g.completed).length
  const goalProgressPercent = Math.round((completedGoalsCount / goals.length) * 100)

  // Loading State / Skeleton
  if (shouldShowLoader || !data || !role) {
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
          <div className="md:col-span-7 h-72 bg-bg-bone rounded-2xl border border-border/10"></div>
          <div className="md:col-span-5 h-72 bg-bg-bone rounded-2xl border border-border/10"></div>
        </div>
      </div>
    )
  }

  // Error State - Access Denied
  if (!canAccessUser()) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-card border border-border/15 rounded-2xl p-8 max-w-md text-center paper-texture">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-xl font-manrope font-bold text-text-primary mb-2">Akses Ditolak</h1>
          <p className="text-text-secondary text-sm mb-6">Anda tidak memiliki otorisasi untuk mengakses dashboard ini.</p>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Welcome Header Section */}
      <DashboardHeader userName={user?.email?.split('@')[0] || user?.user_metadata?.name || 'Learner'} />

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 2. Continue Learning Card */}
        <ContinueLearningCard onResume={() => console.log('Resume learning')} />

        {/* 3. Today's Goal Card */}
        <TodaysGoalCard 
          goals={goals}
          onToggleGoal={toggleGoal}
          completedCount={completedGoalsCount}
          progressPercent={goalProgressPercent}
        />

        {/* 4. AI Co-Teacher Card */}
        <AICoTeacherCard />

        {/* 5. Learning Progress Chart Card */}
        <LearningProgressCard />

        {/* 6. Learning Streak Consistency Card */}
        <LearningStreakCard />

        {/* 7. Upcoming Activities Timeline Card */}
        <UpcomingActivitiesCard />

        {/* 8. Achievements Milestones Card */}
        <AchievementsCard onClaim={() => console.log('Claim certificates')} />

        {/* 9. Recommended Learning AI Carousel */}
        <RecommendedLearning 
          recommendations={data.recommendations}
          onEnroll={(id) => console.log('Enrolling in course:', id)}
        />

      </div>
    </div>
  )
}
