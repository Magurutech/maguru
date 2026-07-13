import React from 'react'
import { TabNav } from './components/TabNav'

export const metadata = {
  title: 'Maguru Design System Handbook',
  description: 'Dokumentasi visual dan panduan implementasi frontend untuk sistem desain Maguru (Atelier Zero).',
}

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ancient-fantasy relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background SVG Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none paper-texture opacity-40 dark:opacity-60" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-10 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold font-cinzel tracking-widest gold-skeuo mb-3">
            VER. I.O
          </div>
          <h1 className="text-display-l font-manrope font-bold text-text-primary tracking-tight mb-2">
            Maguru Design System
          </h1>
          <p className="text-body-md text-text-muted max-w-xl mx-auto">
            Panduan visual taktil bernuansa <strong className="text-text-primary font-semibold">Atelier Zero</strong>. Menggabungkan sensasi cetak fisik dengan interaksi digital 3D modern.
          </p>
        </header>

        {/* Tab Navigation */}
        <TabNav />

        {/* Main Content Area */}
        <main className="animate-fade-in">
          {children}
        </main>

        <footer className="mt-20 py-8 border-t border-text-faint/10 text-center">
          <p className="text-caption text-text-faint font-cinzel tracking-widest">
            DESIGN SYSTEM ARCHITECT • MANUS ZERO LABS
          </p>
        </footer>
      </div>
    </div>
  )
}
