import React from 'react'

interface ResultsCountProps {
  count: number
  loading: boolean
}

export function ResultsCount({ count, loading }: ResultsCountProps) {
  if (loading) return null

  return (
    <div className="mb-6">
      <p className="text-gray-600">
        {count === 0
          ? 'No courses found matching your criteria'
          : `Showing ${count} course${count !== 1 ? 's' : ''}`}
      </p>
    </div>
  )
}
