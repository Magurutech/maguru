# Premium Course Catalog Implementation Plan

> **For Antigravity:** REQUIRED SUB-SKILL: Load executing-plans to implement this plan task-by-task.

**Goal:** Redesign the Course Catalog page (`/course`) with dynamic filters, stats, category chips, and 3D glassmorphic course cards matching `course-catalog.html` style.

**Architecture:** We will restructure the Server Component page wrapper for layout grids, update client-side filters in `CourseFilters.tsx` to include interactive category chips, and enhance `CourseCard.tsx` in `catalogMode` to implement 3D card tilt transformations, dynamic category SVGs, and brand-color accent bars.

**Tech Stack:** React, Next.js, Tailwind CSS, Lucide Icons, Playwright (for verification).

---

### Task 1: Catalog Page Layout & Hero Section

**Files:**
- Modify: `app/course/page.tsx`
- Test: `__tests__/playwright/course/student/catalog.spec.ts`

**Step 1: Verify current Playwright E2E status**

Run:
```bash
cross-env NODE_ENV=test npx playwright test __tests__/playwright/course/student/catalog.spec.ts
```
Expected: Tests pass on current baseline code.

**Step 2: Implement page layout, coordinates rule, and Catalog Hero**

Modify `app/course/page.tsx` to:
- Use the `.paper-texture` background wrapper.
- Add an editorial section rule at the top of the container:
  ```tsx
  <div className="border-t border-text-primary/12 dark:border-white/12 pt-4 mb-10 flex justify-between items-center text-[10.5px] tracking-[0.18em] uppercase text-text-faint font-sans">
    <span>Katalog Kursus</span>
    <span className="font-mono text-[10px] tracking-normal lowercase">§ 01 — explore</span>
  </div>
  ```
- Implement the 2-column grid layout for the Hero:
  * Left Column: Editorial heading `"Kuasai Skill yang Relevan & Terukur."` where `"Skill"` is formatted in serif italics: `<em className="font-serif italic font-medium text-accent-coral not-italic">Skill</em>`.
  * Right Column: Floating stats bar with dynamic or baseline values matching mock:
    - **48+** Kursus Aktif
    - **1.2k** Pelajar
    - **94%** Penguasaan
- Ensure a hidden `<h1>` containing `"Katalog Kursus"` exists for Playwright spec selectors:
  ```tsx
  <h1 className="sr-only">Katalog Kursus</h1>
  ```

**Step 3: Run Playwright test to verify structure passes**

Run:
```bash
cross-env NODE_ENV=test npx playwright test __tests__/playwright/course/student/catalog.spec.ts
```
Expected: PASS.

**Step 4: Commit**

```bash
git add app/course/page.tsx
git commit -m "style(course): redesign catalog hero section layout"
```

---

### Task 2: Category Chips and Filter Bar

**Files:**
- Modify: `features/cms/components/student/learn/CourseFilters.tsx`
- Test: `__tests__/playwright/course/student/catalog.spec.ts`

**Step 1: Update filters container and category chips**

Modify `features/cms/components/student/learn/CourseFilters.tsx` to:
- Refactor the filter block container into a styled glass-panel with a border.
- Retain the exact dropdown selects and search input with matching `aria-label` tags.
- Render category chips horizontally underneath the filter bar:
  * Categories: `['Pemrograman', 'Desain', 'Bisnis', 'Matematika', 'Bahasa', 'Sains', 'Seni', 'Lainnya']`
  * Add click handlers: clicking a chip updates the URL via hook `setCategory(cat)`.
  * Highlight active chip using active styling: `bg-accent-coral border-accent-coral text-white` (dark/light adapted).

**Step 2: Run Playwright test to verify filtering logic passes**

Run:
```bash
cross-env NODE_ENV=test npx playwright test __tests__/playwright/course/student/catalog.spec.ts
```
Expected: PASS.

**Step 3: Commit**

```bash
git add features/cms/components/student/learn/CourseFilters.tsx
git commit -m "feat(course): add category chips filter to catalog page"
```

---

### Task 3: Redesign CourseCard with 3D Tilt & Category SVGs

**Files:**
- Modify: `features/cms/components/student/CourseCard.tsx`
- Test: `__tests__/playwright/course/student/catalog.spec.ts`

**Step 1: Implement 3D Tilt and visual styling for catalog mode**

Modify `features/cms/components/student/CourseCard.tsx` to:
- When `catalogMode={true}`, apply:
  * Mouse move event listeners (`onMouseMove` and `onMouseLeave`) to calculate X/Y offsets relative to the card dimensions, modifying the dynamic inline `transform` CSS rule to rotate slightly:
    ```typescript
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    };
    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = '';
    };
    ```
  * Thumbnail: Render a styled container with custom gradients and large opacity-lowered vector icon based on the category:
    * `Pemrograman`: gradient: `from-[#e8e0c8] to-[#d4c8a8]`, icon: `<Code className="w-16 h-16 text-text-primary/18" />`, accent bar: `bg-accent-olive`.
    * `Desain`: gradient: `from-[#f0e8d0] to-[#e8d8b8]`, icon: `<Layers className="w-16 h-16 text-text-primary/18" />`, accent bar: `bg-accent-coral`.
    * `Bisnis`: gradient: `from-[#ece4cc] to-[#e0d8b8]`, icon: `<BarChart3 className="w-16 h-16 text-text-primary/18" />`, accent bar: `bg-accent-mustard`.
    * Default/Others: neutral paper gradient, icon: `<BookOpen className="w-16 h-16 text-text-primary/18" />`, accent bar: `bg-text-faint/30`.
  * Instructor Footer: Show initials avatar and teacher name.
  * CTA Button: Render a round, styled CTA button with arrow vector `"Mulai"` in bottom-right.

**Step 2: Run Playwright test to verify E2E compatibility**

Run:
```bash
cross-env NODE_ENV=test npx playwright test __tests__/playwright/course/student/catalog.spec.ts
```
Expected: PASS.

**Step 3: Commit**

```bash
git add features/cms/components/student/CourseCard.tsx
git commit -m "style(course): redesign CourseCard with 3D tilt and category SVGs"
```
