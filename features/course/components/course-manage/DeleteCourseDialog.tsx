'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, Trash2, AlertCircle } from 'lucide-react'
import { useCourseManagement } from '../../hooks/useCourseManagement'
import { useCourseDialog } from '../../hooks/useCourseDialog'

export function DeleteCourseDialog() {
  // Component state untuk UI interactions
  const [isDeleting, setIsDeleting] = useState(false)

  // Feature state dari hooks
  const { deleteCourseWithConfirmation, error: managementError, clearError } = useCourseManagement()
  const { activeDialog, selectedCourse, closeDialog } = useCourseDialog()

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedCourse) return

    setIsDeleting(true)
    clearError()

    try {
      const success = await deleteCourseWithConfirmation(selectedCourse.id)
      if (success) {
        closeDialog()
      }
    } catch (error) {
      console.error('Failed to delete course:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    clearError()
    closeDialog()
  }

  if (!selectedCourse) return null

  return (
    <Dialog open={activeDialog === 'delete'} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-md bg-ancient-fantasy border-secondary-300 glass-panel">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-beige-900 flex items-center gap-2 font-serif">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Hapus Kursus
          </DialogTitle>
          <DialogDescription className="text-beige-700">
            Tindakan ini tidak dapat dibatalkan. Kursus akan dihapus secara permanen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Course Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-red-900 mb-1">{selectedCourse.title}</h4>
                <p className="text-sm text-red-700 line-clamp-2">{selectedCourse.description}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-red-600">
                  <span>{selectedCourse.students} siswa</span>
                  <span>{selectedCourse.lessons} pelajaran</span>
                  <span>{selectedCourse.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {managementError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{managementError}</span>
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Peringatan:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Semua data kursus akan dihapus secara permanen</li>
                  <li>Siswa yang terdaftar akan kehilangan akses</li>
                  <li>Progress pembelajaran akan hilang</li>
                  <li>Tindakan ini tidak dapat dibatalkan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
            className="btn-secondary"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Kursus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
