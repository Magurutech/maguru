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
      <div className="w-full rounded-2xl glass-panel card-ancient p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-beige-50 via-secondary/10 to-beige-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-beige-900 mb-2">
              🎉 New Year Special Offer!
            </h2>
            <p className="text-lg text-beige-800 mb-4">
              Get 30% off on all Ancient Arts courses. Limited time only!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="btn-primary px-6 py-3 rounded-lg text-lg font-semibold">
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
  )
}
