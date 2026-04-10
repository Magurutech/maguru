'use client'

/**
 * ProgressBar Component
 *
 * Visual progress indicator for course completion.
 * Uses Maguru design tokens (beige/kuning/hijau palette).
 *
 * Requirements: 7.1, 7.5
 * Task: 9.2
 */

interface ProgressBarProps {
  percentage: number
  completedLessons: number
  totalLessons: number
}

export function ProgressBar({
  percentage,
  completedLessons,
  totalLessons,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(percentage, 0), 100)

  // Pick fill color based on progress milestone
  const fillColor =
    clamped >= 100
      ? 'bg-[var(--color-hijau-500)]'
      : clamped >= 50
        ? 'bg-[var(--color-kuning-500)]'
        : 'bg-[var(--color-merah-500)]'

  return (
    <div
      className="flex items-center gap-4 w-full"
      role="region"
      aria-label="Course progress"
      data-testid="progress-bar-container"
    >
      {/* Label */}
      <span
        className="shrink-0 text-sm font-medium text-beige-800 whitespace-nowrap"
        data-testid="progress-count"
      >
        {completedLessons} / {totalLessons} pelajaran selesai
      </span>

      {/* Track */}
      <div
        className="flex-1 h-2.5 rounded-full bg-beige-200 overflow-hidden"
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
        className="shrink-0 text-sm font-semibold text-(--color-beige-900) tabular-nums"
        aria-live="polite"
        data-testid="progress-percentage"
      >
        {clamped.toFixed(0)}%
      </span>
    </div>
  )
}
