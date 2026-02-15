'use client'

/**
 * Dashboard Error Component
 *
 * Error boundary fallback untuk dashboard components.
 */

import { AlertCircle, RefreshCw } from 'lucide-react'

interface DashboardErrorProps {
  message?: string
  onRetry?: () => void
}

export function DashboardError({ message = 'Terjadi kesalahan', onRetry }: DashboardErrorProps) {
  return (
    <div className="glass-panel-light rounded-lg p-8 text-center" role="alert" aria-live="polite">
      <AlertCircle className="w-12 h-12 text-merah-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-beige-900 mb-2">Oops! Ada yang salah</h3>
      <p className="text-beige-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-merah-500 hover:bg-merah-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          aria-label="Coba lagi"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      )}
    </div>
  )
}
