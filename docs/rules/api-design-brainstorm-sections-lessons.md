# API Design Brainstorm: Sections + Lessons Data Fetching

**Date**: 2026-04-10  
**Question**: Haruskah kita fetch lessons per-section atau sekaligus semua sections+lessons?

---

## Current Architecture

### Route yang Ada Sekarang:

```
GET /api/courses/[slug]/sections
  → Returns: { sections: [{ id, title, description, order, lessonCount }] }
  → Tidak include lessons

GET /api/courses/[slug]/sections/[sectionId]/lessons
  → Returns: { lessons: [{ id, title, order, contentPreview }] }
  → Per section
```

### Current Frontend Flow:

```typescript
// 1. Load sections
GET /api/courses/[slug]/sections
  → sections: [{ id: "sec1", lessonCount: 7 }, { id: "sec2", lessonCount: 2 }]

// 2. User expands section → fetch lessons
GET /api/courses/[slug]/sections/sec1/lessons
  → lessons: [{ id: "l1", title: "..." }, ...]

// 3. User expands another section → fetch lessons
GET /api/courses/[slug]/sections/sec2/lessons
  → lessons: [{ id: "l2", title: "..." }, ...]
```

**Problem**: Jika UI menampilkan semua sections expanded by default, kita perlu N+1 requests (1 untuk sections, N untuk lessons per section).

---

## Option 1: Keep Current (Lazy Loading per Section)

### API Design:
```
GET /api/courses/[slug]/sections
  → { sections: [...] }

GET /api/courses/[slug]/sections/[sectionId]/lessons
  → { lessons: [...] }
```

### Pros:
✅ **Granular control** - fetch only what's needed  
✅ **Better for large courses** - tidak load semua data sekaligus  
✅ **Lazy loading** - user hanya load section yang dibuka  
✅ **Caching friendly** - bisa cache per section  
✅ **Bandwidth efficient** - jika user hanya buka 1-2 sections  
✅ **Already implemented** - no breaking changes  

### Cons:
❌ **N+1 problem** - jika semua sections expanded, banyak requests  
❌ **Slower initial load** - jika user ingin lihat semua  
❌ **Complex state management** - perlu track mana yang sudah di-fetch  
❌ **Waterfall requests** - sequential, tidak parallel  

### Best For:
- Courses dengan banyak sections (10+)
- Courses dengan banyak lessons per section (50+)
- Mobile users dengan bandwidth terbatas
- Lazy loading UX (sections collapsed by default)

---

## Option 2: Single Endpoint (All Sections + Lessons)

### API Design:
```
GET /api/courses/[slug]/sections?include=lessons
  → {
      sections: [
        {
          id: "sec1",
          title: "...",
          lessons: [
            { id: "l1", title: "...", order: 1 },
            { id: "l2", title: "...", order: 2 }
          ]
        },
        {
          id: "sec2",
          title: "...",
          lessons: [...]
        }
      ]
    }
```

### Pros:
✅ **Single request** - no N+1 problem  
✅ **Faster initial load** - semua data langsung tersedia  
✅ **Simpler state management** - no lazy loading complexity  
✅ **Better UX** - instant expand/collapse (no loading)  
✅ **Parallel data loading** - database bisa optimize dengan JOIN  

### Cons:
❌ **Larger payload** - transfer semua data sekaligus  
❌ **Slower for large courses** - jika ada 100+ lessons  
❌ **Over-fetching** - user mungkin tidak buka semua sections  
❌ **Less flexible** - tidak bisa granular caching  
❌ **Breaking change** - perlu refactor frontend  

### Best For:
- Courses dengan sedikit sections (< 10)
- Courses dengan sedikit lessons per section (< 20)
- Desktop users dengan bandwidth bagus
- UX yang menampilkan semua sections expanded

---

## Option 3: Hybrid Approach (Recommended)

### API Design:
```
GET /api/courses/[slug]/sections?include=lessons
  → All sections + lessons (for student learn page)

GET /api/courses/[slug]/sections
  → Sections only (for creator manage page)

GET /api/courses/[slug]/sections/[sectionId]/lessons
  → Lessons per section (for lazy loading if needed)
```

### Implementation:

```typescript
// app/api/courses/[slug]/sections/route.ts
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  const includeLessons = searchParams.get('include') === 'lessons'

  if (includeLessons) {
    // Fetch sections + lessons in single query
    const result = await sectionService.getSectionsWithLessons(slug)
    return NextResponse.json({ sections: result.sections })
  } else {
    // Fetch sections only (current behavior)
    const result = await sectionService.getSectionsByCourseSlug(slug)
    return NextResponse.json({ sections: result.sections })
  }
}
```

### Service Layer:

```typescript
// features/cms/services/section.service.ts
async getSectionsWithLessons(courseSlug: string) {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              order: true,
              content: true, // For contentPreview extraction
            }
          }
        }
      }
    }
  })

  if (!course) return null

  // Extract contentPreview for each lesson
  const sections = course.sections.map(section => ({
    ...section,
    lessons: section.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      contentPreview: extractContentPreview(lesson.content)
    }))
  }))

  return { courseId: course.id, courseStatus: course.status, sections }
}
```

### Frontend Usage:

