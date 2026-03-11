# System Migration Decision Point

**Date:** 2026-03-12  
**Status:** Awaiting User Decision  
**Priority:** CRITICAL

---

## Current Situation

We have completed Task 9 (Course Navigation Components) with all tests passing (207/207). However, we've identified a critical architectural conflict:

### Two Incompatible Systems Coexist

**Old System (Markdown-based):**
- Location: `features/course/`
- Storage: File-based markdown
- Data: `CourseItem` structure
- Used by: Current `app/course/[slug]/learn/page.tsx`

**New System (Database-based CMS V2):**
- Location: `features/cms/`
- Storage: Database (Prisma + Supabase)
- Data: `Lesson` with Tiptap JSON
- Components: All Task 1-9 components

---

## The Problem

The current learn page (`app/course/[slug]/learn/page.tsx`) imports from the OLD system:

```typescript
import { CourseSidebar } from '@/features/course/components/Sidebar/CourseSidebar'
import { useCourse } from '@/features/course/hooks/useCourse'
```

But we've built NEW components that are incompatible:

```typescript
// New CMS components (not being used)
import { CourseNavigation } from '@/features/cms/components/student/CourseNavigation'
import { LessonViewer } from '@/features/cms/components/student/LessonViewer'
```

**These systems cannot coexist because:**
1. Different data structures (`CourseItem` vs `Lesson`)
2. Different storage mechanisms (files vs database)
3. Different content formats (markdown vs Tiptap JSON)
4. Different navigation components (CourseSidebar vs CourseNavigation)

---

## Recommended Solution

### Clean Slate Approach

**Step 1: Remove Old System**
- Delete `features/course/` folder entirely
- Delete current `app/course/[slug]/learn/page.tsx`

**Step 2: Implement Task 11 (New Learn Page)**
- Create new learn page using CMS components
- Integrate CourseNavigation, LessonViewer, ProgressBar
- Implement database-based lesson loading
- Implement progress tracking

**Step 3: Validate Migration**
- Test all functionality
- Ensure all 207 tests still pass
- Verify mobile responsiveness

**Rationale:**
- ✅ Clean architecture (single source of truth)
- ✅ No technical debt from old system
- ✅ Easier maintenance going forward
- ✅ All new components are already built and tested
- ✅ Follows the spec requirements exactly

---

## Alternative: Gradual Migration

**Keep both systems temporarily:**
- Old system for existing courses
- New system for new courses
- Migrate data gradually

**Drawbacks:**
- ❌ Increased complexity
- ❌ Duplicate code maintenance
- ❌ Confusion about which system to use
- ❌ Technical debt accumulation
- ❌ Not aligned with spec requirements

---

## Migration Guide

A detailed migration guide has been created at:
`.kiro/specs/course-content-management-v2/migration-guide.md`

This guide includes:
- Step-by-step migration instructions
- Code examples for new learn page
- Data migration strategies
- Testing checklist
- Rollback plan

---

## Decision Required

**Question for User:**

> Should we proceed with the Clean Slate Approach?
> 
> This means:
> 1. Delete `features/course/` folder (old system)
> 2. Delete current learn page
> 3. Implement Task 11 (new learn page with CMS components)
> 
> **Estimated Time:** 5-6 hours
> 
> **Benefits:**
> - Clean architecture
> - No technical debt
> - Follows spec exactly
> - All components ready to use
> 
> **Risks:**
> - Temporary loss of learn page functionality
> - Need to rebuild page from scratch
> - Any existing course data needs migration

---

## Next Steps (After User Decision)

### If YES (Clean Slate):
1. Execute migration steps from migration-guide.md
2. Implement Task 11.1 (new learn page)
3. Implement Task 11.2 (lesson loading)
4. Implement Task 11.3 (mark as complete)
5. Implement Task 11.4 (progress persistence)
6. Validate with tests

### If NO (Keep Old System):
1. Document decision and rationale
2. Skip to Task 10 (Creator Dashboard)
3. Plan gradual migration strategy
4. Accept technical debt

---

## Recommendation

**I strongly recommend the Clean Slate Approach** because:

1. **Spec Alignment:** The spec (requirements.md) defines a database-based system with Tiptap JSON. The old markdown system doesn't match this.

2. **Components Ready:** All student components (Tasks 8-9) are complete and tested. We just need to wire them together.

3. **Technical Debt:** Keeping both systems creates confusion and maintenance burden.

4. **Time Investment:** We've already invested significant time building the new system. Completing the migration is the logical next step.

5. **Future-Proof:** The new system is designed for scalability and features like progress tracking, which the old system lacks.

---

**Awaiting user decision to proceed.**

---

## References

- Spec: `.kiro/specs/course-content-management-v2/requirements.md`
- Tasks: `.kiro/specs/course-content-management-v2/tasks.md`
- Migration Guide: `.kiro/specs/course-content-management-v2/migration-guide.md`
- Current Learn Page: `app/course/[slug]/learn/page.tsx`
- Old System: `features/course/`
- New System: `features/cms/`
