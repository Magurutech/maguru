# Design Document: Tiptap Editor Improvement

**Feature Name:** Tiptap Editor Improvement  
**Created:** 2026-05-01  
**Status:** Draft  
**Version:** 1.0

---

## Overview

Dokumen ini menjelaskan desain teknis untuk improvement Tiptap editor di Maguru CMS Creator. Improvement dibagi menjadi 3 fase berdasarkan prioritas:

- **Phase 1 (P0):** Critical fixes — version tracking, unsaved changes warning, image upload, auto-save
- **Phase 2 (P1):** Performance & UX — useEditorState, memoization, keyboard hints, link behavior
- **Phase 3 (P2):** Code quality — extension centralization, DRY utilities, component split, preview generation

---

## Architecture

### Current Architecture

```
ManageProvider (Context)
  ├── useCourseManage
  ├── useLessonHandlers
  ├── useSectionHandlers
  ├── useManageView
  └── useReorderHandlers
      └── ManageContent.tsx (~400 lines — GOD COMPONENT)
          ├── DescriptionEditor (inline)
          ├── LessonEditorPanel (Tiptap editor)
          │   ├── HeadingShortcuts (module-level extension)
          │   ├── SaveShortcut (state-stored extension)
          │   └── EditorToolbar (via EditorContext)
          ├── LessonViewerPanel (read-only)
          └── SectionPanel
```

### Target Architecture

```
ManageProvider (Context)
  ├── useCourseManage
  ├── useLessonHandlers
  ├── useSectionHandlers
  ├── useManageView
  └── useReorderHandlers
      └── ManageContent.tsx (<100 lines — orchestrator only)
          ├── manage/CourseOverview.tsx
          ├── manage/DescriptionEditor.tsx
          ├── manage/LessonEditorPanel.tsx (+ dirty state, auto-save, image upload)
          │   ├── lib/tiptap/extensions.ts (centralized)
          │   └── EditorToolbar (+ tooltips, image button)
          ├── manage/LessonViewerPanel.tsx
          └── manage/SectionPanel.tsx

lib/
  ├── tiptap/
  │   ├── extensions.ts      (NEW)
  │   ├── preview.ts         (NEW)
  │   └── image-upload.ts    (NEW)
  └── utils/
      └── course-helpers.ts  (NEW)
```

---

## Components and Interfaces

### Phase 1: Critical Fixes

#### 1.1 Version Tracking Fix

**Root cause:** Client hardcodes `version: 1` in every save. Server already handles increment correctly in `lesson.service.ts`.

**Server behavior (already correct):**

```typescript
// lesson.service.ts — already implemented
updatedContent = {
  ...input.content,
  version: currentContent.version + 1, // server increments
  lastEdit: new Date().toISOString(),
}
```

**Fix:** For CREATE, send `version: 1`. For UPDATE, the server ignores client version and uses `currentVersion + 1`. No client-side version tracking needed.

```typescript
// LessonEditorPanel.tsx — handleSave
const content = {
  content: editor.getJSON() as JSONContent,
  version: 1, // always 1 from client — server handles increment on update
  lastEdit: new Date().toISOString(),
}
```

The actual fix is ensuring the API PUT endpoint correctly reads the existing version from DB before incrementing — which it already does. The client just needs to stop worrying about version.

#### 1.2 Unsaved Changes Warning

**New hook:** `features/cms/hooks/manage/useUnsavedChanges.ts`

```typescript
interface UseUnsavedChangesReturn {
  isDirty: boolean
  resetDirty: () => void
}

export function useUnsavedChanges(
  editor: Editor | null,
  title: string,
  initialTitle: string,
  initialContent: JSONContent | null,
): UseUnsavedChangesReturn
```

**Dirty state logic:**

- Compare `JSON.stringify(editor.getJSON())` vs `JSON.stringify(initialContent)` on every `editor.on('update')`
- Compare `title` vs `initialTitle` on every title change
- If either differs → `isDirty = true`
- On save success or cancel → `resetDirty()` sets `isDirty = false`

