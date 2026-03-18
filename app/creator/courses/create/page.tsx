/**
 * Course Creation Page
 * Quick Start form page for creators to create a new course.
 * Requirements: 5.1, 5.5
 */

'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useRoleGuard } from '@/features/auth'
import { CourseCreationForm } from '@/features/cms/components/creator/CourseCreationForm'
import { BookOpen } from 'lucide-react'

export default function CourseCreatePage() {
  const router = useRouter()
  const { isLoaded } = useUser()
  const { canAccessCreator } = useRoleGuard()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 to-kuning-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-merah-500 border-t-transparent" />
      </div>
    )
  }

  if (!canAccessCreator()) {
    router.replace('/sign-in')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-kuning-50 to-hijau-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-merah-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-merah-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-beige-900 font-serif">Buat Kursus Baru</h1>
              <p className="text-sm text-beige-600">Isi informasi dasar untuk memulai kursus Anda</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6">
          <CourseCreationForm
            onSuccess={(course) => {
              router.push(`/creator/courses/${course.id}/manage`)
            }}
          />
        </div>
      </div>
    </div>
  )
}
