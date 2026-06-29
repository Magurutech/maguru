'use client'

/**
 * LearnerInsightsCard Component
 *
 * Kartu Bento Grid untuk menampilkan statistik keterlibatan belajar siswa
 * (Siswa Aktif, Pendaftaran Baru, Tingkat Kelulusan, Penilaian Kursus).
 */

import React from 'react'
import { Users, TrendingUp, Award, Star } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'

interface LearnerInsightsCardProps {
  stats: {
    activeStudents: number
    newEnrollments: number
    completionRate: number
    rating: number
  }
}

export function LearnerInsightsCard({ stats }: LearnerInsightsCardProps) {
  const items = [
    { label: 'Siswa Aktif', value: stats.activeStudents, icon: Users, accent: 'text-accent-coral' },
    { label: 'Pendaftaran Baru', value: `+${stats.newEnrollments}`, icon: TrendingUp, accent: 'text-success' },
    { label: 'Kelulusan', value: `${stats.completionRate}%`, icon: Award, accent: 'text-accent-mustard' },
    { label: 'Penilaian', value: `${stats.rating} / 5.0`, icon: Star, accent: 'text-accent-olive' }
  ]

  return (
    <TiltCard 
      className="md:col-span-6 card-ancient p-6 flex flex-col justify-between min-h-[200px] cursor-default"
    >
      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center pb-2 border-b border-border/10">
          <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
            Analitik Siswa &amp; Kursus
          </h3>
          <Users className="w-4 h-4 text-text-muted" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div 
                key={item.label}
                className="flex items-center gap-3 p-3 bg-bg-bone/60 border border-border/5 rounded-xl"
              >
                <div className={`w-9 h-9 rounded-full bg-background border border-border/5 flex items-center justify-center shrink-0 ${item.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">{item.label}</span>
                  <p className="font-manrope text-base font-bold text-text-primary mt-0.5 leading-none">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="pt-2 text-[10px] text-text-muted text-center font-mono">
        DATA DISINKRONKAN REAL-TIME
      </div>
    </TiltCard>
  )
}
