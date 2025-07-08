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
import { Upload, AlertCircle } from 'lucide-react'
import { useCourseManagement } from '../../hooks/useCourseManagement'
import { useCourseContext } from '../../contexts/courseContext'
import {
  UpdateCourseRequest,
  CreateCourseFormData,
  CourseStatus,
  courseThumbnailUtils,
} from '../../types'
import Image from 'next/image'

export function EditCourseDialog() {
  // Component state untuk UI interactions
  const [isUploadHovered, setIsUploadHovered] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  // Feature state dari hooks dan context
  const { updateCourseWithValidation, error: managementError, clearError } = useCourseManagement()
  const {
    activeDialog,
    selectedCourse,
    formState,
    updateFormData,
    setFormErrors,
    setFormValid,
    setFormSubmitting,
    closeDialog,
  } = useCourseContext()

  // Handle input change dengan proper error handling
  const handleInputChange = (field: string, value: string) => {
    clearError() // Clear previous errors when user starts typing
    updateFormData({ [field]: value })
  }

  // Handle file selection dengan error handling
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          setFormErrors(['File type not supported. Please upload JPEG, PNG, or WebP image.'])
          return
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
          setFormErrors(['File size too large. Please upload an image smaller than 5MB.'])
          return
        }

        setThumbnailFile(file)
        updateFormData({ thumbnail: file })
      } catch (error) {
        console.error('File upload failed:', error)
        setFormErrors(['File upload failed. Please try again.'])
      }
    }
  }

  // Saat reset form, reset file
  const handleReset = () => {
    setThumbnailFile(null)
    updateFormData({ thumbnail: '' })
  }

  // Handle form submission dengan proper error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCourse) {
      return
    }

    // Validate form
    const validation = validateCourseData(formState.data)
    setFormErrors(validation.errors)
    setFormValid(validation.isValid)

    if (!validation.isValid) {
      return
    }

    setFormSubmitting(true)

    try {
      const dataToSend: { [key: string]: string | File } = { ...formState.data }
      if (thumbnailFile) {
        dataToSend.thumbnail = thumbnailFile
      }
      const updatedCourse: UpdateCourseRequest = {
        id: selectedCourse.id,
        title: dataToSend.title as string,
        description: dataToSend.description as string,
        category: dataToSend.category as string,
        thumbnail: dataToSend.thumbnail,
        status: dataToSend.status as CourseStatus,
      }
      const success = await updateCourseWithValidation(selectedCourse.id, updatedCourse)

      if (success) {
        closeDialog()
      }
    } catch (error) {
      console.error('Failed to update course:', error)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Check if form is valid
  const isFormValid = formState.data.title && formState.data.description && formState.data.category

  // Get display thumbnail untuk preview dengan fallback
  const getDisplayThumbnail = () => {
    if (thumbnailFile) {
      return URL.createObjectURL(thumbnailFile)
    }
    if (formState.data.thumbnail && typeof formState.data.thumbnail === 'string') {
      return formState.data.thumbnail
    }
    return courseThumbnailUtils.getDefaultThumbnail()
  }

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
                Status *
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

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label className="text-beige-900 font-medium">
              Thumbnail Kursus <span className="text-beige-600 text-sm">(Opsional)</span>
            </Label>
            <Card
              className={`relative border-2 border-dashed transition-all duration-300 aspect-[4/2] w-full max-w-2xl mx-auto overflow-hidden p-0 ${
                isUploadHovered ? 'scale-[1.02] shadow-lg' : ''
              }`}
              onMouseEnter={() => setIsUploadHovered(true)}
              onMouseLeave={() => setIsUploadHovered(false)}
            >
              <CardContent className="p-0 h-full w-full flex items-center justify-center">
                <div className="relative w-full h-full min-h-[96px]">
                  {thumbnailFile ? (
                    <>
                      <Image
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Course thumbnail"
                        className="w-full h-full object-cover rounded-lg"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 640px"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        disabled={formState.isSubmitting}
                        className="absolute -top-2 -right-2 bg-white border-red-300 text-red-600 hover:bg-red-50"
                      >
                        ×
                      </Button>
                    </>
                  ) : (
                    <>
                      <Image
                        src={getDisplayThumbnail()}
                        alt="Course thumbnail"
                        className="w-full h-full object-cover rounded-lg"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 640px"
                      />
                      <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                        <Upload
                          className={`h-8 w-8 transition-colors duration-300 ${
                            isUploadHovered ? 'text-secondary-600' : 'text-white'
                          }`}
                        />
                        <div className="text-center text-white">
                          <p className="text-sm">Klik untuk ganti thumbnail</p>
                          <p className="text-xs mt-1">PNG, JPG, WebP (max 5MB)</p>
                        </div>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-beige-600 text-center">
              Jika tidak diupload, akan menggunakan thumbnail default
            </p>
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

// Helper function untuk validation (temporary, should be moved to courseUtils)
function validateCourseData(data: CreateCourseFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push('Judul kursus wajib diisi')
  }

  if (!data.description?.trim()) {
    errors.push('Deskripsi kursus wajib diisi')
  }

  if (!data.category?.trim()) {
    errors.push('Kategori kursus wajib dipilih')
  }

  // Status validation - wajib dengan default DRAFT
  if (!data.status) {
    errors.push('Status kursus wajib dipilih')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
