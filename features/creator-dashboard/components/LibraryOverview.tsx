'use client'

/**
 * LibraryOverview Component
 *
 * Kartu ringkasan Bento Grid di halaman Library yang menampilkan
 * total kursus diterbitkan, draf, jumlah total siswa, dan rating rata-rata.
 */

import React from 'react'
import { Layers, Users, Star } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'

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
    { label: 'Diterbitkan', value: stats.published, icon: Layers, color: 'text-success' },
    { label: 'Draf Aktif', value: stats.draft, icon: Layers, color: 'text-accent-mustard' },
    { label: 'Total Siswa', value: stats.totalStudents, icon: Users, color: 'text-accent-coral' },
    { label: 'Rata-rata Rating', value: `${stats.avgRating} / 5.0`, icon: Star, color: 'text-accent-olive' }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <TiltCard
            key={item.label}
            className="bg-card border border-border/15 p-5 rounded-2xl flex flex-col justify-between min-h-30 paper-texture cursor-default"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {item.label}
              </span>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <p className="font-manrope text-2xl font-black text-text-primary mt-2">
              {item.value}
            </p>
          </TiltCard>
        )
      })}
    </div>
  )
}
