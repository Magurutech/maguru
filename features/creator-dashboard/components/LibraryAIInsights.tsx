'use client'

/**
 * LibraryAIInsights Component
 *
 * Spanduk Rekomendasi AI (AI Insights) di halaman Library yang menampilkan
 * saran optimasi kursus, alerts, dan tindakan cepat untuk meningkatkan retensi.
 */

import React, { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'

export function LibraryAIInsights() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <TiltCard className="md:col-span-12 bg-accent-coral/5 border border-accent-coral/10 p-5 rounded-2xl flex items-start justify-between gap-4 paper-texture cursor-default">
      <div className="flex items-start gap-4">
        {/* Mascot Icon */}
        <div className="w-10 h-10 rounded-full border border-accent-coral/25 bg-accent-coral/10 flex items-center justify-center shrink-0 animate-float">
          <Sparkles className="w-5 h-5 text-accent-coral animate-pulse" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-accent-coral uppercase tracking-widest block">
            REKOMENDASI KREATOR AI
          </span>
          <p className="text-xs text-text-primary font-medium leading-relaxed">
            Draf kelas <strong>&quot Advanced Next.js Architecture &quot</strong> Anda saat ini
            sudah mencapai kelengkapan materi 60%. Siswa yang menyelesaikan kursus React sebelumnya
            mulai mencari kelanjutan modul Next.js Anda. Publikasikan segera draf Anda untuk menjaga
            retensi siswa!
          </p>
        </div>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="text-text-muted hover:text-text-primary p-1 cursor-pointer transition-colors"
        aria-label="Tutup rekomendasi"
      >
        <X className="w-4 h-4" />
      </button>
    </TiltCard>
  )
}
