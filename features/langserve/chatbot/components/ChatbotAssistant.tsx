'use client'

import React, { useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Trash2, Sparkles, Loader2, Square, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatMessage } from './ChatMessage'
import { useChatbot } from '@/features/langserve/chatbot/hooks/useChatbot'
import type { ChatbotProps } from '@/features/langserve/types'
import { cn } from '@/lib/utils'

/**
 * ChatbotAssistant - Pure Presentation Component (Layer 1)
 *
 * Implements 3-tier architecture:
 * - Presentation Layer (ChatbotAssistant + ChatMessage)
 * - Logic Layer (useChatbot Hook)
 * - Data Layer (streamChatbotGenerator / LangServe SSE)
 *
 * Features:
 * - LocalStorage Session Persistence per Course (TSK-01)
 * - Dynamic Lesson Context Switching (TSK-03)
 * - Context-Aware Quick Prompt Chips (TSK-04)
 * - Stop Streaming via AbortController (TSK-06)
 * - One-Click Retry Action (TSK-07)
 * - Smart Scroll & Keyboard Navigation (TSK-08, TSK-09)
 * - Mobile Full Sheet Responsive (TSK-10)
 */
export function ChatbotAssistant({ context, className }: ChatbotProps) {
  const {
    isOpen,
    toggleOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    stopStreaming,
    retryLastMessage,
    messagesEndRef,
    chatContainerRef,
    handleScroll,
    inputRef,
    panelRef,
  } = useChatbot(context)

  // Keyboard shortcut: Escape to close panel (TSK-09)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isOpen, setIsOpen])

  // Handle Enter key submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Quick Prompt Prompts
  const currentTopic = context.itemTitle || context.courseTitle || 'materi ini'
  const quickPrompts = [
    {
      icon: '💡',
      label: 'Jelaskan dengan analogi sederhana',
      prompt: `Tolong jelaskan konsep utama ${currentTopic} menggunakan analogi kehidupan sehari-hari yang mudah dipahami secara ringkas.`,
    },
    {
      icon: '💻',
      label: 'Berikan contoh kode praktis',
      prompt: `Berikan contoh kode praktis implementasi ${currentTopic} beserta penjelasan singkat alur kodenya.`,
    },
    {
      icon: '❓',
      label: 'Buat 1 kuis latihan singkat',
      prompt: `Buat 1 pertanyaan kuis pilihan ganda singkat mengenai ${currentTopic} untuk menguji pemahaman saya.`,
    },
  ]

  const handleQuickPromptClick = useCallback(
    (promptText: string) => {
      if (isStreaming) return
      sendMessage(promptText)
    },
    [isStreaming, sendMessage]
  )

  return (
    <>
      {/* 1. Floating Action Button (FAB) */}
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? 'Tutup AI Co-Teacher' : 'Buka AI Co-Teacher'}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full',
          'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-bold text-xs',
          'shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer',
          'border border-amber-400/40 backdrop-blur-xs select-none',
          isOpen && 'scale-90 opacity-90',
          className
        )}
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
        </div>
        <span className="hidden sm:inline tracking-wide font-sans">AI Co-Teacher</span>
      </button>

      {/* 2. Slide-out / Push-Layout Chat Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Maguru AI Co-Teacher Assistant"
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] flex flex-col',
          'bg-background/95 backdrop-blur-md border-l border-border/20 shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/10 bg-muted/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-foreground">Maguru AI Tutor</h3>
                <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                {context.itemTitle || context.courseTitle || 'Pendamping Belajar'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearMessages}
                title="Hapus Percakapan (Reset Sesi)"
                className="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              title="Tutup (Esc)"
              className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Message List Area */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-muted-foreground/20"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">Halo! Ada yang bisa saya bantu?</p>
                <p className="text-[11px] text-muted-foreground max-w-[260px] leading-relaxed">
                  Tanyakan apa saja seputar topik{' '}
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {context.itemTitle || 'pelajaran ini'}
                  </span>
                  .
                </p>
              </div>

              {/* Quick Prompt Suggestions (TSK-04) */}
              <div className="w-full space-y-2 pt-3">
                <p className="text-[10.5px] font-semibold text-text-faint text-left uppercase tracking-wider pl-1">
                  Saran Cepat:
                </p>
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPromptClick(item.prompt)}
                    className="w-full text-left text-[11px] p-2.5 rounded-xl bg-card border border-border/25 hover:border-amber-500/50 hover:bg-amber-500/5 text-foreground transition-all duration-200 cursor-pointer shadow-2xs flex items-center gap-2"
                  >
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} onRetry={retryLastMessage} />
              ))}
              {isStreaming && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-9 pb-2 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span className="text-[11px]">AI sedang mengetik...</span>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Action Bar */}
        <div className="p-3 border-t border-border/10 bg-background/90 shrink-0">
          <div className="flex items-center gap-2 bg-card border border-border/25 rounded-2xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-amber-500/50 shadow-xs">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan ke AI Co-Teacher..."
              disabled={isStreaming}
              className="flex-1 border-0 outline-none text-xs p-0 h-8 bg-transparent text-foreground placeholder:text-muted-foreground"
            />

            {/* Send / Stop Streaming Button (TSK-06) */}
            {isStreaming ? (
              <Button
                size="icon"
                onClick={stopStreaming}
                title="Hentikan balasan (Stop)"
                className="w-7 h-7 rounded-xl bg-destructive text-white hover:bg-destructive/90 shrink-0 shadow-xs transition-all cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                title="Kirim pesan (Enter)"
                className={cn(
                  'w-7 h-7 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shrink-0 shadow-xs transition-all cursor-pointer',
                  !input.trim() && 'opacity-40 cursor-not-allowed'
                )}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          <p className="text-[9.5px] text-center text-muted-foreground mt-1.5 opacity-75 select-none">
            AI dapat melakukan kesalahan. Pastikan memeriksa kembali konsep penting.
          </p>
        </div>
      </div>
    </>
  )
}
