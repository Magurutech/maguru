'use client'

import { CourseCatalogBanner } from '@/features/course/components/course-catalog/CourseCatalogBanner'
import { CourseCatalogPageHeader } from '@/features/course/components/course-catalog/CourseCatalogPageHeader'
import { CourseCatalogHeader } from '@/features/course/components/course-catalog/CourseCatalogHeader'
import { CategoryTabs } from '@/features/course/components/course-catalog/CategoryTabs'
import { ResultsCount } from '@/features/course/components/course-catalog/ResultsCount'
import { CourseCatalogGrid } from '@/features/course/components/course-catalog/CourseCatalogGrid'
import { LoadMoreButton } from '@/features/course/components/course-catalog/LoadMoreButton'
import { CourseContextProvider } from '@/features/course/contexts/courseContext'

// Clean page.tsx - no props drilling
function CourseCatalogContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDE0] via-[#F0E6D6] to-[#EBE0CC]">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-200/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <CourseCatalogBanner />
        <CourseCatalogPageHeader />
        <CourseCatalogHeader /> {/* No props */}
        <CategoryTabs /> {/* No props */}
        <ResultsCount /> {/* No props */}
        <CourseCatalogGrid /> {/* No props */}
        <LoadMoreButton /> {/* No props */}
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
