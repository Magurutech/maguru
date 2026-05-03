# Requirements Document: Tiptap Editor Improvement

**Feature Name:** Tiptap Editor Improvement  
**Created:** 2026-05-01  
**Status:** Draft  
**Version:** 2.0

---

## Introduction

Berdasarkan analisis implementasi saat ini (error.md), compliance report (report.md), dan research 21 pertanyaan best practices, spec ini mendefinisikan improvement untuk Tiptap editor di Maguru CMS Creator.

Fokus utama adalah memperbaiki **critical gaps** yang berdampak langsung pada user experience dan data integrity, kemudian dilanjutkan dengan performance optimization dan code quality.

**Compliance Score Saat Ini: 7/10** → Target: 9/10

---

## Glossary

- **Editor**: Tiptap editor instance di LessonEditorPanel (editable: true)
- **Viewer**: Tiptap editor instance di LessonViewerPanel (editable: false)
- **Dirty State**: Kondisi editor yang memiliki perubahan belum disimpan
- **Auto-save**: Penyimpanan otomatis ke localStorage dengan debounce
- **LessonContent**: Objek `{ content: JSONContent, version: number, lastEdit: string }`
- **EditorToolbar**: Komponen toolbar yang berisi tombol-tombol formatting
- **ManageContent**: God component ~400 baris yang berisi 4 sub-komponen
- **SortableSectionItem**: Komponen DnD yang menerima 20+ props
- **useEditorState**: Hook Tiptap untuk subscribe ke specific editor state changes
- **Supabase Storage**: Storage service untuk menyimpan file gambar lesson

---

## Requirements

### Requirement 1: Version Tracking Fix

**User Story:** As a Creator, I want lesson versions to increment correctly on every save, so that I can track content changes over time.

#### Acceptance Criteria

1.1. WHEN a Creator saves a lesson, THE System SHALL read the current version from the existing lesson data

1.2. WHEN a Creator saves a lesson for the first time (create), THE System SHALL set version to 1

1.3. WHEN a Creator saves an existing lesson (update), THE System SHALL increment the version by 1

1.4. THE System SHALL update the `lastEdit` timestamp to current ISO 8601 time on every save

1.5. IF the lesson API returns the updated version, THE System SHALL display the current version number in the editor UI

1.6. THE System SHALL pass the correct version number in the LessonContent object sent to the API

---

### Requirement 2: Unsaved Changes Warning

**User Story:** As a Creator, I want to be warned before losing unsaved changes, so that I don't accidentally lose my work when navigating away.

#### Acceptance Criteria

2.1. WHEN a Creator modifies editor content, THE System SHALL set dirty state to true

2.2. WHEN a Creator modifies the lesson title, THE System SHALL set dirty state to true

2.3. WHEN a Creator saves successfully, THE System SHALL reset dirty state to false

2.4. WHEN a Creator clicks Cancel, THE System SHALL reset dirty state to false

2.5. WHEN dirty state is true and Creator attempts to close or refresh the browser tab, THE System SHALL show the browser's native confirmation dialog

2.6. WHEN dirty state is true and Creator navigates to a different lesson, THE System SHALL show a confirmation dialog before switching

2.7. THE System SHALL compare current content with initial content using JSON comparison to determine dirty state accurately

2.8. WHEN a Creator undoes all changes back to the initial state, THE System SHALL reset dirty state to false

2.9. WHEN dirty state is true, THE System SHALL display a visual indicator (e.g., unsaved dot) near the save button

---

### Requirement 3: Image Upload

**User Story:** As a Creator, I want to insert images into lesson content, so that I can create visually rich learning materials.

#### Acceptance Criteria

3.1. THE System SHALL activate `@tiptap/extension-image` in the editor extensions

3.2. THE System SHALL add an Image Upload button to EditorToolbar

3.3. WHEN a Creator clicks the Image button, THE System SHALL open a file picker dialog

3.4. THE System SHALL accept image formats: JPG, PNG, GIF, WebP

3.5. THE System SHALL validate image file size with maximum 5MB

3.6. IF the selected file exceeds 5MB, THE System SHALL display an error message in Indonesian

3.7. IF the selected file format is not supported, THE System SHALL display an error message in Indonesian

3.8. WHEN a valid image is selected, THE System SHALL upload it to Supabase Storage bucket `lesson-images`

3.9. WHEN upload is in progress, THE System SHALL show a loading indicator on the Image button

3.10. WHEN upload completes successfully, THE System SHALL insert an image node with the Supabase public URL into the editor

