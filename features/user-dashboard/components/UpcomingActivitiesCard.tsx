'use client'

/**
 * UpcomingActivitiesCard Component
 *
 * Kartu Bento Grid untuk mencatat timeline aktivitas mendatang (Live Consult, QA, Deadlines).
 */

import React from 'react'
import { Calendar } from 'lucide-react'
import { TiltCard } from './TiltCard'

export function UpcomingActivitiesCard() {
  return (
    <TiltCard 
      className="md:col-span-4 card-ancient p-6 flex flex-col justify-between min-h-[220px] cursor-default"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
            Aktivitas Mendatang
          </h3>
          <Calendar className="w-4 h-4 text-text-muted" />
        </div>

        {/* Timeline */}
        <div className="space-y-3 relative pl-4 border-l border-border/10">
          <div className="relative space-y-0.5">
            <span className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-accent-coral border border-card"></span>
            <p className="text-xs font-bold text-text-primary leading-none">Review Proyek Akhir</p>
            <p className="text-[10px] text-text-muted font-medium">Besok, 10:00 · Live Consult</p>
          </div>
          <div className="relative space-y-0.5">
            <span className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-accent-mustard border border-card"></span>
            <p className="text-xs font-bold text-text-primary leading-none">Sesi QA Modul 4</p>
            <p className="text-[10px] text-text-muted font-medium">Rabu, 14:00 · Group QA</p>
          </div>
          <div className="relative space-y-0.5">
            <span className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-text-faint border border-card"></span>
            <p className="text-xs font-bold text-text-primary leading-none">Deadline Proyek React</p>
            <p className="text-[10px] text-text-muted font-medium">Jumat, 23:59 · Hard Deadline</p>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}
