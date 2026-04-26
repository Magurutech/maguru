'use client'

import { toast } from 'sonner'
import type { ManagedSection } from './useCourseManage'
import { toastError } from '@/features/cms/utils/error-toast'
import type { ManagedLesson } from './useLessonHandlers'
import type { ActiveView } from './useManageView'

interface UseSectionHandlersProps {
  courseSlug: string
  setSections: React.Dispatch<React.SetStateAction<ManagedSection[]>>
  setLessonsMap: React.Dispatch<React.SetStateAction<Record<string, ManagedLesson[]>>>
  activeView: ActiveView
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>
}

export function useSectionHandlers({
  courseSlug,
  setSections,
  setLessonsMap,
  activeView,
  setActiveView,
}: UseSectionHandlersProps) {
  const handleSectionSubmit = async (
    data: { title: string; description: string; order: number },
    editingSection: ManagedSection | null,
    onDone: () => void
  ) => {
    try {
      if (editingSection) {
        const res = await fetch(`/api/courses/${courseSlug}/sections/${editingSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || 'Gagal memperbarui seksi')
        }
        const updated = await res.json()
        setSections((prev) => prev.map((s) => (s.id === editingSection.id ? { ...s, ...updated } : s)))
        toast.success('Seksi berhasil diperbarui')
      } else {
        const res = await fetch(`/api/courses/${courseSlug}/sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || 'Gagal membuat seksi')
        }
        const created = await res.json()
        setSections((prev) => [...prev, { ...created, lessonCount: 0 }])
        toast.success('Seksi berhasil dibuat')
      }
      onDone()
    } catch (err) {
      toastError(err, 'Terjadi kesalahan')
    }
  }

  const handleDeleteSection = (_sectionId: string, onConfirm: () => void) => {
    onConfirm()
  }

  const executeDeleteSection = async (sectionId: string) => {
    const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Gagal menghapus seksi'); return }
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    setLessonsMap((prev) => { const n = { ...prev }; delete n[sectionId]; return n })
    if (activeView.type !== 'overview' && 'sectionId' in activeView && activeView.sectionId === sectionId) {
      setActiveView({ type: 'overview' })
    }
    toast.success('Seksi berhasil dihapus')
  }

  return { handleSectionSubmit, handleDeleteSection, executeDeleteSection }
}
