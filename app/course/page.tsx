'use client'

import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { CourseCatalogBanner } from '@/features/course/components/course-catalog/CourseCatalogBanner'
import { CourseCatalogPageHeader } from '@/features/course/components/course-catalog/CourseCatalogPageHeader'
import { CourseCatalogHeader } from '@/features/course/components/course-catalog/CourseCatalogHeader'
import { CategoryTabs } from '@/features/course/components/course-catalog/CategoryTabs'
import { ResultsCount } from '@/features/course/components/course-catalog/ResultsCount'
import { CourseCatalogGrid } from '@/features/course/components/course-catalog/CourseCatalogGrid'
import { LoadMoreButton } from '@/features/course/components/course-catalog/LoadMoreButton'
import { CourseContextProvider } from '@/features/course/contexts/courseContext'
import type { CourseCatalogItem } from '@/features/course/types'
import { mockCoursesCatalog } from '@/features/course/lib/mockData'


const categories = ['All', 'Martial Arts', 'Culture', 'Arts', 'Spirituality', 'Crafts', 'Dance']
const sortOptions = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

// Inner component yang menggunakan hooks dan context
function CourseCatalogContent() {
  const [courses, setCourses] = useState<CourseCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popularity')
  const [showBanner, setShowBanner] = useState(true)

  // Simulate loading courses
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setCourses(mockCoursesCatalog)
      setLoading(false)
    }
    loadCourses()
  }, [])

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.students - a.students
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        default:
          return 0
      }
    })

    return filtered
  }, [courses, searchQuery, selectedCategory, sortBy])

  const handleEnroll = (courseId: string) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === courseId ? { ...course, enrolled: true } : course)),
    )
    const course = courses.find((c) => c.id === courseId)
    toast.success(`You've successfully enrolled in "${course?.title}". Start learning now!`)
  }

  const handleWishlist = (courseId: string) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, wishlist: !course.wishlist } : course,
      ),
    )
    const course = courses.find((c) => c.id === courseId)
    const isAdding = !course?.wishlist
    toast.success(
      isAdding
        ? `"${course?.title}" has been added to your wishlist.`
        : `"${course?.title}" has been removed from your wishlist.`,
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSortBy('popularity')
  }

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'All' || sortBy !== 'popularity'

  const handleLoadMore = () => {
    // TODO: Implement load more functionality
    console.log('Load more courses')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDE0] via-[#F0E6D6] to-[#EBE0CC]">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-200/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <CourseCatalogBanner showBanner={showBanner} onClose={() => setShowBanner(false)} />
        <CourseCatalogPageHeader />

        <CourseCatalogHeader
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <ResultsCount count={filteredAndSortedCourses.length} loading={loading} />

        <CourseCatalogGrid
          courses={filteredAndSortedCourses}
          loading={loading}
          onEnroll={handleEnroll}
          onWishlist={handleWishlist}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <LoadMoreButton
          hasMoreCourses={!loading && filteredAndSortedCourses.length > 0}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  )
}

// Main component dengan provider
export default function CourseCatalogPage() {
  return (
    <CourseContextProvider>
      <CourseCatalogContent />
    </CourseContextProvider>
  )
}
