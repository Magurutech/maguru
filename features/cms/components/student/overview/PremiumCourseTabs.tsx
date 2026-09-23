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

type TabType = 'path' | 'description' | 'testimonials'

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
  // Default to 'path' (Kurikulum) so curriculum is displayed prominently as in the designer reference
  const [activeTab, setActiveTab] = useState<TabType>('path')

  const tabs = [
    { id: 'path', label: 'Kurikulum (Learning Path)' },
    { id: 'description', label: 'Deskripsi Lengkap' },
    { id: 'testimonials', label: 'Ulasan Pelajar' },
  ] as const

  return (
    <div className="w-full space-y-4">
      {/* ── TABS NAVIGATION BAR (Whimsical Pill / Tab Switcher) ── */}
      <div className="flex items-center gap-2 border-b border-[#D8C4A7]/40 pb-2.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#2D2319] text-white shadow-xs'
                  : 'bg-[#FFFDF9] border border-[#D8C4A7]/50 text-[#6E5D4B] hover:text-[#2D2319] hover:bg-[#FAF5ED]'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── TABS PANEL CONTENT ── */}
      <div className="pt-1">
        {activeTab === 'path' && (
          <div className="space-y-4">
            <PremiumCurriculum sections={sections} />
          </div>
        )}

        {activeTab === 'description' && (
          <div className="bg-[#FFFDF9] border border-[#D8C4A7]/50 rounded-2xl p-5 sm:p-6 shadow-xs">
            <UnifiedDescriptionSection
              description={course.description}
              outcomes={course.outcomes ?? []}
              instructor={creator}
            />
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="bg-[#FFFDF9] border border-[#D8C4A7]/50 rounded-2xl p-5 sm:p-6 shadow-xs">
            <ReviewsSection reviews={DUMMY_REVIEWS} />
          </div>
        )}
      </div>
    </div>
  )
}
