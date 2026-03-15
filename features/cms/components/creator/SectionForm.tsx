'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

/**
 * SectionForm Component
 * 
 * Form for creating and editing sections.
 * Validates title, description, and order fields.
 * 
 * Requirements: 1.1, 1.3, 9.1, 9.5
 * Task: 10.3
 */

interface SectionFormData {
  title: string
  description: string
  order: number
}

interface SectionFormProps {
  initialData?: Partial<SectionFormData>
  onSubmit: (data: SectionFormData) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

export function SectionForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}: SectionFormProps) {
  const [formData, setFormData] = useState<SectionFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    order: initialData?.order || 1
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SectionFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SectionFormData, string>> = {}

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
      setErrors({ title: 'Failed to save section. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof SectionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="section-form">
      <div className="form-header">
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit Section' : 'Create Section'}
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
            placeholder="Enter section title"
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

        {/* Description Field */}
        <div className="form-field">
          <Label htmlFor="description">Description (Optional)</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="form-textarea"
            placeholder="Enter section description"
            rows={4}
          />
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
            Position of this section in the course (must be a positive integer)
          </p>
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
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Section' : 'Create Section'}
        </Button>
      </div>
    </form>
  )
}
