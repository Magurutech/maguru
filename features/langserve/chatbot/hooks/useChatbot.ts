'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { streamChatbotGenerator } from '@/features/langserve/api'
import type { ChatMessage, ChatbotContext } from '@/features/langserve/types'
import { logger } from '@/services/logger'

const MAX_CONTENT_LENGTH = 1000
const MAX_HISTORY_LENGTH = 10

/**
 * Helper to truncate long lesson content to preserve token budget
 */
function truncateContent(content?: string, maxLen = MAX_CONTENT_LENGTH): string {
  if (!content) return ''
  if (content.length <= maxLen) return content
  return content.slice(0, maxLen) + '...'
}

/**
 * useChatbot Hook
 *
 * Implements the 3-tier architecture logic layer for the AI Co-Teacher chatbot.
 * Features:
 * - LocalStorage session persistence per course (TSK-01)
 * - Dynamic lesson context switching with system visual dividers (TSK-03)
 * - AbortController stop streaming support (TSK-06)
 * - One-click message retry (TSK-07)
 * - Multi-turn memory persistence (thread_id)
 * - Smart auto-scroll detection (TSK-08)
 */
export function useChatbot(context: ChatbotContext) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  const courseKey = context.courseId || context.courseSlug || 'default'
  const storageKey = `maguru_chat_session_${courseKey}`

  // Unique session thread_id for LangGraph checkpointer memory persistence
  const threadIdRef = useRef<string>(`session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`)
  const abortControllerRef = useRef<AbortController | null>(null)
  const prevItemTitleRef = useRef<string | undefined>(context.itemTitle)
  const isUserScrolledUpRef = useRef(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // 1. Restore chat session from localStorage on initial mount (TSK-01)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setMessages(parsed.messages)
        }
        if (parsed.threadId && typeof parsed.threadId === 'string') {
          threadIdRef.current = parsed.threadId
        }
        logger.info('useChatbot', 'localStorage', `💾 [PERSISTENCE] Restored ${parsed.messages?.length || 0} messages for ${courseKey}`)
      }
    } catch (e) {
      logger.warn('useChatbot', 'localStorage', 'Could not parse stored chat session', {
        error: e instanceof Error ? e.message : String(e),
      })
    } finally {
      setIsHydrated(true)
    }
  }, [storageKey, courseKey])

  // 2. Persist messages and threadId to localStorage when updated (TSK-01)
  useEffect(() => {
    if (!isHydrated) return
    try {
      if (messages.length > 0) {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            messages,
            threadId: threadIdRef.current,
            updatedAt: new Date().toISOString(),
          })
        )
      }
    } catch (e) {
      logger.warn('useChatbot', 'localStorage', 'Could not save chat session to localStorage', {
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }, [messages, isHydrated, storageKey])

  // 3. Dynamic Lesson Context Switching (TSK-03)
  useEffect(() => {
    if (!isHydrated) return
    const currentTitle = context.itemTitle
    if (
      currentTitle &&
      prevItemTitleRef.current &&
      currentTitle !== prevItemTitleRef.current &&
      messages.length > 0
    ) {
      const dividerMsg: ChatMessage = {
        role: 'system',
        content: `📍 Beralih ke materi: ${currentTitle}`,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, dividerMsg])
      logger.info('useChatbot', 'contextSwitch', `🔄 [CONTEXT_SWITCH] Switched to lesson: "${currentTitle}"`)
    }
    prevItemTitleRef.current = currentTitle
  }, [context.itemTitle, isHydrated, messages.length])

  // 4. Smart Auto-scroll (TSK-08)
  useEffect(() => {
    if (!isUserScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isStreaming])

  // Handle scroll to detect if user manually scrolled up
  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current
    if (!el) return
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    isUserScrolledUpRef.current = !isAtBottom
  }, [])

  // Auto-focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Format chat history for prompt context
  const formatChatHistory = useCallback((msgs: ChatMessage[]) => {
    return msgs
      .filter((m) => m.role !== 'system')
      .slice(-MAX_HISTORY_LENGTH)
      .map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      }))
  }, [])

  // Stop current streaming response (TSK-06)
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsStreaming(false)
      logger.info('useChatbot', 'stopStreaming', '⏹️ [FRONTEND_CHAT] Generation stopped by user')
    }
  }, [])

  // Send message and stream real-time tokens from AI backend
  const sendMessage = useCallback(
    async (customText?: string) => {
      const textToSend = (customText ?? input).trim()
      if (!textToSend || isStreaming) return

      const userMessage: ChatMessage = {
        role: 'student',
        content: textToSend,
        timestamp: new Date().toISOString(),
      }

      // Add student message and reset input
      setMessages((prev) => [...prev, userMessage])
      if (!customText) setInput('')
      setError(null)
      setIsStreaming(true)
      isUserScrolledUpRef.current = false

      // Add empty placeholder for AI response
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: '',
          timestamp: new Date().toISOString(),
        },
      ])

      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        const tStart = Date.now()
        const requestPayload = {
          question: textToSend,
          session_title: context.itemTitle || context.courseTitle || 'Materi Belajar',
          session_content: truncateContent(context.currentContent),
          chat_history: formatChatHistory(messages),
          course_id: context.courseId || context.courseSlug || 'umum',
          thread_id: threadIdRef.current,
        }

        logger.info('useChatbot', 'sendMessage', '🚀 [FRONTEND_CHAT] Request Dispatched to AI Backend', {
          courseId: requestPayload.course_id,
          threadId: requestPayload.thread_id,
          sessionTitle: requestPayload.session_title,
          questionPreview: textToSend.substring(0, 60),
        })

        let accumulatedResponse = ''
        let chunkCount = 0
        let firstTokenTime: number | null = null

        for await (const chunk of streamChatbotGenerator(requestPayload, {
          signal: controller.signal,
          timeout: 25000,
        })) {
          if (chunk) {
            chunkCount++
            if (firstTokenTime === null) {
              firstTokenTime = Date.now() - tStart
              logger.info('useChatbot', 'sendMessage', `⚡ [FRONTEND_CHAT] First Token Received (TTFT: ${firstTokenTime}ms)`, {
                firstChunkPreview: chunk.substring(0, 30),
              })
            }

            accumulatedResponse += chunk
            setMessages((prev) => {
              if (prev.length === 0) return prev
              const next = [...prev]
              const lastIdx = next.length - 1
              if (next[lastIdx]?.role === 'ai') {
                next[lastIdx] = {
                  ...next[lastIdx],
                  content: accumulatedResponse,
                }
              }
              return next
            })
          }
        }

        const totalDuration = Date.now() - tStart
        logger.info('useChatbot', 'sendMessage', `✅ [FRONTEND_CHAT] Stream Completed (${chunkCount} chunks, ${accumulatedResponse.length} chars in ${totalDuration}ms)`, {
          totalChunks: chunkCount,
          totalChars: accumulatedResponse.length,
          durationMs: totalDuration,
        })
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          logger.info('useChatbot', 'sendMessage', 'Stream aborted gracefully')
          return
        }

        logger.error('useChatbot', 'sendMessage', '❌ [FRONTEND_CHAT] Stream Error Encountered', { error: err })
        const errorMsg =
          err instanceof Error ? err.message : 'Gagal terhubung ke AI Co-Teacher. Pastikan server AI aktif.'
        setError(errorMsg)

        // Mark last AI message as error with fallback
        setMessages((prev) => {
          const next = [...prev]
          const lastIdx = next.length - 1
          if (next[lastIdx]?.role === 'ai') {
            next[lastIdx] = {
              ...next[lastIdx],
              content: next[lastIdx].content || '⚠️ Maaf, terjadi kendala koneksi saat menghubungi AI Co-Teacher.',
              isError: true,
            }
          }
          return next
        })
      } finally {
        setIsStreaming(false)
        abortControllerRef.current = null
      }
    },
    [input, isStreaming, context, messages, formatChatHistory]
  )

  // One-click Retry on error (TSK-07)
  const retryLastMessage = useCallback(async () => {
    const studentMsgs = messages.filter((m) => m.role === 'student')
    if (studentMsgs.length === 0) return
    const lastStudentMsg = studentMsgs[studentMsgs.length - 1]

    // Remove the failed AI message
    setMessages((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].role === 'ai' && prev[prev.length - 1].isError) {
        return prev.slice(0, -1)
      }
      return prev
    })

    await sendMessage(lastStudentMsg.content)
  }, [messages, sendMessage])

  // Clear messages & reset localStorage session (TSK-01)
  const clearMessages = useCallback(() => {
    logger.info('useChatbot', 'clearMessages', '🧹 [FRONTEND_CHAT] Chat history cleared, resetting localStorage')
    setMessages([])
    setError(null)
    threadIdRef.current = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // ignore
    }
  }, [storageKey])

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return {
    isOpen,
    setIsOpen,
    toggleOpen,
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
  }
}
