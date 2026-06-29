'use client'

import { useState, useCallback } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { toast } from 'sonner'

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
    extensions: [StarterKit],
    content: initialText ? `<p>${initialText}</p>` : '<p></p>',
    editable: true,
    immediatelyRender: false,
  })

  const handleSave = useCallback(async () => {
    if (!editor) return
    setSaving(true)
    try {
      const text = editor.getText()
      const res = await fetch(`/api/courses/${courseSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text }),
      })
      if (!res.ok) throw new Error()
      onSave(text)
      toast.success('Deskripsi berhasil disimpan')
    } catch {
      toast.error('Gagal menyimpan deskripsi')
    } finally {
      setSaving(false)
    }
  }, [editor, courseSlug, onSave])

  return (
    <div className="mt-4 select-none">
      <div className="min-h-30 rounded-2xl border border-border/15 bg-card p-4 focus-within:border-accent-coral focus-within:ring-2 focus-within:ring-accent-coral/5 transition-all">
        <EditorContent editor={editor} className="text-xs text-text-secondary leading-relaxed font-sans" />
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
    </div>
  )
}
