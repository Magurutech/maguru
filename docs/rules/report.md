# Code Cleanup Report — CMS Feature

**Tanggal:** 2026-03-30
**Scope:** `features/cms/` + API routes terkait
**Referensi:** `docs/rules/brainstorm.md`

---

## 1. Debug Logs — Harus Dihapus

Debug logs yang ditambahkan saat debugging session, tidak boleh ada di production code.

| File                                                                      | Log                                                            | Action                                                    |       |                     |
| ---------------------------------------------------------------------------| ----------------------------------------------------------------| -----------------------------------------------------------| -------| ---------------------|
| `feat--                                                                   | -ms/services/lesson.service.ts`                                | 4x `console.debug` di `getLessonsBySectionWithValidation` | Hapus |                     |
| `fea------cms/hooks/manage/useLessonHandlers.ts`                          | 3x `console.debug` di `fetchLessons` + `submitLessonFromPanel` | Hapus                                                     |       |                     |
| `-        cms/components/creator/manage/ManageSidebar.tsx`                | `console.debug` di lesson click handler                        | Hapus                                                     |       |                     |
| `feat    /cms/components/creator/manage/ManageContent.tsx`                | 2x `console.debug` di `LessonViewerPanel`                      | Hapus                                                     |       |                     |
| `app         ses/[slug]/sections/[sectionId]/lessons/route.ts`            | `console.debug` di POST handler                                | Hapus                                                     |       |                     |
| `       /courses/[slug]/sections/[sectionId]/lessons/[lessonId]/route.ts` | `console.debug` di PUT handler                                 | Hapus                                                     |       |                     |
|                                                                           |                                                                |                                                           |       | Yang boleh tetap:** |
- `e.error` di `course.service.ts` — legitimate error logging
- `console.error` di `LessonViewer.tsx` — error boundary
- `console.error` di `LessonForm.tsx` — error boundary
- `console.error` di `ManageContent.tsx` (LessonViewerPanel catch) — error boundary

---

## 2. Dead Code — Harus Dihapus

| File | Issue |
| ------| -------||-------|
| `features/cms/components/creator/LessonEditor.tsx` | File lama dari spec, tidak dipakai di production. `ManageContent.tsx` sudah replace fungsinya |
| `features/cms/components/creator/LessonPreview.tsx` | Tidak dipakai, sudah inline di `ManageContent.tsx` |
| `features/cms/components/creator/LessonForm.tsx` | Tidak dipakai di manage flow baru (Confluence-style panel) |
| `features/cms/components/creator/LessonList.tsx` | Tidak dipakai di manage flow baru |
| `features/cms/components/creator/SectionForm.tsx` | Tidak dipakai di manage flow baru |
| `features/cms/components/creator/SectionList.tsx` | Tidak dipakai di manage flow baru |
| `features/cms/services/lesson.service.ts` | Method `extractPreview()` adalah wrapper duplikat dari `extractContentPreview()` — hapus salah satu |
| `features/cms/services/authorization.service.ts` | Cek apakah masih dipakai atau sudah digantikan `authorization.helper.ts` |

---

## 3. Architecture Issues

### 3.1 Context folder naming tidak konsisten
- `features/cms/Context/` — huruf kapital, tidak sesuai konvensi `kebab-case` dari `CLAUDE.md`
- Seharusnya `features/cms/context/`

### 3.2 Validation folder di luar konvensi
- `features/cms/validation/` — seharusnya masuk ke `features/cms/lib/` sesuai arsitektur
- Atau tetap di `validation/` jika tim sepakat sebagai konvensi baru

### 3.3 ManageContext terlalu besar
- `ManageContext.tsx` mengelola 10+ state dan handler dalam satu file
- Sesuai `brainstorm.md` poin 2 (Prop drilling → Context) dan poin 4 (Separation of concern)
- Sudah baik menggunakan hooks (`useCourseManage`, `useLessonHandlers`, dll) — ini sudah DRY
- Tidak perlu refactor lebih jauh untuk MVP

### 3.4 `extractPreview` duplikat
```ts
// lesson.service.ts — dua method dengan fungsi sama
extractPreview(content: LessonContent): string {
  return this.extractContentPreview(content)  // wrapper tidak perlu
}
extractContentPreview(content: LessonContent): string { ... }
```
Hapus `extractPreview`, pakai `extractContentPreview` langsung di API routes.

---

## 4. Code Quality — Minor

| File  | Issue | Severity |     |     |           |                                                                               |        |                                        |                                         |     |                         |                                       |     |
| -------| -------| ----------| -----| -----| -----------| -------------------------------------------------------------------------------| --------| ----------------------------------------| -----------------------------------------| -----| -------------------------| ---------------------------------------| -----|
| `us   |       |          |     |     | dlers.ts` | `handleLessonSubmit` tidak dipakai (sudah digantikan `submitLessonFromPanel`) | Medium |                                        |                                         |     |                         |                                       |     |
| `f    |       |          |     |     |           |                                                                               |        | tures/cms/components/creator/index.ts` | Mungkin export komponen yang sudah dead | Low |                         |                                       |     |
| `feat |       |          |     |     |           |                                                                               |        |                                        |                                         |     | /cms/services/index.ts` | Cek apakah semua export masih relevan | Low |

---
Sudah Baik (Tidak Perlu Diubah)

- Struktur hooks `features/cms/hooks/manage/` — modular, separation of concern baik
- `ManageContext.tsx` — sudah delegate ke hooks, tidak over-engineer
- Service layer (`lesson.service.ts`, `section.service.ts`) — clean, single responsibility
- Type definitions di `features/cms/types/` — terstruktur per domain
- Zod validation di `features/cms/validation/tiptap.ts` — solid

---

## 6. Priority Action Items

**P1 — Lakukan sekarang:**
1. Hapus semua `console.debug` (6 file)
2. Hapus method `extractPreview()` duplikat di `lesson.service.ts`

**P2 — Lakukan setelah P1:**
3. Hapus dead components: `LessonEditor.tsx`, `LessonPreview.tsx`, `LessonForm.tsx`, `LessonList.tsx`, `SectionForm.tsx`, `SectionList.tsx`
4. Cek dan hapus `handleLessonSubmit` di `useLessonHandlers.ts` jika tidak dipakai

**P3 — Nice to have:**
5. Rename `Context/` → `context/` untuk konsistensi naming
6. Cek `authorization.service.ts` vs `authorization.helper.ts` — mungkin duplikat
