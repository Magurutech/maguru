# Lessons API Testing Guide

**Feature:** Course Content Management  
**Sprint:** Sprint 2 — Content First  
**Requirements:** 2.1, 2.4, 2.5, 3.1, 3.2, 8.1, 9.2, 9.3

---

## Overview

Panduan testing untuk Lesson API — endpoint yang digunakan creator untuk mengelola lessons dalam sebuah section, termasuk konten Tiptap JSON.

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/courses/[slug]/sections/[sectionId]/lessons` | Required (owner) | Buat lesson baru dengan Tiptap content |
| GET | `/api/courses/[slug]/sections/[sectionId]/lessons` | **Public** | List semua lessons dalam section |
| GET | `/api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]` | **Public** | Detail lesson dengan full content |
| PUT | `/api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]` | Required (owner) | Update lesson, version auto-increment |
| DELETE | `/api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]` | Required (owner) | Hapus lesson + cascade progress records |

> **Catatan GET:** Kedua GET endpoint (list dan detail) adalah **public** — tidak perlu auth sama sekali. Ini yang dipakai student learn page untuk load konten lesson.

---

## Prerequisites

### 1. Start Development Server

```bash
yarn dev
# Server berjalan di http://localhost:3000
```

### 2. Siapkan Test Data

```sql
-- Cek sections yang tersedia
SELECT s.id, s.title, s.order, c.slug as course_slug
FROM sections s
JOIN courses c ON s."courseId" = c.id
WHERE c."creatorId" = 'YOUR_CLERK_USER_ID';
```

Pastikan sudah ada minimal 1 section. Jika belum, jalankan dulu **Sections API** untuk membuat section.

### 3. Dapatkan Auth Token (Clerk)

**Creator Token (owner):**
1. Buka `http://localhost:3000`
2. Login sebagai user dengan role **Creator** yang memiliki course
3. Buka DevTools → Application → Cookies → copy nilai `__session`

**Other User Token (untuk test 403):**
1. Login sebagai user **berbeda** (bukan owner course)
2. Copy token-nya sebagai `otherUserToken`

---

## Import Postman Collection

1. Buka Postman
2. Click **Import**
3. Pilih file `docs/api/content-management/lessons.postman_collection.json`
4. Click **Import**

---

## Configure Collection Variables

| Variable | Nilai | Keterangan |
|----------|-------|------------|
| `baseUrl` | `http://localhost:3000` | URL server lokal |
| `courseSlug` | _(isi manual)_ | Slug kursus milik creator — human-readable (e.g. `belajar-typescript-dari-nol`), bukan UUID |
| `sectionId` | _(isi manual)_ | ID section yang sudah ada |
| `lessonId` | _(auto-filled setelah POST)_ | ID lesson yang dibuat |
| `lessonVersion` | `1` | Version awal — auto-update setelah PUT |
| `authToken` | _(isi dari Clerk)_ | Token creator (course owner) |
| `otherUserToken` | _(isi dari Clerk)_ | Token user lain (untuk test 403) |

> **Tip:** `lessonId` dan `lessonVersion` akan otomatis ter-set setelah menjalankan request "Create Lesson - Success".

---

## Valid Tiptap JSON Body

Gunakan body ini untuk semua request yang membutuhkan lesson content:

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

> **Catatan struktur:** `content` adalah wrapper object dengan `version`, `lastEdit`, dan `content` (Tiptap doc). Bukan flat object.

> **Catatan version:** Client selalu mengirim `version: 1`. Untuk CREATE, server akan set version = 1. Untuk UPDATE, server akan membaca version saat ini dari database dan increment otomatis (version + 1). Client tidak perlu track version number.

---

## Test Scenarios & Checklist

---

### Scenario 1: Create Lesson

> Jalankan **berurutan** — error cases dulu, baru success.

#### 1.1 Create Lesson — Unauthenticated

```
POST /api/courses/{{courseSlug}}/sections/{{sectionId}}/lessons
(tanpa Authorization header)
Body: { "title": "Lesson Tanpa Auth", "order": 2, "content": { "type": "doc", "version": 1, "content": [] } }
```

**Checklist:**
- [x] Status code `401`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Unauthorized",
    "code": "UNAUTHORIZED"
}
```

---

#### 1.2 Create Lesson — Not Owner

```
POST /api/courses/{{courseSlug}}/sections/{{sectionId}}/lessons
Cookie: __session={{otherUserToken}}
Body: (valid Tiptap JSON)
```

**Checklist:**
- [x] Status code `403`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Forbidden: You do not have permission to modify this course",
    "code": "FORBIDDEN"
}
```

---

#### 1.3 Create Lesson — Invalid Content Type

