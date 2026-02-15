'use client'

/**
 * Stats Grid Component
 *
 * Grid responsif untuk menampilkan kartu statistik dashboard.
 * Mengikuti Ancient Fantasy Asia design system.
 */

import { StatsCard } from '@/features/creator/components/dashboard/StatsCard'
import { getStaggerDelay } from '../utils'
import type { StatCard } from '../types'

interface StatsGridProps {
  stats: StatCard[]
}

/**
 * Stats Grid Component
 *
 * Menampilkan statistik dalam grid responsif dengan animasi stagger.
 * - Mobile: 1 kolom
 * - Tablet: 2 kolom
 * - Desktop: 4 kolom
 */
export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      role="list"
      aria-label="Statistik dashboard"
    >
      {stats.map((stat, index) => (
        <div
          key={`${stat.title}-${index}`}
          style={{ animationDelay: getStaggerDelay(index) }}
          className="animate-fade-in"
          role="listitem"
        >
          <StatsCard
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            iconColor={stat.iconColor}
          />
        </div>
      ))}
    </div>
  )
}
