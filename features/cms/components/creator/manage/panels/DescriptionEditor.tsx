'use client'

import { useState, useCallback } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { Typography } from '@tiptap/extension-typography'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Selection } from '@tiptap/extensions/selection'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { toast } from 'sonner'

import { SlashCommand } from '../editor/extensions/SlashCommand'
import { Small } from '../editor/extensions/Small'
import { Columns, Column } from '../editor/extensions/Columns'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { Details, DetailsSummary, DetailsContent } from '@tiptap/extension-details'
import { PasteMarkdown } from '../editor/extensions/PasteMarkdown'
import { EditorToolbar } from '@/features/cms/components/creator/EditorToolbar'

interface DescriptionEditorProps {
  courseSlug: string
  initialText: string
  onSave: (text: string) => void
  onCancel: () => void
}

export function DescriptionEditor({
  courseSlug,
  initialText,
  onSave,
  onCancel,
}: DescriptionEditorProps) {
  const [saving, setSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
      Selection,
      Image.configure({ inline: false, allowBase64: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      HorizontalRule,
      SlashCommand,
      Small,
      Columns,
      Column,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Details.configure({ HTMLAttributes: { class: 'details-block' } }),
      DetailsSummary,
      DetailsContent,
      PasteMarkdown,
    ],
    content: initialText || '',
    editable: true,
    immediatelyRender: false,
  })

  const handleSave = useCallback(async () => {
    if (!editor) return
    setSaving(true)
    try {
      const html = editor.getHTML()
      const res = await fetch(`/api/courses/${courseSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: html }),
      })
      if (!res.ok) throw new Error()
      onSave(html)
      toast.success('Deskripsi berhasil disimpan')
    } catch {
      toast.error('Gagal menyimpan deskripsi')
    } finally {
      setSaving(false)
    }
  }, [editor, courseSlug, onSave])

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="mt-4 select-none border border-border/10 bg-card rounded-3xl overflow-hidden focus-within:border-accent-coral focus-within:ring-2 focus-within:ring-accent-coral/5 transition-all">
        <div className="bg-white border-b border-border/10">
          <EditorToolbar />
        </div>
        <div className="p-5 min-h-[160px] cursor-text" onClick={() => editor?.commands.focus()}>
          <EditorContent editor={editor} className="simple-editor-content text-xs text-text-secondary leading-relaxed font-sans" />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className="bg-accent-coral hover:bg-accent-coral/95 text-white rounded-full px-4 text-xs font-bold shadow-glow cursor-pointer"
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          disabled={saving}
          className="text-text-secondary hover:bg-bg-surface-accent rounded-full px-4 text-xs font-bold cursor-pointer"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Batal
        </Button>
      </div>
    </EditorContext.Provider>
  )
}
