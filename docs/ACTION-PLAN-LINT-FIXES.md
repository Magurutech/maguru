# Action Plan: Lint Fixes

**Target:** Menyelesaikan 38 lint issues  
**Priority:** HIGH  
**Estimated Time:** 4-6 hours

---

## 📊 Issue Breakdown

### Errors: 21
1. TypeScript `any` types: 18 errors
2. React unescaped entities: 1 error
3. Invalid ESLint rule: 1 error
4. Unused ESLint directive: 1 error

### Warnings: 17
1. Unused variables: 11 warnings
2. React hooks dependencies: 2 warnings
3. Unused imports: 4 warnings

---

## 🎯 Fix Strategy

### Phase 1: Critical Errors (Priority: HIGH)

#### 1.1 Fix TypeScript `any` Types

**File: `features/admin/hooks/useAdminGuard.tsx`**
```typescript
// Line 14: user: any
// Fix:
import { User } from '@clerk/nextjs/server'

export interface AdminAuthState {
  user: User | null  // ✅ Replace any with proper type
  role: string | null
  isAdmin: boolean
  isLoaded: boolean
  canAccessAdmin: () => boolean
  shouldShowLoader: boolean
  isAuthorized: boolean
}
```

**File: `features/course/components/CourseTabs.tsx`**
```typescript
// Lines 10, 12: course: any, progress?: any
// Fix:
import { Course } from '@/features/course/types'

interface CourseTabsProps {
  course: Course  // ✅ Use proper type
  progress?: CourseProgress | null  // ✅ Define CourseProgress type
  className?: string
  onTabChange?: (activeTab: string) => void
}

// Lines 75, 93: section: any, item: any
// Fix: Define proper types
interface CourseSection {
  id: string
  title: string
  description?: string
  items: CourseSectionItem[]
}

interface CourseSectionItem {
  id: string
  title: string
  duration?: string
}
```

**File: `features/course/lib/courseUtils.ts`**
```typescript
// Lines 6, 18: any types
// Fix:
export function extractCourseMetadata(course: Course): CourseMetadata {
  // Implementation
}

export function formatDuration(minutes: number): string {
  // Implementation
}
```

**File: `features/course/types/content-renderer.types.ts`**
```typescript
// Lines 43-45, 51: any types
// Fix:
import { ReactNode } from 'react'
import { Components } from 'react-markdown'

export interface MarkdownComponents extends Partial<Components> {
  code?: (props: CodeProps) => ReactNode
  pre?: (props: PreProps) => ReactNode
  table?: (props: TableProps) => ReactNode
  // ... other components
}
```

**File: `features/langserve/api.ts`**
```typescript
// Lines 221, 321, 378, 409, 440, 471, 528: any types
// Fix:
interface SSEEvent {
  event?: string
  data?: {
    output?: string
  }
  output?: string
}

// Replace all `any` with proper SSEEvent type
for await (const event of streamSSE<SSEEvent>(url, body, options)) {
  // Type-safe handling
}
```

#### 1.2 Fix React Unescaped Entities

**File: `features/course/components/chatbot/ChatbotAssistant.tsx:254`**
```typescript
// Before:
"Don't hesitate to ask!"

// After:
"Don&apos;t hesitate to ask!"
// or
{"Don't hesitate to ask!"}
```

#### 1.3 Remove Invalid ESLint Rule

**File: `features/course/components/CourseTabs.tsx:74`**
```typescript
// Remove this line:
// eslint-disable-next-line no-unsafe-member-access

// Replace with proper type checking
```

#### 1.4 Remove Unused ESLint Directive

**File: `features/admin/hooks/useAdminGuard.tsx:13`**
```typescript
// Remove this line:
//eslint-disable-next-line no-unused-vars
```

---

### Phase 2: Warnings (Priority: MEDIUM)

#### 2.1 Remove Unused Variables

**File: `__tests__/playwright/dashboard/edge-cases.spec.ts:27`**
```typescript
// Remove unused 'context' parameter
```

**File: `features/course/components/CustomLink.tsx:7`**
```typescript
// Remove unused 'node' parameter
```

**File: `features/course/components/TableWrapper.tsx:6`**
```typescript
// Remove unused 'node' parameter
```

