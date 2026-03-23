# Bug Report: Lesson API — 400 Bad Request on Create Lesson

**Date:** 2026-03-22  
**Endpoint:** `POST /api/courses/[slug]/sections/[sectionId]/lessons`  
**Status:** Bug Confirmed

---

## Error

```json
{
  "error": "Invalid lesson content: [\n  {\n    \"expected\": \"object\",\n    \"code\": \"invalid_type\",\n    \"path\": [\"content\"],\n    \"message\": \"Invalid input: expected object, received array\"\n  }\n]",
  "code": "VALIDATION_ERROR"
}
```

---

## Root Cause

Ada **ketidaksesuaian struktur** antara body JSON yang dikirim Postman dan schema validasi Zod di `features/cms/validation/tiptap.ts`.

### Body yang dikirim (Postman)

```json
{
  "title": "Intro to TypeScript",
  "order": 1,
  "content": {
    "type": "doc",
    "version": 1,
    "lastEdit": "2026-03-19T00:00:00.000Z",
    "content": [...]
  }
}
```

Struktur ini menempatkan `type`, `version`, `lastEdit`, dan `content` (array) **semuanya di level yang sama** dalam satu objek.

### Schema yang diharapkan (`LessonContentSchema`)

```typescript
const LessonContentSchema = z.object({
  content: TiptapDocumentSchema,  // <-- expects nested object { type: "doc", content: [...] }
  version: z.number().int().positive(),
  lastEdit: z.string().datetime(),
})
```

Schema ini mengharapkan struktur **dua lapis**:

```json
{
  "version": 1,
  "lastEdit": "2026-03-19T00:00:00.000Z",
  "content": {
    "type": "doc",
    "content": [...]
  }
}
```

### Perbedaan

| Field             | Body Postman      | Schema Zod                                            |                                   |
| -------------------| -------------------| -------------------------------------------------------| -----------------------------------|
| `co--------- `    | `"doc"` (di root) | Harus ada di dalam `content.content`                  |                                   |
| `cont             |                   | `1` (di root)                                         | Harus ada di root `LessonContent` |
| -----ent.content` | Array of nodes    | Harus berupa object `{ type: "doc", content: [...] }` |                                   |
| -------           |                   |                                                       |                                   |
```ma `content` sebagai field yang harus berupa **object** (`TiptapDocumentSchema`), tapi yang dikirim adalah **array** karena `content` di body Postman langsung berisi array nodes Tiptap.

---

## Solusi

Ada dua opsi:

### Opsi A — Fix body Postman (recommended, tidak ubah kode)

Ubah body request menjadi struktur dua lapis sesuai schema:

```json
{
  "title": "Intro to TypeScript",
  "order": 1,
  "content": {
    "version": 1,
    "lastEdit": "2026-03-19T00:00:00.000Z",
    "content": {
      "type": "doc",
      "content": [
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Hello world" }]
        }
      ]
    }
  }
}
```

### Opsi B — Refactor schema Zod (ubah kode)

Flatten `LessonContentSchema` agar menerima format body Postman saat ini:

```typescript
const LessonContentSchema = z.object({
  type: z.literal('doc'),
  version: z.number().int().positive(),
  lastEdit: z.string().datetime(),
  content: z.array(TiptapNodeSchema),
})
```

---

## Rekomendasi

Gunakan **Opsi A** — fix body Postman. Schema dua lapis lebih sesuai dengan cara Tiptap menyimpan dokumen secara internal (Tiptap memisahkan metadata editor dari dokumen ProseMirror). Ini juga konsisten dengan cara Tiptap mengekspos `editor.getJSON()` yang mengembalikan `{ type: "doc", content: [...] }` sebagai dokumen terpisah dari metadata seperti `version` dan `lastEdit`.

Update file `docs/api/content-management/lessons.postman.json` dan `lesson-api.md` dengan format body yang benar.

---

## Files Terdampak

- `docs/api/content-management/lessons.postman.json` — body request perlu diupdate
- `docs/api/content-management/lesson-api.md` — contoh body perlu diupdate
- `features/cms/validation/tiptap.ts` — schema sudah benar, tidak perlu diubah
- `features/cms/services/lesson.service.ts` — tidak perlu diubah
