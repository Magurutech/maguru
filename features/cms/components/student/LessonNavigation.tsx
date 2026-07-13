'use client'

import { memo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * LessonNavigation Component
 *
 * Previous/Next navigation buttons for lessons.
 * Wrapped with React.memo — pure component, re-renders only when props change.
 *
 * Requirements: 5.7, 5.8, 5.9
 * Task: 9.3, 17.3
 */

interface LessonNavigationProps {
  previousLesson?: { id: string; title: string }
  nextLesson?: { id: string; title: string }
  onNavigate: (lessonId: string) => void
  onMarkComplete?: () => Promise<void>
  isCompleted?: boolean
  onTakeQuiz?: () => void
  quizSectionTitle?: string
}

export const LessonNavigation = memo(function LessonNavigation({
  previousLesson,
  nextLesson,
  onNavigate,
  onMarkComplete,
  isCompleted,
  onTakeQuiz,
  quizSectionTitle,
}: LessonNavigationProps) {
  const handleNext = async (lessonId: string) => {
    // Auto mark current lesson complete when navigating forward
    if (onMarkComplete && !isCompleted) {
      await onMarkComplete()
    }
    onNavigate(lessonId)
  }

  const handleTakeQuiz = async () => {
    if (onMarkComplete && !isCompleted) {
      await onMarkComplete()
    }
    if (onTakeQuiz) {
      onTakeQuiz()
    }
  }

  return (
    <nav
      className="flex items-center justify-between gap-4 pt-6 border-t border-border/10"
      aria-label="Navigasi pelajaran"
    >
      {/* Previous */}
      {previousLesson ? (
        <Button
          variant="outline"
          onClick={() => onNavigate(previousLesson.id)}
          className="flex items-center gap-2 border-border/15 text-text-secondary hover:bg-bg-surface-accent rounded-full px-5 py-2 text-xs font-bold font-sans cursor-pointer transition-all"
          aria-label={`Pelajaran sebelumnya: ${previousLesson.title}`}
          data-testid="prev-lesson-btn"
        >
          <ChevronLeft className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
          <span className="text-sm font-semibold truncate">{previousLesson.title}</span>
        </Button>
      ) : (
        <div /> /* spacer so Next stays right when no Prev */
      )}

      {/* Next / Take Quiz */}
      {onTakeQuiz ? (
        <Button
          variant="default"
          onClick={handleTakeQuiz}
          className="flex items-center gap-2 bg-accent-coral hover:bg-accent-coral/95 text-white rounded-full px-5 py-2 text-xs font-bold shadow-glow ml-auto cursor-pointer transition-all border border-transparent"
          aria-label="Ambil Kuis Section"
          data-testid="take-quiz-btn"
        >
          <span className="text-sm font-semibold truncate">
            Ambil Kuis {quizSectionTitle || 'Section'}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
        </Button>
      ) : nextLesson ? (
        <Button
          variant="default"
          onClick={() => handleNext(nextLesson.id)}
          className="flex items-center gap-2 bg-accent-coral hover:bg-accent-coral/95 text-white rounded-full px-5 py-2 text-xs font-bold shadow-glow ml-auto cursor-pointer transition-all border border-transparent"
          aria-label={`Pelajaran berikutnya: ${nextLesson.title}`}
          data-testid="next-lesson-btn"
        >
          <span className="text-sm font-semibold truncate">{nextLesson.title}</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
        </Button>
      ) : (
        <div className="ml-auto" /> /* spacer */
      )}
    </nav>
  )

})
