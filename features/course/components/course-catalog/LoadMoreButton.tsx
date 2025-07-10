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
        className="glass-panel bg-white/30 border-white/40 hover:bg-white/50 backdrop-blur-md"
      >
        Load More Courses
      </Button>
    </div>
  )
}
