'use client'

import { toast } from 'sonner'
import type { ManagedSection } from './useCourseManage'

interface UseSectionHandlersProps {
  courseSlug: string
  setSections: React.Dispatch<React.SetStateAction<ManagedSection[]>>
  setLessonsMap: React.Dispatch<React.SetStateAction<Record<string, import('./useLessonHandlers').ManagedLesson[]>>>
  activeView: import('./useManageView').ActiveView
  setActiveView: React.Dispatch<React.SetStateAction<import('./useManageView').ActiveView>>
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
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan')
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Hapus seksi ini? Semua pelajaran di dalamnya juga akan dihapus.')) return
    const res = await fetch(`/api/courses/${courseSlug}/sections/${sectionId}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Gagal menghapus seksi'); return }
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    setLessonsMap((prev) => { const n = { ...prev }; delete n[sectionId]; return n })
    if (activeView.type !== 'overview' && 'sectionId' in activeView && activeView.sectionId === sectionId) {
      setActiveView({ type: 'overview' })
    }
    toast.success('Seksi berhasil dihapus')
  }

  return { handleSectionSubmit, handleDeleteSection }
}
