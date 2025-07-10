import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import React from 'react'

interface EmptyStateIllustrationProps {
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function EmptyStateIllustration({
  hasActiveFilters,
  onClearFilters,
}: EmptyStateIllustrationProps) {
  return (
    <div className="col-span-full text-center py-16">
      <div className="glass-panel p-12 max-w-md mx-auto">
        {/* Mystical Empty State Illustration */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-full blur-xl" />
          <div className="relative w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center border-2 border-white/40">
            <Sparkles className="w-12 h-12 text-purple-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-200 rounded-full animate-pulse" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-200 rounded-full animate-pulse delay-300" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {hasActiveFilters ? 'No mystical courses found' : 'The ancient library awaits'}
        </h3>
        <p className="text-gray-600 mb-4">
          {hasActiveFilters
            ? 'Try adjusting your search terms or exploring different categories to discover hidden knowledge.'
            : 'Explore our collection of ancient wisdom and mystical arts to begin your journey.'}
        </p>
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="bg-white/50 border-white/50 hover:bg-white/70"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Clear filters & explore all
          </Button>
        )}
      </div>
    </div>
  )
}
