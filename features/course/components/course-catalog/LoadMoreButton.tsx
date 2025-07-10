import { Button } from '@/components/ui/button'
import React from 'react'

interface LoadMoreButtonProps {
  hasMoreCourses: boolean
  onLoadMore: () => void
}

export function LoadMoreButton({ hasMoreCourses, onLoadMore }: LoadMoreButtonProps) {
  if (!hasMoreCourses) return null

  return (
    <div className="text-center mt-12">
      <Button
        variant="outline"
        size="lg"
        onClick={onLoadMore}
        className="btn-primary px-6 py-2 rounded-lg text-lg font-semibold"
      >
        Load More Courses
      </Button>
    </div>
  )
}
