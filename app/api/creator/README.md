# API Routes: /api/creator

Routes khusus creator — manage kursus milik sendiri, buat kursus baru, dan toggle publish status.

> **Semua route require auth.** Creator hanya bisa akses kursus miliknya sendiri (`creatorId = user.id`).

---

## Route Map

```
GET  /api/creator/courses                      → list kursus milik creator
POST /api/creator/courses                      → buat kursus baru (Quick Start)
PUT  /api/creator/courses/[slug]/publish       → toggle DRAFT ↔ PUBLISHED
```

---

## GET /api/creator/courses

List semua kursus yang dimiliki creator yang sedang login.

**Auth:** Required → 401 jika tidak login

**Response 200:**
```json
{
  "courses": [{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "status": "DRAFT | PUBLISHED",
    "createdAt": "ISO date",
    "updatedAt": "ISO date",
    "slug": "uuid",
    "sectionCount": 3
  }]
}
```

> Filter otomatis `creatorId = user.id` — creator tidak bisa lihat kursus orang lain.

**TODO (Task 13):** Tambah `difficulty`, `enrollmentCount`, dan stats `{ totalCourses, publishedCourses, draftCourses }` ke response.

---

## POST /api/creator/courses

Buat kursus baru dengan form Quick Start (minimal fields).

**Auth:** Required → 401 jika tidak login

**Body:**
```json
{
  "title": "string (required, max 100 chars)",
  "description": "string (required)",
  "category": "string (required)",
  "difficulty": "Pemula | Menengah | Mahir",
  "status": "DRAFT | PUBLISHED"
}
```

**Response 201:**
```json
{
  "course": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "category": "string",
    "difficulty": "string",
    "status": "DRAFT",
    "creatorId": "string",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
}
```

**Errors:**
| Status | Kondisi |
|--------|---------|
| 400 | Field kosong / title > 100 chars / difficulty atau status tidak valid |
| 401 | Tidak login |

**Validasi (di service):**
- `difficulty` → hanya: `Pemula`, `Menengah`, `Mahir`
- `status` → hanya: `DRAFT` atau `PUBLISHED`
- `title` → max 100 karakter
- Semua field wajib diisi

**Service:** `features/cms/services/creator-course.service.ts` → `createCourse(input, creatorId)`

---

## PUT /api/creator/courses/[slug]/publish

Toggle status kursus antara DRAFT dan PUBLISHED.

**Auth:** Required + harus owner kursus

**Params:** `slug` = course ID (UUID)

**Body:** Tidak perlu body — toggle otomatis dari status saat ini.

**Logika toggle:**
- `DRAFT` → `PUBLISHED` (kursus muncul di catalog student)
- `PUBLISHED` → `DRAFT` (kursus disembunyikan dari catalog)

**Response 200:**
```json
{
  "course": {
    "id": "uuid",
    "title": "string",
    "status": "PUBLISHED"
  }
}
```

**Errors:**
| Status | Kondisi |
|--------|---------|
| 401 | Tidak login |
| 403 | Bukan owner kursus |
| 404 | Kursus tidak ditemukan |

**Service:** `features/cms/services/creator-course.service.ts` → `togglePublishStatus(courseId, userId)`

---

## Arsitektur

```
app/api/creator/
└── courses/
    ├── route.ts                        ← GET list + POST create → creator-course.service.ts
    └── [slug]/
        └── publish/route.ts            ← PUT toggle → creator-course.service.ts

features/cms/services/
└── creator-course.service.ts
    ├── createCourse(input, creatorId)
    └── togglePublishStatus(courseId, userId)
```

Route hanya handle: auth check + parse request + return HTTP response.
Semua validasi dan DB logic ada di service layer.

---

## Perbedaan /api/courses vs /api/creator/courses

| | `/api/courses` | `/api/creator/courses` |
|---|---|---|
| Audience | Student (publik) | Creator (private) |
| Auth | Opsional (beberapa endpoint required) | Selalu required |
| Filter | Hanya PUBLISHED | Semua status milik creator |
| Tujuan | Browse & enroll | Manage & create |

---

## Known Issues & TODO

| Issue | Task | Priority |
|-------|------|----------|
| GET response belum include `difficulty` dan `enrollmentCount` | Task 13 | High |
| GET response belum include stats (total/published/draft count) | Task 13 | High |
| Tidak ada role check (Creator/Admin) — siapapun yang login bisa akses | - | Medium |
