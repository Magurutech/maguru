'use client'

/**
 * Course Detail & Management Page (Confluence-style)
 *
 * Thin orchestrator — state via ManageProvider (Context API),
 * UI split into ManageHeader, ManageSidebar, ManageContent, ManageDialogs.
 *
 * Requirements: 4.4, 6.1, 6.2, 6.5, 6.6
 */

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  ManageHeader,
  ManageSidebar,
  ManageContent,
  ManageDialogs,
} from '@/features/cms/components/creator/manage'
import { ManageProvider, useManageContext} from '@/features/cms/Context/creator/ManageContext'

function ManagePageInner() {
  const router = useRouter()
  const { loading, error } = useManageContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-beige-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-merah-500 mx-auto mb-3" />
          <p className="text-beige-600">Memuat kursus...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-beige-50">
        <div className="text-center">
          <p className="text-merah-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/creator/courses')}>Kembali ke Daftar Kursus</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-beige-50 overflow-hidden">
      <ManageHeader />
      <div className="flex flex-1 overflow-hidden">
        <ManageSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <ManageContent />
        </main>
      </div>
      <ManageDialogs />
    </div>
  )
}

export default function CourseManagePage() {
  const params = useParams()
  const courseSlug = params.slug as string

  return (
    <ManageProvider courseSlug={courseSlug}>
      <ManagePageInner />
    </ManageProvider>
  )
}
