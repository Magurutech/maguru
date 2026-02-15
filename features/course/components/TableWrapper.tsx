'use client'

import React from 'react'
import type { TableWrapperProps } from '../types/content-renderer.types'

export function TableWrapper({ children, node, ...props }: TableWrapperProps) {
  return (
    <div className="overflow-x-auto mb-4 rounded-lg border border-beige-300 shadow-sm">
      <table
        className="w-full border-collapse border border-beige-300 bg-white"
        {...props}
      >
        {children}
      </table>
    </div>
  )
}