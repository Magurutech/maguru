'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight } from 'lucide-react'

/**
 * CourseEnrollButton
 *
 * Used on the course overview/detail page.
 * - Not enrolled: shows "Daftar Sekarang", calls POST /api/courses/[slug]/enroll
 * - Enrolled: shows "Lanjut Belajar", links to /course/[slug]/learn
 *
 * Requirements: 2.1, 2.2, 2.7
 */

interface CourseEnrollButtonProps {
  courseSlug: string
  courseTitle: string
  initialEnrolled: boolean
}

export function CourseEnrollButton({
  courseSlug,
  courseTitle,
  initialEnrolled,
}: CourseEnrollButtonProps) {
  const router = useRouter()
  const [enrolled, setEnrolled] = useState(initialEnrolled)
  const [enrolling, setEnrolling] = useState(false)

  async function handleEnroll() {
    setEnrolling(true)
    try {
      const res = await fetch(`/api/courses/${courseSlug}/enroll`, { method: 'POST' })

      if (res.status === 401) {
        toast.error('Silakan login terlebih dahulu')
        router.push('/sign-in')
        return
      }

      if (res.status === 409) {
        setEnrolled(true)
        router.push(`/course/${courseSlug}/learn`)
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error ?? 'Gagal mendaftar ke kursus')
        return
      }

      setEnrolled(true)
      toast.success(`Berhasil mendaftar ke "${courseTitle}"`)
      setTimeout(() => {
        router.push(`/course/${courseSlug}/learn`)
      }, 800)
    } catch {
      toast.error('Terjadi kesalahan. Coba lagi.')
    } finally {
      setEnrolling(false)
    }
  }

  if (enrolled) {
    return (
      <Button
        size="lg"
        data-testid="continue-learning-btn"
        onClick={() => router.push(`/course/${courseSlug}/learn`)}
        className="bg-hijau-500 hover:bg-hijau-600 text-white hover:scale-105 transition-all duration-200 px-8"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Lanjut Belajar
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      onClick={handleEnroll}
      disabled={enrolling}
      data-testid="enroll-btn"
      aria-label={`Daftar ke kursus ${courseTitle}`}
      className="bg-merah-500 hover:bg-merah-600 text-white hover:scale-105 transition-all duration-200 px-8 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {enrolling ? (
        'Mendaftar...'
      ) : (
        <>
          Daftar Sekarang
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  )
}
