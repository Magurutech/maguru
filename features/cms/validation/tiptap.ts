/**
 * Tiptap JSON Validation
 *
 * Manual validation (no Zod) to avoid version compatibility issues.
 * Validates only the essential structure: LessonContent wrapper + doc root.
 * Node/mark types are not restricted — any Tiptap extension output is accepted.
 *
 * Requirements: 3.3, 9.3
 */

export interface LessonContentValidated {
  content: { type: 'doc'; content: unknown[] }
  version: number
  lastEdit: string
}

/**
 * Validates lesson content structure.
 * Accepts any valid Tiptap JSON — node types are not restricted.
 *
 * @param content - Unknown content to validate
 * @throws Error with descriptive message if validation fails
 */
export function validateLessonContent(content: unknown): LessonContentValidated {
  if (!content || typeof content !== 'object') {
    throw new Error('Content must be an object')
  }

  const c = content as Record<string, unknown>

  // Validate version
  if (typeof c.version !== 'number' || !Number.isInteger(c.version) || c.version < 1) {
    throw new Error('version must be a positive integer')
  }

  // Validate lastEdit
  if (typeof c.lastEdit !== 'string' || isNaN(Date.parse(c.lastEdit))) {
    throw new Error('lastEdit must be a valid ISO 8601 date string')
  }

  // Validate content (Tiptap document)
  if (!c.content || typeof c.content !== 'object') {
    throw new Error('content must be an object')
  }

  const doc = c.content as Record<string, unknown>

  if (doc.type !== 'doc') {
    throw new Error('content.type must be "doc"')
  }

  if (!Array.isArray(doc.content)) {
    throw new Error('content.content must be an array')
  }

  return content as LessonContentValidated
}
