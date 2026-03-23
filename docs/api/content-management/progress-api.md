# Progress API Testing Guide

**Feature:** Course Content Management  
**Sprint:** Sprint 2 — Content First  
**Requirements:** 6.2, 6.5, 7.1, 7.2

---

## Overview

Panduan testing untuk Progress API — endpoint yang digunakan student untuk menandai lesson selesai dan melihat progress belajar.

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/progress/lesson/[lessonId]/complete` | Required (student) | Tandai lesson sebagai selesai |
| GET | `/api/progress/course/[courseSlug]` | Required (student) | Progress keseluruhan kursus |
| GET | `/api/progress/lesson/[lessonId]` | Required (student) | Status completion satu lesson |

---

## Prerequisites

### 1. Start Development Server

```bash
yarn dev
# Server berjalan di http://localhost:3000
```

### 2. Siapkan Test Data

```sql
-- Cek enrollments student
SELECT e."courseId", c.id, c.slug, c.title
FROM enrollments e
JOIN courses c ON e."courseId" = c.id
WHERE e."userId" = 'YOUR_CLERK_USER_ID';

-- Cek lessons yang tersedia dalam course tersebut
SELECT l.id, l.title, s.title as section_title
FROM lessons l
JOIN sections s ON l."sectionId" = s.id
JOIN courses c ON s."courseId" = c.id
WHERE c.slug = 'YOUR_COURSE_SLUG';
```

Pastikan:
- Student sudah **enrolled** ke course yang akan ditest
- Course memiliki minimal 1 lesson

### 3. Dapatkan Auth Token (Clerk)

**Student Token:**
1. Buka `http://localhost:3000`
2. Login sebagai user **Student** yang sudah enrolled ke course
3. Buka DevTools → Application → Cookies → copy nilai `__session`

---

## Import Postman Collection

1. Buka Postman
2. Click **Import**
3. Pilih file `docs/api/content-management/progress.postman_collection.json`
4. Click **Import**

---

## Configure Collection Variables

| Variable | Nilai | Keterangan |
|----------|-------|------------|
| `baseUrl` | `http://localhost:3000` | URL server lokal |
| `courseSlug` | _(isi manual)_ | Slug kursus yang student sudah enrolled — human-readable (e.g. `belajar-typescript-dari-nol`), bukan UUID |
| `lessonId` | _(isi manual)_ | ID lesson yang valid dalam kursus tersebut |
| `authToken` | _(isi dari Clerk)_ | Token student yang sudah enrolled |

---

## Test Scenarios & Checklist

---

### Scenario 1: Mark Lesson Complete

> Jalankan **berurutan** — unauthenticated dulu, baru success.

#### 1.1 Mark Lesson Complete — Unauthenticated

```
POST /api/progress/lesson/{{lessonId}}/complete
(tanpa Authorization header)
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

#### 1.2 Mark Lesson Complete — Success

```
POST /api/progress/lesson/{{lessonId}}/complete
Cookie: __session={{authToken}}
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `completed` dengan nilai `true`
- [x] Response punya field `completedAt` (timestamp, bukan null)

**Actual Response:**
```json
{
    "id": "2aabe562-5ce4-44b0-9ab0-4275cafac7bc",
    "lessonId": "021a377c-86ea-4a67-a12c-c46d1e933aa1",
    "userId": "user_2zENLKAiz32PGUtK7I5S3zaSPXr",
    "completed": true,
    "completedAt": "2026-03-22T11:12:12.842Z",
    "createdAt": "2026-03-22T11:12:12.854Z"
}
```

---

### Scenario 2: Get Course Progress

#### 2.1 Get Course Progress — Unauthenticated

```
GET /api/progress/course/{{courseSlug}}
(tanpa Authorization header)
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

#### 2.2 Get Course Progress — Success

```
GET /api/progress/course/{{courseSlug}}
Cookie: __session={{authToken}}
(jalankan setelah Mark Lesson Complete — 1.2)
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `percentage`, `completedLessons`, `totalLessons`
- [x] `percentage` adalah number antara `0` dan `100`
- [x] `completedLessons <= totalLessons`
- [x] `percentage > 0` (karena sudah mark complete di 1.2)

**Actual Response:**
```json
{
    "courseId": "a953070e-d025-4a94-a25f-e244bbae9877",
    "userId": "user_2zENLKAiz32PGUtK7I5S3zaSPXr",
    "percentage": 50,
    "completedLessons": 1,
    "totalLessons": 2,
    "completed": false,
    "completedAt": "2026-03-22T11:12:13.625Z"
}
```

> **Bug sudah difix:** `getCourseProgress` sebelumnya query by `title` bukan `slug`. Sudah diperbaiki — jalankan ulang setelah server restart.

---

### Scenario 3: Get Lesson Progress

#### 3.1 Get Lesson Progress — Unauthenticated

```
GET /api/progress/lesson/{{lessonId}}
(tanpa Authorization header)
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

#### 3.2 Get Lesson Progress — Success

```
GET /api/progress/lesson/{{lessonId}}
Cookie: __session={{authToken}}
(jalankan setelah Mark Lesson Complete — 1.2)
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `completed`
- [x] `completed` adalah boolean
- [x] `completed === true` (karena sudah mark complete di 1.2)

**Actual Response:**
```json
{
    "lessonId": "021a377c-86ea-4a67-a12c-c46d1e933aa1",
    "userId": "user_2zENLKAiz32PGUtK7I5S3zaSPXr",
    "completed": true,
    "completedAt": "2026-03-22T11:12:12.842Z"
}
{
    "lessonId": "4dd8a76a-1b98-4c4e-866e-558b24da71a2",
    "userId": "user_2zENLKAiz32PGUtK7I5S3zaSPXr",
    "completed": false,
    "completedAt": null
}
```

---

## Running All Tests (Newman CLI)

```bash
# Install Newman
npm install -g newman

# Run semua tests
newman run docs/api/content-management/progress.postman_collection.json \
  --env-var "baseUrl=http://localhost:3000" \
  --env-var "courseSlug=YOUR_COURSE_SLUG" \
  --env-var "lessonId=YOUR_LESSON_ID" \
  --env-var "authToken=YOUR_STUDENT_TOKEN"
```

---

## Validation Rules

| Field | Aturan |
|-------|--------|
| `percentage` | Number, 0–100, rounded 2 decimal places |
| `completedLessons` | Integer >= 0 |
| `totalLessons` | Integer >= 0 |
| `completed` | Boolean |
| `completedAt` | Timestamp ISO 8601, null jika belum selesai |

---

## Troubleshooting

| Error | Penyebab | Solusi |
|-------|----------|--------|
| 401 | Token tidak valid / expired | Re-login dan copy token baru |
| 404 | Lesson / Course tidak ada | Update variable `lessonId` atau `courseSlug` |
| `percentage` tetap 0 | Mark complete belum berhasil | Jalankan ulang Scenario 1.2 |
| Connection refused | Server tidak running | Jalankan `yarn dev` |

---

## References

- **Postman Collection:** `docs/api/content-management/progress.postman_collection.json`
- **Lessons README:** `docs/api/content-management/lessons/README.md`
- **Sections README:** `docs/api/content-management/sections/README.md`
- **Requirements:** `.kiro/specs/course-content-management-v2/requirements.md`
- **Design:** `.kiro/specs/course-content-management-v2/design.md`
- **Tasks:** `.kiro/specs/course-content-management-v2/tasks.md`

---

**Last Updated:** 2026-03-20  
**Status:** Ready for Testing
