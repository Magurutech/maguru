import { Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useManageContext } from '../../../context/creator/ManageContext'

export function ManageDialogs() {
  const {
    pendingDeleteSectionId, confirmDeleteSection, cancelDeleteSection, sections,
    pendingDeleteLesson, confirmDeleteLesson, cancelDeleteLesson,
  } = useManageContext()

  const sectionToDelete = sections.find((s) => s.id === pendingDeleteSectionId)

  return (
    <>
      {/* Delete Section Dialog */}
      <Dialog open={!!pendingDeleteSectionId} onOpenChange={(open) => !open && cancelDeleteSection()}>
        <DialogContent className="max-w-sm" data-testid="delete-section-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-merah-500" />
              Hapus Seksi
            </DialogTitle>
            <DialogDescription>
              Hapus seksi{sectionToDelete ? ` "${sectionToDelete.title}"` : ''}?
              Semua pelajaran di dalamnya juga akan dihapus dan tidak bisa dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelDeleteSection} data-testid="cancel-delete-section-btn">Batal</Button>
            <Button variant="destructive" onClick={confirmDeleteSection} data-testid="confirm-delete-section-btn">
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Lesson Dialog */}
      <Dialog open={!!pendingDeleteLesson} onOpenChange={(open) => !open && cancelDeleteLesson()}>
        <DialogContent className="max-w-sm" data-testid="delete-lesson-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-merah-500" />
              Hapus Pelajaran
            </DialogTitle>
            <DialogDescription>
              Hapus pelajaran{pendingDeleteLesson?.title ? ` "${pendingDeleteLesson.title}"` : ''}?
              Tindakan ini tidak bisa dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelDeleteLesson} data-testid="cancel-delete-lesson-btn">Batal</Button>
            <Button variant="destructive" onClick={confirmDeleteLesson} data-testid="confirm-delete-lesson-btn">
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
