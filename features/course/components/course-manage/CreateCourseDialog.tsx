'use client'

import type React from 'react'

import { useState, useCallback } from 'react'
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
import { CreateCourseFormData, CreateCourseRequest } from '../../types'
import Image from 'next/image'

export function CreateCourseDialog() {
  // Component state untuk UI interactions ONLY
  const [isUploadHovered, setIsUploadHovered] = useState(false)

  // Feature state dari hooks dan context
  const { createCourseWithValidation, error: managementError, clearError } = useCourseManagement()
  const {
    activeDialog,
    formState,
    updateFormData,
    setFormErrors,
    setFormValid,
    setFormSubmitting,
    resetForm,
    closeDialog,
  } = useCourseContext()

  // Tambahkan state untuk file
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  // Handle input change dengan proper error handling
  const handleInputChange = useCallback(
    (field: string, value: string) => {
      // Hanya clear error jika ada error sebelumnya
      if (managementError || formState.errors.length > 0) {
        clearError()
      }
      updateFormData({ [field]: value })
    },
    [updateFormData, clearError, managementError, formState.errors.length],
  )

  // Handle form submission dengan proper error handling
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate form
      const validation = validateCourseData(formState.data)
      setFormErrors(validation.errors)
      setFormValid(validation.isValid)

      if (!validation.isValid) {
        return
      }

      setFormSubmitting(true)

      try {
        // Prepare data dengan validasi yang lebih ketat
        const dataToSend: CreateCourseRequest = {
          title: formState.data.title.trim(),
          description: formState.data.description.trim(),
          category: formState.data.category.trim(),
          thumbnail: thumbnailFile || formState.data.thumbnail || '',
          status: formState.data.status || 'DRAFT',
        }

        const success = await createCourseWithValidation(dataToSend)

        if (success) {
          resetForm()
          closeDialog()
        } else {
          setFormErrors(['Gagal membuat kursus. Silakan coba lagi.'])
        }
      } catch {
        setFormErrors(['Terjadi kesalahan saat membuat kursus. Silakan coba lagi.'])
      } finally {
        setFormSubmitting(false)
      }
    },
    [
      formState.data,
      createCourseWithValidation,
      resetForm,
      closeDialog,
      setFormErrors,
      setFormValid,
      setFormSubmitting,
      thumbnailFile,
    ],
  )

  // Handle file selection dengan error handling
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        } catch {
          setFormErrors(['File upload failed. Please try again.'])
        }
      }
    },
    [updateFormData, setFormErrors],
  )

  // Saat reset form, reset file
  const handleReset = useCallback(() => {
    setThumbnailFile(null)
    resetForm()
  }, [resetForm])

  // Check if form is valid
  const isFormValid = formState.data.title && formState.data.description && formState.data.category

  return (
    <Dialog open={activeDialog === 'create'} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="max-w-2xl bg-ancient-fantasy border-secondary-300 glass-panel">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-beige-900 flex items-center gap-2 font-serif">
            ✨ Buat Kursus Baru
          </DialogTitle>
          <DialogDescription className="text-beige-700">
            Mulai petualangan belajar baru dengan membuat kursus yang menakjubkan
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
                <SelectTrigger className="neu-input border-beige-100 focus:border-secondary-400 focus:ring-secondary-200">
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
                  <SelectItem value="PUBLISHED">✅ Dipublikasi</SelectItem>
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
                isUploadHovered
                  ? 'border-secondary-400 bg-secondary-50'
                  : 'border-beige-300 hover:border-secondary-400'
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
                        onClick={() => handleReset()}
                        disabled={formState.isSubmitting}
                        className="absolute top-2 right-2 text-2xl bg-white border-red-300 text-red-600 hover:bg-red-50 z-10"
                      >
                        ×
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                        <Upload
                          className={`h-12 w-12 transition-colors duration-300 ${
                            isUploadHovered ? 'text-secondary-600' : 'text-beige-600'
                          }`}
                        />
                        <div className="text-center ">
                          <p className="text-sm  text-beige-700">
                            Klik untuk upload atau drag & drop
                          </p>
                          <p className="text-xs  text-beige-700 mt-1">PNG, JPG, WebP (max 5MB)</p>
                        </div>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={formState.isSubmitting}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-beige-600 text-center">
              Jika tidak diupload, akan menggunakan thumbnail default
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={formState.isSubmitting}
              className="btn-secondary"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || formState.isSubmitting}
              className="btn-primary magical-glow"
            >
              {formState.isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Membuat Kursus...
                </>
              ) : (
                'Buat Kursus'
              )}
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
