'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * LessonNavigation Component
 *
 * Previous/Next navigation buttons for lessons.
 * Previous anchored left, Next anchored right (justify-between).
 *
 * Requirements: 5.7, 5.8, 5.9
 * Task: 9.3
 */

interface LessonNavigationProps {
  previousLesson?: { id: string; title: string }
  nextLesson?: { id: string; title: string }
  onNavigate: (lessonId: string) => void
  onMarkComplete?: () => Promise<void>
  isCompleted?: boolean
}

export function LessonNavigation({
  previousLesson,
  nextLesson,
  onNavigate,
  onMarkComplete,
  isCompleted,
}: LessonNavigationProps) {
  const handleNext = async (lessonId: string) => {
    // Auto mark current lesson complete when navigating forward
    if (onMarkComplete && !isCompleted) {
      await onMarkComplete()
    }
    onNavigate(lessonId)
  }
  return (
    <nav
      className="flex items-center justify-between gap-4 pt-6 border-t border-beige-200"
      aria-label="Navigasi pelajaran"
    >
      {/* Previous */}
      {previousLesson ? (
        <Button
          variant="outline"
          onClick={() => onNavigate(previousLesson.id)}
          className="flex items-center gap-2 border-beige-300 text-beige-700 hover:bg-beige-100 max-w-[45%]"
          aria-label={`Pelajaran sebelumnya: ${previousLesson.title}`}
          data-testid="prev-lesson-btn"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium truncate">{previousLesson.title}</span>
        </Button>
      ) : (
        <div /> /* spacer so Next stays right when no Prev */
      )}

      {/* Next */}
      {nextLesson ? (
        <Button
          variant="outline"
          onClick={() => handleNext(nextLesson.id)}
          className="flex items-center gap-2 border-beige-300 text-beige-700 hover:bg-beige-100 max-w-[45%] ml-auto"
          aria-label={`Pelajaran berikutnya: ${nextLesson.title}`}
          data-testid="next-lesson-btn"
        >
          <span className="text-sm font-medium truncate">{nextLesson.title}</span>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Button>
      ) : (
        <div className="ml-auto" /> /* spacer */
      )}
    </nav>
  )
}
