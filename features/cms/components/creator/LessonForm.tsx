'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LessonEditor } from './LessonEditor'
import { JSONContent } from '@tiptap/react'

/**
 * LessonForm Component
 * 
 * Form for creating and editing lessons.
 * Integrates LessonEditor for content editing.
 * Validates title and order fields.
 * 
 * Requirements: 2.1, 2.4, 9.2, 9.6
 * Task: 10.4
 */

interface LessonContent {
  content: JSONContent
  version: number
  lastEdit: string
}

interface LessonFormData {
  title: string
  content: LessonContent
  order: number
}

interface LessonFormProps {
  initialData?: Partial<LessonFormData>
  onSubmit: (data: LessonFormData) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

export function LessonForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}: LessonFormProps) {
  const [formData, setFormData] = useState<LessonFormData>({
    title: initialData?.title || '',
    content: initialData?.content || {
      content: { type: 'doc', content: [] },
      version: 1,
      lastEdit: new Date().toISOString()
    },
    order: initialData?.order || 1
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LessonFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LessonFormData, string>> = {}

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters'
    }

    // Validate order
    if (formData.order < 1) {
      newErrors.order = 'Order must be a positive integer'
    }
    if (!Number.isInteger(formData.order)) {
      newErrors.order = 'Order must be an integer'
    }

    // Validate content
    if (!formData.content.content || formData.content.content.type !== 'doc') {
      newErrors.content = 'Invalid lesson content'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ title: 'Failed to save lesson. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof LessonFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleContentSave = async (content: LessonContent) => {
    setFormData(prev => ({ ...prev, content }))
    // Clear content error if exists
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="lesson-form">
      <div className="form-header">
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit Lesson' : 'Create Lesson'}
        </h2>
      </div>

      <div className="form-fields">
        {/* Title Field */}
        <div className="form-field">
          <Label htmlFor="title">
            Title <span className="text-red-600">*</span>
          </Label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter lesson title"
            maxLength={200}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="error-message" role="alert">
              {errors.title}
            </p>
          )}
          <p className="field-hint">
            {formData.title.length}/200 characters
          </p>
        </div>

        {/* Order Field */}
        <div className="form-field">
          <Label htmlFor="order">
            Order <span className="text-red-600">*</span>
          </Label>
          <input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => handleChange('order', parseInt(e.target.value) || 1)}
            className={`form-input ${errors.order ? 'error' : ''}`}
            min={1}
            step={1}
            aria-invalid={!!errors.order}
            aria-describedby={errors.order ? 'order-error' : undefined}
          />
          {errors.order && (
            <p id="order-error" className="error-message" role="alert">
              {errors.order}
            </p>
          )}
          <p className="field-hint">
            Position of this lesson in the section (must be a positive integer)
          </p>
        </div>

        {/* Content Editor */}
        <div className="form-field">
          <Label>
            Content <span className="text-red-600">*</span>
          </Label>
          <LessonEditor
            initialContent={formData.content.content}
            onSave={handleContentSave}
          />
          {errors.content && (
            <p className="error-message" role="alert">
              {errors.content}
            </p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Lesson' : 'Create Lesson'}
        </Button>
      </div>
    </form>
  )
}
