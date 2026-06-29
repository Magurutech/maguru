'use client'

/**
 * CourseOverview Component
 *
 * Halaman utama ringkasan materi kursus (Course Overview) di dalam ruang kerja penulisan.
 * Menyediakan pengeditan deskripsi inline serta merangkum metadata kelas,
 * statistik kurikulum, dan saran asisten AI (AI Recommendations) yang sebelumnya
 * ada di panel Inspektur kanan.
 */

import { useState } from 'react'
import { Edit, Sparkles, Layers, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useManageContext } from '../../../../Context/creator/ManageContext'
import { DescriptionEditor } from './DescriptionEditor'

const DIFFICULTY_LABEL: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
}

export function CourseOverview() {
  const { course, setCourse, sections, lessonsMap } = useManageContext()
  const [editingDesc, setEditingDesc] = useState(false)

  if (!course) return null

  const isPublished = course.status === 'PUBLISHED'
  const totalLessons = sections.reduce(
    (sum, s) => sum + (lessonsMap[s.id]?.length ?? s.lessonCount),
    0,
  )

  // AI suggestions merged directly into overview page
  const aiRecommendations = [
    {
      id: 1,
      text: 'Kelengkapan draf kurikulum terdeteksi 60%. Siswa aktif dari materi React sebelumnya sedang menanti perilisan kelas ini.',
      impact: 'Tinggi',
    },
    {
      id: 2,
      text: 'Statistik kelulusan kuis di Bab 3.2 (Optimasi Server Actions) turun 12%. Pertimbangkan untuk menambahkan penjelasan visual atau micro-exercise.',
      impact: 'Tinggi',
    },
    {
      id: 3,
      text: 'Ada 3 pertanyaan diskusi siswa baru yang belum terlayani lebih dari 24 jam.',
      impact: 'Sedang',
    },
  ]

  return (
    <div className="space-y-8 select-none" data-testid="course-overview-panel">
      {/* 1. Title and basic badges */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-accent-coral uppercase tracking-widest block leading-none">
          IKHTISAR KURSUS
        </span>
        <h1 className="font-manrope text-3xl font-extrabold text-text-primary leading-tight tracking-tight">
          {course.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          {course.category && (
            <Badge
              variant="outline"
              className="bg-bg-bone/80 text-text-secondary border-border/10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            >
              {course.category}
            </Badge>
          )}
          {course.difficulty && (
            <Badge
              variant="outline"
              className="bg-bg-bone/80 text-text-secondary border-border/10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            >
              {DIFFICULTY_LABEL[course.difficulty] ?? course.difficulty}
            </Badge>
          )}
          <Badge
            variant="outline"
            className={
              isPublished
                ? 'bg-success/5 text-success border-success/15 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full'
                : 'bg-accent-mustard/10 text-accent-mustard border-accent-mustard/15 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full'
            }
          >
            {isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </div>

      <hr className="border-border/10" />

      {/* 2. Grid layout: Left (Description) & Right (Stats + AI Recommendations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Description Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Deskripsi Kelas
              </span>
              {!editingDesc && (
                <button
                  onClick={() => setEditingDesc(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-bg-surface-accent text-text-muted hover:text-text-primary cursor-pointer"
                  title="Edit deskripsi"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {editingDesc ? (
              <DescriptionEditor
                courseSlug={course.slug}
                initialText={course.description ?? ''}
                onSave={(text) => {
                  setCourse((prev) => (prev ? { ...prev, description: text } : prev))
                  setEditingDesc(false)
                }}
                onCancel={() => setEditingDesc(false)}
              />
            ) : (
              <p
                className="text-text-secondary text-sm leading-relaxed cursor-text hover:bg-bg-surface-accent/30 rounded-xl p-3 border border-transparent hover:border-border/10 transition-all font-sans"
                onClick={() => setEditingDesc(true)}
              >
                {course.description || (
                  <span className="text-text-faint italic font-medium">
                    Tambahkan deskripsi lengkap materi kelas...
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Bento Cards & AI Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-bg-bone/45 border border-border/10 rounded-2xl paper-texture flex flex-col justify-between min-h-22.5">
              <div className="flex justify-between items-center text-text-muted">
                <span className="text-[9px] font-bold uppercase tracking-wider">Modul</span>
                <Layers className="w-3.5 h-3.5" />
              </div>
              <p className="font-manrope text-xl font-black text-text-primary mt-1">
                {sections.length} Seksi
              </p>
            </div>

            <div className="p-4 bg-bg-bone/45 border border-border/10 rounded-2xl paper-texture flex flex-col justify-between min-h-22.5">
              <div className="flex justify-between items-center text-text-muted">
                <span className="text-[9px] font-bold uppercase tracking-wider">Pelajaran</span>
                <FileText className="w-3.5 h-3.5" />
              </div>
              <p className="font-manrope text-xl font-black text-text-primary mt-1">
                {totalLessons} Materi
              </p>
            </div>
          </div>

          {/* AI Advisor Panel (Moved from inspector) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-border/5">
              <Sparkles className="w-4 h-4 text-accent-coral" />
              <h3 className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                Masukan AI Kreator (Mago AI)
              </h3>
            </div>

            <div className="space-y-2">
              {aiRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-accent-coral/5 border border-accent-coral/10 p-3.5 rounded-2xl text-xs text-text-secondary leading-relaxed transition-all hover:bg-accent-coral/8"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold text-accent-coral tracking-wider font-mono">
                      REKOMENDASI
                    </span>
                    <span className="text-[8px] font-bold bg-accent-coral/10 text-accent-coral px-2 py-0.5 rounded-full uppercase">
                      Dampak {rec.impact}
                    </span>
                  </div>
                  <p>{rec.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
