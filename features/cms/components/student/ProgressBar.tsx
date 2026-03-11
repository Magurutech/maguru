'use client'

/**
 * ProgressBar Component
 * 
 * Visual progress indicator for course completion.
 * Displays completion percentage and lesson count.
 * 
 * Requirements: 7.1, 7.5
 * Task: 9.2
 * 
 * @param percentage - Completion percentage (0-100)
 * @param completedLessons - Number of completed lessons
 * @param totalLessons - Total number of lessons in course
 */

interface ProgressBarProps {
  percentage: number        // 0-100
  completedLessons: number
  totalLessons: number
}

export function ProgressBar({ percentage, completedLessons, totalLessons }: ProgressBarProps) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
  
  return (
    <div className="progress-bar-container" role="region" aria-label="Course progress">
      <div className="progress-info">
        <span className="progress-text">
          {completedLessons} / {totalLessons} lessons completed
        </span>
        <span className="progress-percentage" aria-live="polite">
          {clampedPercentage.toFixed(0)}%
        </span>
      </div>
      <div 
        className="progress-bar" 
        role="progressbar" 
        aria-valuenow={clampedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Course completion: ${clampedPercentage.toFixed(0)}%`}
      >
        <div 
          className="progress-fill" 
          style={{ width: `${clampedPercentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
