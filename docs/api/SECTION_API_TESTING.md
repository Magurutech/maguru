# Section Management API Testing Guide

**Feature:** Course Content Management V2  
**Commit:** 409a201606ba5281e3e1007be9138b4c23be1860  
**JIRA:** MGR-27  
**Requirements:** 1.1-1.8, 8.1-8.3, 9.1, 9.5, 9.8, 12.6

---

## Overview

Panduan ini menjelaskan cara testing Section Management API menggunakan Postman collection yang sudah disediakan.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/courses/[slug]/sections` | Create new section |
| GET | `/api/courses/[slug]/sections` | List all sections |
| PUT | `/api/courses/[slug]/sections/[sectionId]` | Update section |
| DELETE | `/api/courses/[slug]/sections/[sectionId]` | Delete section |

---

## Prerequisites

### 1. Setup Database

Pastikan database sudah di-setup dengan schema yang benar:

```bash
# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 2. Create Test Course

Buat course untuk testing (atau gunakan existing course):

```sql
-- Insert test course
INSERT INTO courses (id, title, description, status, category, "creatorId", "createdAt", "updatedAt")
VALUES (
  'test-course-id',
  'web-dev-101',
  'Web Development 101',
  'PUBLISHED',
  'Web Development',
  'test-creator-id',
  NOW(),
  NOW()
);
```

### 3. Start Development Server

```bash
yarn app
# Server akan berjalan di http://localhost:3000
```

---

## Import Postman Collection

### Option 1: Import File

1. Buka Postman
2. Click **Import** button
3. Pilih file `docs/api/section-management.postman_collection.json`
4. Click **Import**

### Option 2: Import dari URL (jika di Git)

1. Buka Postman
2. Click **Import** → **Link**
3. Paste URL raw file dari GitHub
4. Click **Continue** → **Import**

---

## Configure Variables

Setelah import, set collection variables:

1. Click collection name → **Variables** tab
2. Set values:

| Variable | Current Value | Description |
|----------|---------------|-------------|
| `baseUrl` | `http://localhost:3000` | API base URL |
| `courseSlug` | `web-dev-101` | Course slug untuk testing |
| `sectionId` | (auto-filled) | Section ID dari create response |
| `authToken` | (optional) | Auth token jika diperlukan |

---

## Test Scenarios

### Scenario 1: Happy Path - Create and Manage Section

**Steps:**

1. **Create Section**
   - Run: `1. Create Section` → `Create Section - Success`
   - Expected: Status 201, section created
   - Note: `sectionId` akan auto-saved ke collection variable

2. **List Sections**
   - Run: `2. List Sections` → `List Sections - Success`
   - Expected: Status 200, array of sections
   - Verify: Section yang baru dibuat ada di list

3. **Update Section Title**
   - Run: `3. Update Section` → `Update Section - Title`
   - Expected: Status 200, title updated

4. **Update Section Order**
   - Run: `3. Update Section` → `Update Section - Order`
   - Expected: Status 200, order updated

5. **Delete Section**
   - Run: `4. Delete Section` → `Delete Section - Success`
   - Expected: Status 200, section deleted

---

### Scenario 2: Validation Testing

**Test Empty Title:**
```
Run: 1. Create Section → Create Section - Empty Title
Expected: 400 Bad Request
Error: "Section title is required"
```

**Test Title Too Long:**
```
Run: 1. Create Section → Create Section - Title Too Long
Expected: 400 Bad Request
Error: "Section title must not exceed 200 characters"
```

**Test Invalid Order:**
```
Run: 1. Create Section → Create Section - Invalid Order
Expected: 400 Bad Request
Error: "Section order must be a positive integer"
```

**Test Duplicate Order:**
```
Prerequisites: Create section with order 1 first
Run: 1. Create Section → Create Section - Duplicate Order
Expected: 400 or 409
Error: "Section with order 1 already exists in this course"
```

---

### Scenario 3: Error Handling

**Test Course Not Found:**
```
Run: 1. Create Section → Create Section - Course Not Found
Expected: 404 Not Found
Error: "Course not found"
```

