'use client'

/**
 * Creator Dashboard Page
 *
 * Halaman dashboard khusus untuk creator role.
 * Menampilkan tools dan fitur untuk content creation dan management.
 */

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useUserRole, useRoleGuard, useRoleLoadingState } from '@/features/auth'
import {
  DashboardStats,
  CourseList,
  DashboardHeader,
  QuickActionsPanel,
  PendingTasksPanel,
} from '@/features/cms/components/creator/dashboard'
import type { PendingTask } from '@/features/cms/components/creator/dashboard'
import { useCreatorCourses } from '@/features/cms/hooks'

export default function CreatorDashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { role } = useUserRole()
  const { canAccessCreator } = useRoleGuard()
  const { shouldShowLoader: roleLoading } = useRoleLoadingState()

  const { courses, stats, isLoading: loadingCourses } = useCreatorCourses()

  if (!isLoaded || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!canAccessCreator()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
          <p className="text-gray-600">Anda tidak memiliki izin sebagai content creator.</p>
          <p className="text-sm text-gray-500 mt-2">Role saat ini: {role || 'Tidak ada'}</p>
        </div>
      </div>
    )
  }

  const pendingTasks: PendingTask[] = [
    { id: 1, title: 'Review course feedback for "React Patterns"', priority: 'high', dueDate: '2024-01-16' },
    { id: 2, title: 'Complete TypeScript course outline', priority: 'medium', dueDate: '2024-01-18' },
    { id: 3, title: 'Record introduction video for Node.js course', priority: 'low', dueDate: '2024-01-20' },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-beige-50 via-kuning-50 to-hijau-50 p-6">
      <div className="max-w-8xl mx-auto">
        <DashboardHeader firstName={user?.firstName} role={role} />

        <DashboardStats
          stats={{
            totalCourses: stats.totalCourses,
            publishedCourses: stats.publishedCourses,
            draftCourses: stats.draftCourses,
            totalStudents: courses.reduce((sum, c) => sum + (c.enrollmentCount ?? 0), 0),
          }}
        />

        <QuickActionsPanel />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CourseList
              courses={courses}
              isLoading={loadingCourses}
              onViewAll={() => router.push('/creator/courses')}
            />
          </div>

          <div className="lg:col-span-1">
            <PendingTasksPanel tasks={pendingTasks} />
          </div>
        </div>
      </div>
    </div>
  )
}