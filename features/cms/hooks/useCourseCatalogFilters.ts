'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export interface CatalogFilters {
  search: string
  category: string
  difficulty: string
}

export interface UseCourseCatalogFiltersReturn {
  filters: CatalogFilters
  hasFilters: boolean
  setSearch: (value: string) => void
  setCategory: (value: string | null) => void
  setDifficulty: (value: string | null) => void
  clearAll: () => void
}

export function useCourseCatalogFilters(): UseCourseCatalogFiltersReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearchState] = useState(searchParams.get('search') ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(false)
  const searchParamsRef = useRef(searchParams)

  useEffect(() => {
    searchParamsRef.current = searchParams
  })

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParamsRef.current.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname]
  )

  // Debounced search — skip on mount
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParams({ search: search || null })
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  function setSearch(value: string) {
    setSearchState(value)
  }

  function setCategory(value: string | null) {
    updateParams({ category: value })
  }

  function setDifficulty(value: string | null) {
    updateParams({ difficulty: value })
  }

  function clearAll() {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSearchState('')
    router.push(pathname)
  }

  const category = searchParams.get('category') ?? ''
  const difficulty = searchParams.get('difficulty') ?? ''
  const hasFilters = !!(search || category || difficulty)

  return {
    filters: { search, category, difficulty },
    hasFilters,
    setSearch,
    setCategory,
    setDifficulty,
    clearAll,
  }
}
