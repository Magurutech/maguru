'use client'

import { memo } from 'react'

/**
 * ProgressBar Component
 *
 * Visual progress indicator for course completion.
 * Uses Maguru design tokens (beige/kuning/hijau palette).
 * Wrapped with React.memo — pure component, re-renders only when props change.
 *
 * Requirements: 7.1, 7.5
 * Task: 9.2, 17.3
 */

interface ProgressBarProps {
  percentage: number
  completedLessons: number
  totalLessons: number
}

export const ProgressBar = memo(function ProgressBar({
  percentage,
  completedLessons,
  totalLessons,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(percentage, 0), 100)

  // Pick fill color based on progress milestone
  const fillColor =
    clamped >= 100
      ? 'bg-success'
      : clamped >= 50
        ? 'bg-accent-mustard'
        : 'bg-accent-coral'

  return (
    <div
      className="flex items-center gap-4 w-full"
      role="region"
      aria-label="Course progress"
      data-testid="progress-bar-container"
    >
      {/* Label */}
      <span
        className="shrink-0 text-xs font-bold text-text-muted uppercase tracking-wider whitespace-nowrap font-sans"
        data-testid="progress-count"
      >
        {completedLessons} / {totalLessons} pelajaran selesai
      </span>

      {/* Track */}
      <div
        className="flex-1 h-2.5 rounded-full bg-bg-surface-accent overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progres kursus: ${clamped.toFixed(0)}%`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-(--transition-maguru) ${fillColor}`}
          style={{ width: `${clamped}%` }}
          aria-hidden="true"
          data-testid="progress-bar-fill"
        />
      </div>

      {/* Percentage badge */}
      <span
        className="shrink-0 text-sm font-black text-text-primary tabular-nums font-manrope"
        aria-live="polite"
        data-testid="progress-percentage"
      >
        {clamped.toFixed(0)}%
      </span>
    </div>
  )

})
