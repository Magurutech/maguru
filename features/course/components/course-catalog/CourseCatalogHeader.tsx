import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, ChevronDown } from 'lucide-react'
import React from 'react'

interface CourseCatalogHeaderProps {
  searchQuery: string
  sortBy: string
  sortOptions: { value: string; label: string }[]
  onSearchChange: (query: string) => void
  onSortChange: (sort: string) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function CourseCatalogHeader({
  searchQuery,
  sortBy,
  sortOptions,
  onSearchChange,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: CourseCatalogHeaderProps) {
  return (
    <div className="glass-panel p-6 shadow-lg rounded-2xl mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search courses, instructors, or topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/50 border-white/50 focus:bg-white/70 transition-all duration-200"
            aria-label="Search courses"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full lg:w-48 bg-white/50 border-white/50 focus:bg-white/70">
              <ChevronDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="bg-white/50 border-white/50 hover:bg-white/70"
              aria-label="Clear all filters"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
 