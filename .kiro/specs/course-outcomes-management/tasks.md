# Implementation Plan: Course Outcomes Management

**Feature Name:** course-outcomes-management  
**Version:** 2.0.0 (Simplified)  
**Date Updated:** 29 Juni 2026  
**Total Estimate:** ~17 hours (~2.5 days)

---

## Overview

Implementasi Learning Outcomes dan Creator Profile dengan approach yang sederhana:

- Learning outcomes disimpan sebagai `String[]` array di tabel `courses` (no new table)
- Creator profile di tabel baru `creator_profiles` dengan stats yang calculated on-the-fly (no stored stats)
- Backend logic diorganisir per fitur di `features/[fitur]/services/` sesuai architecture.md
- Total 4 fase implementasi: Database → API Layer → Frontend Creator → Frontend Student + QA

---

## Task Dependency Graph

```json
{
  "waves": [
    {
      "phase": "PHASE 1: Database & API (Day 1)",
      "tasks": [
        {
          "id": "T1.1",
          "name": "Prisma Schema Changes",
          "dependencies": []
        },
        {
          "id": "T1.2",
          "name": "API Layer",
          "dependencies": ["T1.1"]
        }
      ]
    },
    {
      "phase": "PHASE 2: Frontend - Creator Side (Day 2)",
      "tasks": [
        {
          "id": "T2.1",
          "name": "LearningOutcomesEditor component",
          "dependencies": ["T1.2"]
        },
        {
          "id": "T2.2",
          "name": "CourseOverview panel refactor",
          "dependencies": ["T2.1"]
        },
        {
          "id": "T2.3",
          "name": "CreatorProfileEditor + profile page",
          "dependencies": ["T1.2"]
        }
      ]
    },
    {
      "phase": "PHASE 3: Student Side Integration (Day 3 morning)",
      "tasks": [
        {
          "id": "T3.1",
          "name": "Course Detail Page Integration",
          "dependencies": ["T1.2"]
        }
      ]
    },
    {
      "phase": "PHASE 4: Testing & QA (Day 3 afternoon)",
      "tasks": [
        {
          "id": "T4.1",
          "name": "Smoke tests & QA",
          "dependencies": ["T3.1"]
        }
      ]
    }
  ]
}
```

---

## Tasks

### PHASE 1 — Database & API

---

#### Task 1: Prisma Schema Changes (T1.1)

**Est:** 1 hour | **Priority:** P0 | **Blocks:** everything

**Description:**

Add `outcomes` column to `courses` table and create new `creator_profiles` table.

**Acceptance Criteria:**

1. `prisma.courses.update({ data: { outcomes: [...] } })` works without errors
2. `prisma.creator_profiles.upsert(...)` works without errors

**Subtasks:**

1. Add `outcomes String[]` to `courses` model in `schema.prisma`
2. Create `creator_profiles` model (fields: userId unique, name, title, bio, experience, avatarUrl, socialLinks Json, timestamps)
3. Run `prisma migrate dev --name add-outcomes-and-creator-profiles`
4. Run `prisma generate`
5. Verify both changes in DB

---

#### Task 2: API Layer (T1.2)

**Est:** 4 hours | **Priority:** P0 | **Depends on:** T1.1

**Description:**

Extend existing course PATCH endpoint, add 3 new creator profile endpoints following architecture.md service layer pattern.

**Acceptance Criteria:**

1. `PATCH /api/courses/[slug]` with `{ outcomes: ["..."] }` updates DB correctly
2. `GET /api/courses/[slug]` response includes `outcomes` array
3. `GET /api/courses/[slug]/creator` returns profile + stats without error
4. `PUT /api/creator/profile` creates and updates profile (upsert)
5. Unauthorized requests get 401, wrong owner gets 403

**Subtask 2.1: Extend existing `PATCH /api/courses/[slug]`**

1. Create `features/cms/services/courseOutcomeService.ts` with validation logic
   - Function `validateOutcomes(outcomes: string[])`
   - Check: max 8 items, each 15-255 chars, sanitize XSS
2. Update `app/api/courses/[slug]/route.ts` to import and call service
3. Add `outcomes` to accepted body fields in PATCH handler
4. Add `outcomes` to Prisma `update` call
5. Verify PATCH handler calls service for validation

**Subtask 2.2: Extend existing `GET /api/courses/[slug]`**

1. Add `outcomes: true` to Prisma `select` in GET handler
2. Add `outcomes` to TypeScript return type in `types.ts`
3. Verify GET response includes `outcomes: string[]`

**Subtask 2.3: New `GET /api/courses/[slug]/creator`**

1. Create `features/cms/services/creatorProfileService.ts` with:
   - Function `getCreatorByCourseSlug(slug: string)` — fetches course + profile + live stats
   - Live stats via Prisma aggregation (rating avg, course count, student count)
