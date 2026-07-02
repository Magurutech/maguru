'use client'

/**
 * ContinueCreatingCard Component
 *
 * Kartu Bento Utama (Hero Bento) untuk melanjutkan proses pembuatan
 * atau pengelolaan draf kursus terbaru.
 */

import React from 'react'
import { FileEdit, ArrowRight } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'

interface ContinueCreatingCardProps {
  onEdit?: () => void
}

export function ContinueCreatingCard({ onEdit }: ContinueCreatingCardProps) {
  return (
    <TiltCard 
      className="md:col-span-8 card-ancient relative overflow-hidden flex flex-col justify-between p-6 md:p-8 min-h-[340px] depth-card group cursor-pointer"
    >
      {/* Subtle abstract SVG grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="45" height="45" patternUnits="userSpaceOnUse">
              <path d="M 45 0 L 0 0 0 45" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-accent-coral tracking-widest uppercase font-cinzel text-roman">
              DRAF KURSUS AKTIF
            </span>
            <h2 className="font-manrope text-2xl font-bold text-text-primary group-hover:text-accent-coral transition-colors duration-180">
              Advanced Next.js Architecture
            </h2>
            <p className="text-xs text-text-muted font-medium">
              Modul 3: Optimasi Rendering &amp; Caching
            </p>
          </div>
          <span className="text-[10px] font-bold bg-accent-mustard/15 text-accent-mustard border border-accent-mustard/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Draf
          </span>
        </div>

        {/* Current Edit Status */}
        <div className="bg-bg-bone/85 border border-border/10 p-4 rounded-xl space-y-1">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1">
            <FileEdit className="w-3 h-3 text-accent-coral" />
            <span>Terakhir Diedit</span>
          </span>
          <p className="text-sm font-semibold text-text-primary">
            Bab 3.4: Revalidation &amp; On-demand ISR
          </p>
          <p className="text-xs text-text-secondary">
            Diubah 4 jam yang lalu · 3 pelajaran siap dipublikasi
          </p>
        </div>

        {/* Progress & Actions */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-text-secondary font-medium">
              <span>Kelengkapan Kurikulum</span>
              <span className="font-bold text-text-primary">60%</span>
            </div>
            <div className="w-full bg-bg-surface-accent rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-accent-coral to-accent-mustard h-full rounded-full transition-all duration-700 ease-out" 
                style={{ width: '60%' }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.()
              }}
              className="btn-primary flex items-center gap-2 group/btn select-none cursor-pointer"
            >
              <span>Lanjutkan Mengedit</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-180 group-hover/btn:translate-x-1" />
            </button>
            <span className="text-[10px] font-mono tracking-widest text-text-muted">
              REF: NEXT-ADV-M3
            </span>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}
