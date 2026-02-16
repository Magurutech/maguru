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
  question: string
  current_attempt?: string
  context?: string
}

export interface HintResponse {
  output: string
}

// ============================================================================
// CHAIN: Quiz Feedback
// ============================================================================

export interface QuizFeedbackRequest {
  question: string
  user_answer: string
  correct_answer?: string
  explanation?: string
}

export interface QuizFeedbackResponse {
  output: string
}

// ============================================================================
// CHAIN: Greeting
// ============================================================================

export interface GreetingRequest {
  user_name?: string
  course_title?: string
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

export interface LangServeError {
  message: string
  statusCode?: number
  endpoint?: string
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
