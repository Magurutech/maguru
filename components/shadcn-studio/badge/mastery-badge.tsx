import * as React from "react"
import { cn } from "@/lib/utils"
import { GraduationCap } from "lucide-react"

export interface MasteryBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  chapter?: string
  title: string
  description: string
}

export function MasteryBadge({ className, chapter, title, description, ...props }: MasteryBadgeProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-bg-bone border border-text-faint/10 shadow-sm w-full",
        className
      )}
      {...props}
    >
      {/* Medal Visual */}
      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center rounded-full gold-skeuo shadow-sm border border-text-faint/10">
        <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#3E5237]/30 flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-[#3E5237]" />
        </div>
      </div>

      {/* Badge Content */}
      <div className="text-center sm:text-left space-y-1">
        {chapter && <div className="text-roman font-cinzel text-accent-coral tracking-widest">{chapter}</div>}
        <h4 className="text-body-lg font-manrope font-bold text-text-primary">{title}</h4>
        <p className="text-caption text-text-muted">{description}</p>
      </div>
    </div>
  )
}
