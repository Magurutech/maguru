'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown, Edit, Trash2, Plus } from 'lucide-react'

/**
 * LessonList Component
 * 
 * Display all lessons in a section with CRUD operations.
 * Shows content preview and provides reordering controls.
 * 
 * Requirements: 2.1, 2.2, 2.4, 2.5, 2.6
 * Task: 10.2
 */

interface Lesson {
  id: string
  title: string
  order: number
  contentPreview: string
}

interface LessonListProps {
  sectionTitle: string
  lessons: Lesson[]
  onCreateLesson: () => void
  onEditLesson: (lessonId: string) => void
  onDeleteLesson: (lessonId: string) => void
  onReorderLesson: (lessonId: string, direction: 'up' | 'down') => void
}

export function LessonList({
  sectionTitle,
  lessons,
  onCreateLesson,
  onEditLesson,
  onDeleteLesson,
  onReorderLesson
}: LessonListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson? All progress data for this lesson will also be deleted.')) {
      return
    }

    setDeletingId(lessonId)
    try {
      await onDeleteLesson(lessonId)
    } finally {
      setDeletingId(null)
    }
  }

  const canMoveUp = (index: number) => index > 0
  const canMoveDown = (index: number) => index < lessons.length - 1

  return (
    <div className="lesson-list">
      <div className="lesson-list-header">
        <div>
          <h3 className="text-xl font-bold">{sectionTitle}</h3>
          <p className="text-sm text-gray-600">Manage lessons in this section</p>
        </div>
        <Button onClick={onCreateLesson} className="create-lesson-btn">
          <Plus className="h-4 w-4 mr-2" />
          Create Lesson
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="empty-state">
          <p className="text-gray-600">No lessons yet. Create your first lesson to get started.</p>
        </div>
      ) : (
        <div className="lessons-grid">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="lesson-card">
              <div className="lesson-info">
                <div className="lesson-header">
                  <h4 className="lesson-title">{lesson.title}</h4>
                  <span className="lesson-order">Order: {lesson.order}</span>
                </div>
                <p className="lesson-preview">{lesson.contentPreview}</p>
              </div>

              <div className="lesson-actions">
                <div className="reorder-buttons">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReorderLesson(lesson.id, 'up')}
                    disabled={!canMoveUp(index)}
                    aria-label="Move lesson up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReorderLesson(lesson.id, 'down')}
                    disabled={!canMoveDown(index)}
                    aria-label="Move lesson down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="crud-buttons">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditLesson(lesson.id)}
                    aria-label="Edit lesson"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(lesson.id)}
                    disabled={deletingId === lesson.id}
                    aria-label="Delete lesson"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deletingId === lesson.id ? 'Deleting...' : 'Delete'}
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
