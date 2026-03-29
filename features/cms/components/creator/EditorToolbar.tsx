'use client'

import type { Editor } from '@tiptap/react'

// Simple Editor UI components
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import { LinkPopover } from '@/components/tiptap-ui/link-popover'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'

// Simple Editor primitives
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '@/components/tiptap-ui-primitive/toolbar'

interface EditorToolbarProps {
  editor: Editor | null
}

/**
 * EditorToolbar — uses Simple Editor (Tiptap) components.
 * All buttons are properly synced with editor state via EditorContext.
 * Requires EditorContext.Provider to be set up in the parent component.
 */
export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  return (
    <Toolbar>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3]} />
        <ListDropdownMenu modal={false} types={['bulletList', 'orderedList']} />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <LinkPopover />
      </ToolbarGroup>
    </Toolbar>
  )
}
