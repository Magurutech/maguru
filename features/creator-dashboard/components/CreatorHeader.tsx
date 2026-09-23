'use client'

/**
 * CreatorHeader Component
 *
 * Implements the Sanctum Kreator Hero Banner & 4 Macro Metric Capsules
 * matching the Whimsical Ancient Fantasy Asia Designer Reference with tightened -2 spacing.
 */

import React from 'react'
import Image from 'next/image'
import { Users, BookOpen, Star, Sparkles, TrendingUp } from 'lucide-react'

interface CreatorHeaderProps {
  userName: string
  totalStudents?: number
  totalCourses?: number
  averageRating?: number
  totalXP?: number
}

export function CreatorHeader({
  userName,
  totalStudents = 1284,
  totalCourses = 3,
  averageRating = 4.9,
  totalXP = 142000,
}: CreatorHeaderProps) {
  // Format numbers cleanly
  const formattedStudents = totalStudents >= 1000 ? `${(totalStudents / 1000).toFixed(1)}k` : `${totalStudents}`
  const formattedXP = totalXP >= 1000 ? `${Math.round(totalXP / 1000)}k` : `${totalXP}`

  return (
    <div className="space-y-2.5 sm:space-y-3 w-full">
      {/* ── 1. SANCTUM KREATOR GREETING BANNER (Tightened) ── */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-[#D8C4A7]/60 shadow-[0_4px_16px_rgba(45,35,25,0.05)] bg-[#FAF5ED]">
        {/* Oriental Landscape Background Artwork */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/course-catalog-banner.webp"
            alt="Sanctum Kreator Banner"
            fill
            priority
            className="object-cover object-right pointer-events-none select-none opacity-85"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          {/* Multi-tier Gradient Mask for Flawless Readability */}
          <div className="absolute inset-0 bg-linear-to-r from-[#FAF5ED] via-[#FAF5ED]/95 sm:via-[#FAF5ED]/85 to-transparent/15" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 py-3.5 px-5 sm:py-4 sm:px-7 lg:px-8 w-full lg:w-[68%] space-y-1.5">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#B96500]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB148]" />
            <span>Sanctum Kreator</span>
          </div>

          {/* Main Title */}
          <h1 className="font-sans text-xl sm:text-2xl lg:text-[26px] font-extrabold text-[#2D2319] leading-tight tracking-tight">
            Selamat Datang, Master Mentor {userName} <span className="inline-block">👑</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-[13px] text-[#6E5D4B] leading-relaxed max-w-xl">
            Terus ciptakan kursus berkualitas untuk melahirkan lebih banyak petualang teknologi di Maguru.
          </p>
        </div>
      </div>

      {/* ── 2. MACRO METRIC CAPSULES STRIP (4 STAT CARDS - Tightened) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Card 1: Total Siswa */}
        <div className="bg-[#FFFDF9] border border-[#D8C4A7]/50 rounded-2xl p-2.5 sm:p-3 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-[#FAF5ED] border border-[#D8C4A7]/40 flex items-center justify-center text-[#2D2319] shrink-0">
              <Users className="w-4 h-4 text-[#6E5D4B]" />
            </div>
            <div>
              <span className="font-sans text-base sm:text-lg font-extrabold text-[#2D2319] block leading-none tabular-nums">
                {formattedStudents}
              </span>
              <span className="text-[10.5px] font-sans text-[#6E5D4B] block mt-0.5">
                Siswa
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-sans font-semibold text-[#136637] bg-[#C8E6D0]/40 border border-[#5AC88A]/50 px-1.5 py-0.5 rounded-full">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>12%</span>
          </span>
        </div>

        {/* Card 2: Total Kursus */}
        <div className="bg-[#FFFDF9] border border-[#D8C4A7]/50 rounded-2xl p-2.5 sm:p-3 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-[#FAF5ED] border border-[#D8C4A7]/40 flex items-center justify-center text-[#2D2319] shrink-0">
              <BookOpen className="w-4 h-4 text-[#FF4D4D]" />
            </div>
            <div>
              <span className="font-sans text-base sm:text-lg font-extrabold text-[#2D2319] block leading-none tabular-nums">
                {totalCourses}
              </span>
              <span className="text-[10.5px] font-sans text-[#6E5D4B] block mt-0.5">
                Kursus
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-sans font-semibold text-[#6E5D4B] bg-[#FAF5ED] border border-[#D8C4A7]/40 px-1.5 py-0.5 rounded-full">
            <span>↑ 0%</span>
          </span>
        </div>

        {/* Card 3: Rating Rata-rata */}
        <div className="bg-[#FFFDF9] border border-[#D8C4A7]/50 rounded-2xl p-2.5 sm:p-3 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-[#FAF5ED] border border-[#D8C4A7]/40 flex items-center justify-center text-[#2D2319] shrink-0">
              <Star className="w-4 h-4 text-[#FFB148] fill-[#FFB148]" />
            </div>
            <div>
              <span className="font-sans text-base sm:text-lg font-extrabold text-[#2D2319] block leading-none tabular-nums">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-[10.5px] font-sans text-[#6E5D4B] block mt-0.5">
                Rating Rata-rata
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-sans font-semibold text-[#136637] bg-[#C8E6D0]/40 border border-[#5AC88A]/50 px-1.5 py-0.5 rounded-full">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>0.2</span>
          </span>
        </div>

        {/* Card 4: Total XP Royalti */}
        <div className="bg-[#FFFDF9] border border-[#D8C4A7]/50 rounded-2xl p-2.5 sm:p-3 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-[#FAF5ED] border border-[#D8C4A7]/40 flex items-center justify-center text-[#2D2319] shrink-0">
              <span className="text-base select-none">🪙</span>
            </div>
            <div>
              <span className="font-sans text-base sm:text-lg font-extrabold text-[#2D2319] block leading-none tabular-nums">
                {formattedXP}
              </span>
              <span className="text-[10.5px] font-sans text-[#6E5D4B] block mt-0.5">
                Total XP
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-sans font-semibold text-[#136637] bg-[#C8E6D0]/40 border border-[#5AC88A]/50 px-1.5 py-0.5 rounded-full">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>18%</span>
          </span>
        </div>
      </div>
    </div>
  )
}