3.11. WHEN upload fails, THE System SHALL display an error toast and not insert any node

3.12. THE System SHALL use the existing `supabaseStorage` client from `lib/supabase.ts` for upload

3.13. THE System SHALL store image URL (not base64) in the Tiptap JSON content

3.14. THE System SHALL support paste image from clipboard into the editor

---

### Requirement 4: Auto-save to localStorage

**User Story:** As a Creator, I want my work to be saved automatically to local storage, so that I don't lose progress if the browser crashes or closes unexpectedly.

#### Acceptance Criteria

4.1. THE System SHALL implement debounced auto-save with a 10-second interval after the last change

4.2. WHEN editor content or title changes, THE System SHALL start the auto-save debounce timer

4.3. WHEN the debounce timer expires, THE System SHALL save the current content and title to localStorage

4.4. THE System SHALL use the key format `lesson-draft-{lessonId}` for localStorage

4.5. THE System SHALL store `{ title, content, savedAt }` in the localStorage draft

4.6. WHEN a Creator opens an existing lesson editor, THE System SHALL check for a localStorage draft

4.7. IF a localStorage draft exists and its `savedAt` is newer than the lesson's `lastEdit`, THE System SHALL show a restore prompt to the Creator

4.8. WHEN a Creator chooses to restore, THE System SHALL load the draft content into the editor

4.9. WHEN a Creator chooses to discard, THE System SHALL delete the localStorage draft

4.10. WHEN a Creator saves manually (button or Cmd+Enter), THE System SHALL clear the localStorage draft

4.11. WHEN auto-save completes, THE System SHALL show a subtle "Draft tersimpan" indicator

4.12. THE System SHALL NOT trigger auto-save if content has not changed since last auto-save

---

### Requirement 5: Editor Performance - useEditorState

**User Story:** As a System, I want toolbar buttons to only re-render when their specific state changes, so that editor performance is optimized.

#### Acceptance Criteria

5.1. THE System SHALL refactor EditorToolbar to use `useEditorState` hook from `@tiptap/react`

5.2. EACH toolbar button group SHALL use a `useEditorState` selector that returns only the states it needs

5.3. THE Bold button SHALL use selector: `ctx.editor.isActive('bold')`

5.4. THE Italic button SHALL use selector: `ctx.editor.isActive('italic')`

5.5. THE Heading buttons SHALL use selector: `ctx.editor.isActive('heading', { level: N })`

5.6. WHEN editor content changes, THE System SHALL only re-render toolbar buttons whose active state has changed

5.7. THE System SHALL NOT use `useEditor` hook inside toolbar button components for state checking

---

### Requirement 6: Component Memoization

**User Story:** As a System, I want heavy components to be memoized, so that unnecessary re-renders are prevented especially during drag-and-drop operations.

#### Acceptance Criteria

6.1. THE System SHALL wrap `SortableSectionItem` with `React.memo`

6.2. THE System SHALL wrap `SortableLessonItem` with `React.memo`

6.3. THE System SHALL wrap `LessonEditorPanel` with `React.memo`

6.4. THE System SHALL wrap `LessonViewerPanel` with `React.memo`

6.5. THE System SHALL wrap `EditorToolbar` with `React.memo`

6.6. WHEN a parent component re-renders, memoized components SHALL NOT re-render if their props are unchanged

---

### Requirement 7: Keyboard Shortcut Hints

**User Story:** As a Creator, I want to see keyboard shortcuts in toolbar tooltips, so that I can discover and use shortcuts efficiently.

#### Acceptance Criteria

7.1. THE System SHALL display tooltips on all toolbar buttons showing the action name and keyboard shortcut

7.2. THE System SHALL create a utility function `getModKey()` that returns `"Cmd"` on Mac and `"Ctrl"` on Windows/Linux

7.3. THE System SHALL show shortcuts for: Bold (Mod+B), Italic (Mod+I), Code (Mod+E), Link (Mod+K)

7.4. THE System SHALL show shortcuts for: H1 (Mod+Shift+1), H2 (Mod+Shift+2), H3 (Mod+Shift+3)

7.5. THE System SHALL show the Save shortcut (Mod+Enter) in the save button tooltip

7.6. THE System SHALL use the existing shadcn/ui Tooltip component for all tooltips

7.7. WHEN a Creator hovers over a toolbar button, THE System SHALL show the tooltip after 300ms delay

---

### Requirement 8: Link Behavior Enhancement

