import { Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useManageContext } from '../../../Context/creator/ManageContext'

export function ManageDialogs() {
  const {
    pendingDeleteSectionId, confirmDeleteSection, cancelDeleteSection,
    sections,
  } = useManageContext()

  const sectionToDelete = sections.find((s) => s.id === pendingDeleteSectionId)

  return (
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
          <Button variant="outline" onClick={cancelDeleteSection}>Batal</Button>
          <Button variant="destructive" onClick={confirmDeleteSection} data-testid="confirm-delete-section-btn">
            Ya, Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
