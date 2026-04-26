import { BookOpen, Layers, Tag, BarChart3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { CourseDetail, OverviewSection } from './types'
import { getDifficultyClass } from '@/features/cms/utils/difficulty-colors'

/**
 * CourseOverviewHero
 *
 * Displays course title, description, metadata, and stats.
 * CTA slot is passed as children so the server page can inject
 * the appropriate client-side enroll/continue button.
 */

interface CourseOverviewHeroProps {
  course: CourseDetail
  sections: OverviewSection[]
  children?: React.ReactNode // CTA button slot
}

export function CourseOverviewHero({ course, sections, children }: CourseOverviewHeroProps) {
  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0)
  const difficultyClass = getDifficultyClass(course.difficulty)

  return (
    <div
      data-testid="course-overview-hero"
      className="bg-white rounded-2xl border border-beige-200 shadow-sm p-6 sm:p-8"
    >
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge
          variant="outline"
          className="text-xs bg-beige-50 text-beige-700 border-beige-200"
          data-testid="hero-category"
        >
          <Tag className="w-3 h-3 mr-1" />
          {course.category}
        </Badge>
        {course.difficulty && (
          <Badge
            variant="outline"
            className={`text-xs ${difficultyClass}`}
            data-testid="hero-difficulty"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            {course.difficulty}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1
        data-testid="hero-title"
        className="text-2xl sm:text-3xl font-bold text-beige-900 font-serif mb-3 leading-snug"
      >
        {course.title}
      </h1>

      {/* Description */}
      {course.description && (
        <p
          data-testid="hero-description"
          className="text-beige-600 leading-relaxed mb-6 max-w-2xl"
        >
          {course.description}
        </p>
      )}

      {/* Stats row */}
      <div className="flex flex-wrap gap-5 text-sm text-beige-500 mb-6">
        <span className="flex items-center gap-1.5" data-testid="hero-section-count">
          <Layers className="w-4 h-4 text-beige-400" />
          <span className="font-medium text-beige-700">{sections.length}</span> seksi
        </span>
        <span className="flex items-center gap-1.5" data-testid="hero-lesson-count">
          <BookOpen className="w-4 h-4 text-beige-400" />
          <span className="font-medium text-beige-700">{totalLessons}</span> pelajaran
        </span>
        <span className="text-beige-400 text-xs self-center">
          Diperbarui{' '}
          {new Date(course.updatedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* CTA slot */}
      {children && <div data-testid="hero-cta">{children}</div>}
    </div>
  )
}
