'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * CoursePagination — client component
 *
 * Prev/Next + page number buttons that update URL params.
 *
 * Requirements: 1.8
 */

interface CoursePaginationProps {
  page: number
  totalPages: number
}

export function CoursePagination({ page, totalPages }: CoursePaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`${pathname}?${params.toString()}`)
  }

  // Show at most 5 page numbers around current page
  const pages: number[] = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-8"
      aria-label="Navigasi halaman"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className="border-beige-300 text-beige-700 hover:bg-beige-50 disabled:opacity-40"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {start > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(1)}
            className="border-beige-300 text-beige-700 hover:bg-beige-50 w-9"
          >
            1
          </Button>
          {start > 2 && <span className="text-beige-400 px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => goToPage(p)}
          className={
            p === page
              ? 'bg-merah-500 hover:bg-merah-600 text-white w-9'
              : 'border-beige-300 text-beige-700 hover:bg-beige-50 w-9'
          }
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-beige-400 px-1">…</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(totalPages)}
            className="border-beige-300 text-beige-700 hover:bg-beige-50 w-9"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="border-beige-300 text-beige-700 hover:bg-beige-50 disabled:opacity-40"
        aria-label="Halaman berikutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  )
}