**Browser warning:**

```typescript
useEffect(() => {
  const handler = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault()
      e.returnValue = ''
    }
  }
  window.addEventListener('beforeunload', handler)
  return () => window.removeEventListener('beforeunload', handler)
}, [isDirty])
```

**Visual indicator:** Show `•` dot next to save button when `isDirty === true`.

#### 1.3 Image Upload

**New file:** `lib/tiptap/image-upload.ts`

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadLessonImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.')
  }
  if (file.size > MAX_SIZE) {
    throw new Error('Ukuran gambar maksimal 5MB.')
  }

  const ext = file.name.split('.').pop()
  const fileName = `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabaseStorage.storage
    .from('lesson-images')
    .upload(fileName, file, { contentType: file.type, upsert: false })

  if (error) throw new Error(`Upload gagal: ${error.message}`)

  const { data } = supabaseStorage.storage.from('lesson-images').getPublicUrl(fileName)

  return data.publicUrl
}
```

**ImageUploadButton** added to `EditorToolbar.tsx`:

```typescript
function ImageUploadButton() {
  const { editor } = useCurrentEditor()
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    setUploading(true)
    try {
      const url = await uploadLessonImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal mengupload gambar'))
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden" onChange={handleFile} />
      <ToolbarButton onClick={() => inputRef.current?.click()} disabled={uploading}
        tooltip="Upload Gambar">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
      </ToolbarButton>
    </>
  )
}
```

**Paste support** via `editorProps.handlePaste` in editor config to intercept pasted image files.

**Supabase bucket:** `course-materials` — public bucket, needs to be created in Supabase dashboard.

#### 1.4 Auto-save to localStorage

**New hook:** `features/cms/hooks/manage/useAutoSave.ts`

```typescript
const DRAFT_KEY = (id: string) => `lesson-draft-${id}`
const DELAY = 10_000 // 10 seconds

interface LessonDraft {
  title: string
  content: JSONContent
  savedAt: string
}

export function useAutoSave(options: {
  lessonId: string | undefined
  title: string
  editor: Editor | null
  isDirty: boolean
}): { lastAutoSave: Date | null; clearDraft: () => void }
```

**Auto-save flow:**

```
content/title changes
  → isDirty = true
  → debounce timer starts (10s)
  → timer fires → save to localStorage
  → show "Draft tersimpan" indicator (3s then fade)
```

**Draft restore flow on editor open:**

```
Open LessonEditorPanel (edit mode)
  → Check localStorage[DRAFT_KEY(lessonId)]
  → If draft exists AND draft.savedAt > lesson.lastEdit
    → Show restore prompt (shadcn Alert or Dialog)
    → [Pulihkan] → setContent(draft.content), setTitle(draft.title)
    → [Abaikan] → clearDraft(), load server content
  → Else → load server content normally
```

---

### Phase 2: Performance & UX

#### 2.1 EditorToolbar Memoization

```typescript
export const EditorToolbar = React.memo(function EditorToolbar() {
  return (
    <Toolbar>
      {/* existing content + new ImageUploadButton */}
      <ToolbarGroup>
        <ImageUploadButton />
      </ToolbarGroup>
    </Toolbar>
  )
})
```

The existing toolbar components (`MarkButton`, `HeadingDropdownMenu`, etc.) from `@/components/tiptap-ui/*` are pre-built Tiptap UI components that already use `useEditorState` internally. No refactoring needed for those.

#### 2.2 Component Memoization

```typescript
// ManageSidebar.tsx
export const SortableSectionItem = React.memo(function SortableSectionItem(props) { ... })
export const SortableLessonItem = React.memo(function SortableLessonItem(props) { ... })

// After split:
export const LessonEditorPanel = React.memo(function LessonEditorPanel(props) { ... })
export const LessonViewerPanel = React.memo(function LessonViewerPanel(props) { ... })
```

#### 2.3 Keyboard Shortcut Hints

**New utility:** `lib/utils/keyboard.ts`

