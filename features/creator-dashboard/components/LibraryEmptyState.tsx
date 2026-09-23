'use client'

/**
 * LibraryEmptyState Component
 *
 * Implements the Empty State for course catalog
 * using the clean parchment style without diagonal noise.
 */

import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export function LibraryEmptyState() {
  return (
    <div className="bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-[0_4px_16px_rgba(45,35,25,0.04)]">
      {/* Icon Seal */}
      <div className="w-16 h-16 rounded-2xl bg-[#FAF5ED] border border-[#D8C4A7]/50 flex items-center justify-center mx-auto text-3xl shadow-2xs select-none">
        📜
      </div>

      <div className="space-y-1.5">
        <h2 className="font-sans text-xl font-bold text-[#2D2319]">
          Belum Ada Gulungan Kursus
        </h2>
        <p className="font-sans text-xs text-[#6E5D4B] leading-relaxed max-w-sm mx-auto">
          Bagikan keahlian dan pengetahuan terbaikmu kepada para petualang di Maguru. Buat modul belajar interaktif pertamamu sekarang.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/creator/courses/create">
          <button
            type="button"
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-2xl bg-linear-to-r from-[#E53935] via-[#D32F2F] to-[#C62828] hover:from-[#F44336] hover:to-[#D32F2F] text-white font-sans text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(229,57,53,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_20px_rgba(229,57,53,0.45)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Buat Kursus Pertama Anda</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
