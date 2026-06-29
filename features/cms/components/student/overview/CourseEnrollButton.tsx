'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
      <button
        type="button"
        data-testid="continue-learning-btn"
        onClick={() => router.push(`/course/${courseSlug}/learn`)}
        className="w-full inline-flex items-center justify-center gap-2 p-[12px_24px] rounded-full bg-text-primary text-bg-canvas dark:bg-white dark:text-text-primary hover:opacity-90 font-sans text-sm font-semibold hover:-translate-y-px transition-all duration-180 cursor-pointer shadow-sm border-none"
      >
        <BookOpen className="w-4 h-4" />
        Lanjut Belajar
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleEnroll}
      disabled={enrolling}
      data-testid="enroll-btn"
      aria-label={`Daftar ke kursus ${courseTitle}`}
      className="w-full inline-flex items-center justify-center gap-2 p-[12px_24px] rounded-full bg-accent-coral hover:bg-[#e25e4a] text-white font-sans text-sm font-semibold hover:-translate-y-px transition-all duration-180 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm border-none"
    >
      {enrolling ? (
        'Mendaftar...'
      ) : (
        <>
          Daftar Sekarang
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  )
}
