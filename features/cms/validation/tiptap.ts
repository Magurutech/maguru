import { z } from 'zod'

/**
 * Tiptap JSON Validation Schemas
 * 
 * This module provides Zod schemas for validating Tiptap JSON content structure.
 * Validates all node types and marks supported in Sprint 2.
 * 
 * Requirements: 3.3, 9.3
 */

// Mark schemas (inline formatting)
const BoldMarkSchema = z.object({
  type: z.literal('bold'),
})

const ItalicMarkSchema = z.object({
  type: z.literal('italic'),
})

const CodeMarkSchema = z.object({
  type: z.literal('code'),
})

const LinkMarkSchema = z.object({
  type: z.literal('link'),
  attrs: z.object({
    href: z.string().url(),
    target: z.string().optional(),
  }),
})

const MarkSchema = z.union([
  BoldMarkSchema,
  ItalicMarkSchema,
  CodeMarkSchema,
  LinkMarkSchema,
])

// Text node schema
const TextNodeSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  marks: z.array(MarkSchema).optional(),
})

// Forward declaration for recursive node types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TiptapNode = z.infer<typeof TiptapNodeSchema>

// Node schemas
const ParagraphNodeSchema = z.object({
  type: z.literal('paragraph'),
  content: z.array(z.lazy(() => TiptapNodeSchema)).optional(),
})

const HeadingNodeSchema = z.object({
  type: z.literal('heading'),
  attrs: z.object({
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  }),
  content: z.array(z.lazy(() => TiptapNodeSchema)).optional(),
})

const ListItemNodeSchema = z.object({
  type: z.literal('listItem'),
  content: z.array(z.lazy(() => TiptapNodeSchema)),
})

const BulletListNodeSchema = z.object({
  type: z.literal('bulletList'),
  content: z.array(ListItemNodeSchema),
})

const OrderedListNodeSchema = z.object({
  type: z.literal('orderedList'),
  attrs: z.object({
    start: z.number().int().positive().optional(),
  }).optional(),
  content: z.array(ListItemNodeSchema),
})

const CodeBlockNodeSchema = z.object({
  type: z.literal('codeBlock'),
  attrs: z.object({
    language: z.string().optional(),
  }).optional(),
  content: z.array(TextNodeSchema).optional(),
})

// Union of all node types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TiptapNodeSchema: z.ZodType<any> = z.union([
  TextNodeSchema,
  ParagraphNodeSchema,
  HeadingNodeSchema,
  BulletListNodeSchema,
  OrderedListNodeSchema,
  ListItemNodeSchema,
  CodeBlockNodeSchema,
])

// Document schema (root level)
const TiptapDocumentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(TiptapNodeSchema),
})

// LessonContent wrapper schema
const LessonContentSchema = z.object({
  content: TiptapDocumentSchema,
  version: z.number().int().positive(),
  lastEdit: z.string().datetime(),
})

/**
 * Validates lesson content structure
 * 
 * @param content - Unknown content to validate
 * @returns Validated LessonContent object
 * @throws ZodError if validation fails
 * 
 * Requirements: 3.3, 9.3
 */
export function validateLessonContent(content: unknown) {
  return LessonContentSchema.parse(content)
}

// Export schemas for testing
export {
  LessonContentSchema,
  TiptapDocumentSchema,
  TiptapNodeSchema,
  MarkSchema,
  TextNodeSchema,
  ParagraphNodeSchema,
  HeadingNodeSchema,
  BulletListNodeSchema,
  OrderedListNodeSchema,
  ListItemNodeSchema,
  CodeBlockNodeSchema,
  BoldMarkSchema,
  ItalicMarkSchema,
  CodeMarkSchema,
  LinkMarkSchema,
}
