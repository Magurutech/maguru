'use client'

/**
 * LibraryEmptyState Component
 *
 * Tampilan kosong (Empty State) ketika pembuat belum memiliki kursus terdaftar.
 * Menampilkan pesan motivasi dan tombol CTA untuk membuat kursus pertama.
 */

import React from 'react'
import Link from 'next/link'
import { BookOpen, Plus } from 'lucide-react'

export function LibraryEmptyState() {
  return (
    <div className="bg-card border border-border/15 rounded-3xl p-16 text-center paper-texture max-w-2xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-full bg-accent-coral/5 border border-accent-coral/10 flex items-center justify-center mx-auto animate-float">
        <BookOpen className="w-8 h-8 text-accent-coral" />
      </div>
      
      <div className="space-y-2">
        <h2 className="font-manrope text-xl font-bold text-text-primary">
          Belum ada materi kursus terdaftar
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
          Mulai salurkan keahlian Anda ke siswa aktif MAGURU. Buat modul belajar interaktif pertama Anda sekarang.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/creator/courses/create">
          <button 
            type="button"
            className="btn-primary flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-bold shadow-glow hover:scale-102 transition-all mx-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Kursus Pertama Anda</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
