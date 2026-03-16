'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SectionList } from '@/features/cms/components/creator/SectionList'
import { LessonList } from '@/features/cms/components/creator/LessonList'
import { SectionForm } from '@/features/cms/components/creator/SectionForm'
import { LessonForm } from '@/features/cms/components/creator/LessonForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * Course Content Management Page
 * 
 * Halaman untuk creator mengelola sections dan lessons dalam course.
 * Mengintegrasikan semua komponen Task 10.
 * 
 * Requirements: 1.1-1.8, 2.1-2.9
 * Tasks: 10.1, 10.2, 10.3, 10.4
 */

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
}

export default function CourseManagePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [sectionFormOpen, setSectionFormOpen] = useState(false)
  const [lessonFormOpen, setLessonFormOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  // Fetch course and sections
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch course info
        const courseRes = await fetch(`/api/courses/${slug}`)
        if (!courseRes.ok) {
          throw new Error('Course not found')
        }
        const courseData = await courseRes.json()
        setCourse(courseData)

        // Fetch sections
        const sectionsRes = await fetch(`/api/courses/${slug}/sections`)
        if (!sectionsRes.ok) {
          throw new Error('Failed to load sections')
        }
        const sectionsData = await sectionsRes.json()
        setSections(sectionsData.sections || [])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load course')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  // Fetch lessons when section is selected
  useEffect(() => {
    async function fetchLessons() {
      if (!selectedSection) {
        setLessons([])
        return
      }

      try {
        const res = await fetch(`/api/courses/${slug}/sections/${selectedSection.id}/lessons`)
        if (!res.ok) {
          throw new Error('Failed to load lessons')
        }
        const data = await res.json()
        setLessons(data.lessons || [])
      } catch (err) {
        console.error('Error fetching lessons:', err)
        toast.error('Failed to load lessons')
      }
    }

    fetchLessons()
  }, [selectedSection, slug])

  // Section handlers
  const handleCreateSection = () => {
    setEditingSection(null)
    setSectionFormOpen(true)
  }

  const handleEditSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (section) {
      setEditingSection(section)
      setSectionFormOpen(true)
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const res = await fetch(`/api/courses/${slug}/sections/${sectionId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete section')
      }

      setSections(prev => prev.filter(s => s.id !== sectionId))
      if (selectedSection?.id === sectionId) {
        setSelectedSection(null)
      }
      toast.success('Section deleted successfully')
    } catch (err) {
      console.error('Error deleting section:', err)
      toast.error('Failed to delete section')
    }
  }

  const handleReorderSection = async (sectionId: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === sectionId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return

    const newSections = [...sections]
    const [movedSection] = newSections.splice(index, 1)
    newSections.splice(newIndex, 0, movedSection)

    // Update order values
    const updatedSections = newSections.map((s, i) => ({ ...s, order: i + 1 }))
    setSections(updatedSections)

    // Update in backend
    try {
      await fetch(`/api/courses/${slug}/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newIndex + 1 })
      })
      toast.success('Section reordered')
    } catch (err) {
      console.error('Error reordering section:', err)
      toast.error('Failed to reorder section')
      // Revert on error
      setSections(sections)
    }
  }

  const handleSectionFormSubmit = async (data: { title: string; description: string; order: number }) => {
    try {
      if (editingSection) {
        // Update existing section
        const res = await fetch(`/api/courses/${slug}/sections/${editingSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!res.ok) {
          throw new Error('Failed to update section')
        }

        const updated = await res.json()
        setSections(prev => prev.map(s => s.id === editingSection.id ? { ...s, ...updated } : s))
        toast.success('Section updated successfully')
      } else {
        // Create new section
        const res = await fetch(`/api/courses/${slug}/sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!res.ok) {
          throw new Error('Failed to create section')
        }

        const created = await res.json()
        setSections(prev => [...prev, { ...created, lessonCount: 0 }])
        toast.success('Section created successfully')
      }

      setSectionFormOpen(false)
      setEditingSection(null)
    } catch (err) {
      console.error('Error saving section:', err)
      throw err
    }
  }

  // Lesson handlers
  const handleCreateLesson = () => {
    if (!selectedSection) {
      toast.error('Please select a section first')
      return
    }
    setEditingLesson(null)
    setLessonFormOpen(true)
  }

  const handleEditLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId)
    if (lesson) {
      setEditingLesson(lesson)
      setLessonFormOpen(true)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!selectedSection) return

    try {
      const res = await fetch(`/api/courses/${slug}/sections/${selectedSection.id}/lessons/${lessonId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete lesson')
      }

      setLessons(prev => prev.filter(l => l.id !== lessonId))
      setSections(prev => prev.map(s => 
        s.id === selectedSection.id 
          ? { ...s, lessonCount: s.lessonCount - 1 }
          : s
      ))
      toast.success('Lesson deleted successfully')
    } catch (err) {
      console.error('Error deleting lesson:', err)
      toast.error('Failed to delete lesson')
    }
  }

  const handleReorderLesson = async (lessonId: string, direction: 'up' | 'down') => {
    if (!selectedSection) return

    const index = lessons.findIndex(l => l.id === lessonId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= lessons.length) return

    const newLessons = [...lessons]
    const [movedLesson] = newLessons.splice(index, 1)
    newLessons.splice(newIndex, 0, movedLesson)

    const updatedLessons = newLessons.map((l, i) => ({ ...l, order: i + 1 }))
    setLessons(updatedLessons)

    try {
      await fetch(`/api/courses/${slug}/sections/${selectedSection.id}/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newIndex + 1 })
      })
      toast.success('Lesson reordered')
    } catch (err) {
      console.error('Error reordering lesson:', err)
      toast.error('Failed to reorder lesson')
      setLessons(lessons)
    }
  }

  //eslint-disable-next-line 
  const handleLessonFormSubmit = async (data: { title: string; content: any; order: number }) => {
    if (!selectedSection) return

    try {
      if (editingLesson) {
        // Update existing lesson
        const res = await fetch(`/api/courses/${slug}/sections/${selectedSection.id}/lessons/${editingLesson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!res.ok) {
          throw new Error('Failed to update lesson')
        }

        const updated = await res.json()
        setLessons(prev => prev.map(l => l.id === editingLesson.id ? { ...l, ...updated } : l))
        toast.success('Lesson updated successfully')
      } else {
        // Create new lesson
        const res = await fetch(`/api/courses/${slug}/sections/${selectedSection.id}/lessons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!res.ok) {
          throw new Error('Failed to create lesson')
        }

        const created = await res.json()
        setLessons(prev => [...prev, created])
        setSections(prev => prev.map(s => 
          s.id === selectedSection.id 
            ? { ...s, lessonCount: s.lessonCount + 1 }
            : s
        ))
        toast.success('Lesson created successfully')
      }

      setLessonFormOpen(false)
      setEditingLesson(null)
    } catch (err) {
      console.error('Error saving lesson:', err)
      throw err
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error || 'Course not found'}</p>
          <Button
            onClick={() => router.push('/creator')}
            className="mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/creator')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-2">Manage course content, sections, and lessons</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sections Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Sections</h2>
              <Button onClick={handleCreateSection} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            <SectionList
              sections={sections}
              onCreateSection={handleCreateSection}
              onEditSection={handleEditSection}
              onDeleteSection={handleDeleteSection}
              onReorderSection={handleReorderSection}
            />
          </div>

          {/* Lessons Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {selectedSection ? `Lessons in "${selectedSection.title}"` : 'Lessons'}
              </h2>
              {selectedSection && (
                <Button onClick={handleCreateLesson} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              )}
            </div>

            {selectedSection ? (
              <LessonList
                sectionTitle={selectedSection.title}
                lessons={lessons}
                onCreateLesson={handleCreateLesson}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
                onReorderLesson={handleReorderLesson}
              />
            ) : (
              <div className="text-center text-gray-500 py-12">
                Select a section to view and manage lessons
              </div>
            )}
          </div>
        </div>

        {/* Section Form Dialog */}
        <Dialog open={sectionFormOpen} onOpenChange={setSectionFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSection ? 'Edit Section' : 'Create Section'}
              </DialogTitle>
            </DialogHeader>
            <SectionForm
              initialData={editingSection ? {
                title: editingSection.title,
                description: editingSection.description || '',
                order: editingSection.order
              } : undefined}
              onSubmit={handleSectionFormSubmit}
              onCancel={() => {
                setSectionFormOpen(false)
                setEditingSection(null)
              }}
              isEditing={!!editingSection}
            />
          </DialogContent>
        </Dialog>

        {/* Lesson Form Dialog */}
        <Dialog open={lessonFormOpen} onOpenChange={setLessonFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLesson ? 'Edit Lesson' : 'Create Lesson'}
              </DialogTitle>
            </DialogHeader>
            <LessonForm
              initialData={editingLesson || undefined}
              onSubmit={handleLessonFormSubmit}
              onCancel={() => {
                setLessonFormOpen(false)
                setEditingLesson(null)
              }}
              isEditing={!!editingLesson}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
