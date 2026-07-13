'use client'

import { CourseOverview } from './panels/CourseOverview'
import { LessonEditorPanel } from './panels/LessonEditorPanel'
import { LessonViewerPanel } from './panels/LessonViewerPanel'
import { QuizEditorPanel } from './panels/QuizEditorPanel'
import { useManageContext } from '@/features/cms/Context/creator/ManageContext'

// ── Main export ────────────────────────────────────────────────────────────

export function ManageContent() {
  const { course, sections, activeView } = useManageContext()
  if (!course) return null

  // Lesson editor: full-width (toolbar breaks out), then padded content
  if (activeView.type === 'lesson-editor') {
    return <LessonEditorPanel sectionId={activeView.sectionId} lessonId={activeView.lessonId} />
  }

  // Quiz editor: custom dashboard panel
  if (activeView.type === 'quiz-editor') {
    return <QuizEditorPanel quizType={activeView.quizType} sectionId={activeView.sectionId} />
  }

  // All other views: standard editorial padding + max-width container
  return (
    <div className="px-8 md:px-12 py-8 max-w-4xl mx-auto">
      {activeView.type === 'overview' && <CourseOverview />}

      {activeView.type === 'section' && (() => {
        const section = sections.find((s) => s.id === activeView.sectionId)
        if (!section) return null
        return (
          <div className="max-w-2xl bg-card border border-border/10 rounded-3xl p-8 paper-texture select-none space-y-4">
            <span className="text-[10px] font-bold text-accent-coral uppercase tracking-widest leading-none block">MODUL KURSUS</span>
            <h2 className="text-2xl font-bold text-text-primary leading-tight">{section.title}</h2>
            {section.description && <p className="text-text-secondary text-xs leading-relaxed">{section.description}</p>}
            <div className="h-px w-full bg-border/5" />
            <p className="text-xs font-semibold text-text-muted">{section.lessonCount} Pelajaran terdaftar dalam seksi ini.</p>
          </div>
        )
      })()}

      {activeView.type === 'lesson' && (
        <LessonViewerPanel sectionId={activeView.sectionId} lessonId={activeView.lessonId} />
      )}
    </div>
  )
}
