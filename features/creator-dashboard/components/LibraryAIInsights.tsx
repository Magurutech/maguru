'use client'

/**
 * LibraryAIInsights Component
 *
 * Implements the Sensei AI Recommendation Banner matching Gambar 2:
 * - Sensei AI Wizard Mascot with glowing wisdom aura
 * - "Rekomendasi Sensei AI" iridescent pill badge
 * - Motivational engagement suggestion copy (without escaped entity bugs)
 * - Tactile Violet/Indigo lacquer "Lihat Panduan AI" button
 * - Clean flat parchment surface with subtle oriental pagoda landscape
 */

import React, { useState } from 'react'
import Image from 'next/image'
import { Sparkles, Wand2, X } from 'lucide-react'

export function LibraryAIInsights() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#D8C4A7]/60 bg-[#FFFDF9] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(45,35,25,0.04)] animate-fade-in">
      {/* Subtle Landscape in background */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none select-none opacity-15 hidden md:block">
        <Image
          src="/banner/banner-coruse-detail.webp"
          alt="Ancient Pagoda"
          fill
          className="object-cover object-right mask-[linear-gradient(to_left,black,transparent)]"
        />
      </div>

      <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Left: Mascot & Advice Content */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Sensei Mascot Avatar */}
          <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-[#7C3AED] via-[#6366F1] to-[#3B82F6] p-0.5 shadow-[0_4px_12px_rgba(99,102,241,0.25)] shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-[#1E1711] flex items-center justify-center text-2xl select-none">
              🧙‍♂️
            </div>
            {/* Sparkle Orb Accent */}
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FFB148] flex items-center justify-center text-[9px] shadow-xs">
              ✨
            </span>
          </div>

          <div className="space-y-1 min-w-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-[#EDE9FE] border border-[#DDD6FE] text-[#6D28D9]">
              <Sparkles className="w-3 h-3 text-[#7C3AED]" />
              <span>Rekomendasi Sensei AI</span>
            </div>

            {/* Title */}
            <h3 className="font-sans text-sm sm:text-base font-bold text-[#2D2319] leading-tight">
              Tingkatkan engagement kursus Anda!
            </h3>

            {/* Description */}
            <p className="font-sans text-xs text-[#6E5D4B] leading-relaxed max-w-2xl">
              Coba tambahkan kuis interaktif di akhir modul untuk meningkatkan tingkat penyelesaian siswa hingga 30%.
            </p>
          </div>
        </div>

        {/* Right: CTA & Dismiss */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-linear-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white font-sans text-xs font-bold shadow-[0_4px_12px_rgba(99,102,241,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Lihat Panduan AI</span>
          </button>

          <button
            onClick={() => setVisible(false)}
            className="w-7 h-7 rounded-xl flex items-center justify-center text-[#8C7D6E] hover:text-[#2D2319] hover:bg-[#FAF5ED] transition-colors cursor-pointer"
            aria-label="Tutup rekomendasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
