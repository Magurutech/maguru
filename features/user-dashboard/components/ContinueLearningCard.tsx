'use client'

/**
 * ContinueLearningCard Component
 *
 * Kartu utama Bento Grid untuk melanjutkan bab pelajaran aktif terakhir,
 * lengkap dengan progress bar dan tombol navigasi belajar.
 */

import React from 'react'
import { Clock, ArrowRight } from 'lucide-react'
import { TiltCard } from './TiltCard'

interface ContinueLearningCardProps {
  onResume?: () => void
}

export function ContinueLearningCard({ onResume }: ContinueLearningCardProps) {
  return (
    <TiltCard 
      className="md:col-span-8 card-ancient relative overflow-hidden flex flex-col justify-between p-6 md:p-8 min-h-[340px] depth-card group cursor-pointer"
    >
      {/* Subtle abstract SVG grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-accent-coral tracking-widest uppercase font-cinzel text-roman">
              BAB III · REAKSI DAN STATE
            </span>
            <h2 className="font-manrope text-2xl font-bold text-text-primary group-hover:text-accent-coral transition-colors duration-180">
              Introduction to React
            </h2>
            <p className="text-xs text-text-muted font-medium">
              Modul 4: State Management &amp; Lifecycle
            </p>
          </div>
          <span className="text-[10px] font-bold bg-bg-surface-accent text-text-primary px-3 py-1 rounded-full uppercase tracking-wider">
            Aktif
          </span>
        </div>

        {/* Current Lesson Detail Box */}
        <div className="bg-bg-bone/85 border border-border/10 p-4 rounded-xl space-y-1">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
            Pelajaran Terakhir
          </span>
          <p className="text-sm font-semibold text-text-primary">
            Pelajaran 4.3: useState vs useReducer
          </p>
          <p className="text-xs text-text-secondary flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent-coral" />
            <span>24 menit tersisa dalam bab ini</span>
          </p>
        </div>

        {/* Progress & Action */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-text-secondary font-medium">
              <span>Progress Kurikulum</span>
              <span className="font-bold text-text-primary">75%</span>
            </div>
            <div className="w-full bg-bg-surface-accent rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-accent-coral to-accent-mustard h-full rounded-full transition-all duration-700 ease-out" 
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onResume?.()
              }}
              className="btn-primary flex items-center gap-2 group/btn select-none cursor-pointer"
            >
              <span>Lanjutkan Belajar</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-180 group-hover/btn:translate-x-1" />
            </button>
            <span className="text-[10px] font-mono tracking-widest text-text-muted">
              REF: REACT-MOD4
            </span>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}
