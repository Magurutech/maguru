import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { describe, it, expect } from '@jest/globals'
import { SlashCommand } from '../editor/extensions/SlashCommand'

describe('SlashCommand Extension', () => {
  it('registers the slashCommand extension in Tiptap editor', () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, SlashCommand],
    })

    expect(editor.extensionManager.extensions.some(ext => ext.name === 'slashCommand')).toBe(true)
  })

  it('configures suggestion options with char / by default', () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, SlashCommand],
    })

    const slashCommand = editor.extensionManager.extensions.find(ext => ext.name === 'slashCommand')
    expect(slashCommand?.options.suggestion.char).toBe('/')
  })

  it('returns 8 regular block items in suggestion query (More... is a separate action)', () => {
    const { suggestionOptions } = require('../editor/components/suggestion')
    const items = suggestionOptions.items({ query: '' })
    // More... is no longer in the filtered array — it's passed as a separate moreAction prop
    expect(items.length).toBe(8)
    expect(items.map((i: any) => i.title)).toEqual([
      'Heading 1', 'Heading 2', 'Heading 3', 
      'Bulleted List', 'Numbered List', 'Task List', 
      'Divider', 'Blockquote',
    ])
  })
})
