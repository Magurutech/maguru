'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, LayoutDashboard } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { useRoleNavigation } from '@/features/auth'

/**
 * LearnHeader Component
 *
 * Compact top bar for the learn page (replaces full Navbar).
 * Shows: back to course, course title, dashboard link, user avatar.
 *
 * Height: 48px — minimal footprint, maximum screen for content.
 */

interface LearnHeaderProps {
  courseSlug: string
  courseTitle?: string
}

export function LearnHeader({ courseSlug, courseTitle }: LearnHeaderProps) {
  const { getDashboardUrl } = useRoleNavigation()
  const [title, setTitle] = useState(courseTitle ?? '')

  // Fetch course title if not provided
  useEffect(() => {
    if (courseTitle) return
    fetch(`/api/courses/${courseSlug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.title) setTitle(data.title) })
      .catch(() => {})
  }, [courseSlug, courseTitle])

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-border/10 bg-card z-10">
      {/* Left: back to course page */}
      <Link
        href={`/course/${courseSlug}`}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
        aria-label="Kembali ke halaman kursus"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        <BookOpen className="h-4 w-4 shrink-0 text-accent-coral" />
        <span className="font-semibold truncate max-w-50 hidden sm:block font-manrope">
          {title || courseSlug}
        </span>
      </Link>

      {/* Right: dashboard + avatar */}
      <div className="flex items-center gap-3">
        <Link
          href={getDashboardUrl()}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
          aria-label="Ke dashboard"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:block font-bold text-xs uppercase tracking-wider">Dashboard</span>
        </Link>
        <UserButton
          appearance={{
            elements: { avatarBox: 'w-7 h-7 rounded-full border border-border/15' },
          }}
        />
      </div>
    </header>
  )

}