**File: `features/course/components/TimelinePreview.tsx`**
```typescript
// Line 20: Remove 'onStartLearning' if not used
// Line 150: Remove 'itemIndex' if not used
```

**File: `features/course/components/chatbot/ChatbotAssistant.tsx`**
```typescript
// Line 9: Remove 'ChatbotContext' import if not used
// Line 26: Remove 'className' parameter if not used
```

**File: `features/course/hooks/useCourse.ts:4`**
```typescript
// Remove 'CourseDetailResponse' import if not used
```

**File: `features/course/lib/courseUtils.ts`**
```typescript
// Line 1: Remove 'CourseMetadata' import if not used
// Line 46: Remove 'calculateReadingTime' function if not used
```

**File: `features/langserve/api.ts`**
```typescript
// Lines 10, 12, 14, 16: Remove unused type imports
// Remove:
// - ExplainCodeResponse
// - HintResponse
// - QuizFeedbackResponse
// - GreetingResponse
```

#### 2.2 Fix React Hooks Dependencies

**File: `features/course/components/Sidebar/components/CourseSection.tsx`**

```typescript
// Line 46: Remove unnecessary dependency
React.useMemo(() => {
  // computation
}, []) // Remove section.id

// Line 145: Add missing dependency
React.useMemo(() => {
  // computation using sectionId
}, [sectionId]) // Add sectionId
```

---

## 🔧 Implementation Steps

### Step 1: Create Type Definitions
```bash
# Create new type definition files
touch features/course/types/course.types.ts
touch features/course/types/progress.types.ts
```

### Step 2: Define Types
```typescript
// features/course/types/course.types.ts
export interface Course {
  id: string
  slug: string
  title: string
  description: string
  overviewContent?: string
  sections: CourseSection[]
  // ... other fields
}

export interface CourseSection {
  id: string
  title: string
  description?: string
  items: CourseSectionItem[]
}

export interface CourseSectionItem {
  id: string
  title: string
  duration?: string
  type: 'lesson' | 'quiz' | 'exercise'
}

// features/course/types/progress.types.ts
export interface CourseProgress {
  userId: string
  courseId: string
  completedItems: string[]
  currentSection: string
  lastAccessedAt: Date
}
```

### Step 3: Update Imports
```typescript
// Update all files to use new types
import { Course, CourseSection } from '@/features/course/types/course.types'
import { CourseProgress } from '@/features/course/types/progress.types'
```

### Step 4: Run Lint Fix
```bash
# Auto-fix what can be fixed
yarn lint:fix

# Check remaining issues
yarn lint
```

### Step 5: Manual Fixes
- Fix remaining type issues
- Remove unused variables
- Fix React hooks dependencies

### Step 6: Verify
```bash
# Run type check
yarn type-check

# Run lint
yarn lint

# Run tests
yarn test:unit:all
```

---

## ✅ Success Criteria

- [ ] All 21 errors fixed
- [ ] All 17 warnings resolved
- [ ] `yarn lint` passes with 0 issues
- [ ] `yarn type-check` passes
- [ ] All tests still passing
- [ ] No regression in functionality

---

## 📝 Testing Checklist

After fixes, test these features:
- [ ] Admin dashboard access
- [ ] Course listing and detail pages
- [ ] Chatbot functionality
- [ ] Course progress tracking
- [ ] Authentication flow

---

## 🚀 Deployment

### Pre-deployment
```bash
# Run full check
yarn lint && yarn type-check && yarn test:unit:all

# Build check
yarn build
```

### Post-deployment
- Monitor error logs
- Check Sentry/error tracking
- Verify critical user flows

---

## 📊 Progress Tracking

### Phase 1: Critical Errors
- [ ] useAdminGuard.tsx (1 error)
- [ ] CourseTabs.tsx (6 errors)
- [ ] courseUtils.ts (2 errors)
- [ ] content-renderer.types.ts (4 errors)
- [ ] langserve/api.ts (6 errors)
- [ ] ChatbotAssistant.tsx (1 error)
- [ ] Invalid ESLint rules (1 error)

### Phase 2: Warnings
- [ ] Unused variables (11 warnings)
- [ ] React hooks deps (2 warnings)
- [ ] Unused imports (4 warnings)

---

**Estimated Completion:** 1-2 sprints  
**Risk Level:** LOW (mostly type fixes)  
**Impact:** HIGH (improved type safety and code quality)
