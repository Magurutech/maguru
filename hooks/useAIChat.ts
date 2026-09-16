'use client'

import { useState, useCallback, useRef } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface UseAIChatOptions {
  courseId: string
  initialMessages?: ChatMessage[]
}

export function useAIChat({ courseId, initialMessages = [] }: UseAIChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (question: string, sessionTitle: string = '', sessionContent: string = '') => {
      if (!question.trim() || isStreaming) return

      setError(null)
      const userMessageId = `user-${Date.now()}`
      const assistantMessageId = `ai-${Date.now()}`

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content: question.trim(),
        timestamp: new Date(),
      }

      const initialAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage, initialAssistantMessage])
      setIsStreaming(true)

      const baseUrl = process.env.NEXT_PUBLIC_LANGSERVE_URL || 'http://localhost:8000'
      const endpoint = `${baseUrl}/chatbot/stream`

      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            input: {
              question: question.trim(),
              session_title: sessionTitle,
              session_content: sessionContent,
              chat_history: messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              course_id: courseId,
            },
          }),
        })

        if (!response.ok) {
          throw new Error(`AI Server error (${response.status})`)
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported by response')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let accumulatedText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })

          // LangServe event stream format parsing
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const rawData = line.replace('data: ', '').trim()
              if (rawData === '[DONE]') continue
              try {
                const parsed = JSON.parse(rawData)
                if (typeof parsed === 'string') {
                  accumulatedText += parsed
                } else if (parsed && typeof parsed === 'object') {
                  const content = parsed.output || parsed.text || parsed.content || ''
                  accumulatedText += content
                }
              } catch {
                accumulatedText += rawData
              }
            } else if (line.trim() && !line.startsWith('event:')) {
              accumulatedText += line
            }
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: accumulatedText }
                : msg
            )
          )
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('[useAIChat] Connection aborted by user')
        } else {
          console.error('[useAIChat] Streaming error:', err)
          setError(err.message || 'Gagal terhubung ke AI Co-Teacher.')
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content:
                      msg.content ||
                      'Maaf, koneksi ke AI Co-Teacher terputus. Silakan coba lagi.',
                  }
                : msg
            )
          )
        }
      } finally {
        setIsStreaming(false)
        abortControllerRef.current = null
      }
    },
    [courseId, isStreaming, messages]
  )

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
    clearMessages,
  }
}
