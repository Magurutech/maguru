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
import { Edit, Layers, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useManageContext } from '../../../../Context/creator/ManageContext'
import { DescriptionEditor } from './DescriptionEditor'
import { LearningOutcomesEditor } from './LearningOutcomesEditor'

const DIFFICULTY_LABEL: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
}

export function CourseOverview() {
  const { course, setCourse, sections, lessonsMap, setCourseDeleteDialogOpen } = useManageContext()
  const [editingDesc, setEditingDesc] = useState(false)



  if (!course) return null

  const isPublished = course.status === 'PUBLISHED'
  const totalLessons = sections.reduce(
    (sum, s) => sum + (lessonsMap[s.id]?.length ?? s.lessonCount),
    0,
  )

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

          <div className="ml-auto">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCourseDeleteDialogOpen(true)}
              className="bg-red-50/50 hover:bg-red-50 hover:text-red-700 text-red-600 border border-red-200/50 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full cursor-pointer transition-all"
            >
              Hapus Kelas
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Quick stats row below header */}
      <div className="grid grid-cols-2 gap-4 max-w-md">
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

      <hr className="border-border/10" />

      {/* 3. Main Content: Outcomes & Description Editors */}
      <div className="space-y-8 max-w-4xl">
        {/* Learning Outcomes Editor */}
        <div className="bg-bg-bone/20 p-4 border border-border/10 rounded-2xl paper-texture">
          <LearningOutcomesEditor
            courseSlug={course.slug}
            initialOutcomes={course.outcomes ?? []}
            onSave={(nextOutcomes) => {
              setCourse((prev) => (prev ? { ...prev, outcomes: nextOutcomes } : prev))
            }}
          />
        </div>

        {/* Description Editor */}
        <div className="group space-y-2">
          <div className="flex items-center gap-2 mb-1">
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
            <div
              className="text-text-secondary text-sm leading-relaxed cursor-text hover:bg-bg-surface-accent/30 rounded-xl p-3 border border-transparent hover:border-border/10 transition-all font-sans"
              onClick={() => setEditingDesc(true)}
            >
              {course.description ? (
                /* ponytail: render html deskripsi secara native tanpa membebani runtime tiptap */
                <div
                  dangerouslySetInnerHTML={{ __html: course.description }}
                  className="tiptap ProseMirror simple-editor"
                />
              ) : (
                <span className="text-text-faint italic font-medium">
                  Tambahkan deskripsi lengkap materi kelas...
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
