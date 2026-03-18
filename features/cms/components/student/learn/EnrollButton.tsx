'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CourseCard, type CourseCardCourse } from '@/features/cms/components/student/CourseCard'

/**
 * EnrollButton wrapper around CourseCard
 *
 * Handles the enroll POST call and redirects on success.
 * Wraps CourseCard so the server page stays a server component.
 *
 * Requirements: 2.1, 2.2, 2.7
 */

interface EnrollableCourseCardProps {
  course: CourseCardCourse
  enrolled: boolean
}

export function EnrollableCourseCard({ course, enrolled: initialEnrolled }: EnrollableCourseCardProps) {
  const router = useRouter()
  const [enrolled, setEnrolled] = useState(initialEnrolled)
  const [enrolling, setEnrolling] = useState(false)

  async function handleEnroll() {
    setEnrolling(true)
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, { method: 'POST' })

      if (res.status === 401) {
        toast.error('Silakan login terlebih dahulu')
        router.push('/sign-in')
        return
      }

      if (res.status === 409) {
        // Already enrolled — just update UI
        setEnrolled(true)
        router.push(`/course/${course.id}/learn`)
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error ?? 'Gagal mendaftar ke kursus')
        return
      }

      setEnrolled(true)
      toast.success(`Berhasil mendaftar ke "${course.title}"`)
      // Delay navigation slightly so the toast has time to render before unmount
      setTimeout(() => {
        router.push(`/course/${course.id}/learn`)
      }, 800)
    } catch {
      toast.error('Terjadi kesalahan. Coba lagi.')
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <CourseCard
      course={course}
      enrolled={enrolled}
      onEnroll={handleEnroll}
      enrolling={enrolling}
    />
  )
}
