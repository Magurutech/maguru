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
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isAi
            ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md'
            : 'bg-gradient-to-br from-beige-200 to-beige-300 text-beige-700 shadow-sm'
        )}
      >
        {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
          isAi
            ? 'bg-white/90 backdrop-blur-sm border border-beige-200 text-beige-900 rounded-tl-sm'
            : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-tr-sm'
        )}
      >
        {isAi ? (
          <div className="prose prose-sm prose-beige max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <code
                      className={cn(
                        'block bg-beige-100 rounded-md px-3 py-2 text-sm font-mono overflow-x-auto',
                        'border border-beige-200'
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      className={cn(
                        'bg-beige-100 text-beige-800 px-1.5 py-0.5 rounded text-sm font-mono',
                        'border border-beige-200'
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="bg-beige-100 rounded-md p-3 overflow-x-auto border border-beige-200">
                    {children}
                  </pre>
                ),
                h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-beige-900">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-beige-900">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mb-2 text-beige-900">{children}</h3>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-amber-600 hover:text-amber-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-amber-400 pl-3 italic text-beige-700">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
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
