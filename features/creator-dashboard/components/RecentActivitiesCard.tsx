'use client'

/**
 * RecentActivitiesCard Component
 *
 * Kartu Bento Grid untuk menampilkan lini masa (timeline) aktivitas terbaru
 * pada ruang lingkup studio pembuatan (pendaftaran siswa, tugas masuk, dll).
 */

import React from 'react'
import { Calendar, ChevronRight } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'

interface Activity {
  id: number
  type: 'enrollment' | 'submission' | 'discussion' | 'review'
  title: string
  time: string
  accent: string
}

export function RecentActivitiesCard() {
  const activities: Activity[] = [
    { id: 1, type: 'enrollment', title: 'Ahmad bergabung di "React Patterns"', time: '10 menit yang lalu', accent: 'bg-success' },
    { id: 2, type: 'submission', title: 'Tugas Bab 2 diunggah oleh Diana', time: '1 jam yang lalu', accent: 'bg-accent-coral' },
    { id: 3, type: 'discussion', title: 'Komentar baru dari Budi di Pelajaran 4.2', time: '3 jam yang lalu', accent: 'bg-accent-mustard' }
  ]

  return (
    <TiltCard 
      className="md:col-span-5 card-ancient p-6 flex flex-col justify-between min-h-[250px] cursor-default"
    >
      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
            Aktivitas Studio Terbaru
          </h3>
          <Calendar className="w-4 h-4 text-text-muted" />
        </div>

        {/* Timeline List */}
        <div className="space-y-3 relative pl-4 border-l border-border/10">
          {activities.map((act) => (
            <div key={act.id} className="relative space-y-0.5">
              <span className={`absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full border border-card ${act.accent}`}></span>
              <p className="text-xs font-bold text-text-primary leading-none">{act.title}</p>
              <p className="text-[10px] text-text-muted font-medium">{act.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border/5">
        <button 
          onClick={() => console.log('Expand activity timeline')}
          className="w-full text-center py-2 bg-bg-bone hover:bg-bg-surface-accent border border-border/10 rounded-xl text-xs font-semibold text-text-secondary transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          <span>Lini Masa Lengkap</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </TiltCard>
  )
}
