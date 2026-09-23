'use client'

/**
 * LibraryCourseCard Component
 *
 * Implements the Whimsical Ancient Grimoire Scroll Course Card matching Gambar 2:
 * - 16:9 Thematic Illustrated Cover Banner with mystical tech-oriental artwork
 * - Floating Emerald Green Jade status badge (● DITERBITKAN) or Amber (● DRAF)
 * - Delicate oriental corner flourishes & parchment surface (#FFFDF9)
 * - Crisp title, description, and 3-column micro-metrics (Siswa, Rating, Selesai)
 * - Dual action buttons: Tactile Crimson Lacquer "Kelola Kelas" + Analytics button
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Star, CheckCircle2, BarChart2, SlidersHorizontal } from 'lucide-react'

export interface CourseData {
  id: string
  title: string
  description?: string
  slug: string
  status: 'PUBLISHED' | 'DRAFT' | 'REVIEW' | 'ARCHIVED'
  category?: string
  enrollmentCount?: number
  difficulty?: string
  rating?: number
  completionRate?: number
  updatedAt?: string | Date
  aiInsight?: string
  thumbnailUrl?: string
}

interface LibraryCourseCardProps {
  course: CourseData
  onManage?: (slug: string) => void
  onAnalytics?: (slug: string) => void
}

// Generate an evocative oriental-tech fantasy visual based on title / category
function getCourseCoverArt(course: CourseData) {
  const titleLower = (course.title || '').toLowerCase()

  if (titleLower.includes('python')) {
    return {
      gradient: 'from-[#1E293B] via-[#0F172A] to-[#1E3A8A]',
      icon: '🐍',
      badge: 'Python Scrolls',
      bgAsset: '/banner/banner-coruse-detail.webp',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.35)]',
    }
  }

  if (titleLower.includes('react') || titleLower.includes('next')) {
    return {
      gradient: 'from-[#0C1222] via-[#162032] to-[#082F49]',
      icon: '⚛️',
      badge: 'React Temple',
      bgAsset: '/banner/banner-coruse-detail.webp',
      glow: 'shadow-[0_0_25px_rgba(14,165,233,0.35)]',
    }
  }

  if (titleLower.includes('design') || titleLower.includes('ui')) {
    return {
      gradient: 'from-[#2D1B11] via-[#3D2516] to-[#59341B]',
      icon: '📐',
      badge: 'Grimoire Blueprint',
      bgAsset: '/banner/banner-coruse-detail.webp',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    }
  }

  // Default mystical mountain academy
  return {
    gradient: 'from-[#1C1814] via-[#2A2016] to-[#3B2D20]',
    icon: '📜',
    badge: 'Ancient Codex',
    bgAsset: '/banner/banner-coruse-detail.webp',
    glow: 'shadow-[0_0_25px_rgba(255,177,72,0.25)]',
  }
}

export function LibraryCourseCard({
  course,
  onManage,
  onAnalytics,
}: LibraryCourseCardProps) {
  const art = getCourseCoverArt(course)
  const isPublished = course.status === 'PUBLISHED'

  return (
    <div className="group relative rounded-2xl border border-[#D8C4A7]/60 bg-[#FFFDF9] shadow-[0_4px_16px_rgba(45,35,25,0.04)] hover:shadow-[0_8px_24px_rgba(45,35,25,0.08)] hover:border-[#D8C4A7] transition-all overflow-hidden flex flex-col justify-between">
      {/* ── Top-Left & Bottom-Right Oriental Corner Flourishes ── */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#D8C4A7]/40 pointer-events-none rounded-tl-sm z-10" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#D8C4A7]/40 pointer-events-none rounded-br-sm z-10" />

      <div>
        {/* ── 1. 16:9 Thematic Illustrated Cover Banner ── */}
        <div className={`relative h-40 w-full overflow-hidden bg-linear-to-br ${art.gradient} select-none`}>
          {/* Background Scenic Landscape */}
          <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
            <Image
              src={art.bgAsset}
              alt="Course scene"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Vignette & Atmospheric Glow */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* Centerpiece Emblem / Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl ${art.glow} group-hover:scale-110 transition-transform duration-300`}
            >
              <span>{art.icon}</span>
            </div>
          </div>

          {/* Floating Status Badge (Bottom-Left) */}
          <div className="absolute bottom-2.5 left-3 z-10">
            {isPublished ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-[#1B804B]/90 backdrop-blur-md text-white border border-[#5AC88A]/60 shadow-[0_2px_8px_rgba(27,128,75,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5AC88A] animate-pulse" />
                <span>DITERBITKAN</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-[#B96500]/90 backdrop-blur-md text-white border border-[#FFB148]/60 shadow-[0_2px_8px_rgba(185,101,0,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB148]" />
                <span>DRAF</span>
              </span>
            )}
          </div>
        </div>

        {/* ── 2. Card Body ── */}
        <div className="p-3.5 sm:p-4 space-y-2.5">
          {/* Title */}
          <h3 className="font-sans text-base font-bold text-[#2D2319] leading-snug line-clamp-1 group-hover:text-[#E53935] transition-colors">
            {course.title}
          </h3>

          {/* Description Excerpt */}
          <p className="font-sans text-xs text-[#6E5D4B] leading-relaxed line-clamp-2 min-h-9">
            {course.description || 'Pelajari materi terstruktur dengan kurikulum terverifikasi dan tantangan interaktif.'}
          </p>

          {/* 3-Column Micro Metrics Row */}
          <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C4A7]/40 text-center select-none">
            {/* Siswa */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-[#2D2319] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>{course.enrollmentCount || 0}</span>
              </span>
              <span className="text-[10px] font-sans font-medium text-[#8C7D6E]">
                Siswa
              </span>
            </div>

            {/* Rating */}
            <div className="flex flex-col items-center justify-center border-x border-[#D8C4A7]/40">
              <span className="text-xs font-bold text-[#2D2319] flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 text-[#FFB148] fill-current" />
                <span>{course.rating || 4.8}</span>
              </span>
              <span className="text-[10px] font-sans font-medium text-[#8C7D6E]">
                Rating
              </span>
            </div>

            {/* Kelulusan */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-[#2D2319] flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5AC88A]" />
                <span>{course.completionRate || 85}%</span>
              </span>
              <span className="text-[10px] font-sans font-medium text-[#8C7D6E]">
                Selesai
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Dual Action Buttons Footer ── */}
      <div className="px-3.5 sm:px-4 pb-3.5 pt-1 flex items-center gap-2">
        <Link
          href={`/creator/courses/${course.slug}/manage`}
          className="flex-1"
          onClick={(e) => {
            if (onManage) {
              e.preventDefault()
              onManage(course.slug)
            }
          }}
        >
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-linear-to-r from-[#E53935] via-[#D32F2F] to-[#C62828] hover:from-[#F44336] hover:to-[#D32F2F] text-white font-sans text-xs font-bold shadow-[0_2px_8px_rgba(229,57,53,0.3)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Kelola Kelas</span>
          </button>
        </Link>

        <button
          type="button"
          onClick={() => onAnalytics?.(course.slug)}
          className="w-8.5 h-8.5 rounded-xl border border-[#D8C4A7]/60 bg-[#FAF5ED] hover:bg-[#FFFDF9] hover:border-[#2D2319]/40 flex items-center justify-center text-[#6E5D4B] hover:text-[#2D2319] transition-all cursor-pointer shadow-2xs shrink-0"
          aria-label="Analitik Kelas"
          title="Analitik Kelas"
        >
          <BarChart2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
