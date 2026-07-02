'use client'

/**
 * Creator Courses Library Page
 *
 * Halaman daftar lengkap semua kursus milik pembuat (Creator) yang direfaktorisasi
 * secara modular menggunakan pustaka komponen features/creator-dashboard.
 * Menyediakan filter kategori, filter status, pencarian judul, serta
 * pengalih tampilan Grid/List interaktif.
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRoleGuard, useRoleLoadingState, useUserRole } from '@/features/auth'
import { 
  LibraryHeader, 
  LibraryOverview, 
  LibraryAIInsights, 
  LibraryControls, 
  LibraryCourseCard, 
  LibraryEmptyState 
} from '@/features/creator-dashboard'
import type { CourseData } from '@/features/creator-dashboard/components/LibraryCourseCard'

interface APICourse {
  id: string
  title: string
  description?: string | null
  slug: string
  status?: string
  category?: string
  enrollmentCount?: number
  difficulty?: string
  rating?: number
  completionRate?: number
  updatedAt?: string | Date
  createdAt?: string | Date
}

interface CreatorStats {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalStudents: number
  avgRating: number
}

export default function CreatorCoursesPage() {
  const router = useRouter()
  const { role } = useUserRole()
  const { canAccessCreator } = useRoleGuard()
  const { shouldShowLoader: roleLoading } = useRoleLoadingState()

  // State Management
  const [courses, setCourses] = useState<CourseData[]>([])
  const [stats, setStats] = useState<CreatorStats>({ 
    totalCourses: 0, 
    publishedCourses: 0, 
    draftCourses: 0,
    totalStudents: 0,
    avgRating: 4.8
  })
  const [loading, setLoading] = useState(true)

  // Filter & Search states
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Pagination states
  const [visibleCount, setVisibleCount] = useState(6)

  // Fetch courses list
  useEffect(() => {
    if (roleLoading) return
    if (!canAccessCreator()) return

    async function fetchCourses() {
      try {
        const res = await fetch('/api/creator/courses')
        if (res.ok) {
          const data = await res.json()
          
          // Map API response to match our internal CourseData interface
          const mappedCourses: CourseData[] = (data.courses || []).map((c: APICourse) => ({
            id: c.id,
            title: c.title,
            description: c.description || 'Belum ada deskripsi kelas.',
            slug: c.slug,
            status: c.status || 'DRAFT',
            category: c.category || 'Pemrograman',
            enrollmentCount: c.enrollmentCount || 0,
            difficulty: c.difficulty || 'intermediate',
            rating: c.rating || 4.8,
            completionRate: c.completionRate || 85,
            updatedAt: c.updatedAt || c.createdAt || new Date(),
            // Mock AI Insight for draft courses or low enrollment courses
            aiInsight: c.status === 'DRAFT' 
              ? 'Draf kelas ini sudah lengkap 60%. Siswa React Anda siap untuk kelas lanjutan.' 
              : (c.enrollmentCount || 0) < 10 
                ? 'Siswa kesulitan di kuis Bab 2. Coba tambahkan latihan sandbox.' 
                : undefined
          }))

          setCourses(mappedCourses)
          
          // Compute summary stats dynamically
          const published = mappedCourses.filter(c => c.status === 'PUBLISHED').length
          const drafts = mappedCourses.filter(c => c.status === 'DRAFT').length
          const totalS = mappedCourses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0)

          setStats({
            totalCourses: mappedCourses.length,
            publishedCourses: published,
            draftCourses: drafts,
            totalStudents: totalS,
            avgRating: 4.8
          })
        }
      } catch (err) {
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [roleLoading, role]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter and Search Logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || course.status === statusFilter
    const matchesCategory = categoryFilter === 'ALL' || course.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Sorting Logic
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    }
    if (sortBy === 'oldest') {
      return new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime()
    }
    if (sortBy === 'students') {
      return (b.enrollmentCount || 0) - (a.enrollmentCount || 0)
    }
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0)
    }
    return 0
  })

  // Paginated Courses
  const paginatedCourses = sortedCourses.slice(0, visibleCount)

  // Loading State / Skeletons
  if (roleLoading || loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-28 bg-bg-bone rounded-2xl border border-border/10 p-6 flex flex-col justify-between">
          <div className="h-6 w-1/4 bg-bg-surface-accent rounded"></div>
          <div className="h-4 w-1/3 bg-bg-surface-accent rounded"></div>
        </div>

        {/* Overview cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-bg-bone rounded-2xl border border-border/10"></div>
          ))}
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-bg-bone rounded-3xl border border-border/10" />
          ))}
        </div>
      </div>
    )
  }

  // Error State - Access Denied
  if (!canAccessCreator()) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-card border border-border/15 rounded-2xl p-8 max-w-md text-center paper-texture">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-xl font-manrope font-bold text-text-primary mb-2">Akses Ditolak</h1>
          <p className="text-text-secondary text-sm mb-6">Anda tidak memiliki otorisasi untuk mengakses studio pembuat ini.</p>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Page Header */}
      <LibraryHeader 
        courseCount={stats.totalCourses}
        publishedCount={stats.publishedCourses}
        draftCount={stats.draftCourses}
      />

      {/* 2. Overview summary cards */}
      <LibraryOverview 
        stats={{
          published: stats.publishedCourses,
          draft: stats.draftCourses,
          totalStudents: stats.totalStudents,
          avgRating: stats.avgRating
        }} 
      />

      {/* 3. AI Insights Banner */}
      <LibraryAIInsights />

      {/* 4. Controls (Search, Filters, view switchers) */}
      <LibraryControls 
        search={search}
        setSearch={setSearch}
        status={statusFilter}
        setStatus={setStatusFilter}
        category={categoryFilter}
        setCategory={setCategoryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* 5. Course Library Grid / List view rendering */}
      {filteredCourses.length === 0 ? (
        <LibraryEmptyState />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="course-grid">
          {paginatedCourses.map((course) => (
            <LibraryCourseCard 
              key={course.id}
              course={course}
              onManage={(slug) => router.push(`/creator/courses/${slug}/manage`)}
              onAnalytics={(slug) => router.push(`/creator/courses/${slug}/analytics`)}
            />
          ))}
        </div>
      ) : (
        /* Compact List View */
        <div className="space-y-3 bg-card border border-border/10 rounded-3xl p-5 paper-texture divide-y divide-border/5">
          {paginatedCourses.map((course) => (
            <div key={course.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary">{course.title}</span>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-success/5 text-success border-success/15'
                      : 'bg-accent-mustard/10 text-accent-mustard border-accent-mustard/15'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted">
                  Kategori: {course.category} &middot; Siswa: {course.enrollmentCount} &middot; Rating: {course.rating}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => router.push(`/creator/courses/${course.slug}/manage`)}
                  className="px-3.5 py-1.5 bg-bg-bone hover:bg-bg-surface-accent border border-border/10 rounded-full text-[10px] font-bold text-text-secondary cursor-pointer"
                >
                  Kelola
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Pagination / Load More */}
      {sortedCourses.length > visibleCount && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="px-6 py-2.5 bg-card hover:bg-bg-surface-accent border border-border/10 rounded-full text-xs font-bold text-text-secondary transition-colors cursor-pointer select-none"
          >
            Muat Lebih Banyak Kursus
          </button>
        </div>
      )}
    </div>
  )
}
