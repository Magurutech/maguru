'use client'

/**
 * CourseCreationForm Component
 * Quick Start form for creating a new course.
 * Requirements: 5.1, 5.2, 5.6, 5.7, 5.8, 5.9, 5.10
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import type { CourseFormData } from '@/features/cms/types'

interface CreatedCourse {
  id: string
  title: string
  status: string
}

interface CourseCreationFormProps {
  onSuccess: (course: CreatedCourse) => void
}

type FormErrors = Partial<Record<keyof CourseFormData, string>>

const DIFFICULTY_OPTIONS = ['Pemula', 'Menengah', 'Mahir'] as const
const STATUS_OPTIONS = ['DRAFT', 'PUBLISHED'] as const

function validate(data: CourseFormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.title.trim()) {
    errors.title = 'Judul kursus wajib diisi'
  } else if (data.title.trim().length > 100) {
    errors.title = 'Judul tidak boleh lebih dari 100 karakter'
  }

  if (!data.description.trim()) {
    errors.description = 'Deskripsi kursus wajib diisi'
  }

  if (!data.category.trim()) {
    errors.category = 'Kategori wajib diisi'
  }

  if (!data.difficulty) {
    errors.difficulty = 'Tingkat kesulitan wajib dipilih'
  }

  if (!data.status) {
    errors.status = 'Status wajib dipilih'
  }

  return errors
}

export function CourseCreationForm({ onSuccess }: CourseCreationFormProps) {
  const [form, setForm] = useState<CourseFormData>({
    title: '',
    description: '',
    category: '',
    difficulty: 'Pemula',
    status: 'DRAFT',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function handleChange(field: keyof CourseFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear field error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/creator/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Gagal membuat kursus')
        return
      }

      onSuccess(data.course)
    } catch {
      setServerError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" data-testid="course-creation-form">
      {serverError && (
        <div
          data-testid="server-error"
          className="rounded-md bg-merah-50 border border-merah-200 px-4 py-3 text-sm text-merah-700"
        >
          {serverError}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-beige-800 font-medium">
          Judul Kursus <span className="text-merah-500">*</span>
        </Label>
        <Input
          id="title"
          value={form.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="Contoh: Belajar React dari Nol"
          maxLength={100}
          data-testid="input-title"
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={errors.title ? 'border-merah-400 focus-visible:ring-merah-400' : ''}
          disabled={submitting}
        />
        {errors.title && <p id="title-error" data-testid="error-title" className="text-xs text-merah-600">{errors.title}</p>}
        <p className="text-xs text-beige-500">{form.title.length}/100 karakter</p>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-beige-800 font-medium">
          Deskripsi <span className="text-merah-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={e => handleChange('description', e.target.value)}
          placeholder="Jelaskan apa yang akan dipelajari dalam kursus ini..."
          rows={4}
          data-testid="input-description"
          aria-describedby={errors.description ? 'description-error' : undefined}
          className={errors.description ? 'border-merah-400 focus-visible:ring-merah-400' : ''}
          disabled={submitting}
        />
        {errors.description && <p id="description-error" data-testid="error-description" className="text-xs text-merah-600">{errors.description}</p>}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="category" className="text-beige-800 font-medium">
          Kategori <span className="text-merah-500">*</span>
        </Label>
        <Input
          id="category"
          value={form.category}
          onChange={e => handleChange('category', e.target.value)}
          placeholder="Contoh: Pemrograman Web, Data Science, Desain"
          data-testid="input-category"
          aria-describedby={errors.category ? 'category-error' : undefined}
          className={errors.category ? 'border-merah-400 focus-visible:ring-merah-400' : ''}
          disabled={submitting}
        />
        {errors.category && <p id="category-error" data-testid="error-category" className="text-xs text-merah-600">{errors.category}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Difficulty */}
        <div className="space-y-1.5">
          <Label className="text-beige-800 font-medium">
            Tingkat Kesulitan <span className="text-merah-500">*</span>
          </Label>
          <Select
            value={form.difficulty}
            onValueChange={val => handleChange('difficulty', val)}
            disabled={submitting}
          >
            <SelectTrigger className={errors.difficulty ? 'border-merah-400' : ''}>
              <SelectValue placeholder="Pilih tingkat kesulitan" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.difficulty && <p className="text-xs text-merah-600">{errors.difficulty}</p>}
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-beige-800 font-medium">
            Status <span className="text-merah-500">*</span>
          </Label>
          <Select
            value={form.status}
            onValueChange={val => handleChange('status', val)}
            disabled={submitting}
          >
            <SelectTrigger className={errors.status ? 'border-merah-400' : ''}>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && <p className="text-xs text-merah-600">{errors.status}</p>}
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        data-testid="submit-course-btn"
        className="w-full bg-merah-500 hover:bg-merah-600 text-white font-semibold py-2.5 transition-all duration-200"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Membuat Kursus...
          </span>
        ) : (
          'Buat Kursus'
        )}
      </Button>
    </form>
  )
}
