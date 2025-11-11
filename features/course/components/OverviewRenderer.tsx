'use client'

import { ContentRenderer } from './ContentRenderer'
import { Course } from '../types/course.types'

interface OverviewRendererProps {
  course: Course
  className?: string
}

export function OverviewRenderer({ course, className = '' }: OverviewRendererProps) {
  if (!course.overviewContent) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <BookOpen className="w-16 h-16 text-beige-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-beige-900 mb-2">
          Ringkasan Kursus
        </h3>
        <p className="text-beige-600 max-w-md mx-auto">
          Ringkasan kursus akan segera tersedia.
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Course Overview Header */}
      <div className="bg-gradient-to-r from-beige-50 to-white rounded-lg p-6 border border-beige-200">
        <h2 className="text-2xl font-bold text-beige-900 mb-3">
          Tentang Kursus Ini
        </h2>
        <div className="flex items-center gap-4 text-sm text-beige-600">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course.sections.reduce((total, section) => total + section.items.length, 0)} materi
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.estimatedDuration}
          </span>
          <span className="bg-beige-100 text-beige-700 px-2 py-1 rounded text-xs">
            {course.metadata.level}
          </span>
        </div>
      </div>

      {/* Overview Content */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="prose prose-lg prose-gray max-w-none">
          <ContentRenderer
            content={course.overviewContent}
            contentType="markdown"
            className="overview-content"
          />
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {course.sections.length}
          </div>
          <div className="text-beige-600 text-sm">
            Sections
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {course.totalItems}
          </div>
          <div className="text-beige-600 text-sm">
            Total Materi
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {course.estimatedDuration}
          </div>
          <div className="text-beige-600 text-sm">
            Durasi Estimasi
          </div>
        </div>
      </div>

      {/* Tags */}
      {course.metadata.tags && course.metadata.tags.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-beige-900 mb-3">Topik</h3>
          <div className="flex flex-wrap gap-2">
            {course.metadata.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-beige-100 text-beige-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Import required icons
import { BookOpen, Clock } from 'lucide-react'