'use client'

/**
 * LibraryControls Component
 *
 * Implements the Unified 1-Row Desk Toolbar matching Gambar 2:
 * - Search input with oriental parchment background
 * - Compact pill dropdowns for Status & Urutan
 * - Tactile Category Pills with Vermilion Lacquer active state ("Semua")
 * - View mode switcher (Grid/List)
 */

import React from 'react'
import { Search, ChevronDown, Grid, List } from 'lucide-react'

interface LibraryControlsProps {
  search: string
  setSearch: (s: string) => void
  status: string
  setStatus: (s: string) => void
  category: string
  setCategory: (c: string) => void
  sortBy: string
  setSortBy: (s: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (v: 'grid' | 'list') => void
}

export function LibraryControls({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}: LibraryControlsProps) {
  const categories = ['Semua', 'Pemrograman', 'Desain', 'Bisnis']
  const statuses = [
    { value: 'ALL', label: 'Semua' },
    { value: 'PUBLISHED', label: 'Diterbitkan' },
    { value: 'DRAFT', label: 'Draf' },
    { value: 'ARCHIVED', label: 'Diarsipkan' },
  ]
  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'students', label: 'Siswa Terbanyak' },
    { value: 'rating', label: 'Rating Tertinggi' },
  ]

  return (
    <div className="bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-2xl p-2.5 sm:p-3 shadow-[0_2px_12px_rgba(45,35,25,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-3 select-none">
      {/* ── Left: Search Box ── */}
      <div className="relative flex-1 min-w-60">
        <Search className="w-4 h-4 text-[#8C7D6E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kursus berdasarkan judul, deskripsi, atau topik..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#D8C4A7]/50 bg-[#FAF5ED] text-[#2D2319] placeholder:text-[#8C7D6E]/70 focus:outline-none focus:border-[#FFB148] focus:bg-[#FFFDF9] focus:ring-2 focus:ring-[#FFB148]/20 transition-all font-sans font-medium"
        />
      </div>

      {/* ── Middle: Compact Status & Sort Dropdowns ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Dropdown */}
        <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D8C4A7]/50 bg-[#FAF5ED] text-xs font-sans">
          <span className="text-[11px] font-semibold text-[#8C7D6E]">Status:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="appearance-none bg-transparent pr-4 font-bold text-[#2D2319] focus:outline-none cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#8C7D6E] absolute right-2 pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D8C4A7]/50 bg-[#FAF5ED] text-xs font-sans">
          <span className="text-[11px] font-semibold text-[#8C7D6E]">Urutan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-transparent pr-4 font-bold text-[#2D2319] focus:outline-none cursor-pointer"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#8C7D6E] absolute right-2 pointer-events-none" />
        </div>

        {/* ── Right: Category Segmented Pills ── */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#FAF5ED] border border-[#D8C4A7]/40">
          {categories.map((cat) => {
            const isSelected = category === (cat === 'Semua' ? 'ALL' : cat)
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat === 'Semua' ? 'ALL' : cat)}
                className={`py-1.5 px-3 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-linear-to-r from-[#E53935] via-[#D32F2F] to-[#C62828] text-white font-bold shadow-[0_2px_8px_rgba(229,57,53,0.3)]'
                    : 'text-[#6E5D4B] hover:text-[#2D2319] hover:bg-white/60 font-medium'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Optional View Mode Toggle (Grid/List) */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-[#FAF5ED] border border-[#D8C4A7]/40 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#2D2319] text-[#FAF5ED]'
                : 'text-[#8C7D6E] hover:text-[#2D2319]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="List view"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#2D2319] text-[#FAF5ED]'
                : 'text-[#8C7D6E] hover:text-[#2D2319]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
