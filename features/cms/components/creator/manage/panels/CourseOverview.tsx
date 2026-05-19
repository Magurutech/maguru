'use client'

import { useState } from 'react'
import { Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useManageContext } from '../../../../Context/creator/ManageContext'
import { DescriptionEditor } from './DescriptionEditor'

const DIFFICULTY_LABEL: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
}

export function CourseOverview() {
  const { course, setCourse, sections, lessonsMap } = useManageContext()
  const [editingDesc, setEditingDesc] = useState(false)

  if (!course) return null

  const isPublished = course.status === 'PUBLISHED'
  const totalLessons = sections.reduce(
    (sum, s) => sum + (lessonsMap[s.id]?.length ?? s.lessonCount),
    0,
  )

  return (
    <div className="max-w-full" data-testid="course-overview-panel">
      <h1 className="text-3xl font-bold text-beige-900 leading-tight mb-3">{course.title}</h1>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {course.category && (
          <Badge
            variant="outline"
            className="bg-beige-100 text-beige-700 border-beige-300 text-xs font-normal"
          >
            {course.category}
          </Badge>
        )}
        {course.difficulty && (
          <Badge
            variant="outline"
            className="bg-beige-100 text-beige-700 border-beige-300 text-xs font-normal"
          >
            {DIFFICULTY_LABEL[course.difficulty] ?? course.difficulty}
          </Badge>
        )}
        <Badge
          variant="outline"
          className={
            isPublished
              ? 'bg-hijau-50 text-hijau-700 border-hijau-200 text-xs font-normal'
              : 'bg-kuning-50 text-kuning-700 border-kuning-200 text-xs font-normal'
          }
        >
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
        <span className="text-xs text-beige-400 ml-1">
          {sections.length} seksi &middot; {totalLessons} pelajaran
        </span>
      </div>

      <hr className="border-beige-200 mb-6" />

      <div className="group">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-beige-600">Deskripsi</span>
          {!editingDesc && (
            <button
              onClick={() => setEditingDesc(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-beige-100 text-beige-400 hover:text-beige-700"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {editingDesc ? (
          <DescriptionEditor
            courseSlug={course.slug}
            initialText={course.description ?? ''}
            onSave={(text) => {
              setCourse((prev) => (prev ? { ...prev, description: text } : prev))
              setEditingDesc(false)
            }}
            onCancel={() => setEditingDesc(false)}
          />
        ) : (
          <p
            className="text-beige-700 text-base leading-relaxed cursor-text hover:bg-beige-100/50 rounded-lg px-2 py-1 -mx-2 transition-colors"
            onClick={() => setEditingDesc(true)}
          >
            {course.description || (
              <span className="text-beige-400 italic">Tambahkan deskripsi kursus...</span>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
