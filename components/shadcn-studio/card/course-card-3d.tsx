import * as React from "react"
import { cn } from "@/lib/utils"
import { SkeuoCard } from "./skeucard"
import { BookOpen } from "lucide-react"

export interface CourseCard3DProps {
  moduleCode: string
  moduleTitle: string
  levelLabel: string
  title: string
  description: string
  progressItems: number
  totalItems: number
}

export function CourseCard3D({
  moduleCode,
  moduleTitle,
  levelLabel,
  title,
  description,
  progressItems,
  totalItems
}: CourseCard3DProps) {
  const percent = Math.round((progressItems / totalItems) * 100)
  
  return (
    <SkeuoCard
      variant="ancient"
      size="large"
      titleText=""
      descriptionText=""
      isTilt={true}
      className="hover:shadow-glow"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 items-center">
        {/* Card Thumbnail */}
        <div className="rounded-xl h-40 bg-nature-blend flex flex-col justify-between p-4 relative overflow-hidden border border-text-faint/15">
          <div className="px-2 py-1 rounded bg-[#566B4D] text-white text-xs font-cinzel max-w-max font-bold tracking-widest shadow-sm">
            {moduleCode}
          </div>
          <div className="text-white relative z-10">
            <div className="text-caption font-cinzel tracking-widest opacity-85">COURSE MODULE</div>
            <div className="font-bold text-body-lg font-manrope">{moduleTitle}</div>
          </div>
        </div>

        {/* Card Content & Progress */}
        <div className="md:col-span-2 space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-caption font-bold text-accent-coral font-cinzel tracking-wider">{levelLabel}</span>
            <h4 className="text-h2 font-manrope font-semibold text-text-primary leading-tight">
              {title}
            </h4>
            <p className="text-caption text-text-secondary">
              {description}
            </p>
          </div>

          {/* Progress Bar Success */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-caption font-semibold">
              <span className="text-text-muted flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> {progressItems} dari {totalItems} Sub-Modul
              </span>
              <span className="text-success font-mono">{percent}% Mastered</span>
            </div>
            <div className="h-3 w-full bg-bg-surface-accent rounded-full overflow-hidden p-0.5 border border-text-faint/5 shadow-inner">
              <div className="h-full rounded-full success-skeuo" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </SkeuoCard>
  )
}
