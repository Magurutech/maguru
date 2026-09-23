'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, X, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react'
import type { CourseDetail, CreatorProfile } from './types'

interface PremiumSidebarProps {
  course: CourseDetail
  enrolled: boolean
  children: React.ReactNode // Slot for CourseEnrollButton
  creator?: CreatorProfile | null
}

/**
 * Sensei AI Mentor Callout Card (Whimsical Maguru Mascot Widget)
 */
export function SenseiMentorCard() {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-[#F5EEFF] via-[#EDE0FF] to-[#FAF5ED] border border-[#8C4FFF]/25 rounded-3xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(140,79,255,0.06)] space-y-3">
      {/* Subtle Ambient Orb */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#8C4FFF]/10 blur-xl pointer-events-none" />

      {/* Top Pill Tag */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#FFFDF9]/90 border border-[#8C4FFF]/30 text-[#6B21A8]">
        <Sparkles className="w-3 h-3 text-[#8C4FFF]" />
        <span>Sensei AI Mentor</span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h4 className="font-sans text-sm sm:text-base font-bold text-[#2D2319] leading-snug">
            Ada pertanyaan?<br />Tanya AI Guru!
          </h4>
          <p className="font-sans text-[11.5px] text-[#6E5D4B] leading-relaxed">
            Dapatkan bantuan, penjelasan, atau review kode dari AI Mentor kapan saja.
          </p>
        </div>

        {/* Whimsical Mascot Icon / Avatar */}
        <div className="relative w-12 h-12 rounded-2xl bg-[#FFFDF9] border border-[#8C4FFF]/30 shadow-xs flex items-center justify-center shrink-0">
          <span className="text-2xl select-none">🧙‍♂️</span>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8C4FFF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8C4FFF]" />
          </span>
        </div>
      </div>

      {/* Action Button: Mulai Chat */}
      <Link
        href="/chat"
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#8C4FFF] hover:bg-[#7A3CE8] active:scale-95 text-white font-sans text-xs sm:text-sm font-semibold shadow-[0_2px_8px_rgba(140,79,255,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all"
      >
        <MessageSquare className="w-3.5 h-3.5 text-white" />
        <span>Mulai Chat</span>
      </Link>
    </div>
  )
}

/**
 * TabletCoursePreview
 *
 * Dedicated horizontal preview card positioned ABOVE tabs on Tablet screens (768px - 1023px)
 */
export function TabletCoursePreview({
  children,
}: {
  course: CourseDetail
  enrolled: boolean
  children: React.ReactNode
}) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  return (
    <>
      <div className="border border-[#D8C4A7]/60 rounded-3xl overflow-hidden bg-[#FFFDF9] shadow-[0_4px_16px_rgba(45,35,25,0.06)] p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-center">
        {/* Left: Video Preview Thumbnail */}
        <div className="relative w-full md:w-[44%] aspect-16/10 rounded-2xl overflow-hidden bg-[#2D2319] group shrink-0 shadow-xs">
          <Image
            src="/banner/banner-coruse-detail.webp"
            alt="Video Preview Thumbnail"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-80"
            sizes="400px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />

          {/* Top-Left Badge: Video Preview */}
          <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-sans font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
            <Play className="w-2.5 h-2.5 fill-white text-white" />
            <span>Video Preview</span>
          </div>

          {/* Center Play Button */}
          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 active:scale-95 transition-all group-hover:bg-[#FF4D4D]"
            aria-label="Putar Video Preview"
          >
            <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
          </button>

          {/* Bottom-Right Duration Badge */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10.5px] font-sans font-medium bg-black/70 text-white tabular-nums">
            ⏱️ 3:42
          </div>
        </div>

        {/* Right: Pricing, CTA & Benefits */}
        <div className="flex-1 w-full space-y-3">
          {/* Price & Access Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base select-none">🪙</span>
              <span className="font-sans text-base sm:text-lg font-extrabold text-[#2D2319]">
                Gratis / 1.250 XP
              </span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#FFE8C4]/70 border border-[#FFB148]/50 text-[#B96500]">
              Akses Selamanya
            </span>
          </div>

          {/* CTA Button Slot */}
          <div className="w-full">{children}</div>

          {/* Value Proposition List (2 Columns on Tablet) */}
          <ul className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#D8C4A7]/30 text-xs font-sans text-[#6E5D4B]">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5AC88A] shrink-0" />
              <span className="truncate">Materi teks &amp; latihan</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5AC88A] shrink-0" />
              <span className="truncate">Sertifikat kelulusan</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5AC88A] shrink-0" />
              <span className="truncate">Akses selamanya</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5AC88A] shrink-0" />
              <span className="truncate">Dukungan AI 24/7</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Video Modal Player */}
      {isVideoModalOpen && (
        <VideoPreviewModal onClose={() => setIsVideoModalOpen(false)} />
      )}
    </>
  )
}

