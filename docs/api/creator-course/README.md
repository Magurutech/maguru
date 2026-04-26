# Creator Course API Testing Guide

**Feature:** Course Discovery & Enrollment  
**Sprint:** Sprint 2b  
**Requirements:** 4.x, 5.x, 6.x, 8.x

---

## Overview

Panduan testing untuk Creator Course API — endpoint yang digunakan creator untuk melihat daftar kursus miliknya, membuat kursus baru, dan toggle status publish.

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/creator/courses` | Required | List semua kursus milik creator + stats |
| POST | `/api/creator/courses` | Required | Buat kursus baru (Quick Start) |
| PUT | `/api/creator/courses/[slug]/publish` | Required (owner) | Toggle DRAFT ↔ PUBLISHED |

---

## Prerequisites

### 1. Start Development Server

```bash
yarn dev
# Server berjalan di http://localhost:3000
```

### 2. Siapkan Test Data

```sql
-- Cek courses milik creator
SELECT id, title, status FROM courses WHERE "creatorId" = 'YOUR_CLERK_USER_ID';
```

### 3. Dapatkan Auth Token (Clerk)

**Creator Token:**
1. Buka `http://localhost:3000`
2. Login sebagai user dengan role **Creator**
3. Buka DevTools → Application → Cookies → copy `__session`

**Other User Token (untuk test 403):**
1. Login sebagai user **berbeda** (bukan owner course)
2. Copy token-nya sebagai `otherUserToken`

---

## Import Postman Collection

1. Buka Postman
2. Click **Import**
3. Pilih file `docs/api/creator-course/creator-course.postman_collection.json`
4. Click **Import**

---

## Configure Collection Variables

| Variable | Nilai | Keterangan |
|----------|-------|------------|
| `baseUrl` | `http://localhost:3000` | URL server lokal |
| `courseId` | _(auto-filled setelah create)_ | ID course milik creator |
| `authToken` | _(isi dari Clerk)_ | Token creator (course owner) |
| `otherUserToken` | _(isi dari Clerk)_ | Token user lain (untuk test 403) |

> **Tip:** `courseId` akan otomatis ter-set setelah menjalankan request "Get Creator Courses - Success" atau "Create Course - Success".

---

## Test Scenarios & Checklist

---

### Scenario 1: Get Creator Courses

#### 1.1 Get Creator Courses — Unauthenticated

```
GET /api/creator/courses
(tanpa Authorization header)
```


**Checklist:**
- [x] Status code `401`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Unauthorized"
}
```

---

#### 1.2 Get Creator Courses — Success

```
GET /api/creator/courses
Authorization: Bearer {{authToken}}
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `courses` (array) dan `stats`
- [x] `stats` punya: `totalCourses`, `publishedCourses`, `draftCourses`
- [x] `stats.totalCourses === stats.publishedCourses + stats.draftCourses`
- [x] Setiap course punya: `id`, `title`, `status`, `difficulty`, `enrollmentCount`, `sectionCount`

**Actual Response:**
```json
{
    "courses": [
        {
            "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
            "title": "Test Course dari Postman",
            "description": "Deskripsi kursus test yang dibuat via Postman collection",
            "status": "DRAFT",
            "category": "programming",
            "difficulty": "Pemula",
            "createdAt": "2026-03-17T03:06:06.825Z",
            "updatedAt": "2026-03-17T03:06:06.344Z",
            "_count": {
                "sections": 0,
                "enrollments": 0
            },
            "slug": "78322b16-3758-4861-9e79-e647b36d9ab5",
            "sectionCount": 0,
            "enrollmentCount": 0
        }
    ],
    "stats": {
        "totalCourses": 1,
        "publishedCourses": 0,
        "draftCourses": 1
    }
}
```

---

### Scenario 2: Create Course

> Jalankan **berurutan** — mulai dari error cases dulu.

#### 2.1 Create Course — Unauthenticated

```
POST /api/creator/courses
(tanpa Authorization header)
Body: { "title": "...", "description": "...", ... }
```

**Checklist:**
- [x] Status code `401`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Silakan login terlebih dahulu"
}
```

---

#### 2.2 Create Course — Missing Required Fields

```
POST /api/creator/courses
Authorization: Bearer {{authToken}}
Body: { "title": "Kursus Tanpa Deskripsi" }
```

**Checklist:**
- [x] Status code `400`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Description is required"
}
```

---

#### 2.3 Create Course — Invalid Difficulty

```
POST /api/creator/courses
Authorization: Bearer {{authToken}}
Body: { "title": "...", "description": "...", "category": "...", "difficulty": "Expert", "status": "DRAFT" }
```

**Checklist:**
- [x] Status code `400`
- [x] `error` menyebut difficulty / nilai yang valid

