# Tiptap Rendering Comparison: Creator vs Student

**Tanggal:** 2026-04-10  
**Issue:** Manual Test 2.3 - Konten Tiptap Ter-render  
**Status:** Analysis Complete

---

## Screenshot Evidence

### Creator View (LessonViewerPanel)
✅ **Rendering sempurna:**
- Headings dengan hierarchy yang jelas (h1, h2, h3)
- Paragraphs dengan spacing yang baik
- Bold text ter-render dengan benar
- Code blocks dengan background berbeda
- Lists (bullet/numbered) ter-format dengan baik
- Typography yang konsisten

### Student View (LessonViewer)
❌ **Rendering bermasalah:**
- Semua text tampil sebagai plain text
- Tidak ada formatting (bold, italic, headings)
- Tidak ada visual hierarchy
- Code blocks tidak ter-highlight
- Lists tidak ter-format

---

## Root Cause Analysis

### 1. Extensions Mismatch

**Creator (ManageContent.tsx - LessonViewerPanel):**
```tsx
extensions: [
  StarterKit.configure({
    link: { openOnClick: false },
  }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Highlight.configure({ multicolor: true }),
  Typography,
  Superscript,
  Subscript,
  Selection,
]
```

**Student (LessonViewer.tsx):**
```tsx
extensions: [StarterKit]  // ← HANYA StarterKit, tidak ada extensions lain!
```

**Masalah:**
- Student viewer hanya menggunakan `StarterKit` basic
- Tidak ada `TextAlign`, `Highlight`, `Typography`, `Superscript`, `Subscript`
- Jika content menggunakan extensions tersebut, tidak akan ter-render dengan benar

### 2. Styling/CSS Import Missing

**Creator (ManageContent.tsx):**
```tsx
// Import semua node styles
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-templates/simple/simple-editor.scss'
```

**Student (LessonViewer.tsx):**
```tsx
// ❌ TIDAK ADA import styles sama sekali!
```

**Masalah:**
- Tidak ada CSS untuk styling nodes (heading, paragraph, code block, dll)
- Semua content tampil dengan default browser styling
- Tidak ada visual hierarchy atau formatting

### 3. Editor Props Class Mismatch

**Creator:**
```tsx
editorProps: {
  attributes: {
    class: 'simple-editor',  // ← Menggunakan class dari simple-editor.scss
    'aria-label': 'Konten pelajaran',
  },
}
```

**Student:**
```tsx
editorProps: {
  attributes: {
    class: 'tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
    // ← Menggunakan Tailwind prose, tapi tidak ada prose config!
  },
}
```

**Masalah:**
- Student menggunakan Tailwind `prose` classes tapi tidak ada prose plugin config
- Creator menggunakan custom SCSS yang sudah di-import
- Inconsistent styling approach

---

## Comparison Table

| Aspect | Creator (LessonViewerPanel) | Student (LessonViewer) | Status |
|--------|----------------------------|------------------------|--------|
| **Extensions** | StarterKit + 6 additional | StarterKit only | ❌ Mismatch |
| **CSS Imports** | 6 node styles + editor.scss | None | ❌ Missing |
| **Editor Class** | `simple-editor` | `tiptap prose ...` | ❌ Different |
| **TextAlign** | ✅ Configured | ❌ Missing | ❌ |
| **Highlight** | ✅ Multicolor | ❌ Missing | ❌ |
| **Typography** | ✅ Enabled | ❌ Missing | ❌ |
| **Superscript/Subscript** | ✅ Enabled | ❌ Missing | ❌ |
| **Visual Hierarchy** | ✅ Clear | ❌ Flat | ❌ |
| **Code Blocks** | ✅ Highlighted | ❌ Plain text | ❌ |

---

## Solution

### Option 1: Mirror Creator Extensions (Recommended)

**Pros:**
- WYSIWYG consistency (What You See Is What You Get)
- Content yang dibuat di creator akan ter-render identik di student
- Menggunakan extensions yang sama = no compatibility issues

**Cons:**
- Perlu install additional Tiptap extensions
- File size sedikit lebih besar (tapi negligible)

**Implementation:**