**User Story:** As a Creator, I want clear feedback about link behavior in the editor, so that I understand how to interact with links while editing.

#### Acceptance Criteria

8.1. THE System SHALL keep `openOnClick: false` in the Link extension configuration

8.2. WHEN a Creator hovers over a link in the editor, THE System SHALL show a tooltip "Ctrl+Click untuk membuka"

8.3. WHEN a Creator Ctrl+Clicks (or Cmd+Clicks on Mac) a link, THE System SHALL open the link in a new tab

8.4. WHEN a Creator regular-clicks a link, THE System SHALL place the cursor for editing (default behavior)

8.5. THE System SHALL implement Ctrl+Click detection via `editorProps.handleDOMEvents` in the editor configuration

---

### Requirement 9: Extension Configuration Centralization

**User Story:** As a System, I want extension configurations centralized in one file, so that all editor instances are consistent and easy to maintain.

#### Acceptance Criteria

9.1. THE System SHALL create `lib/tiptap/extensions.ts` file

9.2. THE System SHALL export `commonExtensions` array containing extensions shared by all instances (StarterKit, TextAlign, Highlight, Typography, Superscript, Subscript)

9.3. THE System SHALL export `editorExtensions` array extending commonExtensions with Image extension

9.4. THE System SHALL export `viewerExtensions` array using commonExtensions (without Image upload capability)

9.5. THE System SHALL export `descriptionExtensions` array for the minimal course description editor

9.6. THE System SHALL update LessonEditorPanel to import from `lib/tiptap/extensions.ts`

9.7. THE System SHALL update LessonViewerPanel to import from `lib/tiptap/extensions.ts`

9.8. THE System SHALL remove inline extension definitions from all editor components

---

### Requirement 10: Extension Audit

**User Story:** As a System, I want unused extensions removed, so that bundle size is reduced and code is cleaner.

#### Acceptance Criteria

10.1. THE System SHALL audit whether `Selection` extension is explicitly used anywhere in the codebase

10.2. IF `Selection` extension has no explicit usage, THE System SHALL remove it from all extension arrays

10.3. THE System SHALL document the `Typography` extension's active features in a code comment

10.4. THE System SHALL keep `Typography` extension if smart quotes/dashes are desired for lesson content

10.5. THE System SHALL verify no functionality breaks after removing unused extensions

---

### Requirement 11: DRY Violations - Utility Functions

**User Story:** As a System, I want duplicate code patterns extracted to utility functions, so that changes are made in one place and code is consistent.

#### Acceptance Criteria

11.1. THE System SHALL create `lib/utils/course-helpers.ts` utility file

11.2. THE System SHALL export `getDifficultyColor(difficulty: string): string` function returning Tailwind classes

11.3. THE System SHALL refactor `CourseCard`, `CourseOverviewHero`, and `CourseListItem` to use `getDifficultyColor`

11.4. THE System SHALL export `getErrorMessage(error: unknown, fallback: string): string` function

11.5. THE function SHALL return `error.message` if error is an Error instance, otherwise return the fallback string

11.6. THE System SHALL refactor all API error handlers (15+ occurrences) to use `getErrorMessage`

---

### Requirement 12: Prop Drilling Reduction - SortableSectionItem

**User Story:** As a System, I want SortableSectionItem props reduced, so that the component is easier to maintain and re-renders are minimized.

#### Acceptance Criteria

12.1. THE System SHALL audit all 20+ props currently passed to `SortableSectionItem`

12.2. THE System SHALL group section-related action props into a `sectionActions` object prop

12.3. THE System SHALL group lesson-related action props into a `lessonActions` object prop

12.4. THE System SHALL reduce total prop count to 10 or fewer

12.5. THE System SHALL maintain identical functionality after refactoring

12.6. THE System SHALL update all tests that reference SortableSectionItem props

---

### Requirement 13: God Component Split - ManageContent

**User Story:** As a System, I want ManageContent.tsx split into separate files, so that each component has a single responsibility and is easier to maintain.

#### Acceptance Criteria

13.1. THE System SHALL extract `CourseOverview` into `features/cms/components/creator/manage/CourseOverview.tsx`

13.2. THE System SHALL extract `LessonEditorPanel` into `features/cms/components/creator/manage/LessonEditorPanel.tsx`

13.3. THE System SHALL extract `LessonViewerPanel` into `features/cms/components/creator/manage/LessonViewerPanel.tsx`

