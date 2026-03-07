'use client'

/**
 * Dashboard Layout Component
 *
 * Wrapper component untuk dashboard dengan Ancient Fantasy Asia theming.
 * Menyediakan struktur layout dan glass-panel effects.
 */

import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
  role: 'user' | 'creator' | 'admin'
}

/**
 * Dashboard Layout Component
 *
 * Menyediakan layout dashboard dengan background gradient dan glass-panel styling.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-ancient-fantasy">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {children}
      </div>
    </div>
  )
}
