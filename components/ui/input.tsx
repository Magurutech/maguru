"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  inputSize?: "sm" | "md" | "lg"
  isAi?: boolean
  error?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      inputSize = "md",
      isAi = false,
      error = false,
      success = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    const finalType = isPassword ? (showPassword ? "text" : "password") : type

    // Tampilkan eye toggle otomatis untuk password input jika endIcon tidak didefinisikan
    const finalEndIcon = React.useMemo(() => {
      if (endIcon) return endIcon
      if (isPassword) {
        return (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="focus:outline-none hover:text-text-primary transition-colors text-text-muted/70 cursor-pointer p-0.5"
            aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )
      }
      return null
    }, [endIcon, isPassword, showPassword])

    return (
      <div
        className={cn(
          "input-container",
          isAi && "input-container-ai",
          error && "input-container-error",
          success && "input-container-success",
          disabled && "input-disabled",
          inputSize === "sm" && "input-size-sm",
          inputSize === "md" && "input-size-md",
          inputSize === "lg" && "input-size-lg",
          className
        )}
      >
        {startIcon && <div className="input-icon-start">{startIcon}</div>}
        <input
          ref={ref}
          type={finalType}
          data-slot="input"
          className="input-field"
          disabled={disabled}
          {...props}
        />
        {finalEndIcon && <div className="input-icon-end">{finalEndIcon}</div>}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
