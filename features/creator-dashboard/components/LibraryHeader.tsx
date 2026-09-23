'use client'

/**
 * LibraryHeader Component
 *
 * Implements the Whimsical Ancient Asian Fantasy "Pustaka Kursus" header
 * matching Gambar 2:
 * - Oriental traditional seal stamp [ 課程 ] (Kurikulum Kuno)
 * - Color-coded status counters (Terdaftar, Diterbitkan, Draf)
 * - Subtle oriental mountain & pagoda panoramic banner background
 * - Tactile Crimson lacquer "+ Buat Kursus Baru" CTA button
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LibraryHeaderProps {
  courseCount: number
  publishedCount: number
  draftCount: number
}

export function LibraryHeader({
  courseCount,
  publishedCount,
  draftCount,
}: LibraryHeaderProps) {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#D8C4A7]/60 bg-[#FFFDF9] p-4 sm:p-5 shadow-[0_4px_20px_rgba(45,35,25,0.04)]">
      {/* Subtle Oriental Mountain & Pagoda Landscape Background */}
      <div className="absolute right-0 top-0 bottom-0 w-2/5 pointer-events-none select-none overflow-hidden opacity-25 hidden md:block">
        <Image
          src="/banner/banner-coruse-detail.webp"
          alt="Oriental Pagoda Landscape"
          fill
          className="object-cover object-right mask-[linear-gradient(to_left,black_20%,transparent_100%)]"
        />
      </div>

      <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Back button + Title & Metadata */}
        <div className="space-y-2">
          <button
            onClick={() => router.push('/creator')}
            className="inline-flex items-center gap-1.5 text-xs text-[#8C7D6E] hover:text-[#2D2319] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-sans font-medium">Kembali ke Studio</span>
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#2D2319] tracking-tight">
              Pustaka Kursus
            </h1>
            {/* Traditional Vermilion Seal Stamp (Chop) */}
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-[#E53935]/40 bg-[#E53935]/10 text-[#C62828] font-serif text-[11px] font-bold shadow-2xs select-none"
              title="Cap Kurikulum Maguru"
            >
              課程
            </span>
          </div>

          {/* Color-Coded Status Meta Counters */}
          <div className="flex items-center gap-2 text-xs sm:text-[13px] text-[#6E5D4B] font-sans font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E53935]" />
              <strong className="text-[#2D2319]">{courseCount}</strong> Terdaftar
            </span>
            <span className="text-[#D8C4A7]">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5AC88A]" />
              <strong className="text-[#2D2319]">{publishedCount}</strong> Diterbitkan
            </span>
            <span className="text-[#D8C4A7]">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFB148]" />
              <strong className="text-[#2D2319]">{draftCount}</strong> Draf
            </span>
          </div>
        </div>

        {/* Right Side: Tactile Crimson Lacquer "+ Buat Kursus Baru" CTA */}
        <div className="shrink-0 pt-1 md:pt-0">
          <Link href="/creator/courses/create">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl bg-linear-to-r from-[#E53935] via-[#D32F2F] to-[#C62828] hover:from-[#F44336] hover:to-[#D32F2F] text-white font-sans text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(229,57,53,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_20px_rgba(229,57,53,0.45)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Buat Kursus Baru</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
