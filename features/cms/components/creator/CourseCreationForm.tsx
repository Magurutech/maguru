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
    <form onSubmit={handleSubmit} className="space-y-5 select-none" data-testid="course-creation-form">
      {serverError && (
        <div
          data-testid="server-error"
          className="rounded-2xl bg-accent-coral/5 border border-accent-coral/15 px-4 py-3 text-xs font-bold text-accent-coral uppercase font-mono tracking-wide"
        >
          {serverError}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">
          Judul Kursus <span className="text-accent-coral">*</span>
        </Label>
        <Input
          id="title"
          value={form.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="Contoh: Belajar Next.js dari Nol"
          maxLength={100}
          data-testid="input-title"
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={`bg-card border-border/10 rounded-xl px-4 focus-visible:ring-accent-coral/20 focus-visible:border-accent-coral font-sans ${errors.title ? 'border-accent-coral focus-visible:ring-accent-coral/20' : ''}`}
          disabled={submitting}
        />
        {errors.title && <p id="title-error" data-testid="error-title" className="text-xs text-accent-coral font-bold font-sans">{errors.title}</p>}
        <p className="text-[10px] text-text-muted font-bold font-mono text-right">{form.title.length}/100 karakter</p>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">
          Deskripsi <span className="text-accent-coral">*</span>
        </Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={e => handleChange('description', e.target.value)}
          placeholder="Jelaskan apa saja yang akan dibahas di materi kursus ini..."
          rows={4}
          data-testid="input-description"
          aria-describedby={errors.description ? 'description-error' : undefined}
          className={`bg-card border-border/10 rounded-xl px-4 py-3 focus-visible:ring-accent-coral/20 focus-visible:border-accent-coral font-sans ${errors.description ? 'border-accent-coral focus-visible:ring-accent-coral/20' : ''}`}
          disabled={submitting}
        />
        {errors.description && <p id="description-error" data-testid="error-description" className="text-xs text-accent-coral font-bold font-sans">{errors.description}</p>}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="category" className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">
          Kategori <span className="text-accent-coral">*</span>
        </Label>
        <Input
          id="category"
          value={form.category}
          onChange={e => handleChange('category', e.target.value)}
          placeholder="Contoh: Pemrograman Web, Desain Interface, dll."
          data-testid="input-category"
          aria-describedby={errors.category ? 'category-error' : undefined}
          className={`bg-card border-border/10 rounded-xl px-4 focus-visible:ring-accent-coral/20 focus-visible:border-accent-coral font-sans ${errors.category ? 'border-accent-coral focus-visible:ring-accent-coral/20' : ''}`}
          disabled={submitting}
        />
        {errors.category && <p id="category-error" data-testid="error-category" className="text-xs text-accent-coral font-bold font-sans">{errors.category}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Difficulty */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">
            Tingkat Kesulitan <span className="text-accent-coral">*</span>
          </Label>
          <Select
            value={form.difficulty}
            onValueChange={val => handleChange('difficulty', val)}
            disabled={submitting}
          >
            <SelectTrigger className={`bg-card border-border/10 rounded-xl focus:ring-accent-coral/20 ${errors.difficulty ? 'border-accent-coral' : ''}`}>
              <SelectValue placeholder="Pilih tingkat kesulitan" />
            </SelectTrigger>
            <SelectContent className="paper-texture">
              {DIFFICULTY_OPTIONS.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.difficulty && <p className="text-xs text-accent-coral font-bold font-sans">{errors.difficulty}</p>}
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">
            Status <span className="text-accent-coral">*</span>
          </Label>
          <Select
            value={form.status}
            onValueChange={val => handleChange('status', val)}
            disabled={submitting}
          >
            <SelectTrigger className={`bg-card border-border/10 rounded-xl focus:ring-accent-coral/20 ${errors.status ? 'border-accent-coral' : ''}`}>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent className="paper-texture">
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && <p className="text-xs text-accent-coral font-bold font-sans">{errors.status}</p>}
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        data-testid="submit-course-btn"
        className="w-full bg-accent-coral hover:bg-accent-coral/95 text-white font-bold py-2.5 transition-all duration-200 rounded-full shadow-glow cursor-pointer text-sm"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
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
