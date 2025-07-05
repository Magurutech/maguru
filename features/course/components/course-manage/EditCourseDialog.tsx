'use client'

import type React from 'react'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, ImageIcon, AlertCircle } from 'lucide-react'
import { useCourseManagement } from '../../hooks/useCourseManagement'
import { useCourseDialog } from '../../hooks/useCourseDialog'
import { UpdateCourseRequest } from '../../types'

export function EditCourseDialog() {
  // Component state untuk UI interactions
  const [isUploadHovered, setIsUploadHovered] = useState(false)

  // Feature state dari hooks
  const { updateCourseWithValidation, error: managementError, clearError } = useCourseManagement()
  const {
    activeDialog,
    selectedCourse,
    formState,
    updateFormData,
    validateForm,
    closeDialog,
    handleFileUpload,
    setSubmitting,
  } = useCourseDialog()

  // Handle input change dengan proper error handling
  const handleInputChange = (field: string, value: string) => {
    clearError() // Clear previous errors when user starts typing
    updateFormData({ [field]: value })
  }

  // Handle form submission dengan proper error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCourse || !validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const updatedCourse: UpdateCourseRequest = {
        id: selectedCourse.id,
        ...formState.data,
      }

      const success = await updateCourseWithValidation(selectedCourse.id, updatedCourse)

      if (success) {
        closeDialog()
      }
    } catch (error) {
      console.error('Failed to update course:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle file selection dengan error handling
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        await handleFileUpload(file)
      } catch (error) {
        console.error('File upload failed:', error)
      }
    }
  }

  // Check if form is valid
  const isFormValid = formState.data.title && formState.data.description && formState.data.category

  if (!selectedCourse) return null

  return (
    <Dialog open={activeDialog === 'edit'} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="max-w-2xl bg-ancient-fantasy border-secondary-300 glass-panel">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-beige-900 flex items-center gap-2 font-serif">
            ✏️ Edit Kursus
          </DialogTitle>
          <DialogDescription className="text-beige-700">
            Perbarui informasi kursus Anda untuk memberikan pengalaman terbaik
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {(managementError || formState.errors.length > 0) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Terjadi kesalahan:</span>
              </div>
              <ul className="mt-2 text-red-700 text-sm space-y-1">
                {managementError && <li>{managementError}</li>}
                {formState.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-beige-900 font-medium">
              Judul Kursus *
            </Label>
            <Input
              id="title"
              value={formState.data.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Contoh: Petualangan Matematika Nusantara"
              required
              disabled={formState.isSubmitting}
              className="neu-input border-beige-300 focus:border-secondary-400 focus:ring-secondary-200"
            />
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-beige-900 font-medium">
              Deskripsi Kursus *
            </Label>
            <Textarea
              id="description"
              value={formState.data.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Jelaskan tentang kursus Anda dan apa yang akan dipelajari siswa..."
              required
              rows={4}
              disabled={formState.isSubmitting}
              className="neu-input border-beige-300 focus:border-secondary-400 focus:ring-secondary-200 resize-none"
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-beige-900 font-medium">
                Kategori *
              </Label>
              <Select
                value={formState.data.category || ''}
                onValueChange={(value) => handleInputChange('category', value)}
                disabled={formState.isSubmitting}
              >
                <SelectTrigger className="neu-input border-beige-300 focus:border-secondary-400 focus:ring-secondary-200">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matematika">📊 Matematika</SelectItem>
                  <SelectItem value="bahasa">📚 Bahasa Indonesia</SelectItem>
                  <SelectItem value="sains">🔬 Sains</SelectItem>
                  <SelectItem value="sejarah">🏛️ Sejarah</SelectItem>
                  <SelectItem value="seni">🎨 Seni & Budaya</SelectItem>
                  <SelectItem value="teknologi">💻 Teknologi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-beige-900 font-medium">
                Status
              </Label>
              <Select
                value={formState.data.status || 'DRAFT'}
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={formState.isSubmitting}
              >
                <SelectTrigger className="neu-input border-beige-300 focus:border-secondary-400 focus:ring-secondary-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">📝 Draft</SelectItem>
                  <SelectItem value="PUBLISHED">✨ Diterbitkan</SelectItem>
                  <SelectItem value="ARCHIVED">📦 Diarsipkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Course Stats (Read-only) */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-white/60 border-[#5AC88A]/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#7B5B2C]">{selectedCourse.students}</div>
                <div className="text-sm text-[#997F58]">Siswa</div>
              </CardContent>
            </Card>
            <Card className="bg-white/60 border-[#FFB148]/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#7B5B2C]">{selectedCourse.lessons}</div>
                <div className="text-sm text-[#997F58]">Pelajaran</div>
              </CardContent>
            </Card>
            <Card className="bg-white/60 border-[#FF4D4D]/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#7B5B2C]">
                  {selectedCourse.rating || 'N/A'}
                </div>
                <div className="text-sm text-[#997F58]">Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label className="text-beige-900 font-medium">Thumbnail Kursus</Label>
            <Card
              className={`border-2 border-dashed border-secondary-400 bg-beige-50 hover:bg-white/60 transition-all duration-300 card-ancient ${
                isUploadHovered ? 'scale-[1.02] shadow-lg' : ''
              }`}
              onMouseEnter={() => setIsUploadHovered(true)}
              onMouseLeave={() => setIsUploadHovered(false)}
            >
              <CardContent className="p-8">
                <div className="text-center">
                  <div
                    className={`mx-auto w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                      isUploadHovered ? 'scale-110' : ''
                    }`}
                  >
                    <ImageIcon className="h-8 w-8 text-secondary-600" />
                  </div>
                  <h3 className="text-lg font-medium text-beige-900 mb-2">Update Thumbnail</h3>
                  <p className="text-beige-700 text-sm mb-4">Pilih gambar baru untuk kursus Anda</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="thumbnail-upload-edit"
                  />
                  <label htmlFor="thumbnail-upload-edit">
                    <Button
                      type="button"
                      variant="outline"
                      className="btn-secondary hover-glow cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Ganti File
                    </Button>
                  </label>
                  <p className="text-xs text-beige-600 mt-2">PNG, JPG hingga 2MB</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              className="border-beige-300 text-beige-900 hover:bg-beige-100 neu-button"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="btn-primary magical-glow"
              disabled={!isFormValid || formState.isSubmitting}
            >
              {formState.isSubmitting ? 'Menyimpan...' : '💾 Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
