// ponytail: Menggunakan absolute positioning native React element tanpa tippy.js
import { ReactRenderer } from '@tiptap/react'
import { SlashList } from './SlashList'

// The More... trigger sits outside the normal item list so it:
//  1. Is never filtered out by the search query
//  2. Renders as a sticky footer in SlashList (not inside the scrollable area)
const MORE_ACTION = {
  title: 'Browse all tools',
  description: 'See all available blocks',
  shortcut: '',
  isMoreAction: true as const,
  command: ({ editor, range }: any) => {
    // Delete the slash trigger text first, then open the browse modal.
    // We use setTimeout to defer state update AFTER Tiptap's onExit lifecycle
    // finishes (which removes the popup and refocuses the editor). Without the
    // delay, openBrowseModal fires before React can process the state change,
    // causing the dialog to be dismissed immediately by the editor focus trap.
    editor.chain().focus().deleteRange(range).run()
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).openBrowseModal) {
        (window as any).openBrowseModal()
      }
    }, 60)
  },
}

export const suggestionOptions = {
  items: ({ query }: { query: string }) => {
    const allItems = [
      {
        title: 'Heading 1',
        description: 'Large section heading',
        shortcut: 'Ctrl+Alt+1',
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
        },
      },
      {
        title: 'Heading 2',
        description: 'Medium section heading',
        shortcut: 'Ctrl+Alt+2',
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
        },
      },
      {
        title: 'Heading 3',
        description: 'Small section heading',
        shortcut: 'Ctrl+Alt+3',
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
        },
      },
      {
        title: 'Bulleted List',
        description: 'Create an unordered list',
        shortcut: 'Ctrl+Shift+8',
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
      },
      {
        title: 'Numbered List',
        description: 'Create an ordered list',
        shortcut: 'Ctrl+Shift+7',
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
      },
      {
        title: 'Task List',
        description: 'Track tasks with checkboxes',
        shortcut: 'Ctrl+Shift+9',
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run()
        },
      },
      {
        title: 'Divider',
        description: 'Insert a horizontal rule',
        shortcut: '',
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        },
      },
      {
        title: 'Blockquote',
        description: 'Insert a quoted section',
        shortcut: 'Ctrl+Shift+B',
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleBlockquote().run()
        },
      },
    ]

    // Filter by query — More... is NOT part of this array, it lives separately
    const filtered = allItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    )

    return filtered
  },

  render: () => {
    let component: any

    return {
      onStart: (props: any) => {
        // Inject moreAction so SlashList can render it as a sticky footer
        component = new ReactRenderer(SlashList, {
          props: { ...props, moreAction: MORE_ACTION },
          editor: props.editor,
        })

        // ponytail: Tempatkan dropdown div secara absolut di koordinat clientRect
        const rect = props.clientRect()
        if (rect) {
          const popupEl = component.element
          popupEl.style.position = 'absolute'
          popupEl.style.left = `${rect.x}px`
          popupEl.style.top = `${rect.y + rect.height}px`
          popupEl.style.zIndex = '1000'
          document.body.appendChild(popupEl)
        }
      },

      onUpdate(props: any) {
        component.updateProps({ ...props, moreAction: MORE_ACTION })
        const rect = props.clientRect()
        if (rect) {
          const popupEl = component.element
          popupEl.style.left = `${rect.x}px`
          popupEl.style.top = `${rect.y + rect.height}px`
        }
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          component.element.remove()
          component.destroy()
          return true
        }
        return component.ref?.onKeyDown(props)
      },

      onExit() {
        if (component.element.parentNode) {
          component.element.remove()
        }
        component.destroy()
      },
    }
  },
}
