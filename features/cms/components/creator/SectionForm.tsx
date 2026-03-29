'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

/**
 * SectionForm Component
 * Used only for editing existing sections (title only).
 * Creating sections is now done inline in the sidebar.
 *
 * Requirements: 1.3, 9.1
 */

interface SectionFormData {
  title: string
  description: string
  order: number
}

interface SectionFormProps {
  initialData?: { title?: string }
  onSubmit: (data: SectionFormData) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

export function SectionForm({ initialData, onSubmit, onCancel, isEditing = false }: SectionFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('Judul tidak boleh kosong'); return }
    if (title.length > 200) { setError('Judul maksimal 200 karakter'); return }

    setIsSubmitting(true)
    try {
      // Pass through with placeholder values for description/order — backend handles order
      await onSubmit({ title: title.trim(), description: '', order: 0 })
    } catch {
      setError('Gagal menyimpan seksi. Coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="section-title">
          Judul Seksi <span className="text-red-600">*</span>
        </Label>
        <input
          id="section-title"
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError('') }}
          className="w-full border border-beige-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-merah-300"
          placeholder="Masukkan judul seksi"
          maxLength={200}
          autoFocus
          data-testid="section-title-input"
        />
        {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
        <p className="text-xs text-beige-400">{title.length}/200 karakter</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} data-testid="section-form-submit">
          {isSubmitting ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Buat Seksi'}
        </Button>
      </div>
    </form>
  )
}
