import * as React from "react"
import { cn } from "@/lib/utils"
import { Input, type InputProps } from "@/components/ui/input"

export interface SkeuInputProps extends InputProps {
  label?: string
  helperText?: string
  state?: 'default' | 'active' | 'error' | 'success'
}

export const SkeuInput = React.forwardRef<HTMLInputElement, SkeuInputProps>(
  ({ className, state = 'default', label, helperText, error, success, ...props }, ref) => {
    const isError = state === 'error' || error
    const isSuccess = state === 'success' || success

    return (
      <div className="space-y-1.5 w-full text-left">
        {label && (
          <label className="text-[11px] font-mono tracking-wider font-semibold text-text-primary block uppercase">
            {label}
          </label>
        )}
        <Input
          ref={ref}
          error={isError}
          success={isSuccess}
          className={cn(
            state === 'active' && "input-container-focus",
            className
          )}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              "text-[10px] font-mono mt-1 block",
              isError && "text-accent-coral",
              isSuccess && "text-success",
              !isError && !isSuccess && "text-text-muted"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

SkeuInput.displayName = "SkeuInput"
