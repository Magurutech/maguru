"use client"

import React from 'react'
import Link from 'next/link'

interface NavCardProps {
  href: string
  title: string
  description: string
  detail: string
}

export function NavCard({ href, title, description, detail }: NavCardProps) {
  return (
    <Link href={href} className="block group">
      <div
        className="rounded-xl p-5 h-full space-y-2 transition-all duration-200"
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid rgba(21, 20, 15, 0.1)',
          boxShadow: '0 1px 3px rgba(21, 20, 15, 0.08)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = '0 4px 12px rgba(21, 20, 15, 0.12)'
          el.style.borderColor = 'rgba(237, 111, 92, 0.35)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = ''
          el.style.boxShadow = '0 1px 3px rgba(21, 20, 15, 0.08)'
          el.style.borderColor = 'rgba(21, 20, 15, 0.1)'
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p
              className="font-manrope font-semibold"
              style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}
            >
              {title}
            </p>
            <p className="text-caption" style={{ color: 'var(--color-accent-coral)' }}>
              {description}
            </p>
          </div>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 shrink-0 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5"
            style={{ color: 'var(--color-text-faint)' }}
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-caption leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {detail}
        </p>
      </div>
    </Link>
  )
}
