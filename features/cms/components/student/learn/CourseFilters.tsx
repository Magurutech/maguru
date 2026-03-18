'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(false)

  const category = searchParams.get('category') ?? ''
  const difficulty = searchParams.get('difficulty') ?? ''

  // Use a ref so updateParams is always stable and never causes effect re-runs
  const searchParamsRef = useRef(searchParams)
  // Sync ref in a layout effect — avoids mutating ref during render
  useEffect(() => {
    searchParamsRef.current = searchParams
  })

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParamsRef.current.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      // Reset to page 1 on filter change
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname] // searchParams removed — read via ref instead
  )

  // Debounced search — skip on mount, only fire when user actually types
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParams({ search: searchValue || null })
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchValue]) // eslint-disable-line react-hooks/exhaustive-deps

  const hasFilters = !!(searchValue || category || difficulty)

  function clearAll() {
    setSearchValue('')
    router.push(pathname)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beige-400 pointer-events-none" />
        <Input
          type="search"
          placeholder="Cari kursus..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 border-beige-300 focus:border-merah-400 bg-white"
          aria-label="Cari kursus"
        />
      </div>

      {/* Category */}
      <Select
        value={category || 'all'}
        onValueChange={(val) => updateParams({ category: val === 'all' ? null : val })}
      >
        <SelectTrigger className="w-full sm:w-44 border-beige-300 bg-white" aria-label="Filter kategori">
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Difficulty */}
      <Select
        value={difficulty || 'all'}
        onValueChange={(val) => updateParams({ difficulty: val === 'all' ? null : val })}
      >
        <SelectTrigger className="w-full sm:w-40 border-beige-300 bg-white" aria-label="Filter tingkat kesulitan">
          <SelectValue placeholder="Semua Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Level</SelectItem>
          {DIFFICULTIES.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-beige-500 hover:text-beige-800 hover:bg-beige-100 shrink-0"
          aria-label="Hapus semua filter"
        >
          <X className="w-4 h-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  )
}
