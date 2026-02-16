/**
 * LangServe API Client
 * Client-side API functions with SSE streaming support for LangServe backend
 */

import type {
  ChatbotRequest,
  ChatbotResponse,
  ExplainCodeRequest,
  ExplainCodeResponse,
  HintRequest,
  HintResponse,
  QuizFeedbackRequest,
  QuizFeedbackResponse,
  GreetingRequest,
  GreetingResponse,
  StreamOptions,
  LangServeError,
} from './types'
import { LANGSERVE_ENDPOINTS } from './types'

// ============================================================================
// CONFIGURATION
// ============================================================================

const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return ''

  // Use environment variable or default to localhost
  return process.env.NEXT_PUBLIC_LANGSERVE_URL || 'http://localhost:8000'
}

const DEFAULT_TIMEOUT = 30000 // 30 seconds

// ============================================================================
// SSE STREAMING HELPER
// ============================================================================

/**
 * Async generator for parsing Server-Sent Events (SSE) stream
 * LangServe SSE format: "data: {...json...}" or "data: [DONE]"
 */
async function* streamSSE<T>(
  url: string,
  body: unknown,
  options: StreamOptions = {}
): AsyncGenerator<T, void, unknown> {
  const { timeout = DEFAULT_TIMEOUT, onError } = options

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error: LangServeError = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
        endpoint: url,
      }
      throw error
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue

          const data = line.slice(6).trim()

          // Check for stream end
          if (data === '[DONE]') {
            return
          }

          try {
            const parsed = JSON.parse(data) as T
            yield parsed
          } catch (e) {
            console.warn('Failed to parse SSE data:', data, e)
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        const timeoutError: LangServeError = {
          message: `Request timeout after ${timeout}ms`,
          endpoint: url,
        }
        onError?.(timeoutError as Error)
        throw timeoutError
      }
      onError?.(error)
      throw error
    }
    throw new Error('Unknown error occurred during streaming')
  }
}

/**
 * Simplified string stream for AI text responses
 * Extracts the 'output' field from LangServe SSE events
 */
async function* streamText(
  url: string,
  body: unknown,
  options: StreamOptions = {}
): AsyncGenerator<string, void, unknown> {
  for await (const event of streamSSE<{ output?: string }>(url, body, options)) {
    if (event.output) {
      yield event.output
    }
  }
}

// ============================================================================
// CHAIN API FUNCTIONS
// ============================================================================

/**
 * Stream Chatbot chain responses
 * Personal AI Tutor for course-related questions
 */
export async function streamChatbot(
  request: ChatbotRequest,
  options: StreamOptions = {}
): Promise<string> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${(LANGSERVE_ENDPOINTS as any).chatbotStream}`

  let fullResponse = ''

  try {
    for await (const chunk of streamText(url, request, options)) {
      fullResponse += chunk
      options.onChunk?.(chunk)
    }

    options.onComplete?.(fullResponse)
    return fullResponse
  } catch (error) {
    const apiError: LangServeError = {
      message: error instanceof Error ? error.message : 'Failed to stream chatbot response',
      endpoint: 'chatbot',
    }
    options.onError?.(apiError as Error)
    throw apiError
  }
}

/**
 * Stream Explain Code chain responses
 * Explains code snippets to students
 */
export async function streamExplainCode(
  request: ExplainCodeRequest,
  options: StreamOptions = {}
): Promise<string> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${(LANGSERVE_ENDPOINTS as any).explainCodeStream}`

  let fullResponse = ''

  try {
    for await (const chunk of streamText(url, request, options)) {
      fullResponse += chunk
      options.onChunk?.(chunk)
    }

    options.onComplete?.(fullResponse)
    return fullResponse
  } catch (error) {
    const apiError: LangServeError = {
      message: error instanceof Error ? error.message : 'Failed to stream code explanation',
      endpoint: 'explain-code',
    }
    options.onError?.(apiError as Error)
    throw apiError
  }
}

/**
 * Stream Hint chain responses
 * Provides progressive hints for exercises
 */
export async function streamHint(
  request: HintRequest,
  options: StreamOptions = {}
): Promise<string> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${(LANGSERVE_ENDPOINTS as any).hintStream}`

  let fullResponse = ''

  try {
    for await (const chunk of streamText(url, request, options)) {
      fullResponse += chunk
      options.onChunk?.(chunk)
    }

    options.onComplete?.(fullResponse)
    return fullResponse
  } catch (error) {
    const apiError: LangServeError = {
      message: error instanceof Error ? error.message : 'Failed to stream hint',
      endpoint: 'hint',
    }
    options.onError?.(apiError as Error)
    throw apiError
  }
}

/**
 * Stream Quiz Feedback chain responses
 * Provides feedback on quiz answers
 */
export async function streamQuizFeedback(
  request: QuizFeedbackRequest,
  options: StreamOptions = {}
): Promise<string> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${(LANGSERVE_ENDPOINTS as any).quizFeedbackStream}`

  let fullResponse = ''

  try {
    for await (const chunk of streamText(url, request, options)) {
      fullResponse += chunk
      options.onChunk?.(chunk)
    }

    options.onComplete?.(fullResponse)
    return fullResponse
  } catch (error) {
    const apiError: LangServeError = {
      message: error instanceof Error ? error.message : 'Failed to stream quiz feedback',
      endpoint: 'quiz-feedback',
    }
    options.onError?.(apiError as Error)
    throw apiError
  }
}

/**
 * Stream Greeting chain responses
 * Personalized greeting for students
 */
export async function streamGreeting(
  request: GreetingRequest,
  options: StreamOptions = {}
): Promise<string> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${(LANGSERVE_ENDPOINTS as any).greetingStream}`

  let fullResponse = ''

  try {
    for await (const chunk of streamText(url, request, options)) {
      fullResponse += chunk
      options.onChunk?.(chunk)
    }

    options.onComplete?.(fullResponse)
    return fullResponse
  } catch (error) {
    const apiError: LangServeError = {
      message: error instanceof Error ? error.message : 'Failed to stream greeting',
      endpoint: 'greeting',
    }
    options.onError?.(apiError as Error)
    throw apiError
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check if LangServe backend is healthy
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) return false

    const data = await response.json()
    return data.status === 'ok'
  } catch {
    return false
  }
}

// ============================================================================
// NON-STREAMING API FUNCTIONS (for fallback)
// ============================================================================

/**
 * Invoke Chatbot chain (non-streaming)
 */
export async function invokeChatbot(request: ChatbotRequest): Promise<ChatbotResponse> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${(LANGSERVE_ENDPOINTS as any).chatbot}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error invoking chatbot:', error)
    throw error
  }
}
