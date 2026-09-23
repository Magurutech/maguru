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
      <div className="space-y-4 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-24 bg-[#FFFDF9]/60 rounded-3xl border border-[#D8C4A7]/30 p-5 flex flex-col justify-between" />

        {/* Overview cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-18 bg-[#FFFDF9]/60 rounded-2xl border border-[#D8C4A7]/30" />
          ))}
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-[#FFFDF9]/60 rounded-2xl border border-[#D8C4A7]/30" />
          ))}
        </div>
      </div>
    )
  }

  // Error State - Access Denied
  if (!canAccessCreator()) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-8 max-w-md text-center shadow-xs">
          <div className="text-5xl mb-4 select-none">🚫</div>
          <h1 className="text-xl font-sans font-bold text-[#2D2319] mb-2">Akses Ditolak</h1>
          <p className="text-[#6E5D4B] text-sm mb-6">Anda tidak memiliki otorisasi untuk mengakses studio pembuat ini.</p>
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center py-2.5 px-6 rounded-xl bg-[#2D2319] text-white font-sans text-xs font-semibold hover:bg-[#FF4D4D] transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1 sm:space-y-2 animate-fade-in pb-10">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4" data-testid="course-grid">
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
        <div className="space-y-2 bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-2xl p-4 shadow-xs divide-y divide-[#D8C4A7]/20">
          {paginatedCourses.map((course) => (
            <div key={course.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2D2319]">{course.title}</span>
                  <span className={`text-[8.5px] font-sans font-bold px-2 py-0.5 rounded-full border ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-[#5AC88A]/15 text-[#1B804B] border-[#5AC88A]/30'
                      : 'bg-[#FFB148]/15 text-[#B96500] border-[#FFB148]/30'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <p className="text-[10px] text-[#8C7D6E]">
                  Kategori: {course.category} &middot; Siswa: {course.enrollmentCount} &middot; Rating: {course.rating}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => router.push(`/creator/courses/${course.slug}/manage`)}
                  className="px-3.5 py-1.5 bg-[#FAF5ED] hover:bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-xl text-[10px] font-bold text-[#2D2319] cursor-pointer transition-colors shadow-2xs"
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
