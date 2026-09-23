import Link from 'next/link'
import { Compass, Sparkles, Home } from 'lucide-react'

export const metadata = {
  title: '404 - Gulungan Tidak Ditemukan | Maguru',
  description: 'Halaman atau materi yang Anda cari tidak ditemukan di Akademi Maguru.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF5ED] text-[#2D2319] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-15 bg-[#FFB148] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-15 bg-[#8C4FFF] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgba(45,35,25,0.06)] flex flex-col items-center">
        {/* Ancient 404 Emblem */}
        <div className="relative w-24 h-24 rounded-3xl bg-[#FAF5ED] border-2 border-[#D8C4A7]/60 shadow-inner flex items-center justify-center mb-6">
          <span className="text-5xl select-none">🗺️</span>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#FF4D4D] text-white font-mono font-bold text-xs shadow-xs">
            404
          </span>
        </div>

        {/* Pill Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-sans bg-[#FFE8C4]/90 border border-[#FFB148]/50 text-[#B96500] mb-3.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B96500]" />
          <span>Jejak Hilang di Akademi</span>
        </div>

        {/* Title */}
        <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#2D2319] leading-tight mb-2.5">
          Gulungan Tidak Ditemukan
        </h1>

        {/* Description */}
        <p className="font-sans text-xs sm:text-sm text-[#6E5D4B] leading-relaxed mb-6">
          Sepertinya gulungan ilmu atau halaman yang Anda tuju telah dipindahkan atau belum tersedia di perpustakaan Akademi Maguru.
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            href="/course"
            className="flex-1 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] active:scale-[0.98] text-white font-sans text-xs sm:text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_6px_rgba(255,77,77,0.3)] transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Katalog Kursus</span>
          </Link>

          <Link
            href="/"
            className="flex-1 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF5ED] hover:bg-[#F5EDE0] border border-[#D8C4A7] text-[#2D2319] font-sans text-xs sm:text-sm font-semibold transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