**Actual Response:**
```json
{
    "error": "Difficulty must be one of: Pemula, Menengah, Mahir"
}
```

---

#### 2.4 Create Course — Success

```
POST /api/creator/courses
Authorization: Bearer {{authToken}}
Body:
{
  "title": "Test Course dari Postman",
  "description": "Deskripsi kursus test",
  "category": "programming",
  "difficulty": "Pemula",
  "status": "DRAFT"
}
```

**Checklist:**
- [x] Status code `201`
- [x] Response punya field `course`
- [x] `course` punya: `id`, `title`, `status`, `creatorId`
- [x] `course.status === 'DRAFT'`

**Actual Response:**
```json
{
    "course": {
        "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
        "title": "Test Course dari Postman",
        "description": "Deskripsi kursus test yang dibuat via Postman collection",
        "category": "programming",
        "difficulty": "Pemula",
        "status": "DRAFT",
        "creatorId": "user_2zDLu13tvWu8kQaHUrmyMBrDmWB",
        "createdAt": "2026-03-17T03:06:06.825Z",
        "updatedAt": "2026-03-17T03:06:06.344Z"
    }
}
```

---

### Scenario 3: Publish Toggle

> Jalankan **berurutan** — urutan penting untuk test toggle behavior.

#### 3.1 Publish Course — Unauthenticated

```
PUT /api/creator/courses/{{courseId}}/publish
(tanpa Authorization header)
```

**Checklist:**
- [x] Status code `401`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Silakan login terlebih dahulu"
}
```

---

#### 3.2 Publish Course — Not Owner

```
PUT /api/creator/courses/{{courseId}}/publish
Authorization: Bearer {{otherUserToken}}
```

**Checklist:**
- [x] Status code `403`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Anda tidak memiliki akses ke kursus ini"
}
```

---

#### 3.3 Publish Course — DRAFT to PUBLISHED

```
PUT /api/creator/courses/{{courseId}}/publish
Authorization: Bearer {{authToken}}
(courseId = course DRAFT dari Scenario 2.4)
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `course`
- [x] `course` punya: `id`, `title`, `status`
- [x] `course.status === 'PUBLISHED'`

**Actual Response:**
```json
{
    "course": {
        "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
        "title": "Test Course dari Postman",
        "status": "PUBLISHED"
    }
}
```

---

#### 3.4 Unpublish Course — PUBLISHED to DRAFT

```
PUT /api/creator/courses/{{courseId}}/publish
Authorization: Bearer {{authToken}}
(courseId sama, sekarang sudah PUBLISHED — jalankan ulang)
```

**Checklist:**
- [x] Status code `200`
- [x] `course.status === 'DRAFT'`

**Actual Response:**
```json
{
    "course": {
        "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
        "title": "Test Course dari Postman",
        "status": "DRAFT"
    }
}
```

---

## Running All Tests (Newman CLI)

```bash
# Install Newman
npm install -g newman

# Run semua tests
newman run docs/api/creator-course/creator-course.postman_collection.json \
  --env-var "baseUrl=http://localhost:3000" \
  --env-var "authToken=YOUR_CREATOR_TOKEN" \
  --env-var "otherUserToken=YOUR_OTHER_TOKEN" \
  --env-var "courseId=YOUR_COURSE_ID"
```

---

## Validation Rules

| Field                                                      | Aturan                                     |
| ------------------------------------------------------------| --------------------------------------------|
| `difficulty`                                               | Hanya: `"Pemula"`, `"Menengah"`, `"Mahir"` |
| `status`                                                   | Hanya: `"DRAFT"`, `"PUBLISHED"`            |
| `title`                                                    | Maksimal 100 karakter                      |
| `title`, `description`, `category`, `difficulty`, `status` | Semua required saat create                 |

---

## Troubleshooting

| Error              | Penyebab                    | Solusi                                            |
| --------------------| -----------------------------| ---------------------------------------------------|
| 401                | Token tidak valid / expired | Re-login dan copy token baru                      |
| 403 pada publish   | Bukan owner course          | Pastikan `authToken` adalah owner dari `courseId` |
| 400 pada create    | Validation error            | Cek semua required fields dan nilai difficulty    |
| 404 pada publish   | Course ID tidak ada         | Update variable `courseId` dengan ID yang valid   |
| Connection refused | Server tidak running        | Jalankan `yarn dev`                               |

---

## References

- **Postman Collection:** `docs/api/creator-course/creator-course.postman_collection.json`
- **Requirements:** `.kiro/specs/course-discovery/requirements.md`
- **Design:** `.kiro/specs/course-discovery/design.md`
- **Tasks:** `.kiro/specs/course-discovery/tasks.md`

---

**Last Updated:** 2026-03-17  
**Status:** Ready for Testing
