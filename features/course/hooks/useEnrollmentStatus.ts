/**
 * useEnrollmentStatus Hook - Low-Level Hook
 *
 * @description
 * Low-level hook untuk mengecek status enrollment user pada kursus tertentu.
 * Hook ini menggunakan React Query untuk caching dan mengimplementasikan:
 * - Enrollment status checking
 * - Caching untuk performance
 * - Error handling dengan retry logic
 * - Background refetch untuk real-time updates
 * - Designing for failure patterns
 *
 * Mengikuti arsitektur Maguru untuk low-level hooks dengan:
 * - Direct adapter calls
 * - React Query integration
 * - Caching strategy
 * - Error handling dan retry logic
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { enrollmentAdapter } from '../adapters/enrollmentAdapter'
import type { EnrollmentStatusResponse } from '../types'

export function useEnrollmentStatus(courseId: string) {
  return useQuery({
    queryKey: ['enrollment-status', courseId],
    queryFn: async (): Promise<EnrollmentStatusResponse> => {
      return await enrollmentAdapter.getEnrollmentStatus(courseId)
    },
    enabled: !!courseId, // Hanya jalankan query jika courseId ada
    retry: 3, // Retry pattern
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // 5 menit cache
    gcTime: 10 * 60 * 1000, // 10 menit garbage collection
    refetchOnWindowFocus: true, // Refetch saat window focus untuk real-time updates
    refetchOnMount: true, // Refetch saat component mount
  })
}

/**
 * useEnrollmentList Hook - Low-Level Hook
 *
 * @description
 * Low-level hook untuk mendapatkan daftar enrollment user.
 * Hook ini menggunakan React Query untuk caching dan pagination.
 */

export function useEnrollmentList(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['enrollments', page, limit],
    queryFn: async () => {
      return await enrollmentAdapter.getEnrollments({ page, limit })
    },
    enabled: true, // Selalu enabled untuk enrollment list
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
    staleTime: 2 * 60 * 1000, // 2 menit cache untuk list
    gcTime: 5 * 60 * 1000, // 5 menit garbage collection
  })
}
