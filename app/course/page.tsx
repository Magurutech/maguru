import { Suspense } from 'react'
import { BookOpen } from 'lucide-react'
import { CourseFilters } from '../../features/cms/components/student/learn/CourseFilters'
import { CoursePagination } from '../../features/cms/components/student/learn/CoursePagination'
import { CourseCard } from '../../features/cms/components/student/CourseCard'
import type { CourseCardCourse, Pagination } from '@/features/cms/types'

/**
 * Course Catalog Page — /course
 *
 * Server component. Reads searchParams, fetches from /api/courses,
 * renders grid of CourseCards with filters and pagination.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.8, 1.9, 1.10
 */

import { headers } from 'next/headers'

// String-keyed searchParams from Next.js page props
interface SearchParams {
  page?: string
  category?: string
  difficulty?: string
  search?: string
}

interface CoursesResponse {
  courses: (CourseCardCourse & { enrolled: boolean })[]
  pagination: Pagination
}

async function getDynamicBaseUrl(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
  return `${protocol}://${host}`
}

async function fetchCourses(params: SearchParams): Promise<CoursesResponse> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.category) query.set('category', params.category)
  if (params.difficulty) query.set('difficulty', params.difficulty)
  if (params.search) query.set('search', params.search)

  try {
    const baseUrl = await getDynamicBaseUrl()
    const res = await fetch(`${baseUrl}/api/courses?${query.toString()}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return { courses: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } }
    }

    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return { courses: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } }
    }

    return await res.json()
  } catch {
    return { courses: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } }
  }
}

export default async function CourseCatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const data = await fetchCourses(params)
  const { courses, pagination } = data
  const currentPage = pagination.page

  return (
    <div className="relative min-h-screen overflow-x-hidden text-text-primary bg-bg-canvas">
      {/* ── LAYER 0: Fixed Ambient Gradient Mesh ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-500 bg-bg-canvas"
      >
        {/* Soft Coral radial glow at top-right */}
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.07] dark:opacity-[0.09] bg-accent-coral" />

        {/* Soft Mustard radial glow at bottom-left */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.06] dark:opacity-[0.08] bg-accent-mustard" />
      </div>

      <div className="relative z-10 max-w-7xl w-[90%] mx-auto py-10 md:py-16">
        {/* E2E Hidden H1 Assertion */}
        <h1 className="sr-only">Katalog Kursus</h1>

        {/* Coordinate Section Rule */}
        <div className="border-t border-text-primary/12 dark:border-white/12 pt-4 mb-10 flex justify-between items-center text-[10.5px] tracking-[0.18em] uppercase text-text-faint font-sans">
          <span>Katalog Kursus</span>
          <span className="font-mono text-[10px] tracking-normal lowercase">§ 01 — explore</span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-16">
          {/* Left Column: Heading & Subtitle */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary leading-tight">
              Kuasai <em className="font-serif italic font-medium text-accent-coral not-italic">Skill</em> yang Relevan &amp; Terukur.
            </h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl">
              Jelajahi kurikulum berbasis proyek yang dirancang untuk membantumu mencapai pemahaman mendalam dan penguasaan nyata secara terarah bersama bimbingan AI.
            </p>
          </div>

          {/* Right Column: Floating Stats Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[360px] glass-panel border border-text-primary/8 dark:border-white/8 rounded-[18px] p-6 shadow-md bg-bg-surface-accent/20 dark:bg-bg-surface-accent/10">
              <div className="flex justify-between items-center border-b border-text-primary/8 dark:border-white/8 pb-3 mb-4">
                <span className="font-sans text-[11px] font-semibold text-text-muted tracking-wider uppercase">
                  Metrik Maguru
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-coral animate-pulse" />
                  <span className="font-mono text-[9px] text-accent-coral uppercase tracking-wider font-bold">LIVE</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="block font-sans text-2xl font-extrabold text-text-primary tracking-tight">48+</span>
                  <span className="font-sans text-[10px] text-text-muted tracking-wide uppercase block mt-1 leading-tight">Kursus Aktif</span>
                </div>
                <div className="border-l border-text-primary/8 dark:border-white/8 pl-4">
                  <span className="block font-sans text-2xl font-extrabold text-text-primary tracking-tight">1.2k</span>
                  <span className="font-sans text-[10px] text-text-muted tracking-wide uppercase block mt-1 leading-tight">Pelajar</span>
                </div>
                <div className="border-l border-text-primary/8 dark:border-white/8 pl-4">
                  <span className="block font-sans text-2xl font-extrabold text-text-primary tracking-tight">94%</span>
                  <span className="font-sans text-[10px] text-text-muted tracking-wide uppercase block mt-1 leading-tight">Penguasaan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-panel border border-text-primary/8 dark:border-white/8 rounded-xl p-4 mb-8">
          <Suspense fallback={<div className="h-10 bg-bg-surface-accent/20 rounded animate-pulse" />}>
            <CourseFilters />
          </Suspense>
        </div>

        {/* Results count */}
        {pagination.total > 0 && (
          <p className="text-sm text-text-muted mb-6 font-sans">
            Menampilkan <span className="font-medium text-text-primary">{courses.length}</span> dari <span className="font-medium text-text-primary">{pagination.total}</span> kursus
            {params.search && (
              <span>
                {' '}untuk <span className="font-medium text-accent-coral">&ldquo;{params.search}&rdquo;</span>
              </span>
            )}
          </p>
        )}

        {/* Course Grid */}
        {courses.length === 0 ? (
          <EmptyState hasFilters={!!(params.search || params.category || params.difficulty)} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="course-grid">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrolled={course.enrolled}
                  catalogMode
                />
              ))}
            </div>

            <Suspense>
              <CoursePagination page={currentPage} totalPages={pagination.totalPages} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div data-testid="empty-state" className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-bg-surface-accent/30 rounded-full mb-4">
        <BookOpen className="w-8 h-8 text-text-muted" />
      </div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">
        {hasFilters ? 'Tidak ada kursus yang cocok' : 'Belum ada kursus tersedia'}
      </h2>
      <p className="text-text-muted max-w-sm">
        {hasFilters
          ? 'Coba ubah filter atau kata kunci pencarianmu.'
          : 'Kursus akan segera tersedia. Pantau terus!'}
      </p>
    </div>
  )
}