**Test Section Not Found (Update):**
```
Run: 3. Update Section → Update Section - Not Found
Expected: 404 Not Found
Error: "Section not found"
```

**Test Section Not Found (Delete):**
```
Run: 4. Delete Section → Delete Section - Not Found
Expected: 404 Not Found
Error: "Section not found"
```

---

## Running All Tests

### Option 1: Collection Runner

1. Click collection name
2. Click **Run** button
3. Select all requests
4. Click **Run Section Management API**
5. View test results

### Option 2: Newman (CLI)

```bash
# Install Newman
npm install -g newman

# Run collection
newman run docs/api/section-management.postman_collection.json \
  --environment your-environment.json \
  --reporters cli,json

# Run with specific folder
newman run docs/api/section-management.postman_collection.json \
  --folder "1. Create Section"
```

---

## Expected Test Results

### All Tests Passing

```
┌─────────────────────────┬──────────┬──────────┐
│                         │ executed │   failed │
├─────────────────────────┼──────────┼──────────┤
│              iterations │        1 │        0 │
├─────────────────────────┼──────────┼──────────┤
│                requests │       13 │        0 │
├─────────────────────────┼──────────┼──────────┤
│            test-scripts │       26 │        0 │
├─────────────────────────┼──────────┼──────────┤
│      prerequest-scripts │        0 │        0 │
├─────────────────────────┼──────────┼──────────┤
│              assertions │       52 │        0 │
└─────────────────────────┴──────────┴──────────┘
```

### Test Coverage

| Category | Tests | Coverage |
|----------|-------|----------|
| Create Section | 6 | 100% |
| List Sections | 2 | 100% |
| Update Section | 4 | 100% |
| Delete Section | 2 | 100% |
| **Total** | **14** | **100%** |

---

## Troubleshooting

### Issue: 401 Unauthorized

**Problem:** API requires authentication

**Solution:**
1. Implement authentication bypass untuk testing, atau
2. Add valid auth token ke collection variable `authToken`
3. Add Authorization header ke requests

### Issue: 404 Course Not Found

**Problem:** Course dengan slug tidak ada di database

**Solution:**
1. Verify course exists: `SELECT * FROM courses WHERE title = 'web-dev-101'`
2. Update `courseSlug` variable dengan slug yang valid
3. Create test course jika belum ada

### Issue: 409 Duplicate Order

**Problem:** Section dengan order tersebut sudah ada

**Solution:**
1. Delete existing sections: `DELETE FROM sections WHERE "courseId" = 'test-course-id'`
2. Atau gunakan order number yang berbeda

### Issue: Connection Refused

**Problem:** Development server tidak running

**Solution:**
```bash
# Start server
yarn app

# Verify server running
curl http://localhost:3000/api/health
```

---

## Manual Testing with cURL

### Create Section

```bash
curl -X POST http://localhost:3000/api/courses/web-dev-101/sections \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to HTML",
    "description": "Learn the basics",
    "order": 1
  }'
```

### List Sections

```bash
curl http://localhost:3000/api/courses/web-dev-101/sections
```

### Update Section

```bash
curl -X PUT http://localhost:3000/api/courses/web-dev-101/sections/SECTION_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

### Delete Section

```bash
curl -X DELETE http://localhost:3000/api/courses/web-dev-101/sections/SECTION_ID
```

---

## Next Steps

After Section API testing is complete:

1. ✅ Section Management API tested
2. ⏭️ Implement Lesson Management API (Task 4)
3. ⏭️ Create Lesson API testing collection
4. ⏭️ Implement Progress Tracking API (Task 5)

---

## References

- **Requirements:** `.kiro/specs/course-content-management-v2/requirements.md`
- **Design:** `.kiro/specs/course-content-management-v2/design.md`
- **Tasks:** `.kiro/specs/course-content-management-v2/tasks.md`
- **Service Tests:** `features/cms/services/__tests__/section.service.test.ts`

---

**Last Updated:** 2026-03-09  
**Status:** Ready for Testing  
**Commit:** 409a201606ba5281e3e1007be9138b4c23be1860
