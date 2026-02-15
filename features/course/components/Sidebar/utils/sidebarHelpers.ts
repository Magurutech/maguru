/**
 * Utility functions for course sidebar calculations and helpers
 */

import { CourseSection } from '../../../types/course.types'

/**
 * Calculate progress percentage for an array of items
 */
export function calculateProgress(completedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0
  return Math.round((completedCount / totalCount) * 100)
}

/**
 * Get appropriate icon for item status
 */
export function getItemIcon(status: 'completed' | 'current' | 'locked') {
  switch (status) {
    case 'completed':
      return 'CheckCircle'
    case 'current':
      return 'PlayCircle'
    default:
      return 'Circle'
  }
}

/**
 * Get color classes for item status
 */
export function getItemStatusColors(status: 'completed' | 'current' | 'locked'): {
  iconColor: string
  bgColor: string
  textColor: string
} {
  switch (status) {
    case 'completed':
      return {
        iconColor: 'text-green-600',
        bgColor: 'hover:bg-green-50',
        textColor: 'text-green-900'
      }
    case 'current':
      return {
        iconColor: 'text-blue-600 animate-pulse',
        bgColor: 'bg-blue-100 border-l-4 border-l-blue-500',
        textColor: 'text-blue-900'
      }
    default:
      return {
        iconColor: 'text-gray-400',
        bgColor: 'hover:bg-beige-50',
        textColor: 'text-beige-900'
      }
  }
}

/**
 * Get badge color classes based on progress
 */
export function getProgressBadgeColors(progress: number): string {
  if (progress === 100) {
    return 'bg-green-100 text-green-800'
  }
  return 'bg-blue-100 text-blue-800'
}

/**
 * Format duration display
 */
export function formatDuration(duration?: string): string {
  if (!duration) return ''
  return duration
}

/**
 * Generate accessible keyboard shortcut hint
 */
export function getKeyboardShortcutHint(): string {
  return 'Gunakan Ctrl+B untuk toggle sidebar'
}

/**
 * Check if all sections are completed
 */
export function isCourseCompleted(sections: CourseSection[], completedItems: string[]): boolean {
  const totalItems = sections.reduce((total, section) => total + section.items.length, 0)
  return completedItems.length === totalItems && totalItems > 0
}

/**
 * Get aria-label for accessibility
 */
export function getAccessibilityLabel(
  type: 'section' | 'item' | 'progress',
  data?: {
    title?: string
    progress?: number
    status?: string
  }
): string {
  switch (type) {
    case 'section':
      return `Section: ${data?.title || 'Unknown'}`
    case 'item':
      return `Course item: ${data?.title || 'Unknown'}, status: ${data?.status || 'locked'}`
    case 'progress':
      return `Progress: ${data?.progress || 0}% complete`
    default:
      return 'Course navigation'
  }
}