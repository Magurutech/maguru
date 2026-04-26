# Sections API Testing Guide

**Feature:** Course Content Management  
**Sprint:** Sprint 2 — Content First  
**Requirements:** 1.1, 1.2, 1.3, 1.4, 8.1, 8.2, 9.1

---

## Overview

Panduan testing untuk Section API — endpoint yang digunakan creator untuk mengelola sections dalam sebuah kursus.

### API Endpoints

| Method | Endpoint                                   | Auth                               | Description                     |
| --------| --------------------------------------------| ------------------------------------| ---------------------------------|
| POST   | `/api/courses/[slug]/sections`             | Required (owner)                   | Buat section baru               |
| GET    | `/api/courses/[slug]/sections`             | Public (PUBLISHED) / Owner (DRAFT) | List semua sections (ordered)   |
| PUT    | `/api/courses/[slug]/sections/[sectionId]` | Required (owner)                   | Update section                  |
| DELETE | `/api/courses/[slug]/sections/[sectionId]` | Required (owner)                   | Hapus section + cascade lessons |

> **Catatan GET:** Course PUBLISHED → public access tanpa auth. Course DRAFT → harus auth + owner. Ini yang dipakai student learn page untuk load sidebar navigation.

---

## Prerequisites

### 1. Start Development Server

```bash
yarn dev
# Server berjalan di http://localhost:3000
```

### 2. Siapkan Test Data

```sql
-- Cek courses yang tersedia (butuh PUBLISHED dan DRAFT)
SELECT id, title, slug, status FROM courses WHERE "creatorId" = 'YOUR_CLERK_USER_ID';
```

Pastikan ada:
- Minimal 1 course **PUBLISHED** milik creator (untuk test public access)
- Minimal 1 course **DRAFT** milik creator (untuk test auth on draft)

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
3. Pilih file `docs/api/content-management/sections.postman_collection.json`
4. Click **Import**

---

## Configure Collection Variables

| Variable          | Nilai                        | Keterangan                                                                                            |
| -------------------| ------------------------------| -------------------------------------------------------------------------------------------------------|
| `baseUrl`         | `http://localhost:3000`      | URL server lokal                                                                                      |
| `courseSlug`      | _(isi manual)_               | Slug course PUBLISHED milik creator — human-readable (e.g. `belajar-typescript-dari-nol`), bukan UUID |
| `draftCourseSlug` | _(isi manual)_               | Slug course DRAFT milik creator — human-readable (e.g. `belajar-typescript-dari-nol`), bukan UUID     |
| `sectionId`       | _(auto-filled setelah POST)_ | ID section yang dibuat                                                                                |
| `authToken`       | _(isi dari Clerk)_           | Token creator (course owner)                                                                          |
| `otherUserToken`  | _(isi dari Clerk)_           | Token user lain (untuk test 403)                                                                      |

> **Tip:** `sectionId` akan otomatis ter-set setelah menjalankan request "Create Section - Success".

---

## Test Scenarios & Checklist

---

### Scenario 1: Create Section

> Jalankan **berurutan** — error cases dulu, baru success.

#### 1.1 Create Section — Unauthenticated

```
POST /api/courses/{{courseSlug}}/sections
(tanpa Authorization header)
Body: { "title": "Section Tanpa Auth", "order": 2 }
```

**Checklist:**
- [x] Status code `401`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Unauthorized: Authentication required",
    "code": "UNAUTHORIZED"
}
```

---

#### 1.2 Create Section — Not Owner

```
POST /api/courses/{{courseSlug}}/sections
Cookie: __session={{otherUserToken}}
Body: { "title": "Section dari Non-Owner", "order": 3 }
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

#### 1.3 Create Section — Success

```
POST /api/courses/{{courseSlug}}/sections
Cookie: __session={{authToken}}
Body:
{
  "title": "Pengenalan TypeScript",
  "description": "Dasar-dasar TypeScript untuk pemula",
  "order": 1
}
```

**Checklist:**
- [x] Status code `201`
- [x] Response punya field `id`, `title`, `order`
- [x] `sectionId` ter-set otomatis di collection variables

**Actual Response:**
```json
{
    "id": "f9478d2e-637d-4cbe-8f4c-02cf2953f1b8",
    "courseId": "a953070e-d025-4a94-a25f-e244bbae9877",
    "order": 1,
    "title": "Pengenalan TypeScript",
    "description": "Dasar-dasar TypeScript untuk pemula",
    "createdAt": "2026-03-22T02:16:09.048Z",
    "updatedAt": "2026-03-22T02:16:09.048Z"
}
```

---

#### 1.4 Create Section — Duplicate Order

```
POST /api/courses/{{courseSlug}}/sections
Cookie: __session={{authToken}}
Body: { "title": "Section Duplikat Order", "order": 1 }
(order sama dengan section yang baru dibuat di 1.3)
```

**Checklist:**
- [x] Status code `409`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Section with order 1 already exists in this course",
    "code": "VALIDATION_ERROR"
}
```

---

### Scenario 2: Get Sections

> GET behavior berbeda tergantung status course.

#### 2.1 Get Sections — Published Course, No Auth (Public Access)

```
GET /api/courses/{{courseSlug}}/sections
(tanpa Authorization header — courseSlug = PUBLISHED course)
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `sections` (array)
- [x] Sections diurutkan berdasarkan field `order` (ascending)
- [x] Setiap section punya: `id`, `title`, `order`

