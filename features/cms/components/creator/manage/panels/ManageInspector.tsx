'use client'

/**
 * ManageInspector Component
 *
 * Panel inspektur kontekstual (Inspector Panel) di sisi kanan ruang kerja penulisan.
 * Menyediakan detail modul/pelajaran yang sedang aktif, informasi metadata kurikulum,
 * status penerbitan, serta rekomendasi perbaikan berbasis AI secara real-time.
 */

import React from 'react'
import { Sparkles, Eye, Clock, Award, Info } from 'lucide-react'
import { useManageContext } from '../../../../Context/creator/ManageContext'

interface ManageInspectorProps {
  isOpen: boolean
}

export function ManageInspector({ isOpen }: ManageInspectorProps) {
  const { activeView, lessonsMap, course, sections } = useManageContext()

  if (!isOpen) return null

  // 1. Fetch data based on active view
  let viewTitle = 'Informasi Kelas'
  let viewType = 'overview'
  let detailsContent = null

  if (activeView.type === 'lesson-editor' || activeView.type === 'lesson') {
    const lesson = lessonsMap[activeView.sectionId]?.find((l) => l.id === activeView.lessonId)
    viewTitle = lesson?.title || 'Detail Pelajaran'
    viewType = 'lesson'

    // AI Suggestions specifically generated for the active lesson context
    const isIntro =
      viewTitle.toLowerCase().includes('intro') || viewTitle.toLowerCase().includes('pengantar')
    const isState =
      viewTitle.toLowerCase().includes('state') || viewTitle.toLowerCase().includes('reducer')

    const suggestions = isIntro
      ? [
          'Jelaskan prasyarat materi sebelum memulai pelajaran ini.',
          'Pelajaran pengantar: jaga durasi video di bawah 8 menit untuk memaksimalkan retensi.',
          'Saran: Tambahkan bagan visualisasi data-flow react.',
        ]
      : isState
        ? [
            'Penjelasan useReducer tergolong kompleks. Coba gunakan contoh kode perbandingan useState vs useReducer.',
            'Tingkat kesulitan tinggi: AI mendeteksi 28% siswa mengalami hambatan di kuis materi ini.',
            'Tambahkan referensi dokumentasi resmi Next.js/React.',
          ]
        : [
            'Bahasa penjelasan terdeteksi ramah, pertimbangkan untuk menambahkan micro-exercise di bagian akhir.',
            'Tambahkan lampiran cheat sheet PDF rangkuman materi.',
            'Pastikan semua contoh kode menyertakan TypeScript types.',
          ]

    detailsContent = (
      <div className="space-y-6">
        {/* Properties */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Properti Pelajaran
          </h4>
          <div className="space-y-2 bg-bg-bone/40 p-3.5 rounded-2xl border border-border/5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Visibilitas
              </span>
              <span className="font-semibold text-text-primary">Siswa Terdaftar</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Estimasi Baca
              </span>
              <span className="font-semibold text-text-primary">8 Menit</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Kuis Tersemat
              </span>
              <span className="font-semibold text-text-primary">1 Kuis</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-accent-coral uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent-coral" /> Asisten Penulisan AI
          </h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-accent-coral/5 border border-accent-coral/10 p-3 rounded-xl text-xs text-text-secondary leading-relaxed transition-all hover:bg-accent-coral/8"
              >
                💡 {suggestion}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } else if (activeView.type === 'section') {
    const section = sections.find((s) => s.id === activeView.sectionId)
    viewTitle = section?.title || 'Detail Modul'
    viewType = 'module'

    detailsContent = (
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Properti Modul
          </h4>
          <div className="space-y-2 bg-bg-bone/40 p-3.5 rounded-2xl border border-border/5 text-xs">
            <p className="text-text-secondary leading-relaxed">
              {section?.description ||
                'Belum ada deskripsi untuk modul ini. AI menyarankan untuk menambahkan gambaran umum materi.'}
            </p>
            <div className="flex justify-between items-center pt-2 border-t border-border/5">
              <span className="text-text-muted">Total Pelajaran</span>
              <span className="font-semibold text-text-primary">
                {section?.lessonCount || 0} Pelajaran
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    // Course Overview info
    viewTitle = course?.title || 'Info Kelas'
    viewType = 'overview'

    detailsContent = (
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Metadata Kelas
          </h4>
          <div className="space-y-2.5 bg-bg-bone/40 p-4 rounded-2xl border border-border/5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Kategori</span>
              <span className="font-semibold text-text-primary">
                {course?.category || 'Materi'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Tingkat Kesulitan</span>
              <span className="font-semibold text-text-primary">
                {course?.difficulty || 'Intermediate'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Total Modul</span>
              <span className="font-semibold text-text-primary">{sections.length} Modul</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <aside
      className="w-80 h-full shrink-0 border-l border-border/10 bg-card p-6 overflow-y-auto flex flex-col justify-between paper-texture select-none animate-fade-in"
      aria-label="Panel Inspektur"
    >
      <div className="space-y-5">
        {/* Section Header */}
        <div className="flex justify-between items-start pb-3 border-b border-border/10">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">
              INSPEKTOR · {viewType}
            </span>
            <h3 className="font-manrope text-sm font-bold text-text-primary leading-tight">
              {viewTitle}
            </h3>
          </div>
        </div>

        {/* Content detail */}
        {detailsContent}
      </div>

      {/* Footer Info banner */}
      <div className="pt-4 border-t border-border/5 flex items-center gap-2 text-[10px] text-text-muted italic">
        <Info className="w-3.5 h-3.5 text-text-faint" />
        <span>Rekomendasi AI diperbarui secara otomatis.</span>
      </div>
    </aside>
  )
}
