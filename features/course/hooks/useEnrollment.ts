/**
 * useEnrollment Hook - Low-Level Hook
 *
 * @description
 * Low-level hook untuk enrollment operations yang berinteraksi langsung dengan adapter.
 * Hook ini menggunakan React Query untuk state management dan mengimplementasikan:
 * - Enrollment operations (enroll, unenroll)
 * - Error handling dengan retry logic
 * - Loading states
 * - Cache invalidation
 * - Designing for failure patterns (retry, timeout, fallback)
 *
 * Mengikuti arsitektur Maguru untuk low-level hooks dengan:
 * - Direct adapter calls
 * - React Query integration
 * - Error handling dan retry logic
 * - Designing for failure principles
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { enrollmentAdapter } from '../adapters/enrollmentAdapter'
import type { EnrollmentRequest, EnrollmentResponse } from '../types'

export function useEnrollment() {
  const queryClient = useQueryClient()

  // Enrollment mutation dengan designing for failure
  const enrollMutation = useMutation({
    mutationFn: async (courseId: string): Promise<EnrollmentResponse> => {
      const request: EnrollmentRequest = { courseId }
      return await enrollmentAdapter.enrollCourse(request)
    },
    onSuccess: (data) => {
      // Invalidate related queries untuk update UI
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment-status'] })

      // Success feedback
      toast.success('Berhasil mendaftar ke kursus!')

      return data
    },
    onSettled: (data, error) => {
      // Handle error in onSettled to ensure error state is properly set
      if (error) {
        console.error('Enrollment failed:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Gagal mendaftar ke kursus. Silakan coba lagi.'
        toast.error(errorMessage)
      }
    },
    retry: 3, // Retry pattern
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })

  // Unenroll mutation (untuk future use)
  const unenrollMutation = useMutation({
    mutationFn: async (courseId: string): Promise<EnrollmentResponse> => {
      return await enrollmentAdapter.unenrollCourse(courseId)
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment-status'] })

      toast.success('Berhasil keluar dari kursus')

      return data
    },
    onSettled: (data, error) => {
      // Handle error in onSettled to ensure error state is properly set
      if (error) {
        console.error('Unenrollment failed:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Gagal keluar dari kursus. Silakan coba lagi.'
        toast.error(errorMessage)
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
  })

  return {
    // Enrollment operations
    enrollCourse: enrollMutation.mutate,
    unenrollCourse: unenrollMutation.mutate,

    // Async operations for testing
    enrollCourseAsync: enrollMutation.mutateAsync,
    unenrollCourseAsync: unenrollMutation.mutateAsync,

    // Loading states
    isEnrolling: enrollMutation.isPending,
    isUnenrolling: unenrollMutation.isPending,

    // Error states
    enrollmentError: enrollMutation.error,
    unenrollmentError: unenrollMutation.error,

    // Success states
    isEnrollmentSuccess: enrollMutation.isSuccess,
    isUnenrollmentSuccess: unenrollMutation.isSuccess,

    // Reset functions
    resetEnrollment: enrollMutation.reset,
    resetUnenrollment: unenrollMutation.reset,
  }
}
