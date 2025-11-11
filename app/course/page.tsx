'use client'

import { useState, useMemo } from 'react'
import { Suspense } from 'react'
import { CourseCard } from '@/features/course/components/CourseCard'
import { useCourseList } from '@/features/course/hooks/useCourseList'
import { BookOpen, Filter, Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function CoursePageContent() {
  // Centralized course data management using hook
  const { courses, error, getCoursesFilteredAndSorted } = useCourseList()

  // Local UI state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('title')

  // Memoized filtered and sorted courses
  const filteredCourses = useMemo(() => {
    return getCoursesFilteredAndSorted(searchTerm, selectedLevel, sortBy)
  }, [getCoursesFilteredAndSorted, searchTerm, selectedLevel, sortBy])

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-beige-900 mb-2">
            Error Loading Courses
          </h3>
          <p className="text-beige-700 mb-4">
            {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-beige-50">
      {/* Decorative Elements */}
      <div className="fixed top-10 right-10 text-6xl opacity-10 whimsical-bounce">📚</div>
      <div className="fixed bottom-10 left-10 text-4xl opacity-20 whimsical-bounce animation-delay-1000">
        🎓
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-secondary-600" />
            <span className="text-beige-900 font-medium">Learning Paths</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-beige-900 mb-6 font-serif">
            Petualangan Belajar
            <span className="text-gradient-primary block mt-2">Terbaik Untukmu ✨</span>
          </h1>

          <p className="text-xl text-beige-700 max-w-3xl mx-auto leading-relaxed">
            Jelajahi learning path terstruktur yang dirancang untuk membantumu menguasai
            keterampilan baru dengan cara yang menyenangkan dan interaktif
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari kursus, instruktur, atau topik..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Pilih Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Level</SelectItem>
                <SelectItem value="beginner">Pemula</SelectItem>
                <SelectItem value="intermediate">Menengah</SelectItem>
                <SelectItem value="advanced">Lanjutan</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Judul (A-Z)</SelectItem>
                <SelectItem value="instructor">Instruktur (A-Z)</SelectItem>
                <SelectItem value="duration">Durasi</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedLevel('all')
                setSortBy('title')
              }}
              className="w-full lg:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset Filter
            </Button>
          </div>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-beige-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-beige-900 mb-2">
              Belum ada kursus tersedia
            </h3>
            <p className="text-beige-700">
              Kursus akan segera tersedia. Silakan kembali lagi nanti.
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-beige-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-beige-900 mb-2">
              Tidak ada kursus yang ditemukan
            </h3>
            <p className="text-beige-700">
              Coba ubah filter atau kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <div
                key={course.slug}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CourseCard
                  course={course}
                  progress={course.progress}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CoursePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-beige-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-secondary-600" />
                <p className="text-lg text-beige-700">Loading courses...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CoursePageContent />
    </Suspense>
  )
}