'use client'

import React, { useMemo, useId } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useCopyCode } from '../hooks/useCopyCode'
import type { CodeBlockProps } from '../types/content-renderer.types'

export function CodeBlock({ children, className }: CodeBlockProps) {
  const { copyCode, isCopied } = useCopyCode()

  const codeId = useId()

  const language = useMemo(() => {
    if (!className) return 'text'
    return className.replace('language-', '')
  }, [className])

  const codeContent = useMemo(() => {
    return Array.isArray(children) ? children.join('') : String(children)
  }, [children])

  const handleCopy = () => {
    copyCode(codeContent, codeId)
  }

  return (
    <div className="relative mb-6 group">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
        <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-merah-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          title="Copy code to clipboard"
          aria-label="Copy code to clipboard"
        >
          {isCopied(codeId) ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content with syntax highlighting */}
      <div className="bg-gray-900 rounded-b-lg overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            fontFamily: '"Fira Code", "Monaco", "Cascadia Code", "Segoe UI Mono", monospace'
          }}
          codeTagProps={{
            className: 'text-gray-100'
          }}
          showLineNumbers
          wrapLines={false}
        >
          {codeContent}
        </SyntaxHighlighter>
      </div>

      {/* Glass panel effect */}
      <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-br from-transparent via-transparent to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}