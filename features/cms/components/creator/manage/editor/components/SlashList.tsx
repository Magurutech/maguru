'use client'

import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { LayoutGrid } from 'lucide-react'

interface SlashItem {
  title: string
  description?: string
  shortcut?: string
  command: (props: any) => void
  isMoreAction?: boolean
}

interface SlashListProps {
  items: SlashItem[]
  command: (item: any) => void
  // The More... action is passed separately so it stays sticky outside the scroll
  moreAction?: SlashItem
}

export const SlashList = forwardRef((props: SlashListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [prevItems, setPrevItems] = useState(props.items)

  // Separate regular items from the More... sentinel
  const regularItems = props.items.filter(i => !i.isMoreAction)
  const moreItem = props.items.find(i => i.isMoreAction) ?? props.moreAction

  if (props.items !== prevItems) {
    setPrevItems(props.items)
    setSelectedIndex(0)
  }

  const selectItem = (index: number) => {
    const item = regularItems[index]
    if (item) {
      props.command(item)
    }
  }

  const selectMore = () => {
    if (moreItem) {
      props.command(moreItem)
    }
  }

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + regularItems.length - 1) % regularItems.length)
        return true
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % regularItems.length)
        return true
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex)
        return true
      }

      return false
    },
  }))

  if (!regularItems.length && !moreItem) {
    return null
  }

  return (
    <div className="bg-card border border-border/10 rounded-2xl w-72 shadow-xl select-none paper-texture flex flex-col overflow-hidden">
      {/* Scrollable items — shows exactly 6 rows, ~40px each → 240px */}
      {regularItems.length > 0 && (
        <div className="flex flex-col space-y-0.5 p-2 overflow-y-auto max-h-[240px] scrollbar-thin scrollbar-thumb-border/20 scrollbar-track-transparent pr-1">
          {regularItems.map((item, index) => {
            const isSelected = index === selectedIndex
            return (
              <button
                key={item.title}
                onClick={() => selectItem(index)}
                className={`flex items-center justify-between text-left px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-150 border ${
                  isSelected
                    ? 'bg-accent-coral/10 border-accent-coral/30 text-text-primary shadow-xs'
                    : 'border-transparent text-text-secondary hover:bg-bg-bone/40 hover:border-border/30'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold font-manrope">{item.title}</span>
                  {item.description && (
                    <span className="text-[10px] text-text-faint/80 leading-normal truncate">{item.description}</span>
                  )}
                </div>
                {item.shortcut && (
                  <span className="text-[9px] text-text-faint/50 font-mono pl-3 shrink-0 uppercase">{item.shortcut}</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Sticky "More..." footer — always visible, never scrolls away */}
      {moreItem && (
        <div className="border-t border-border/10 px-2 py-1.5">
          <button
            onClick={selectMore}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-150 border border-transparent text-text-secondary hover:bg-accent-coral/8 hover:border-accent-coral/20 hover:text-accent-coral group"
          >
            <LayoutGrid className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold font-manrope">Browse all tools</span>
              <span className="text-[10px] text-text-faint/70 leading-normal">See all available blocks</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
})

SlashList.displayName = 'SlashList'
