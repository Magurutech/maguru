/**
 * useCourseSearch Hook - High-Level Hook
 *
 * @description
 * High-level hook untuk search dan filter logic course management.
 * Hook ini menyediakan:
 * - Search functionality dengan debouncing
 * - Filter berdasarkan status dan kategori
 * - Search history management
 * - Optimized filtering untuk large datasets
 * - Integration dengan courseUtils untuk filtering
 *
 * Mengikuti arsitektur Maguru untuk high-level hooks dengan:
 * - Business logic untuk search dan filter
 * - Performance optimization dengan debouncing
 * - State management untuk search history
 * - Integration dengan utility functions
 * - Local state management (tidak menggunakan context)
 */

'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { filterCourses } from '../lib/courseUtils'
import type { Course } from '../../types'

// Search history item
interface SearchHistoryItem {
  query: string
  timestamp: number
  resultCount: number
}

// Hook return type
interface UseCourseSearchReturn {
  // Search state
  searchQuery: string
  selectedStatus: string
  selectedCategory: string

  // Search history
  searchHistory: SearchHistoryItem[]
  hasActiveFilters: boolean

  // Filtered results
  filteredCourses: Course[]
  filteredCount: number

  // Search actions
  setSearchQuery: (query: string) => void
  setSelectedStatus: (status: string) => void
  setSelectedCategory: (category: string) => void
  clearFilters: () => void

  // Search history actions
  addToSearchHistory: (query: string, resultCount: number) => void
  clearSearchHistory: () => void
  removeFromSearchHistory: (query: string) => void

  // Utility functions
  getUniqueCategories: () => string[]
  getUniqueStatuses: () => string[]
  getSearchSuggestions: (partialQuery: string) => string[]
}

// Debounce delay untuk search
const SEARCH_DEBOUNCE_DELAY = 300

// Maximum search history items
const MAX_SEARCH_HISTORY = 10

export function useCourseSearch(courses: Course[]): UseCourseSearchReturn {
  // Local search state
  const [searchQuery, setSearchQueryState] = useState('')
  const [selectedStatus, setSelectedStatusState] = useState('all')
  const [selectedCategory, setSelectedCategoryState] = useState('all')

  // Search history state
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  // Debounce effect untuk search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, SEARCH_DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filtered courses menggunakan courseUtils
  const filteredCourses = useMemo(() => {
    return filterCourses(courses, debouncedSearchQuery, selectedStatus).filter((course) => {
      // Additional category filter
      if (selectedCategory !== 'all') {
        return course.category === selectedCategory
      }
      return true
    })
  }, [courses, debouncedSearchQuery, selectedStatus, selectedCategory])

  // Filtered count
  const filteredCount = useMemo(() => filteredCourses.length, [filteredCourses])

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' || selectedStatus !== 'all' || selectedCategory !== 'all'
  }, [searchQuery, selectedStatus, selectedCategory])

  // Get unique categories from courses
  const getUniqueCategories = useCallback(() => {
    const categories = new Set(courses.map((course) => course.category))
    return Array.from(categories).sort()
  }, [courses])

  // Get unique statuses from courses
  const getUniqueStatuses = useCallback(() => {
    const statuses = new Set(courses.map((course) => course.status))
    return Array.from(statuses).sort()
  }, [courses])

  // Get search suggestions based on history and course titles
  const getSearchSuggestions = useCallback(
    (partialQuery: string): string[] => {
      if (!partialQuery.trim()) return []

      const suggestions = new Set<string>()

      // Add suggestions from search history
      searchHistory
        .filter((item) => item.query.toLowerCase().includes(partialQuery.toLowerCase()))
        .forEach((item) => suggestions.add(item.query))

      // Add suggestions from course titles
      courses
        .filter((course) => course.title.toLowerCase().includes(partialQuery.toLowerCase()))
        .forEach((course) => suggestions.add(course.title))

      // Add suggestions from course descriptions
      courses
        .filter((course) => course.description.toLowerCase().includes(partialQuery.toLowerCase()))
        .forEach((course) => suggestions.add(course.description.substring(0, 50) + '...'))

      return Array.from(suggestions).slice(0, 5) // Limit to 5 suggestions
    },
    [searchHistory, courses],
  )

  // Set search query
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query)
  }, [])

  // Set selected status
  const setSelectedStatus = useCallback((status: string) => {
    setSelectedStatusState(status)
  }, [])

  // Set selected category
  const setSelectedCategory = useCallback((category: string) => {
    setSelectedCategoryState(category)
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedStatus('all')
    setSelectedCategory('all')
  }, [setSearchQuery, setSelectedStatus, setSelectedCategory])

  // Add query to search history
  const addToSearchHistory = useCallback((query: string, resultCount: number) => {
    if (!query.trim()) return

    setSearchHistory((prev) => {
      // Remove existing entry if exists
      const filtered = prev.filter((item) => item.query !== query)

      // Add new entry at the beginning
      const newEntry: SearchHistoryItem = {
        query,
        timestamp: Date.now(),
        resultCount,
      }

      // Keep only the latest MAX_SEARCH_HISTORY items
      return [newEntry, ...filtered].slice(0, MAX_SEARCH_HISTORY)
    })
  }, [])

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([])
  }, [])

  // Remove specific query from search history
  const removeFromSearchHistory = useCallback((query: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.query !== query))
  }, [])

  // Auto-add to search history when search is performed
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery === searchQuery) {
      addToSearchHistory(debouncedSearchQuery, filteredCount)
    }
  }, [debouncedSearchQuery, searchQuery, filteredCount, addToSearchHistory])

  return {
    // Search state
    searchQuery,
    selectedStatus,
    selectedCategory,

    // Search history
    searchHistory,
    hasActiveFilters,

    // Filtered results
    filteredCourses,
    filteredCount,

    // Search actions
    setSearchQuery,
    setSelectedStatus,
    setSelectedCategory,
    clearFilters,

    // Search history actions
    addToSearchHistory,
    clearSearchHistory,
    removeFromSearchHistory,

    // Utility functions
    getUniqueCategories,
    getUniqueStatuses,
    getSearchSuggestions,
  }
}
