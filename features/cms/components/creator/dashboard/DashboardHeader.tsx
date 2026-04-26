import React from 'react'
import Link from 'next/link'
import { PenTool, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
  firstName?: string | null
  role?: string | null
}

export function DashboardHeader({ firstName, role }: DashboardHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-neu border border-beige-200 p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-merah-100 rounded-lg">
            <PenTool className="w-6 h-6 text-merah-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-beige-900 font-serif">Creator Studio</h1>
            <p className="text-beige-600">
              Selamat berkarya, {firstName || 'Creator'}! - Role:{' '}
              <span className="font-semibold capitalize text-merah-600">{role}</span>
            </p>
          </div>
        </div>
        <Link href="/creator/courses/create">
          <Button className="bg-merah-500 hover:bg-merah-600 text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-200">
            <Plus className="w-4 h-4" />
            Buat Kursus Baru
          </Button>
        </Link>
      </div>
    </div>
  )
}