```
POST /api/courses/{{courseSlug}}/sections/{{sectionId}}/lessons
Cookie: __session={{authToken}}
Body:
{
  "title": "Lesson Invalid Content",
  "order": 2,
  "content": {
    "type": "invalid-type",
    "version": 1,
    "content": []
  }
}
```

**Checklist:**
- [x] Status code `400`
- [x] Response punya field `error`
- [x] Error menyebut `content.type` harus `"doc"`

**Actual Response:**
```json
{
    "error": "Invalid lesson content: [\n  {\n    \"expected\": \"object\",\n    \"code\": \"invalid_type\",\n    \"path\": [\n      \"content\"\n    ],\n    \"message\": \"Invalid input: expected object, received array\"\n  },\n  {\n    \"expected\": \"string\",\n    \"code\": \"invalid_type\",\n    \"path\": [\n      \"lastEdit\"\n    ],\n    \"message\": \"Invalid input: expected string, received undefined\"\n  }\n]",
    "code": "VALIDATION_ERROR"
}
```

---

#### 1.4 Create Lesson — Missing Version

```
POST /api/courses/{{courseSlug}}/sections/{{sectionId}}/lessons
Cookie: __session={{authToken}}
Body:
{
  "title": "Lesson Tanpa Version",
  "order": 2,
  "content": {
    "lastEdit": "2026-03-19T00:00:00.000Z",
    "content": {
      "type": "doc",
      "content": []
    }
  }
}
(content.version tidak ada — hanya lastEdit dan content.content)
```

**Checklist:**
- [x] Status code `400`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Invalid lesson content: [\n  {\n    \"expected\": \"number\",\n    \"code\": \"invalid_type\",\n    \"path\": [\n      \"version\"\n    ],\n    \"message\": \"Invalid input: expected number, received undefined\"\n  }\n]",
    "code": "VALIDATION_ERROR"
}
```

---

#### 1.5 Create Lesson — Success

```
POST /api/courses/{{courseSlug}}/sections/{{sectionId}}/lessons
Cookie: __session={{authToken}}
Body: (valid Tiptap JSON — lihat bagian "Valid Tiptap JSON Body" di atas)
```

**Checklist:**
- [x] Status code `201`
- [x] Response punya field `id`, `title`, `content`
- [x] `content.type === "doc"`
- [x] `content.version` adalah number
- [x] `lessonId` ter-set otomatis di collection variables
- [x] `lessonVersion` ter-set otomatis di collection variables

**Actual Response:**
```json
{
    "id": "021a377c-86ea-4a67-a12c-c46d1e933aa1",
    "sectionId": "4b2637a9-1133-4612-a0a6-5863d37a840d",
    "order": 1,
    "title": "Intro to TypeScript",
    "content": {
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "text": "Hello world",
                            "type": "text"
                        }
                    ]
                }
            ]
        },
        "version": 1,
        "lastEdit": "2026-03-19T00:00:00.000Z"
    },
    "createdAt": "2026-03-22T09:50:09.294Z",
    "updatedAt": "2026-03-22T09:50:09.294Z"
}
```

---

### Scenario 2: Get Lessons

> GET endpoints adalah **public** — tidak perlu auth. Student bisa akses tanpa login.

#### 2.1 Get Lessons List — No Auth (Public)

```
GET /api/courses/{{courseSlug}}/sections/{{sectionId}}/lessons
(tanpa Authorization header)
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `lessons` (array)
- [x] Setiap lesson punya: `id`, `title`, `order`

**Actual Response:**
```json
{
    "lessons": [
        {
            "id": "021a377c-86ea-4a67-a12c-c46d1e933aa1",
            "sectionId": "4b2637a9-1133-4612-a0a6-5863d37a840d",
            "order": 1,
            "title": "Intro to TypeScript - Updated",
            "createdAt": "2026-03-22T09:50:09.294Z",
            "updatedAt": "2026-03-22T10:57:01.685Z"
        },
        {
            "id": "3140db1c-9a9f-452f-9362-3ea5f8463ca1",
            "sectionId": "4b2637a9-1133-4612-a0a6-5863d37a840d",
            "order": 2,
            "title": "Intro to TypeScript",
            "createdAt": "2026-03-22T10:53:08.220Z",
            "updatedAt": "2026-03-22T10:53:08.220Z"
        }
    ]
}
```

---

#### 2.2 Get Lesson Detail — No Auth (Public)

