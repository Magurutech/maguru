import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ className, title, description, actionLabel, onAction, ...props }: EmptyStateProps) {
  return (
    <div className={cn("py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4", className)} {...props}>
      {/* Empty Icon Frame */}
      <div className="w-16 h-16 rounded-2xl bg-bg-bone flex items-center justify-center text-text-faint border border-text-faint/10 shadow-sm">
        <Search className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h4 className="text-body-lg font-manrope font-semibold text-text-primary">
          {title}
        </h4>
        <p className="text-caption text-text-muted">
          {description}
        </p>
      </div>

      {actionLabel && (
        <Button
          onClick={onAction}
          variant="default"
          className="flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-white" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
