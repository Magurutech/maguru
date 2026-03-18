import { BookOpen, ChevronDown } from 'lucide-react'
import type { OverviewSection } from './types'

/**
 * CourseCurriculum
 *
 * Shows the course syllabus — sections and their lesson titles.
 * Preview-only: lessons are not clickable from this page.
 * Students must enroll and go to /learn to access content.
 */

interface CourseCurriculumProps {
  sections: OverviewSection[]
}

export function CourseCurriculum({ sections }: CourseCurriculumProps) {
  if (sections.length === 0) {
    return (
      <div
        data-testid="curriculum-empty"
        className="bg-white rounded-2xl border border-beige-200 shadow-sm p-6 text-center"
      >
        <BookOpen className="w-8 h-8 text-beige-300 mx-auto mb-2" />
        <p className="text-beige-500 text-sm">Kurikulum belum tersedia.</p>
      </div>
    )
  }

  return (
    <div
      data-testid="course-curriculum"
      className="bg-white rounded-2xl border border-beige-200 shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-beige-100">
        <h2 className="font-semibold text-beige-900 text-lg">Kurikulum Kursus</h2>
        <p className="text-sm text-beige-500 mt-0.5">
          {sections.length} seksi &middot;{' '}
          {sections.reduce((sum, s) => sum + s.lessons.length, 0)} pelajaran
        </p>
      </div>

      <ul className="divide-y divide-beige-100">
        {sections.map((section, idx) => (
          <li key={section.id} data-testid={`section-item-${idx}`}>
            {/* Section header */}
            <details className="group">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none hover:bg-beige-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-beige-100 text-beige-600 text-xs font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span
                    className="font-medium text-beige-800 text-sm"
                    data-testid={`section-title-${idx}`}
                  >
                    {section.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-beige-400 flex-shrink-0">
                  <span>{section.lessons.length} pelajaran</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </div>
              </summary>

              {/* Lessons list */}
              {section.lessons.length > 0 && (
                <ul className="bg-beige-50/50 border-t border-beige-100">
                  {section.lessons.map((lesson, lIdx) => (
                    <li
                      key={lesson.id}
                      data-testid={`lesson-item-${idx}-${lIdx}`}
                      className="flex items-center gap-3 px-6 py-3 text-sm text-beige-600 border-b border-beige-100/60 last:border-0"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-beige-300 flex-shrink-0" />
                      <span>{lesson.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </details>
          </li>
        ))}
      </ul>
    </div>
  )
}
