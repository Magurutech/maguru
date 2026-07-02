import { Node } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    columns: {
      /**
       * Insert a multi-column layout
       */
      insertColumns: (count?: number) => ReturnType
    }
  }
}

// ponytail: Custom columns container node
export const Columns = Node.create({
  name: "columns",
  group: "block",
  content: "column+",
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { "data-type": "columns", class: "layout-columns", ...HTMLAttributes },
      0,
    ]
  },

  addCommands() {
    return {
      insertColumns:
        (count = 2) =>
        ({ commands }) => {
          const columnNodes = Array.from({ length: count }).map(() => ({
            type: "column",
            content: [{ type: "paragraph" }],
          }))

          return commands.insertContent({
            type: this.name,
            content: columnNodes,
          })
        },
    }
  },
})

// ponytail: Custom single column child node
export const Column = Node.create({
  name: "column",
  content: "block+",
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { "data-type": "column", class: "layout-column", ...HTMLAttributes },
      0,
    ]
  },
})
