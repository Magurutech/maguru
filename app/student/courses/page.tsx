import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/features/cms/components/student/CourseCard'
import { getMyEnrollments } from '@/features/cms/services/enrollment.service'

/**
 * My Courses Page — /student/courses
 *
 * Server component. Auth-protected.
 * Calls getMyEnrollments directly to avoid extra HTTP round-trip.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

export default async function MyCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { enrollments } = await getMyEnrollments(user.id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Header */}
      <div className="border-b border-border/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">
          Kursus Saya
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Kelola dan lanjutkan pembelajaran Anda di Maguru
        </p>
      </div>

      {/* Grid or Empty state */}
      {enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border/20 rounded-2xl p-8 text-center bg-card/30">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-foreground">Belum ada kursus yang diikuti</h2>
          <p className="text-muted-foreground text-sm max-w-sm mt-1 mb-6">
            Anda belum mendaftar di kursus manapun. Jelajahi katalog kami dan mulai belajar hari ini!
          </p>
          <Link href="/courses">
            <Button variant="default">Jelajahi Katalog Kursus</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(({ id, course, progress, enrolledAt }) => (
            <CourseCard
              key={id}
              course={course}
              progress={progress}
              enrolledAt={enrolledAt}
              enrolled
            />
          ))}
        </div>
      )}
    </div>
  )
}
