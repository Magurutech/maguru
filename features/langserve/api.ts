/**
 * LangServe API Client
 * Client-side API functions with SSE streaming support for LangServe backend
 */

import type {
  ChatbotRequest,
  ChatbotResponse,
  ExplainCodeRequest,
  HintRequest,
  QuizFeedbackRequest,
  GreetingRequest,
  StreamOptions,
  LangServeError,
} from './types'
import { LANGSERVE_ENDPOINTS } from './types'
import { logger } from '@/services/logger'

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
 * SSE Event structure from LangServe
 */
interface SSEEvent {
  event?: string
  data?: {
    output?: string
  }
  output?: string
  run_id?: string
  [key: string]: unknown
}

/**
 * Helper: Safely check if object has property (avoids 'in' operator issues)
 */
function hasProperty(obj: unknown, prop: string): boolean {
  if (typeof obj !== 'object' || obj === null) return false
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

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

  logger.debug('LangServeAPI', 'streamSSE', 'Starting SSE stream', {
    url,
    timeout,
  })

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const requestBody = JSON.stringify({ input: body })
    logger.debug('LangServeAPI', 'streamSSE', 'Sending request', {
      body: requestBody,
      endpoint: url,
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: requestBody,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    logger.debug('LangServeAPI', 'streamSSE', 'Response received', {
      status: response.status,
      statusText: response.statusText,
    })

    if (!response.ok) {
      const error: LangServeError = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
        endpoint: url,
      }
      logger.error('LangServeAPI', 'streamSSE', 'HTTP error', error)
      throw error
    }

    if (!response.body) {
      logger.error('LangServeAPI', 'streamSSE', 'Response body is null')
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let eventCount = 0

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          logger.debug('LangServeAPI', 'streamSSE', 'Stream completed', {
            totalEvents: eventCount,
          })
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          // Handle SSE event types (event: ...)
          if (line.startsWith('event: ')) {
            logger.debug('LangServeAPI', 'streamSSE', 'Event type received', {
              event: line,
            })
            continue
          }

          // Handle SSE data lines (data: ...)
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            logger.debug('LangServeAPI', 'streamSSE', 'SSE data line received', {
              data: data.substring(0, 200) + (data.length > 200 ? '...' : ''),
              length: data.length,
              fullLine: line.substring(0, 250),
            })

            // Check for stream end
            if (data === '[DONE]') {
              logger.debug('LangServeAPI', 'streamSSE', 'Stream end marker received')
              return
            }

            // Skip empty data lines
            if (!data) {
              continue
            }

            try {
              const parsed = JSON.parse(data) as T
              eventCount++

              // DEBUG: Log parsed event details
              logger.debug('LangServeAPI', 'streamSSE', 'BEFORE yield - Event details', {
                eventNum: eventCount,
                parsedType: typeof parsed,
                isObject: typeof parsed === 'object',
                keys: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed) : [],
                valuePreview: parsed !== null ? JSON.stringify(parsed).substring(0, 200) : 'null',
              })

              yield parsed
            } catch (e) {
              logger.error('LangServeAPI', 'streamSSE', 'Failed to parse SSE data', {
                data: data.substring(0, 100),
                error: e,
              })
            }
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
        logger.error('LangServeAPI', 'streamSSE', 'Timeout error', timeoutError)
        onError?.(timeoutError as Error)
        throw timeoutError
      }
      logger.error('LangServeAPI', 'streamSSE', 'Stream error', error)
      onError?.(error)
      throw error
    }
    throw new Error('Unknown error occurred during streaming')
  }
}

/**
 * Simplified string stream for AI text responses
 * Extracts the 'output' field from LangServe SSE events
 *
 * LangServe streaming format (multiple event types):
 * 1. Metadata event: {"run_id": "..."}
 * 2. Data event: {"event": "data", "data": {"output": "chunk"}}
 * 3. End event: {"event": "end", "data": {}}
 * 4. String event: If event is a string (direct content)
 */
