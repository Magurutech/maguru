'use client'

import { memo } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * LessonNavigation Component
 *
 * Previous/Next navigation buttons for lessons with central completion action.
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
      className="flex items-center justify-between gap-4 pt-6 border-t border-border/10 flex-wrap sm:flex-nowrap"
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
          <span className="text-sm font-semibold truncate max-w-[140px] sm:max-w-[200px]">{previousLesson.title}</span>
        </Button>
      ) : (
        <div className="w-10" /> /* spacer so Next stays right when no Prev */
      )}

      {/* Dedicated Mark Complete Toggle Button */}
      {onMarkComplete && (
        <Button
          type="button"
          variant="outline"
          onClick={onMarkComplete}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold font-sans transition-all cursor-pointer shadow-xs ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
              : 'border-border/20 text-text-secondary hover:bg-bg-surface-accent hover:border-accent-coral/30'
          }`}
          data-testid="mark-complete-btn"
          aria-label={isCompleted ? 'Pelajaran sudah selesai' : 'Tandai pelajaran sebagai selesai'}
        >
          <Check className={`h-4 w-4 shrink-0 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-muted'}`} />
          <span>{isCompleted ? 'Selesai Dipelajari' : 'Tandai Selesai'}</span>
        </Button>
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
          <span className="text-sm font-semibold truncate max-w-[140px] sm:max-w-[200px]">
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
          <span className="text-sm font-semibold truncate max-w-[140px] sm:max-w-[200px]">{nextLesson.title}</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
        </Button>
      ) : (
        <div className="w-10 ml-auto" /> /* spacer */
      )}
    </nav>
  )

})
