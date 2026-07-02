'use client'

/**
 * GrowthOpportunitiesCard Component
 *
 * Section yang menyajikan peluang pertumbuhan materi (Growth Opportunities)
 * yang direkomendasikan secara cerdas oleh AI untuk para mentor/creator.
 */

import React from 'react'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'

interface Opportunity {
  id: number
  title: string
  description: string
  actionLabel: string
  impact: 'Tinggi' | 'Sedang' | 'Rendah'
  category: string
}

export function GrowthOpportunitiesCard() {
  const opportunities: Opportunity[] = [
    { 
      id: 1, 
      category: 'OPTIMASI KURSUS', 
      title: 'Tambahkan Sumber Daya Unduhan di Modul 2', 
      description: 'Kursus dengan cheatsheet PDF memiliki tingkat penyelesaian 18% lebih tinggi. AI menyarankan untuk menambahkan rangkuman contekan sintaks.', 
      actionLabel: 'Unggah PDF', 
      impact: 'Tinggi' 
    },
    { 
      id: 2, 
      category: 'RETENSI MAHASISWA', 
      title: 'Tanggapi Diskusi Menggantung di Bab 4', 
      description: 'Ada 3 pertanyaan siswa yang belum terjawab selama lebih dari 24 jam. Respon cepat meningkatkan reputasi instruktur Anda.', 
      actionLabel: 'Balas Diskusi', 
      impact: 'Tinggi' 
    },
    { 
      id: 3, 
      category: 'PUBLIKASI KONTEN', 
      title: 'Publikasikan Draf Modul "Next.js Rendering"', 
      description: 'Materi draf Next.js Anda sudah lengkap 90%. Segera luncurkan modul ini untuk memicu minat belajar siswa aktif.', 
      actionLabel: 'Buka Draf', 
      impact: 'Sedang' 
    }
  ]

  return (
    <section aria-label="Peluang Pertumbuhan" className="md:col-span-12 space-y-4 pt-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/10">
        <Sparkles className="w-4 h-4 text-accent-coral animate-pulse" />
        <h3 className="font-manrope text-sm font-bold text-text-primary tracking-wide uppercase">
          Peluang Pengembangan Kelas AI
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opp) => (
          <TiltCard 
            key={opp.id}
            className="bg-card border border-border/15 rounded-2xl p-5 flex flex-col justify-between min-h-42.5 paper-texture cursor-pointer hover:shadow-md hover:border-accent-coral/15"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <span className="text-[9px] font-bold text-accent-coral uppercase tracking-wider font-mono">
                  {opp.category}
                </span>
                <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  opp.impact === 'Tinggi' 
                    ? 'bg-accent-coral/10 text-accent-coral' 
                    : 'bg-accent-mustard/15 text-accent-mustard'
                }`}>
                  Dampak {opp.impact}
                </span>
              </div>
              <h4 className="font-manrope text-sm font-bold text-text-primary leading-tight">
                {opp.title}
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                {opp.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border/5 flex justify-between items-center mt-auto">
              <span className="text-[10px] text-text-muted font-semibold flex items-center gap-1 font-mono">
                AI RECOMMENDATION
              </span>
              <button 
                type="button"
                onClick={() => console.log('Executing action:', opp.id)}
                className="text-xs text-accent-coral font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <span>{opp.actionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}
