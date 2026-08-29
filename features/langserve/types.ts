/**
 * LangServe & AI Chatbot Types
 * Unified TypeScript interfaces for AI features (Chatbot, Explain Code, Hint, Quiz)
 */

// ============================================================================
// CHATBOT & CONTEXT TYPES
// ============================================================================

export interface ChatMessage {
  role: 'student' | 'ai' | 'system'
  content: string
  timestamp?: string
  isError?: boolean
}

export interface ChatbotContext {
  courseId?: string
  courseSlug?: string
  sectionId?: string
  itemId?: string
  itemTitle?: string
  currentContent?: string
  courseTitle?: string
}

export interface ChatbotProps {
  context: ChatbotContext
  className?: string
}

export interface ChatbotRequest {
  question: string
  session_title?: string
  session_content?: string
  chat_history?: ChatMessage[]
  course_id?: string
  thread_id?: string
}

export interface ChatbotResponse {
  output: string
}

// ============================================================================
// EXPLAIN CODE & HINT TYPES
// ============================================================================

export interface ExplainCodeRequest {
  code: string
  language?: string
  context?: string
}

export interface ExplainCodeResponse {
  output: string
}

export interface HintRequest {
  task: string
  attempt?: string
  level?: number
}

export interface HintResponse {
  output: string
}

// ============================================================================
// QUIZ TYPES
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

export interface GenerateQuizRequest {
  course_id: string
  section_id?: string
  num_questions?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  lesson_content?: string
}

export interface QuizQuestionItem {
  question: string
  options: {
    a: string
    b: string
    c: string
    d: string
  }
  correct: 'a' | 'b' | 'c' | 'd'
  topic?: string
  difficulty?: string
}

export interface GenerateQuizResponse {
  status: string
  course_id?: string
  questions: QuizQuestionItem[]
}

// ============================================================================
// GREETING TYPES
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
// STREAM & ERROR TYPES
// ============================================================================

export interface StreamOptions {
  onError?: (error: Error) => void
  onChunk?: (chunk: string) => void
  onComplete?: (fullResponse: string) => void
  timeout?: number
  signal?: AbortSignal
}

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

export const LANGSERVE_ENDPOINTS = {
  chatbot: '/chatbot/invoke',
  chatbotStream: '/chatbot/stream',
  explainCode: '/explain-code/invoke',
  explainCodeStream: '/explain-code/stream',
  hint: '/hint/invoke',
  hintStream: '/hint/stream',
  quizFeedback: '/quiz-feedback/invoke',
  quizFeedbackStream: '/quiz-feedback/stream',
  generateQuiz: '/api/v1/generate-quiz',
  greeting: '/greeting/invoke',
  greetingStream: '/greeting/stream',
  health: '/health',
} as const

export type LangServeEndpoint = typeof LANGSERVE_ENDPOINTS[keyof typeof LANGSERVE_ENDPOINTS]
