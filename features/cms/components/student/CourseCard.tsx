'use client'

import { memo } from 'react'
import Link from 'next/link'
import { BookOpen, BarChart3, Layers, Code } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { CourseCardCourse } from '@/features/cms/types'
import { getDifficultyClass } from '@/features/cms/utils/difficulty-colors'

/**
 * CourseCard Component
 *
 * Reusable card for displaying course info in 3 contexts:
 * - Student catalog (catalogMode=true): whole card is a link to /course/[id], no enroll button
 * - My Courses: shows progress bar + "Lanjut Belajar"
 * - Creator dashboard: shows "Manage" button
 *
 * Requirements: 1.5, 1.6, 1.7, 4.2
 */

export type { CourseCardCourse }

interface CourseCardProps {
  course: CourseCardCourse
  enrolled?: boolean
  onEnroll?: () => void
  enrolling?: boolean
  showManage?: boolean
  progress?: number
  enrolledAt?: Date | string
  /** Catalog mode: wraps entire card in a link to /course/[id], hides enroll button */
  catalogMode?: boolean
}

function truncate(text: string | null, max: number): string {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}

// Wrap with React.memo — pure component, re-renders only when props change
export const CourseCard = memo(function CourseCard({
  course,
  enrolled = false,
  onEnroll,
  enrolling = false,
  showManage = false,
  progress,
  enrolledAt,
  catalogMode = false,
}: CourseCardProps) {
  const difficultyClass = getDifficultyClass(course.difficulty)

  // 3D Tilt handlers for catalogMode card
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    card.style.transform = `perspective(1000px) rotateX(${-(y / (r.height / 2)) * 6}deg) rotateY(${(x / (r.width / 2)) * 6}deg) translateY(-4px)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'
  }

  // Mapped Gradients, Icons, and Accent colors for Course Thumbnails
  let thumbGradient = 'from-[#ece4cc] to-[#e0d8b8]'
  let ThumbIcon = BookOpen
  let accentBarColor = 'bg-text-faint/30'

  if (course.category === 'Pemrograman') {
    thumbGradient = 'from-[#e8e0c8] to-[#d4c8a8]'
    ThumbIcon = Code
    accentBarColor = 'bg-accent-olive'
  } else if (course.category === 'Desain') {
    thumbGradient = 'from-[#f0e8d0] to-[#e8d8b8]'
    ThumbIcon = Layers
    accentBarColor = 'bg-accent-coral'
  } else if (course.category === 'Bisnis') {
    thumbGradient = 'from-[#ece4cc] to-[#e0d8b8]'
    ThumbIcon = BarChart3
    accentBarColor = 'bg-accent-mustard'
  }

  // 1. catalogMode = true layout (Atelier Zero 3D Tilt and Glassmorphism)
  const catalogCardContent = (
    <>
      {/* Thumbnail Container */}
      <div className={`relative h-32 w-full bg-gradient-to-br ${thumbGradient} overflow-hidden flex items-center justify-between px-6`}>
        {/* Bottom Accent Bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${accentBarColor}`} />
        
        <span className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-text-muted select-none">
          {course.category}
        </span>

        <ThumbIcon className="absolute -right-4 -bottom-4 w-28 h-28 text-text-primary/8 dark:text-white/5 select-none pointer-events-none transform -rotate-12" />
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="text-xs bg-bg-bone/40 text-text-secondary border-text-primary/8 dark:border-white/8"
            data-testid="course-category"
          >
            {course.category}
          </Badge>
          {course.difficulty && (
            <Badge variant="outline" className={`text-xs ${difficultyClass}`} data-testid="course-difficulty">
              {course.difficulty}
            </Badge>
          )}
        </div>

        <h3 data-testid="course-title" className="font-sans text-lg font-bold text-text-primary leading-snug line-clamp-2 mt-1">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-xs sm:text-[13px] text-text-secondary leading-relaxed flex-1">
            {truncate(course.description, 150)}
          </p>
        )}

        {(course.sectionCount !== undefined || course.lessonCount !== undefined) && (
          <div className="flex items-center gap-4 text-[11px] font-sans text-text-muted mt-2">
            {course.sectionCount !== undefined && (
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-accent-coral" />
                {course.sectionCount} seksi
              </span>
            )}
            {course.lessonCount !== undefined && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-accent-coral" />
                {course.lessonCount} pelajaran
              </span>
            )}
          </div>
        )}

        {/* Instructor & CTA Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-text-primary/8 dark:border-white/8 mt-auto">
          <div className="flex items-center gap-2">
            {/* Avatar initials AI */}
            <div className="w-7 h-7 rounded-full bg-accent-coral/10 text-accent-coral flex items-center justify-center font-sans font-bold text-[10px] tracking-wider shrink-0 select-none">
              AI
            </div>
            <span className="text-[11px] font-sans font-medium text-text-muted tracking-wide leading-none">
              Maguru Co-Teacher
            </span>
          </div>

          {/* CTA Button */}
          {enrolled ? (
            <button
              type="button"
              data-testid="continue-learning-btn"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-text-primary text-bg-canvas dark:bg-white dark:text-text-primary hover:opacity-90 font-sans text-xs font-semibold hover:-translate-y-px transition-all duration-180 cursor-pointer shadow-sm border-none animate-fade-in"
            >
              <span>Lanjut</span>
              <svg className="w-2.5 h-2.5 stroke-current fill-none stroke-[2]" viewBox="0 0 12 12">
                <path d="M2 6h8M7 3l3 3-3 3" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              data-testid="enroll-btn"
              aria-label={`Daftar ke kursus ${course.title}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (onEnroll) onEnroll()
              }}
              disabled={enrolling}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent-coral text-white font-sans text-xs font-semibold hover:-translate-y-px transition-all duration-180 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm border-none"
            >
              <span>{enrolling ? 'Mendaftar...' : 'Mulai'}</span>
              <svg className="w-2.5 h-2.5 stroke-current fill-none stroke-[2]" viewBox="0 0 12 12">
                <path d="M2 6h8M7 3l3 3-3 3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  )

  // 2. catalogMode = false layout (Original layout preserved)
  const defaultCardContent = (
    <>
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="text-xs bg-beige-50 text-beige-700 border-beige-200"
            data-testid="course-category"
          >
            {course.category}
          </Badge>
          {course.difficulty && (
            <Badge variant="outline" className={`text-xs ${difficultyClass}`} data-testid="course-difficulty">
              {course.difficulty}
            </Badge>
          )}
          {showManage && (
            <Badge
              variant="outline"
              data-testid="course-status-badge"
              className={`text-xs ml-auto ${
                course.status === 'PUBLISHED'
                  ? 'bg-hijau-50 text-hijau-700 border-hijau-200'
                  : 'bg-kuning-50 text-kuning-700 border-kuning-200'
              }`}
            >
              {course.status}
            </Badge>
          )}
        </div>

        <h3 data-testid="course-title" className="font-semibold text-beige-900 text-base leading-snug line-clamp-2">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-sm text-beige-600 leading-relaxed flex-1">
            {truncate(course.description, 150)}
          </p>
        )}

        {(course.sectionCount !== undefined || course.lessonCount !== undefined) && (
          <div className="flex items-center gap-4 text-xs text-beige-500 mt-auto">
            {course.sectionCount !== undefined && (
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {course.sectionCount} seksi
              </span>
            )}
            {course.lessonCount !== undefined && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {course.lessonCount} pelajaran
              </span>
            )}
          </div>
        )}

        {enrolled && progress !== undefined && (
          <div className="mt-2 space-y-1" data-testid="course-progress-container">
            <div className="flex justify-between text-xs text-beige-600">
              <span>Progress</span>
              <span className="font-medium text-hijau-700" data-testid="course-progress-value">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-beige-100 [&>div]:bg-hijau-500" data-testid="course-progress-bar" />
            {enrolledAt && (
              <p className="text-xs text-beige-400">
                Terdaftar:{' '}
                {new Date(enrolledAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="px-5 pb-5 pt-0 flex gap-2">
        {showManage ? (
          <Link
            href={`/creator/courses/${course.slug}/manage`}
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="outline"
              size="sm"
              data-testid="manage-course-btn"
              className="w-full border-beige-300 text-beige-700 hover:bg-beige-50 hover:scale-105 transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Manage
            </Button>
          </Link>
        ) : enrolled ? (
          <Link href={`/course/${course.slug}/learn`} className="flex-1">
            <Button
              size="sm"
              data-testid="continue-learning-btn"
              className="w-full bg-hijau-500 hover:bg-hijau-600 text-white hover:scale-105 transition-all duration-200"
            >
              Lanjut Belajar
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={onEnroll}
            disabled={enrolling}
            data-testid="enroll-btn"
            aria-label={`Daftar ke kursus ${course.title}`}
            className="flex-1 bg-merah-500 hover:bg-merah-600 text-white hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {enrolling ? 'Mendaftar...' : 'Daftar Sekarang'}
          </Button>
        )}
      </div>
    </>
  )

  if (catalogMode) {
    return (
      <Link
        href={`/course/${course.slug}`}
        data-testid="course-card"
        data-course-id={course.id}
        data-course-status={course.status}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-panel rounded-[18px] border border-text-primary/8 dark:border-white/8 transition-all duration-300 flex flex-col overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {catalogCardContent}
      </Link>
    )
  }

  return (
    <div
      data-testid="course-card"
      data-course-id={course.id}
      data-course-status={course.status}
      className="bg-white rounded-xl border border-beige-200 shadow-neu hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
    >
      {defaultCardContent}
    </div>
  )
})