```typescript
// Student learn page - fetch all at once
const { sections } = await fetch(`/api/courses/${slug}/sections?include=lessons`)

// Creator manage page - lazy load per section
const { sections } = await fetch(`/api/courses/${slug}/sections`)
// Then fetch lessons when section expanded
const { lessons } = await fetch(`/api/courses/${slug}/sections/${sectionId}/lessons`)
```

### Pros:
✅ **Best of both worlds** - flexibility untuk kedua use case  
✅ **Backward compatible** - existing endpoints tetap work  
✅ **Optimized per use case** - student vs creator  
✅ **Single query option** - untuk student learn page  
✅ **Lazy loading option** - untuk creator manage page  

### Cons:
❌ **More complex** - 2 code paths di service layer  
❌ **Need to maintain both** - 2 query strategies  

---

## Performance Comparison

### Scenario: Course dengan 5 sections, 30 total lessons

#### Current (Lazy per Section):
```
Request 1: GET /sections → 50ms
Request 2: GET /sections/sec1/lessons → 80ms
Request 3: GET /sections/sec2/lessons → 80ms
Request 4: GET /sections/sec3/lessons → 80ms
Request 5: GET /sections/sec4/lessons → 80ms
Request 6: GET /sections/sec5/lessons → 80ms

Total: 450ms (sequential)
Total: ~150ms (if parallel)
```

#### Single Endpoint:
```
Request 1: GET /sections?include=lessons → 120ms

Total: 120ms
```

**Winner**: Single endpoint (60% faster)

### Scenario: Course dengan 20 sections, 200 total lessons

#### Current (Lazy per Section):
```
If user only opens 3 sections:
Request 1: GET /sections → 80ms
Request 2-4: GET /sections/[id]/lessons → 3 × 100ms = 300ms

Total: 380ms
Data transferred: ~15KB
```

#### Single Endpoint:
```
Request 1: GET /sections?include=lessons → 400ms

Total: 400ms
Data transferred: ~100KB
```

**Winner**: Lazy loading (faster + less data)

---

## Recommendation

### For Student Learn Page:
**Use Option 3 (Hybrid)** dengan `?include=lessons`

**Reasoning**:
1. Student biasanya ingin lihat semua lessons (untuk progress tracking)
2. UX lebih baik - instant expand/collapse
3. Typical course size: 5-10 sections, 20-50 lessons (manageable payload)
4. Single request = faster perceived performance

### For Creator Manage Page:
**Keep current lazy loading**

**Reasoning**:
1. Creator fokus pada 1 section at a time (editing)
2. Lazy loading = faster initial load
3. Granular caching per section
4. Better for large courses in development

---

## Implementation Plan

### Phase 1: Add Query Parameter Support
```typescript
// app/api/courses/[slug]/sections/route.ts
export async function GET(request: Request, { params }) {
  const { searchParams } = new URL(request.url)
  const includeLessons = searchParams.get('include') === 'lessons'
  
  if (includeLessons) {
    const result = await sectionService.getSectionsWithLessons(slug)
    return NextResponse.json({ sections: result.sections })
  }
  
  // Existing behavior
  const result = await sectionService.getSectionsByCourseSlug(slug)
  return NextResponse.json({ sections: result.sections })
}
```

### Phase 2: Add Service Method
```typescript
// features/cms/services/section.service.ts
async getSectionsWithLessons(courseSlug: string) {
  // Single query with nested include
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              order: true,
              content: true,
            }
          }
        }
      }
    }
  })
  
  // Process and return
  return processedData
}
```

### Phase 3: Update Student Learn Page
```typescript
// features/cms/hooks/learn/useCourseLearn.ts
const fetchSectionsWithLessons = async () => {
  const res = await fetch(`/api/courses/${courseSlug}/sections?include=lessons`)
  const data = await res.json()
  
  // Set sections
  setSections(data.sections)
  
  // Pre-populate lessonsMap
  const lessonsMap = {}
  data.sections.forEach(section => {
    lessonsMap[section.id] = section.lessons
  })
  setLessonsMap(lessonsMap)
  
  // Mark all sections as expanded
  setExpandedSections(new Set(data.sections.map(s => s.id)))
}
```

---

## Current Problem Solution

**The bug you're experiencing is a frontend issue**, not an API design issue.

### Quick Fix (No API Changes):
Sync `openSections` (UI) with `expandedSections` (data) state.

### Better Fix (With API Enhancement):
1. Add `?include=lessons` support to `/api/courses/[slug]/sections`
2. Fetch all sections+lessons on initial load
3. Pre-populate `lessonsMap` and `expandedSections`
4. Remove lazy loading complexity from student learn page

---

## Conclusion

**Answer to your question**: 

Anda benar! Untuk **student learn page**, lebih baik fetch semua sections+lessons sekaligus karena:
1. User ingin lihat semua lessons (untuk progress)
2. Typical course size tidak terlalu besar (< 100 lessons)
3. Single request lebih cepat dari N+1 requests
4. UX lebih baik (no loading saat expand)

**Tetapi** untuk **creator manage page**, lazy loading per section masih lebih baik karena:
1. Creator fokus pada 1 section at a time
2. Faster initial load
3. Better for large courses in development

**Recommendation**: Implement hybrid approach (Option 3) - best of both worlds!
