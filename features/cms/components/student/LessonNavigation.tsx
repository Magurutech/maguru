'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * LessonNavigation Component
 * 
 * Previous/Next navigation buttons for lessons.
 * Disables buttons at course boundaries.
 * 
 * Requirements: 5.7, 5.8, 5.9
 * Task: 9.3
 * 
 * @param previousLesson - Previous lesson data (undefined if first lesson)
 * @param nextLesson - Next lesson data (undefined if last lesson)
 * @param onNavigate - Callback when navigation button is clicked
 */

interface LessonNavigationProps {
  previousLesson?: { id: string; title: string }
  nextLesson?: { id: string; title: string }
  onNavigate: (lessonId: string) => void
}

export function LessonNavigation({ 
  previousLesson, 
  nextLesson, 
  onNavigate 
}: LessonNavigationProps) {
  return (
    <nav className="lesson-navigation" aria-label="Lesson navigation">
      <div className="navigation-buttons">
        {previousLesson ? (
          <Button
            variant="outline"
            onClick={() => onNavigate(previousLesson.id)}
            className="previous-button"
            aria-label={`Previous lesson: ${previousLesson.title}`}
            data-testid="prev-lesson-btn"
          >
            <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            <span className="button-text">
              <span className="button-label">Previous</span>
              <span className="button-title">{previousLesson.title}</span>
            </span>
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled
            className="previous-button"
            aria-label="No previous lesson"
            data-testid="prev-lesson-btn"
          >
            <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            <span className="button-text">
              <span className="button-label">Previous</span>
            </span>
          </Button>
        )}

        {nextLesson ? (
          <Button
            variant="outline"
            onClick={() => onNavigate(nextLesson.id)}
            className="next-button"
            aria-label={`Next lesson: ${nextLesson.title}`}
            data-testid="next-lesson-btn"
          >
            <span className="button-text">
              <span className="button-label">Next</span>
              <span className="button-title">{nextLesson.title}</span>
            </span>
            <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled
            className="next-button"
            aria-label="No next lesson"
            data-testid="next-lesson-btn"
          >
            <span className="button-text">
              <span className="button-label">Next</span>
            </span>
            <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
          </Button>
        )}
      </div>
    </nav>
  )
}
