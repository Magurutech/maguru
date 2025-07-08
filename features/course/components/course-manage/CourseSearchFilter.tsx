'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCourseContext } from '../../contexts/courseContext'
import { useCourseManagement } from '../../hooks/useCourseManagement'
import { logger } from '@/services/logger'

export function CourseSearchFilter() {
  // Component state untuk UI interactions
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Feature state dari hooks dan context
  const {
    searchQuery,
    selectedStatus,
    setSearchQuery,
    setSelectedStatus,
    clearFilters,
    hasActiveFilters,
    openCreateDialog,
  } = useCourseContext()

  // Get searchCourses untuk search submit dengan logger
  const { searchCourses, clearFilters: clearFiltersFromHook } = useCourseManagement()

  // Custom search submit handler yang mengintegrasikan context dengan API
  const handleSearchSubmit = async () => {
    logger.info('CourseSearchFilter', 'handleSearchSubmit', 'Search submit triggered', {
      searchQuery,
      selectedStatus,
    })

    try {
      await searchCourses({
        searchQuery,
        selectedStatus,
      })
      logger.info('CourseSearchFilter', 'handleSearchSubmit', 'Search completed successfully')
    } catch (error) {
      logger.error('CourseSearchFilter', 'handleSearchSubmit', 'Search failed', error as Error)
    }
  }

  // Auto-search effect dengan debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery || selectedStatus !== 'all') {
        logger.debug('CourseSearchFilter', 'useEffect', 'Auto-search triggered', {
          searchQuery,
          selectedStatus,
        })
        handleSearchSubmit()
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedStatus])

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  const handleSearchBlur = () => {
    setIsSearchFocused(false)
  }

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleCreateCourse = () => {
    logger.info('CourseSearchFilter', 'handleCreateCourse', 'Create course dialog opened')
    openCreateDialog()
  }

  const handleClearFilters = async () => {
    logger.info('CourseSearchFilter', 'handleClearFilters', 'Clearing all filters')

    try {
      // Clear context state
      clearFilters()

      // 🔥 PERBAIKAN: Gunakan clearFilters dari hook untuk memastikan API call
      await clearFiltersFromHook()

      logger.info('CourseSearchFilter', 'handleClearFilters', 'Filters cleared and data refreshed')
    } catch (error) {
      logger.error(
        'CourseSearchFilter',
        'handleClearFilters',
        'Failed to clear filters',
        error as Error,
      )
    }
  }

  const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      logger.info('CourseSearchFilter', 'handleSearchKeyDown', 'Search submitted via Enter key', {
        searchQuery,
        selectedStatus,
      })
      await handleSearchSubmit()
    }
  }

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'all':
        return 'Semua Status'
      case 'PUBLISHED':
        return 'Diterbitkan'
      case 'DRAFT':
        return 'Draft'
      case 'ARCHIVED':
        return 'Diarsipkan'
      default:
        return 'Semua Status'
    }
  }

  return (
    <Card className="mb-8 glass-panel border-secondary-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full md:w-auto">
            <div
              className={`relative flex-1 border-2 rounded-lg transition-all duration-300 ${
                isSearchFocused ? 'border-secondary-400 shadow-lg' : 'border-beige-300'
              }`}
            >
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${
                  isSearchFocused ? 'text-secondary-600' : 'text-beige-700'
                }`}
              />
              <Input
                placeholder="Cari kursus..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value
                  logger.debug('CourseSearchFilter', 'searchInput', 'Search query changed', {
                    value,
                    previousValue: searchQuery,
                  })
                  setSearchQuery(value)
                }}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyDown={handleSearchKeyDown}
                className="pl-10 neu-input border-transparent focus:border-transparent focus:ring-0 bg-transparent"
              />
            </div>
            <DropdownMenu onOpenChange={setIsFilterOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`neu-button transition-all duration-300 ${
                    isFilterOpen
                      ? 'border-secondary-400 bg-secondary-50'
                      : 'border-beige-300 hover:border-secondary-400'
                  } hover-glow`}
                  onClick={handleFilterToggle}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {getStatusDisplayText(selectedStatus)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    logger.info(
                      'CourseSearchFilter',
                      'filterStatus',
                      'Status filter changed to all',
                    )
                    setSelectedStatus('all')
                  }}
                >
                  Semua Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logger.info(
                      'CourseSearchFilter',
                      'filterStatus',
                      'Status filter changed to PUBLISHED',
                    )
                    setSelectedStatus('PUBLISHED')
                  }}
                >
                  Diterbitkan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logger.info(
                      'CourseSearchFilter',
                      'filterStatus',
                      'Status filter changed to DRAFT',
                    )
                    setSelectedStatus('DRAFT')
                  }}
                >
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logger.info(
                      'CourseSearchFilter',
                      'filterStatus',
                      'Status filter changed to ARCHIVED',
                    )
                    setSelectedStatus('ARCHIVED')
                  }}
                >
                  Diarsipkan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="btn-secondary hover-glow transition-all duration-300"
              >
                <X className="h-4 w-4 mr-1" />
                Bersihkan
              </Button>
            )}
          </div>
          <Button
            onClick={handleCreateCourse}
            className="btn-primary magical-glow transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat Kursus Baru
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
