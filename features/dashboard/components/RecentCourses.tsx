'use client'

/**
 * Recent Courses Component
 *
 * Menampilkan daftar kursus yang terakhir diakses user.
 * Mengikuti Ancient Fantasy Asia design system.
 */

import { Clock, User as UserIcon, ChevronRight } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatDate } from '../utils'
import type { RecentCourse } from '../types'

interface RecentCoursesProps {
  courses: RecentCourse[]
  onContinue?: (courseId: string) => void
  onViewAll?: () => void
}

/**
 * Recent Courses Component
 *
 * Menampilkan kursus dengan progress bar, instructor, dan tanggal akses terakhir.
 * Tombol berubah teks berdasarkan status kelengkapan:
 * - Progress < 100%: "Lanjut"
 * - Progress = 100%: "Review"
 */
export function RecentCourses({ courses, onContinue, onViewAll }: RecentCoursesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="recent-courses-title" className="text-xl font-semibold text-beige-900">
          Kursus Terakhir
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-merah-500 hover:text-merah-600 text-sm font-medium flex items-center gap-1 transition-colors"
            aria-label="Lihat semua kursus"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div
        className="space-y-3"
        role="list"
        aria-labelledby="recent-courses-title"
      >
        {courses.map((course) => (
          <article
            key={course.id}
            className="glass-panel-light rounded-lg p-4 hover:bg-beige-50 transition-colors duration-200"
            role="listitem"
            aria-label={`${course.title}, progress ${course.progress}%, terakhir diakses ${formatDate(course.lastAccessed)}`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-beige-900 truncate">{course.title}</h3>
                {course.instructor && (
                  <div className="flex items-center gap-1 text-sm text-beige-600 mt-1">
                    <UserIcon className="w-4 h-4" aria-hidden="true" />
                    <span>{course.instructor}</span>
                  </div>
                )}
              </div>

              {onContinue && (
                <button
                  onClick={() => onContinue(course.id)}
                  className="shrink-0 px-4 py-2 bg-merah-500 hover:bg-merah-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  aria-label={`${course.progress >= 100 ? 'Review' : 'Lanjutkan'} ${course.title}`}
                >
                  {course.progress >= 100 ? 'Review' : 'Lanjut'}
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-beige-600">Progress</span>
                <span className="font-medium text-beige-900" aria-label={`Progress ${course.progress} persen`}>
                  {course.progress}%
                </span>
              </div>
              <Progress value={course.progress} className="h-2" aria-label={`Progress pembelajaran ${course.progress} persen`} />
              <div className="flex items-center gap-1 text-xs text-beige-500">
                <Clock className="w-3 h-3" aria-hidden="true" />
                <span>{formatDate(course.lastAccessed)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
