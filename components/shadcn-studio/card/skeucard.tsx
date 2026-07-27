import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeuoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'paper' | 'coral' | 'peach' | 'gold' | 'olive' | 'ai-blue' | 'success' | 'debossed' | 'glass' | 'ancient'
  size?: 'small' | 'medium' | 'large'
  isTilt?: boolean
  interactive?: boolean
  titleText?: string
  descriptionText?: string
}

export function SkeuoCard({
  className,
  variant = 'paper',
  size = 'small',
  isTilt = false,
  interactive = false,
  titleText,
  descriptionText,
  children,
  ...props
}: SkeuoCardProps) {
  // Map size to Tailwind grid column span classes
  const sizeClasses = {
    small: "col-span-1",
    medium: "col-span-1 md:col-span-2",
    large: "col-span-1 md:col-span-3"
  }

  // Map variants to CSS utility classes defined in globals.css
  const variantClasses = {
    paper: "bg-bg-surface border border-text-faint/12 shadow-sm",
    coral: "coral-skeuo",
    peach: "peach-skeuo",
    gold: "gold-skeuo",
    olive: "olive-skeuo",
    'ai-blue': "ai-blue-skeuo",
    success: "success-skeuo",
    debossed: "debossed-skeuo",
    glass: "glass-panel",
    ancient: "card-ancient"
  }

  const cardBase = cn(
    "rounded-xl p-6 transition-all duration-300",
    variantClasses[variant],
    interactive && "btn-interactive",
    isTilt && "depth-card",
    className
  )

  const cardContent = (
    <div className={cn(isTilt && "depth-card-content")}>
      {(titleText || descriptionText) && (
        <div className="mb-4">
          {titleText && (
            <h3 className={cn(
              "text-h2 font-manrope mb-1 font-semibold",
              (variant === 'coral' || variant === 'ai-blue' || variant === 'olive' || variant === 'success') ? "text-white" : "text-text-primary"
            )}>
              {titleText}
            </h3>
          )}
          {descriptionText && (
            <p className={cn(
              "text-caption",
              (variant === 'coral' || variant === 'ai-blue' || variant === 'olive' || variant === 'success') ? "text-white/80" : "text-text-muted"
            )}>
              {descriptionText}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )

  if (isTilt) {
    return (
      <div className={cn("depth-card-container", sizeClasses[size])}>
        <div className={cardBase} {...props}>
          {cardContent}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(cardBase, sizeClasses[size])} {...props}>
      {cardContent}
    </div>
  )
}
