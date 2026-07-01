"use client"

import { forwardRef, useCallback, useState } from "react"
import { type Editor } from "@tiptap/react"
import { Table as TableIcon, Plus, Minus, Trash2 } from "lucide-react"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Components ---
import { TableGridPicker } from "./table-grid-picker"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface TableDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor
  modal?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export const TableDropdownMenu = forwardRef<
  HTMLButtonElement,
  TableDropdownMenuProps
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

    const isInsideTable = editor.isActive("table")

    const handleSelectGrid = (rows: number, cols: number) => {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
      setIsOpen(false)
    }

    // Table Operations
    const deleteTable = () => {
      editor.chain().focus().deleteTable().run()
      setIsOpen(false)
    }

    return (
      <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            role="button"
            tabIndex={-1}
            tooltip="Tabel"
            className="flex items-center gap-0.5 px-2 py-1 text-text-secondary hover:text-text-primary transition-colors"
            {...buttonProps}
            ref={ref}
          >
            <TableIcon className="tiptap-button-icon h-4 w-4" />
            <ChevronDownIcon className="tiptap-button-dropdown-small opacity-70" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[230px] p-1.5 z-50">
          <DropdownMenuGroup>
            <div className="px-2 py-1.5 text-xs font-semibold text-text-secondary">
              Sisipkan Tabel
            </div>
            <div className="px-1 py-1">
              <TableGridPicker onSelect={handleSelectGrid} />
            </div>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <div className="px-2 py-1.5 text-xs font-semibold text-text-secondary">
              Operasi Tabel
            </div>
            
            {/* Rows Section */}
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addRowBefore().run()}
              disabled={!isInsideTable}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Baris di Atas</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().addRowAfter().run()}
              disabled={!isInsideTable}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Baris di Bawah</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteRow().run()}
              disabled={!isInsideTable}
              className="flex items-center gap-2 text-sm text-destructive focus:text-destructive cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
              <span>Hapus Baris</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Columns Section */}
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              disabled={!isInsideTable}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Kolom Sebelum</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              disabled={!isInsideTable}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Kolom Setelah</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteColumn().run()}
              disabled={!isInsideTable}
              className="flex items-center gap-2 text-sm text-destructive focus:text-destructive cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
              <span>Hapus Kolom</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Delete Table */}
            <DropdownMenuItem
              onClick={deleteTable}
              disabled={!isInsideTable}
              className="flex items-center gap-2 text-sm text-destructive focus:text-destructive font-semibold cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus Tabel</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

TableDropdownMenu.displayName = "TableDropdownMenu"

export default TableDropdownMenu
