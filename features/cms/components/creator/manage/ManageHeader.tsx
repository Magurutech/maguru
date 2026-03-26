import { useRouter } from 'next/navigation'
import { ArrowLeft, Globe, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useManageContext } from '../../../Context/creator/ManageContext'

export function ManageHeader() {
  const router = useRouter()
  const { course, publishing, handleTogglePublish } = useManageContext()
  if (!course) return null

  const isPublished = course.status === 'PUBLISHED'

  return (
    <header className="bg-white border-b border-beige-200 shadow-sm px-6 py-4 flex items-center gap-4 shrink-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/creator/courses')}
        className="text-beige-600 hover:text-beige-900 hover:bg-beige-100 -ml-2"
        data-testid="back-to-courses-btn"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Kursus
      </Button>

      <div className="h-5 w-px bg-beige-200" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-lg font-bold text-beige-900 truncate">{course.title}</h1>
          <Badge
            variant="outline"
            className={
              isPublished
                ? 'bg-hijau-50 text-hijau-700 border-hijau-200 text-xs'
                : 'bg-kuning-50 text-kuning-700 border-kuning-200 text-xs'
            }
          >
            {course.status}
          </Badge>
          {course.category && <span className="text-xs text-beige-500">{course.category}</span>}
          {course.difficulty && <span className="text-xs text-beige-500">{course.difficulty}</span>}
        </div>
        {course.description && (
          <p className="text-xs text-beige-500 mt-0.5 truncate">{course.description}</p>
        )}
      </div>

      <Button
        size="sm"
        disabled={publishing}
        onClick={handleTogglePublish}
        data-testid="publish-toggle-btn"
        className={
          isPublished
            ? 'border-kuning-300 text-kuning-700 bg-kuning-50 hover:bg-kuning-100 border'
            : 'bg-hijau-500 hover:bg-hijau-600 text-white'
        }
      >
        {publishing ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent mr-2" />
        ) : isPublished ? (
          <EyeOff className="h-3.5 w-3.5 mr-1.5" />
        ) : (
          <Globe className="h-3.5 w-3.5 mr-1.5" />
        )}
        {publishing ? 'Menyimpan...' : isPublished ? 'Unpublish' : 'Publish'}
      </Button>
    </header>
  )
}
