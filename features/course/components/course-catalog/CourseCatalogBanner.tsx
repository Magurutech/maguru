import { Button } from '@/components/ui/button'
import { Gift, ArrowRight, X } from 'lucide-react'
import React from 'react'

interface CourseCatalogBannerProps {
  showBanner: boolean
  onClose: () => void
}

export function CourseCatalogBanner({ showBanner, onClose }: CourseCatalogBannerProps) {
  if (!showBanner) return null

  return (
    <div className="mb-8">
      <div className="glass-panel bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-300/40 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">🎉 New Year Special Offer!</h3>
              <p className="text-sm text-gray-700">
                Get 30% off on all Ancient Arts courses. Limited time only!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              Claim Offer
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
