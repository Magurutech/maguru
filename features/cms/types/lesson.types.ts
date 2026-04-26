/**
 * Lesson Types
 * Type definitions for Lesson management
 */

import { lessons as PrismaLesson } from '@/prisma/generated/prisma/client'

/**
 * Tiptap Document Structure
 * Requirements: 3.1, 3.3
 */
export interface TiptapDocument {
  type: 'doc'
  content: TiptapNode[]
}

export type TiptapNode =
  | ParagraphNode
  | HeadingNode
  | BulletListNode
  | OrderedListNode
  | ListItemNode
  | CodeBlockNode
  | TextNode

export interface ParagraphNode {
  type: 'paragraph'
  content?: TiptapInlineContent[]
}

export interface HeadingNode {
  type: 'heading'
  attrs: { level: 1 | 2 | 3 }
  content?: TiptapInlineContent[]
}

export interface BulletListNode {
  type: 'bulletList'
  content: ListItemNode[]
}

export interface OrderedListNode {
  type: 'orderedList'
  attrs?: { start?: number }
  content: ListItemNode[]
}

export interface ListItemNode {
  type: 'listItem'
  content: TiptapNode[]
}

export interface CodeBlockNode {
  type: 'codeBlock'
  attrs?: { language?: string }
  content?: TextNode[]
}

export interface TextNode {
  type: 'text'
  text: string
  marks?: Mark[]
}

export type Mark = BoldMark | ItalicMark | CodeMark | LinkMark

export interface BoldMark {
  type: 'bold'
}

export interface ItalicMark {
  type: 'italic'
}

export interface CodeMark {
  type: 'code'
}

export interface LinkMark {
  type: 'link'
  attrs: {
    href: string
    target?: string
  }
}

export type TiptapInlineContent = TextNode

/**
 * LessonContent wrapper object
 * Requirements: 3.1, 3.2
 */
export interface LessonContent {
  content: TiptapDocument
  version: number
  lastEdit: string // ISO 8601 timestamp
}

/**
 * Lesson list item (without content)
 * Requirements: 2.2
 */
export interface LessonWithPreview {
  id: string
  sectionId: string
  order: number
  title: string
  contentPreview: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Lesson with full content
 * Requirements: 2.3
 */
export interface LessonWithContent {
  id: string
  sectionId: string
  order: number
  title: string
  content: LessonContent
  createdAt: Date
  updatedAt: Date
  section: {
    id: string
    title: string
    courseId: string
  }
}

/**
 * Base Lesson type (re-export from Prisma)
 */
export type Lesson = PrismaLesson

/**
 * Create lesson input
 * Requirements: 2.1
 */
export interface CreateLessonInput {
  title: string
  content: LessonContent
  order?: number  // Optional — auto-calculated as max+1 if not provided
}

/**
 * Update lesson input
 * Requirements: 2.4
 */
export interface UpdateLessonInput {
  title?: string
  content?: LessonContent
  order?: number
}

/**
 * Delete lesson result
 * Requirements: 2.5
 */
export interface DeleteLessonResult {
  message: string
  deletedProgressRecords: number
}
