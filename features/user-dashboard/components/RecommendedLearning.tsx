'use client'

/**
 * RecommendedLearning Component
 *
 * Section yang menyajikan daftar rekomendasi jalur belajar AI
 * yang dirancang interaktif dengan pembungkus TiltCard.
 */

import React from 'react'
import { Sparkles, Clock, ChevronRight } from 'lucide-react'
import { TiltCard } from './TiltCard'

interface Recommendation {
  id: string
  title: string
  description: string
  duration?: string
  difficulty?: string
  reason?: string
}

interface RecommendedLearningProps {
  recommendations: Recommendation[]
  onEnroll?: (id: string) => void
}

export function RecommendedLearning({
  recommendations,
  onEnroll,
}: RecommendedLearningProps) {
  return (
    <section aria-label="Rekomendasi Belajar" className="md:col-span-12 space-y-4 pt-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/10">
        <Sparkles className="w-4 h-4 text-accent-coral animate-pulse" />
        <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
          Rekomendasi Jalur Belajar AI
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <TiltCard 
            key={rec.id}
            className="bg-card border border-border/15 rounded-2xl p-5 flex flex-col justify-between min-h-[170px] paper-texture cursor-pointer hover:shadow-md hover:border-accent-coral/15"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <span className="text-[9px] font-bold text-accent-coral uppercase tracking-wider font-mono">
                  {rec.reason || 'REKOMENDASI'}
                </span>
                <span className="text-[9px] font-bold bg-bg-surface-accent text-text-primary px-2.5 py-0.5 rounded-full uppercase">
                  {rec.difficulty || 'intermediate'}
                </span>
              </div>
              <h4 className="font-manrope text-sm font-bold text-text-primary leading-tight">
                {rec.title}
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                {rec.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border/5 flex justify-between items-center">
              <span className="text-[10px] text-text-muted font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{rec.duration || '12 Jam Belajar'}</span>
              </span>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onEnroll?.(rec.id)
                }}
                className="text-xs text-accent-coral font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <span>Mulai Belajar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}
