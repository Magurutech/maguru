'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import { CourseCard } from '@/features/course/components/CourseCard'
import { CourseListItem, CourseProgress } from '@/features/course/types/course.types'
import { getCourses, getAllCourseProgress } from '@/features/course/api'
import { BookOpen, Filter, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function CourseGrid() {
  const [courses, setCourses] = useState<CourseListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('title')

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await getCourses()
        const allProgress = getAllCourseProgress()

        // Merge progress data with courses
        const coursesWithProgress = response.courses.map(course => ({
          ...course,
          progress: allProgress[course.slug]
        }))

        setCourses(coursesWithProgress)
      } catch (error) {
        console.error('Error loading courses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel.toLowerCase()

      return matchesSearch && matchesLevel
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'instructor':
          return a.instructor.localeCompare(b.instructor)
        case 'duration':
          return a.duration.localeCompare(b.duration)
        case 'progress':
          const aProgress = a.progress?.completionPercentage || 0
          const bProgress = b.progress?.completionPercentage || 0
          return bProgress - aProgress
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Belum ada kursus tersedia
        </h3>
        <p className="text-gray-500">
          Kursus akan segera tersedia. Silakan kembali lagi nanti.
        </p>
      </div>
    )
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Tidak ada kursus yang ditemukan
        </h3>
        <p className="text-gray-500">
          Coba ubah filter atau kata kunci pencarian Anda.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredCourses.map((course, index) => (
        <CourseCard
          key={course.slug}
          course={course}
          progress={course.progress}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  )
}

export default function CoursePage() {
  const [courses, setCourses] = useState<CourseListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('title')

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await getCourses()
        const allProgress = getAllCourseProgress()

        // Merge progress data with courses
        const coursesWithProgress = response.courses.map(course => ({
          ...course,
          progress: allProgress[course.slug]
        }))

        setCourses(coursesWithProgress)
      } catch (error) {
        console.error('Error loading courses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel.toLowerCase()

      return matchesSearch && matchesLevel
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'instructor':
          return a.instructor.localeCompare(b.instructor)
        case 'duration':
          return a.duration.localeCompare(b.duration)
        case 'progress':
          const aProgress = a.progress?.completionPercentage || 0
          const bProgress = b.progress?.completionPercentage || 0
          return bProgress - aProgress
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-beige-50">
        <div className="container mx-auto px-4 py-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
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
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Belum ada kursus tersedia
            </h3>
            <p className="text-gray-500">
              Kursus akan segera tersedia. Silakan kembali lagi nanti.
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak ada kursus yang ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah filter atau kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <CourseCard
                key={course.slug}
                course={course}
                progress={course.progress}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}