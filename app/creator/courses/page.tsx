'use client'

/**
 * Creator Courses List Page
 *
 * Halaman full list semua kursus milik creator dalam bentuk card.
 * Fetch dari GET /api/creator/courses
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRoleGuard, useRoleLoadingState, useUserRole } from '@/features/auth'
import { CourseCard, type CourseCardCourse } from '@/features/cms/components/student/CourseCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, BookOpen } from 'lucide-react'

interface CreatorStats {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
}

export default function CreatorCoursesPage() {
  const router = useRouter()
  const { role } = useUserRole()
  const { canAccessCreator } = useRoleGuard()
  const { shouldShowLoader: roleLoading } = useRoleLoadingState()

  const [courses, setCourses] = useState<CourseCardCourse[]>([])
  const [stats, setStats] = useState<CreatorStats>({ totalCourses: 0, publishedCourses: 0, draftCourses: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (roleLoading) return
    if (!canAccessCreator()) return

    async function fetchCourses() {
      try {
        const res = await fetch('/api/creator/courses')
        if (res.ok) {
          const data = await res.json()
          setCourses(data.courses || [])
          if (data.stats) setStats(data.stats)
        }
      } catch (err) {
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [roleLoading, role]) // eslint-disable-line react-hooks/exhaustive-deps

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-beige-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-beige-200 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-beige-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!canAccessCreator()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
          <p className="text-beige-600">Role saat ini: {role || 'Tidak ada'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/creator')}
            className="mb-4 text-beige-600 hover:text-beige-900 hover:bg-beige-100 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-beige-900 font-serif">Kursus Saya</h1>
              <p className="text-beige-600 mt-1">
                {stats.totalCourses} kursus &middot; {stats.publishedCourses} published &middot; {stats.draftCourses} draft
              </p>
            </div>
            <Link href="/creator/courses/create">
              <Button className="bg-merah-500 hover:bg-merah-600 text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-200">
                <Plus className="w-4 h-4" />
                Buat Kursus Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-beige-200 shadow-neu p-16 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-beige-300" />
            <h2 className="text-xl font-semibold text-beige-700 mb-2">Belum ada kursus</h2>
            <p className="text-beige-500 mb-6">Mulai perjalanan mengajar Anda sekarang</p>
            <Link href="/creator/courses/create">
              <Button className="bg-merah-500 hover:bg-merah-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Buat Kursus Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                showManage
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
