'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCourseCatalogFilters } from '@/features/cms/hooks'

/**
 * CourseFilters — client component
 *
 * Implements Whimsical Ancient Fantasy Asia Filter Bar:
 * - Search input with parchment surface and responsive styling
 * - Interactive Difficulty Pills (🌱 Pemula, ⚔️ Menengah, 🧙 Mahir)
 * - Category Chips with active dark-pill state (● Semua, Pemrograman Web, AI & Python, etc.)
 *
 * Requirements: 1.2, 1.3, 1.4, SOP Design System V2
 */

const CATEGORIES = [
  'Pemrograman Web',
  'AI & Python',
  'Algoritma',
  'UI/UX',
  'Mobile Development',
  'Pemrograman',
  'Desain',
  'Bisnis',
  'Sains',
]

const DIFFICULTIES = [
  { label: 'Pemula', emoji: '🌱', activeClass: 'bg-[#C8E6D0]/40 border-[#5AC88A] text-[#136637] font-semibold' },
  { label: 'Menengah', emoji: '⚔️', activeClass: 'bg-[#FFE8C4]/50 border-[#FFB148] text-[#B96500] font-semibold' },
  { label: 'Mahir', emoji: '🧙', activeClass: 'bg-[#F3EBFF] border-[#8C4FFF] text-[#6B21A8] font-semibold' },
]

export function CourseFilters() {
  const { filters, hasFilters, setSearch, setCategory, setDifficulty, clearAll } =
    useCourseCatalogFilters()

  const activeCategory = filters.category
  const activeDifficulty = filters.difficulty

  return (
    <div className="space-y-2.5 w-full">
      {/* ── Row 1: Search Input + Difficulty Filter Pills ── */}
      <div className="flex flex-col lg:flex-row gap-3 w-full items-stretch lg:items-center justify-between">
        {/* Search Input Box (Clean Solid Parchment) */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E5D4B]/70 pointer-events-none z-10" />
          <input
            type="search"
            placeholder="Cari modul, sintaks, atau topik (contoh: Python, AI Agent, React)..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-[#D8C4A7]/60 focus:border-[#FF4D4D] focus:ring-2 focus:ring-[#FF4D4D]/20 focus:outline-none bg-[#FFFDF9] text-[#2D2319] placeholder:text-[#6E5D4B]/60 rounded-xl font-sans text-xs sm:text-sm shadow-xs transition-all"
            aria-label="Cari kursus"
          />
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1 bg-[#F5EDE0]/60 border border-[#D8C4A7]/40 rounded-xl">
          <span className="text-xs font-sans font-medium text-[#6E5D4B] px-2 select-none shrink-0 hidden sm:inline">
            Tingkat Kesulitan:
          </span>
          {DIFFICULTIES.map((diff) => {
            const isDiffActive = activeDifficulty?.toLowerCase() === diff.label.toLowerCase()
            return (
              <button
                key={diff.label}
                type="button"
                onClick={() => setDifficulty(isDiffActive ? null : diff.label)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border font-sans tracking-wide transition-all duration-150 cursor-pointer ${
                  isDiffActive
                    ? diff.activeClass
                    : 'bg-[#FFFDF9] border-[#D8C4A7]/40 text-[#6E5D4B] hover:text-[#2D2319] hover:bg-[#FAF5ED]'
                }`}
                aria-pressed={isDiffActive}
              >
                <span>{diff.emoji}</span>
                <span>{diff.label}</span>
              </button>
            )
          })}

          {/* Reset Filters Button */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-8 px-2.5 text-xs text-[#FF4D4D] hover:text-[#FF3333] hover:bg-[#FF4D4D]/10 rounded-lg ml-auto shrink-0 transition-colors"
              aria-label="Hapus semua filter"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* ── Row 2: Category Filter Chips ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        {/* "Semua" Filter Chip */}
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-full border font-sans tracking-wide shrink-0 transition-all duration-150 cursor-pointer ${
            !activeCategory
              ? 'bg-[#2D2319] border-[#2D2319] text-white font-semibold shadow-xs'
              : 'bg-[#FFFDF9] border-[#D8C4A7]/50 text-[#6E5D4B] hover:text-[#2D2319] hover:bg-[#F5EDE0]/60'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB148]" />
          <span>Semua</span>
        </button>

        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(isActive ? null : cat)}
              className={`inline-flex items-center px-3.5 py-1.5 text-xs rounded-full border font-sans tracking-wide shrink-0 transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#2D2319] border-[#2D2319] text-white font-semibold shadow-xs'
                  : 'bg-[#FFFDF9] border-[#D8C4A7]/50 text-[#6E5D4B] hover:text-[#2D2319] hover:bg-[#F5EDE0]/60'
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
