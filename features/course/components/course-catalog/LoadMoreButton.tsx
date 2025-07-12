import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useCourseManagement } from '../../hooks/useCourseManagement'

export function LoadMoreButton() {
  const { courses, isLoading } = useCourseManagement()

  const handleLoadMore = () => {
    // TODO: Implement load more functionality
    console.log('Load more courses')
  }

  if (isLoading || courses.length === 0) return null

  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={handleLoadMore}
        className="btn-primary px-8 py-3 rounded-lg text-lg font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          'Load More Courses'
        )}
      </Button>
    </div>
  )
}
