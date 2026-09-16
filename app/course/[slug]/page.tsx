import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'

// Components
import { PremiumHero } from '@/features/cms/components/student/overview/PremiumHero'
import { PremiumCourseTabs } from '@/features/cms/components/student/overview/PremiumCourseTabs'
import { PremiumSidebar } from '@/features/cms/components/student/overview/PremiumSidebar'
import { CourseEnrollButton } from '@/features/cms/components/student/overview/CourseEnrollButton'

// Types
import type {
  CourseDetail,
  OverviewSection as SectionType,
  CreatorProfile,
} from '@/features/cms/components/student/overview/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getDynamicBaseUrl(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
  return `${protocol}://${host}`
}

async function fetchCourseDetail(slug: string): Promise<CourseDetail | null> {
  try {
    const baseUrl = await getDynamicBaseUrl()
    const res = await fetch(`${baseUrl}/api/courses/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) return null
    return await res.json()
  } catch {
    return null
  }
}

async function fetchCourseSections(slug: string): Promise<SectionType[]> {
  try {
    const baseUrl = await getDynamicBaseUrl()
    const res = await fetch(`${baseUrl}/api/courses/${slug}/sections`, { cache: 'no-store' })
    if (!res.ok) return []
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) return []
    const data = await res.json()
    return data.sections ?? []
  } catch {
    return []
  }
}

async function fetchCourseCreator(slug: string): Promise<CreatorProfile | null> {
  try {
    const baseUrl = await getDynamicBaseUrl()
    const res = await fetch(`${baseUrl}/api/courses/${slug}/creator`, { cache: 'no-store' })
    if (!res.ok) return null
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) return null
    return await res.json()
  } catch {
    return null
  }
}

async function checkEnrollment(userId: string, courseId: string): Promise<boolean> {
  const enrollment = await prisma.enrollments.findFirst({
    where: { userId, courseId },
    select: { id: true },
  })
  return !!enrollment
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params

  const [course, sections, creator] = await Promise.all([
    fetchCourseDetail(slug),
    fetchCourseSections(slug),
    fetchCourseCreator(slug),
  ])

  if (!course) notFound()

  // Check enrollment status (optional auth)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const enrolled = user ? await checkEnrollment(user.id, course.id) : false

  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0)

  return (
    <div className="relative min-h-screen text-text-primary  bg-bg-canvas paper-texture pb-20 md:pb-32">
      {/* Ambient backgrounds */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-bg-canvas"
      >
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.06] dark:opacity-[0.08] bg-accent-coral" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.05] dark:opacity-[0.07] bg-accent-mustard" />
      </div>

      <div className="relative z-10 max-w-7xl w-[90%] mx-auto py-0 md:py-4">
        {/* Hidden H1 for SEO and specs */}
        <h1 className="sr-only">{course.title}</h1>

        {/* Page content grids: Left (Hero + Tabs) & Right (Sticky Sidebar Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-6">
          {/* Main Content & Header Area */}
          <main className="lg:col-span-8 space-y-10 sm:space-y-12">
            {/* Premium Hero section */}
            <PremiumHero
              course={course}
              totalLessons={totalLessons}
              instructorRating={4.8}
              creatorRating={creator?.stats?.rating}
            />

            {/* Premium Course Tabs: Description, Learning Path, Testimonials */}
            <PremiumCourseTabs course={course} sections={sections} creator={creator} />
          </main>

          {/* Sticky Enrollment Sidebar Panel wrapper column (stretches to allow sticky child sliding) */}
          <aside className="lg:col-span-4">
            <PremiumSidebar course={course} enrolled={enrolled} creator={creator}>
              <CourseEnrollButton
                courseSlug={course.slug}
                courseTitle={course.title}
                initialEnrolled={enrolled}
              />
            </PremiumSidebar>
          </aside>
        </div>
      </div>
    </div>
  )
}
