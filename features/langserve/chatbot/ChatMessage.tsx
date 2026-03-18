'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { User, Bot } from 'lucide-react'
import type { ChatMessage } from './types'
import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'

interface ChatMessageProps {
  message: ChatMessage
  className?: string
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isAi = message.role === 'ai'

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isAi ? 'justify-start' : 'justify-end',
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isAi
            ? 'bg-linear-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md'
            : 'bg-linear-gradient-to-br from-beige-200 to-beige-300 text-beige-700 shadow-sm'
        )}
      >
        {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[85%] rounded-2xl px-3 py-2 shadow-sm',
          isAi
            ? 'bg-white/90 backdrop-blur-sm border border-beige-200 text-beige-900 rounded-tl-sm'
            : 'bg-linear-gradient-to-br from-amber-500 to-orange-600 text-white rounded-tr-sm'
        )}
      >
        {isAi ? (
          <div className="prose prose-xs prose-beige max-w-none text-xs">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                p: ({ children }) => <p className="mb-1.5 last:mb-0 text-xs leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-1.5 text-xs">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-1.5 text-xs">{children}</ol>,
                li: ({ children }) => <li className="mb-0.5 text-xs">{children}</li>,
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <code
                      className={cn(
                        'block bg-beige-100 rounded-md px-2 py-1.5 text-xs font-mono overflow-x-auto',
                        'border border-beige-200'
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      className={cn(
                        'bg-beige-100 text-beige-800 px-1 py-0.5 rounded text-xs font-mono',
                        'border border-beige-200'
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="bg-beige-100 rounded-md p-2 overflow-x-auto border border-beige-200 text-xs">
                    {children}
                  </pre>
                ),
                h1: ({ children }) => <h1 className="text-sm font-bold mb-1.5 text-beige-900">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xs font-bold mb-1.5 text-beige-900">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xs font-semibold mb-1 text-beige-900">{children}</h3>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-amber-600 hover:text-amber-700 underline text-xs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-amber-400 pl-2 italic text-beige-700 text-xs">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-xs whitespace-pre-wrap wrap-break-word">{message.content}</p>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <div
            className={cn(
              'text-xs mt-1 opacity-60',
              isAi ? 'text-beige-600' : 'text-white'
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </div>
  )
}