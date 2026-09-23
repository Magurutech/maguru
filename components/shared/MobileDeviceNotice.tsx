'use client'

import { useEffect, useState } from 'react'
import {  Tablet, Sparkles, Laptop } from 'lucide-react'

/**
 * MobileDeviceNotice Component
 *
 * Appears exclusively on mobile viewports (< 768px).
 * Informs the user that Maguru is a specialized, text-based interactive coding & AI course
 * platform designed specifically for Tablet and Desktop experiences.
 */
export function MobileDeviceNotice() {
  const [windowWidth, setWindowWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      aria-label="Pemberitahuan Resolusi Layar Tidak Didukung"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-99999 md:hidden bg-[#FAF5ED] flex flex-col items-center justify-center p-6 text-center overflow-y-auto"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-15 bg-[#FFB148] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-15 bg-[#8C4FFF] pointer-events-none" />

      <div className="relative z-10 max-w-sm w-full bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(45,35,25,0.08)] flex flex-col items-center">
        {/* Ancient Academy Mascot Emblem */}
        <div className="relative w-20 h-20 rounded-3xl bg-[#FAF5ED] border-2 border-[#D8C4A7]/60 shadow-inner flex items-center justify-center mb-5">
          <span className="text-4xl select-none">📜</span>
          <span className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#FFE8C4] border border-[#FFB148] flex items-center justify-center text-xs">
            ✨
          </span>
        </div>

        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold font-sans bg-[#FFE8C4]/90 border border-[#FFB148]/50 text-[#B96500] mb-3">
          <Sparkles className="w-3 h-3 text-[#B96500]" />
          <span>Akademi Maguru</span>
        </div>

        {/* Title */}
        <h2 className="font-sans text-xl font-extrabold text-[#2D2319] leading-snug mb-2.5">
          Gulungan Koding Butuh Meja yang Lebih Luas!
        </h2>

        {/* Explanation */}
        <p className="font-sans text-xs text-[#6E5D4B] leading-relaxed mb-5">
          Platform pembelajaran <strong>Maguru</strong> memuat modul teks teknis mendalam, editor koding interaktif, dan bimbingan langsung AI Agent. Agar belajar tetap nyaman dan presisi, platform ini <strong>hanya dapat diakses melalui perangkat Tablet atau Desktop</strong>.
        </p>

        {/* Supported Devices Cards */}
        <div className="w-full bg-[#FAF5ED]/80 border border-[#D8C4A7]/50 rounded-2xl p-3.5 space-y-2.5 text-left mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFFDF9] border border-[#D8C4A7]/50 flex items-center justify-center text-[#FF4D4D] shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-sans text-xs font-bold text-[#2D2319]">Laptop &amp; Desktop PC</span>
              <span className="text-[10px] font-sans text-[#6E5D4B]">Resolusi terbaik: 1024px &ndash; 1440px+</span>
            </div>
          </div>

          <div className="h-px bg-[#D8C4A7]/40 w-full" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFFDF9] border border-[#D8C4A7]/50 flex items-center justify-center text-[#5AC88A] shrink-0">
              <Tablet className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-sans text-xs font-bold text-[#2D2319]">iPad &amp; Tablet Layar Lebar</span>
              <span className="text-[10px] font-sans text-[#6E5D4B]">Lebar layar minimal: &ge; 768px</span>
            </div>
          </div>
        </div>

        {/* Current Viewport Detection info */}
        {windowWidth !== null && (
          <div className="text-[10px] font-mono text-[#6E5D4B]/80 tabular-nums">
            Lebar layarmu saat ini: <span className="font-bold text-[#FF4D4D]">{windowWidth}px</span> (Dibutuhkan &ge; 768px)
          </div>
        )}
      </div>
    </div>
  )
}
