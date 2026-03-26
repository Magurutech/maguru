import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SectionForm } from '@/features/cms/components/creator/SectionForm'
import { LessonForm } from '@/features/cms/components/creator/LessonForm'
import { useManageContext } from '../../../Context/creator/ManageContext'

export function ManageDialogs() {
  const {
    sectionFormOpen, editingSection,
    closeSectionDialog, handleSectionSubmit,
    lessonFormOpen, editingLesson,
    closeLessonDialog, handleLessonSubmit,
  } = useManageContext()

  return (
    <>
      <Dialog open={sectionFormOpen} onOpenChange={(open) => !open && closeSectionDialog()}>
        <DialogContent className="max-w-2xl" data-testid="section-form-dialog">
          <DialogHeader>
            <DialogTitle>{editingSection ? 'Edit Seksi' : 'Buat Seksi Baru'}</DialogTitle>
          </DialogHeader>
          <SectionForm
            initialData={
              editingSection
                ? { title: editingSection.title, description: editingSection.description || '', order: editingSection.order }
                : undefined
            }
            onSubmit={handleSectionSubmit}
            onCancel={closeSectionDialog}
            isEditing={!!editingSection}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={lessonFormOpen} onOpenChange={(open) => !open && closeLessonDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="lesson-form-dialog">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Pelajaran' : 'Buat Pelajaran Baru'}</DialogTitle>
          </DialogHeader>
          <LessonForm
            initialData={editingLesson?.lesson || undefined}
            onSubmit={handleLessonSubmit}
            onCancel={closeLessonDialog}
            isEditing={!!editingLesson}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
