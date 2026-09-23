'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BookOpen, ArrowRight } from 'lucide-react'

/**
 * CourseEnrollButton
 *
 * Used on the course overview/detail page.
 * - Not enrolled: shows "Mulai Belajar Sekarang ➔", calls POST /api/courses/[slug]/enroll
 * - Enrolled: shows "Lanjut Belajar ➔", links to /course/[slug]/learn
 *
 * Requirements: 2.1, 2.2, 2.7, Whimsical Ancient Fantasy Asia Design
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
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#2D2319] hover:bg-[#1E1711] text-white font-sans text-sm font-bold shadow-[0_4px_12px_rgba(45,35,25,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all cursor-pointer"
      >
        <BookOpen className="w-4 h-4" />
        <span>Lanjut Belajar</span>
        <ArrowRight className="w-4 h-4 ml-0.5" />
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
      className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-linear-to-r from-[#E53935] via-[#D32F2F] to-[#C62828] hover:from-[#F44336] hover:to-[#D32F2F] text-white font-sans text-sm font-bold shadow-[0_4px_14px_rgba(229,57,53,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_20px_rgba(229,57,53,0.45)] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
      {enrolling ? (
        'Mendaftar...'
      ) : (
        <>
          <span>Mulai Belajar Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  )
}
