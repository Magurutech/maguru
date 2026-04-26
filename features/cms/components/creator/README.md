# Creator Components - Tiptap Editor

This directory contains the Tiptap-based rich text editor components for course creators.

## Components

### LessonEditor
Main editor component for creating and editing lesson content.

**Features:**
- Rich text editing with Tiptap
- Version tracking
- Auto-timestamp on save
- Save/Cancel actions

**Usage:**
```tsx
import { LessonEditor } from '@/components/creator'

<LessonEditor
  initialContent={existingContent}
  onSave={async (content) => {
    // Save to API
  }}
  onCancel={() => {
    // Handle cancel
  }}
/>
```

### EditorToolbar
Formatting toolbar for the Tiptap editor.

**Features:**
- Bold, Italic, Inline Code
- Headings (H1, H2, H3)
- Bullet List, Ordered List
- Links
- Code Blocks
- Active state highlighting

### LessonPreview
Read-only preview component showing how content will appear to students.

**Features:**
- Same rendering as student view
- Uses identical Tiptap extensions
- WYSIWYG consistency

**Usage:**
```tsx
import { LessonPreview } from '@/components/creator'

<LessonPreview content={tiptapDocument} />
```

## Dependencies

- `@tiptap/react` - React integration for Tiptap
- `@tiptap/starter-kit` - Essential Tiptap extensions
- `@tiptap/pm` - ProseMirror core

## Implementation Status

- ✅ Task 7.1: LessonEditor Component
- ✅ Task 7.2: EditorToolbar Component
- ✅ Task 7.3: LessonPreview Component
- ⏳ Task 7.4: Component Tests (pending)

## Requirements Mapping

- 4.1: Rich text editor with Tiptap
- 4.2: Bold formatting
- 4.3: Italic formatting
- 4.4: Inline code formatting
- 4.5: Headings (H1, H2, H3)
- 4.6: Lists (bullet and ordered)
- 4.7: Preview functionality
- 4.8: Version tracking
- 4.9: WYSIWYG consistency
