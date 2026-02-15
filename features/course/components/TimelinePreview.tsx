'use client'

import { useState } from 'react'
import { ChevronRight, Clock, CheckCircle, PlayCircle } from 'lucide-react'
import { Course, CourseProgress } from '../types/course.types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TimelinePreviewProps {
  course: Course
  progress?: CourseProgress
  className?: string
  onStartLearning?: () => void
}

export function TimelinePreview({
  course,
  progress,
  className = '',
  onStartLearning
}: TimelinePreviewProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const getSectionProgress = (sectionId: string) => {
    if (!progress) return 0

    const section = course.sections.find(s => s.id === sectionId)
    if (!section) return 0

    const completedItems = section.items.filter(item =>
      progress.completedItems.includes(item.id)
    ).length

    return (completedItems / section.items.length) * 100
  }

  const getOverallProgress = () => {
    if (!progress) return 0
    return progress.completionPercentage || 0
  }

  const isItemCompleted = (itemId: string) => {
    return progress?.completedItems.includes(itemId) || false
  }

  if (!course.sections || course.sections.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <ChevronRight className="w-16 h-16 text-beige-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-beige-900 mb-2">
          Kurikulum Belum Tersedia
        </h3>
        <p className="text-beige-600 max-w-md mx-auto">
          Materi kursus akan segera tersedia.
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-beige-50 to-white rounded-lg p-6 border border-beige-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-beige-900">
            Progress Pembelajaran
          </h3>
          <span className="text-2xl font-bold text-primary">
            {Math.round(getOverallProgress())}%
          </span>
        </div>
        <div className="w-full bg-beige-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getOverallProgress()}%` }}
          />
        </div>
      </div>

      {/* Sections Timeline */}
      <div className="space-y-4">
        {course.sections.map((section, sectionIndex) => {
          const sectionProgress = getSectionProgress(section.id)
          const isExpanded = expandedSections.includes(section.id)

          return (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-sm border border-beige-200 overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left hover:bg-beige-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">
                      {sectionIndex + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-beige-900">
                        {section.title}
                      </h4>
                      <p className="text-sm text-beige-600">
                        {section.items.length} materi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-beige-900">
                        {Math.round(sectionProgress)}%
                      </div>
                      <div className="text-xs text-beige-600">
                        {section.items.filter(item => isItemCompleted(item.id)).length}/{section.items.length}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-beige-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Section Progress Bar */}
                <div className="px-4 pb-2">
                  <div className="w-full bg-beige-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${sectionProgress}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Section Items */}
              {isExpanded && (
                <div className="border-t border-beige-200 p-4 space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isItemCompleted(item.id)
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-beige-50 border border-beige-200'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isItemCompleted(item.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-beige-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h5 className="font-medium text-beige-900">
                          {item.title}
                        </h5>
                        {item.description && (
                          <p className="text-sm text-beige-600 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 text-right">
                        {item.duration && (
                          <div className="flex items-center gap-1 text-xs text-beige-500">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Start Learning Button */}
      <div className="pt-4">
        <Link href={`/course/${course.slug}/learn`} className="block">
          <Button className="w-full btn-primary hover-glow text-lg py-3">
            {getOverallProgress() > 0 ? (
              <>
                <PlayCircle className="w-5 h-5 mr-2" />
                Lanjut Belajar
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 mr-2" />
                Mulai Belajar
              </>
            )}
          </Button>
        </Link>
      </div>
    </div>
  )
}