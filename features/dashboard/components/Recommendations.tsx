'use client'

/**
 * Recommendations Component
 *
 * Menampilkan rekomendasi kursus untuk user.
 * Mengikuti Ancient Fantasy Asia design system.
 */

import { Lightbulb, Sparkles } from 'lucide-react'
import type { Recommendation } from '../types'

interface RecommendationsProps {
  recommendations: Recommendation[]
}

/**
 * Difficulty color mapping untuk background tint
 */
const difficultyColors = {
  beginner: 'bg-hijau-50',
  intermediate: 'bg-kuning-50',
  advanced: 'bg-merah-50',
  critical: 'bg-merah-100',
  high: 'bg-merah-50',
}

/**
 * Recommendations Component
 *
 * Menampilkan kartu rekomendasi dengan:
 * - Title dan description
 * - Reasoning text
 * - Difficulty-based background tint
 * - Hover lift effect
 */
export function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-kuning-500" aria-hidden="true" />
        <h2 id="recommendations-title" className="text-xl font-semibold text-beige-900">
          Rekomendasi Untuk Anda
        </h2>
      </div>

      <div
        className="space-y-3"
        role="list"
        aria-labelledby="recommendations-title"
      >
        {recommendations.map((recommendation) => {
          const bgColor = difficultyColors[recommendation.difficulty || 'beginner'] || 'bg-beige-50'

          return (
            <article
              key={recommendation.id}
              className={`glass-panel-light rounded-lg p-5 hover-lift ${bgColor} transition-colors duration-200`}
              role="listitem"
              aria-label={`${recommendation.title}: ${recommendation.description}. ${recommendation.reason}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="shrink-0 w-10 h-10 bg-kuning-100 rounded-lg flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Lightbulb className="w-5 h-5 text-kuning-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-beige-900 mb-1">
                    {recommendation.title}
                  </h3>
                  <p className="text-sm text-beige-700 mb-2">
                    {recommendation.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-beige-600">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    <span>{recommendation.reason}</span>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
