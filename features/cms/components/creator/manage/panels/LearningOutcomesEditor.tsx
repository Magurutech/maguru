'use client'

import { useState } from 'react'
import { Plus, Trash, ArrowUp, ArrowDown, Edit3, Target, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import React from 'react'

interface LearningOutcomesEditorProps {
  courseSlug: string
  initialOutcomes: string[]
  onSave?: (outcomes: string[]) => void
}

export function LearningOutcomesEditor({
  courseSlug,
  initialOutcomes = [],
  onSave
}: LearningOutcomesEditorProps) {
  const [outcomes, setOutcomes] = useState<string[]>(initialOutcomes)
  const [newOutcome, setNewOutcome] = useState('')
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const saveOutcomes = async (nextOutcomes: string[]) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/courses/${courseSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcomes: nextOutcomes }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Gagal menyimpan outcomes')
      }
      setOutcomes(nextOutcomes)
      if (onSave) onSave(nextOutcomes)
      toast.success('Target pembelajaran berhasil disimpan')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan outcomes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAdd = () => {
    setValidationError(null)
    const trimmed = newOutcome.trim()
    if (trimmed.length < 15 || trimmed.length > 255) {
      setValidationError('Minimal 15 karakter dan maksimal 255 karakter')
      return
    }
    if (outcomes.length >= 8) {
      toast.error('Maksimum 8 outcomes diperbolehkan')
      return
    }
    const nextOutcomes = [...outcomes, trimmed]
    saveOutcomes(nextOutcomes)
    setNewOutcome('')
  }

  const handleEditSave = (index: number) => {
    setValidationError(null)
    const trimmed = editValue.trim()
    if (trimmed.length < 15 || trimmed.length > 255) {
      setValidationError('Minimal 15 karakter dan maksimal 255 karakter')
      return
    }
    const nextOutcomes = [...outcomes]
    nextOutcomes[index] = trimmed
    saveOutcomes(nextOutcomes)
    setEditIdx(null)
    setEditValue('')
  }

  const handleDelete = (index: number) => {
    const nextOutcomes = outcomes.filter((_, idx) => idx !== index)
    saveOutcomes(nextOutcomes)
  }

  const moveItem = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= outcomes.length) return
    const next = [...outcomes]
    ;[next[index], next[target]] = [next[target], next[index]]
    saveOutcomes(next)
  }

  return (
    <div className="space-y-4 font-sans select-none" data-testid="learning-outcomes-editor">
      <div className="flex justify-between items-center border-b border-border/10 pb-2">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-4 h-4 text-accent-coral" />
          Target Pembelajaran
        </h3>
        <span className="text-[10px] font-mono text-text-muted bg-bg-bone px-2 py-0.5 rounded-full">
          ({outcomes.length}/8)
        </span>
      </div>

      {validationError && (
        <p className="text-[11px] font-medium text-error leading-none mb-1">
          {validationError}
        </p>
      )}

      {outcomes.length === 0 ? (
        <div className="p-6 bg-bg-bone/45 border border-border/10 rounded-2xl text-center space-y-2">
          <Target className="w-8 h-8 text-text-faint mx-auto" />
          <p className="text-xs text-text-secondary font-medium">Belum ada outcomes</p>
          <p className="text-[11px] text-text-muted">Tambahkan apa yang akan siswa pelajari setelah menyelesaikan kursus ini.</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {outcomes.map((outcome, idx) => {
            const isEditing = editIdx === idx
            return (
              <li
                key={idx}
                className="flex items-center gap-3 p-3 bg-bg-bone/45 border border-border/10 rounded-xl hover:bg-bg-bone transition-colors duration-150"
              >
                {isEditing ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 text-xs text-text-primary bg-card border border-border/15 p-2 rounded-xl focus:border-accent-coral focus:outline-none"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleEditSave(idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(idx)
                        if (e.key === 'Escape') setEditIdx(null)
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <>
                    <span className="text-xs text-text-secondary flex-1 leading-relaxed">
                      {outcome}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Up button */}
                      <button
                        title="Pindah ke atas"
                        onClick={() => moveItem(idx, 'up')}
                        disabled={idx === 0 || isSaving}
                        className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-surface-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Down button */}
                      <button
                        title="Pindah ke bawah"
                        onClick={() => moveItem(idx, 'down')}
                        disabled={idx === outcomes.length - 1 || isSaving}
                        className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-surface-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit button */}
                      <button
                        title="Edit outcome"
                        onClick={() => {
                          setEditIdx(idx)
                          setEditValue(outcome)
                        }}
                        disabled={isSaving}
                        className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-surface-accent transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete button */}
                      <button
                        title="Hapus outcome"
                        onClick={() => handleDelete(idx)}
                        disabled={isSaving}
                        className="p-1 rounded-full text-text-muted hover:text-error hover:bg-error/5 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {outcomes.length < 8 && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tambah outcome baru..."
            value={newOutcome}
            onChange={(e) => setNewOutcome(e.target.value)}
            disabled={isSaving}
            className="flex-1 text-xs text-text-primary bg-card border border-border/15 p-2 rounded-xl focus:border-accent-coral focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={isSaving}
            className="bg-accent-coral hover:bg-[#e25e4a] text-white rounded-xl px-4 text-xs font-bold shadow-glow shrink-0 cursor-pointer flex items-center gap-1"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            Tambah
          </Button>
        </div>
      )}
    </div>
  )
}