```
GET /api/courses/{{courseSlug}}/sections/{{sectionId}}/lessons/{{lessonId}}
(tanpa Authorization header)
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `id`, `title`, `content`, `section`
- [x] `content.type === "doc"`
- [x] `section` berisi info section (id, title)

**Actual Response:**
```json
{
    "id": "021a377c-86ea-4a67-a12c-c46d1e933aa1",
    "sectionId": "4b2637a9-1133-4612-a0a6-5863d37a840d",
    "order": 1,
    "title": "Intro to TypeScript - Updated",
    "content": {
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "text": "Konten yang diupdate",
                            "type": "text"
                        }
                    ]
                }
            ]
        },
        "version": 2,
        "lastEdit": "2026-03-22T10:57:01.684Z"
    },
    "createdAt": "2026-03-22T09:50:09.294Z",
    "updatedAt": "2026-03-22T10:57:01.685Z",
    "section": {
        "id": "4b2637a9-1133-4612-a0a6-5863d37a840d",
        "title": "Pengenalan TypeScript",
        "courseId": "a953070e-d025-4a94-a25f-e244bbae9877"
    }
}
```

---

#### 2.3 Get Lesson Detail — Not Found

```
GET /api/courses/{{courseSlug}}/sections/{{sectionId}}/lessons/nonexistent-lesson-id
(tanpa Authorization header)
```

**Checklist:**
- [x] Status code `404`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Lesson not found",
    "code": "NOT_FOUND"
}
```

---

### Scenario 3: Update Lesson

#### 3.1 Update Lesson — Success (Version Increment)

```
PUT /api/courses/{{courseSlug}}/sections/{{sectionId}}/lessons/{{lessonId}}
Cookie: __session={{authToken}}
Body:
{
  "title": "Intro to TypeScript - Updated",
  "content": {
    "version": 1,
    "lastEdit": "2026-03-19T01:00:00.000Z",
    "content": {
      "type": "doc",
      "content": [
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Konten yang diupdate" }]
        }
      ]
    }
  }
}
```

**Checklist:**
- [x] Status code `200`
- [x] `content.version` lebih besar dari version sebelumnya (`lessonVersion + 1`)
- [x] `lessonVersion` ter-update di collection variables

**Actual Response:**
```json
{
    "id": "021a377c-86ea-4a67-a12c-c46d1e933aa1",
    "sectionId": "4b2637a9-1133-4612-a0a6-5863d37a840d",
    "order": 1,
    "title": "Intro to TypeScript - Updated",
    "content": {
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "text": "Konten yang diupdate",
                            "type": "text"
                        }
                    ]
                }
            ]
        },
        "version": 2,
        "lastEdit": "2026-03-22T10:57:01.684Z"
    },
    "createdAt": "2026-03-22T09:50:09.294Z",
    "updatedAt": "2026-03-22T10:57:01.685Z"
}
```

---

### Scenario 4: Delete Lesson

#### 4.1 Delete Lesson — Success

```
DELETE /api/courses/{{courseSlug}}/sections/{{sectionId}}/lessons/{{lessonId}}
Cookie: __session={{authToken}}
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `deletedProgressRecords`
- [x] `deletedProgressRecords` adalah number (jumlah progress records yang ikut terhapus)

**Actual Response:**
```json
{
    "message": "Lesson deleted successfully",
    "deletedProgressRecords": 0
}
```

---

## Running All Tests (Newman CLI)

```bash
# Install Newman
npm install -g newman

# Run semua tests
newman run docs/api/content-management/lessons.postman_collection.json \
  --env-var "baseUrl=http://localhost:3000" \
  --env-var "courseSlug=YOUR_COURSE_SLUG" \
  --env-var "sectionId=YOUR_SECTION_ID" \
  --env-var "authToken=YOUR_CREATOR_TOKEN" \
  --env-var "otherUserToken=YOUR_OTHER_TOKEN"
```

---

## Validation Rules

| Field | Aturan |
|-------|--------|
| `title` | Required, maksimal 200 karakter |
| `order` | Required, integer positif |
| `content.type` | Harus `"doc"` |
| `content.version` | Required, integer >= 1 |
| `content.lastEdit` | Required, format ISO 8601 |
| `content.content` | Required, array of Tiptap nodes |

---

## Troubleshooting

| Error | Penyebab | Solusi |
|-------|----------|--------|
| 401 | Token tidak valid / expired | Re-login dan copy token baru |
| 403 | Bukan owner course | Pastikan `authToken` adalah owner dari `courseSlug` |
| 400 | Invalid Tiptap JSON | Cek `content.type === "doc"` dan `content.version >= 1` |
| 404 | Lesson / Section tidak ada | Update variable `lessonId` atau `sectionId` |
| Connection refused | Server tidak running | Jalankan `yarn dev` |

---

## References

- **Postman Collection:** `docs/api/content-management/lessons.postman_collection.json`
- **Sections README:** `docs/api/content-management/sections/README.md`
- **Requirements:** `.kiro/specs/course-content-management-v2/requirements.md`
- **Design:** `.kiro/specs/course-content-management-v2/design.md`
- **Tasks:** `.kiro/specs/course-content-management-v2/tasks.md`

---

**Last Updated:** 2026-03-20  
**Status:** Ready for Testing
