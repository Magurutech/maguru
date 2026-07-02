'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useCourseCatalogFilters } from '@/features/cms/hooks'

/**
 * CourseFilters — client component
 *
 * Handles search (debounced 300ms) + category/difficulty dropdowns.
 * Updates URL search params so the server component re-fetches.
 *
 * Requirements: 1.2, 1.3, 1.4
 */

const CATEGORIES = [
  'Pemrograman',
  'Desain',
  'Bisnis',
  'Matematika',
  'Bahasa',
  'Sains',
  'Seni',
  'Lainnya',
]

const DIFFICULTIES = ['Pemula', 'Menengah', 'Mahir']

export function CourseFilters() {
  const { filters, hasFilters, setSearch, setCategory, setDifficulty, clearAll } =
    useCourseCatalogFilters()

  const activeCategory = filters.category

  return (
    <div className="space-y-4 w-full">
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <Input
            type="search"
            placeholder="Cari kursus..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-text-primary/8 dark:border-white/8 focus:border-accent-coral focus:ring-1 focus:ring-accent-coral bg-bg-bone/40 text-text-primary placeholder:text-text-muted"
            aria-label="Cari kursus"
          />
        </div>

        {/* Category Dropdown */}
        <Select
          value={filters.category || 'all'}
          onValueChange={(val) => setCategory(val === 'all' ? null : val)}
        >
          <SelectTrigger className="w-full sm:w-44 border-text-primary/8 dark:border-white/8 bg-bg-bone/40 text-text-primary focus:border-accent-coral focus:ring-1 focus:ring-accent-coral" aria-label="Filter kategori">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent className="bg-bg-surface border-text-primary/8 dark:border-white/8 text-text-primary">
            <SelectItem value="all">Semua Kategori</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty Dropdown */}
        <Select
          value={filters.difficulty || 'all'}
          onValueChange={(val) => setDifficulty(val === 'all' ? null : val)}
        >
          <SelectTrigger className="w-full sm:w-40 border-text-primary/8 dark:border-white/8 bg-bg-bone/40 text-text-primary focus:border-accent-coral focus:ring-1 focus:ring-accent-coral" aria-label="Filter tingkat kesulitan">
            <SelectValue placeholder="Semua Level" />
          </SelectTrigger>
          <SelectContent className="bg-bg-surface border-text-primary/8 dark:border-white/8 text-text-primary">
            <SelectItem value="all">Semua Level</SelectItem>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-text-muted hover:text-text-primary hover:bg-bg-surface-accent/30 shrink-0"
            aria-label="Hapus semua filter"
          >
            <X className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-text-primary/8 dark:border-white/8">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat === activeCategory ? null : cat)}
              className={`px-3 py-1.5 text-xs rounded-full border font-sans tracking-wide transition-all duration-180 cursor-pointer ${
                isActive
                  ? 'bg-accent-coral border-accent-coral text-white font-semibold shadow-sm'
                  : 'bg-bg-bone/20 hover:bg-bg-bone/60 border-text-primary/8 dark:border-white/8 text-text-secondary hover:text-text-primary hover-glow'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}
