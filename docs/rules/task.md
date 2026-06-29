# 🚀 TipTap Editor Enhancements - Implementation Plan

**Feature**: Slash Command (Notion-style) + Extended Toolbar Extensions + CSS Parity for View Panel

**Status**: Ready to Implement (YAGNI-approved, minimal dependencies)

**Last Updated**: June 29, 2026

---

## 📋 Implementation Checklist

### Phase 1: Slash Command Extension Setup

- [ ] **Task 1.1** — Create SlashCommand extension file
  - **File**: `features/cms/components/creator/manage/editor/extensions/SlashCommand.ts`
  - **What**: TipTap suggestion extension that triggers on `/` character
  - **Dependencies**: `@tiptap/suggestion`
  - **Reference**: Use `tiptap-imrpove.md` as technical guide

- [ ] **Task 1.2** — Create SlashList dropdown component
  - **File**: `features/cms/components/creator/manage/editor/components/SlashList.tsx`
  - **What**: React component that renders slash command menu items
  - **Features**:
    - Keyboard navigation (arrow up/down, Enter to select, Escape to close)
    - Filtering by query (fuzzy match on item title)
    - Keyboard event handling (onKeyDown ref)
  - **Style**: Simple dropdown, no external UI library

- [ ] **Task 1.3** — Create suggestion configuration helper
  - **File**: `features/cms/components/creator/manage/editor/components/suggestion.ts`
  - **What**: Configure absolute positioning rendering using `ReactRenderer`
  - **Approach**: Position dropdown at `clientRect` coords, append to `document.body`
  - **Lifecycle**: onStart → onUpdate → onKeyDown → onExit (cleanup)

- [ ] **Task 1.4** — Define slash command menu items
  - **File**: Same as Task 1.3 (`suggestion.ts`)
  - **Items** (6 total):
    1. **Heading 1** — `editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()`
    2. **Heading 2** — `editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()`
    3. **Bullet List** — `editor.chain().focus().deleteRange(range).toggleBulletList().run()`
    4. **Task List** — `editor.chain().focus().deleteRange(range).toggleTaskList().run()`
    5. **Horizontal Rule** — `editor.chain().focus().deleteRange(range).setHorizontalRule().run()`
    6. **Blockquote** — `editor.chain().focus().deleteRange(range).toggleBlockquote().run()`

- [ ] **Task 1.5** — Integrate SlashCommand into editor configuration
  - **File**: Where TipTap editor is initialized (likely `LessonEditorPanel.tsx` or editor config file)
  - **What**: Add `SlashCommand.configure({ suggestion: suggestionOptions })` to extensions array
  - **Verify**: Test slash command triggers on `/` in editor

---

### Phase 2: Toolbar Extensions Integration

- [ ] **Task 2.1** — Add TaskList & TaskItem extensions
  - **File**: Editor configuration (same as Task 1.5)
  - **What**: Include `TaskList` and `TaskItem` from `@tiptap/extension-task-list`
  - **Config**:
    ```typescript
    ;(TaskList.configure({
      nested: true,
    }),
      TaskItem.configure({
        nested: true,
        editable: true, // in editor mode
      }))
    ```
  - **Note**: Will be toggled via slash command `/` → "Task List" OR existing toolbar button

- [ ] **Task 2.2** — Add HorizontalRule extension
  - **File**: Same editor configuration
  - **What**: Include `HorizontalRule` from `@tiptap/extension-horizontal-rule`
  - **Usage**: Via slash command `/` → "Horizontal Rule" or toolbar button

- [ ] **Task 2.3** — Configure Image extension for responsive rendering
  - **File**: Editor configuration
  - **What**: Ensure `Image` extension is configured with:
    ```typescript
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: 'tiptap-image', // for CSS targeting
      },
    })
    ```
  - **Note**: No custom resize handles; CSS handles styling

- [ ] **Task 2.4** — Verify toolbar buttons still work with new extensions
  - **File**: `features/cms/components/creator/EditorToolbar.tsx`
  - **What**: Ensure existing toolbar buttons (if any) for task list, HR, image work correctly
  - **Test**: No breaking changes to toolbar UX

---

### Phase 3: Keyboard Shortcuts & Tooltips

- [ ] **Task 3.1** — Add shortcut hints to toolbar buttons
  - **File**: `features/cms/components/creator/EditorToolbar.tsx` (each button component)
  - **What**: Add `title` or `aria-label` attributes with keyboard shortcuts
  - **Examples**:
    - Bold: `Ctrl/⌘ + B`
    - Italic: `Ctrl/⌘ + I`
    - Heading 1: `Ctrl/⌘ + Shift + 1`
    - Slash Command: `Type /`
  - **Verify**: Tooltips visible on hover

