import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useManageContext } from '../../../Context/creator/ManageContext'

export function ManageDialogs() {
  const {
    pendingDeleteSectionId,
    confirmDeleteSection,
    cancelDeleteSection,
    sections,
    pendingDeleteLesson,
    confirmDeleteLesson,
    cancelDeleteLesson,
  } = useManageContext()

  const sectionToDelete = sections.find((s) => s.id === pendingDeleteSectionId)

  return (
    <>
      {/* Delete Section Dialog */}
      <Dialog
        open={!!pendingDeleteSectionId}
        onOpenChange={(open) => !open && cancelDeleteSection()}
      >
        <DialogContent className="max-w-sm rounded-3xl border border-border/10 paper-texture shadow-lg select-none" data-testid="delete-section-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-manrope font-extrabold text-text-primary text-base">
              <Trash2 className="h-4 w-4 text-accent-coral" />
              Hapus Seksi
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary leading-relaxed pt-1.5 font-sans">
              Hapus seksi{sectionToDelete ? ` "${sectionToDelete.title}"` : ''}? Semua pelajaran di
              dalamnya juga akan dihapus dan tidak bisa dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="outline"
              onClick={cancelDeleteSection}
              data-testid="cancel-delete-section-btn"
              className="rounded-full px-5 font-bold cursor-pointer text-xs hover:bg-bg-surface-accent border-border/10"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteSection}
              data-testid="confirm-delete-section-btn"
              className="rounded-full px-5 font-bold cursor-pointer text-xs bg-accent-coral hover:bg-accent-coral/95"
            >
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Lesson Dialog */}
      <Dialog open={!!pendingDeleteLesson} onOpenChange={(open) => !open && cancelDeleteLesson()}>
        <DialogContent className="max-w-sm rounded-3xl border border-border/10 paper-texture shadow-lg select-none" data-testid="delete-lesson-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-manrope font-extrabold text-text-primary text-base">
              <Trash2 className="h-4 w-4 text-accent-coral" />
              Hapus Pelajaran
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary leading-relaxed pt-1.5 font-sans">
              Hapus pelajaran{pendingDeleteLesson?.title ? ` "${pendingDeleteLesson.title}"` : ''}?
              Tindakan ini tidak bisa dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="outline"
              onClick={cancelDeleteLesson}
              data-testid="cancel-delete-lesson-btn"
              className="rounded-full px-5 font-bold cursor-pointer text-xs hover:bg-bg-surface-accent border-border/10"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteLesson}
              data-testid="confirm-delete-lesson-btn"
              className="rounded-full px-5 font-bold cursor-pointer text-xs bg-accent-coral hover:bg-accent-coral/95"
            >
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
