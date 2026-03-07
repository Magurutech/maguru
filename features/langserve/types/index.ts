/**
 * LangServe API Types
 * TypeScript interfaces for LangServe backend API requests and responses
 */

// ============================================================================
// CHAIN: Chatbot (Personal AI Tutor)
// ============================================================================

export interface ChatbotRequest {
  question: string
  session_title?: string
  session_content?: string
  chat_history?: ChatMessage[]
}

export interface ChatbotResponse {
  output: string
}

// ============================================================================
// CHAIN: Explain Code
// ============================================================================

export interface ExplainCodeRequest {
  code: string
  language?: string
  context?: string
}

export interface ExplainCodeResponse {
  output: string
}

// ============================================================================
// CHAIN: Hint Generator
// ============================================================================

export interface HintRequest {
  task: string
  attempt?: string
  level?: number
}

export interface HintResponse {
  output: string
}

// ============================================================================
// CHAIN: Quiz Feedback
// ============================================================================

export interface QuizFeedbackRequest {
  question: string
  student_answer: string
  correct_answer?: string
  is_correct?: boolean
}

export interface QuizFeedbackResponse {
  output: string
}

// ============================================================================
// CHAIN: Greeting
// ============================================================================

export interface GreetingRequest {
  student_name?: string
  course_metadata?: {
    title?: string
    [key: string]: unknown
  }
}

export interface GreetingResponse {
  output: string
}

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface ChatMessage {
  role: 'student' | 'ai'
  content: string
  timestamp?: string
}

export interface StreamOptions {
  onError?: (error: Error) => void
  onChunk?: (chunk: string) => void
  onComplete?: (fullResponse: string) => void
  timeout?: number
}

// LangServeError - Custom error class that extends Error
export class LangServeError extends Error {
  statusCode?: number
  endpoint?: string

  constructor(message: string, statusCode?: number, endpoint?: string) {
    super(message)
    this.name = 'LangServeError'
    this.statusCode = statusCode
    this.endpoint = endpoint
  }
}

// ============================================================================
// API ENDPOINT CONFIG
// ============================================================================

export const LANGSERVE_ENDPOINTS = {
  chatbot: '/chatbot/invoke',
  chatbotStream: '/chatbot/stream',
  explainCode: '/explain-code/invoke',
  explainCodeStream: '/explain-code/stream',
  hint: '/hint/invoke',
  hintStream: '/hint/stream',
  quizFeedback: '/quiz-feedback/invoke',
  quizFeedbackStream: '/quiz-feedback/stream',
  greeting: '/greeting/invoke',
  greetingStream: '/greeting/stream',
  health: '/health',
} as const

export type LangServeEndpoint = typeof LANGSERVE_ENDPOINTS[keyof typeof LANGSERVE_ENDPOINTS]
