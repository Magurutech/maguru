'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { SidebarFooter as ShadcnSidebarFooter } from '@/components/ui/sidebar'
import { CourseSection } from '../../../types/course.types'

interface SidebarFooterProps {
  sections: CourseSection[]
  completedItems: string[]
}

/**
 * Sidebar Footer component - displays progress summary and keyboard shortcuts
 */
export function SidebarFooter({ sections, completedItems }: SidebarFooterProps) {
  const totalItems = sections.reduce((total, section) => total + section.items.length, 0)
  const isCompleted = completedItems.length === totalItems

  return (
    <ShadcnSidebarFooter className="bg-beige-50 border-t border-beige-200 p-3">
      <div className="space-y-2">
        <div className="text-xs text-beige-600 text-center">
          Gunakan <kbd className="px-1 py-0.5 bg-beige-200 rounded text-xs">Ctrl+B</kbd> untuk toggle sidebar
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-beige-600">
            {completedItems.length} / {totalItems} selesai
          </span>
          <Badge
            variant="outline"
            className={
              isCompleted
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }
          >
            {isCompleted ? 'Selesai' : 'Progress'}
          </Badge>
        </div>
      </div>
    </ShadcnSidebarFooter>
  )
}