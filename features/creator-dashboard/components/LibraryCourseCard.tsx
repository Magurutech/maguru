'use client'

/**
 * LibraryCourseCard Component
 *
 * Kartu editorial khusus untuk daftar kursus pembuat/mentor
 * yang menampilkan metadata detail, statistik keterlibatan siswa,
 * saran peningkatan AI (AI Insight), dan aksi pengelolaan.
 */

import React from 'react'
import Link from 'next/link'
import {  BookOpen, Users, Star,  Sparkles, Settings, BarChart2 } from 'lucide-react'
import { TiltCard } from '@/features/user-dashboard'
import { Badge } from '@/components/ui/badge'

export interface CourseData {
  id: string
  title: string
  description?: string
  slug: string
  status: 'PUBLISHED' | 'DRAFT' | 'REVIEW' | 'ARCHIVED'
  category?: string
  enrollmentCount?: number
  difficulty?: string
  rating?: number
  completionRate?: number
  updatedAt?: string | Date
  aiInsight?: string // Masukan AI kustom
}

interface LibraryCourseCardProps {
  course: CourseData
  onManage?: (slug: string) => void
  onAnalytics?: (slug: string) => void
}

export function LibraryCourseCard({
  course,
  onManage,
  onAnalytics
}: LibraryCourseCardProps) {
  // Format Date
  const getFormattedDate = (d?: string | Date) => {
    if (!d) return ''
    const date = new Date(d)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Thumbnails background and accent
  let thumbGradient = 'from-[#ece4cc] to-[#e0d8b8]'
  let accentBarColor = 'bg-text-faint/30'
  
  if (course.category === 'Pemrograman') {
    thumbGradient = 'from-[#e8e0c8] to-[#d4c8a8]'
    accentBarColor = 'bg-accent-olive'
  } else if (course.category === 'Desain') {
    thumbGradient = 'from-[#f0e8d0] to-[#e8d8b8]'
    accentBarColor = 'bg-accent-coral'
  } else if (course.category === 'Bisnis') {
    thumbGradient = 'from-[#ece4cc] to-[#e0d8b8]'
    accentBarColor = 'bg-accent-mustard'
  }

  return (
    <TiltCard 
      className="bg-card border border-border/15 rounded-2xl overflow-hidden flex flex-col justify-between min-h-95 paper-texture group"
    >
      <div className="space-y-4">
        {/* Cover Thumbnail */}
        <div className={`relative h-28 w-full bg-linear-to-br ${thumbGradient} flex items-center justify-between px-5 select-none pointer-events-none`}>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${accentBarColor}`} />
          <span className="font-sans text-[10px] font-bold tracking-[0.12em] uppercase text-text-muted">
            {course.category || 'Materi'}
          </span>
          <BookOpen className="absolute -right-2 -bottom-2 w-20 h-20 text-text-primary/5 select-none pointer-events-none transform -rotate-12" />
        </div>

        {/* Card Body */}
        <div className="px-5 space-y-3">
          <div className="flex justify-between items-center">
            <Badge 
              variant="outline" 
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                course.status === 'PUBLISHED' 
                  ? 'bg-success/5 text-success border-success/10'
                  : course.status === 'DRAFT'
                    ? 'bg-accent-mustard/15 text-accent-mustard border-accent-mustard/10'
                    : 'bg-text-faint/10 text-text-muted border-border/10'
              }`}
            >
              {course.status}
            </Badge>
            <span className="text-[10px] font-mono text-text-muted">
              {getFormattedDate(course.updatedAt)}
            </span>
          </div>

          <h3 className="font-sans text-base font-bold text-text-primary leading-snug line-clamp-2">
            {course.title}
          </h3>

          {course.description && (
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
              {course.description}
            </p>
          )}

          {/* Quick Statistics Row */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/5 text-center bg-bg-bone/20 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Siswa</span>
              <span className="text-xs font-bold text-text-primary flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 text-text-muted" />
                <span>{course.enrollmentCount || 0}</span>
              </span>
            </div>
            <div className="space-y-0.5 border-x border-border/5">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Rating</span>
              <span className="text-xs font-bold text-text-primary flex items-center justify-center gap-0.5">
                <Star className="w-3.5 h-3.5 text-accent-mustard fill-current" />
                <span>{course.rating || 4.8}</span>
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Kelulusan</span>
              <span className="text-xs font-bold text-text-primary">
                {course.completionRate || 85}%
              </span>
            </div>
          </div>

          {/* Optional AI Insight Bar */}
          {course.aiInsight && (
            <div className="bg-accent-coral/5 border border-accent-coral/10 p-2.5 rounded-xl flex items-start gap-2 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-accent-coral shrink-0 mt-0.5 animate-pulse" />
              <p className="text-[10px] text-text-secondary leading-normal">
                {course.aiInsight}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-border/5 mt-4 flex items-center gap-2">
        <Link 
          href={`/creator/courses/${course.slug}/manage`}
          className="flex-1"
          onClick={(e) => {
            if (onManage) {
              e.preventDefault()
              onManage(course.slug)
            }
          }}
        >
          <button 
            type="button"
            className="w-full btn-primary text-xs py-2 px-3 flex items-center justify-center gap-1.5 rounded-full select-none cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Kelola Kelas</span>
          </button>
        </Link>

        <button 
          type="button"
          onClick={() => onAnalytics?.(course.slug)}
          className="w-10 h-10 border border-border/10 rounded-full flex items-center justify-center hover:bg-bg-surface-accent text-text-secondary cursor-pointer transition-colors"
          aria-label="Analitik Kelas"
          title="Analitik"
        >
          <BarChart2 className="w-4 h-4" />
        </button>
      </div>
    </TiltCard>
  )
}
