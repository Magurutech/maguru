'use client'

/**
 * Dashboard Header Component
 *
 * Menampilkan header dashboard dengan greeting dan role badge.
 * Mengikuti Ancient Fantasy Asia design system.
 */

import { Shield, User, Palette } from 'lucide-react'
import { getDashboardTitle, getRoleIconColor, getThemeColorClass } from '../utils'

interface DashboardHeaderProps {
  userName: string
  role: 'user' | 'creator' | 'admin'
}

const roleIcons = {
  user: User,
  creator: Palette,
  admin: Shield,
}

const roleLabels = {
  user: 'Learner',
  creator: 'Creator',
  admin: 'Admin',
}

/**
 * Dashboard Header Component
 *
 * Menampilkan judul dashboard berdasarkan role, greeting untuk user,
 * dan badge role dengan warna tematik.
 */
export function DashboardHeader({ userName, role }: DashboardHeaderProps) {
  const RoleIcon = roleIcons[role]
  const iconColor = getRoleIconColor(role)
  const colors = getThemeColorClass(iconColor)
  const title = getDashboardTitle(role)

  // Extract first name from full name
  const firstName = userName.split(' ')[0] || userName

  return (
    <div className="glass-panel-light rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 id="dashboard-title" className="text-2xl font-bold text-beige-900">
            {title}
          </h1>
          <p className="text-beige-700">Halo, {firstName}</p>
        </div>

        <div
          className={`flex items-center gap-2 ${colors.bg} px-4 py-2 rounded-lg`}
          role="status"
          aria-label={`Role: ${roleLabels[role]}`}
        >
          <RoleIcon className={`w-5 h-5 ${colors.text}`} aria-hidden="true" />
          <span className={`font-medium ${colors.text}`}>
            {roleLabels[role]}
          </span>
        </div>
      </div>
    </div>
  )
}
