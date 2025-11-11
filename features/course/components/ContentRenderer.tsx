'use client'

import { useEffect, useState } from 'react'
import { ContentRendererProps } from '../types/course.types'
import { Button } from '@/components/ui/button'
import { Copy, Check, ExternalLink } from 'lucide-react'

export function ContentRenderer({ content, contentType, className = '' }: ContentRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string>('')

  // Simple markdown parser (basic implementation)
  const parseMarkdown = (text: string): string => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-beige-900 mb-3 mt-6">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-beige-900 mb-4 mt-8">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-beige-900 mb-6 mt-8">$1</h1>')

      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')

      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1">$1 <ExternalLink className="w-3 h-3" /></a>')

      // Lists
      .replace(/^\* (.+)$/gim, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/<li[^>]*>[\s\S]*?<\/li>/g, '<ul class="list-disc list-inside mb-4 space-y-1">$&</ul>')

      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br />')

      // Paragraphs
      .replace(/^(?!<[h|u|p])/gim, '<p class="mb-4 text-beige-700 leading-relaxed">')
      .replace(/(?<!>)$/gim, '</p>')

      // Code blocks
      .replace(/```([^`]+)```/g, (match, code) => {
        const codeId = `code-${Math.random().toString(36).substr(2, 9)}`
        return `
          <div class="relative mb-6">
            <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre class="text-sm"><code id="${codeId}">${code.trim()}</code></pre>
            </div>
            <button
              onclick="copyCode('${codeId}', '${codeId.replace('code-', 'copy-')}')"
              class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
              title="Copy code"
              aria-label="Copy code to clipboard"
            >
              <svg id="${codeId.replace('code-', 'copy-')}" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        `
      })

      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')

      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-secondary-300 pl-4 py-2 mb-4 bg-beige-50 italic text-beige-700">$1</blockquote>')

      // Tables (basic)
      .replace(/\|(.+)\|/g, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell)
        if (cells.length > 1) {
          return `<tr>${cells.map((cell: string) => `<td class="border border-beige-300 px-4 py-2">${cell}</td>`).join('')}</tr>`
        }
        return match
      })
  }

  const renderContent = () => {
    switch (contentType) {
      case 'markdown':
        return { __html: parseMarkdown(content) }
      case 'video':
        return (
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Video content not yet supported</p>
          </div>
        )
      case 'quiz':
        return (
          <div className="bg-beige-50 border border-beige-200 rounded-lg p-8 text-center">
            <p className="text-beige-700">Quiz content not yet supported</p>
          </div>
        )
      case 'exercise':
        return (
          <div className="bg-beige-50 border border-beige-200 rounded-lg p-8 text-center">
            <p className="text-beige-700">Exercise content not yet supported</p>
          </div>
        )
      default:
        return { __html: content }
    }
  }

  // Add copy code functionality
  useEffect(() => {
    if (typeof window !== 'undefined' && contentType === 'markdown') {
      (window as any).copyCode = (codeId: string, copyIconId: string) => {
        const codeElement = document.getElementById(codeId)
        if (codeElement) {
          navigator.clipboard.writeText(codeElement.textContent || '')
          const copyIcon = document.getElementById(copyIconId)
          if (copyIcon) {
            copyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
            setTimeout(() => {
              copyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>'
            }, 2000)
          }
        }
      }
    }
  }, [contentType])

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {contentType === 'markdown' ? (
        <div
          dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          className="markdown-content"
        />
      ) : (
        (() => {
          switch (contentType) {
            case 'video':
              return (
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Video content not yet supported</p>
                </div>
              )
            case 'quiz':
              return (
                <div className="bg-beige-50 border border-beige-200 rounded-lg p-8 text-center">
                  <p className="text-beige-700">Quiz content not yet supported</p>
                </div>
              )
            case 'exercise':
              return (
                <div className="bg-beige-50 border border-beige-200 rounded-lg p-8 text-center">
                  <p className="text-beige-700">Exercise content not yet supported</p>
                </div>
              )
            default:
              return (
                <div className="bg-beige-50 border border-beige-200 rounded-lg p-8 text-center">
                  <p className="text-beige-700">Content type not supported</p>
                </div>
              )
          }
        })()
      )}

      <style jsx>{`
        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          scroll-margin-top: 2rem;
        }

        .markdown-content pre {
          background: #1f2937;
          color: #f9fafb;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          font-family: 'Fira Code', monospace;
        }

        .markdown-content code {
          font-family: 'Fira Code', monospace;
        }

        .markdown-content blockquote {
          border-left: 4px solid #f59e0b;
          padding-left: 1rem;
          margin: 1rem 0;
          background: #fef3c7;
          font-style: italic;
        }

        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .markdown-content th,
        .markdown-content td {
          border: 1px solid #d1d5db;
          padding: 0.5rem 1rem;
          text-align: left;
        }

        .markdown-content th {
          background: #f9fafb;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .markdown-content {
            font-size: 0.875rem;
          }

          .markdown-content pre {
            font-size: 0.75rem;
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  )
}