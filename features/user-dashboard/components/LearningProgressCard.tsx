'use client'

/**
 * LearningProgressCard Component
 *
 * Kartu Bento Grid untuk menampilkan visualisasi jam belajar mingguan
 * menggunakan grafik SVG minimalis serta ringkasan durasi dan peringkat penguasaan.
 */

import React from 'react'
import { Clock } from 'lucide-react'
import { TiltCard } from './TiltCard'

export function LearningProgressCard() {
  return (
    <TiltCard 
      className="md:col-span-5 card-ancient p-6 flex flex-col justify-between min-h-[300px] cursor-default"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
            Jam Belajar Mingguan
          </h3>
          <Clock className="w-4 h-4 text-accent-olive" />
        </div>

        {/* Hand-crafted Minimal SVG Sparkline Chart */}
        <div className="relative h-28 w-full flex items-end pt-4">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
            <div className="border-b border-border/5 w-full h-0"></div>
            <div className="border-b border-border/5 w-full h-0"></div>
            <div className="border-b border-border/5 w-full h-0"></div>
          </div>

          {/* SVG Area */}
          <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent-coral)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--color-accent-coral)" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Area Fill */}
            <path 
              d="M 0 40 Q 15 25 30 30 T 60 10 T 90 20 T 100 35 L 100 40 L 0 40 Z" 
              fill="url(#chartGrad)" 
            />
            {/* Line Path */}
            <path 
              d="M 0 40 Q 15 25 30 30 T 60 10 T 90 20 T 100 35" 
              fill="none" 
              stroke="var(--color-accent-coral)" 
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            
            {/* Points */}
            <circle cx="30" cy="30" r="1.5" fill="var(--color-accent-coral)" />
            <circle cx="60" cy="10" r="1.5" fill="var(--color-accent-coral)" />
            <circle cx="90" cy="20" r="1.5" fill="var(--color-accent-coral)" />
          </svg>
        </div>

        {/* Chart X-axis labels */}
        <div className="flex justify-between text-[10px] text-text-muted font-bold font-mono">
          <span>SEN</span>
          <span>SEL</span>
          <span>RAB</span>
          <span>KAM</span>
          <span>JUM</span>
          <span>SAB</span>
          <span>MIN</span>
        </div>
      </div>

      {/* Simple Info Row */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/10 text-center">
        <div className="space-y-0.5 border-r border-border/10">
          <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Durasi</span>
          <p className="font-manrope text-base font-bold text-text-primary">14.5 jam</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Mastery</span>
          <p className="font-manrope text-base font-bold text-success">87% Rank</p>
        </div>
      </div>
    </TiltCard>
  )
}
