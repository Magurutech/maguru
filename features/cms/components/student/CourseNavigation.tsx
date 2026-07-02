'use client'

import { memo, useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Folder,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

/**
 * CourseNavigation Component
 *
 * Sidebar navigation showing sections and lessons with progress indicators.
 * Wrapped with React.memo — re-renders only when sections/currentLessonId change.
 *
 * Requirements: 5.1, 5.2, 6.4
 * Task: 9.1, 17.3
 */

interface CourseNavigationProps {
  sections: Array<{
    id: string
    title: string
    lessons: Array<{
      id: string
      title: string
      completed: boolean
    }>
  }>
  currentLessonId: string
  onLessonClick: (lessonId: string) => void
}

export const CourseNavigation = memo(function CourseNavigation({
  sections,
  currentLessonId,
  onLessonClick,
}: CourseNavigationProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(sections.map((s) => s.id))
  )
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  return (
    <div
      className={`
        relative flex flex-col shrink-0 border-r border-border/10 bg-card z-10
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-72' : 'w-12'}
      `}
    >
      {/* Toggle button — always visible */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border/10 bg-card shadow-sm hover:bg-bg-surface-accent text-text-muted transition-colors"
        aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
        title={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
      >
        {sidebarOpen
          ? <PanelLeftClose className="h-3.5 w-3.5 text-text-muted" />
          : <PanelLeftOpen className="h-3.5 w-3.5 text-text-muted" />
        }
      </button>

      {/* Collapsed state — just icon */}
      {!sidebarOpen && (
        <div className="flex flex-col items-center pt-4 gap-3">
          <BookOpen className="h-4 w-4 text-accent-coral" />
        </div>
      )}

      {/* Expanded state */}
      {sidebarOpen && (
        <>
          {/* Header */}
          <div className="border-b border-border/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent-coral shrink-0" />
              <span className="text-[10px] font-manrope font-extrabold uppercase tracking-wider text-text-primary">Konten Kursus</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {sections.length === 0 && (
              <p className="text-xs text-text-faint px-3 py-6 text-center">
                Belum ada materi tersedia.
              </p>
            )}

            {sections.map((section) => {
              const isOpen = openSections.has(section.id)
              const completedCount = section.lessons.filter((l) => l.completed).length

              return (
                <Collapsible
                  key={section.id}
                  open={isOpen}
                  onOpenChange={() => toggleSection(section.id)}
                  data-testid={`nav-section-${section.id}`}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className="w-full flex items-center gap-1.5 px-2 py-2 rounded-lg text-left transition-colors hover:bg-bg-surface-accent/60 mb-0.5"
                      aria-expanded={isOpen}
                    >
                      {isOpen
                        ? <FolderOpen className="h-3.5 w-3.5 shrink-0 text-accent-coral/90" />
                        : <Folder className="h-3.5 w-3.5 shrink-0 text-text-faint" />
                      }
                      <span className="flex-1 text-sm font-semibold text-text-primary truncate">
                        {section.title}
                      </span>
                      <span className="text-xs text-text-muted shrink-0 mr-1">
                        {completedCount}/{section.lessons.length}
                      </span>
                      {isOpen
                        ? <ChevronDown className="h-3.5 w-3.5 text-text-faint shrink-0" />
                        : <ChevronRight className="h-3.5 w-3.5 text-text-faint shrink-0" />
                      }
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <ul className="ml-4 mb-1 border-l border-border/10 pl-2 space-y-0.5">
                      {section.lessons.map((lesson) => {
                        const isActive = currentLessonId === lesson.id

                        return (
                          <li key={lesson.id}>
                            <button
                              onClick={() => onLessonClick(lesson.id)}
                              aria-current={isActive ? 'page' : undefined}
                              data-testid={`nav-lesson-${lesson.id}`}
                              className={`
                                w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs
                                transition-colors cursor-pointer text-left
                                ${isActive
                                  ? 'bg-accent-coral/10 text-accent-coral font-bold'
                                  : 'text-text-secondary hover:bg-bg-surface-accent/60 hover:text-text-primary'
                                }
                              `}
                            >
                              {lesson.completed ? (
                                <Check
                                  className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-accent-coral' : 'text-success'}`}
                                  aria-label="Selesai"
                                  data-testid={`lesson-completed-${lesson.id}`}
                                />
                              ) : (
                                <span className={`h-3.5 w-3.5 shrink-0 rounded-full border ${isActive ? 'border-accent-coral' : 'border-border/15'}`} />
                              )}
                              <span className="flex-1 truncate">{lesson.title}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
})
