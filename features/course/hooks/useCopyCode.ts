'use client'

import { useState, useCallback } from 'react'

export function useCopyCode() {
  const [copiedId, setCopiedId] = useState<string>('')

  const copyCode = useCallback(async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedId('')
      }, 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [])

  const isCopied = useCallback((id: string) => {
    return copiedId === id
  }, [copiedId])

  return { copyCode, isCopied }
}