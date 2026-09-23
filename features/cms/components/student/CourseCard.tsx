'use client'

import { memo } from 'react'
import Link from 'next/link'
import { BookOpen, BarChart3, Layers, Code, Sparkles, Clock, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { CourseCardCourse } from '@/features/cms/types'
import { getDifficultyClass } from '@/features/cms/utils/difficulty-colors'

export type { CourseCardCourse }

interface CourseCardProps {
  course: CourseCardCourse
  enrolled?: boolean
  onEnroll?: () => void
  enrolling?: boolean
  showManage?: boolean
  progress?: number
  enrolledAt?: Date | string
  /** Catalog mode: wraps entire card in a link to /course/[slug], matches Whimsical Ancient Fantasy Asia design */
  catalogMode?: boolean
}

/**
 * Utility to strip HTML tags from rich-text editor descriptions
 * Prevents raw tags like <h1>, <p>, <ul> from breaking card UI
 */
function stripHtmlAndTruncate(html: string | null | undefined, maxChars = 140): string {
  if (!html) return 'Pelajari kurikulum terstruktur langkah demi langkah bersama bimbingan AI Mentor.'
  const clean = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > maxChars ? `${clean.slice(0, maxChars)}...` : clean
}

export const CourseCard = memo(function CourseCard({
  course,
  enrolled = false,
  onEnroll,
  enrolling = false,
  showManage = false,
  progress,
  catalogMode = false,
}: CourseCardProps) {
  const difficultyClass = getDifficultyClass(course.difficulty)

  // Real data calculations
  const sectionCount = course.sectionCount ?? 0
  const lessonCount = course.lessonCount ?? 0
  const xpReward = Math.max(100, lessonCount * 15 + sectionCount * 25)
  const estimatedHours = Math.max(1, Math.round((lessonCount * 20) / 60))
  const cleanDesc = stripHtmlAndTruncate(course.description, 130)

  // Determine difficulty emoji & styles
  let diffBadge = { label: course.difficulty || 'Pemula', emoji: '🌱', className: 'bg-[#C8E6D0]/40 border-[#5AC88A] text-[#136637]' }
  if (course.difficulty === 'Menengah') {
    diffBadge = { label: 'Menengah', emoji: '⚔️', className: 'bg-[#FFE8C4]/50 border-[#FFB148] text-[#B96500]' }
  } else if (course.difficulty === 'Mahir') {
    diffBadge = { label: 'Mahir', emoji: '🧙', className: 'bg-[#F3EBFF] border-[#8C4FFF] text-[#6B21A8]' }
  }

  // Visual header gradient and themed emblem for course thumbnail
  let thumbGradient = 'from-[#F5EDE0] via-[#E8D9C6] to-[#D8C4A7]'
  let ThumbIcon = Code
  let auraGlow = 'rgba(255, 177, 72, 0.25)'

  if (course.category?.toLowerCase().includes('web') || course.category?.toLowerCase().includes('react')) {
    thumbGradient = 'from-[#EBF3FF] via-[#D5E6FF] to-[#BED8FF]'
    ThumbIcon = Layers
    auraGlow = 'rgba(59, 130, 246, 0.25)'
  } else if (course.category?.toLowerCase().includes('ai') || course.category?.toLowerCase().includes('machine')) {
    thumbGradient = 'from-[#F5EEFF] via-[#E6D4FF] to-[#D5BAFF]'
    ThumbIcon = Sparkles
    auraGlow = 'rgba(140, 79, 255, 0.25)'
  } else if (course.category?.toLowerCase().includes('desain') || course.category?.toLowerCase().includes('ui')) {
    thumbGradient = 'from-[#FFF0EE] via-[#FFE2DD] to-[#FFCCC4]'
    ThumbIcon = Layers
    auraGlow = 'rgba(255, 77, 77, 0.25)'
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. CATALOG MODE LAYOUT (Matches Image 2 UI/UX Designer Mockup)
  // ─────────────────────────────────────────────────────────────────────────────
  if (catalogMode) {
    return (
      <Link
        href={`/course/${course.slug}`}
        data-testid="course-card"
        data-course-id={course.id}
        data-course-status={course.status}
        className="group bg-[#FFFDF9] border border-[#D8C4A7]/50 hover:border-[#D8C4A7] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(45,35,25,0.04)] hover:shadow-[0_10px_24px_rgba(45,35,25,0.09)] hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer"
      >
        {/* Course Card Thumbnail Header with Fantasy Scroll Aura */}
        <div className={`relative h-40 w-full bg-linear-to-br ${thumbGradient} overflow-hidden flex items-center justify-center p-6 border-b border-[#D8C4A7]/30`}>
          {/* Subtle magic circle aura */}
          <div
            className="absolute w-32 h-32 rounded-full blur-xl pointer-events-none transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: auraGlow }}
          />

          {/* Glowing central fantasy emblem */}
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#FFFDF9]/80 backdrop-blur-sm border border-[#D8C4A7]/60 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <ThumbIcon className="w-8 h-8 text-[#2D2319]/85" />
          </div>

          {/* Background ancient ornament watermark */}
          <Code className="absolute -right-3 -bottom-3 w-28 h-28 text-[#2D2319]/5 pointer-events-none transform -rotate-12" />
        </div>

        {/* Card Body Content */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-3.5">
          {/* Badges Row: Category + Difficulty + XP Reward */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-[#FAF5ED] border border-[#D8C4A7]/60 text-[#2D2319]">
                {course.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-sans border flex items-center gap-1 ${diffBadge.className}`}>
                <span>{diffBadge.emoji}</span>
                <span>{diffBadge.label}</span>
              </span>
            </div>

            {/* XP Reward Pill */}
            <span
              data-testid="course-xp-badge"
              className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#FFE8C4]/80 border border-[#FFB148]/50 text-[#B96500] tabular-nums flex items-center gap-1 shrink-0"
            >
              <span>⚡</span>
              <span>+{xpReward} XP</span>
            </span>
          </div>

          {/* Course Title */}
          <h3
            data-testid="course-title"
            className="font-sans text-base sm:text-lg font-bold text-[#2D2319] group-hover:text-[#FF4D4D] transition-colors leading-snug line-clamp-2 mt-0.5"
          >
            {course.title}
          </h3>

          {/* Clean Sanitized Description (No raw HTML tags) */}
          <p className="text-xs sm:text-[13px] text-[#6E5D4B] leading-relaxed line-clamp-2">
            {cleanDesc}
          </p>

          {/* Course Curriculum Stats Row */}
          <div className="flex items-center gap-4 text-xs font-sans text-[#6E5D4B] pt-2 border-t border-[#D8C4A7]/30 mt-1 tabular-nums">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#FF4D4D]" />
              <span>{sectionCount} Bab Teks</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FFB148]" />
              <span>{estimatedHours} Jam Belajar</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#5AC88A]" />
              <span>{lessonCount} Lab Kuis</span>
            </span>
          </div>

          {/* Instructor & CTA Footer */}
          <div className="flex items-center justify-between pt-3 mt-auto">
            {/* AI Sensei Mentor Signature */}
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-full bg-[#F3EBFF] border border-[#8C4FFF]/30 flex items-center justify-center shrink-0">
                <span className="text-sm select-none">🧙‍♂️</span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#8C4FFF]" />
              </div>
              <span className="text-[11px] font-sans font-medium text-[#6E5D4B] tracking-wide">
                Sensei AI Co-Teacher
              </span>
            </div>

            {/* CTA Action Button */}
            {enrolled ? (
              <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-[#2D2319] text-white font-sans text-xs font-semibold shadow-xs group-hover:bg-[#FF4D4D] transition-all">
                <span>Lanjut</span>
                <span>➔</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-[#FF4D4D] text-white font-sans text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_6px_rgba(255,77,77,0.3)] group-hover:bg-[#FF3333] transition-all">
                <span>Mulai Belajar</span>
                <span>➔</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. DASHBOARD / MY COURSES MODE (Preserved for student/creator dashboard)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      data-testid="course-card"
      data-course-id={course.id}
      data-course-status={course.status}
      className="bg-[#FFFDF9] rounded-2xl border border-[#D8C4A7]/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
    >
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs bg-[#FAF5ED] text-[#2D2319] border-[#D8C4A7]/60">
              {course.category}
            </Badge>
            {course.difficulty && (
              <Badge variant="outline" className={`text-xs ${difficultyClass}`}>
                {course.difficulty}
              </Badge>
            )}
          </div>
          {showManage && (
            <Badge
              variant="outline"
              className={`text-xs ${
                course.status === 'PUBLISHED'
                  ? 'bg-[#C8E6D0]/40 text-[#136637] border-[#5AC88A]'
                  : 'bg-[#FFE8C4]/50 text-[#B96500] border-[#FFB148]'
              }`}
            >
              {course.status}
            </Badge>
          )}
        </div>

        <h3 data-testid="course-title" className="font-bold text-[#2D2319] text-base leading-snug line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-[#6E5D4B] leading-relaxed flex-1">
          {cleanDesc}
        </p>

        {(sectionCount > 0 || lessonCount > 0) && (
          <div className="flex items-center gap-4 text-xs text-[#6E5D4B] mt-auto tabular-nums">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#FF4D4D]" />
              {sectionCount} seksi
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#FF4D4D]" />
              {lessonCount} pelajaran
            </span>
          </div>
        )}

        {enrolled && progress !== undefined && (
          <div className="mt-2 space-y-1" data-testid="course-progress-container">
            <div className="flex justify-between text-xs text-[#6E5D4B]">
              <span>Progress</span>
              <span className="font-medium text-[#136637] tabular-nums" data-testid="course-progress-value">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-[#F5EDE0] [&>div]:bg-[#5AC88A]" data-testid="course-progress-bar" />
          </div>
        )}
      </div>

      <div className="px-5 pb-5 pt-0 flex gap-2">
        {showManage ? (
          <Link href={`/creator/courses/${course.slug}/manage`} className="flex-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm" className="w-full border-[#D8C4A7] text-[#2D2319] hover:bg-[#FAF5ED]">
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Manage
            </Button>
          </Link>
        ) : enrolled ? (
          <Link href={`/course/${course.slug}/learn`} className="flex-1">
            <Button size="sm" className="w-full bg-[#5AC88A] hover:bg-[#4BB077] text-white">
              Lanjut Belajar
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={onEnroll}
            disabled={enrolling}
            className="flex-1 bg-[#FF4D4D] hover:bg-[#FF3333] text-white disabled:opacity-60"
          >
            {enrolling ? 'Mendaftar...' : 'Daftar Sekarang'}
          </Button>
        )}
      </div>
    </div>
  )
})
