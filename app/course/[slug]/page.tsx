import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'

// Components
import { PremiumHero } from '@/features/cms/components/student/overview/PremiumHero'
import { PremiumCourseTabs } from '@/features/cms/components/student/overview/PremiumCourseTabs'
import { PremiumSidebar, TabletCoursePreview, SenseiMentorCard } from '@/features/cms/components/student/overview/PremiumSidebar'
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
    <div className="relative min-h-screen text-[#2D2319] bg-[#FAF5ED] pb-16 sm:pb-24">
      {/* Ambient backgrounds */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FAF5ED]"
      >
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-15 bg-[#FFB148]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-15 bg-[#8C4FFF]" />
      </div>

      <div className="relative z-10 max-w-7xl w-[92%] sm:w-[90%] mx-auto py-4 sm:py-5">
        {/* Hidden H1 for SEO and specs */}
        <h1 className="sr-only">{course.title}</h1>

        {/* Page content grids: Left (Hero + Tabs) & Right (Sticky Sidebar Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 mt-3">
          {/* Main Content & Header Area (Tightened Gap) */}
          <main className="lg:col-span-8 space-y-4 sm:space-y-5">
            {/* Premium Hero section with Ancient Fantasy Banner */}
            <PremiumHero
              course={course}
              totalLessons={totalLessons}
              totalSections={sections.length}
              instructorRating={4.8}
              creatorRating={creator?.stats?.rating}
            />

            {/* ── TABLET PREVIEW & CTA CARD (Placed ABOVE tabs on Tablet) ── */}
            <div className="block lg:hidden">
              <TabletCoursePreview course={course} enrolled={enrolled}>
                <CourseEnrollButton
                  courseSlug={course.slug}
                  courseTitle={course.title}
                  initialEnrolled={enrolled}
                />
              </TabletCoursePreview>
            </div>

            {/* Premium Course Tabs: Kurikulum, Deskripsi, Ulasan */}
            <PremiumCourseTabs course={course} sections={sections} creator={creator} />

            {/* ── TABLET SENSEI AI MENTOR WIDGET (Bottom of tablet page) ── */}
            <div className="block lg:hidden pt-2">
              <SenseiMentorCard />
            </div>
          </main>

          {/* Sticky Enrollment Sidebar Panel wrapper column (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-4">
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
