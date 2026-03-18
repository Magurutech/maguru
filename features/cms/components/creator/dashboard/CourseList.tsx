import React from 'react'
import Link from 'next/link'
import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseListItem, type CreatorCourse } from './CourseListItem'

interface CourseListProps {
  courses: CreatorCourse[]
  isLoading: boolean
  onViewAll: () => void
  /** Max courses to display. Defaults to 5 */
  maxVisible?: number
}

export function CourseList({
  courses,
  isLoading,
  onViewAll,
  maxVisible = 5,
}: CourseListProps) {
  const visibleCourses = courses.slice(0, maxVisible)

  return (
    <div className="bg-white rounded-lg shadow-neu border border-beige-200">
      <div className="p-6 border-b border-beige-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-beige-900">Kursus Saya</h2>
          <Button
            variant="outline"
            size="sm"
            className="border-beige-300 text-beige-700 hover:bg-beige-50"
            onClick={onViewAll}
          >
            Lihat Semua
          </Button>
        </div>
      </div>

      <div className="divide-y divide-beige-100">
        {isLoading ? (
          <div className="p-6 text-center text-beige-600" data-testid="course-list-loading">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige-900 mx-auto mb-2" />
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="p-8 text-center" data-testid="empty-state">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-beige-400" />
            <p className="text-beige-700 font-medium mb-1">Belum ada kursus</p>
            <p className="text-sm text-beige-500 mb-4">Mulai perjalanan mengajar Anda sekarang</p>
            <Link href="/creator/courses/create">
              <Button className="bg-merah-500 hover:bg-merah-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Buat Kursus Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {visibleCourses.map((course) => (
              <CourseListItem key={course.id} course={course} />
            ))}
            {courses.length > maxVisible && (
              <div className="p-4 text-center">
                <button
                  onClick={onViewAll}
                  className="text-xs text-merah-600 hover:text-merah-700 font-medium hover:underline"
                >
                  +{courses.length - maxVisible} kursus lainnya — Lihat Semua
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
