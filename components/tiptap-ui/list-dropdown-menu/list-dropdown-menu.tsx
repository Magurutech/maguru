"use client"

import { useCallback, useState } from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"

// --- Tiptap UI ---
import { useListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu/use-list-dropdown-menu"
import type { ListType } from "@/components/tiptap-ui/list-button"

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

export interface ListDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor
  types?: ListType[]
  hideWhenUnavailable?: boolean
  onOpenChange?: (isOpen: boolean) => void
  modal?: boolean
}

export function ListDropdownMenu({
  editor: providedEditor,
  types = ["bulletList", "orderedList", "taskList"],
  hideWhenUnavailable = false,
  onOpenChange,
  modal = true,
  ...props
}: ListDropdownMenuProps) {
  const { editor } = useTiptapEditor(providedEditor)
  const [isOpen, setIsOpen] = useState(false)

  const { canToggle, isActive, isVisible, Icon } =
    useListDropdownMenu({
      editor,
      types,
      hideWhenUnavailable,
    })

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  if (!editor || !isVisible) {
    return null
  }

  const canIndent = () => {
    return editor.isActive("bulletList") || editor.isActive("orderedList") || editor.isActive("taskList")
  }

  const canOutdent = () => {
    return editor.isActive("bulletList") || editor.isActive("orderedList") || editor.isActive("taskList")
  }

  const handleIndent = () => {
    if (editor.isActive("taskList")) {
      editor.chain().focus().sinkListItem("taskItem").run()
    } else {
      editor.chain().focus().sinkListItem("listItem").run()
    }
  }

  const handleOutdent = () => {
    if (editor.isActive("taskList")) {
      editor.chain().focus().liftListItem("taskItem").run()
    } else {
      editor.chain().focus().liftListItem("listItem").run()
    }
  }

  return (
    <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          data-active-state={isActive ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!canToggle}
          data-disabled={!canToggle}
          aria-label="List options"
          tooltip="List formatting"
          {...props}
        >
          <Icon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[200px] z-50">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "flex justify-between items-center text-sm cursor-pointer",
              editor.isActive("bulletList") && "bg-accent/60 text-accent-foreground font-medium"
            )}
          >
            <span>Bulleted list</span>
            <DropdownMenuShortcut>Ctrl+Shift+8</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "flex justify-between items-center text-sm cursor-pointer",
              editor.isActive("orderedList") && "bg-accent/60 text-accent-foreground font-medium"
            )}
          >
            <span>Numbered list</span>
            <DropdownMenuShortcut>Ctrl+Shift+7</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={cn(
              "flex justify-between items-center text-sm cursor-pointer",
              editor.isActive("taskList") && "bg-accent/60 text-accent-foreground font-medium"
            )}
          >
            <span>Task list</span>
            <DropdownMenuShortcut>Ctrl+Shift+6</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleOutdent}
            className="flex justify-between items-center text-sm cursor-pointer"
            disabled={!canOutdent()}
          >
            <span className="text-text-secondary">Outdent</span>
            <DropdownMenuShortcut>Shift+Tab</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleIndent}
            className="flex justify-between items-center text-sm cursor-pointer"
            disabled={!canIndent()}
          >
            <span className="text-text-secondary">Indent</span>
            <DropdownMenuShortcut>Tab</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ListDropdownMenu

