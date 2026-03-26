import { UserRoleProvider } from '@/features/auth'
import type { ReactNode } from 'react'

/**
 * Manage layout — full-screen editor mode.
 * Covers the creator sidebar by rendering fixed full-screen,
 * giving the manage page its own isolated workspace (Notion/Figma-style).
 */
export default function ManageLayout({ children }: { children: ReactNode }) {
  return (
    <UserRoleProvider>
      <div className="fixed inset-0 z-50 bg-beige-50">
        {children}
      </div>
    </UserRoleProvider>
  )
}
