/**
 * Markdown Export & Utility Helpers for Tiptap Lesson Editor
 */
import { Editor } from '@tiptap/react'

export function exportEditorToMarkdown(editor: Editor | null, title: string): string {
  if (!editor) return ''

  // Build frontmatter + content
  const header = `# ${title || 'Judul Pelajaran'}\n\n`
  
  // Tiptap editor text / html extraction
  // If @tiptap/markdown is configured, editor.storage.markdown?.getMarkdown() is used
  let body = ''
  try {
    if ((editor.storage as any)?.markdown?.getMarkdown) {
      body = (editor.storage as any).markdown.getMarkdown()
    } else {
      body = editor.getText({ blockSeparator: '\n\n' })
    }
  } catch {
    body = editor.getText({ blockSeparator: '\n\n' })
  }

  return `${header}${body}`
}

export function downloadMarkdownFile(title: string, content: string) {
  const sanitizedTitle = (title || 'materi')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'lesson'
  
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${sanitizedTitle}.md`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
