# API Tests Explanation - Feature 1: Version Tracking

## Overview

API tests untuk Feature 1 telah ditambahkan ke Postman collection yang sudah ada: `docs/api/content-management/lessons.postman.json`

## What Was Added

### 1. CREATE Test Enhancements
**Location:** Section "1. POST /api/courses/[slug]/sections/[sectionId]/lessons" → "Create Lesson - Success (201)"

**Added Assertions:**
- `[Version Tracking] CREATE returns version = 1` - Memastikan lesson baru selalu memiliki version 1
- `[Version Tracking] Version is a number` - Validasi tipe data version
- `[Version Tracking] lastEdit is ISO 8601 string` - Validasi format timestamp

### 2. UPDATE Test Enhancements
**Location:** Section "4. PUT /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]" → "Update Lesson - Success, Version Increment (200)"

**Added Assertions:**
- `[Version Tracking] UPDATE increments version from N to N+1` - Memastikan version increment dari versi sebelumnya
- `[Version Tracking] Property 1: Version Increment Monotonicity` - Validasi property utama
- `[Version Tracking] lastEdit updated after UPDATE` - Memastikan timestamp diupdate dan recent (< 60 detik)

### 3. New Test: Second UPDATE (Version 2→3)
**Purpose:** Validate monotonic increment pada update kedua

**Assertions:**
- `[Version Tracking] Second UPDATE increments to version 3` - Memastikan version = 3 setelah update kedua
- `[Version Tracking] Property 1: Monotonic Increment (2→3)` - Validasi increment dari 2 ke 3

### 4. New Test: Third UPDATE (Version 3→4)
**Purpose:** Final validation untuk memastikan version tracking bekerja konsisten across multiple updates

**Assertions:**
- `[Version Tracking] Third UPDATE increments to version 4` - Memastikan version = 4 setelah update ketiga
- `[Version Tracking] Property 1: Monotonic Increment (3→4)` - Validasi increment dari 3 ke 4
- `[Version Tracking] Multiple updates maintain monotonicity` - Validasi full flow: CREATE(1) → UPDATE(2) → UPDATE(3) → UPDATE(4)

## Test Flow

```
1. CREATE Lesson
   ↓
   Response: version = 1
   ↓
   Save to collection variable: lessonVersion = 1

2. UPDATE Lesson (First)
   ↓
   Request: version = 1 (client always sends 1)
   ↓
   Server: reads current version (1), increments to 2
   ↓
   Response: version = 2
   ↓
   Update collection variable: lessonVersion = 2

3. UPDATE Lesson (Second)
   ↓
   Request: version = 1 (client always sends 1)
   ↓
   Server: reads current version (2), increments to 3
   ↓
   Response: version = 3
   ↓
   Update collection variable: lessonVersion = 3

4. UPDATE Lesson (Third)
   ↓
   Request: version = 1 (client always sends 1)
   ↓
   Server: reads current version (3), increments to 4
   ↓
   Response: version = 4
   ↓
   Final validation: Full flow completed successfully
```

## How to Run

### Prerequisites
1. Import collection ke Postman: `docs/api/content-management/lessons.postman.json`
2. Set collection variables:
   - `baseUrl`: `http://localhost:3000`
   - `courseSlug`: Slug kursus yang PUBLISHED (e.g., `belajar-typescript-dari-nol`)
   - `sectionId`: ID section yang valid
   - `authToken`: Clerk `__session` cookie value dari creator/owner

### Execution Order
**IMPORTANT:** Tests harus dijalankan secara berurutan karena saling bergantung:

1. **Create Lesson - Success (201)** - Creates lesson, sets `lessonId` and `lessonVersion = 1`
2. **Update Lesson - Success, Version Increment (200)** - Updates to version 2
3. **Update Lesson - Second Update (Version 2→3)** - Updates to version 3
4. **Update Lesson - Third Update (Version 3→4)** - Updates to version 4

### Run Options

**Option 1: Run entire collection**
```bash
# In Postman: Click "Run collection" button
# Select all tests or specific folder
# Click "Run Content Management - Lessons API"
```

**Option 2: Run individual tests**
```bash
# Click each test in order
# Click "Send" button
# Verify all assertions pass (green checkmarks)
```

## Expected Results

All assertions should pass (green checkmarks):

```
✅ Status code is 201/200
✅ [Version Tracking] CREATE returns version = 1
✅ [Version Tracking] Version is a number
✅ [Version Tracking] lastEdit is ISO 8601 string
✅ [Version Tracking] UPDATE increments version from N to N+1
✅ [Version Tracking] Property 1: Version Increment Monotonicity
✅ [Version Tracking] lastEdit updated after UPDATE
✅ [Version Tracking] Second UPDATE increments to version 3
✅ [Version Tracking] Property 1: Monotonic Increment (2→3)
✅ [Version Tracking] Third UPDATE increments to version 4
✅ [Version Tracking] Property 1: Monotonic Increment (3→4)
✅ [Version Tracking] Multiple updates maintain monotonicity
```

## Console Output

Check Postman console for detailed logs:

```
✅ CREATE lesson version: 1
✅ UPDATE lesson version: 1 → 2
✅ Second UPDATE lesson version: 3
✅ Third UPDATE lesson version: 4
✅ Version tracking validated: CREATE(1) → UPDATE(2) → UPDATE(3) → UPDATE(4)
```

## Property Validation

**Property 1: Version Increment Monotonicity**

*For any existing lesson with version N, saving an update should result in the lesson having version N+1 in the database response.*

This property is validated by:
- UPDATE test: Validates N → N+1 increment
- Second UPDATE test: Validates 2 → 3 increment
- Third UPDATE test: Validates 3 → 4 increment
- Final assertion: Validates full monotonic sequence

## Notes

- Client always sends `version: 1` in request body (both CREATE and UPDATE)
- Server handles version increment automatically on UPDATE
- Server reads current version from database and increments it
- This design simplifies client logic - no need to track version numbers
- All version tracking logic is server-side in `lesson.service.ts`

## Troubleshooting

**Issue:** Tests fail with 401 Unauthorized
- **Solution:** Update `authToken` collection variable with valid Clerk session cookie

**Issue:** Tests fail with 404 Not Found
- **Solution:** Verify `courseSlug` and `sectionId` are valid and exist in database

**Issue:** Version doesn't increment
- **Solution:** Check server logs, verify `lesson.service.ts` increment logic is working

**Issue:** Tests run out of order
- **Solution:** Run tests manually in sequence, or use Postman Collection Runner with correct order

## Related Files

- **Postman Collection:** `docs/api/content-management/lessons.postman.json`
- **API Documentation:** `docs/api/content-management/lesson-api.md`
- **Unit Tests:** `__tests__/unit/features/cms/version-tracking.test.tsx`
- **E2E Tests:** `__tests__/playwright/course/creator/version-tracking.spec.ts`
- **Feature Summary:** `.kiro/specs/tiptap-editor-improvement/feature-1-summary.md`
