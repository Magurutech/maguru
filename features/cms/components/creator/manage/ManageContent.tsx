import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useManageContext } from '../../../Context/creator/ManageContext'

export function ManageContent() {
  const { course, sections, lessonsMap, activeView, openEditLesson } = useManageContext()
  if (!course) return null

  const isPublished = course.status === 'PUBLISHED'

  if (activeView.type === 'overview') {
    return (
      <div className="max-w-2xl" data-testid="course-overview-panel">
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
    )
  }

  if (activeView.type === 'section') {
    const section = sections.find((s) => s.id === activeView.sectionId)
    if (!section) return null
    return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-beige-900 mb-2">{section.title}</h2>
        {section.description && <p className="text-beige-600 mb-6">{section.description}</p>}
        <p className="text-sm text-beige-500">{section.lessonCount} pelajaran dalam seksi ini.</p>
      </div>
    )
  }

  if (activeView.type === 'lesson') {
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
            onClick={() => openEditLesson(lesson, activeView.sectionId)}
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
  }

  return null
}
