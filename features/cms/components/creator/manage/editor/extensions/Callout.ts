import { Node, mergeAttributes } from '@tiptap/core'

export type CalloutType = 'info' | 'tip' | 'warning' | 'success'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      /**
       * Insert a callout alert block (Notion-style)
       */
      insertCallout: (options?: { type?: CalloutType }) => ReturnType
      /**
       * Toggle callout block
       */
      toggleCallout: (options?: { type?: CalloutType }) => ReturnType
    }
  }
}

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: (element) => element.getAttribute('data-callout-type') || 'info',
        renderHTML: (attributes) => ({
          'data-callout-type': attributes.type || 'info',
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const type = HTMLAttributes['data-callout-type'] || 'info'
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'callout',
        class: `callout-block callout-${type} rounded-xl p-4 my-4 border flex gap-3`,
      }),
      0,
    ]
  },

  addCommands() {
    return {
      insertCallout:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { type: options.type || 'info' },
            content: [{ type: 'paragraph' }],
          })
        },
      toggleCallout:
        (options = {}) =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, { type: options.type || 'info' })
        },
    }
  },
})
