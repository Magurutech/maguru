'use client'

/**
 * EditorToolbar — mirrors Simple Editor toolbar from simple-editor.tsx.
 *
 * Uses EditorContext (via useCurrentEditor) — no editor prop needed.
 * Parent MUST wrap with <EditorContext.Provider value={{ editor }}>.
 */

import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { BlockquoteButton } from '@/components/tiptap-ui/blockquote-button'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import { LinkPopover } from '@/components/tiptap-ui/link-popover'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
import { ColorHighlightPopover } from '@/components/tiptap-ui/color-highlight-popover'
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '@/components/tiptap-ui-primitive/toolbar'
import { Spacer } from '@/components/tiptap-ui-primitive/spacer'

export function EditorToolbar() {
  return (
    <Toolbar>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3]} />
        <ListDropdownMenu modal={false} types={['bulletList', 'orderedList']} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        <ColorHighlightPopover />
        <LinkPopover />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <Spacer />
    </Toolbar>
  )
}
