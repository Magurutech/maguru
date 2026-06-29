'use client'

/**
 * LearningStreakCard Component
 *
 * Kartu Bento Grid untuk melacak konsistensi belajar harian dalam seminggu (Streak).
 */

import React from 'react'
import { Flame } from 'lucide-react'
import { TiltCard } from './TiltCard'

export function LearningStreakCard() {
  return (
    <TiltCard 
      className="md:col-span-4 card-ancient p-6 flex flex-col justify-between min-h-[220px] cursor-default"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
            Konsistensi
          </h3>
          <Flame className="w-4 h-4 text-accent-coral" />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <h4 className="font-manrope text-lg font-extrabold text-text-primary leading-tight">
              5 Hari Beruntun
            </h4>
            <p className="text-xs text-text-muted">Rekor terbaik: 12 hari</p>
          </div>
        </div>
      </div>

      {/* 7 Days Grid */}
      <div className="flex justify-between gap-1 pt-4 border-t border-border/10">
        {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, idx) => {
          const active = idx < 5 // Sen-Jum aktif
          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
              <span className="text-[9px] font-bold font-mono text-text-muted">{day}</span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                active 
                  ? 'bg-accent-coral text-white shadow-glow' 
                  : 'border border-border/10 text-text-muted bg-bg-bone/40'
              }`}>
                {active ? '✓' : ''}
              </div>
            </div>
          )
        })}
      </div>
    </TiltCard>
  )
}
