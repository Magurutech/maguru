'use client'

/**
 * LibraryOverview Component
 *
 * Implements the 4-Capsule Metric Row matching Gambar 2:
 * - 1. Diterbitkan (Emerald Green Badge)
 * - 2. Draf Aktif (Parchment Amber Badge)
 * - 3. Total Siswa (Azure Blue Badge)
 * - 4. Rata-Rata Rating (Golden Star Badge)
 * Clean, flat parchment background (#FFFDF9) without diagonal noise.
 */

import React from 'react'
import { BookOpen, FileText, Users, Star, ChevronRight } from 'lucide-react'

interface LibraryOverviewProps {
  stats: {
    published: number
    draft: number
    totalStudents: number
    avgRating: number
  }
}

export function LibraryOverview({ stats }: LibraryOverviewProps) {
  const items = [
    {
      label: 'Diterbitkan',
      value: stats.published,
      icon: BookOpen,
      iconBg: 'bg-[#5AC88A]/15 border-[#5AC88A]/35 text-[#1B804B]',
    },
    {
      label: 'Draf Aktif',
      value: stats.draft,
      icon: FileText,
      iconBg: 'bg-[#FFB148]/15 border-[#FFB148]/35 text-[#B96500]',
    },
    {
      label: 'Total Siswa',
      value: stats.totalStudents,
      icon: Users,
      iconBg: 'bg-[#3B82F6]/15 border-[#3B82F6]/35 text-[#1D4ED8]',
    },
    {
      label: 'Rata-Rata Rating',
      value: `${stats.avgRating}`,
      isRating: true,
      icon: Star,
      iconBg: 'bg-[#FFB148]/20 border-[#FFB148]/40 text-[#D97706]',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="group bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-2xl p-3 sm:p-3.5 shadow-[0_2px_10px_rgba(45,35,25,0.03)] hover:border-[#D8C4A7] hover:shadow-[0_4px_16px_rgba(45,35,25,0.06)] transition-all flex items-center justify-between gap-2.5 cursor-default select-none"
          >
            {/* Left: Colored Icon Badge */}
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${item.iconBg}`}
            >
              <Icon className="w-5 h-5 fill-current/15" />
            </div>

            {/* Middle: Metric Info */}
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-sans font-semibold text-[#8C7D6E] block leading-none truncate">
                {item.label}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-sans text-xl sm:text-2xl font-extrabold text-[#2D2319] leading-none">
                  {item.value}
                </span>
                {item.isRating && (
                  <span className="text-xs text-[#FFB148] select-none">★</span>
                )}
              </div>
            </div>

            {/* Right: Subtle Chevron */}
            <ChevronRight className="w-4 h-4 text-[#C5B7A6] group-hover:text-[#2D2319] group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        )
      })}
    </div>
  )
}
