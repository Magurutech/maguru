# Lint Fixes Progress Tracker

**Started:** 7 Maret 2026  
**Target Completion:** TBD  
**Current Status:** 🔴 Not Started

---

## 📊 Overall Progress

```
Total Issues: 38
Fixed: 0
Remaining: 38
Progress: ▱▱▱▱▱▱▱▱▱▱ 0%
```

---

## 🔴 Phase 1: Critical Errors (21 issues)

### TypeScript `any` Types (18 errors)

#### features/admin/hooks/useAdminGuard.tsx
- [ ] Line 14: `user: any` → Replace with `User | null`
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

#### features/course/components/CourseTabs.tsx
- [ ] Line 10: `course: any` → Replace with `Course`
- [ ] Line 12: `progress?: any` → Replace with `CourseProgress | null`
- [ ] Line 75: `section: any` → Replace with `CourseSection`
- [ ] Line 93: `item: any` → Replace with `CourseSectionItem`
- [ ] Line 75 (comment): Remove invalid ESLint rule
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

#### features/course/lib/courseUtils.ts
- [ ] Line 6: Function parameter `any` → Replace with proper type
- [ ] Line 18: Function parameter `any` → Replace with proper type
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

#### features/course/types/content-renderer.types.ts
- [ ] Line 43: `any` → Replace with `ReactNode`
- [ ] Line 44: `any` → Replace with `ReactNode`
- [ ] Line 45: `any` → Replace with `ReactNode`
- [ ] Line 51: `any` → Replace with proper type
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

#### features/langserve/api.ts
- [ ] Line 221: `any` → Replace with `SSEEvent`
- [ ] Line 321: `any` → Replace with `SSEEvent`
- [ ] Line 378: `any` → Replace with `SSEEvent`
- [ ] Line 409: `any` → Replace with `SSEEvent`
- [ ] Line 440: `any` → Replace with `SSEEvent`
- [ ] Line 471: `any` → Replace with `SSEEvent`
- [ ] Line 528: `any` → Replace with `SSEEvent`
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

### Other Errors (3 errors)

#### React Unescaped Entities
- [ ] features/course/components/chatbot/ChatbotAssistant.tsx:254
  - Fix: Replace `'` with `&apos;` or use `{}`
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

#### Invalid ESLint Rule
- [ ] features/course/components/CourseTabs.tsx:74
  - Remove: `// eslint-disable-next-line no-unsafe-member-access`
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

#### Unused ESLint Directive
- [ ] features/admin/hooks/useAdminGuard.tsx:13
  - Remove: `//eslint-disable-next-line no-unused-vars`
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

---

## 🟡 Phase 2: Warnings (17 issues)

### Unused Variables (11 warnings)

#### Test Files
- [ ] __tests__/playwright/dashboard/edge-cases.spec.ts:27
  - Remove unused `context` parameter
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

#### Component Files
- [ ] features/course/components/CustomLink.tsx:7
  - Remove unused `node` parameter
- [ ] features/course/components/TableWrapper.tsx:6
  - Remove unused `node` parameter
- [ ] features/course/components/TimelinePreview.tsx:20
  - Remove unused `onStartLearning`
- [ ] features/course/components/TimelinePreview.tsx:150
  - Remove unused `itemIndex`
- [ ] features/course/components/chatbot/ChatbotAssistant.tsx:9
  - Remove unused `ChatbotContext` import
- [ ] features/course/components/chatbot/ChatbotAssistant.tsx:26
  - Remove unused `className` parameter
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

#### Hook Files
- [ ] features/course/hooks/useCourse.ts:4
  - Remove unused `CourseDetailResponse` import
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

#### Utility Files
- [ ] features/course/lib/courseUtils.ts:1
  - Remove unused `CourseMetadata` import
- [ ] features/course/lib/courseUtils.ts:46
  - Remove unused `calculateReadingTime` function
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

#### API Files
- [ ] features/langserve/api.ts:10
  - Remove unused `ExplainCodeResponse` import
- [ ] features/langserve/api.ts:12
  - Remove unused `HintResponse` import
- [ ] features/langserve/api.ts:14
  - Remove unused `QuizFeedbackResponse` import
- [ ] features/langserve/api.ts:16
  - Remove unused `GreetingResponse` import
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

### React Hooks Dependencies (2 warnings)

#### features/course/components/Sidebar/components/CourseSection.tsx
- [ ] Line 46: Remove unnecessary `section.id` dependency
- [ ] Line 145: Add missing `sectionId` dependency
- **Status:** 🔴 Not Started
- **Assignee:** TBD
- **PR:** N/A

---

## 📝 Notes & Blockers

### Blockers
- None currently

### Dependencies
- Need to create type definition files first:
  - `features/course/types/course.types.ts`
  - `features/course/types/progress.types.ts`

### Questions
- TBD

---

## ✅ Verification Checklist

After all fixes:
- [ ] `yarn lint` passes with 0 issues
- [ ] `yarn type-check` passes
- [ ] `yarn test:unit:all` passes
- [ ] `yarn build` succeeds
- [ ] Manual testing completed
- [ ] PR created and reviewed
- [ ] Changes merged to develop

---

## 📈 Sprint Progress

### Sprint 1
**Goal:** Fix all critical errors (21 issues)  
**Status:** 🔴 Not Started  
**Progress:** 0/21 (0%)

### Sprint 2
**Goal:** Fix all warnings (17 issues)  
**Status:** 🔴 Not Started  
**Progress:** 0/17 (0%)

---

## 🎯 Daily Updates

### 2026-03-07 (Today)
- ✅ Analysis completed
- ✅ Documentation created
- 🔴 Fixes not started yet

### 2026-03-08
- TBD

### 2026-03-09
- TBD

---

## 📊 Statistics

```
Files Affected: 11
Lines to Change: ~50
Estimated Time: 4-6 hours
Actual Time: TBD
```

---

**Last Updated:** 7 Maret 2026  
**Updated By:** Kiro AI Assistant  
**Next Update:** After first fix session
