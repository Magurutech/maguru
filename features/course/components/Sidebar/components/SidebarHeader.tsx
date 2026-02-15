'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen } from 'lucide-react'

import { CourseSection } from '../../../types/course.types'

interface SidebarHeaderProps {
  sections: CourseSection[]
  completedItems: string[]
}

/**
 * Sidebar Header component - displays course overview and overall progress
 */
export function SidebarHeader({ sections, completedItems }: SidebarHeaderProps) {
  const totalItems = sections.reduce((total, section) => total + section.items.length, 0)
  const overallProgress = Math.round((completedItems.length / totalItems) * 100)

  return (
    <div className="bg-beige-50 border-b border-beige-200">
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-beige-900">Konten Kursus</h3>
          <Badge variant="secondary" className="bg-beige-100 text-beige-700">
            {totalItems} materi
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-beige-600">Progress Keseluruhan</span>
            <span className="font-medium text-beige-900">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />

          <div className="flex items-center gap-2 text-xs text-beige-600">
            <BookOpen className="w-3 h-3" />
            <span>{sections.length} section</span>
            <span>•</span>
            <span>{completedItems.length} selesai</span>
          </div>
        </div>
      </div>
    </div>
  )
}