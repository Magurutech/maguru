'use client'

/**
 * CourseOverviewCard Component
 *
 * Kartu Bento Grid untuk menampilkan ringkasan status semua kursus yang dibuat
 * (Diterbitkan, Draf, Sedang Ditinjau, Diarsipkan).
 */

import React from 'react'
import { Layers } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'

interface CourseOverviewCardProps {
  stats: {
    published: number
    draft: number
    inReview: number
    archived: number
  }
}

export function CourseOverviewCard({ stats }: CourseOverviewCardProps) {
  const items = [
    { label: 'Diterbitkan', value: stats.published, accent: 'text-success bg-success/5 border-success/15' },
    { label: 'Draf', value: stats.draft, accent: 'text-accent-mustard bg-accent-mustard/5 border-accent-mustard/15' },
    { label: 'Ditinjau', value: stats.inReview, accent: 'text-accent-coral bg-accent-coral/5 border-accent-coral/15' },
    { label: 'Diarsipkan', value: stats.archived, accent: 'text-text-muted bg-bg-surface-accent border-border/10' }
  ]

  return (
    <TiltCard 
      className="md:col-span-6 card-ancient p-6 flex flex-col justify-between min-h-[200px] cursor-default"
    >
      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
            Ikhtisar Kursus Saya
          </h3>
          <Layers className="w-4 h-4 text-text-muted" />
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {items.map((item) => (
            <div 
              key={item.label}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${item.accent}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted opacity-80">{item.label}</span>
              <p className="font-manrope text-2xl font-black mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 text-center text-[10px] text-text-muted italic">
        Total {stats.published + stats.draft + stats.inReview + stats.archived} materi kursus dikelola
      </div>
    </TiltCard>
  )
}