/**
 * PremiumSidebar
 *
 * Dedicated Desktop sticky sidebar component (Visible on lg: 1024px+)
 */
export function PremiumSidebar({ children }: PremiumSidebarProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  return (
    <>
      {/* ── DESKTOP STICKY SIDEBAR (Hidden on Tablet, visible on lg: 1024px+) ── */}
      <div className="sticky top-20 w-full space-y-4">
        {/* ── CARD 1: VIDEO PREVIEW & ENROLLMENT HUB ── */}
        <div className="border border-[#D8C4A7]/60 rounded-3xl overflow-hidden bg-[#FFFDF9] shadow-[0_4px_16px_rgba(45,35,25,0.06)]">
          {/* Video Preview Thumbnail Cover */}
          <div className="relative w-full aspect-video overflow-hidden bg-[#2D2319] group">
            <Image
              src="/banner/banner-coruse-detail.webp"
              alt="Video Preview Thumbnail"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-80"
              sizes="380px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />

            {/* Top-Left Badge: Video Preview */}
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
              <Play className="w-3 h-3 fill-white text-white" />
              <span>Video Preview</span>
            </div>

            {/* Center Play Button with Glowing Pulse */}
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 active:scale-95 transition-all group-hover:bg-[#FF4D4D]"
              aria-label="Putar Video Preview"
            >
              <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
            </button>

            {/* Bottom-Right Duration Badge */}
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-sans font-medium bg-black/70 text-white tabular-nums">
              ⏱️ 3:42
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Pricing & Access Row */}
            <div className="flex items-center justify-between gap-2 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base select-none">🪙</span>
                <span className="font-sans text-base sm:text-lg font-extrabold text-[#2D2319]">
                  Gratis / 1.250 XP
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#FFE8C4]/70 border border-[#FFB148]/50 text-[#B96500]">
                Akses Selamanya
              </span>
            </div>

            {/* Primary CTA Button (CourseEnrollButton slot) */}
            <div className="w-full">{children}</div>

            {/* Value Proposition List (Round Green Badges) */}
            <ul className="space-y-2.5 pt-3 border-t border-[#D8C4A7]/30 text-xs sm:text-[13px] font-sans text-[#6E5D4B]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#5AC88A] shrink-0" />
                <span>Akses semua materi teks &amp; latihan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#5AC88A] shrink-0" />
                <span>Sertifikat kelulusan kompetensi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#5AC88A] shrink-0" />
                <span>Akses selamanya &amp; update materi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#5AC88A] shrink-0" />
                <span>Dukungan AI Mentor 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── CARD 2: SENSEI AI MENTOR CALLOUT WIDGET ── */}
        <SenseiMentorCard />
      </div>

      {/* Video Modal Player */}
      {isVideoModalOpen && (
        <VideoPreviewModal onClose={() => setIsVideoModalOpen(false)} />
      )}
    </>
  )
}

/**
 * Shared Video Preview Modal
 */
function VideoPreviewModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup Video"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Video Player */}
        <video
          src="/page/motion.mp4"
          controls
          autoPlay
          className="w-full aspect-video object-contain bg-black"
        >
          Browser Anda tidak mendukung tag video.
        </video>
      </div>
    </div>
  )
}
