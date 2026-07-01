# DetailsContent extension

The Details extension enables you to use the `<details>` HTML tag in the editor. This is great to show and hide content.

```
/* Basic editor styles */
.tiptap {
  :first-child {
    margin-top: 0;
  }
}
```


```
import './styles.scss'

import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details'
import { Placeholder } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

export default () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Details.configure({
        persist: true,
        HTMLAttributes: {
          class: 'details',
        },
      }),
      DetailsSummary,
      DetailsContent,
      Placeholder.configure({
        includeChildren: true,
        placeholder: ({ node }) => {
          if (node.type.name === 'detailsSummary') {
            return 'Summary'
          }

          return null
        },
      }),
    ],
    content: `
      <p>Look at these details</p>
<!-- expanse biasa  -->
      <details>
        <summary>This is a summary</summary>
        <p>Surprise!</p>
      </details>
      <p>Nested details are also supported</p>
<!-- ini adlah untuk expanse nesthed  -->
      <!-- <details open>
        <summary>This is another summary</summary>
        <p>And there is even more.</p>
        <details>
          <summary>We need to go deeper</summary>
          <p>Booya!</p>
        </details>
      </details> -->
    `,
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="control-group">
        <div className="button-group">
          <button
            onClick={() => editor.chain().focus().setDetails().run()}
            disabled={!editor.can().setDetails()}
          >
            Set details
          </button>
          <button
            onClick={() => editor.chain().focus().unsetDetails().run()}
            disabled={!editor.can().unsetDetails()}
          >
            Unset details
          </button>
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .command(({ tr }) => {
                  tr.setNodeAttribute(23, 'open', true)
                  return true
                })
                .run()
            }
          >
            Force open first details
          </button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </>
  )
}
```

## [](#install)Install

```
npm install @tiptap/extension-details
```

## [](#usage)Usage

```
import { Details, DetailsSummary, DetailsContent } from '@tiptap/extension-details'

const editor = new Editor({
  extensions: [Details, DetailsSummary, DetailsContent],
})
```

## [](#settings)Settings

### [](#htmlattributes)HTMLAttributes

Custom HTML attributes that should be added to the rendered HTML tag.

```
DetailsContent.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```