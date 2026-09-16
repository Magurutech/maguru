'use client'

import React, { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { User, Bot, Copy, Check, RotateCcw } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from './types'
import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'

interface ChatMessageProps {
  message: ChatMessageType
  className?: string
  onRetry?: () => void
}

/**
 * Enhanced CodeBlock component with Copy Code Button (TSK-05)
 */
function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }, [code])

  return (
    <div className="relative my-2 rounded-lg overflow-hidden border border-text-primary/15 dark:border-white/15 bg-[#18191B] text-[#E4E4E7] shadow-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#232428] border-b border-white/10 text-[11px] font-mono text-text-faint">
        <span className="font-semibold lowercase text-accent-coral/90">{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10.5px] font-sans px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-text-primary dark:text-white transition-all cursor-pointer"
          title="Salin cuplikan kode"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 opacity-80" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-3 overflow-x-auto text-[12px] font-mono leading-relaxed bg-[#18191B]">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function ChatMessage({ message, className, onRetry }: ChatMessageProps) {
  const [messageCopied, setMessageCopied] = useState(false)

  // 1. System Divider Message (TSK-03)
  if (message.role === 'system') {
    return (
      <div className="flex items-center justify-center my-3.5 px-4 animate-in fade-in zoom-in-95 duration-300">
        <span className="text-[11px] font-mono text-text-faint bg-bg-surface-accent/80 border border-text-primary/10 rounded-full px-3.5 py-1 shadow-2xs text-center">
          {message.content}
        </span>
      </div>
    )
  }

  const isAi = message.role === 'ai'
  const isError = message.isError

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setMessageCopied(true)
      setTimeout(() => setMessageCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div
      className={cn(
        'group flex gap-2.5 mb-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isAi ? 'justify-start' : 'justify-end',
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-xs text-xs select-none',
          isAi
            ? isError
              ? 'bg-red-500 text-white'
              : 'bg-accent-coral text-white'
            : 'bg-accent-mustard/90 text-text-primary font-bold'
        )}
      >
        {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
      </div>

      {/* Message Content Bubble */}
      <div
        className={cn(
          'relative flex-1 max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs',
          isAi
            ? isError
              ? 'bg-red-500/10 border border-red-500/25 text-text-primary rounded-tl-xs'
              : 'bg-bg-surface-accent/70 border border-text-primary/10 text-text-primary rounded-tl-xs backdrop-blur-xs'
            : 'bg-accent-coral text-white rounded-tr-xs shadow-xs'
        )}
      >
        {isAi ? (
          <div className="prose prose-xs max-w-none text-xs text-text-primary leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '')
                  const codeString = String(children).replace(/\n$/, '')
                  if (match) {
                    return <CodeBlock language={match[1]} code={codeString} />
                  }
                  return (
                    <code
                      className="bg-text-primary/8 dark:bg-white/10 text-accent-coral font-mono px-1.5 py-0.5 rounded text-[11.5px] border border-text-primary/10"
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => <div className="not-prose">{children}</div>,
                h1: ({ children }) => <h1 className="text-sm font-bold mt-2 mb-1.5 text-text-primary">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xs font-bold mt-2 mb-1 text-text-primary">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xs font-semibold mt-1.5 mb-0.5 text-text-primary">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-3 border-accent-coral/60 pl-2.5 my-1.5 italic text-text-muted">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>

            {/* Retry Button on Error (TSK-07) */}
            {isError && onRetry && (
              <div className="mt-2.5 pt-2 border-t border-red-500/20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 font-medium text-[11px] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words leading-relaxed text-white font-sans">{message.content}</p>
        )}

        {/* Bubble Footer Bar (Timestamp & Copy Message Action) */}
        <div className="flex items-center justify-between mt-1.5 pt-1 text-[10px] text-text-faint select-none">
          <span>
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </span>

          {isAi && !isError && message.content && (
            <button
              type="button"
              onClick={handleCopyMessage}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-text-muted hover:text-text-primary transition-all cursor-pointer px-1 py-0.5 rounded"
              title="Salin seluruh teks pesan"
            >
              {messageCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 opacity-80" />
                  <span>Salin Pesan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}