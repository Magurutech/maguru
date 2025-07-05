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
import { useCourseDialog } from '../../hooks/useCourseDialog'
import { CreateCourseRequest } from '../../types'
import Image from 'next/image'

export function CreateCourseDialog() {
  // Component state untuk UI interactions ONLY
  const [isUploadHovered, setIsUploadHovered] = useState(false)

  // Feature state dari hooks
  const { createCourseWithValidation, error: managementError, clearError } = useCourseManagement()
  const {
    activeDialog,
    formState,
    updateFormData,
    validateForm,
    resetForm,
    closeDialog,
    handleFileUpload,
    setSubmitting,
  } = useCourseDialog()

  // Handle input change dengan proper error handling
  const handleInputChange = useCallback(
    (field: string, value: string) => {
      clearError() // Clear previous errors when user starts typing
      updateFormData({ [field]: value })
    },
    [updateFormData, clearError],
  )

  // Handle form submission dengan proper error handling
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        return
      }

      setSubmitting(true)

      try {
        const success = await createCourseWithValidation(formState.data as CreateCourseRequest)

        if (success) {
          resetForm()
          closeDialog()
        }
      } catch (error) {
        console.error('Failed to create course:', error)
      } finally {
        setSubmitting(false)
      }
    },
    [
      validateForm,
      createCourseWithValidation,
      formState.data,
      resetForm,
      closeDialog,
      setSubmitting,
    ],
  )

  // Handle file selection dengan error handling
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        try {
          await handleFileUpload(file)
        } catch (error) {
          console.error('File upload failed:', error)
        }
      }
    },
    [handleFileUpload],
  )

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
                  <SelectItem value="PUBLISHED">✅ Dipublikasi</SelectItem>
                  <SelectItem value="ARCHIVED">📦 Diarsipkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label className="text-beige-900 font-medium">Thumbnail Kursus</Label>
            <Card
              className={`relative border-2 border-dashed transition-all duration-300 ${
                isUploadHovered
                  ? 'border-secondary-400 bg-secondary-50'
                  : 'border-beige-300 hover:border-secondary-400'
              }`}
              onMouseEnter={() => setIsUploadHovered(true)}
              onMouseLeave={() => setIsUploadHovered(false)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  {formState.data.thumbnail ? (
                    <div className="relative">
                      <Image
                        src={formState.data.thumbnail}
                        alt="Course thumbnail"
                        className="w-32 h-24 object-cover rounded-lg"
                        width={128}
                        height={96}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('thumbnail', '')}
                        disabled={formState.isSubmitting}
                        className="absolute -top-2 -right-2 bg-white border-red-300 text-red-600 hover:bg-red-50"
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload
                        className={`h-12 w-12 transition-colors duration-300 ${
                          isUploadHovered ? 'text-secondary-600' : 'text-beige-600'
                        }`}
                      />
                      <div className="text-center">
                        <p className="text-sm text-beige-700">Klik untuk upload atau drag & drop</p>
                        <p className="text-xs text-beige-600 mt-1">PNG, JPG, WebP (max 5MB)</p>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={formState.isSubmitting}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
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
