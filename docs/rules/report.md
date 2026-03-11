# Migration Guide: Old Course System → CMS V2

**Created:** 2026-03-12  
**Status:** Ready for Execution  
**Priority:** CRITICAL - Required before Task 10

---

## Overview

This guide outlines the migration from the old markdown-based course system to the new database-based CMS V2 system.

### System Comparison

| Aspect | Old System | New CMS V2 |
|--------|-----------|------------|
| **Storage** | File-based markdown | Database (Prisma + Supabase) |
| **Content Format** | Markdown files | Tiptap JSON |
| **Data Structure** | `CourseItem` | `Lesson` with `LessonContent` |
| **Editor** | N/A (manual markdown) | Tiptap rich-text editor |
| **Progress Tracking** | In-memory/localStorage | Database with `LessonProgress` |
| **Navigation** | `CourseSidebar` | `CourseNavigation` (shadcn/ui) |
| **Location** | `features/course/` | `features/cms/` |

---

## Migration Steps

### Step 1: Backup Old System (Optional)

```bash
# Create backup branch
git checkout -b backup/old-course-system

# Commit current state
git add .
git commit -m "backup: Archive old markdown-based course system"

# Return to main branch
git checkout main
```

### Step 2: Remove Old System

```bash
# Delete old course feature folder
rm -rf features/course

# Delete old learn page
rm app/course/[slug]/learn/page.tsx

# Commit deletion
git add .
git commit -m "refactor: Remove old markdown-based course system"
```

**Files to be deleted:**
- `features/course/` (entire folder)
  - `components/Sidebar/CourseSidebar.tsx`
  - `components/ContentRenderer.tsx`
  - `components/chatbot/`
  - `hooks/useCourse.ts`
  - `api/index.ts`
  - All related types and utilities

- `app/course/[slug]/learn/page.tsx` (current implementation)

### Step 3: Implement New Learn Page (Task 11.1)

**Location:** `app/course/[slug]/learn/page.tsx`

**Required Imports:**
```typescript
import { CourseNavigation } from '@/features/cms/components/student/CourseNavigation'
import { ProgressBar } from '@/features/cms/components/student/ProgressBar'
import { LessonViewer } from '@/features/cms/components/student/LessonViewer'
import { LessonNavigation } from '@/features/cms/components/student/LessonNavigation'
import { getCourseWithSections } from '@/features/cms/services/course.service'
import { getCourseProgress } from '@/features/cms/services/progress.service'
```

**Page Structure:**
```typescript
export default async function LearnPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // 1. Fetch course data with sections and lessons
  const course = await getCourseWithSections(params.slug)
  
  // 2. Fetch user progress
  const userId = await getCurrentUserId() // from Clerk
  const progress = await getCourseProgress(params.slug, userId)
  
  // 3. Determine current lesson (from URL query or last accessed)
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lesson') || getFirstLessonId(course)
  const currentLesson = await getLessonById(lessonId)
  
  // 4. Calculate navigation (prev/next lessons)
  const { previousLesson, nextLesson } = calculateNavigation(course, lessonId)
  
  return (
    <div className="learn-page-layout">
      {/* Sidebar with CourseNavigation */}
      <aside className="sidebar">
        <CourseNavigation 
          sections={course.sections}
          currentLessonId={lessonId}
          onLessonClick={handleLessonClick}
        />
      </aside>
      
      {/* Main content area */}
      <main className="main-content">
        {/* Progress bar at top */}
        <ProgressBar 
          percentage={progress.percentage}
          completedLessons={progress.completedLessons}
          totalLessons={progress.totalLessons}
        />
        
        {/* Lesson viewer */}
        <LessonViewer 
          lesson={currentLesson}
          onMarkComplete={handleMarkComplete}
          isCompleted={progress.completedLessons.includes(lessonId)}
        />
        
        {/* Prev/Next navigation */}
        <LessonNavigation 
          previousLesson={previousLesson}
          nextLesson={nextLesson}
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  )
}
```

### Step 4: Implement Server Actions (Task 11.2, 11.3)

**Location:** `app/course/[slug]/learn/actions.ts`

