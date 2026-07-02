'use client'

/**
 * AchievementsCard Component
 *
 * Kartu Bento Grid untuk menampilkan pencapaian terbaru dan sertifikat yang siap diklaim.
 */

import React from 'react'
import { Award } from 'lucide-react'
import { TiltCard } from './TiltCard'

interface AchievementsCardProps {
  onClaim?: () => void
}

export function AchievementsCard({ onClaim }: AchievementsCardProps) {
  return (
    <TiltCard 
      className="md:col-span-4 card-ancient p-6 flex flex-col justify-between min-h-[220px] cursor-default"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
            Pencapaian Terbaru
          </h3>
          <Award className="w-4 h-4 text-accent-mustard" />
        </div>

        {/* Badge list */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-full border border-border/15 bg-bg-bone flex items-center justify-center font-serif text-[11px] font-bold text-accent-coral shadow-sm paper-texture">
              I
            </div>
            <div className="w-10 h-10 rounded-full border border-border/15 bg-bg-bone flex items-center justify-center font-serif text-[11px] font-bold text-accent-mustard shadow-sm paper-texture">
              II
            </div>
            <div className="w-10 h-10 rounded-full border border-border/15 bg-bg-bone flex items-center justify-center font-serif text-[11px] font-bold text-accent-olive shadow-sm paper-texture">
              III
            </div>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-text-primary leading-none">3 Badge Kompetensi</h4>
            <p className="text-[10px] text-text-muted font-medium">1 sertifikat siap klaim</p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="button"
          onClick={onClaim}
          className="w-full text-center py-2 bg-bg-bone hover:bg-bg-surface-accent border border-border/10 rounded-xl text-xs font-semibold text-text-secondary transition-colors cursor-pointer select-none"
        >
          Klaim &amp; Lihat Sertifikat
        </button>
      </div>
    </TiltCard>
  )
}