13.4. THE System SHALL extract `DescriptionEditor` into `features/cms/components/creator/manage/DescriptionEditor.tsx`

13.5. THE `ManageContent.tsx` SHALL become an orchestrator component under 100 lines

13.6. THE System SHALL maintain identical functionality after the split

13.7. THE System SHALL verify all existing tests pass after the refactoring

---

### Requirement 14: Content Preview Generation

**User Story:** As a System, I want accurate content previews generated from Tiptap JSON, so that lesson lists show meaningful preview text.

#### Acceptance Criteria

14.1. THE System SHALL create `lib/tiptap/preview.ts` utility file

14.2. THE System SHALL export `generatePreview(content: JSONContent, maxLength?: number): string` function

14.3. THE function SHALL recursively traverse the Tiptap JSON structure to extract text

14.4. THE function SHALL add a newline separator after `paragraph` and `heading` nodes

14.5. THE function SHALL prefix `listItem` content with `• ` for bullet points

14.6. THE function SHALL truncate the result to `maxLength` (default: 200) and append `...` if truncated

14.7. THE function SHALL return an empty string for empty or null content

14.8. THE System SHALL replace the current plain-text preview in the lesson list API with `generatePreview`

---

### Requirement 15: Editor Lifecycle Cleanup

**User Story:** As a System, I want editor instances properly destroyed on unmount, so that memory leaks are prevented.

#### Acceptance Criteria

15.1. THE System SHALL add a `useEffect` cleanup in `LessonEditorPanel` that calls `editor?.destroy()`

15.2. THE System SHALL add a `useEffect` cleanup in `LessonViewerPanel` that calls `editor?.destroy()`

15.3. THE System SHALL add a `useEffect` cleanup in `DescriptionEditor` that calls `editor?.destroy()`

15.4. THE cleanup function SHALL check that editor is not null before calling destroy

15.5. THE `useEffect` dependency array SHALL include the editor instance

---

## Non-Functional Requirements

### Performance
- Toolbar re-renders SHALL be reduced with `useEditorState` optimization
- DnD operations SHALL be smoother with `React.memo` on sortable components
- Auto-save SHALL NOT block user interaction (runs asynchronously)

### Usability
- All error messages SHALL be in Indonesian language
- Keyboard shortcuts SHALL be discoverable through tooltips
- Auto-save indicator SHALL be subtle and non-intrusive
- Unsaved changes warning SHALL prevent accidental data loss

### Maintainability
- Extension configuration SHALL be centralized in `lib/tiptap/extensions.ts`
- Duplicate code patterns SHALL be eliminated through utility functions
- Components SHALL have single responsibility (ManageContent split)
- Prop count on SortableSectionItem SHALL be reduced to ≤10

### Security
- Image uploads SHALL be validated for file type (JPG, PNG, GIF, WebP only)
- Image uploads SHALL be validated for file size (max 5MB)
- Image URLs SHALL be stored as Supabase public URLs (not base64)

---

## Dependencies

- `@tiptap/extension-image` - Image node support (needs to be added)
- `lib/supabase.ts` - Existing Supabase client (already configured)
- `NEXT_PUBLIC_SUPABASE_URL` - Already configured in .env
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Already configured in .env
- Supabase Storage bucket `lesson-images` - Needs to be created

---

## Priority Summary

| Requirement | Priority | Effort | Impact |
|-------------|----------|--------|--------|
| 1. Version Tracking Fix | P0 | Low | High |
| 2. Unsaved Changes Warning | P0 | Medium | High |
| 3. Image Upload | P0 | Medium | High |
| 4. Auto-save (10s debounce) | P0 | Medium | High |
| 5. useEditorState | P1 | Medium | Medium |
| 6. Component Memoization | P1 | Low | Medium |
| 7. Keyboard Shortcut Hints | P1 | Low | Medium |
| 8. Link Behavior | P1 | Low | Low |
| 9. Extension Centralization | P2 | Low | Medium |
| 10. Extension Audit | P2 | Low | Low |
| 11. DRY Utilities | P2 | Low | Medium |
| 12. Prop Drilling Reduction | P2 | Medium | Medium |
| 13. ManageContent Split | P2 | Medium | Medium |
| 14. Content Preview | P2 | Low | Low |
| 15. Editor Lifecycle | P2 | Low | Medium |

**Total: 15 Requirements, ~90 Acceptance Criteria**

---

**Document Version:** 2.0  
**Last Updated:** 2026-05-01  
**Status:** Draft - Awaiting Review
