'use client'

/**
 * Course Detail & Management Page (Course Authoring Workspace)
 *
 * Ruang Kerja Penulisan (Authoring Workspace) yang dirancang modular
 * menggunakan tata letak dua-panel (Sidebar Struktur Kiri dan Editor Konten Kanan)
 * untuk kenyamanan menulis yang maksimal.
 *
 * Layout order:
 *   1. ManageHeader (top nav bar)
 *   2. [Sidebar | Main scroll area]
 *      - When activeView === 'lesson-editor': LessonEditorPanel renders a
 *        sticky toolbar strip (Confluence-style) flush to the top of <main>
 */

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  ManageHeader,
  ManageSidebar,
  ManageContent,
  ManageDialogs,
} from '@/features/cms/components/creator/manage'
import { ManageProvider, useManageContext } from '@/features/cms/Context/creator/ManageContext'

function ManagePageInner() {
  const router = useRouter()
  const { loading, error } = useManageContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-coral mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Memuat kursus...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8 max-w-sm bg-card border border-border/10 rounded-3xl paper-texture">
          <p className="text-error text-sm mb-4 font-bold">{error}</p>
          <Button 
            onClick={() => router.push('/creator/courses')}
            className="btn-primary w-full"
          >
            Kembali ke Daftar Kursus
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground transition-colors duration-300">
      {/* 1. Top Navigation (ManageHeader) */}
      <ManageHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Course Structure Sidebar (Left Panel) */}
        <div className="relative shrink-0 h-full border-r border-border/10 bg-card">
          <ManageSidebar />
        </div>

        {/* 3. Content Editor — no padding-top so sticky toolbar hits exactly top:0 */}
        <main className="flex-1 overflow-y-auto bg-bg-bone/10">
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