1. **Update `LessonViewer.tsx` extensions:**
```tsx
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { Typography } from '@tiptap/extension-typography'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Selection } from '@tiptap/extensions'

// Import node styles
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-templates/simple/simple-editor.scss'

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      link: { openOnClick: false },
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight.configure({ multicolor: true }),
    Typography,
    Superscript,
    Subscript,
    Selection,
  ],
  content: lesson.content.content,
  editable: false,
  immediatelyRender: false,
  shouldRerenderOnTransaction: false,
  editorProps: {
    attributes: {
      class: 'simple-editor',  // ← Sama dengan creator
      'aria-label': 'Konten pelajaran',
    },
  },
  // ... rest
})
```

2. **Update EditorContent wrapper:**
```tsx
<EditorContent 
  editor={editor} 
  className="simple-editor-content max-w-full [&_.tiptap]:px-0"
  role="presentation"
/>
```

### Option 2: Use Tailwind Prose (Alternative)

**Pros:**
- Tidak perlu custom SCSS
- Menggunakan Tailwind typography plugin

**Cons:**
- Perlu configure Tailwind prose plugin
- Styling mungkin berbeda dengan creator
- Tidak WYSIWYG

**Not Recommended** karena melanggar prinsip WYSIWYG.

---

## Files to Modify

1. ✏️ `features/cms/components/student/LessonViewer.tsx`
   - Add Tiptap extension imports
   - Add SCSS imports
   - Update `useEditor` extensions config
   - Update `editorProps.attributes.class`
   - Update `EditorContent` className

2. ✅ `features/cms/components/creator/manage/ManageContent.tsx` (no changes)

---

## Testing Checklist

Setelah fix:

- [ ] Headings (h1, h2, h3) ter-render dengan ukuran berbeda
- [ ] Bold text ter-render dengan font-weight bold
- [ ] Italic text ter-render dengan font-style italic
- [ ] Code blocks ter-render dengan background berbeda
- [ ] Inline code ter-render dengan background dan font monospace
- [ ] Bullet lists ter-render dengan bullets
- [ ] Numbered lists ter-render dengan numbers
- [ ] Blockquotes ter-render dengan border kiri
- [ ] Text alignment (left/center/right) ter-render dengan benar
- [ ] Highlighted text ter-render dengan background color
- [ ] Superscript/subscript ter-render dengan benar
- [ ] Typography enhancements (smart quotes, dashes) ter-render
- [ ] Visual hierarchy jelas dan konsisten dengan creator view
- [ ] Tidak ada raw JSON yang terlihat
- [ ] Tidak ada console errors
- [ ] Responsive di mobile

---

## Related Documentation

- ✅ Tiptap Concepts: `docs/docs/tiptap.md`
- ✅ Tiptap Notion Template: `docs/docs/tiptap-notion.md`
- ✅ Simple Editor Template: Referenced in creator implementation

---

## Priority

**🔴 Critical** - Content tidak ter-render dengan benar, user experience sangat buruk.

Harus diperbaiki sebelum deployment.

---

## Additional Notes

### Why WYSIWYG Matters

WYSIWYG (What You See Is What You Get) adalah prinsip fundamental dalam content management:

1. **Creator Expectation:** Creator membuat content dengan formatting tertentu
2. **Student Expectation:** Student expect melihat content dengan formatting yang sama
3. **Trust:** Jika rendering berbeda, creator kehilangan trust terhadap platform

### Tiptap Extension Philosophy

Tiptap menggunakan modular extension system:
- **StarterKit:** Basic functionality (headings, paragraphs, lists, bold, italic)
- **Additional Extensions:** Advanced features (text align, highlight, typography)

Jika content menggunakan extension yang tidak di-load di viewer, content tersebut akan:
- Tidak ter-render (hilang)
- Ter-render sebagai plain text (kehilangan formatting)
- Ter-render dengan fallback (tidak sesuai intent)

**Solution:** Viewer MUST load ALL extensions yang digunakan di editor.

---

## Implementation Priority

1. **High Priority (Must Have):**
   - StarterKit (already have)
   - TextAlign
   - Highlight
   - SCSS imports

2. **Medium Priority (Should Have):**
   - Typography
   - Superscript/Subscript
   - Selection

3. **Low Priority (Nice to Have):**
   - Custom extensions (jika ada)

Recommended: Implement ALL extensions untuk full WYSIWYG consistency.
