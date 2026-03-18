'use client'

/**
 * Course Detail & Management Page (Confluence-style)
 *
 * Layout:
 * - Top header: course info + publish/unpublish toggle
 * - Left sidebar: collapsible section/lesson tree
 * - Right content: selected lesson editor or section overview
 *
 * Requirements: 4.4, 6.1, 6.2, 6.5, 6.6
 */

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SectionForm } from '@/features/cms/components/creator/SectionForm'
import { LessonForm } from '@/features/cms/components/creator/LessonForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Plus,
  Globe,
  EyeOff,
  ChevronDown,
  ChevronRight,
  BookOpen,
  FileText,
  Edit,
  Trash2,
  Settings,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Section {
  id: string
  title: string
  description: string | null
  order: number
  lessonCount: number
}

interface Lesson {
  id: string
  title: string
  order: number
  contentPreview: string
}

interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  status: string
  category: string | null
  difficulty: string | null
}

type ActiveView =
  | { type: 'overview' }
  | { type: 'lesson'; sectionId: string; lessonId: string }
  | { type: 'section'; sectionId: string }

export default function CourseManagePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.slug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [lessonsMap, setLessonsMap] = useState<Record<string, Lesson[]>>({})
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'overview' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  // Dialog states
  const [sectionFormOpen, setSectionFormOpen] = useState(false)
  const [lessonFormOpen, setLessonFormOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [editingLesson, setEditingLesson] = useState<{ lesson: Lesson; sectionId: string } | null>(null)
  const [addingLessonToSection, setAddingLessonToSection] = useState<string | null>(null)

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchCourse = useCallback(async () => {
    const res = await fetch(`/api/courses/${courseId}`)
    if (!res.ok) throw new Error('Course not found')
    return res.json()
  }, [courseId])

  const fetchSections = useCallback(async () => {
    const res = await fetch(`/api/courses/${courseId}/sections`)
    if (!res.ok) throw new Error('Failed to load sections')
    const data = await res.json()
    return data.sections || []
  }, [courseId])

  const fetchLessons = useCallback(async (sectionId: string) => {
    const res = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons`)
    if (!res.ok) throw new Error('Failed to load lessons')
    const data = await res.json()
    return data.lessons || []
  }, [courseId])

  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        const [courseData, sectionsData] = await Promise.all([fetchCourse(), fetchSections()])
        setCourse(courseData)
        setSections(sectionsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [fetchCourse, fetchSections])

  // ── Sidebar helpers ────────────────────────────────────────────────────────

  const toggleSection = async (sectionId: string) => {
    const next = new Set(expandedSections)
    if (next.has(sectionId)) {
      next.delete(sectionId)
    } else {
      next.add(sectionId)
      // Lazy-load lessons for this section
      if (!lessonsMap[sectionId]) {
        try {
          const lessons = await fetchLessons(sectionId)
          setLessonsMap((prev) => ({ ...prev, [sectionId]: lessons }))
        } catch {
          toast.error('Gagal memuat pelajaran')
        }
      }
    }
    setExpandedSections(next)
  }

  // ── Publish toggle ─────────────────────────────────────────────────────────

  const handleTogglePublish = async () => {
    if (!course) return
    setPublishing(true)
    try {
      const res = await fetch(`/api/creator/courses/${courseId}/publish`, { method: 'PUT' })
      if (!res.ok) throw new Error('Failed to toggle status')
      const data = await res.json()
      setCourse((prev) => prev ? { ...prev, status: data.course.status } : prev)
      toast.success(
        data.course.status === 'PUBLISHED'
          ? 'Kursus berhasil dipublish'
          : 'Kursus berhasil di-unpublish'
      )
    } catch {
      toast.error('Gagal mengubah status kursus')
    } finally {
      setPublishing(false)
    }
  }

  // ── Section handlers ───────────────────────────────────────────────────────

  const handleSectionFormSubmit = async (data: { title: string; description: string; order: number }) => {
    if (editingSection) {
      const res = await fetch(`/api/courses/${courseId}/sections/${editingSection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update section')
      const updated = await res.json()
      setSections((prev) => prev.map((s) => (s.id === editingSection.id ? { ...s, ...updated } : s)))
      toast.success('Seksi berhasil diperbarui')
    } else {
      const res = await fetch(`/api/courses/${courseId}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create section')
      const created = await res.json()
      setSections((prev) => [...prev, { ...created, lessonCount: 0 }])
      toast.success('Seksi berhasil dibuat')
    }
    setSectionFormOpen(false)
    setEditingSection(null)
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Hapus seksi ini? Semua pelajaran di dalamnya juga akan dihapus.')) return
    const res = await fetch(`/api/courses/${courseId}/sections/${sectionId}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Gagal menghapus seksi'); return }
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    setLessonsMap((prev) => { const n = { ...prev }; delete n[sectionId]; return n })
    if (activeView.type !== 'overview' && 'sectionId' in activeView && activeView.sectionId === sectionId) {
      setActiveView({ type: 'overview' })
    }
    toast.success('Seksi berhasil dihapus')
  }

  // ── Lesson handlers ────────────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLessonFormSubmit = async (data: { title: string; content: any; order: number }) => {
    if (editingLesson) {
      const { lesson, sectionId } = editingLesson
      const res = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update lesson')
      const updated = await res.json()
      setLessonsMap((prev) => ({
        ...prev,
        [sectionId]: (prev[sectionId] || []).map((l) => (l.id === lesson.id ? { ...l, ...updated } : l)),
      }))
      toast.success('Pelajaran berhasil diperbarui')
    } else if (addingLessonToSection) {
      const res = await fetch(`/api/courses/${courseId}/sections/${addingLessonToSection}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create lesson')
      const created = await res.json()
      setLessonsMap((prev) => ({
        ...prev,
        [addingLessonToSection]: [...(prev[addingLessonToSection] || []), created],
      }))
      setSections((prev) =>
        prev.map((s) =>
          s.id === addingLessonToSection ? { ...s, lessonCount: s.lessonCount + 1 } : s
        )
      )
      toast.success('Pelajaran berhasil dibuat')
    }
    setLessonFormOpen(false)
    setEditingLesson(null)
    setAddingLessonToSection(null)
  }

  const handleDeleteLesson = async (sectionId: string, lessonId: string) => {
    if (!confirm('Hapus pelajaran ini?')) return
    const res = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, {
      method: 'DELETE',
    })
    if (!res.ok) { toast.error('Gagal menghapus pelajaran'); return }
    setLessonsMap((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).filter((l) => l.id !== lessonId),
    }))
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, lessonCount: s.lessonCount - 1 } : s))
    )
    if (activeView.type === 'lesson' && activeView.lessonId === lessonId) {
      setActiveView({ type: 'section', sectionId })
    }
    toast.success('Pelajaran berhasil dihapus')
  }

  // ── Loading / Error states ─────────────────────────────────────────────────

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

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-beige-50">
        <div className="text-center">
          <p className="text-merah-600 mb-4">{error || 'Kursus tidak ditemukan'}</p>
          <Button onClick={() => router.push('/creator/courses')}>Kembali ke Daftar Kursus</Button>
        </div>
      </div>
    )
  }

  const isPublished = course.status === 'PUBLISHED'

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-beige-50 overflow-hidden">

      {/* ── Top Header ── */}
      <header className="bg-white border-b border-beige-200 shadow-sm px-6 py-4 flex items-center gap-4 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/creator/courses')}
          className="text-beige-600 hover:text-beige-900 hover:bg-beige-100 -ml-2"
          data-testid="back-to-courses-btn"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Kursus
        </Button>

        <div className="h-5 w-px bg-beige-200" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-bold text-beige-900 truncate">{course.title}</h1>
            <Badge
              variant="outline"
              className={
                isPublished
                  ? 'bg-hijau-50 text-hijau-700 border-hijau-200 text-xs'
                  : 'bg-kuning-50 text-kuning-700 border-kuning-200 text-xs'
              }
            >
              {course.status}
            </Badge>
            {course.category && (
              <span className="text-xs text-beige-500">{course.category}</span>
            )}
            {course.difficulty && (
              <span className="text-xs text-beige-500">{course.difficulty}</span>
            )}
          </div>
          {course.description && (
            <p className="text-xs text-beige-500 mt-0.5 truncate">{course.description}</p>
          )}
        </div>

        <Button
          size="sm"
          disabled={publishing}
          onClick={handleTogglePublish}
          data-testid="publish-toggle-btn"
          className={
            isPublished
              ? 'border-kuning-300 text-kuning-700 bg-kuning-50 hover:bg-kuning-100 border'
              : 'bg-hijau-500 hover:bg-hijau-600 text-white'
          }
        >
          {publishing ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent mr-2" />
          ) : isPublished ? (
            <EyeOff className="h-3.5 w-3.5 mr-1.5" />
          ) : (
            <Globe className="h-3.5 w-3.5 mr-1.5" />
          )}
          {publishing ? 'Menyimpan...' : isPublished ? 'Unpublish' : 'Publish'}
        </Button>
      </header>

      {/* ── Body: Sidebar + Content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar (Section/Lesson Tree) ── */}
        <aside className="w-72 bg-white border-r border-beige-200 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-beige-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-beige-700">Konten Kursus</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-merah-600 hover:bg-merah-50"
              onClick={() => { setEditingSection(null); setSectionFormOpen(true) }}
              data-testid="add-section-btn"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Seksi
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-2">
            {/* Overview item */}
            <button
              onClick={() => setActiveView({ type: 'overview' })}
              data-testid="sidebar-overview-btn"
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                activeView.type === 'overview'
                  ? 'bg-merah-50 text-merah-700 font-medium'
                  : 'text-beige-700 hover:bg-beige-50'
              }`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              Overview Kursus
            </button>

            {sections.length === 0 ? (
              <p className="text-xs text-beige-400 px-3 py-4 text-center">
                Belum ada seksi. Klik + Seksi untuk mulai.
              </p>
            ) : (
              sections.map((section) => {
                const isExpanded = expandedSections.has(section.id)
                const lessons = lessonsMap[section.id] || []
                const isActiveSection = activeView.type === 'section' && activeView.sectionId === section.id

                return (
                  <div key={section.id} className="mb-1">
                    {/* Section row */}
                    <div
                      className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                        isActiveSection ? 'bg-beige-100' : 'hover:bg-beige-50'
                      }`}
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-beige-400 shrink-0" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-beige-400 shrink-0" />
                        )}
                        <BookOpen className="h-3.5 w-3.5 text-beige-500 shrink-0" />
                        <span className="text-sm text-beige-800 font-medium truncate">
                          {section.title}
                        </span>
                        <span className="text-xs text-beige-400 shrink-0 ml-auto">
                          {section.lessonCount}
                        </span>
                      </button>

                      {/* Section actions (visible on hover) */}
                      <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingSection(section)
                            setSectionFormOpen(true)
                          }}
                          className="p-1 rounded hover:bg-beige-200 text-beige-500 hover:text-beige-700"
                          title="Edit seksi"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-1 rounded hover:bg-merah-100 text-beige-500 hover:text-merah-600"
                          title="Hapus seksi"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!expandedSections.has(section.id)) await toggleSection(section.id)
                            setAddingLessonToSection(section.id)
                            setEditingLesson(null)
                            setLessonFormOpen(true)
                          }}
                          className="p-1 rounded hover:bg-hijau-100 text-beige-500 hover:text-hijau-600"
                          title="Tambah pelajaran"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons */}
                    {isExpanded && (
                      <div className="ml-6 mt-0.5 space-y-0.5">
                        {lessons.map((lesson) => {
                          const isActiveLesson =
                            activeView.type === 'lesson' &&
                            activeView.lessonId === lesson.id

                          return (
                            <div
                              key={lesson.id}
                              className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                isActiveLesson
                                  ? 'bg-merah-50 text-merah-700'
                                  : 'hover:bg-beige-50 text-beige-700'
                              }`}
                              onClick={() =>
                                setActiveView({ type: 'lesson', sectionId: section.id, lessonId: lesson.id })
                              }
                            >
                              <FileText className="h-3.5 w-3.5 shrink-0 text-beige-400" />
                              <span className="text-xs flex-1 truncate">{lesson.title}</span>

                              <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingLesson({ lesson, sectionId: section.id })
                                    setAddingLessonToSection(null)
                                    setLessonFormOpen(true)
                                  }}
                                  className="p-1 rounded hover:bg-beige-200 text-beige-400 hover:text-beige-700"
                                  title="Edit pelajaran"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteLesson(section.id, lesson.id)
                                  }}
                                  className="p-1 rounded hover:bg-merah-100 text-beige-400 hover:text-merah-600"
                                  title="Hapus pelajaran"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )
                        })}

                        {/* Add lesson shortcut */}
                        <button
                          onClick={async () => {
                            setAddingLessonToSection(section.id)
                            setEditingLesson(null)
                            setLessonFormOpen(true)
                          }}
                          className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs text-beige-400 hover:text-hijau-600 hover:bg-hijau-50 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          Tambah pelajaran
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </nav>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeView.type === 'overview' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-beige-900 mb-6">Overview Kursus</h2>
              <div className="bg-white rounded-xl border border-beige-200 shadow-neu p-6 space-y-4">
                <div>
                  <p className="text-xs text-beige-500 uppercase tracking-wide mb-1">Judul</p>
                  <p className="text-beige-900 font-medium">{course.title}</p>
                </div>
                {course.description && (
                  <div>
                    <p className="text-xs text-beige-500 uppercase tracking-wide mb-1">Deskripsi</p>
                    <p className="text-beige-700 text-sm leading-relaxed">{course.description}</p>
                  </div>
                )}
                <div className="flex gap-6">
                  {course.category && (
                    <div>
                      <p className="text-xs text-beige-500 uppercase tracking-wide mb-1">Kategori</p>
                      <p className="text-beige-700 text-sm">{course.category}</p>
                    </div>
                  )}
                  {course.difficulty && (
                    <div>
                      <p className="text-xs text-beige-500 uppercase tracking-wide mb-1">Tingkat</p>
                      <p className="text-beige-700 text-sm">{course.difficulty}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-beige-500 uppercase tracking-wide mb-1">Status</p>
                    <Badge
                      variant="outline"
                      className={
                        isPublished
                          ? 'bg-hijau-50 text-hijau-700 border-hijau-200 text-xs'
                          : 'bg-kuning-50 text-kuning-700 border-kuning-200 text-xs'
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                </div>
                <div className="pt-2 border-t border-beige-100">
                  <p className="text-xs text-beige-500">
                    {sections.length} seksi &middot;{' '}
                    {sections.reduce((sum, s) => sum + s.lessonCount, 0)} pelajaran
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeView.type === 'section' && (() => {
            const section = sections.find((s) => s.id === activeView.sectionId)
            if (!section) return null
            return (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-beige-900 mb-2">{section.title}</h2>
                {section.description && (
                  <p className="text-beige-600 mb-6">{section.description}</p>
                )}
                <p className="text-sm text-beige-500">
                  {section.lessonCount} pelajaran dalam seksi ini.
                </p>
              </div>
            )
          })()}

          {activeView.type === 'lesson' && (() => {
            const lessons = lessonsMap[activeView.sectionId] || []
            const lesson = lessons.find((l) => l.id === activeView.lessonId)
            if (!lesson) return null
            return (
              <div className="max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-beige-900">{lesson.title}</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-beige-300 text-beige-700 hover:bg-beige-50"
                    onClick={() => {
                      setEditingLesson({ lesson, sectionId: activeView.sectionId })
                      setAddingLessonToSection(null)
                      setLessonFormOpen(true)
                    }}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit Pelajaran
                  </Button>
                </div>
                <div className="bg-white rounded-xl border border-beige-200 shadow-neu p-6">
                  <p className="text-beige-600 text-sm whitespace-pre-wrap">
                    {lesson.contentPreview || 'Belum ada konten.'}
                  </p>
                </div>
              </div>
            )
          })()}
        </main>
      </div>

      {/* ── Dialogs ── */}
      <Dialog open={sectionFormOpen} onOpenChange={setSectionFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSection ? 'Edit Seksi' : 'Buat Seksi Baru'}</DialogTitle>
          </DialogHeader>
          <SectionForm
            initialData={
              editingSection
                ? { title: editingSection.title, description: editingSection.description || '', order: editingSection.order }
                : undefined
            }
            onSubmit={handleSectionFormSubmit}
            onCancel={() => { setSectionFormOpen(false); setEditingSection(null) }}
            isEditing={!!editingSection}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={lessonFormOpen} onOpenChange={setLessonFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Pelajaran' : 'Buat Pelajaran Baru'}</DialogTitle>
          </DialogHeader>
          <LessonForm
            initialData={editingLesson?.lesson || undefined}
            onSubmit={handleLessonFormSubmit}
            onCancel={() => { setLessonFormOpen(false); setEditingLesson(null); setAddingLessonToSection(null) }}
            isEditing={!!editingLesson}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
