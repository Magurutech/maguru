'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown, Edit, Trash2, Plus } from 'lucide-react'

/**
 * SectionList Component
 * 
 * Display all sections for a course with CRUD operations.
 * Shows lesson count per section and provides reordering controls.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 * Task: 10.1
 */

interface Section {
  id: string
  title: string
  description: string | null
  order: number
  lessonCount: number
}

interface SectionListProps {
  sections: Section[]
  selectedSectionId?: string
  onCreateSection: () => void
  onEditSection: (sectionId: string) => void
  onDeleteSection: (sectionId: string) => void
  onReorderSection: (sectionId: string, direction: 'up' | 'down') => void
  onSelectSection?: (sectionId: string) => void
}

export function SectionList({
  sections,
  selectedSectionId,
  onCreateSection,
  onEditSection,
  onDeleteSection,
  onReorderSection,
  onSelectSection
}: SectionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section? All lessons in this section will also be deleted.')) {
      return
    }

    setDeletingId(sectionId)
    try {
      await onDeleteSection(sectionId)
    } finally {
      setDeletingId(null)
    }
  }

  const canMoveUp = (index: number) => index > 0
  const canMoveDown = (index: number) => index < sections.length - 1

  return (
    <div className="section-list">
      <div className="section-list-header">
        <h2 className="text-2xl font-bold">Course Sections</h2>
        <Button onClick={onCreateSection} className="create-section-btn">
          <Plus className="h-4 w-4 mr-2" />
          Create Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="empty-state">
          <p className="text-gray-600">No sections yet. Create your first section to get started.</p>
        </div>
      ) : (
        <div className="sections-grid">
          {sections.map((section, index) => (
            <div 
              key={section.id} 
              className={`section-card ${selectedSectionId === section.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''} cursor-pointer`}
              onClick={() => onSelectSection?.(section.id)}
            >
              <div className="section-info">
                <div className="section-header">
                  <h3 className="section-title">{section.title}</h3>
                  <span className="section-order">Order: {section.order}</span>
                </div>
                {section.description && (
                  <p className="section-description">{section.description}</p>
                )}
                <p className="lesson-count">
                  {section.lessonCount} {section.lessonCount === 1 ? 'lesson' : 'lessons'}
                </p>
              </div>

              <div className="section-actions">
                <div className="reorder-buttons">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReorderSection(section.id, 'up')}
                    disabled={!canMoveUp(index)}
                    aria-label="Move section up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReorderSection(section.id, 'down')}
                    disabled={!canMoveDown(index)}
                    aria-label="Move section down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="crud-buttons">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditSection(section.id)}
                    aria-label="Edit section"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
                    disabled={deletingId === section.id}
                    aria-label="Delete section"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deletingId === section.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
