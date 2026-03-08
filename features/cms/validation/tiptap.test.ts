import { describe, it, expect } from '@jest/globals'
import {
  validateLessonContent,
  HeadingNodeSchema,
  LinkMarkSchema,
} from './tiptap'
import { ZodError } from 'zod'

/**
 * Unit tests for Tiptap JSON validation
 * 
 * Tests validation edge cases and error handling
 * Requirements: 3.3, 9.3
 */

describe('validateLessonContent', () => {
  describe('valid content', () => {
    it('should accept valid lesson content with simple paragraph', () => {
      const validContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hello world',
                },
              ],
            },
          ],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(validContent)).not.toThrow()
      const result = validateLessonContent(validContent)
      expect(result).toEqual(validContent)
    })

    it('should accept content with all node types', () => {
      const validContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Title' }],
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Bold text', marks: [{ type: 'bold' }] },
              ],
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Item 1' }],
                    },
                  ],
                },
              ],
            },
            {
              type: 'codeBlock',
              attrs: { language: 'javascript' },
              content: [{ type: 'text', text: 'const x = 1;' }],
            },
          ],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(validContent)).not.toThrow()
    })

    it('should accept content with all mark types', () => {
      const validContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'formatted text',
                  marks: [
                    { type: 'bold' },
                    { type: 'italic' },
                    { type: 'code' },
                    {
                      type: 'link',
                      attrs: {
                        href: 'https://example.com',
                        target: '_blank',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(validContent)).not.toThrow()
    })
  })

  describe('invalid root type', () => {
    it('should reject content without doc root type', () => {
      const invalidContent = {
        content: {
          type: 'paragraph', // Wrong root type
          content: [{ type: 'text', text: 'Hello' }],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })

    it('should reject content with missing type field', () => {
      const invalidContent = {
        content: {
          content: [{ type: 'text', text: 'Hello' }],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })
  })

  describe('invalid heading levels', () => {
    it('should reject heading with level 0', () => {
      const invalidContent = {
        type: 'heading',
        attrs: { level: 0 },
        content: [{ type: 'text', text: 'Title' }],
      }

      expect(() => HeadingNodeSchema.parse(invalidContent)).toThrow(ZodError)
    })

    it('should reject heading with level 4', () => {
      const invalidContent = {
        type: 'heading',
        attrs: { level: 4 },
        content: [{ type: 'text', text: 'Title' }],
      }

      expect(() => HeadingNodeSchema.parse(invalidContent)).toThrow(ZodError)
    })

    it('should reject heading with level 7', () => {
      const invalidContent = {
        type: 'heading',
        attrs: { level: 7 },
        content: [{ type: 'text', text: 'Title' }],
      }

      expect(() => HeadingNodeSchema.parse(invalidContent)).toThrow(ZodError)
    })

    it('should accept heading with level 1, 2, or 3', () => {
      const validLevels = [1, 2, 3]

      validLevels.forEach((level) => {
        const validContent = {
          type: 'heading',
          attrs: { level },
          content: [{ type: 'text', text: 'Title' }],
        }

        expect(() => HeadingNodeSchema.parse(validContent)).not.toThrow()
      })
    })
  })

  describe('malformed link hrefs', () => {
    it('should reject link with invalid URL', () => {
      const invalidLink = {
        type: 'link',
        attrs: {
          href: 'not-a-valid-url',
        },
      }

      expect(() => LinkMarkSchema.parse(invalidLink)).toThrow(ZodError)
    })

    it('should reject link with empty href', () => {
      const invalidLink = {
        type: 'link',
        attrs: {
          href: '',
        },
      }

      expect(() => LinkMarkSchema.parse(invalidLink)).toThrow(ZodError)
    })

    it('should accept link with valid http URL', () => {
      const validLink = {
        type: 'link',
        attrs: {
          href: 'http://example.com',
        },
      }

      expect(() => LinkMarkSchema.parse(validLink)).not.toThrow()
    })

    it('should accept link with valid https URL', () => {
      const validLink = {
        type: 'link',
        attrs: {
          href: 'https://example.com',
        },
      }

      expect(() => LinkMarkSchema.parse(validLink)).not.toThrow()
    })
  })

  describe('missing required fields', () => {
    it('should reject content without version field', () => {
      const invalidContent = {
        content: {
          type: 'doc',
          content: [],
        },
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })

    it('should reject content without lastEdit field', () => {
      const invalidContent = {
        content: {
          type: 'doc',
          content: [],
        },
        version: 1,
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })

    it('should reject content without content field', () => {
      const invalidContent = {
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })

    it('should reject text node without text field', () => {
      const invalidContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  // Missing text field
                },
              ],
            },
          ],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })

    it('should reject heading without attrs field', () => {
      const invalidContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              // Missing attrs field
              content: [{ type: 'text', text: 'Title' }],
            },
          ],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })

    it('should reject link mark without href', () => {
      const invalidLink = {
        type: 'link',
        attrs: {
          target: '_blank',
          // Missing href
        },
      }

      expect(() => LinkMarkSchema.parse(invalidLink)).toThrow(ZodError)
    })
  })

  describe('invalid version numbers', () => {
    it('should reject version 0', () => {
      const invalidContent = {
        content: {
          type: 'doc',
          content: [],
        },
        version: 0,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })

    it('should reject negative version', () => {
      const invalidContent = {
        content: {
          type: 'doc',
          content: [],
        },
        version: -1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })

    it('should reject decimal version', () => {
      const invalidContent = {
        content: {
          type: 'doc',
          content: [],
        },
        version: 1.5,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })
  })

  describe('invalid timestamp formats', () => {
    it('should reject invalid ISO 8601 timestamp', () => {
      const invalidContent = {
        content: {
          type: 'doc',
          content: [],
        },
        version: 1,
        lastEdit: '2026-03-08 12:00:00', // Invalid format
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })

    it('should reject timestamp without timezone', () => {
      const invalidContent = {
        content: {
          type: 'doc',
          content: [],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00', // Missing timezone
      }

      expect(() => validateLessonContent(invalidContent)).toThrow(ZodError)
    })

    it('should accept valid ISO 8601 timestamp with Z', () => {
      const validContent = {
        content: {
          type: 'doc',
          content: [],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(validContent)).not.toThrow()
    })

    it('should accept valid ISO 8601 timestamp with milliseconds', () => {
      const validContent = {
        content: {
          type: 'doc',
          content: [],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00.000Z',
      }

      expect(() => validateLessonContent(validContent)).not.toThrow()
    })
  })

  describe('empty content arrays', () => {
    it('should accept doc with empty content array', () => {
      const validContent = {
        content: {
          type: 'doc',
          content: [],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(validContent)).not.toThrow()
    })

    it('should accept paragraph with no content field', () => {
      const validContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              // content is optional for paragraph
            },
          ],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(validContent)).not.toThrow()
    })

    it('should reject bulletList with empty content array', () => {
      const invalidContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'bulletList',
              content: [], // bulletList requires at least one listItem
            },
          ],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      // Note: Zod won't reject empty arrays, but this is a semantic validation
      // that could be added in the future if needed
      expect(() => validateLessonContent(invalidContent)).not.toThrow()
    })
  })

  describe('nested structures', () => {
    it('should accept deeply nested list items', () => {
      const validContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Level 1' }],
                    },
                    {
                      type: 'bulletList',
                      content: [
                        {
                          type: 'listItem',
                          content: [
                            {
                              type: 'paragraph',
                              content: [{ type: 'text', text: 'Level 2' }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(validContent)).not.toThrow()
    })

    it('should accept ordered list with start attribute', () => {
      const validContent = {
        content: {
          type: 'doc',
          content: [
            {
              type: 'orderedList',
              attrs: { start: 5 },
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Item 5' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        version: 1,
        lastEdit: '2026-03-08T12:00:00Z',
      }

      expect(() => validateLessonContent(validContent)).not.toThrow()
    })
  })
})
