import { notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { CourseOverviewHero } from '@/features/cms/components/student/overview/CourseOverviewHero'
import { CourseCurriculum } from '@/features/cms/components/student/overview/CourseCurriculum'
import { CourseEnrollButton } from '@/features/cms/components/student/overview/CourseEnrollButton'
import type { CourseDetail, OverviewSection } from '@/features/cms/components/student/overview/types'
import prisma from '@/prisma/lib/client'

/**
 * Course Detail / Overview Page — /course/[slug]
 *
 * Server component. Accessible by anyone for PUBLISHED courses.
 * Shows course info, curriculum preview, and enroll/continue CTA.
 *
 * Requirements: 1.5, 1.6, 1.7, 2.1, 2.2, 7.3, 7.4, 7.5
 */

interface PageProps {
  params: Promise<{ slug: string }>
}

async function fetchCourseDetail(slug: string): Promise<CourseDetail | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/courses/${slug}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

async function fetchCourseSections(slug: string): Promise<OverviewSection[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/courses/${slug}/sections`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  return data.sections ?? []
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

  const [course, sections] = await Promise.all([
    fetchCourseDetail(slug),
    fetchCourseSections(slug),
  ])

  if (!course) notFound()

  // Check enrollment status (optional auth)
  const user = await currentUser()
  const enrolled = user ? await checkEnrollment(user.id, course.id) : false

  return (
    <div className="min-h-screen bg-linear-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back to catalog */}
        <Link
          href="/course"
          className="inline-flex items-center gap-1.5 text-sm text-beige-500 hover:text-beige-800 transition-colors mb-6"
          data-testid="back-to-catalog"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>

        <div className="flex flex-col gap-6">
          {/* Hero: title, description, stats, CTA */}
          <CourseOverviewHero course={course} sections={sections}>
            <CourseEnrollButton
              courseSlug={course.slug}
              courseTitle={course.title}
              initialEnrolled={enrolled}
            />
          </CourseOverviewHero>

          {/* Curriculum */}
          <CourseCurriculum sections={sections} />
        </div>
      </div>
    </div>
  )
}
