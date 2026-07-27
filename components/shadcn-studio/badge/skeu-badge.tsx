import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeuBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'success' | 'stable' | 'coral'
}

export function SkeuBadge({ className, variant = 'gold', children, ...props }: SkeuBadgeProps) {
  const variantClasses = {
    gold: "gold-skeuo text-text-primary",
    success: "success-skeuo text-white",
    stable: "bg-bg-bone border border-text-faint/10 text-text-primary shadow-sm",
    coral: "coral-skeuo text-white"
  }
  
  return (
    <span
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-bold font-mono flex items-center gap-1 shadow-sm",
        (variant === 'gold' || variant === 'success') && "font-cinzel tracking-widest",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
