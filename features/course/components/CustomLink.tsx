'use client'

import React from 'react'
import { ExternalLink } from 'lucide-react'
import type { CustomLinkProps } from '../types/content-renderer.types'

export function CustomLink({ href, children, ...props }: CustomLinkProps) {
  const isExternal = href?.startsWith('http') || href?.startsWith('https')

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-merah-600 hover:text-merah-700 underline decoration-2 transition-colors duration-200 ease-out hover:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-merah-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm"
        {...props}
      >
        {children}
        <ExternalLink className="w-3 h-3 inline-flex-shrink-0" aria-hidden="true" />
        <span className="sr-only">(opens in new tab)</span>
      </a>
    )
  }

  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 text-merah-600 hover:text-merah-700 underline decoration-2 transition-colors duration-200 ease-out hover:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-merah-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm"
      {...props}
    >
      {children}
    </a>
  )
}