/**
 * useCourse Hook - Low-Level Hook
 *
 * @description
 * Low-level hook yang berinteraksi langsung dengan courseAdapter untuk operasi CRUD dasar.
 * Hook ini menyediakan interface yang clean untuk:
 * - Fetching courses (list dan detail)
 * - Creating courses
 * - Updating courses
 * - Deleting courses
 * - Status updates
 *
 * Mengikuti arsitektur Maguru untuk low-level hooks dengan:
 * - Direct interaction dengan adapter layer
 * - Error handling yang konsisten
 * - Type safety dengan TypeScript
 * - Retry logic dan fallback mechanisms
 * - Designing for failure principles
 *
 * Hook ini akan digunakan oleh high-level hooks untuk logika bisnis yang lebih kompleks.
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CourseAdapter } from '../adapters/courseAdapter'
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseListResponse,
  CourseResponse,
} from '../types'

// Hook return type
interface UseCourseReturn {
  // Data states
  courses: Course[]
  currentCourse: Course | null

  // Loading states
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Error state
  error: string | null

  // Pagination
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }

  // CRUD operations
  fetchCourses: (searchParams?: {
    searchQuery?: string
    selectedStatus?: string
    selectedCategory?: string
    page?: number
    limit?: number
  }) => Promise<void>
  fetchCourseById: (id: string) => Promise<void>
  fetchCoursesByCreator: (creatorId: string, page?: number, limit?: number) => Promise<void>
  createCourse: (courseData: CreateCourseRequest) => Promise<Course | null>
  updateCourse: (id: string, courseData: UpdateCourseRequest) => Promise<Course | null>
  deleteCourse: (id: string) => Promise<boolean>
  updateCourseStatus: (id: string, status: string) => Promise<Course | null>

  // Thumbnail utilities
  getDisplayThumbnail: (thumbnail: string | null) => string
  isDefaultThumbnail: (thumbnail: string | null) => boolean
  getDefaultThumbnailUrl: () => string

  // Utility functions
  clearError: () => void
  resetState: () => void
}

export function useCourse(): UseCourseReturn {
  const queryClient = useQueryClient()

  // Fetch all courses dengan search/filter parameters
  const {
    data: coursesData,
    isLoading,
    error: queryError,
    refetch: refetchCourses,
  } = useQuery<CourseListResponse>({
    queryKey: ['courses'],
    queryFn: () => CourseAdapter.getCourses(),
    gcTime: 10 * 60 * 1000, // 10 menit cache
    staleTime: 5 * 60 * 1000, // 5 menit stale (lebih konservatif)
    retry: 1,
    refetchOnWindowFocus: false, // Matikan refetch otomatis saat window focus
    refetchOnReconnect: false, // Matikan refetch otomatis saat reconnect
    refetchOnMount: true, // Hanya refetch saat mount pertama
  })

  // Fetch course by ID
  const {
    data: currentCourseData,
    isLoading: isLoadingCourse,
    error: courseError,
  } = useQuery<CourseResponse>({
    queryKey: ['course'],
    queryFn: () => CourseAdapter.getCourseById(''), // Will be overridden
    enabled: false, // Disabled by default
    gcTime: 5 * 60 * 1000,
    staleTime: 30 * 1000,
    retry: 2,
  })

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: (courseData: CreateCourseRequest) => CourseAdapter.createCourse(courseData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      return data
    },
  })

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) =>
      CourseAdapter.updateCourse(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
      return data
    },
  })

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: CourseAdapter.deleteCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
      return data
    },
  })

  // Update course status mutation
  const updateCourseStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      CourseAdapter.updateCourseStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
      return data
    },
  })

  // Utility functions
  const getDisplayThumbnail = CourseAdapter.getDisplayThumbnail
  const isDefaultThumbnail = CourseAdapter.isDefaultThumbnail
  const getDefaultThumbnailUrl = CourseAdapter.getDefaultThumbnailUrl

  // CRUD operations dengan proper error handling dan debouncing
  const fetchCourses = async (searchParams?: {
    searchQuery?: string
    selectedStatus?: string
    selectedCategory?: string
    page?: number
    limit?: number
  }) => {
    try {


      // Tambahkan debouncing untuk mencegah multiple rapid calls
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1000) // 1 detik timeout

      // Jika ada search/filter parameters, panggil adapter dengan parameters
      if (
        searchParams?.searchQuery ||
        searchParams?.selectedStatus ||
        searchParams?.selectedCategory
      ) {

        // Panggil adapter langsung dengan search parameters
        const response = await CourseAdapter.getCourses(
          searchParams.page || 1,
          searchParams.limit || 10,
          {
            searchQuery: searchParams.searchQuery,
            selectedStatus: searchParams.selectedStatus,
            selectedCategory: searchParams.selectedCategory,
          },
        )

        // Update query cache dengan hasil search
        queryClient.setQueryData(['courses'], response)
      
      } else {
        // Jika tidak ada search parameters, gunakan refetch normal
        await refetchCourses()
      }
      clearTimeout(timeoutId)

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('useCourse', 'fetchCourses', 'Fetch courses aborted due to rapid calls')
      } else {
        console.error('useCourse', 'fetchCourses', 'Failed to fetch courses', error as Error)
      }
    }
  }

  const fetchCourseById = async (id: string) => {
    try {
      // Update query key dan fetch
      queryClient.setQueryData(['course'], null)
      const response = await CourseAdapter.getCourseById(id)
      if (response.success && response.data) {
        queryClient.setQueryData(['course'], response)
      }
    } catch (error) {
      console.error('Failed to fetch course by ID:', error)
    }
  }

  const fetchCoursesByCreator = async (creatorId: string, page: number = 1, limit: number = 10) => {
    try {
      const response = await CourseAdapter.getCoursesByCreator(creatorId, page, limit)
      if (response.success && response.data) {
        queryClient.setQueryData(['courses'], response.data)
      }
    } catch (error) {
      console.error('Failed to fetch courses by creator:', error)
    }
  }

  const createCourse = async (courseData: CreateCourseRequest): Promise<Course | null> => {
    try {
      const response = await createCourseMutation.mutateAsync(courseData)
      if (response.success && response.data) {
        return response.data
      }
      // Log error jika response tidak success
      console.error('useCourse', 'createCourse', 'Create course failed', {
        error: response.error,
      })
      return null
    } catch (error) {
      console.error('useCourse', 'createCourse', 'Exception during course creation', error as Error)
      return null
    }
  }

  const updateCourse = async (
    id: string,
    courseData: UpdateCourseRequest,
  ): Promise<Course | null> => {
    try {
      // Perbaiki parameter yang dikirim ke mutation
      const response = await updateCourseMutation.mutateAsync({
        id,
        data: courseData,
      })
      if (response.success && response.data) {
        return response.data
      }

      return null
    } catch (error) {
      console.error('useCourse', 'updateCourse', 'Exception during course update', error as Error)
      return null
    }
  }

  const deleteCourse = async (id: string): Promise<boolean> => {
    try {
      const response = await deleteCourseMutation.mutateAsync(id)
      if (response.success) {
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to delete course:', error)
      return false
    }
  }

  const updateCourseStatus = async (id: string, status: string): Promise<Course | null> => {
    try {
      const response = await updateCourseStatusMutation.mutateAsync({ id, status })
      return response.success && response.data ? response.data : null
    } catch (error) {
      console.error('Failed to update course status:', error)
      return null
    }
  }

  // Utility functions
  const clearError = () => {
    queryClient.clear()
  }

  const resetState = () => {
    queryClient.clear()
  }

  return {
    // Data states
    courses: coursesData?.data?.courses || [],
    currentCourse: currentCourseData?.data || null,

    // Loading states
    isLoading: isLoading || isLoadingCourse,
    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending || updateCourseStatusMutation.isPending,
    isDeleting: deleteCourseMutation.isPending,

    // Error state
    error: queryError?.message || courseError?.message || null,

    // Pagination
    pagination: coursesData?.data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },

    // CRUD operations
    fetchCourses,
    fetchCourseById,
    fetchCoursesByCreator,
    createCourse,
    updateCourse,
    deleteCourse,
    updateCourseStatus,

    // Thumbnail utilities
    getDisplayThumbnail,
    isDefaultThumbnail,
    getDefaultThumbnailUrl,

    // Utility functions
    clearError,
    resetState,
  }
}
