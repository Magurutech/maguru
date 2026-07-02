'use client'

/**
 * LibraryControls Component
 *
 * Panel kontrol pencarian, filter kategori, status, pengurutan,
 * dan tombol pengalih tampilan (Grid vs List).
 */

import { Search, Grid, List } from 'lucide-react'

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
    { value: 'ALL', label: 'Semua Status' },
    { value: 'PUBLISHED', label: 'Diterbitkan' },
    { value: 'DRAFT', label: 'Draf' },
    { value: 'REVIEW', label: 'Ditinjau' },
    { value: 'ARCHIVED', label: 'Diarsipkan' },
  ]
  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'students', label: 'Siswa Terbanyak' },
    { value: 'rating', label: 'Rating Tertinggi' },
  ]

  return (
    <div className="flex flex-col gap-4 p-5 bg-card border border-border/10 rounded-2xl paper-texture select-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kursus berdasarkan judul..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-border/15 bg-bg-bone/80 focus:outline-none focus:border-accent-coral focus:ring-2 focus:ring-accent-coral/10 transition-all font-sans font-medium"
          />
        </div>

        {/* Dropdowns & Switcher wrapper */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-bg-bone/60 border border-border/15 rounded-full px-3 py-1.5">
            <span className="text-[10px] font-bold text-text-muted uppercase">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-none font-semibold text-text-secondary cursor-pointer"
            >
              {statuses.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1.5 bg-bg-bone/60 border border-border/15 rounded-full px-3 py-1.5">
            <span className="text-[10px] font-bold text-text-muted uppercase">Urutan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-none font-semibold text-text-secondary cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-bg-bone/80 border border-border/15 rounded-full p-1 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                viewMode === 'grid'
                  ? 'bg-accent-coral text-white shadow-glow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                viewMode === 'list'
                  ? 'bg-accent-coral text-white shadow-glow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Chips row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/5">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mr-2">
          Kategori:
        </span>
        {categories.map((cat) => {
          const isActive = category === (cat === 'Semua' ? 'ALL' : cat)
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'Semua' ? 'ALL' : cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isActive
                  ? 'bg-accent-coral text-white border-transparent shadow-glow'
                  : 'bg-card text-text-secondary border-border/15 hover:bg-bg-surface-accent hover:text-text-primary'
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
