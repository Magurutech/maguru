'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LearnHeaderProps {
  courseSlug: string
  courseTitle?: string
  currentSectionTitle?: string
  currentLessonTitle?: string
  progressPercent?: number
  isQuizActive?: boolean
}

export function LearnHeader({
  courseSlug,
  courseTitle,
  currentSectionTitle,
  currentLessonTitle,
  progressPercent = 0,
  isQuizActive = false,
}: LearnHeaderProps) {
  const router = useRouter()
  const [title, setTitle] = useState(courseTitle ?? '')

  // Fetch course title if not provided
  useEffect(() => {
    if (courseTitle) return
    fetch(`/api/courses/${courseSlug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.title) setTitle(data.title)
      })
      .catch(() => {})
  }, [courseSlug, courseTitle])

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 md:px-8 border-b border-border/10 bg-bg-canvas/90 backdrop-blur-md">
      {/* Left section: Back button & Breadcrumbs */}
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href={`/course/${courseSlug}`}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-background border border-border/10 hover:bg-accent-coral/10 hover:text-accent-coral text-text-muted transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex flex-col min-w-0">
          <span className="text-xs text-text-muted font-mono truncate">
            {title || 'Kembali ke Course'}
          </span>
          {currentLessonTitle && (
            <h2 className="text-sm font-bold text-text-primary font-serif truncate">
              {currentLessonTitle}
            </h2>
          )}
        </div>
      </div>

      {/* Right section: Progress & Profile */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex flex-col items-end w-36">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-manrope">
            Mastery Progress
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-serif font-black text-accent-coral leading-none">
              {progressPercent}%
            </span>
            <span className="text-[10px] font-bold text-text-faint">
              target: 70%
            </span>
          </div>
          {/* Progress track */}
          <div className="w-full h-1.5 bg-[#efe7d2] dark:bg-[#19181d] border-t border-l border-[#b89a57]/20 border-b border-r border-white/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-accent-coral rounded-full shadow-[0_1px_2px_rgba(237,111,92,0.4)] transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Profile icon link */}
        <Link
          href="/dashboard"
          aria-label="Ke Dasbor"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border/20 text-text-primary hover:text-accent-coral transition-colors"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  )
}
