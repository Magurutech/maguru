'use client'

/**
 * AICreatorAssistantCard Component
 *
 * Implements the "Sensei AI Co-Creator" interactive banner with tightened -2 spacing.
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { Sparkles, MessageSquare, Lightbulb, FileText, Compass, X } from 'lucide-react'

export function AICreatorAssistantCard() {
  const [activePrompt, setActivePrompt] = useState<string | null>(null)

  const quickPrompts = [
    { label: 'Rekomendasi Materi', icon: Lightbulb, query: 'Berikan rekomendasi sub-bab dan materi menarik untuk memperkaya kursus ini.' },
    { label: 'Review Konten', icon: FileText, query: 'Review materi pelajaran terakhir dan identifikasi potensi kebingungan siswa.' },
    { label: 'Ide & Struktur Kursus', icon: Compass, query: 'Bantu saya menstrukturkan alur pembelajaran dari dasar ke proyek nyata.' },
  ]

  return (
    <div className="md:col-span-12 relative overflow-hidden bg-linear-to-r from-[#F3EBFF] via-[#EBE0FF] to-[#FAF5ED] border border-[#8C4FFF]/25 rounded-3xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(140,79,255,0.06)] space-y-3">
      {/* Subtle Mist Overlay */}
      <div className="absolute right-0 top-0 w-80 h-full bg-linear-to-l from-white/20 to-transparent pointer-events-none" />

      {/* Main Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          {/* Whimsical Wizard Avatar */}
          <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#FFFDF9] border border-[#8C4FFF]/30 shadow-xs flex items-center justify-center shrink-0">
            <span className="text-2xl select-none">🧙‍♂️</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8C4FFF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8C4FFF]" />
            </span>
          </div>

          <div className="space-y-0.5">
            <h3 className="font-sans text-base sm:text-lg font-extrabold text-[#2D2319] leading-tight">
              Butuh Bantuan?
            </h3>
            <p className="font-sans text-xs sm:text-[13px] text-[#6E5D4B] leading-relaxed max-w-xl">
              Sensei AI siap membantu kamu dalam membuat kursus yang lebih interaktif, terstruktur, dan sesuai dengan kebutuhan siswa.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/chat"
          className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-[#8C4FFF] hover:bg-[#7A3CE8] active:scale-95 text-white font-sans text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(140,79,255,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all shrink-0 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-white" />
          <span>Tanya Sensei AI</span>
          <span>➔</span>
        </Link>
      </div>

      {/* Quick Prompt Pills Bar */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-[#8C4FFF]/15 relative z-10">
        {/* Core Tag */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-sans font-semibold bg-[#FFFDF9] border border-[#8C4FFF]/30 text-[#6B21A8] shadow-2xs">
          <Sparkles className="w-3 h-3 text-[#8C4FFF]" />
          <span>Sensei AI Co-Creator</span>
        </div>

        {quickPrompts.map((p) => {
          const Icon = p.icon
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => setActivePrompt(activePrompt === p.label ? null : p.query)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-sans font-medium bg-[#FFFDF9]/80 hover:bg-[#FFFDF9] border border-[#D8C4A7]/50 hover:border-[#8C4FFF]/40 text-[#6E5D4B] hover:text-[#2D2319] transition-all cursor-pointer shadow-2xs"
            >
              <Icon className="w-3 h-3 text-[#8C4FFF]" />
              <span>{p.label}</span>
            </button>
          )
        })}
      </div>

      {/* Interactive Quick Answer Dialog if Prompt Clicked */}
      {activePrompt && (
        <div className="mt-2.5 p-3.5 bg-[#FFFDF9] border border-[#8C4FFF]/30 rounded-2xl shadow-xs relative animate-fade-in text-xs font-sans text-[#2D2319] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#6B21A8] flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3 h-3 text-[#8C4FFF]" />
              Saran Cepat Sensei AI
            </span>
            <button
              type="button"
              onClick={() => setActivePrompt(null)}
              className="p-1 hover:bg-[#FAF5ED] rounded-lg text-[#6E5D4B] transition-colors"
            >
              <X className="w-3 h-3 text-[#6E5D4B]" />
            </button>
          </div>
          <p className="text-[#6E5D4B] leading-relaxed text-xs">
            {activePrompt}
          </p>
          <div className="pt-0.5">
            <Link
              href="/chat"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C4FFF] hover:text-[#7A3CE8]"
            >
              <span>Diskusikan selengkapnya di AI Chat Studio ➔</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
