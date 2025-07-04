import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  onResetFilter: () => void
}

export function EmptyState({ onResetFilter }: EmptyStateProps) {
  return (
    <Card className="mt-8 glass-panel border-beige-300">
      <CardContent className="p-12 text-center">
        <div className="text-6xl mb-4 whimsical-bounce">🔍</div>
        <h3 className="text-xl font-semibold text-beige-900 mb-2">Tidak ada kursus ditemukan</h3>
        <p className="text-beige-700 mb-6">
          Coba ubah kata kunci pencarian atau filter yang Anda gunakan
        </p>
        <Button onClick={onResetFilter} variant="outline" className="btn-secondary hover-glow">
          Reset Filter
        </Button>
      </CardContent>
    </Card>
  )
}
