import { CreatorProfileEditor } from '@/features/creator-dashboard/components/CreatorProfileEditor'
import React from 'react'

export default function CreatorProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="font-manrope text-3xl font-extrabold text-text-primary leading-tight tracking-tight">
          Profil Saya
        </h1>
        <p className="text-xs text-text-muted mt-1 font-sans">
          Kelola profil publik mentor, kualifikasi, statistik, dan jejaring sosial Anda.
        </p>
      </div>
      <CreatorProfileEditor />
    </div>
  )
}
