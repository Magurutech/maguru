"use client"

import { useState } from "react"
import { cn } from "@/lib/tiptap-utils"

interface TableGridPickerProps {
  onSelect: (rows: number, cols: number) => void
}

export function TableGridPicker({ onSelect }: TableGridPickerProps) {
  const [hovered, setHovered] = useState<{ rows: number; cols: number }>({
    rows: 0,
    cols: 0,
  })

  const maxRows = 5
  const maxCols = 10

  const handleMouseEnter = (row: number, col: number) => {
    setHovered({ rows: row, cols: col })
  }

  const handleMouseLeave = () => {
    setHovered({ rows: 0, cols: 0 })
  }

  const handleClick = () => {
    if (hovered.rows > 0 && hovered.cols > 0) {
      onSelect(hovered.rows, hovered.cols)
    }
  }

  return (
    <div className="flex flex-col items-center p-2.5 bg-white border border-border/10 rounded-md shadow-sm select-none">
      <div 
        className="grid gap-1" 
        style={{ gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))` }}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxRows }).map((_, rIndex) => {
          const row = rIndex + 1
          return Array.from({ length: maxCols }).map((_, cIndex) => {
            const col = cIndex + 1
            const isHighlighted = row <= hovered.rows && col <= hovered.cols
            return (
              <button
                key={`cell-${row}-${col}`}
                type="button"
                className={cn(
                  "w-4 h-4 rounded-sm border transition-colors cursor-pointer focus:outline-none",
                  isHighlighted 
                    ? "bg-primary border-primary" 
                    : "bg-bg-bone/40 border-border/20 hover:border-border"
                )}
                onMouseEnter={() => handleMouseEnter(row, col)}
                onClick={handleClick}
                aria-label={`Insert ${row}x${col} table`}
              />
            )
          })
        })}
      </div>
      <div className="mt-2 text-xs font-semibold text-text-secondary">
        {hovered.rows > 0 && hovered.cols > 0 ? (
          <span>{hovered.cols} × {hovered.rows} Table</span>
        ) : (
          <span className="text-text-muted">Pilih ukuran tabel</span>
        )}
      </div>
    </div>
  )
}
