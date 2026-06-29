'use client'

/**
 * CreatorHeader Component
 *
 * Header area studio pembuat (Creator Studio) yang menampilkan sapaan,
 * deskripsi status studio, input pencarian, dan tombol notifikasi.
 */

import React from 'react'
import { Search, Bell } from 'lucide-react'

interface CreatorHeaderProps {
  userName: string
}

export function CreatorHeader({ userName }: CreatorHeaderProps) {
  // Format Indonesian date
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return new Date().toLocaleDateString('id-ID', options)
  }

  return (
    <section aria-label="Selamat Datang Mentor" className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/10">
      <div className="space-y-1 max-w-xl">
        <span className="text-[10px] font-bold text-accent-coral tracking-widest uppercase">
          STUDIO KREATOR · {getFormattedDate()}
        </span>
        <h1 className="font-manrope text-3xl font-extrabold text-text-primary tracking-tight md:text-4xl">
          Halo, {userName}!
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Selamat datang kembali di pusat kendali pembelajaran. Mari buat materi edukasi terbaik hari ini.
        </p>
      </div>

      {/* Header Search & Actions */}
      <div className="flex items-center gap-3 self-start md:self-center">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kursus / siswa / tugas..."
            className="pl-10 pr-4 py-2 w-48 md:w-60 text-xs rounded-full border border-border/15 bg-bg-bone/80 focus:outline-none focus:border-accent-coral focus:ring-2 focus:ring-accent-coral/10 transition-all font-sans font-medium"
          />
        </div>

        {/* Notifications Button */}
        <button 
          aria-label="Notifikasi" 
          className="w-9 h-9 border border-border/15 rounded-full flex items-center justify-center bg-card hover:bg-bg-surface-accent text-text-secondary transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-accent-coral border-2 border-card pulse"></span>
        </button>
      </div>
    </section>
  )
}
