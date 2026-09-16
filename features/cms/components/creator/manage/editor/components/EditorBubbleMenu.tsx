'use client'

import { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { Bold, Italic, Strikethrough, Code, Highlighter, Link as LinkIcon } from 'lucide-react'
import { useCallback } from 'react'

interface EditorBubbleMenuProps {
  editor: Editor | null
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const toggleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor])
  const toggleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor])
  const toggleStrike = useCallback(() => editor?.chain().focus().toggleStrike().run(), [editor])
  const toggleCode = useCallback(() => editor?.chain().focus().toggleCode().run(), [editor])
  const toggleHighlight = useCallback(() => editor?.chain().focus().toggleHighlight().run(), [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL Tautan:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <BubbleMenu
      editor={editor}
      updateDelay={100}
      className="flex items-center gap-0.5 p-1 rounded-xl bg-zinc-900/95 text-white shadow-xl border border-zinc-700/60 backdrop-blur-md z-50 select-none animate-in fade-in-50 zoom-in-95 duration-150"
    >
      <button
        type="button"
        onClick={toggleBold}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center ${
          editor.isActive('bold') ? 'bg-accent-coral text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={toggleItalic}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center ${
          editor.isActive('italic') ? 'bg-accent-coral text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={toggleStrike}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center ${
          editor.isActive('strike') ? 'bg-accent-coral text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-3.5 bg-zinc-700 mx-0.5" />

      <button
        type="button"
        onClick={toggleCode}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center font-mono ${
          editor.isActive('code') ? 'bg-accent-coral text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`}
        title="Inline Code (`)"
      >
        <Code className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={toggleHighlight}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center ${
          editor.isActive('highlight') ? 'bg-accent-coral text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`}
        title="Highlight Teks"
      >
        <Highlighter className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={setLink}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center ${
          editor.isActive('link') ? 'bg-accent-coral text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`}
        title="Sisipkan Tautan (Link)"
      >
        <LinkIcon className="w-3.5 h-3.5" />
      </button>
    </BubbleMenu>
  )
}
