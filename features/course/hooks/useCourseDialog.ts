/**
 * useCourseDialog Hook - High-Level Hook
 *
 * @description
 * High-level hook untuk dialog state management dan form handling.
 * Hook ini menyediakan:
 * - Dialog state management (create, edit, delete)
 * - Form data management dengan validation
 * - File upload handling untuk thumbnails
 * - Form submission dengan error handling
 * - Integration dengan courseUtils untuk validation
 *
 * Mengikuti arsitektur Maguru untuk high-level hooks dengan:
 * - Business logic untuk dialog management
 * - Form validation dan error handling
 * - File upload integration
 * - Local state management (tidak menggunakan context)
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { validateCourseData } from '../lib/courseUtils'
import type { Course, CreateCourseFormData, CourseStatus } from '../types'

// Dialog types
type DialogType = 'create' | 'edit' | 'delete' | null

// Form state interface
interface FormState {
  data: CreateCourseFormData
  errors: string[]
  isValid: boolean
  isSubmitting: boolean
}

// Hook return type
interface UseCourseDialogReturn {
  // Dialog state
  activeDialog: DialogType
  selectedCourse: Course | null

  // Form state
  formState: FormState

  // Dialog actions
  openCreateDialog: () => void
  openEditDialog: (course: Course) => void
  openDeleteDialog: (course: Course) => void
  closeDialog: () => void

  // Form actions
  updateFormData: (data: Partial<CreateCourseFormData>) => void
  validateForm: () => boolean
  resetForm: () => void
  setSubmitting: (isSubmitting: boolean) => void

  // File upload actions
  handleFileUpload: (file: File) => Promise<string | null>
  removeThumbnail: () => void

  // Utility functions
  getFormErrors: () => string[]
  hasFormChanges: (originalData?: Partial<Course>) => boolean
}

// Initial form state
const initialFormState: FormState = {
  data: {
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    status: 'DRAFT' as CourseStatus,
  },
  errors: [],
  isValid: false,
  isSubmitting: false,
}

export function useCourseDialog(): UseCourseDialogReturn {
  // Dialog state
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // Form state
  const [formState, setFormState] = useState<FormState>(initialFormState)

  // Open create dialog
  const openCreateDialog = useCallback(() => {
    setActiveDialog('create')
    setSelectedCourse(null)
    setFormState(initialFormState)
  }, [])

  // Open edit dialog
  const openEditDialog = useCallback((course: Course) => {
    setActiveDialog('edit')
    setSelectedCourse(course)

    // Pre-populate form dengan course data dengan safe handling
    setFormState((prev) => ({
      ...prev,
      data: {
        title: course.title || '',
        description: course.description || '',
        thumbnail: course.thumbnail || '',
        category: course.category || '',
        status: course.status || 'DRAFT',
      },
      errors: [],
      isValid: true, // Assume valid since it's existing data
    }))
  }, [])

  // Open delete dialog
  const openDeleteDialog = useCallback((course: Course) => {
    setActiveDialog('delete')
    setSelectedCourse(course)
  }, [])

  // Close dialog
  const closeDialog = useCallback(() => {
    setActiveDialog(null)
    setSelectedCourse(null)
    setFormState(initialFormState)
  }, [])

  // Update form data
  const updateFormData = useCallback((data: Partial<CreateCourseFormData>) => {
    setFormState((prev) => {
      const newData = { ...prev.data, ...data }

      try {
        const validation = validateCourseData(newData)
        return {
          ...prev,
          data: newData,
          errors: validation.errors,
          isValid: validation.isValid,
        }
      } catch (error) {
        console.error('Error in form validation:', error)
        return {
          ...prev,
          data: newData,
          errors: ['Terjadi kesalahan saat validasi data'],
          isValid: false,
        }
      }
    })
  }, [])

  // Validate form
  const validateForm = useCallback((): boolean => {
    const validation = validateCourseData(formState.data)

    setFormState((prev) => ({
      ...prev,
      errors: validation.errors,
      isValid: validation.isValid,
    }))

    return validation.isValid
  }, [formState.data])

  // Reset form
  const resetForm = useCallback(() => {
    setFormState(initialFormState)
  }, [])

  // Set submitting state
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState((prev) => ({ ...prev, isSubmitting }))
  }, [])

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          throw new Error('File type not supported. Please upload JPEG, PNG, or WebP image.')
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
          throw new Error('File size too large. Please upload an image smaller than 5MB.')
        }

        // TODO: Implement actual file upload to Supabase Storage
        // For now, use base64 as temporary solution

        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            const base64String = event.target?.result as string
            updateFormData({ thumbnail: base64String })
            resolve(base64String)
          }
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsDataURL(file)
        })
      } catch (error) {
        console.error('File upload failed:', error)
        return null
      }
    },
    [updateFormData],
  )

  // Remove thumbnail
  const removeThumbnail = useCallback(() => {
    updateFormData({ thumbnail: '' })
  }, [updateFormData])

  // Get form errors
  const getFormErrors = useCallback((): string[] => {
    return formState.errors
  }, [formState.errors])

  // Check if form has changes compared to original data
  const hasFormChanges = useCallback(
    (originalData?: Partial<Course>): boolean => {
      if (!originalData) return true // If no original data, assume there are changes

      const currentData = formState.data

      return (
        currentData.title !== originalData.title ||
        currentData.description !== originalData.description ||
        currentData.thumbnail !== originalData.thumbnail ||
        currentData.category !== originalData.category ||
        currentData.status !== originalData.status
      )
    },
    [formState.data],
  )

  // Memoized computed values
  const currentFormErrors = useMemo(() => getFormErrors(), [getFormErrors])

  return {
    // Dialog state
    activeDialog,
    selectedCourse,

    // Form state
    formState,

    // Dialog actions
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,

    // Form actions
    updateFormData,
    validateForm,
    resetForm,
    setSubmitting,

    // File upload actions
    handleFileUpload,
    removeThumbnail,

    // Utility functions
    getFormErrors: () => currentFormErrors,
    hasFormChanges,
  }
}
