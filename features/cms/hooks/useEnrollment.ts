'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { enrollCourse } from '../api/course.api'

export interface UseEnrollmentOptions {
  courseId: string
  courseTitle: string
  initialEnrolled?: boolean
}

export function useEnrollment({ courseId, courseTitle, initialEnrolled = false }: UseEnrollmentOptions) {
  const router = useRouter()
  const [enrolled, setEnrolled] = useState(initialEnrolled)
  const [enrolling, setEnrolling] = useState(false)

  async function handleEnroll() {
    setEnrolling(true)
    try {
      await enrollCourse(courseId)
      setEnrolled(true)
      toast.success(`Berhasil mendaftar ke "${courseTitle}"`)
      setTimeout(() => {
        router.push(`/course/${courseId}/learn`)
      }, 800)
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      if (message === 'UNAUTHORIZED') {
        toast.error('Silakan login terlebih dahulu')
        router.push('/sign-in')
      } else if (message === 'ALREADY_ENROLLED') {
        setEnrolled(true)
        router.push(`/course/${courseId}/learn`)
      } else if (message === 'DRAFT') {
        toast.error('Kursus ini belum dipublikasikan')
      } else {
        toast.error('Terjadi kesalahan. Coba lagi.')
      }
    } finally {
      setEnrolling(false)
    }
  }

  return { enrolled, enrolling, handleEnroll }
}
