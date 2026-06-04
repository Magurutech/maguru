'use client'

import { CourseOverview } from './panels/CourseOverview'
import { LessonEditorPanel } from './panels/LessonEditorPanel'
import { LessonViewerPanel } from './panels/LessonViewerPanel'
import { useManageContext } from '@/features/cms/Context/creator/ManageContext'

// ── Main export ────────────────────────────────────────────────────────────

export function ManageContent() {
  const { course, sections, activeView } = useManageContext()
  if (!course) return null

  if (activeView.type === 'overview') return <CourseOverview />

  if (activeView.type === 'lesson-editor') {
    return <LessonEditorPanel sectionId={activeView.sectionId} lessonId={activeView.lessonId} />
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
    return <LessonViewerPanel sectionId={activeView.sectionId} lessonId={activeView.lessonId} />
  }

  return null
}
