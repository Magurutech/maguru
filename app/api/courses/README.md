# API Routes: /api/courses

Routes publik untuk student — browse catalog, enroll, dan lihat kursus yang diikuti.

> **Penting: `slug` = Course ID (UUID)** di semua route. Tidak ada field slug terpisah di schema.

---

## Route Map

```
GET  /api/courses                                                    → catalog kursus (publik)
GET  /api/courses/my-courses                                         → kursus yang diikuti student
GET  /api/courses/[slug]                                             → detail kursus (owner only)
POST /api/courses/[slug]/enroll                                      → enroll ke kursus
GET  /api/courses/[slug]/sections                                    → list sections
POST /api/courses/[slug]/sections                                    → buat section baru
PUT  /api/courses/[slug]/sections/[sectionId]                        → update section
DELETE /api/courses/[slug]/sections/[sectionId]                      → hapus section
GET  /api/courses/[slug]/sections/[sectionId]/lessons                → list lessons
POST /api/courses/[slug]/sections/[sectionId]/lessons                → buat lesson baru
GET  /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]     → detail lesson
PUT  /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]     → update lesson
DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]   → hapus lesson
```

---

## GET /api/courses

Catalog kursus publik. Auth opsional — jika login, response include field `enrolled`.

**Auth:** Opsional

**Query params:**
| Param | Default | Keterangan |
|-------|---------|------------|
| page | 1 | Halaman |
| limit | 12 | Max 50 |
| category | - | Filter kategori |
| difficulty | - | Filter difficulty |
| search | - | Cari di title/description (case-insensitive) |

**Response 200:**
```json
{
  "courses": [{
    "id": "uuid",
    "title": "string",
    "description": "string (max 150 chars)",
    "category": "string",
    "difficulty": "string | null",
    "status": "PUBLISHED",
    "sectionCount": 3,
    "lessonCount": 12,
    "createdAt": "ISO date",
    "enrolled": false
  }],
  "pagination": { "page": 1, "limit": 12, "total": 45, "totalPages": 4 }
}
```

**Service:** Logic langsung di route handler (`app/api/courses/route.ts`)

---

## GET /api/courses/my-courses

Daftar kursus yang sudah diikuti student, lengkap dengan progress %.

**Auth:** Required → 401 jika tidak login

**Response 200:**
```json
{
  "enrollments": [{
    "id": "uuid",
    "enrolledAt": "ISO date",
    "completed": false,
    "completedAt": null,
    "progress": 45,
    "course": {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "category": "string",
      "difficulty": "string | null",
      "status": "PUBLISHED",
      "thumbnail": "string | null"
    }
  }]
}
```

> Progress = `(completed lesson_progress / total lessons in course) * 100`

**Service:** `features/cms/services/enrollment.service.ts` → `getMyEnrollments(userId)`

---

## GET /api/courses/[slug]

Detail kursus by ID. Dipakai creator dashboard — hanya owner yang bisa akses.

**Auth:** Required + harus owner kursus

**Response 200:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "creatorId": "string",
  "status": "DRAFT | PUBLISHED",
  "createdAt": "ISO date",
  "updatedAt": "ISO date",
  "slug": "uuid"
}
```

**Errors:** 401 (tidak login) · 403 (bukan owner) · 404 (tidak ada)

---

## POST /api/courses/[slug]/enroll

Enroll student ke kursus (direct, tanpa approval).

**Auth:** Required

**Body:** Tidak perlu body.

**Response 201:**
```json
{ "enrollment": { "id": "uuid", "userId": "string", "courseId": "uuid", "enrolledAt": "ISO date" } }
```

**Errors:**
| Status | Kondisi |
|--------|---------|
| 401 | Tidak login |
| 403 | Kursus masih DRAFT |
| 404 | Kursus tidak ada |
| 409 | Sudah terdaftar — "Anda sudah terdaftar di kursus ini" |

---

## GET /api/courses/[slug]/sections

List semua sections dalam kursus, diurutkan by `order`.

**Auth:** Opsional untuk PUBLISHED. DRAFT butuh auth + ownership.

**Response 200:**
```json
{
  "sections": [{ "id": "uuid", "title": "string", "description": "string | null", "order": 1 }]
}
```

> ⚠️ **Known Issue:** Route ini lookup course by `title` bukan `id`. Perlu difix ke lookup by `id`.

**Service:** `features/cms/services/section.service.ts`

---

## POST /api/courses/[slug]/sections

Buat section baru dalam kursus.

**Auth:** Required + owner kursus

**Body:**
```json
{ "title": "string (required, max 200 chars)", "description": "string (optional)", "order": 1 }
```

**Response 201:** Section object.

**Errors:** 400 (validasi) · 401 · 403 · 404 · 409 (order duplikat dalam kursus)

> ⚠️ **Known Issue:** Sama seperti GET — lookup by `title` bukan `id`.

---

## PUT /api/courses/[slug]/sections/[sectionId]

Update section (title, description, order). Semua field opsional.

**Auth:** Required + owner kursus

**Body:** `{ "title"?: "string", "description"?: "string", "order"?: 1 }`

**Response 200:** Updated section object.

---

## DELETE /api/courses/[slug]/sections/[sectionId]

Hapus section beserta semua lessons di dalamnya (cascade).

**Auth:** Required + owner kursus

**Response 200:**
```json
{ "message": "Section deleted successfully", "deletedLessons": 3 }
```

---

## GET /api/courses/[slug]/sections/[sectionId]/lessons

List semua lessons dalam section, diurutkan by `order`. Include `contentPreview` (max 200 chars).

**Response 200:**
```json
{
  "lessons": [{ "id": "uuid", "title": "string", "order": 1, "contentPreview": "string" }]
}
```

**Service:** `features/cms/services/lesson.service.ts`

---

## POST /api/courses/[slug]/sections/[sectionId]/lessons

Buat lesson baru dalam section.

**Auth:** Required + owner kursus

**Body:**
```json
{
  "title": "string (required, max 200 chars)",
  "order": 1,
  "content": {
    "content": { "type": "doc", "content": [] },
    "version": 1,
    "lastEdit": "ISO date"
  }
}
```

**Response 201:** Lesson object.

**Errors:** 400 (validasi Tiptap JSON) · 401 · 403 · 404 · 409 (order duplikat dalam section)

---

## Arsitektur

```
app/api/courses/
├── route.ts                          ← GET catalog (logic inline)
├── my-courses/route.ts               ← GET my courses → enrollment.service.ts
├── [slug]/
│   ├── route.ts                      ← GET course detail (logic inline)
│   ├── enroll/route.ts               ← POST enroll (logic inline)
│   └── sections/
│       ├── route.ts                  ← GET + POST sections → section.service.ts
│       └── [sectionId]/
│           ├── route.ts              ← PUT + DELETE section → section.service.ts
│           └── lessons/
│               ├── route.ts          ← GET + POST lessons → lesson.service.ts
│               └── [lessonId]/
│                   └── route.ts      ← GET + PUT + DELETE lesson → lesson.service.ts
```

---

## Known Issues & TODO

| Issue | File | Priority |
|-------|------|----------|
| Section routes lookup by `title` bukan `id` | `[slug]/sections/route.ts` | High |
| GET `/api/courses/[slug]` seharusnya publik untuk PUBLISHED course | `[slug]/route.ts` | Medium |
| Tidak ada GET `/api/courses/[slug]` untuk student (detail publik) | - | Medium (Task 8) |
