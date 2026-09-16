'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles, Wand2, FileText, Code2, Loader2 } from 'lucide-react'
import { Editor } from '@tiptap/react'
import { toast } from 'sonner'

interface AIWritingAssistantModalProps {
  isOpen: boolean
  onClose: () => void
  editor: Editor | null
  title: string
  courseTitle?: string
}

export function AIWritingAssistantModal({
  isOpen,
  onClose,
  editor,
  title,
  courseTitle,
}: AIWritingAssistantModalProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  if (!editor) return null

  const handleInsertSummary = () => {
    setLoadingAction('summary')
    setTimeout(() => {
      editor.chain().focus().insertContent([
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '📌 Rangkuman Materi' }],
        },
        {
          type: 'callout',
          attrs: { type: 'success' },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Intisari dari pembahasan ${title || 'materi ini'}: Pahami sintaks dasar, perhatikan struktur alur data, dan praktikkan contoh kode secara langsung agar pemahaman lebih melekat.`,
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '' }],
        },
      ]).run()
      toast.success('Rangkuman AI berhasil disisipkan!')
      setLoadingAction(null)
      onClose()
    }, 400)
  }

  const handleInsertCodeExample = () => {
    setLoadingAction('code')
    setTimeout(() => {
      editor.chain().focus().insertContent([
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '💻 Contoh Implementasi Kode' }],
        },
        {
          type: 'codeBlock',
          attrs: { language: 'python' },
          content: [
            {
              type: 'text',
              text: `# Contoh demonstrasi konsep ${title || 'Python'}\ndef jalankan_contoh():\n    data = [10, 20, 30]\n    hasil = sum(data)\n    print(f"Total kalkulasi: {hasil}")\n\nif __name__ == "__main__":\n    jalankan_contoh()`,
            },
          ],
        },
        {
          type: 'callout',
          attrs: { type: 'tip' },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Tips: Ujilah kode di atas secara interaktif pada terminal atau IDE favorit Anda untuk melihat hasil eksekusinya.',
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '' }],
        },
      ]).run()
      toast.success('Blok kode & tips berhasil disisipkan!')
      setLoadingAction(null)
      onClose()
    }, 400)
  }

  const handleInsertExercise = () => {
    setLoadingAction('exercise')
    setTimeout(() => {
      editor.chain().focus().insertContent([
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '🧠 Latihan Mandiri' }],
        },
        {
          type: 'callout',
          attrs: { type: 'warning' },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Tantangan: Modifikasi program di atas agar dapat menerima input angka dinamis dari pengguna menggunakan fungsi input().',
                },
              ],
            },
          ],
        },
      ]).run()
      toast.success('Latihan mandiri berhasil disisipkan!')
      setLoadingAction(null)
      onClose()
    }, 400)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-background border border-border/15 rounded-2xl shadow-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent-coral/10 text-accent-coral flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <DialogTitle className="text-base font-bold text-text-primary">
              AI Content Assistant
            </DialogTitle>
          </div>
          <p className="text-xs text-text-secondary">
            Bantu percepat penulisan kurikulum untuk materi <span className="font-semibold text-text-primary">{title || 'Pelajaran'}</span>
          </p>
        </DialogHeader>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleInsertSummary}
            disabled={!!loadingAction}
            className="w-full text-left p-3.5 rounded-xl border border-border/10 hover:border-accent-coral/30 hover:bg-accent-coral/5 transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-accent-forest/10 text-accent-forest group-hover:bg-accent-forest/20 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-text-primary group-hover:text-accent-coral transition-colors flex items-center gap-1.5">
                Sisipkan Rangkuman Kunci
                {loadingAction === 'summary' && <Loader2 className="w-3 h-3 animate-spin text-accent-coral" />}
              </h4>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Buat blok intisari poin penting materi dalam format Callout hijau elegan.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleInsertCodeExample}
            disabled={!!loadingAction}
            className="w-full text-left p-3.5 rounded-xl border border-border/10 hover:border-accent-coral/30 hover:bg-accent-coral/5 transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-[#89b4fa]/10 text-[#89b4fa] group-hover:bg-[#89b4fa]/20 transition-colors">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-text-primary group-hover:text-accent-coral transition-colors flex items-center gap-1.5">
                Sisipkan Blok Contoh Kode
                {loadingAction === 'code' && <Loader2 className="w-3 h-3 animate-spin text-accent-coral" />}
              </h4>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Tambahkan cuplikan kode Python terformat dengan tab bahasa & tombol salin.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleInsertExercise}
            disabled={!!loadingAction}
            className="w-full text-left p-3.5 rounded-xl border border-border/10 hover:border-accent-coral/30 hover:bg-accent-coral/5 transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-accent-mustard/10 text-accent-mustard group-hover:bg-accent-mustard/20 transition-colors">
              <Wand2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-text-primary group-hover:text-accent-coral transition-colors flex items-center gap-1.5">
                Sisipkan Tantangan / Latihan
                {loadingAction === 'exercise' && <Loader2 className="w-3 h-3 animate-spin text-accent-coral" />}
              </h4>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Tambahkan kotak tantangan mandiri agar siswa langsung mempraktikkan materi.
              </p>
            </div>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-border/10 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs rounded-full cursor-pointer">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
