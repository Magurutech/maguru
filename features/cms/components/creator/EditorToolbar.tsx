'use client'

/**
 * EditorToolbar — mirrors Simple Editor toolbar from simple-editor.tsx.
 *
 * Uses EditorContext (via useCurrentEditor) — no editor prop needed.
 * Parent MUST wrap with <EditorContext.Provider value={{ editor }}>.
 */

import { useRef, useState, memo } from 'react'
import { Image as ImageIcon, Loader2 } from 'lucide-react'
import { useCurrentEditor } from '@tiptap/react'
import { toast } from 'sonner'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { BlockquoteButton } from '@/components/tiptap-ui/blockquote-button'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import { LinkPopover } from '@/components/tiptap-ui/link-popover'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
import { ColorHighlightPopover } from '@/components/tiptap-ui/color-highlight-popover'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'
import { Spacer } from '@/components/tiptap-ui-primitive/spacer'
import { uploadLessonImage } from '@/lib/tiptap/image-upload'

/**
 * ImageUploadButton component for uploading images to lesson content
 * Requirements: 3.2, 3.3, 3.9, 3.11
 */
function ImageUploadButton({ lessonId }: { lessonId?: string }) {
  const { editor } = useCurrentEditor()
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor || !lessonId) return

    setUploading(true)
    try {
      const url = await uploadLessonImage(file, lessonId)
      editor.chain().focus().setImage({ src: url }).run()
      toast.success('Gambar berhasil diupload')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengupload gambar'
      toast.error(message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  if (!lessonId) return null

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />
      <Button
        type="button"
        variant="ghost"
        disabled={uploading || !editor}
        tooltip="Upload Gambar"
        onClick={() => inputRef.current?.click()}
        aria-label="Upload gambar"
      >
        {uploading ? (
          <Loader2 className="tiptap-button-icon animate-spin" />
        ) : (
          <ImageIcon className="tiptap-button-icon" />
        )}
      </Button>
    </>
  )
}

export const EditorToolbar = memo(function EditorToolbar({ lessonId }: { lessonId?: string }) {
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

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton lessonId={lessonId} />
      </ToolbarGroup>

      <Spacer />
    </Toolbar>
  )
})
