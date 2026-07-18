import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: 'default' | 'active' | 'error'
  label?: string
  helperText?: string
}

export const SkeuInput = React.forwardRef<HTMLInputElement, SkeuInputProps>(
  ({ className, state = 'default', label, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full text-left">
        {label && <label className="text-caption font-semibold text-text-primary block">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 rounded-xl text-body-md neu-input transition-all duration-200 outline-none",
            state === 'active' && "shadow-neu ring-2 ring-accent-coral",
            state === 'error' && "border-error ring-1 ring-error/30",
            className
          )}
          {...props}
        />
        {helperText && (
          <p className={cn(
            "text-[10px] mt-1 flex items-center gap-0.5",
            state === 'error' ? "text-error" : "text-text-muted"
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
SkeuInput.displayName = "SkeuInput"
