import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface CreatorCourse {
  id: string
  title: string
  slug: string
  description: string | null
  status: string
  category: string | null
  difficulty: string | null
  sectionCount: number
  enrollmentCount: number
  createdAt: string
  updatedAt: string
}

interface CourseListItemProps {
  course: CreatorCourse
  isToggling?: boolean
  onTogglePublish?: (courseId: string) => void
  onManage?: (slug: string) => void
}

export function CourseListItem({ course }: CourseListItemProps) {
  const isPublished = course.status === 'PUBLISHED'

  return (
    <Link
      href={`/creator/courses/${course.id}/manage`}
      className="block p-5 hover:bg-beige-50 transition-colors duration-200 group"
      data-testid="creator-course-item"
      data-course-id={course.id}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-beige-900 mb-1 truncate group-hover:text-merah-600 transition-colors">
            {course.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isPublished
                  ? 'bg-hijau-100 text-hijau-800'
                  : 'bg-kuning-100 text-kuning-800'
              }`}
              data-testid="course-status-badge"
            >
              {course.status}
            </span>
            {course.difficulty ? (
              <span
                className="px-2 py-0.5 rounded-full text-xs bg-beige-100 text-beige-700"
                data-testid="course-difficulty-badge"
              >
                {course.difficulty}
              </span>
            ) : null}
            <span className="text-xs text-beige-500" data-testid="course-enrollment-count">
              {course.enrollmentCount ?? 0} siswa
            </span>
          </div>
        </div>

        <ArrowRight className="h-4 w-4 text-beige-300 group-hover:text-merah-400 transition-colors shrink-0 mt-0.5" />
      </div>

      <p className="text-xs text-beige-500 mt-2" data-testid="course-updated-at">
        Diupdate: {new Date(course.updatedAt).toLocaleDateString('id-ID')}
      </p>
    </Link>
  )
}
