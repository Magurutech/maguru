import { useRouter } from 'next/navigation'
import { ArrowLeft, Globe, EyeOff, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useManageContext } from '../../../Context/creator/ManageContext'

interface ManageHeaderProps {
  onToggleInspector?: () => void
  isInspectorOpen?: boolean
}

export function ManageHeader({ onToggleInspector, isInspectorOpen }: ManageHeaderProps) {
  const router = useRouter()
  const { course, publishing, handleTogglePublish } = useManageContext()
  if (!course) return null

  const isPublished = course.status === 'PUBLISHED'

  return (
    <header className="bg-card border-b border-border/10 px-6 py-4 flex items-center gap-4 shrink-0 paper-texture select-none">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/creator/courses')}
        className="text-text-secondary hover:text-text-primary hover:bg-bg-surface-accent -ml-2 rounded-full px-3 cursor-pointer"
        data-testid="back-to-courses-btn"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Kembali ke Pustaka
      </Button>

      <div className="h-5 w-px bg-border/10" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-bold text-accent-coral uppercase tracking-widest">
            {course.category || 'Materi'}
          </span>
          <h1 className="text-sm font-bold text-text-primary truncate">{course.title}</h1>
          <Badge
            variant="outline"
            className={
              isPublished
                ? 'bg-success/5 text-success border-success/10 text-[10px] font-bold uppercase tracking-wider'
                : 'bg-accent-mustard/15 text-accent-mustard border-accent-mustard/10 text-[10px] font-bold uppercase tracking-wider'
            }
          >
            {course.status}
          </Badge>
        </div>
      </div>

      {onToggleInspector && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleInspector}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-surface-accent rounded-full w-9 h-9 p-0 flex items-center justify-center cursor-pointer ${
            isInspectorOpen ? 'bg-bg-surface-accent text-accent-coral border border-accent-coral/20' : ''
          }`}
          title="Tampilkan Inspector"
        >
          <Sparkles className="w-4 h-4" />
        </Button>
      )}

      <Button
        size="sm"
        disabled={publishing}
        onClick={handleTogglePublish}
        data-testid="publish-toggle-btn"
        className={
          isPublished
            ? 'border-accent-mustard/20 text-accent-mustard bg-accent-mustard/5 hover:bg-accent-mustard/10 border cursor-pointer rounded-full px-4 text-xs font-bold'
            : 'bg-accent-coral hover:bg-accent-coral/95 text-white cursor-pointer rounded-full px-4 text-xs font-bold shadow-glow'
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
