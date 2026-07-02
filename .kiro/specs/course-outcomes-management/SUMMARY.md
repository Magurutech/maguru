# Course Outcomes Management - Summary (v2.0 Simplified)

**Updated:** 29 Juni 2026  
**Status:** ✅ Ready for Implementation  
**Total Estimate:** ~17 hours (~2.5 days)

---

## What Changed from v1.0 (Evaluation Simplifications)

### ❌ Removed (Over-engineered)

| Old v1.0                                                             | Why Removed                                                   |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| Separate `course_outcomes` table with id/courseId/order/timestamps   | YAGNI — PostgreSQL native array on `courses` is sufficient    |
| 5 CRUD endpoints for outcomes (GET/POST/PUT/DELETE/PATCH reorder)    | Overkill — 1 PATCH with full array is cleaner                 |
| `courseOutcomesService` with 5 service methods                       | Unnecessary layer for a simple array update                   |
| Stored `rating`, `studentsCount`, `coursesCount` on creator_profiles | Data drift risk — calculate on-the-fly via Prisma aggregation |
| POST + PUT split for creator profile                                 | Prisma upsert handles both in one call                        |
| 45-hour estimate across 6 days                                       | Too much for what's actually needed                           |

### ✅ What We Actually Build

| Feature                   | Implementation                                                              |
| ------------------------- | --------------------------------------------------------------------------- |
| Learning outcomes storage | `outcomes String[]` field on existing `courses` table                       |
| Outcomes API              | Extend existing `PATCH /api/courses/[slug]` — no new route file             |
| Creator profile storage   | New `creator_profiles` table (no stored stats)                              |
| Creator stats             | Live Prisma `_avg/_count` aggregation on each GET call                      |
| Profile API               | 3 new endpoints: `PUT /api/creator/profile`, public GET, course creator GET |
| Total endpoints           | 5 (down from 10)                                                            |
| Total hours               | ~17h (down from 45h)                                                        |

---

## Architecture at a Glance

```
CREATOR SIDE:
CourseOverview panel
  ├── LearningOutcomesEditor  →  PATCH /api/courses/[slug] { outcomes[] }
  └── DescriptionEditor       →  PATCH /api/courses/[slug] { description }

/creator/profile page
  └── CreatorProfileEditor    →  PUT /api/creator/profile (upsert)

STUDENT SIDE:
app/course/[slug]/page.tsx
  ├── GET /api/courses/[slug]          → course data incl. outcomes[]
  └── GET /api/courses/[slug]/creator  → profile + live stats

DATABASE:
  courses            (existing + outcomes String[])
  creator_profiles   (new, no stored stats)
```

---

## API Endpoints (5 total)

| Method | Endpoint                        | Purpose                                      |
| ------ | ------------------------------- | -------------------------------------------- |
| PATCH  | `/api/courses/[slug]`           | Update title/desc/outcomes (extend existing) |
| GET    | `/api/courses/[slug]/creator`   | Creator profile + live stats for course      |
| GET    | `/api/creator/profile`          | Own profile + stats (authed)                 |
| PUT    | `/api/creator/profile`          | Upsert own profile                           |
| GET    | `/api/creator/profile/[userId]` | Public profile                               |

---

## Tasks at a Glance

```
Day 1 — Backend
  T1.1  Prisma migrations (1h)
  T1.2  API layer: extend PATCH + 3 new endpoints (4h)

Day 2 — Frontend Creator
  T2.1  LearningOutcomesEditor component (3h)
  T2.2  CourseOverview panel refactor (1.5h)
  T2.3  CreatorProfileEditor + /creator/profile page (3h)

Day 3 — Integration + QA
  T3.1  Course detail page: use real data, remove mock (2.5h)
  T4.1  Smoke tests and QA (2h)

Total: ~17 hours
```

---

## Definition of Done

- [ ] `courses.outcomes` column exists and populated via Course Overview editor
- [ ] `creator_profiles` table exists, fillable via `/creator/profile`
- [ ] `GET /api/courses/[slug]` returns `outcomes: string[]`
- [ ] `GET /api/courses/[slug]/creator` returns profile + live stats
- [ ] Course detail page shows real outcomes (hidden when empty)
- [ ] Course detail page shows real creator info (placeholder when empty)
- [ ] `getCourseDetailMock()` no longer called in `app/course/[slug]/page.tsx`
- [ ] `CourseDetailMock.ts` can be safely deleted (no remaining imports)
- [ ] No regressions in existing course manage or course detail flows

---

**Version:** 2.0.0  
**Last Updated:** 29 Juni 2026