2. Create `app/api/courses/[slug]/creator/route.ts`
3. Implement GET handler that calls service
4. Return combined profile + stats JSON
5. Return null profile with 0 stats if no profile found
6. Handle not-found course (404)

**Subtask 2.4: New `PUT /api/creator/profile`**

1. Add functions to `creatorProfileService.ts`:
   - `validateProfileInput(data: any)` — check field lengths, URL format
   - `upsertCreatorProfile(userId: string, data: any)` — upsert via Prisma
   - `getCreatorProfile(userId: string)` — GET own profile + live stats
2. Create `app/api/creator/profile/route.ts` with GET and PUT handlers
3. GET: return own profile + live stats (auth required)
4. PUT: call service `upsertCreatorProfile`
5. Create `app/api/creator/profile/[userId]/route.ts` for public GET
6. Return public fields only (no sensitive data)
7. All errors follow standard error shape

---

### PHASE 2 — Frontend: Creator Side

---

#### Task 3: LearningOutcomesEditor Component (T2.1)

**Est:** 3 hours | **Priority:** P0 | **Depends on:** T1.2

**File:** `features/cms/components/creator/manage/panels/LearningOutcomesEditor.tsx`

**Description:**

Build component with local state for outcomes array. All edits happen locally, single PATCH call on save.

**Acceptance Criteria:**

1. All four operations (add/edit/delete/reorder) update local state immediately
2. Single PATCH call on each operation with final array
3. UI matches design system styling
4. Works on mobile (responsive)

**Subtasks:**

1. Create component with props: `{ courseSlug: string, initialOutcomes: string[] }`
2. Local state: `outcomes: string[]`, `draft: string`, `editIdx: number | null`, `isSaving: boolean`
3. Implement `saveOutcomes(next: string[])` — PATCH call + optimistic update
4. Add item: input + "Tambah" button → append to array → save
5. Edit item: click → inline input → save on blur/Enter → update array → save
6. Delete item: confirmation → filter array → save
7. Reorder: up/down buttons → swap indices → save
8. UI: item counter badge `(n/8)`, character counter per item
9. Empty state with CTA icon + "Tambah Outcome" button
10. Loading indicator while saving (disable interactions)
11. Error toast if PATCH fails (revert to previous state)
12. Match design system: paper-texture cards, accent-coral accents, font-sans

---

#### Task 4: CourseOverview Panel Refactor (T2.2)

**Est:** 1.5 hours | **Priority:** P1 | **Depends on:** T2.1

**File:** `features/cms/components/creator/manage/panels/CourseOverview.tsx`

**Description:**

Mount LearningOutcomesEditor above existing Description Editor.

**Acceptance Criteria:**

1. Outcomes editor visible above description on Course Overview
2. Existing description editor and right column unaffected
3. No layout shift or overflow on any breakpoint

**Subtasks:**

1. Import `LearningOutcomesEditor`
2. Read `course.outcomes` from `useManageContext()` (add to context type if missing)
3. Place `<LearningOutcomesEditor>` **above** `<DescriptionEditor>` in left column
4. Ensure right column (stats + AI advisor) is top-aligned (already is via `space-y-6`)
5. Test responsive layout — verify no stacking issues on mobile

---

#### Task 5: Creator Profile Editor + Page (T2.3)

**Est:** 3 hours | **Priority:** P1 | **Depends on:** T1.2

**Files:**

- `features/creator-dashboard/components/CreatorProfileEditor.tsx`
- `app/creator/profile/page.tsx`

**Description:**

Build form to edit creator profile and display on dedicated page.

**Acceptance Criteria:**

1. Profile saves correctly via PUT upsert
2. Stats show live numbers from aggregation
3. Page accessible via `/creator/profile`
4. Profile-incomplete banner shown when profile is empty

**Subtask 5.1: Component**

1. Create form with all fields: name, title, bio, experience, avatarUrl, social links
2. Fetch own profile on mount: `GET /api/creator/profile`
3. Show stats section (read-only): rating, students, courses — from API response
4. Submit: `PUT /api/creator/profile` → show success toast
5. Client-side validation (length, URL format) before submit
6. Cancel button resets to initial values

**Subtask 5.2: Page + Navigation**

1. Create `app/creator/profile/page.tsx` — renders `<CreatorProfileEditor />`
2. Add "Edit Profil" link/button in Creator Dashboard header or sidebar
3. Show profile-incomplete banner on dashboard if name/title are null

---

### PHASE 3 — Student Side Integration

---

#### Task 6: Course Detail Page Integration (T3.1)

**Est:** 2.5 hours | **Priority:** P0 | **Depends on:** T1.2

**Files:**

