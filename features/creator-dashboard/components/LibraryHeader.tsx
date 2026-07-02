'use client'

/**
 * LibraryHeader Component
 *
 * Header untuk halaman Pustaka Kursus Kreator (Creator Course Library)
 * yang menampilkan judul, sub-judul ringkas, dan tombol CTA buat kelas baru.
 */

import React from 'react'
import Link from 'next/link'
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
  draftCount
}: LibraryHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-border/10">
      {/* Back to Dashboard */}
      <div>
        <button
          onClick={() => router.push('/creator')}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Studio</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="font-manrope text-3xl font-extrabold text-text-primary tracking-tight md:text-4xl">
            Pustaka Kursus
          </h1>
          <p className="text-text-secondary text-sm">
            {courseCount} materi terdaftar &middot; {publishedCount} diterbitkan &middot; {draftCount} draf aktif
          </p>
        </div>

        {/* Create Course Button */}
        <Link href="/creator/courses/create">
          <button 
            type="button"
            className="btn-primary flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold shadow-glow hover:scale-102 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Kursus Baru</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