```typescript
'use server'

import { auth } from '@clerk/nextjs'
import { markLessonComplete } from '@/features/cms/services/progress.service'
import { revalidatePath } from 'next/cache'

export async function handleMarkComplete(lessonId: string, courseSlug: string) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')
  
  await markLessonComplete(userId, lessonId)
  
  // Revalidate to update progress bar
  revalidatePath(`/course/${courseSlug}/learn`)
  
  return { success: true }
}
```

### Step 5: Update Navigation (Task 11.2)

**Client Component:** `app/course/[slug]/learn/LearnPageClient.tsx`

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function LearnPageClient({ 
  course, 
  currentLesson, 
  progress 
}: LearnPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleLessonClick = (lessonId: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('lesson', lessonId)
    router.push(`/course/${course.slug}/learn?${params.toString()}`)
  }
  
  const handleNavigate = (lessonId: string) => {
    handleLessonClick(lessonId)
  }
  
  const handleMarkComplete = async () => {
    await handleMarkComplete(currentLesson.id, course.slug)
    // UI will update via revalidation
  }
  
  return (
    // ... render components with handlers
  )
}
```

---

## Data Migration (If Needed)

### If you have existing course data in markdown:

**Option 1: Manual Migration**
1. Create courses via creator dashboard
2. Copy content from markdown to Tiptap editor
3. Recreate section/lesson structure

**Option 2: Automated Migration Script**
```typescript
// scripts/migrate-courses.ts
import { readMarkdownFiles } from './utils'
import { createCourse, createSection, createLesson } from '@/features/cms/services'

async function migrateCourses() {
  const courses = await readMarkdownFiles('./content/courses')
  
  for (const course of courses) {
    // Create course
    const newCourse = await createCourse({
      title: course.title,
      slug: course.slug,
      creatorId: 'admin-user-id'
    })
    
    // Create sections and lessons
    for (const section of course.sections) {
      const newSection = await createSection({
        courseId: newCourse.id,
        title: section.title,
        order: section.order
      })
      
      for (const lesson of section.lessons) {
        // Convert markdown to Tiptap JSON
        const tiptapContent = markdownToTiptap(lesson.content)
        
        await createLesson({
          sectionId: newSection.id,
          title: lesson.title,
          content: {
            content: tiptapContent,
            version: 1,
            lastEdit: new Date().toISOString()
          },
          order: lesson.order
        })
      }
    }
  }
}
```

---

## Testing Migration

### Validation Checklist

- [ ] Old system completely removed
- [ ] New learn page renders without errors
- [ ] Course navigation displays sections and lessons
- [ ] Lesson content renders with Tiptap
- [ ] Progress bar shows correct percentage
- [ ] Mark as complete functionality works
- [ ] Prev/Next navigation works
- [ ] Progress persists after page refresh
- [ ] Mobile responsive layout works
- [ ] All tests passing (207/207)

### Test Commands

```bash
# Type checking
yarn type-check

# Linting
yarn lint

# Unit tests
yarn test:unit

# Build test
yarn build
```

---

## Rollback Plan

If migration fails, rollback to old system:

```bash
# Checkout backup branch
git checkout backup/old-course-system

# Or revert commits
git revert HEAD~2  # Revert last 2 commits

# Restore old files
git checkout HEAD~2 -- features/course
git checkout HEAD~2 -- app/course/[slug]/learn/page.tsx
```

---

## Timeline

| Task | Estimated Time | Priority |
|------|---------------|----------|
| Step 1: Backup | 5 minutes | Optional |
| Step 2: Remove old system | 10 minutes | High |
| Step 3: Implement new learn page | 2-3 hours | Critical |
| Step 4: Implement server actions | 1 hour | Critical |
| Step 5: Update navigation | 1 hour | Critical |
| Testing and validation | 1 hour | High |

**Total Estimated Time:** 5-6 hours

---

## Next Steps After Migration

1. ✅ Complete Task 11 (Student Learn Page Integration)
2. ⏭️ Implement Task 10 (Creator Dashboard Integration)
3. ⏭️ Implement Task 12 (Error Handling)
4. ⏭️ Implement Task 13 (Performance Optimization)

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-12  
**Status:** Ready for Execution