- [ ] **Task 3.2** — Enable Tab/Shift+Tab for list indentation
  - **File**: Editor configuration OR keyboard handler
  - **What**: Verify TipTap's native tab handling works for:
    - Bullet lists (Tab = indent, Shift+Tab = outdent)
    - Task lists (Tab = indent, Shift+Tab = outdent)
  - **Test**: Tab/Shift+Tab indentation in both list types

---

### Phase 4: View Panel CSS Parity

- [ ] **Task 4.1** — Review current viewer styles
  - **File**: `components/tiptap-node/` (or wherever `.simple-editor-content` styles are)
  - **What**: Find CSS rules for rendering editor content in read-only mode
  - **Note**: Locate the stylesheet(s) that style `.simple-editor-content` class

- [ ] **Task 4.2** — Add CSS styles for new elements
  - **File**: Same viewer stylesheet (e.g., `tiptap-node.scss` or global CSS)
  - **Elements** to style:
    1. **TaskList** — `ul.task-list` or equivalent TipTap class
       - Checkbox appearance (read-only or disabled)
       - List item padding/margin
    2. **TaskItem** — `li.task-item` or equivalent
       - Checkbox positioning
       - Text alignment with checkbox
    3. **HorizontalRule** — `hr` element
       - Visual styling (color, margin, border)
       - Match editor appearance
    4. **Image** — Ensure responsive
       - Class: `.tiptap-image`
       - Styles: `max-w-full h-auto rounded-2xl`
       - Responsive container

- [ ] **Task 4.3** — Verify CSS matches between editor and viewer
  - **File**: Compare styles in both:
    - Editor: `LessonEditorPanel.tsx` inline styles + TipTap default styles
    - Viewer: `.simple-editor-content` stylesheet
  - **What**: Render same content in both modes and visually compare
  - **Checklist**:
    - [ ] Task list checkboxes look identical
    - [ ] HR line thickness/color matches
    - [ ] Image sizing/rounding matches
    - [ ] Text alignment matches

---

### Phase 5: Testing & Validation

- [ ] **Task 5.1** — Manual test slash command UX
  - **Scenario**: Open lesson editor, type `/`, see dropdown appear
  - **Test**:
    - [ ] Dropdown renders at correct position (under cursor)
    - [ ] Arrow keys navigate items
    - [ ] Enter selects item
    - [ ] Escape closes dropdown
    - [ ] Typing filters items correctly
    - [ ] Command executes and inserts block

- [ ] **Task 5.2** — Test all 6 slash commands
  - **Test each**:
    - [ ] `/` → Type "heading" → Select "Heading 1" → Verify H1 inserted
    - [ ] `/` → Type "heading" → Select "Heading 2" → Verify H2 inserted
    - [ ] `/` → Type "bullet" → Select "Bullet List" → Verify list inserted
    - [ ] `/` → Type "task" → Select "Task List" → Verify task list inserted
    - [ ] `/` → Type "line" → Select "Horizontal Rule" → Verify HR inserted
    - [ ] `/` → Type "quote" → Select "Blockquote" → Verify blockquote inserted

- [ ] **Task 5.3** — Test task list functionality
  - **Test**:
    - [ ] Click checkbox in editor → toggles checked state
    - [ ] Tab key indents task item
    - [ ] Shift+Tab outdents task item
    - [ ] In viewer: checkboxes are disabled (read-only)
    - [ ] Layout matches editor appearance

- [ ] **Task 5.4** — Test keyboard navigation
  - **Test**:
    - [ ] Tab/Shift+Tab works in bullet lists
    - [ ] Tab/Shift+Tab works in task lists
    - [ ] Cmd+B (bold), Cmd+I (italic) still work
    - [ ] Cmd+Shift+1/2/3 (heading) shortcuts still work
    - [ ] Cmd+Enter (save) still works

