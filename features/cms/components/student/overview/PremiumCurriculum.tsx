'use client'

import { useState } from 'react'
import { ChevronDown, BookOpen, CheckCircle2, Clock, FileText } from 'lucide-react'
import type { OverviewSection } from './types'

interface PremiumCurriculumProps {
  sections: OverviewSection[]
}

export function PremiumCurriculum({ sections }: PremiumCurriculumProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [sections[0]?.id || 'sec-0']: true, // keep first section open by default
  })

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0)
  const totalBab = sections.length > 0 ? sections.length : 3

  if (sections.length === 0) {
    return (
      <div
        data-testid="curriculum-empty"
        className="border border-[#D8C4A7]/50 rounded-2xl p-8 text-center bg-[#FFFDF9]/80 shadow-xs"
      >
        <BookOpen className="w-8 h-8 text-[#6E5D4B]/60 mx-auto mb-2" />
        <p className="text-[#6E5D4B] text-sm font-sans">Kurikulum belum tersedia untuk kelas ini.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3.5" data-testid="course-curriculum">
      {/* ── Curriculum Header with Metrik & Progress Bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 pb-1">
        <div>
          <h3 className="font-sans text-lg sm:text-xl font-bold text-[#2D2319]">
            Kurikulum Pembelajaran
          </h3>
          <p className="text-xs sm:text-sm text-[#6E5D4B] font-sans mt-0.5">
            Materi terstruktur berdasarkan proyek nyata, dari dasar hingga mahir.
          </p>
        </div>

        {/* Right Stats & Progress Bar */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-sans text-[#6E5D4B] tabular-nums">
            {totalBab} Bab · {totalLessons} Pelajaran · 6 Jam
          </span>

          {/* Progress Capsule */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 rounded-full bg-[#E5DACE] overflow-hidden">
              <div className="h-full rounded-full bg-[#5AC88A] w-[12%]" />
            </div>
            <span className="text-xs font-sans font-bold text-[#136637] tabular-nums">
              12%
            </span>
          </div>
        </div>
      </div>

      {/* ── Curriculum Accordion Sections ── */}
      <div className="space-y-2.5">
        {sections.map((section, idx) => {
          const isOpen = !!openSections[section.id]
          const isFirstSection = idx === 0
          const lessonCount = section.lessons.length
          const completedCount = isFirstSection ? lessonCount : 0

          return (
            <div
              key={section.id}
              data-testid={`section-item-${idx}`}
              className="border border-[#D8C4A7]/60 rounded-2xl overflow-hidden bg-[#FFFDF9] shadow-[0_2px_8px_rgba(45,35,25,0.03)] transition-all"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between p-3.5 sm:p-4 text-left cursor-pointer transition-colors ${
                  isFirstSection && isOpen
                    ? 'bg-[#F9F5EC]/70 hover:bg-[#F9F5EC]'
                    : 'bg-[#FFFDF9] hover:bg-[#FAF5ED]/60'
                }`}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  {/* Badge Bab */}
                  {isFirstSection ? (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-sans font-semibold bg-[#C8E6D0]/50 border border-[#5AC88A] text-[#136637] shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5AC88A]" />
                      <span>Bab {idx + 1}</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-[#D8C4A7]/80 bg-[#FAF5ED] text-[#2D2319] text-xs font-sans font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                  )}

                  {/* Section Title */}
                  <span
                    className="font-sans text-xs sm:text-sm font-bold text-[#2D2319]"
                    data-testid={`section-title-${idx}`}
                  >
                    {!isFirstSection && `Bab ${idx + 1} `}
                    {section.title}
                  </span>
                </div>

                {/* Right Lessons Count & Chevron */}
                <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-[#6E5D4B] shrink-0">
                  <span className="tabular-nums font-sans">
                    {completedCount} / {lessonCount} Pelajaran
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6E5D4B] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#2D2319]' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Accordion Content (Lesson Items) */}
              {isOpen && (
                <div className="border-t border-[#D8C4A7]/30 bg-[#FFFDF9] p-2 sm:p-3">
                  {section.lessons.length === 0 ? (
                    <p className="text-xs text-[#6E5D4B]/70 italic font-sans p-3">
                      Belum ada materi pelajaran dalam seksi ini.
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {section.lessons.map((lesson, lIdx) => {
                        // Dynamic estimated minutes based on index or title length
                        const estMinutes = 15 + (lIdx * 5) % 25
                        const isCompleted = isFirstSection

                        return (
                          <li
                            key={lesson.id}
                            data-testid={`lesson-item-${idx}-${lIdx}`}
                            className="flex items-center justify-between p-2.5 sm:px-3.5 rounded-xl hover:bg-[#FAF5ED]/70 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              {/* Lesson Icon */}
                              <FileText className="w-3.5 h-3.5 text-[#6E5D4B]/70 shrink-0 group-hover:text-[#2D2319] transition-colors" />
                              <span className="font-mono text-xs text-[#6E5D4B] shrink-0">
                                {idx + 1}.{lIdx + 1}
                              </span>
                              <span className="font-sans text-xs sm:text-sm text-[#2D2319] truncate">
                                {lesson.title}
                              </span>
                            </div>

                            {/* Right Status: Duration & Checkmark */}
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="inline-flex items-center gap-1 text-[11px] font-sans text-[#6E5D4B] tabular-nums">
                                <Clock className="w-3 h-3 text-[#6E5D4B]/70" />
                                {estMinutes} menit
                              </span>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-[#5AC88A] shrink-0" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-[#D8C4A7]/60 shrink-0" />
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
