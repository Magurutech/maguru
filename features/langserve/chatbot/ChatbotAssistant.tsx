'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatMessage } from './ChatMessage'
import { streamChatbot } from '@/features/langserve/api'
import type { ChatMessage as ChatMessageType, ChatbotProps } from './types'
import { cn } from '@/lib/utils'
import { logger } from '@/services/logger'

/**
 * ChatbotAssistant - AI Tutor with Push-Layout
 *
 * Features:
 * - Fixed circular FAB in bottom-right corner
 * - Push-layout: Content shrinks when chatbot opens
 * - Fixed 400px width panel
 * - Scale animation on open/close
 * - Full-screen on mobile
 * - X button close
 * - Real-time streaming from LangServe backend
 * - Ancient Fantasy Asia theme
 */
export function ChatbotAssistant({ context }: ChatbotProps) {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Helpers: Content truncation to reduce token usage
  const truncateContent = (content: string, maxLen = 1000): string => {
    if (content.length <= maxLen) return content
    return content.slice(0, maxLen) + '...'
  }

  // Helpers: Chat history formatting with limit
  const formatChatHistory = (msgs: ChatMessageType[]) => {
    return msgs
      .slice(-10) // Keep last 10 messages only
      .map((m) => ({ role: m.role, content: m.content }))
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Send message to LangServe backend
  const sendMessage = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isStreaming) return

    // Add user message
    const userMessage: ChatMessageType = {
      role: 'student',
      content: trimmedInput,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError(null)
    setIsStreaming(true)

    // Add placeholder AI message for streaming
    const aiMessageIndex = messages.length + 1
    setMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        content: '',
        timestamp: new Date().toISOString(),
      },
    ])

    try {
      // Prepare request with context
      const request = {
        question: trimmedInput,
        session_title: context.itemTitle,
        session_content: truncateContent(context.currentContent),
        chat_history: formatChatHistory(messages),
      }

      logger.info('ChatbotAssistant', 'sendMessage', 'Starting chatbot request', {
        question: trimmedInput,
        aiMessageIndex,
      })

      // Stream response
      await streamChatbot(request, {
        onChunk: (chunk: string) => {
          logger.debug('ChatbotAssistant', 'sendMessage', 'Chunk received in UI', {
            chunkLength: chunk.length,
            chunkPreview: chunk.substring(0, 30) + '...',
            aiMessageIndex,
          })

          setMessages((prev) => {
            const updated = [...prev]
            if (updated[aiMessageIndex]) {
              updated[aiMessageIndex].content += chunk
              logger.debug('ChatbotAssistant', 'sendMessage', 'Message state updated', {
                newContentLength: updated[aiMessageIndex].content.length,
              })
            } else {
              logger.warn('ChatbotAssistant', 'sendMessage', 'AI message not found at index', {
                aiMessageIndex,
                messageCount: updated.length,
              })
            }
            return updated
          })
        },
        onComplete: (fullResponse) => {
          logger.info('ChatbotAssistant', 'sendMessage', 'Stream completed', {
            totalLength: fullResponse.length,
          })
          setIsStreaming(false)
        },
        onError: (err: Error) => {
          logger.error('ChatbotAssistant', 'sendMessage', 'Stream error', err)
          setError(err.message)
          setIsStreaming(false)
        },
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response'
      setError(errorMessage)
      setIsStreaming(false)

      // Remove empty AI message on error
      setMessages((prev) => prev.filter((_, i) => i !== aiMessageIndex))
    }
  }

  // Clear all messages
  const clearMessages = () => {
    setMessages([])
    setError(null)
  }

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Push-Layout Panel */}
      <div
        ref={panelRef}
        className={cn(
          'fixed top-0 right-0 h-full bg-linear-gradient-to-br from-beige-50 to-white',
          'border-l border-beige-200/50 shadow-2xl z-40',
          'transition-all duration-300 ease-in-out origin-right',
          // Desktop: 50vw width (half screen)
          'w-0 max-w-0 lg:max-w-[50vw]',
          // Mobile: Full screen
          'max-w-full',
          isOpen && 'w-full max-w-full lg:max-w-[50vw]',
          // Scale animation
          !isOpen && 'scale-x-0 opacity-0',
          isOpen && 'scale-x-100 opacity-100'
        )}
      >
        {/* Panel Content */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-beige-200/50 p-4 bg-white/50 backdrop-blur-sm shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-linear-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="font-['Poppins'] font-semibold text-beige-900">AI Tutor</span>
              </div>

              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearMessages}
                    className="h-8 w-8 text-beige-600 hover:text-beige-900 hover:bg-beige-100"
                    aria-label="Clear messages"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-beige-600 hover:text-beige-900 hover:bg-beige-100"
                  aria-label="Close chatbot"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Course Context */}
            <div className="mt-2 text-xs text-beige-600 bg-beige-100/50 rounded-md px-3 py-1.5 truncate">
              <span className="font-medium">Course:</span> {context.courseTitle}
              {context.itemTitle && (
                <>
                  {' '}
                  <span className="font-medium">|</span>{' '}
                  <span className="font-medium">Topic:</span> {context.itemTitle}
                </>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div
            role="log"
            aria-live="polite"
            aria-atomic="false"
            className={cn(
              'flex-1 overflow-y-auto py-4 px-4',
              'scrollbar-thin scrollbar-thumb-beige-300 scrollbar-track-beige-100'
            )}
          >
            {messages.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 rounded-full bg-linear-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-['Poppins'] font-semibold text-beige-900 mb-2">
                  Your AI Learning Assistant
                </h3>
                <p className="text-sm text-beige-600 max-w-62 mb-6">
                  Ask me anything about your course content, and I&apos;ll help you understand
                  better!
                </p>
                <div className="flex flex-col gap-2 w-full max-w-60">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3 bg-white/50 border-beige-200 hover:bg-beige-100"
                    onClick={() => {
                      setInput('Explain this topic in simple terms')
                      inputRef.current?.focus()
                    }}
                  >
                    <span className="text-xs">Explain this topic simply</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3 bg-white/50 border-beige-200 hover:bg-beige-100"
                    onClick={() => {
                      setInput('Give me examples to understand better')
                      inputRef.current?.focus()
                    }}
                  >
                    <span className="text-xs">Give me examples</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3 bg-white/50 border-beige-200 hover:bg-beige-100"
                    onClick={() => {
                      setInput('Quiz me on this topic')
                      inputRef.current?.focus()
                    }}
                  >
                    <span className="text-xs">Quiz me on this</span>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                {messages.map((message, index) => (
                  <ChatMessage key={`msg-${index}`} message={message} />
                ))}

                {/* Streaming Indicator */}
                {isStreaming && (
                  <div className="flex gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-linear-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm border border-beige-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-beige-400 rounded-full animate-bounce" />
                        <span
                          className="w-2 h-2 bg-beige-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        />
                        <span
                          className="w-2 h-2 bg-beige-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                {/* Scroll Anchor */}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-beige-200/50 p-4 bg-white/50 backdrop-blur-sm shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={isStreaming}
                className={cn(
                  'flex-1 bg-white/80 backdrop-blur-sm border-beige-200',
                  'focus:border-amber-400 focus:ring-amber-400/20',
                  'placeholder:text-beige-400'
                )}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                className={cn(
                  'h-9 w-9 shrink-0',
                  'bg-linear-gradient-to-br from-amber-500 to-orange-600',
                  'hover:from-amber-600 hover:to-orange-700',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-beige-500 mt-2 text-center">
              AI responses are generated based on course content
            </p>
          </div>
        </div>
      </div>

      {/* FAB Trigger - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 right-4 z-50',
          'h-14 w-14 rounded-full shadow-lg',
          'transition-all duration-300 ease-in-out',
          'hover:scale-110 hover:shadow-xl',
          'bg-linear-gradient-to-br from-amber-500 to-orange-600',
          'hover:from-amber-600 hover:to-orange-700',
          'border-2 border-amber-300/50',
          'flex items-center justify-center',
          // Pulse animation when closed
          !isOpen && 'animate-pulse hover:animate-none',
          // Move FAB when panel is open (desktop only) - adjusted for 50vw
          isOpen && 'lg:translate-x-[calc(50vw-4rem)]'
        )}
        aria-label={isOpen ? 'Close AI Tutor' : 'Open AI Tutor'}
        aria-pressed={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white transition-transform duration-300" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white transition-transform duration-300" />
        )}
      </button>

      {/* Overlay for mobile (optional - to darken background when open) */}
      {isOpen && (
        <div
          className={cn(
            'fixed inset-0 bg-black/20 z-30 lg:hidden',
            'transition-opacity duration-300',
            'animate-in fade-in'
          )}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

// Bot icon component for reuse
function Bot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  )
}

// Named export for convenience
export default ChatbotAssistant