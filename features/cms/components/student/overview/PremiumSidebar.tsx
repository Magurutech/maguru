'use client'

import { ShieldCheck, Sparkles, BookOpen, Clock, FileText, Code, Layers, BarChart3 } from 'lucide-react'
import type { CourseDetail, CreatorProfile } from './types'

interface PremiumSidebarProps {
  course: CourseDetail
  enrolled: boolean
  children: React.ReactNode // Slot for CourseEnrollButton
  creator?: CreatorProfile | null
}

export function PremiumSidebar({ course, enrolled, children, creator }: PremiumSidebarProps) {
  const normCategory = (course.category || '').toLowerCase()

  // 3D Tilt handlers for sidebar card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    card.style.transform = `perspective(1000px) rotateX(${-(y / (r.height / 2)) * 4}deg) rotateY(${(x / (r.width / 2)) * 4}deg) translateY(-2px)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'
  }

  // Get Thumbnail Gradient & Icon based on Category
  const getCategoryTheme = () => {
    if (normCategory.includes('pemrograman') || normCategory.includes('ai') || normCategory.includes('tech') || normCategory.includes('sains')) {
      return {
        gradient: 'from-[#e8e0c8] to-[#d4c8a8] dark:from-[#37353e] dark:to-[#2d2a33]',
        icon: <Code className="w-14 h-14 text-text-primary/18 dark:text-white/10" />,
        accent: 'bg-accent-olive',
      }
    }
    if (normCategory.includes('desain') || normCategory.includes('design') || normCategory.includes('seni') || normCategory.includes('art')) {
      return {
        gradient: 'from-[#f0e8d0] to-[#e8d8b8] dark:from-[#3d3a44] dark:to-[#232127]',
        icon: <Layers className="w-14 h-14 text-text-primary/18 dark:text-white/10" />,
        accent: 'bg-accent-coral',
      }
    }
    if (normCategory.includes('bisnis') || normCategory.includes('business') || normCategory.includes('marketing')) {
      return {
        gradient: 'from-[#ece4cc] to-[#e0d8b8] dark:from-[#2d2a33] dark:to-[#19181d]',
        icon: <BarChart3 className="w-14 h-14 text-text-primary/18 dark:text-white/10" />,
        accent: 'bg-accent-mustard',
      }
    }
    return {
      gradient: 'from-[#ece4cc] to-[#e0d8b8] dark:from-[#2d2a33] dark:to-[#19181d]',
      icon: <BookOpen className="w-14 h-14 text-text-primary/18 dark:text-white/10" />,
      accent: 'bg-text-faint/30',
    }
  }

  const theme = getCategoryTheme()

  return (
    <>
      {/* ── DESKTOP STICKY SIDEBAR ── */}
      <div className="hidden lg:block sticky top-28 w-full max-w-[360px] ml-auto space-y-6">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="glass-panel border border-text-primary/8 dark:border-white/8 rounded-2xl overflow-hidden bg-bg-surface-accent/20 dark:bg-bg-surface-accent/10 backdrop-blur-md shadow-sm transition-all duration-300"
          style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease-out' }}
        >
          {/* Visual Cover / Thumbnail Placeholder */}
          <div className={`w-full aspect-[16/9] bg-gradient-to-br ${theme.gradient} flex items-center justify-center relative overflow-hidden`}>
            {/* Bottom Accent Bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${theme.accent}`} />
            
            {theme.icon}
            <span className="absolute bottom-4 left-4 text-[9px] font-mono font-bold tracking-wider uppercase bg-bg-canvas/80 text-text-primary px-2 py-0.5 rounded-full dark:bg-black/60 dark:text-white">
              {course.category}
            </span>
          </div>

          <div className="p-6 space-y-5">
            {/* Enrollment Status Info */}
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold tracking-wider text-text-faint uppercase">
                Akses Pembelajaran
              </span>
              <h4 className="font-sans text-2xl font-extrabold text-text-primary tracking-tight">
                {enrolled ? 'Sudah Terdaftar' : 'Gratis / Beasiswa'}
              </h4>
            </div>

            {/* Enroll / Go to learn Button slot */}
            <div className="w-full relative z-10 flex flex-col pt-1">
              {children}
            </div>

            {/* Premium benefits list */}
            <ul className="space-y-3 pt-4 border-t border-text-primary/8 dark:border-white/8 text-xs text-text-secondary font-sans">
              <li className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-accent-coral flex-shrink-0" />
                <span>AI Co-Teacher Terintegrasi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-text-faint flex-shrink-0" />
                <span>Proyek Portofolio Riil</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-accent-olive flex-shrink-0" />
                <span>Sertifikat Kelulusan Kompetensi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-text-faint flex-shrink-0" />
                <span>Akses Selamanya & Update Materi</span>
              </li>
            </ul>

            {/* Instructor Widget in Sidebar */}
            {creator && creator.name && (
              <div className="pt-4 border-t border-text-primary/8 dark:border-white/8 space-y-3 font-sans">
                <span className="text-[9px] font-sans font-bold tracking-wider text-text-faint uppercase block">
                  Instruktur Kelas
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e8e0c8] to-[#d4c8a8] dark:from-[#37353e] dark:to-[#2d2a33] border border-text-primary/8 dark:border-white/8 flex items-center justify-center font-sans text-sm font-bold text-text-primary overflow-hidden select-none">
                    {creator.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
                    ) : (
                      creator.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-text-primary leading-tight truncate">{creator.name}</h5>
                    <span className="text-[10px] text-accent-coral font-medium block mt-0.5 truncate">{creator.title || 'Pendidik'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FIXED BOTTOM CTA BAR ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-canvas/95 dark:bg-bg-canvas/98 border-t border-text-primary/8 dark:border-white/8 p-4 backdrop-blur-md">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[9px] font-sans font-bold tracking-wider text-text-faint uppercase block">
              STATUS AKSES
            </span>
            <span className="font-sans text-base font-bold text-text-primary tracking-tight block">
              {enrolled ? 'Telah Terdaftar' : 'Akses Penuh'}
            </span>
          </div>

          <div className="flex-shrink-0 relative z-10">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
