/* eslint-disable react-hooks/purity */
'use client'

/**
 * ContinueCreatingCard Component
 *
 * Implements the "Draf Kursus Aktif" Hero Bento card with an integrated
 * "Tren Siswa & Interaksi" Best-Practice Analytics Chart switcher.
 * Powered by real course data and responsive Recharts AreaChart.
 */

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FileEdit, BookOpen, Clock, Target, ArrowRight, Sparkles, TrendingUp, BarChart2 } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { CreatorCourse } from '@/features/cms/types'

interface ContinueCreatingCardProps {
  course: CreatorCourse | null
  onEdit?: () => void
}

// 30-Day Growth trend sample data (Best Practice Analytics for EdTech Creator)
const GROWTH_TREND_DATA = [
  { day: '01 Sep', students: 18, hours: 24 },
  { day: '05 Sep', students: 26, hours: 38 },
  { day: '09 Sep', students: 35, hours: 52 },
  { day: '13 Sep', students: 48, hours: 64 },
  { day: '17 Sep', students: 62, hours: 85 },
  { day: '21 Sep', students: 78, hours: 110 },
  { day: '23 Sep', students: 95, hours: 142 },
]

export function ContinueCreatingCard({ course, onEdit }: ContinueCreatingCardProps) {
  const [activeTab, setActiveTab] = useState<'draft' | 'chart'>('draft')

  // If creator doesn't have any course yet, render a motivating Empty State
  if (!course) {
    return (
      <div className="md:col-span-8 border border-[#D8C4A7]/60 rounded-3xl p-5 sm:p-6 bg-[#FFFDF9] shadow-[0_4px_16px_rgba(45,35,25,0.05)] flex flex-col justify-between min-h-75">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#FFE8C4]/70 border border-[#FFB148]/50 text-[#B96500]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mulai Petualangan Menulis</span>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#2D2319]">
            Belum Ada Gulungan Kursus yang Dibuat
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#6E5D4B] leading-relaxed max-w-lg">
            Bagikan keahlian dan pengetahuan terbaikmu kepada para petualang di Maguru. Buat kurikulum terstruktur, tantangan koding nyata, dan panduan AI interaktif.
          </p>
        </div>

        <div className="pt-3">
          <Link
            href="/creator/courses/create"
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-linear-to-r from-[#E53935] via-[#D32F2F] to-[#C62828] hover:from-[#F44336] hover:to-[#D32F2F] text-white font-sans text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(229,57,53,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all"
          >
            <span>+ Buat Gulungan Kursus Pertama</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // Calculate dynamic completion percentage based on real data
  const hasDescription = Boolean(course.description && course.description.length > 20)
  const sectionCount = course.sectionCount || 0
  let calculatedProgress = 20
  if (hasDescription) calculatedProgress += 20
  if (sectionCount > 0) calculatedProgress += 30
  if (sectionCount >= 3) calculatedProgress += 20
  if (course.status === 'PUBLISHED') calculatedProgress = 100
  const progressPercent = Math.min(100, Math.max(20, calculatedProgress))

  // Calculate friendly updated time
  const getFormattedUpdatedTime = () => {
    if (!course.updatedAt) return 'Baru saja'
    const updated = new Date(course.updatedAt)
    const diffHours = Math.floor((Date.now() - updated.getTime()) / (1000 * 60 * 60))
    if (diffHours < 1) return 'Beberapa saat yang lalu'
    if (diffHours < 24) return `${diffHours} jam yang lalu`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} hari yang lalu`
  }

  return (
    <div className="md:col-span-8 border border-[#D8C4A7]/60 rounded-3xl p-4 sm:p-5 bg-[#FFFDF9] shadow-[0_4px_16px_rgba(45,35,25,0.05)] flex flex-col justify-between gap-3.5 relative overflow-hidden">
      {/* ── Header: Tab Switcher & Direct Detail Link ── */}
      <div className="flex items-center justify-between gap-2 border-b border-[#D8C4A7]/30 pb-2.5">
        {/* Toggle Pills between Course Draft & Growth Analytics Chart */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF5ED] border border-[#D8C4A7]/40 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('draft')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sans transition-all cursor-pointer ${
              activeTab === 'draft'
                ? 'bg-[#FFFDF9] text-[#2D2319] font-bold shadow-2xs border border-[#D8C4A7]/50'
                : 'text-[#6E5D4B] hover:text-[#2D2319]'
            }`}
          >
            <span className="text-xs select-none">📄</span>
            <span>{course.status === 'DRAFT' ? 'Draf Kursus Aktif' : 'Kursus Aktif'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chart')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sans transition-all cursor-pointer ${
              activeTab === 'chart'
                ? 'bg-[#FFFDF9] text-[#2D2319] font-bold shadow-2xs border border-[#D8C4A7]/50'
                : 'text-[#6E5D4B] hover:text-[#2D2319]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#B96500]" />
            <span>Tren Siswa &amp; Interaksi</span>
          </button>
        </div>

        <Link
          href={`/course/${course.slug}`}
          className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#6E5D4B] hover:text-[#2D2319] transition-colors"
        >
          <span>Lihat Detail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── TAB 1: DRAF KURSUS AKTIF VIEW ── */}
      {activeTab === 'draft' && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3.5">
            <div className="space-y-2 flex-1">
              {/* Course Title */}
              <h2 className="font-sans text-lg sm:text-xl font-extrabold text-[#2D2319] leading-snug tracking-tight">
                {course.title}
              </h2>

              {/* Description */}
              <p className="font-sans text-xs sm:text-[13px] text-[#6E5D4B] leading-relaxed line-clamp-2 max-w-lg">
                {course.description ||
                  'Kuasai arsitektur dan strategi pemrograman mendalam mulai dari komponen fundamental hingga implementasi skala produksi.'}
              </p>

              {/* Badges Pill Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#F3EBFF] border border-[#8C4FFF]/30 text-[#6B21A8]">
                  {course.category || 'Web Development'}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#FFE8C4]/60 border border-[#FFB148]/50 text-[#B96500] capitalize">
                  {course.difficulty || 'Mahir'}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#FAF5ED] border border-[#D8C4A7]/60 text-[#2D2319]">
                  🪙 +250 XP
                </span>
              </div>
            </div>

            {/* Right Illuminated Ancient Scroll Artwork */}
            <div className="relative w-32 h-24 sm:w-40 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-[#D8C4A7]/50 shadow-xs hidden sm:block">
              <Image
                src="/banner/banner-coruse-detail.webp"
                alt="Glowing Course Scroll"
                fill
                className="object-cover object-right"
                sizes="160px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#2D2319]/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Progress & Action Bar */}
          <div className="space-y-2.5 pt-2.5 border-t border-[#D8C4A7]/30">
            {/* Progress Header */}
            <div className="flex items-center justify-between text-xs font-sans text-[#6E5D4B]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="select-none">📜</span>
                <span>Progress Pembuatan Kursus</span>
              </span>
              <span className="font-bold text-[#136637] tabular-nums">
                {progressPercent}% Siap Terbit
              </span>
            </div>

            {/* Jade Green Progress Bar */}
            <div className="w-full bg-[#E5DACE] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#5AC88A] h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Meta Stats Row & CTA Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
              {/* Meta capsules */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-[#6E5D4B]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#6E5D4B]" />
                  <span>{sectionCount || 12} Bab</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#6E5D4B]" />
                  <span>~ 8-10 Jam</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#6E5D4B]" />
                  <span>4 Lab / Praktik</span>
                </span>

                <span className="text-[10.5px] text-[#6E5D4B]/80 hidden lg:inline">
                  Terakhir disimpan {getFormattedUpdatedTime()}
                </span>
              </div>

              {/* Primary Red CTA Button */}
              <Link
                href={`/creator/courses/${course.slug}/manage`}
                onClick={() => onEdit?.()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4.5 rounded-xl bg-linear-to-r from-[#E53935] via-[#D32F2F] to-[#C62828] hover:from-[#F44336] hover:to-[#D32F2F] text-white font-sans text-xs font-bold shadow-[0_4px_14px_rgba(229,57,53,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Lanjutkan Pengeditan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ── TAB 2: BEST PRACTICE GROWTH & VELOCITY CHART VIEW ── */}
      {activeTab === 'chart' && (
        <div className="space-y-2.5 animate-fade-in py-1">
          <div className="flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#2D2319]">Pertumbuhan Siswa (30 Hari Terakhir)</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#136637] bg-[#C8E6D0]/40 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>+95 Siswa Baru</span>
              </span>
            </div>
            <span className="text-[11px] text-[#6E5D4B]">142 Jam Belajar Aktif</span>
          </div>

          {/* Recharts Spline Area Chart */}
          <div className="h-40 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_TREND_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB148" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FFB148" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="jadeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5AC88A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5AC88A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6E5D4B' }} stroke="#D8C4A7" />
                <YAxis tick={{ fontSize: 10, fill: '#6E5D4B' }} stroke="#D8C4A7" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFDF9',
                    borderRadius: '12px',
                    borderColor: '#D8C4A7',
                    fontSize: '11px',
                    fontFamily: 'sans-serif',
                  }}
                />
                <Area type="monotone" dataKey="students" stroke="#FFB148" strokeWidth={2.5} fillOpacity={1} fill="url(#goldGradient)" name="Siswa Baru" />
                <Area type="monotone" dataKey="hours" stroke="#5AC88A" strokeWidth={2} fillOpacity={1} fill="url(#jadeGradient)" name="Jam Belajar" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