- `app/course/[slug]/page.tsx`
- `features/cms/components/student/overview/PremiumSections.tsx`
- `features/cms/components/student/overview/PremiumSidebar.tsx`
- `features/cms/components/student/overview/types.ts`

**Description:**

Fetch real outcomes + creator from API, remove mock data dependency.

**Acceptance Criteria:**

1. Course detail shows real outcomes from DB (or hides section if empty)
2. Course detail shows real creator profile (or placeholder if no profile)
3. `CourseDetailMock` no longer imported in page.tsx
4. No TypeScript errors

**Subtasks:**

1. Add `fetchCourseCreator(slug)` function → `GET /api/courses/[slug]/creator`
2. Add to `Promise.all` in `CourseDetailPage`
3. Update `CourseDetail` type to include `outcomes: string[]`
4. Update `PremiumCourseTabs`: pass `course.outcomes` instead of `mockData.outcomes`
5. Update `UnifiedDescriptionSection`: accept `outcomes: string[]` prop, render as checklist
6. Update `PremiumSidebar`: accept `creator` prop (name, title, bio, avatar, stats)
7. Update `PremiumHero`: use `creator?.stats.rating` if available, fallback to `course.rating`
8. Remove `getCourseDetailMock()` call and import from `CourseDetailMock`
9. Handle empty outcomes: hide "Yang Akan Anda Pelajari" section if `outcomes.length === 0`
10. Handle null creator: show generic instructor placeholder

---

### PHASE 4 — Testing & QA

---

#### Task 7: Smoke Tests & QA (T4.1)

**Est:** 2 hours | **Priority:** P1 | **Depends on:** T3.1

**Description:**

Manual testing to verify end-to-end flows and error handling.

**Acceptance Criteria:**

1. All manual flows work end-to-end
2. API rejects invalid input correctly
3. No regressions in existing manage features (sections, lessons)
4. No regressions on course detail page (enrollment, curriculum tab)

**Subtasks:**

1. Manual test: Create course → add outcomes in Overview panel → verify in DB
2. Manual test: Fill creator profile → navigate to course detail → verify displayed
3. Manual test: Empty outcomes on course detail → section not shown
4. Manual test: No creator profile → placeholder shown
5. API test: PATCH with 9 outcomes → 400 error
6. API test: PATCH with 12-char outcome → 400 error
7. API test: Unauthorized PATCH → 401/403
8. Check no console errors on course manage page
9. Check no console errors on course detail page

---

## Notes

### Implementation Notes

1. **Service Layer Structure** (per architecture.md):
   - All backend logic for outcomes validation goes in `features/cms/services/courseOutcomeService.ts`
   - All backend logic for creator profile goes in `features/cms/services/creatorProfileService.ts`
   - API routes in `app/api/` remain thin — they call services and return responses

2. **State Management** (LearningOutcomesEditor):
   - Keep all state local to the component
   - No Context/Redux needed for this feature
   - Save to DB only on explicit action (add/edit/delete/reorder)

3. **Stats Aggregation** (Creator Profile):
   - No caching initially — calculate on each GET
   - If GET `/api/courses/[slug]/creator` becomes slow (> 200ms), add in-memory cache (60s TTL)
   - Use Prisma `_count` and `_avg` for live calculations

4. **Authorization**:
   - Use existing auth middleware on API routes
   - Verify `creatorId` matches authenticated user for course writes
   - Verify `userId` matches authenticated user for profile writes

5. **Error Handling**:
   - All API responses follow standard shape: `{ error?, data? }`
   - Validation errors: 400
   - Auth errors: 401
   - Ownership errors: 403
   - Not found: 404

### Files to Clean Up

After T3.1 is complete and verified:

1. `features/cms/components/student/overview/CourseDetailMock.ts` → Delete entirely
2. Remove `CourseMockData` type references
3. Remove `instructorRating` prop from `PremiumHero` (no longer needed)

---

## Summary

| Task | What                                        | Est  | Phase            |
| ---- | ------------------------------------------- | ---- | ---------------- |
| 1    | Prisma migrations                           | 1h   | Backend          |
| 2    | API changes (extend PATCH, 3 new endpoints) | 4h   | Backend          |
| 3    | LearningOutcomesEditor component            | 3h   | Frontend Creator |
| 4    | CourseOverview panel refactor               | 1.5h | Frontend Creator |
| 5    | CreatorProfileEditor + page                 | 3h   | Frontend Creator |
| 6    | Course detail integration + remove mock     | 2.5h | Frontend Student |
| 7    | Smoke tests & QA                            | 2h   | Testing          |

**Total: ~17 hours (~2.5 days)**

---

**Document Version:** 2.0.0  
**Updated:** 29 Juni 2026  
**Status:** Ready for Implementation
