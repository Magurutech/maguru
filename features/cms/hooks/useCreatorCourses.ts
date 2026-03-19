'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCreatorCourses } from '../api/course.api'

export const CREATOR_COURSES_KEY = ['creator', 'courses'] as const

export function useCreatorCourses() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: CREATOR_COURSES_KEY,
    queryFn: getCreatorCourses,
    staleTime: 30_000,
  })

  function refresh() {
    queryClient.invalidateQueries({ queryKey: CREATOR_COURSES_KEY })
  }

  return {
    courses: query.data?.courses ?? [],
    stats: query.data?.stats ?? { totalCourses: 0, publishedCourses: 0, draftCourses: 0 },
    isLoading: query.isLoading,
    isError: query.isError,
    refresh,
  }
}
