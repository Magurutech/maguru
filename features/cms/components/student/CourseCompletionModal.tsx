'use client'

import { Trophy, CheckCircle2, Award, ArrowRight, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CourseCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  courseTitle?: string
  totalLessons: number
  onBackToCatalog: () => void
}

export function CourseCompletionModal({
  isOpen,
  onClose,
  courseTitle,
  totalLessons,
  onBackToCatalog,
}: CourseCompletionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-card border border-border/20 rounded-3xl p-6 shadow-2xl overflow-hidden relative paper-texture">
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-accent-coral/15 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-accent-mustard/15 blur-3xl pointer-events-none"
        />

        <DialogHeader className="text-center sm:text-center items-center space-y-4 pt-2">
          {/* Trophy badge with whimsical atelier styling */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-[#cfa04a]/20 via-[#b34d3d]/15 to-transparent border border-accent-mustard/30 shadow-inner">
            <Trophy className="w-10 h-10 text-accent-mustard animate-bounce" />
            <Sparkles className="w-4 h-4 text-accent-coral absolute -top-1 -right-1" />
          </div>

          <div className="space-y-1.5">
            <DialogTitle className="text-2xl font-manrope font-extrabold text-text-primary tracking-tight">
              Pencapaian Luar Biasa!
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
              Selamat! Anda telah berhasil menuntaskan seluruh materi pembelajaran dan evaluasi pada kursus{' '}
              <strong className="text-text-primary font-bold">{courseTitle || 'ini'}</strong>.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Milestone Statistics Card */}
        <div className="my-5 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-bg-surface-accent border border-border/15">
          <div className="flex flex-col items-center justify-center text-center p-2">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Progres Belajar</span>
            </div>
            <span className="text-2xl font-manrope font-extrabold text-text-primary mt-1 tabular-nums">
              100%
            </span>
            <span className="text-[10px] text-text-muted">Kurikulum Tuntas</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-2 border-l border-border/15">
            <div className="flex items-center gap-1.5 text-accent-coral font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Total Pelajaran</span>
            </div>
            <span className="text-2xl font-manrope font-extrabold text-text-primary mt-1 tabular-nums">
              {totalLessons}
            </span>
            <span className="text-[10px] text-text-muted">Materi Diselesaikan</span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2 pt-1">
          <Button
            type="button"
            onClick={onBackToCatalog}
            className="w-full py-2.5 rounded-full bg-accent-coral hover:bg-accent-coral/95 text-white font-bold text-xs shadow-glow transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Kembali ke Katalog Kursus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full text-xs text-text-muted hover:text-text-primary rounded-full cursor-pointer font-medium"
          >
            Tutup & Tinjau Kembali Materi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