```typescript
export function getModKey(): 'Cmd' | 'Ctrl' {
  if (typeof window === 'undefined') return 'Ctrl'
  return /Mac|iPhone|iPad/.test(navigator.platform) ? 'Cmd' : 'Ctrl'
}
```

**Tooltip wrapper** around toolbar buttons using shadcn/ui `Tooltip`:

```typescript
// Wrap each toolbar group with tooltips
<TooltipProvider delayDuration={300}>
  <Tooltip>
    <TooltipTrigger asChild><MarkButton type="bold" /></TooltipTrigger>
    <TooltipContent>Bold ({getModKey()}+B)</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

#### 2.4 Link Behavior

Add to `LessonEditorPanel` editor config:

```typescript
editorProps: {
  handleDOMEvents: {
    click: (_view, event) => {
      const link = (event.target as HTMLElement).closest('a')
      if (link && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        window.open(link.getAttribute('href') ?? '', '_blank', 'noopener,noreferrer')
        return true
      }
      return false
    },
  },
}
```

CSS tooltip on link hover (in `simple-editor.scss` or global styles):

```css
.simple-editor .tiptap a[href] {
  cursor: text;
  position: relative;
}
.simple-editor .tiptap a[href]:hover::after {
  content: 'Ctrl+Click untuk membuka';
  position: absolute;
  bottom: 100%;
  left: 0;
  background: #1a1a1a;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
}
```

---

### Phase 3: Code Quality

#### 3.1 Extension Centralization

**New file:** `lib/tiptap/extensions.ts`

```typescript
export const commonExtensions = [
  StarterKit,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Highlight.configure({ multicolor: true }),
  Typography,
  Superscript,
  Subscript,
  // Selection extension REMOVED — not used anywhere explicitly
]

export function createEditorExtensions(saveRef: React.RefObject<() => void>) {
  return [
    ...commonExtensions,
    Image.configure({ inline: false, allowBase64: false }),
    HeadingShortcuts, // module-level constant
    createSaveShortcut(saveRef), // factory function
  ]
}

export const viewerExtensions = [...commonExtensions, Image]
export const descriptionExtensions = [StarterKit]
```

**Selection extension:** Confirmed not used anywhere explicitly. Will be removed.

**Typography extension:** Kept — provides smart quotes and dashes which improve content quality.

#### 3.2 DRY Utilities

**New file:** `lib/utils/course-helpers.ts`

```typescript
export function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    BEGINNER: 'text-green-600 bg-green-50 border-green-200',
    INTERMEDIATE: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    ADVANCED: 'text-red-600 bg-red-50 border-red-200',
  }
  return map[difficulty] ?? 'text-gray-600 bg-gray-50 border-gray-200'
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message
  return fallback
}
```

Refactor `CourseCard`, `CourseOverviewHero`, `CourseListItem` to use `getDifficultyColor`.
Refactor all 15+ API error handlers to use `getErrorMessage`.

#### 3.3 ManageContent Split

```
features/cms/components/creator/manage/
  ├── ManageContent.tsx          (<100 lines, orchestrator)
  ├── CourseOverview.tsx         (extracted)
  ├── DescriptionEditor.tsx      (extracted)
  ├── LessonEditorPanel.tsx      (extracted + improvements)
  ├── LessonViewerPanel.tsx      (extracted)
  └── SectionPanel.tsx           (extracted)
