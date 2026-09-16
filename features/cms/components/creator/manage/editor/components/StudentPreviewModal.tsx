'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Eye, X } from 'lucide-react'
import { Editor } from '@tiptap/react'

interface StudentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  editor: Editor | null
  wordCount: number
  readingTimeMinutes: number
  courseTitle?: string
}

export function StudentPreviewModal({
  isOpen,
  onClose,
  title,
  editor,
  wordCount,
  readingTimeMinutes,
  courseTitle,
}: StudentPreviewModalProps) {
  if (!editor) return null

  // Get HTML for reader preview
  const htmlContent = editor.getHTML()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background border border-border/15 rounded-2xl shadow-2xl">
        <DialogHeader className="p-4 md:px-6 md:py-4 border-b border-border/10 bg-card/60 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-coral/10 text-accent-coral flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                Pratinjau Tampilan Siswa (Reader Mode)
                <Badge variant="outline" className="text-[10px] bg-accent-forest/10 text-accent-forest border-accent-forest/20">
                  Live Preview
                </Badge>
              </DialogTitle>
              {courseTitle && (
                <p className="text-[11px] text-text-secondary">{courseTitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted font-mono mr-2">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-accent-coral" />
                {wordCount} kata
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-accent-mustard" />
                ~{readingTimeMinutes} mnt baca
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full cursor-pointer hover:bg-bg-surface-accent"
              aria-label="Tutup pratinjau"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Reader Canvas Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-card paper-texture">
          <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-border/15 rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="mb-6 pb-4 border-b border-border/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-coral block mb-1">
                MATERI PEMBELAJARAN
              </span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
                {title || 'Judul Pelajaran'}
              </h1>
            </div>

            <div
              className="simple-editor-content prose prose-zinc dark:prose-invert max-w-none text-text-secondary leading-relaxed text-sm md:text-base font-sans"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
