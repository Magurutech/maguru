'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { useRoleNavigation } from '@/features/auth'
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

  const sectionLabel = currentSectionTitle || 'Kursus'
  const lessonLabel = isQuizActive
    ? 'Evaluasi Kompetensi'
    : currentLessonTitle || title || 'Pelajaran'

  return (
    <header className="w-full shrink-0 px-6 pt-6 pb-4 bg-transparent flex flex-col md:flex-row gap-4 relative z-20">
      {/* 1. LEFT CARD: Lesson Navigation & Exit Button */}
      <div 
        className="flex-1 paper-skeuo rounded-[1.5rem] p-4 flex items-center justify-between"
        style={{ contentVisibility: 'auto' }}
      >
        <div className="flex flex-col min-w-0 pr-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-manrope">
            {sectionLabel}
          </span>
          <button 
            className="flex items-center gap-1 mt-1 text-sm font-serif font-bold text-text-primary hover:opacity-80 transition-opacity text-left truncate"
            aria-label="Daftar pelajaran"
          >
            <span className="truncate">{lessonLabel}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
          </button>
        </div>

        <button
          onClick={() => router.push(`/course/${courseSlug}`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-text-primary paper-skeuo btn-interactive shrink-0"
        >
          {isQuizActive ? (
            <>
              <span className="text-sm font-sans font-bold">→</span>
              <span>Exit Quiz</span>
            </>
          ) : (
            <>
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span>Kembali</span>
            </>
          )}
        </button>
      </div>

      {/* 2. RIGHT CARD: Mastery Progress & Profile */}
      <div 
        className="w-full md:w-80 paper-skeuo rounded-[1.5rem] p-4 flex items-center justify-between"
        style={{ contentVisibility: 'auto' }}
      >
        <div className="flex-1 mr-4">
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
          {/* Debossed thin progress track */}
          <div className="w-full h-1.5 bg-[#efe7d2] dark:bg-[#19181d] border-t border-l border-[#b89a57]/20 border-b border-r border-white/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-accent-coral rounded-full shadow-[0_1px_2px_rgba(237,111,92,0.4)] transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Tactile profile frame */}
        <div className="flex items-center justify-center p-0.5 rounded-full bg-bg-canvas border-t border-l border-[#b89a57]/30 border-b border-r border-white/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] shrink-0">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8 rounded-full border-none shadow-none',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}

