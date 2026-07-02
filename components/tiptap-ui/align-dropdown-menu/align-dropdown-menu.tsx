"use client"

import { forwardRef, useCallback, useState } from "react"
import { type Editor } from "@tiptap/react"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { AlignLeftIcon } from "@/components/tiptap-icons/align-left-icon"
import { AlignCenterIcon } from "@/components/tiptap-icons/align-center-icon"
import { AlignRightIcon } from "@/components/tiptap-icons/align-right-icon"
import { AlignJustifyIcon } from "@/components/tiptap-icons/align-justify-icon"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface AlignDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor
  modal?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export const AlignDropdownMenu = forwardRef<
  HTMLButtonElement,
  AlignDropdownMenuProps
>(
  (
    {
      editor: providedEditor,
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

    if (!editor) return null

    const getActiveIcon = () => {
      if (editor.isActive({ textAlign: "center" })) return AlignCenterIcon
      if (editor.isActive({ textAlign: "right" })) return AlignRightIcon
      if (editor.isActive({ textAlign: "justify" })) return AlignJustifyIcon
      return AlignLeftIcon
    }

    const ActiveIcon = getActiveIcon()

    const isLeftActive = editor.isActive({ textAlign: "left" }) || 
      (!editor.isActive({ textAlign: "center" }) && 
       !editor.isActive({ textAlign: "right" }) && 
       !editor.isActive({ textAlign: "justify" }))

    return (
      <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            role="button"
            tabIndex={-1}
            tooltip="Text alignment"
            className="flex items-center gap-0.5 px-2 py-1 text-text-secondary hover:text-text-primary transition-colors"
            {...buttonProps}
            ref={ref}
          >
            <ActiveIcon className="tiptap-button-icon h-4 w-4" />
            <ChevronDownIcon className="tiptap-button-dropdown-small opacity-70" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="min-w-[200px] z-50">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                isLeftActive && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <AlignLeftIcon className="h-4 w-4" />
                <span>Align left</span>
              </div>
              <DropdownMenuShortcut>Ctrl+Shift+L</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                editor.isActive({ textAlign: "center" }) && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <AlignCenterIcon className="h-4 w-4" />
                <span>Align center</span>
              </div>
              <DropdownMenuShortcut>Ctrl+Alt+E</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                editor.isActive({ textAlign: "right" }) && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <AlignRightIcon className="h-4 w-4" />
                <span>Align right</span>
              </div>
              <DropdownMenuShortcut>Ctrl+Alt+T</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                editor.isActive({ textAlign: "justify" }) && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <AlignJustifyIcon className="h-4 w-4" />
                <span>Justify</span>
              </div>
              <DropdownMenuShortcut>Ctrl+Shift+J</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

AlignDropdownMenu.displayName = "AlignDropdownMenu"

export default AlignDropdownMenu
