"use client"

import { forwardRef, useCallback, useState } from "react"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Tiptap UI ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface HeadingDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: any
  levels?: number[]
  modal?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export const HeadingDropdownMenu = forwardRef<
  HTMLButtonElement,
  HeadingDropdownMenuProps
>(
  (
    {
      editor: providedEditor,
      levels,
      onOpenChange,
      modal = true,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (!editor) return
        setIsOpen(open)
        onOpenChange?.(open)
      },
      [editor, onOpenChange]
    )

    const getActiveLabel = () => {
      if (!editor) return "Normal text"
      if (editor.isActive("heading", { level: 1 })) return "Heading 1"
      if (editor.isActive("heading", { level: 2 })) return "Heading 2"
      if (editor.isActive("heading", { level: 3 })) return "Heading 3"
      if (editor.isActive("heading", { level: 4 })) return "Heading 4"
      if (editor.isActive("heading", { level: 5 })) return "Heading 5"
      if (editor.isActive("heading", { level: 6 })) return "Heading 6"
      if (editor.isActive("small")) return "Small text"
      if (editor.isActive("blockquote")) return "Quote"
      return "Normal text"
    }

    if (!editor) return null

    const activeLabel = getActiveLabel()

    return (
      <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            role="button"
            tabIndex={-1}
            tooltip="Heading & Style"
            className="flex items-center gap-1.5 px-2.5 py-1 text-text-secondary hover:text-text-primary transition-colors"
            {...buttonProps}
            ref={ref}
          >
            <span className="text-xs font-bold min-w-[70px] text-left select-none">
              {activeLabel}
            </span>
            <ChevronDownIcon className="tiptap-button-dropdown-small ml-0.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="min-w-[200px] z-50">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().setParagraph().unsetMark("small").run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                activeLabel === "Normal text" && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <span className="text-sm font-normal">Normal text</span>
              <DropdownMenuShortcut>Ctrl+Alt+0</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().toggleMark("small").run()}
              className={cn(
                "flex justify-between items-center text-xs cursor-pointer",
                activeLabel === "Small text" && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <span className="text-xs font-light text-text-secondary">Small text</span>
              <DropdownMenuShortcut>Ctrl+Alt+7</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn(
                "flex justify-between items-center cursor-pointer",
                activeLabel === "Heading 1" && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <span className="text-lg font-bold">Heading 1</span>
              <DropdownMenuShortcut>Ctrl+Alt+1</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn(
                "flex justify-between items-center cursor-pointer",
                activeLabel === "Heading 2" && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <span className="text-base font-bold">Heading 2</span>
              <DropdownMenuShortcut>Ctrl+Alt+2</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              className={cn(
                "flex justify-between items-center cursor-pointer",
                activeLabel === "Heading 3" && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <span className="text-sm font-bold">Heading 3</span>
              <DropdownMenuShortcut>Ctrl+Alt+3</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
              className={cn(
                "flex justify-between items-center cursor-pointer",
                activeLabel === "Heading 4" && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <span className="text-xs font-bold text-text-primary">Heading 4</span>
              <DropdownMenuShortcut>Ctrl+Alt+4</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}
              className={cn(
                "flex justify-between items-center cursor-pointer",
                activeLabel === "Heading 5" && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <span className="text-[11px] font-bold text-text-secondary">Heading 5</span>
              <DropdownMenuShortcut>Ctrl+Alt+5</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()}
              className={cn(
                "flex justify-between items-center cursor-pointer",
                activeLabel === "Heading 6" && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <span className="text-[10px] font-bold text-text-muted">Heading 6</span>
              <DropdownMenuShortcut>Ctrl+Alt+6</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={cn(
                "flex justify-between items-center cursor-pointer",
                activeLabel === "Quote" && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <span className="text-sm italic pl-1 border-l-2 border-border/40">Quote</span>
              <DropdownMenuShortcut>Ctrl+Shift+9</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

HeadingDropdownMenu.displayName = "HeadingDropdownMenu"

export default HeadingDropdownMenu