**Actual Response:**
```json
{
    "sections": [
        {
            "id": "f9478d2e-637d-4cbe-8f4c-02cf2953f1b8",
            "courseId": "a953070e-d025-4a94-a25f-e244bbae9877",
            "order": 1,
            "title": "Pengenalan TypeScript",
            "description": "Dasar-dasar TypeScript untuk pemula",
            "createdAt": "2026-03-22T02:16:09.048Z",
            "updatedAt": "2026-03-22T02:16:09.048Z",
            "lessonCount": 0
        }
    ]
}
```

---

#### 2.2 Get Sections — Draft Course, No Auth

```
GET /api/courses/{{draftCourseSlug}}/sections
(tanpa Authorization header — draftCourseSlug = DRAFT course)
```

**Checklist:**
- [x] Status code `401`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Unauthorized: Authentication required",
    "code": "UNAUTHORIZED"
}
```

---

#### 2.3 Get Sections — Draft Course, With Owner Auth

```
GET /api/courses/{{draftCourseSlug}}/sections
Cookie: __session={{authToken}}
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `sections` (array)

**Actual Response:**
```json
{
    "sections": [
        {
            "id": "e2fddafb-955f-4d84-8998-41b95aaf2061",
            "courseId": "dbe1029b-7b5b-46fb-8f34-5825ded68cbe",
            "order": 1,
            "title": "Pengenalan TypeScript",
            "description": "Dasar-dasar TypeScript untuk pemula",
            "createdAt": "2026-03-22T02:53:40.894Z",
            "updatedAt": "2026-03-22T02:53:40.894Z",
            "lessonCount": 0
        }
    ]
}
```

---

### Scenario 3: Update Section

#### 3.1 Update Section — Success

```
PUT /api/courses/{{courseSlug}}/sections/{{sectionId}}
Cookie: __session={{authToken}}
Body: { "title": "Pengenalan TypeScript - Updated" }
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `title`
- [x] `title === "Pengenalan TypeScript - Updated"`

**Actual Response:**
```json
{
    "id": "f9478d2e-637d-4cbe-8f4c-02cf2953f1b8",
    "courseId": "a953070e-d025-4a94-a25f-e244bbae9877",
    "order": 1,
    "title": "Pengenalan TypeScript - Updated",
    "description": "Dasar-dasar TypeScript untuk pemula",
    "createdAt": "2026-03-22T02:16:09.048Z",
    "updatedAt": "2026-03-22T09:25:45.567Z"
}
```

---

#### 3.2 Update Section — Not Found

```
PUT /api/courses/{{courseSlug}}/sections/nonexistent-id-00000000
Cookie: __session={{authToken}}
Body: { "title": "Section Tidak Ada" }
```

**Checklist:**
- [x] Status code `404`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Section not found",
    "code": "NOT_FOUND"
}
```

---

### Scenario 4: Delete Section

#### 4.1 Delete Section — Success

```
DELETE /api/courses/{{courseSlug}}/sections/{{sectionId}}
Cookie: __session={{authToken}}
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `deletedLessons`
- [x] `deletedLessons` adalah number (jumlah lessons yang ikut terhapus)

**Actual Response:**
```json
{
    "message": "Section deleted successfully",
    "deletedLessons": 0
}
```

---

## Running All Tests (Newman CLI)

```bash
# Install Newman
npm install -g newman

# Run semua tests
newman run docs/api/content-management/sections.postman_collection.json \
  --env-var "baseUrl=http://localhost:3000" \
  --env-var "courseSlug=YOUR_PUBLISHED_COURSE_SLUG" \
  --env-var "draftCourseSlug=YOUR_DRAFT_COURSE_SLUG" \
  --env-var "authToken=YOUR_CREATOR_TOKEN" \
  --env-var "otherUserToken=YOUR_OTHER_TOKEN"
```

---

## Validation Rules

| Field | Aturan |
|-------|--------|
| `title` | Required, maksimal 200 karakter |
| `order` | Required, integer positif, unik per course |
| `description` | Optional |

---

## Troubleshooting

| Error | Penyebab | Solusi |
|-------|----------|--------|
| 401 | Token tidak valid / expired | Re-login dan copy token baru |
| 403 | Bukan owner course | Pastikan `authToken` adalah owner dari `courseSlug` |
| 404 | Section ID tidak ada | Update variable `sectionId` dengan ID yang valid |
| 409 | Order sudah dipakai | Gunakan nilai `order` yang berbeda |
| Connection refused | Server tidak running | Jalankan `yarn dev` |

---

## References

- **Postman Collection:** `docs/api/content-management/sections.postman_collection.json`
- **Requirements:** `.kiro/specs/course-content-management-v2/requirements.md`
- **Design:** `.kiro/specs/course-content-management-v2/design.md`
- **Tasks:** `.kiro/specs/course-content-management-v2/tasks.md`

---

**Last Updated:** 2026-03-20  
**Status:** Ready for Testing
