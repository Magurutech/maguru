'use client'

import { useState, useCallback, useMemo } from 'react'
import { CourseSection, CourseItem } from '../../../types/course.types'

/**
 * Custom hook for managing course sidebar state and calculations
 */
export function useCourseSidebar({
  sections,
  currentSectionId,
  currentItemId,
  completedItems
}: {
  sections: CourseSection[]
  currentSectionId?: string
  currentItemId?: string
  completedItems: string[]
}) {
  // State for collapsible sections
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.map(s => s.id))
  )

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const totalItems = sections.reduce((total, section) => total + section.items.length, 0)
    if (totalItems === 0) return 0
    return Math.round((completedItems.length / totalItems) * 100)
  }, [sections, completedItems])

  // Calculate section progress
  const getSectionProgress = useCallback((sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return 0

    const completedInSection = section.items.filter((item: CourseItem) => completedItems.includes(item.id)).length
    return Math.round((completedInSection / section.items.length) * 100)
  }, [sections, completedItems])

  // Get item status
  const getItemStatus = useCallback((sectionId: string, itemId: string) => {
    if (completedItems.includes(itemId)) return 'completed'
    if (currentSectionId === sectionId && currentItemId === itemId) return 'current'
    return 'locked'
  }, [currentSectionId, currentItemId, completedItems])

  // Toggle section collapse state
  const toggleSection = useCallback((sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }, [])

  // Check if section is current
  const isCurrentSection = useCallback((sectionId: string) => {
    return currentSectionId === sectionId
  }, [currentSectionId])

  // Check if item is current
  const isCurrentItem = useCallback((sectionId: string, itemId: string) => {
    return currentSectionId === sectionId && currentItemId === itemId
  }, [currentSectionId, currentItemId])

  // Get next item
  const getNextItem = useCallback(() => {
    const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId)
    if (currentSectionIndex === -1) return null

    const currentSection = sections[currentSectionIndex]
    const currentItemIndex = currentSection.items.findIndex((i: CourseItem) => i.id === currentItemId)
    if (currentItemIndex === -1) return null

    // Try next item in current section
    if (currentItemIndex < currentSection.items.length - 1) {
      const nextItem = currentSection.items[currentItemIndex + 1]
      return {
        sectionId: currentSection.id,
        itemId: nextItem.id,
        item: nextItem
      }
    }

    // Try first item in next section
    if (currentSectionIndex < sections.length - 1) {
      const nextSection = sections[currentSectionIndex + 1]
      if (nextSection.items.length > 0) {
        const nextItem = nextSection.items[0]
        return {
          sectionId: nextSection.id,
          itemId: nextItem.id,
          item: nextItem
        }
      }
    }

    return null
  }, [sections, currentSectionId, currentItemId])

  // Get previous item
  const getPreviousItem = useCallback(() => {
    const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId)
    if (currentSectionIndex === -1) return null

    const currentSection = sections[currentSectionIndex]
    const currentItemIndex = currentSection.items.findIndex((i: CourseItem) => i.id === currentItemId)
    if (currentItemIndex === -1) return null

    // Try previous item in current section
    if (currentItemIndex > 0) {
      const prevItem = currentSection.items[currentItemIndex - 1]
      return {
        sectionId: currentSection.id,
        itemId: prevItem.id,
        item: prevItem
      }
    }

    // Try last item in previous section
    if (currentSectionIndex > 0) {
      const prevSection = sections[currentSectionIndex - 1]
      if (prevSection.items.length > 0) {
        const prevItem = prevSection.items[prevSection.items.length - 1]
        return {
          sectionId: prevSection.id,
          itemId: prevItem.id,
          item: prevItem
        }
      }
    }

    return null
  }, [sections, currentSectionId, currentItemId])

  // Get navigation info
  const getNavigationInfo = useCallback(() => {
    if (!sections || !currentSectionId || !currentItemId) {
      return {
        currentIndex: 0,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false,
        progressPercentage: 0
      }
    }

    let currentIndex = 0
    let totalItems = 0

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      for (let j = 0; j < section.items.length; j++) {
        if (section.id === currentSectionId && section.items[j].id === currentItemId) {
          currentIndex = totalItems
        }
        totalItems++
      }
    }

    const hasNext = currentIndex < totalItems - 1
    const hasPrevious = currentIndex > 0
    const progressPercentage = totalItems > 0 ? Math.round((currentIndex / totalItems) * 100) : 0

    return {
      currentIndex,
      totalItems,
      hasNext,
      hasPrevious,
      progressPercentage
    }
  }, [sections, currentSectionId, currentItemId])

  return {
    // State
    openSections,
    overallProgress,

    // Actions
    toggleSection,
    getNextItem,
    getPreviousItem,

    // Calculations
    getSectionProgress,
    getItemStatus,
    isCurrentSection,
    isCurrentItem,
    getNavigationInfo,

    // Computed
    isCompleted: overallProgress === 100,
    completedCount: completedItems.length,
    totalCount: sections.reduce((total, section) => total + section.items.length, 0)
  }
}