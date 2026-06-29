'use client'

import { useState } from 'react'
import { ChevronDown, BookOpen } from 'lucide-react'
import type { OverviewSection } from './types'

interface PremiumCurriculumProps {
  sections: OverviewSection[]
}

export function PremiumCurriculum({ sections }: PremiumCurriculumProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [sections[0]?.id || '']: true, // keep first section open by default
  })

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (sections.length === 0) {
    return (
      <div
        data-testid="curriculum-empty"
        className="glass-panel border border-text-primary/8 dark:border-white/8 rounded-xl p-8 text-center"
      >
        <BookOpen className="w-8 h-8 text-text-faint mx-auto mb-2" />
        <p className="text-text-muted text-sm font-sans">Kurikulum belum tersedia untuk kelas ini.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4" data-testid="course-curriculum">
      <div className="border-b border-text-primary/8 dark:border-white/8 pb-3 flex justify-between items-end">
        <div>
          <h3 className="font-sans text-lg font-bold text-text-primary">
            Kurikulum Pembelajaran
          </h3>
          <p className="text-xs text-text-muted font-sans mt-0.5">
            Materi terstruktur berbasis proyek nyata
          </p>
        </div>
        <span className="font-mono text-[10.5px] text-text-faint uppercase tracking-wider">
          {sections.length} Seksi · {sections.reduce((sum, s) => sum + s.lessons.length, 0)} Pelajaran
        </span>
      </div>

      <div className="border border-text-primary/8 dark:border-white/8 rounded-xl overflow-hidden divide-y divide-text-primary/8 dark:divide-white/8 bg-bg-bone/40 dark:bg-bg-bone/10 backdrop-blur-sm">
        {sections.map((section, idx) => {
          const isOpen = !!openSections[section.id]
          return (
            <div key={section.id} className="group" data-testid={`section-item-${idx}`}>
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left hover:bg-bg-surface-accent/20 dark:hover:bg-bg-surface-accent/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-text-primary/6 dark:bg-white/6 text-text-primary text-[11px] font-mono flex items-center justify-center font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="font-sans text-sm font-bold text-text-primary transition-colors group-hover:text-accent-coral"
                    data-testid={`section-title-${idx}`}
                  >
                    {section.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted font-mono flex-shrink-0">
                  <span>{section.lessons.length} Pelajaran</span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-faint transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-accent-coral' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Accordion Content */}
              <div
                className={`transition-all duration-300 ease-out-expo overflow-hidden ${
                  isOpen ? 'max-h-[500px] border-t border-text-primary/6 dark:border-white/6' : 'max-h-0'
                }`}
              >
                <div className="bg-bg-canvas/50 dark:bg-bg-canvas/20 px-5 py-4">
                  {section.lessons.length === 0 ? (
                    <p className="text-xs text-text-faint italic font-sans">Belum ada materi pelajaran dalam seksi ini.</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {section.lessons.map((lesson, lIdx) => (
                        <li
                          key={lesson.id}
                          data-testid={`lesson-item-${idx}-${lIdx}`}
                          className="flex items-center gap-3 text-sm text-text-secondary hover:text-text-primary transition-colors py-0.5"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-text-faint flex-shrink-0" />
                          <span className="font-sans text-[13px]">{lesson.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
