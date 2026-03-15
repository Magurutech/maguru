'use client'

/**
 * Creator Dashboard Page
 *
 * Halaman dashboard khusus untuk creator role.
 * Menampilkan tools dan fitur untuk content creation dan management.
 */

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PenTool, BookOpen, Video, FileText, BarChart3, Clock, Settings } from 'lucide-react'
import { useUserRole, useRoleGuard, useRoleLoadingState } from '@/features/auth'

interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export default function CreatorDashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { role, isCreator } = useUserRole()
  const { canAccessCreator } = useRoleGuard()
  const { shouldShowLoader: roleLoading } = useRoleLoadingState()

  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  // Fetch creator's courses
  useEffect(() => {
    async function fetchCourses() {
      if (!isLoaded || !canAccessCreator()) return

      try {
        setLoadingCourses(true)
        // TODO: Replace with actual API endpoint that filters by creator
        // For now, we'll use a placeholder
        const res = await fetch('/api/creator/courses')
        if (res.ok) {
          const data = await res.json()
          setCourses(data.courses || [])
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoadingCourses(false)
      }
    }

    fetchCourses()
  }, [isLoaded, canAccessCreator])

  if (!isLoaded || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Client-side role check
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

  // Calculate stats from real data
  const creatorStats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status === 'PUBLISHED').length,
    draftCourses: courses.filter(c => c.status === 'DRAFT').length,
    totalStudents: 0, // TODO: Calculate from enrollments
    monthlyEarnings: 0, // TODO: Calculate from payments
    averageRating: 0, // TODO: Calculate from reviews
  }

  const pendingTasks = [
    {
      id: 1,
      title: 'Review course feedback for "React Patterns"',
      priority: 'high',
      dueDate: '2024-01-16',
    },
    {
      id: 2,
      title: 'Complete TypeScript course outline',
      priority: 'medium',
      dueDate: '2024-01-18',
    },
    {
      id: 3,
      title: 'Record introduction video for Node.js course',
      priority: 'low',
      dueDate: '2024-01-20',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-merah-100 rounded-lg">
              <PenTool className="w-6 h-6 text-merah-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-beige-900 font-serif">Creator Studio</h1>
              <p className="text-beige-600">
                Selamat berkarya, {user?.firstName || 'Creator'}! - Role:{' '}
                <span className="font-semibold capitalize text-merah-600">{role}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-hijau-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-hijau-600" />
              </div>
              <div>
                <p className="text-sm text-beige-600">Total Kursus</p>
                <p className="text-2xl font-bold text-beige-900">{creatorStats.totalCourses}</p>
                <p className="text-xs text-beige-500">
                  {creatorStats.publishedCourses} published, {creatorStats.draftCourses} draft
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-kuning-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-kuning-600" />
              </div>
              <div>
                <p className="text-sm text-beige-600">Total Siswa</p>
                <p className="text-2xl font-bold text-beige-900">
                  {creatorStats.totalStudents.toLocaleString()}
                </p>
                <p className="text-xs text-hijau-600">↗ +12% bulan ini</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-merah-100 rounded-lg">
                <span className="text-merah-600 font-bold text-lg">Rp</span>
              </div>
              <div>
                <p className="text-sm text-beige-600">Pendapatan Bulan Ini</p>
                <p className="text-2xl font-bold text-beige-900">
                  Rp {(creatorStats.monthlyEarnings / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-kuning-600">
                  Rating rata-rata: {creatorStats.averageRating}⭐
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-beige-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center bg-merah-500 hover:bg-merah-600 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              <BookOpen className="w-6 h-6 mb-2" />
              Buat Kursus Baru
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-kuning-300 text-kuning-700 hover:bg-kuning-50 hover:border-kuning-500 hover:scale-105 transition-all duration-200">
              <Video className="w-6 h-6 mb-2" />
              Upload Video
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-hijau-300 text-hijau-700 hover:bg-hijau-50 hover:border-hijau-500 hover:scale-105 transition-all duration-200">
              <FileText className="w-6 h-6 mb-2" />
              Tulis Artikel
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-beige-300 text-beige-700 hover:bg-beige-50 hover:border-beige-500 hover:scale-105 transition-all duration-200">
              <BarChart3 className="w-6 h-6 mb-2" />
              Lihat Analytics
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Courses */}
          <div className="bg-white rounded-lg shadow-neu border border-beige-200">
            <div className="p-6 border-b border-beige-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-beige-900">Kursus Saya</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-beige-300 text-beige-700 hover:bg-beige-50"
                  onClick={() => router.push('/creator/courses')}
                >
                  Lihat Semua
                </Button>
              </div>
            </div>

            <div className="divide-y divide-beige-100">
              {loadingCourses ? (
                <div className="p-6 text-center text-beige-600">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige-900 mx-auto mb-2"></div>
                  Loading courses...
                </div>
              ) : courses.length === 0 ? (
                <div className="p-6 text-center text-beige-600">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 text-beige-400" />
                  <p>Belum ada kursus. Buat kursus pertama Anda!</p>
                </div>
              ) : (
                courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="p-6 hover:bg-beige-50 transition-colors duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-beige-900 mb-1">{course.title}</h3>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              course.status === 'PUBLISHED'
                                ? 'bg-hijau-100 text-hijau-800'
                                : 'bg-kuning-100 text-kuning-800'
                            }`}
                          >
                            {course.status}
                          </span>
                        </div>
                        {course.description && (
                          <p className="text-sm text-beige-600 mt-2 line-clamp-2">
                            {course.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-beige-300 text-beige-700 hover:bg-beige-100 hover:scale-105 transition-all duration-200"
                          onClick={() => router.push(`/creator/courses/${course.slug}/manage`)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-beige-500 mt-2">
                      Terakhir diupdate: {new Date(course.updatedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-lg shadow-neu border border-beige-200">
            <div className="p-6 border-b border-beige-100">
              <h2 className="text-xl font-semibold text-beige-900">Tugas Pending</h2>
            </div>

            <div className="divide-y divide-beige-100">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-beige-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-beige-900 mb-2">{task.title}</h3>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'high'
                              ? 'bg-merah-100 text-merah-800'
                              : task.priority === 'medium'
                                ? 'bg-kuning-100 text-kuning-800'
                                : 'bg-hijau-100 text-hijau-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-sm text-beige-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-beige-300 text-beige-700 hover:bg-beige-100 hover:scale-105 transition-all duration-200">
                      Selesai
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-beige-100">
              <Button variant="outline" className="w-full border-beige-300 text-beige-700 hover:bg-beige-50">
                Lihat Semua Tugas
              </Button>
            </div>
          </div>
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-beige-100 rounded-lg p-6 border border-beige-200">
            <h3 className="font-semibold text-beige-900 mb-4">🎨 Creator Dashboard - Ancient Fantasy Asia Implementation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded p-3">
                <strong className="text-hijau-600">✅ Completed:</strong>
                <ul className="mt-1 text-beige-700">
                  <li>• Ancient Fantasy Asia color migration</li>
                  <li>• Neumorphic shadows implementation</li>
                  <li>• Interactive hover states</li>
                  <li>• Typography hierarchy</li>
                </ul>
              </div>
              <div className="bg-white rounded p-3">
                <strong className="text-beige-600">📊 Auth Info:</strong>
                <ul className="mt-1 text-beige-700">
                  <li>• Role: {role}</li>
                  <li>• Is Creator: {isCreator ? 'Yes' : 'No'}</li>
                  <li>• Access: {canAccessCreator() ? 'Granted' : 'Denied'}</li>
                </ul>
              </div>
              <div className="bg-white rounded p-3">
                <strong className="text-kuning-600">🔄 Next Phase:</strong>
                <ul className="mt-1 text-beige-700">
                  <li>• Extract reusable components</li>
                  <li>• Backend integration</li>
                  <li>• Real-time data feeds</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
