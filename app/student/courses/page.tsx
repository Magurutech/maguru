import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/features/cms/components/student/CourseCard'
import { getMyEnrollments } from '@/features/cms/services/enrollment.service'

/**
 * My Courses Page — /student/courses
 *
 * Server component. Auth-protected.
 * Calls getMyEnrollments directly (no HTTP round-trip) to avoid
 * losing the auth cookie on server-side fetch.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

export default async function MyCoursesPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { enrollments } = await getMyEnrollments(user.id)

  return (
    <div className="min-h-screen bg-linear-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-beige-900 font-serif mb-2">
            Kursus Saya
          </h1>
          <p className="text-beige-600">
            Lanjutkan perjalanan belajarmu dari sini.
          </p>
        </div>

        {enrollments.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <p className="text-sm text-beige-500 mb-6">
              {enrollments.length} kursus terdaftar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="enrolled-courses-grid">
              {enrollments.map((enrollment) => (
                <CourseCard
                  key={enrollment.id}
                  course={{
                    id: enrollment.course.id,
                    title: enrollment.course.title,
                    description: enrollment.course.description,
                    category: enrollment.course.category,
                    difficulty: enrollment.course.difficulty,
                    status: enrollment.course.status,
                  }}
                  enrolled={true}
                  progress={enrollment.progress}
                  enrolledAt={enrollment.enrolledAt}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div data-testid="empty-state" className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-beige-100 rounded-full mb-4">
        <BookOpen className="w-8 h-8 text-beige-400" />
      </div>
      <h2 className="text-xl font-semibold text-beige-800 mb-2">
        Belum ada kursus yang diikuti
      </h2>
      <p className="text-beige-500 max-w-sm mb-6">
        Mulai perjalanan belajarmu dengan mendaftar ke kursus pertamamu.
      </p>
      <Link href="/course">
        <Button className="bg-merah-500 hover:bg-merah-600 text-white hover:scale-105 transition-all duration-200">
          Jelajahi Kursus
        </Button>
      </Link>
    </div>
  )
}
