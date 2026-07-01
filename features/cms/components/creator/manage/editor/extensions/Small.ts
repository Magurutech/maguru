import { Mark } from '@tiptap/core'

export interface SmallOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    small: {
      /**
       * Set a small mark
       */
      setSmall: () => ReturnType
      /**
       * Toggle a small mark
       */
      toggleSmall: () => ReturnType
      /**
       * Unset a small mark
       */
      unsetSmall: () => ReturnType
    }
  }
}

// ponytail: Mark kustom super ringkas untuk merender tag HTML <small>
export const Small = Mark.create<SmallOptions>({
  name: 'small',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'small',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['small', HTMLAttributes, 0]
  },

  addCommands() {
    return {
      setSmall: () => ({ commands }) => {
        return commands.setMark(this.name)
      },
      toggleSmall: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      },
      unsetSmall: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
})
