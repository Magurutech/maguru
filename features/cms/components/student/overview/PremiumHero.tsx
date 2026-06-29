import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star, Users, Clock, BarChart } from 'lucide-react'
import type { CourseDetail } from './types'

interface PremiumHeroProps {
  course: CourseDetail
  totalLessons: number
  instructorRating: number
}

export function PremiumHero({ course, totalLessons, instructorRating }: PremiumHeroProps) {
  // Safe default calculations
  const ratingValue = course.rating || instructorRating || 4.8
  const studentsCount = course.students || 1284
  const duration = course.duration || '8 Minggu'
  const difficulty = course.difficulty || 'Intermediate'

  return (
    <div className="w-full pb-8 border-b border-text-primary/12 dark:border-white/12">
      {/* Back to Catalog */}
      <Link
        href="/course"
        className="inline-flex items-center gap-1.5 text-xs font-sans font-bold tracking-wider uppercase text-text-muted hover:text-accent-coral transition-colors mb-6 group"
        data-testid="back-to-catalog"
      >
        <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        Kembali ke Katalog
      </Link>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-sans text-text-muted mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent-coral transition-colors">
          Beranda
        </Link>
        <ChevronRight className="w-3 h-3 text-text-faint" />
        <Link href="/course" className="hover:text-accent-coral transition-colors">
          Kursus
        </Link>
        <ChevronRight className="w-3 h-3 text-text-faint" />
        <span className="text-text-primary font-medium">{course.category}</span>
      </nav>

      {/* Course Title & Intro */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2">
          <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-accent-coral">
            {course.category}
          </span>
          <span className="text-text-faint font-mono text-[9px] uppercase tracking-wider">
            · Nº 01
          </span>
        </div>

        <h1
          data-testid="hero-title"
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-tight font-sans"
        >
          {/* Format the first part or dynamic highlights if any */}
          {course.title}
          <span className="text-accent-coral">.</span>
        </h1>

        {course.description && (
          <p
            data-testid="hero-description"
            className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-2xl font-sans"
          >
            {course.description}
          </p>
        )}

        {/* Hero Meta Badges */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pt-4 text-xs font-sans text-text-muted">
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-accent-mustard fill-accent-mustard" />
            <span className="font-semibold text-text-primary">{ratingValue.toFixed(1)}</span> (Ulasan)
          </span>

          <span className="flex items-center gap-1.5" data-testid="hero-student-count">
            <Users className="w-4 h-4 text-text-faint" />
            <span className="font-medium text-text-primary">{studentsCount.toLocaleString('id-ID')}</span> Pelajar
          </span>

          <span className="flex items-center gap-1.5" data-testid="hero-duration">
            <Clock className="w-4 h-4 text-text-faint" />
            <span>{duration}</span> · <span>{totalLessons} pelajaran</span>
          </span>

          {difficulty && (
            <span className="flex items-center gap-1.5" data-testid="hero-difficulty">
              <BarChart className="w-4 h-4 text-text-faint" />
              <span className="capitalize">{difficulty}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
