import Link from 'next/link'
import { BookOpen, BarChart3, Layers } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

/**
 * CourseCard Component
 *
 * Reusable card for displaying course info in 3 contexts:
 * - Student catalog: "Daftar Sekarang" or "Lanjut Belajar"
 * - My Courses: shows progress bar
 * - Creator dashboard: shows "Manage" button
 *
 * Requirements: 1.5, 1.6, 1.7, 4.2
 */

export interface CourseCardCourse {
  id: string
  title: string
  description: string | null
  category: string
  difficulty: string | null
  status: string
  sectionCount?: number
  lessonCount?: number
}

interface CourseCardProps {
  course: CourseCardCourse
  enrolled?: boolean
  onEnroll?: () => void
  enrolling?: boolean
  showManage?: boolean
  progress?: number
  enrolledAt?: Date | string
}

const difficultyColor: Record<string, string> = {
  Pemula: 'bg-hijau-100 text-hijau-700 border-hijau-200',
  Menengah: 'bg-kuning-100 text-kuning-700 border-kuning-200',
  Mahir: 'bg-merah-100 text-merah-700 border-merah-200',
}

function truncate(text: string | null, max: number): string {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}

export function CourseCard({
  course,
  enrolled = false,
  onEnroll,
  enrolling = false,
  showManage = false,
  progress,
  enrolledAt,
}: CourseCardProps) {
  const difficultyClass =
    course.difficulty && difficultyColor[course.difficulty]
      ? difficultyColor[course.difficulty]
      : 'bg-beige-100 text-beige-700 border-beige-200'

  return (
    <div className="bg-white rounded-xl border border-beige-200 shadow-neu hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="text-xs bg-beige-50 text-beige-700 border-beige-200"
          >
            {course.category}
          </Badge>
          {course.difficulty && (
            <Badge variant="outline" className={`text-xs ${difficultyClass}`}>
              {course.difficulty}
            </Badge>
          )}
          {showManage && (
            <Badge
              variant="outline"
              className={`text-xs ml-auto ${
                course.status === 'PUBLISHED'
                  ? 'bg-hijau-50 text-hijau-700 border-hijau-200'
                  : 'bg-kuning-50 text-kuning-700 border-kuning-200'
              }`}
            >
              {course.status}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-beige-900 text-base leading-snug line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="text-sm text-beige-600 leading-relaxed flex-1">
            {truncate(course.description, 150)}
          </p>
        )}

        {/* Meta: sections & lessons */}
        {(course.sectionCount !== undefined || course.lessonCount !== undefined) && (
          <div className="flex items-center gap-4 text-xs text-beige-500 mt-auto">
            {course.sectionCount !== undefined && (
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {course.sectionCount} seksi
              </span>
            )}
            {course.lessonCount !== undefined && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {course.lessonCount} pelajaran
              </span>
            )}
          </div>
        )}

        {/* Progress bar (My Courses view) */}
        {enrolled && progress !== undefined && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs text-beige-600">
              <span>Progress</span>
              <span className="font-medium text-hijau-700">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-beige-100 [&>div]:bg-hijau-500" />
            {enrolledAt && (
              <p className="text-xs text-beige-400">
                Terdaftar:{' '}
                {new Date(enrolledAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Actions */}
      <div className="px-5 pb-5 pt-0 flex gap-2">
        {showManage ? (
          <>
            <Link href={`/creator/courses/${course.id}/manage`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-beige-300 text-beige-700 hover:bg-beige-50 hover:scale-105 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-1.5" />
                Manage
              </Button>
            </Link>
          </>
        ) : enrolled ? (
          <Link href={`/course/${course.id}/learn`} className="flex-1">
            <Button
              size="sm"
              className="w-full bg-hijau-500 hover:bg-hijau-600 text-white hover:scale-105 transition-all duration-200"
            >
              Lanjut Belajar
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={onEnroll}
            disabled={enrolling}
            className="flex-1 bg-merah-500 hover:bg-merah-600 text-white hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {enrolling ? 'Mendaftar...' : 'Daftar Sekarang'}
          </Button>
        )}
      </div>
    </div>
  )
}
