'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star, Clock, BookOpen} from 'lucide-react'
import type { CourseDetail } from './types'

interface PremiumHeroProps {
  course: CourseDetail
  totalLessons: number
  totalSections?: number
  instructorRating: number
  creatorRating?: number
}

export function PremiumHero({
  course,
  totalSections = 0,
  instructorRating,
  creatorRating,
}: PremiumHeroProps) {
  // Safe default calculations matching Ancient Fantasy theme
  const ratingValue = creatorRating || course.rating || instructorRating || 4.9
  const duration = course.duration || '6 Jam'
  const difficulty = course.difficulty || 'Pemula'
  const sectionsCount = totalSections > 0 ? totalSections : 12

  // Dummy description as requested by user
  const dummyDescription =
    `Mulai perjalananmu di dunia pemrograman dengan ${course.title}! Pelajari konsep dasar algoritma, struktur data, dan logika pemrograman melalui materi teks interaktif dan latihan praktis.`

  return (
    <div className="w-full space-y-3">
      {/* ── Top Navigation & Breadcrumbs Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans text-[#6E5D4B]">
        <div className="flex items-center gap-2">
          {/* Back to Catalog */}
          <Link
            href="/course"
            className="inline-flex items-center gap-1 font-semibold text-[#6E5D4B] hover:text-[#2D2319] transition-colors group"
            data-testid="back-to-catalog"
          >
            <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#2D2319]" />
            <span>Kembali ke Katalog</span>
          </Link>

          <span className="text-[#D8C4A7] select-none">|</span>

          {/* Breadcrumbs Path */}
          <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#2D2319] transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3 h-3 text-[#D8C4A7]" />
            <Link href="/course" className="hover:text-[#2D2319] transition-colors">
              Kursus
            </Link>
            <ChevronRight className="w-3 h-3 text-[#D8C4A7]" />
            <span className="text-[#6E5D4B]">{course.category || 'Pemrograman Web'}</span>
            <ChevronRight className="w-3 h-3 text-[#D8C4A7]" />
            <span className="text-[#2D2319] font-medium truncate max-w-50 sm:max-w-70">
              {course.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ── HERO BANNER CARD: Whimsical Ancient Fantasy Asia ── */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-[#D8C4A7]/60 shadow-[0_4px_16px_rgba(45,35,25,0.06)] bg-[#FAF5ED]">
        {/* Background Artwork Illustration: /banner/banner-coruse-detail.webp */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner/banner-coruse-detail.webp"
            alt={`${course.title} Banner Illustration`}
            fill
            priority
            className="object-cover object-right pointer-events-none select-none"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
          {/* Refined Multi-layer Gradient Mask for Optimal Text Contrast */}
          <div className="absolute inset-0 bg-linear-to-r from-[#FAF5ED] via-[#FAF5ED]/95 sm:via-[#FAF5ED]/85 to-transparent/15" />
        </div>

        {/* Hero Content Overlay (Occupies Left 65-70% Width) */}
        <div className="relative z-10 p-5 sm:p-6 lg:p-7 w-full lg:w-[70%] space-y-3">
          {/* Pill Tag Category */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-sans bg-[#FFE8C4]/90 border border-[#FFB148]/50 text-[#B96500] shadow-xs backdrop-blur-xs">
            <span>🌱</span>
            <span>{course.category || 'Pemrograman Web'}</span>
          </div>

          {/* Course Main Title */}
          <h1
            data-testid="hero-title"
            className="font-sans text-2xl sm:text-3xl lg:text-[30px] font-extrabold text-[#2D2319] leading-[1.2] tracking-tight"
          >
            {course.title}
            {!course.title.includes(':') && (
              <span className="text-[#2D2319]/80 font-bold block sm:inline sm:ml-1 text-xl sm:text-2xl lg:text-[26px]">
                : Kuasai Algoritma Dasar
              </span>
            )}
          </h1>

          {/* Course Subtitle / Dummy Description */}
          <p className="font-sans text-xs sm:text-sm text-[#6E5D4B] leading-relaxed max-w-xl">
            {dummyDescription}
          </p>

          {/* Tactile Pill Badges Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Difficulty Pill */}
            <div
              data-testid="hero-difficulty"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#C8E6D0]/40 border border-[#5AC88A] text-[#136637] shadow-xs"
            >
              <span>🌱</span>
              <span className="capitalize">{difficulty}</span>
            </div>

            {/* XP Bonus Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold bg-[#FFE8C4]/60 border border-[#FFB148]/60 text-[#B96500] shadow-xs">
              <span>🪙</span>
              <span>+250 XP</span>
            </div>

            {/* Rating & Reviews Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#FFFDF9] border border-[#D8C4A7]/60 text-[#2D2319] shadow-xs">
              <Star className="w-3.5 h-3.5 text-[#FFB148] fill-[#FFB148]" />
              <span className="font-bold">{ratingValue.toFixed(1)}</span>
              <span className="text-[#6E5D4B]">(1.2k ulasan)</span>
            </div>

            {/* Total Chapters Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#FFFDF9] border border-[#D8C4A7]/60 text-[#6E5D4B] shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#6E5D4B]" />
              <span className="font-semibold text-[#2D2319]">{sectionsCount} Bab</span>
            </div>

            {/* Duration Pill */}
            <div
              data-testid="hero-duration"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#FFFDF9] border border-[#D8C4A7]/60 text-[#6E5D4B] shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-[#6E5D4B]" />
              <span className="font-semibold text-[#2D2319]">{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