async function* streamText(
  url: string,
  body: unknown,
  options: StreamOptions = {}
): AsyncGenerator<string, void, unknown> {
  logger.debug('LangServeAPI', 'streamText', 'Starting text stream', {
    url,
  })

  let chunkCount = 0

  for await (const event of streamSSE<SSEEvent>(url, body, options)) {
    chunkCount++

    // DEBUG: Log raw event received
    logger.debug('LangServeAPI', 'streamText', 'Event received from streamSSE', {
      chunk: chunkCount,
      eventType: typeof event,
      eventPreview: typeof event === 'string' ? event.substring(0, 100) : 'object',
      fullEvent: JSON.stringify(event).substring(0, 300),
    })

    // Extract output from various LangServe formats
    let outputChunk: string | undefined = undefined

    // CASE 1: Event is a string (direct content from server)
    if (typeof event === 'string') {
      outputChunk = event
      logger.debug('LangServeAPI', 'streamText', 'CASE 1 - String event', {
        chunk: chunkCount,
        length: outputChunk.length,
      })
    }
    // CASE 2: Event is an object
    else if (typeof event === 'object' && event !== null) {
      try {
        // Format 2a: Direct output field (simple format)
        if (hasProperty(event, 'output') && typeof event.output === 'string' && event.output.length > 0) {
          outputChunk = event.output
          logger.debug('LangServeAPI', 'streamText', 'CASE 2a - Direct output field', {
            chunk: chunkCount,
            length: outputChunk.length,
          })
        }
        // Format 2b: Nested data.output (LangServe standard streaming)
        else if (hasProperty(event, 'data') && event.data && hasProperty(event.data, 'output') && typeof event.data.output === 'string' && event.data.output.length > 0) {
          outputChunk = event.data.output
          logger.debug('LangServeAPI', 'streamText', 'CASE 2b - Nested data.output', {
            chunk: chunkCount,
            eventType: event.event || 'unknown',
            length: outputChunk.length,
          })
        }
        // Format 2c: Other LangServe metadata events (run_id, etc.) - skip
        else {
          logger.debug('LangServeAPI', 'streamText', 'CASE 2c - Skipping metadata event', {
            chunk: chunkCount,
            eventType: event.event || 'unknown',
            keys: Object.keys(event),
          })
        }
      } catch (err) {
        logger.error('LangServeAPI', 'streamText', 'Error extracting output from object', {
          chunk: chunkCount,
          error: err instanceof Error ? err.message : String(err),
          event: JSON.stringify(event).substring(0, 200),
        })
      }
    }
    // CASE 3: Unknown type
    else {
      logger.warn('LangServeAPI', 'streamText', 'CASE 3 - Unknown event type', {
        chunk: chunkCount,
        eventType: typeof event,
        value: JSON.stringify(event).substring(0, 100),
      })
    }

    // Yield => output chunk if we found one
    if (outputChunk && outputChunk.length > 0) {
      yield outputChunk
      logger.debug('LangServeAPI', 'streamText', '✅ CHUNK YIELDED', {
        chunk: chunkCount,
        length: outputChunk.length,
        preview: outputChunk.substring(0, 50) + '...',
      })
    } else {
      logger.debug('LangServeAPI', 'streamText', '⏭️ No chunk to yield', {
        chunk: chunkCount,
      })
    }
  }

  logger.debug('LangServeAPI', 'streamText', 'Text stream completed', {
    totalChunks: chunkCount,
  })
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
  const url = `${baseUrl}${LANGSERVE_ENDPOINTS.chatbotStream}`

  logger.info('LangServeAPI', 'streamChatbot', 'Starting chatbot stream', {
    url,
    question: request.question,
  })

  let fullResponse = ''
  let chunksReceived = 0

  try {
    for await (const chunk of streamText(url, request, options)) {
      fullResponse += chunk
      chunksReceived++

      logger.debug('LangServeAPI', 'streamChatbot', 'Chunk received and accumulated', {
        chunkNumber: chunksReceived,
        chunkLength: chunk.length,
        totalLength: fullResponse.length,
        preview: chunk.substring(0, 50) + '...',
      })

      options.onChunk?.(chunk)
    }

    logger.info('LangServeAPI', 'streamChatbot', 'Stream completed successfully', {
      totalLength: fullResponse.length,
      totalChunks: chunksReceived,
    })

    options.onComplete?.(fullResponse)
    return fullResponse
  } catch (error) {
    logger.error('LangServeAPI', 'streamChatbot', 'Stream error', {
      error: error instanceof Error ? error.message : String(error),
      totalLength: fullResponse.length,
      totalChunks: chunksReceived,
    })

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
  const url = `${baseUrl}${LANGSERVE_ENDPOINTS.explainCodeStream}`

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
  const url = `${baseUrl}${LANGSERVE_ENDPOINTS.hintStream}`

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
  const url = `${baseUrl}${LANGSERVE_ENDPOINTS.quizFeedbackStream}`

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
  const url = `${baseUrl}${LANGSERVE_ENDPOINTS.greetingStream}`

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
  const url = `${baseUrl}${LANGSERVE_ENDPOINTS.chatbot}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: request }),
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
