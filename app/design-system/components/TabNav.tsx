"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TabItem {
  name: string
  href: string
}

const tabs: TabItem[] = [
  { name: 'Beranda', href: '/design-system' },
  { name: 'Typography', href: '/design-system/typography' },
  { name: 'Colors', href: '/design-system/colors' },
  { name: 'UI Elements', href: '/design-system/ui-elements' },
]

export function TabNav() {
  const pathname = usePathname()

  return (
    <nav className="flex justify-center mb-12">
      <div className="flex gap-2 p-1.5 rounded-2xl debossed-skeuo max-w-max">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-6 py-2.5 rounded-xl font-medium text-body-md transition-all duration-300 btn-interactive text-center",
                isActive
                  ? "paper-skeuo border-b-2 border-b-accent-coral font-semibold text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