```

#### 3.4 Content Preview

**New file:** `lib/tiptap/preview.ts`

```typescript
export function generatePreview(content: JSONContent | null | undefined, maxLength = 200): string {
  if (!content) return ''
  const parts: string[] = []

  function traverse(node: JSONContent) {
    if (node.type === 'text' && node.text) parts.push(node.text)
    if (['paragraph', 'heading', 'blockquote'].includes(node.type ?? '')) parts.push(' ')
    node.content?.forEach(traverse)
  }

  traverse(content)
  const text = parts.join('').trim().replace(/\s+/g, ' ')
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...'
}
```

#### 3.5 Editor Lifecycle Cleanup

Add to `LessonEditorPanel`, `LessonViewerPanel`, `DescriptionEditor`:

```typescript
useEffect(() => {
  return () => {
    editor?.destroy()
  }
}, [editor])
```

---

## Data Models

### LocalStorage Draft

```typescript
interface LessonDraft {
  title: string
  content: JSONContent
  savedAt: string // ISO 8601
}
// Key: `lesson-draft-${lessonId}`
```

### Image Upload

Images stored in Supabase bucket `course-materials` as public files.
URL format: `https://{project}.supabase.co/storage/v1/object/public/course-materials/{filename}`

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do._

### Property 1: Version Increment Monotonicity

_For any_ existing lesson with version N, saving an update should result in the lesson having version N+1 in the database response.

**Validates: Requirements 1.3**

### Property 2: Dirty State Round-trip

_For any_ sequence of editor changes followed by undoing all changes back to the initial content, the dirty state should be false (matching the initial state).

**Validates: Requirements 2.7, 2.8**

### Property 3: Image Validation — Size

_For any_ file with `size > 5 * 1024 * 1024` bytes, `uploadLessonImage` should throw an error. _For any_ file with valid size and valid MIME type, it should not throw a validation error.

**Validates: Requirements 3.5, 3.6**

### Property 4: Image Validation — Type

_For any_ file with MIME type not in `['image/jpeg', 'image/png', 'image/gif', 'image/webp']`, `uploadLessonImage` should throw an error containing "Format gambar".

**Validates: Requirements 3.4, 3.7**

### Property 5: Preview Text Extraction

_For any_ valid Tiptap JSON document containing text nodes, `generatePreview` should return a non-empty string that contains the text from those nodes.

**Validates: Requirements 14.3, 14.5**

### Property 6: Preview Truncation

_For any_ Tiptap JSON where extracted text length exceeds `maxLength`, `generatePreview(content, maxLength)` should return a string ending with `'...'` and with total length `maxLength + 3`.

**Validates: Requirements 14.6**

---

## Error Handling

| Scenario              | Message (Indonesian)                                              | Behavior                  |
| --------------------- | ----------------------------------------------------------------- | ------------------------- |
| Image > 5MB           | "Ukuran gambar maksimal 5MB."                                     | Reject, toast error       |
| Invalid image format  | "Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP." | Reject, toast error       |
| Upload network error  | "Gagal mengupload gambar. Coba lagi."                             | Toast error, no insert    |
| Lesson save API error | API message or "Gagal menyimpan pelajaran"                        | Toast error, keep dirty   |
| Draft corrupted       | Silent fail                                                       | Delete draft, load server |

---

## Testing Strategy

### Unit Tests (Jest)

- `lib/tiptap/preview.ts` — generatePreview with various node types, empty content, truncation
- `lib/tiptap/image-upload.ts` — validation logic (mock supabaseStorage)
- `lib/utils/course-helpers.ts` — getDifficultyColor all values, getErrorMessage both branches
- `lib/utils/keyboard.ts` — getModKey with mocked navigator.platform
- `features/cms/hooks/manage/useUnsavedChanges.ts` — dirty state transitions
- `features/cms/hooks/manage/useAutoSave.ts` — draft save/restore/clear

### Property-Based Tests (fast-check)

Each property test runs minimum **100 iterations**.
Tag format: `Feature: tiptap-editor-improvement, Property N: [property text]`

- **Property 3:** `fc.record({ size: fc.integer({ min: 0 }) })` → verify size validation
- **Property 4:** `fc.string()` as MIME type → verify type validation
- **Property 5 & 6:** `fc.record(...)` generating Tiptap JSON → verify preview output

### Component Tests (Jest + Testing Library)

- `LessonEditorPanel` — dirty indicator, image button, auto-save trigger
- `EditorToolbar` — tooltip presence, image button render
- `ManageContent` — correct panel per activeView

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-01  
**Status:** Draft - Awaiting Review
