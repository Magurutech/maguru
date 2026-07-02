import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { marked } from 'marked'

/**
 * Heuristic to detect if text looks like Markdown.
 */
function looksLikeMarkdown(text: string): boolean {
  const markdownPatterns = [
    /^#{1,6}\s/m,                  // Headings
    /(\*\*|__)(.*?)\1/,           // Bold
    /(\*|_)(.*?)\1/,              // Italic
    /`[^`\n]+`/,                  // Inline code
    /^[\s]*[-*+]\s/m,              // Bullet lists
    /^[\s]*\d+\.\s/m,             // Ordered lists
    /^[\s]*- \[[ xX]\]\s/m,        // Task lists
    /\[.+\]\(.+\)/,               // Links
    /!\[.+\]\(.+\)/,              // Images
    /^>+\s/m,                     // Blockquotes
    /^```/m,                      // Code blocks
    /^[*-_\s]{3,}$/m,             // Horizontal rules
    /\|.+(?:\|.+)+\|/m            // Tables
  ]

  return markdownPatterns.some((pattern) => pattern.test(text))
}

/**
 * Custom TipTap extension to automatically parse and insert raw Markdown content
 * when pasted into the editor as plaintext.
 */
export const PasteMarkdown = Extension.create({
  name: 'pasteMarkdown',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('pasteMarkdown'),
        props: {
          handlePaste: (view, event) => {
            const { editor } = this
            
            const text = event.clipboardData?.getData('text/plain')
            if (!text) return false

            const html = event.clipboardData?.getData('text/html')

            // If there's no rich HTML copied, and the text looks like markdown, parse it.
            if (!html && looksLikeMarkdown(text)) {
              const htmlContent = marked.parse(text) as string
              editor.commands.insertContent(htmlContent)
              return true
            }

            return false
          }
        }
      })
    ]
  }
})
