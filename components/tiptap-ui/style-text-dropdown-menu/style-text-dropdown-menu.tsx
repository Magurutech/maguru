"use client"

import { forwardRef, useCallback, useState } from "react"
import { type Editor } from "@tiptap/react"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { BoldIcon } from "@/components/tiptap-icons/bold-icon"
import { ItalicIcon } from "@/components/tiptap-icons/italic-icon"
import { UnderlineIcon } from "@/components/tiptap-icons/underline-icon"
import { StrikeIcon } from "@/components/tiptap-icons/strike-icon"
import { Code2Icon } from "@/components/tiptap-icons/code2-icon"
import { SubscriptIcon } from "@/components/tiptap-icons/subscript-icon"
import { SuperscriptIcon } from "@/components/tiptap-icons/superscript-icon"
import { BanIcon } from "@/components/tiptap-icons/ban-icon"

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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface StyleTextDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor
  modal?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export const StyleTextDropdownMenu = forwardRef<
  HTMLButtonElement,
  StyleTextDropdownMenuProps
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

    // Clear formatting command (YAGNI/Ponytail style)
    const clearFormatting = () => {
      editor.chain().focus().unsetAllMarks().clearNodes().run()
    }

    return (
      <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            role="button"
            tabIndex={-1}
            tooltip="Text style"
            className="flex items-center gap-0.5 px-2 py-1 text-text-secondary hover:text-text-primary transition-colors"
            {...buttonProps}
            ref={ref}
          >
            <span className="text-xs font-bold font-serif select-none px-1">A</span>
            <ChevronDownIcon className="tiptap-button-dropdown-small opacity-70" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="min-w-[200px] z-50">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                editor.isActive("bold") && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <BoldIcon className="h-4 w-4" />
                <span className="font-bold">Bold</span>
              </div>
              <DropdownMenuShortcut>Ctrl+B</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                editor.isActive("italic") && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <ItalicIcon className="h-4 w-4" />
                <span className="italic">Italic</span>
              </div>
              <DropdownMenuShortcut>Ctrl+I</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                editor.isActive("underline") && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <UnderlineIcon className="h-4 w-4" />
                <span className="underline">Underline</span>
              </div>
              <DropdownMenuShortcut>Ctrl+U</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                editor.isActive("strike") && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <StrikeIcon className="h-4 w-4" />
                <span className="line-through">Strikethrough</span>
              </div>
              <DropdownMenuShortcut>Ctrl+Shift+S</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                editor.isActive("code") && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <Code2Icon className="h-4 w-4" />
                <code className="text-xs bg-bg-bone/80 px-1 py-0.5 rounded">Code</code>
              </div>
              <DropdownMenuShortcut>Ctrl+Shift+M</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                editor.isActive("subscript") && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <SubscriptIcon className="h-4 w-4" />
                <span>Subscript</span>
              </div>
              <DropdownMenuShortcut>Ctrl+Shift+,</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={cn(
                "flex justify-between items-center text-sm cursor-pointer",
                editor.isActive("superscript") && "bg-accent/60 text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-2">
                <SuperscriptIcon className="h-4 w-4" />
                <span>Superscript</span>
              </div>
              <DropdownMenuShortcut>Ctrl+Shift+.</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={clearFormatting}
              className="flex justify-between items-center text-sm cursor-pointer"
            >
              <div className="flex items-center gap-2 text-text-secondary">
                <BanIcon className="h-4 w-4" />
                <span>Clear formatting</span>
              </div>
              <DropdownMenuShortcut>Ctrl+\</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

StyleTextDropdownMenu.displayName = "StyleTextDropdownMenu"

export default StyleTextDropdownMenu
