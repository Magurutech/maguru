import { Suspense } from 'react'
import { BookOpen } from 'lucide-react'
import { CourseFilters } from '../../features/cms/components/student/learn/CourseFilters'
import { CoursePagination } from '../../features/cms/components/student/learn/CoursePagination'
import { CourseCard } from '../../features/cms/components/student/CourseCard'

/**
 * Course Catalog Page — /course
 *
 * Server component. Reads searchParams, fetches from /api/courses,
 * renders grid of CourseCards with filters and pagination.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.8, 1.9, 1.10
 */

interface SearchParams {
  page?: string
  category?: string
  difficulty?: string
  search?: string
}

interface CourseItem {
  id: string
  title: string
  description: string | null
  category: string
  difficulty: string | null
  status: string
  sectionCount?: number
  lessonCount?: number
  enrolled: boolean
}

interface CoursesResponse {
  courses: CourseItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

async function fetchCourses(params: SearchParams): Promise<CoursesResponse> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.category) query.set('category', params.category)
  if (params.difficulty) query.set('difficulty', params.difficulty)
  if (params.search) query.set('search', params.search)

  // Use absolute URL for server-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/courses?${query.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return { courses: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } }
  }

  return res.json()
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
    <div className="min-h-screen bg-linear-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-beige-900 font-serif mb-2">
            Katalog Kursus
          </h1>
          <p className="text-beige-600">
            Temukan kursus yang sesuai dengan minat dan tujuan belajarmu.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-beige-200 shadow-sm p-4 mb-8">
          <Suspense fallback={<div className="h-10 bg-beige-100 rounded animate-pulse" />}>
            <CourseFilters />
          </Suspense>
        </div>

        {/* Results count */}
        {pagination.total > 0 && (
          <p className="text-sm text-beige-500 mb-4">
            Menampilkan {courses.length} dari {pagination.total} kursus
            {params.search && (
              <span>
                {' '}untuk <span className="font-medium text-beige-700">&ldquo;{params.search}&rdquo;</span>
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
      <div className="flex items-center justify-center w-16 h-16 bg-beige-100 rounded-full mb-4">
        <BookOpen className="w-8 h-8 text-beige-400" />
      </div>
      <h2 className="text-xl font-semibold text-beige-800 mb-2">
        {hasFilters ? 'Tidak ada kursus yang cocok' : 'Belum ada kursus tersedia'}
      </h2>
      <p className="text-beige-500 max-w-sm">
        {hasFilters
          ? 'Coba ubah filter atau kata kunci pencarianmu.'
          : 'Kursus akan segera tersedia. Pantau terus!'}
      </p>
    </div>
  )
}
