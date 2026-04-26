/**
 * CMS Feature
 * Content Management System for Maguru platform
 * 
 * This feature provides:
 * - Section management (CRUD operations)
 * - Lesson management (CRUD operations) - Coming soon
 * - Tiptap content validation
 * - Authorization and access control
 */

// Services
export * from './services'

// Types
export * from './types'

// Validation
export { validateLessonContent } from './validation/tiptap'
