'use client'

/**
 * Quick Actions Component
 *
 * Menampilkan daftar aksi cepat untuk navigasi dashboard.
 * Mengikuti Ancient Fantasy Asia design system.
 */

import Link from 'next/link'
import { ActionButton } from '@/features/creator/components/dashboard/ActionButton'
import type { QuickAction } from '../types'

interface QuickActionsProps {
  actions: QuickAction[]
}

/**
 * Quick Actions Component
 *
 * Menampilkan tombol aksi cepat dalam grid responsif.
 * Setiap tombol memiliki icon, label, dan warna tematik sesuai action.
 */
export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="glass-panel-light rounded-lg p-6">
      <h2 id="quick-actions-title" className="text-xl font-semibold text-beige-900 mb-4">
        Aksi Cepat
      </h2>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        role="list"
        aria-labelledby="quick-actions-title"
      >
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="hover-glow rounded-lg"
            role="listitem"
            aria-label={action.label}
          >
            <ActionButton
              icon={action.icon}
              label={action.label}
              variant="default"
              colorScheme={action.colorScheme || 'merah'}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
