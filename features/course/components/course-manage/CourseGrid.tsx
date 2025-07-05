'use client'

import { useState } from 'react'
import { CheckSquare, Square, Trash2, Settings } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { useCourseSearch } from '../../hooks/useCourseSearch'
import { useCourseManagement } from '../../hooks/useCourseManagement'
import { Button } from '@/components/ui/button'

export function CourseGrid() {
  // Component state untuk UI interactions
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
  const [isSelectMode, setIsSelectMode] = useState(false)

  // Feature state dari hooks
  const { courses, isLoading, deleteMultipleCourses } = useCourseManagement()
  const { filteredCourses, hasActiveFilters } = useCourseSearch(courses)

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourses((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(courseId)) {
        newSet.delete(courseId)
      } else {
        newSet.add(courseId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedCourses.size === filteredCourses.length) {
      setSelectedCourses(new Set())
    } else {
      setSelectedCourses(new Set(filteredCourses.map((course) => course.id)))
    }
  }

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode)
    if (isSelectMode) {
      setSelectedCourses(new Set())
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedCourses.size === 0) return

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus ${selectedCourses.size} kursus yang dipilih?`,
    )
    if (confirmed) {
      const courseIds = Array.from(selectedCourses)
      await deleteMultipleCourses(courseIds)
      setSelectedCourses(new Set())
      setIsSelectMode(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(340px,1fr))] auto-rows-max">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card-ancient animate-pulse h-80">
            <div className="h-48 bg-beige-200 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-beige-200 rounded"></div>
              <div className="h-4 bg-beige-100 rounded"></div>
              <div className="h-4 bg-beige-100 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-beige-900 mb-2">
          {hasActiveFilters ? 'Tidak ada kursus ditemukan' : 'Belum ada kursus'}
        </h3>
        <p className="text-beige-700">
          {hasActiveFilters
            ? 'Coba ubah kata kunci pencarian atau filter yang Anda gunakan'
            : 'Mulai dengan membuat kursus pertama Anda'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Selection Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectMode}
            className={`btn-secondary transition-all duration-300 ${
              isSelectMode ? 'bg-secondary-100 border-secondary-400' : ''
            }`}
          >
            {isSelectMode ? (
              <CheckSquare className="h-4 w-4 mr-2" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            {isSelectMode ? 'Keluar dari Mode Pilih' : 'Mode Pilih'}
          </Button>

          {isSelectMode && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="btn-secondary"
              >
                {selectedCourses.size === filteredCourses.length ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Hapus Semua Pilihan
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Pilih Semua
                  </>
                )}
              </Button>

              {selectedCourses.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="bg-red-100 border-red-300 text-red-600 hover:bg-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus {selectedCourses.size} Kursus
                </Button>
              )}
            </>
          )}
        </div>

        {isSelectMode && (
          <span className="text-sm text-beige-700">
            {selectedCourses.size} dari {filteredCourses.length} kursus dipilih
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(340px,1fr))] auto-rows-max">
        {filteredCourses.map((course, index) => (
          <div key={course.id} className="relative">
            {isSelectMode && (
              <div className="absolute top-4 left-4 z-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCourseSelect(course.id)}
                  className={`w-8 h-8 p-0 rounded-full transition-all duration-300 ${
                    selectedCourses.has(course.id)
                      ? 'bg-secondary-500 border-secondary-500 text-white'
                      : 'bg-white/80 border-beige-300 hover:border-secondary-400'
                  }`}
                >
                  {selectedCourses.has(course.id) ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            <CourseCard course={course} index={index} />
          </div>
        ))}
      </div>
    </div>
  )
}
