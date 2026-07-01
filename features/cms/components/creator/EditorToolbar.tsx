'use client'

/**
 * EditorToolbar — mirrors Simple Editor toolbar from simple-editor.tsx.
 *
 * Uses EditorContext (via useCurrentEditor) — no editor prop needed.
 * Parent MUST wrap with <EditorContext.Provider value={{ editor }}>.
 * 
 * Styled as a flat, full-width, left-aligned Confluence-style editor toolbar.
 */

import { useRef, useState, memo } from 'react'
import { Image as ImageIcon, Loader2, Columns as ColumnsIcon, ChevronsUpDown } from 'lucide-react'
import { useCurrentEditor } from '@tiptap/react'
import { toast } from 'sonner'
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { StyleTextDropdownMenu } from '@/components/tiptap-ui/style-text-dropdown-menu'
import { AlignDropdownMenu } from '@/components/tiptap-ui/align-dropdown-menu'
import { TableDropdownMenu } from '@/components/tiptap-ui/table-dropdown-menu'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import { LinkPopover } from '@/components/tiptap-ui/link-popover'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
import { ColorHighlightPopover } from '@/components/tiptap-ui/color-highlight-popover'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'
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
  const { editor } = useCurrentEditor()

  return (
    <div className="w-full bg-white border-y border-border/10 py-1 flex items-center justify-start overflow-x-auto select-none no-scrollbar">
      <Toolbar>
        <ToolbarGroup>
          <UndoRedoButton action="undo" />
          <UndoRedoButton action="redo" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <HeadingDropdownMenu modal={false} />
          <StyleTextDropdownMenu modal={false} />
          <ColorHighlightPopover />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ListDropdownMenu modal={false} />
          <AlignDropdownMenu modal={false} />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <LinkPopover />
          <CodeBlockButton />
          <ImageUploadButton lessonId={lessonId} />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <TableDropdownMenu modal={false} />
          <Button
            type="button"
            variant="ghost"
            tooltip="Layout Kolom"
            onClick={() => editor?.chain().focus().insertColumns(2).run()}
            disabled={!editor}
            aria-label="Insert 2 columns layout"
          >
            <ColumnsIcon className="tiptap-button-icon h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            tooltip="Expand Block (Collapsible)"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertContent(
                  `<details class="details-block">
                    <summary>Ringkasan</summary>
                    <p>Tulis detail konten di sini...</p>
                  </details>`
                )
                .run()
            }
            disabled={!editor || editor.isActive('details')}
            aria-label="Insert expand details block"
          >
            <ChevronsUpDown className="tiptap-button-icon h-4 w-4" />
          </Button>
        </ToolbarGroup>
      </Toolbar>
    </div>
  )
})
