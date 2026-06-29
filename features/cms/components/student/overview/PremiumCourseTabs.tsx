'use client'

import { useState } from 'react'
import type { CourseDetail, OverviewSection } from './types'
import type { CourseMockData } from './CourseDetailMock'

// Imported Sub-sections
import { UnifiedDescriptionSection, ReviewsSection } from './PremiumSections'
import { PremiumCurriculum } from './PremiumCurriculum'

interface PremiumCourseTabsProps {
  course: CourseDetail
  sections: OverviewSection[]
  mockData: CourseMockData
}

type TabType = 'description' | 'path' | 'testimonials'

export function PremiumCourseTabs({ course, sections, mockData }: PremiumCourseTabsProps) {
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
            outcomes={mockData.outcomes}
            instructor={mockData.instructor}
          />
        )}

        {activeTab === 'path' && (
          <div className="space-y-6">
            <PremiumCurriculum sections={sections} />
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <ReviewsSection reviews={mockData.reviews} />
          </div>
        )}
      </div>
    </div>
  )
}
