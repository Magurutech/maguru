'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Sparkles, RefreshCw, StopCircle } from 'lucide-react'
import { useAIChat } from '@/hooks/useAIChat'

interface AIChatBubbleProps {
  courseId: string
  courseTitle?: string
  sessionTitle?: string
  sessionContent?: string
}

export function AIChatBubble({
  courseId,
  courseTitle = 'Kursus',
  sessionTitle = '',
  sessionContent = '',
}: AIChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
    clearMessages,
  } = useAIChat({ courseId })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    const text = input
    setInput('')
    sendMessage(text, sessionTitle, sessionContent)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Popover Window */}
      {isOpen && (
        <div className="mb-4 flex h-[520px] w-[360px] sm:w-[400px] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:border-gray-800 dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-white dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-sm">
                  <span>AI Co-Teacher</span>
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-blue-100 truncate max-w-[200px]">
                  {courseTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearMessages}
                title="Reset Chat"
                className="rounded-lg p-1.5 text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-6 text-gray-500 dark:text-gray-400">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Halo! Saya AI Co-Teacher
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ada materi yang kurang jelas tentang kursus ini? Tanyakan saja pada saya!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {msg.content ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-400 py-1">
                        <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                        <span className="text-xs">Memikirkan jawaban...</span>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 mt-0.5">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="border-t border-gray-100 p-3 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan materi kursus..."
                disabled={isStreaming}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <StopCircle className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
        )}
      </button>
    </div>
  )
}
