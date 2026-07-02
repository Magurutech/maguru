import { UserRoleProvider } from '@/features/auth'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { ReactNode } from 'react'

export default function ManageLayout({ children }: { children: ReactNode }) {
  return (
    <UserRoleProvider>
      <TooltipProvider>
        <div className="fixed inset-0 z-50 bg-background">
          {children}
        </div>
      </TooltipProvider>
    </UserRoleProvider>
  )
}
