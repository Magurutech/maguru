'use client'

import { useState } from 'react'
import type { CourseDetail, OverviewSection, CreatorProfile, Review } from './types'

// Imported Sub-sections
import { UnifiedDescriptionSection, ReviewsSection } from './PremiumSections'
import { PremiumCurriculum } from './PremiumCurriculum'

interface PremiumCourseTabsProps {
  course: CourseDetail
  sections: OverviewSection[]
  creator: CreatorProfile | null
}

type TabType = 'description' | 'path' | 'testimonials'

const DUMMY_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Rian Hidayat',
    date: '12 Juni 2026',
    rating: 5,
    comment: 'Materi yang disajikan sangat sistematis dan terstruktur. Adanya AI Co-Teacher sangat membantu ketika saya stuck di latihan praktis malam hari!'
  },
  {
    id: 'rev-2',
    name: 'Siti Rahma',
    date: '28 Mei 2026',
    rating: 4.8,
    comment: 'Penjelasan instrukturnya sangat jelas dan mudah dipahami. Proyek akhir benar-benar melatih problem solving di dunia nyata.'
  },
  {
    id: 'rev-3',
    name: 'Budi Santoso',
    date: '15 Mei 2026',
    rating: 5,
    comment: 'Pengalaman belajar editorial yang sangat tenang dan menakjubkan. Jauh berbeda dari platform kursus e-learning biasa.'
  }
]

export function PremiumCourseTabs({ course, sections, creator }: PremiumCourseTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('description')

  const tabs = [
    { id: 'description', label: 'Deskripsi Kelas' },
    { id: 'path', label: 'Kurikulum (Learning Path)' },
    { id: 'testimonials', label: 'Ulasan Pelajar' },
  ] as const

  return (
    <div className="w-full space-y-8">
      {/* ── TABS NAVIGATION BAR ── */}
      <div className="border-b border-text-primary/10 dark:border-white/10 flex gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 text-sm sm:text-base font-sans font-bold tracking-tight border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent-coral focus-visible:outline-offset-2 ${
                isActive
                  ? 'border-accent-coral text-accent-coral'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── TABS PANEL CONTENT ── */}
      <div className="animate-fade-in duration-300">
        {activeTab === 'description' && (
          <UnifiedDescriptionSection
            description={course.description}
            outcomes={course.outcomes ?? []}
            instructor={creator}
          />
        )}

        {activeTab === 'path' && (
          <div className="space-y-6">
            <PremiumCurriculum sections={sections} />
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <ReviewsSection reviews={DUMMY_REVIEWS} />
          </div>
        )}
      </div>
    </div>
  )
}