- [ ] **Task 5.5** — Test integration with toolbar
  - **Test**:
    - [ ] Toolbar buttons work alongside slash commands
    - [ ] No console errors when using both
    - [ ] State consistency (if toolbar marks text bold, slash command doesn't duplicate)

- [ ] **Task 5.6** — Test view panel CSS parity
  - **Test**:
    - [ ] Create lesson with task list + HR + image in editor
    - [ ] Save lesson
    - [ ] Open lesson in read-only viewer
    - [ ] [ ] Task list renders identically (checkboxes disabled)
    - [ ] [ ] HR matches editor appearance
    - [ ] [ ] Image responsive and rounded
    - [ ] No style mismatches

---

### Phase 6: Code Cleanup & Documentation

- [ ] **Task 6.1** — Remove console.log & debug code
  - **Files**: SlashCommand.ts, SlashList.tsx, suggestion.ts
  - **What**: Ensure no debug output in production

- [ ] **Task 6.2** — Add JSDoc comments to new files
  - **Files**:
    - `extensions/SlashCommand.ts` — Extension overview + configuration
    - `components/SlashList.tsx` — Component props, keyboard handling
    - `components/suggestion.ts` — Rendering lifecycle, positioning logic
  - **Format**: Standard TSDoc comments

- [ ] **Task 6.3** — Update README or dev docs
  - **File**: Create or update `docs/docs/tiptap/slash-command-guide.md` (optional)
  - **Content**: How to use slash commands, keyboard shortcuts, adding new items

---

## 🔧 Technical Notes

### File Structure (After Implementation)

```
📁 features/cms/components/creator/manage/editor/
├── extensions/
│   └── SlashCommand.ts          ← Suggestion extension
└── components/
    ├── SlashList.tsx            ← Dropdown React component
    ├── SlashListItem.tsx        ← (Optional) Single item component
    └── suggestion.ts            ← Rendering configuration + menu items
```

### Dependencies Required

- ✅ Already installed: `@tiptap/core`, `@tiptap/react`, `@tiptap/starter-kit`
- ✅ Already installed: `@tiptap/extension-task-list`, `@tiptap/extension-horizontal-rule`
- ✅ Already installed: `@tiptap/extension-image`
- ✅ No new external dependencies needed (YAGNI principle)

### CSS Files to Modify

- `components/tiptap-node/` (where `.simple-editor-content` styles live)
- Add rules for: `.task-list`, `.task-item`, `hr`, `.tiptap-image`

### Editor Configuration Location

- Likely: `features/cms/components/creator/manage/panels/LessonEditorPanel.tsx` or similar
- Or: Separate `lib/tiptap/editor-config.ts` if centralized

---

## 🎯 Success Criteria

✅ **Slash Command Functional**

- Dropdown appears on `/`, filters on query, executes command
- All 6 items work (H1, H2, Bullet, Task, HR, Quote)

✅ **Task List Works**

- Checkbox toggle in editor, Tab/Shift+Tab indent/outdent
- Read-only in viewer

✅ **CSS Parity**

- New elements (task list, HR, image) render identically in editor & viewer

✅ **No Regressions**

- Existing toolbar buttons still work
- Keyboard shortcuts (Cmd+B, etc.) still work
- Editor performance unchanged

✅ **Minimal Dependencies**

- No new npm packages installed
- Only TipTap defaults + native React

---

## 📌 Notes for Developer

- **YAGNI Principle Applied**: No bubble menus, no resize handles, no drag-reorder
- **CSS Styling**: Use existing Tailwind/SCSS from project (check globals.css)
- **Browser Testing**: Test on Chrome, Firefox, Safari (basic compatibility)
- **Accessibility**: Ensure keyboard navigation works, aria-labels on interactive elements
- **Reference Docs**: Keep `tiptap-imrpove.md` and `error.md` open during implementation

---

## 🔄 Execution Order (Recommended)

1. **Start with Phase 1** (Slash Command extension) — This is the core feature
2. **Then Phase 2** (Toolbar extensions) — Adds breadth, uses TipTap defaults
3. **Then Phase 3** (Keyboard shortcuts) — Polish, UX improvements
4. **Then Phase 4** (CSS parity) — Visual consistency
5. **Then Phase 5** (Testing) — Validation & bug fixes
6. **Finally Phase 6** (Cleanup) — Documentation & final review

---

## ⏱️ Estimated Time

| Phase     | Tasks    | Est. Time       |
| --------- | -------- | --------------- |
| 1         | 1.1-1.5  | 2-3 hours       |
| 2         | 2.1-2.4  | 1-2 hours       |
| 3         | 3.1-3.2  | 30-45 min       |
| 4         | 4.1-4.3  | 1-1.5 hours     |
| 5         | 5.1-5.6  | 1-2 hours       |
| 6         | 6.1-6.3  | 30-45 min       |
| **TOTAL** | 18 tasks | **~7-10 hours** |

---

**Ready to start? Begin with Phase 1, Task 1.1.**
