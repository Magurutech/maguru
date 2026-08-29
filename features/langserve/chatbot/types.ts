/**
 * Chatbot UI Types
 * Types for the Chatbot UI components
 */

export interface ChatMessage {
  role: 'student' | 'ai' | 'system'
  content: string
  timestamp?: string
  isError?: boolean
}

export interface ChatbotContext {
  courseId: string
  courseSlug: string
  sectionId: string
  itemId: string
  itemTitle: string
  currentContent: string
  courseTitle: string
}

export interface ChatbotState {
  isOpen: boolean
  messages: ChatMessage[]
  input: string
  isStreaming: boolean
  error: string | null
}

export interface ChatbotActions {
  toggleOpen: () => void
  sendMessage: (customText?: string) => Promise<void>
  setInput: (input: string) => void
  clearMessages: () => void
  retryLastMessage: () => Promise<void>
  stopStreaming: () => void
}

export interface ChatbotProps {
  context: ChatbotContext
  className?: string
}