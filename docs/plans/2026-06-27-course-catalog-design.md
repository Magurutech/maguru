# Design Document: Premium Course Catalog Redesign (Pendekatan A)

This document outlines the visual and architectural redesign of the Course Catalog page (`/course`) using **Pendekatan A (Full Reconstruction)**, bringing it in line with the premium editorial styling defined in `course-catalog.html`.

---

## 1. Architectural Overview & Files Affected

We will reconstruct the following components:
1. **[page.tsx](file:///D:/.maguru/maguru/app/course/page.tsx)**: Main page wrapper, custom layout grids, editorial Hero section, and overall page container.
2. **[CourseFilters.tsx](file:///D:/.maguru/maguru/features/cms/components/student/learn/CourseFilters.tsx)**: Reconstructed filter bar. Will integrate horizontal category chips synchronized with the existing category select dropdown and URL state.
3. **[CourseCard.tsx](file:///D:/.maguru/maguru/features/cms/components/student/CourseCard.tsx)**: Redesigned course card featuring:
   * 3D card tilt animation on mouse movement.
   * Dynamic SVG thumbnail placeholder icons reflecting the category.
   * Premium glassmorphism layout, bottom category accent borders, meta counters, and instructor info footer.

---

## 2. Layout & Spacing Design System

* **Page Background & Texture**: Uses the paper theme background class (`bg-background`) combined with the global noise canvas overlay (`.paper-texture`) to simulate physical paper card textures.
* **Side Rails**: Handled globally in `app/layout.tsx` (already active on desktop viewports).
* **Section Rule & Coordinates**: An editorial thin border dividing sections with coordinate markers:
  ```
  KATALOG KURSUS                                    § 01 — EXPLORE
  ```

---

## 3. Component Details & Data Flow

### A. Catalog Hero Section
* Left Column: Large sans headline `"Kuasai Skill yang Relevan & Terukur."` with `"Skill"` styled as a Playfair Serif italic text: `italic font-serif text-accent-coral`.
* Right Column: Floating stats bar with dynamic counts:
  * **48+** Kursus Aktif
  * **1.2K+** Pelajar Aktif
  * **94%** Penguasaan Kompetensi

### B. Dynamic Category & Level Filters
* We will preserve the exact database categories to prevent API query errors:
  `CATEGORIES = ['Pemrograman', 'Desain', 'Bisnis', 'Matematika', 'Bahasa', 'Sains', 'Seni', 'Lainnya']`
* Category chips will be rendered horizontally below the filter bar. Clicking a chip updates the active category filter state and triggers a client-side update to the page.

### C. Glassmorphism Course Cards with 3D Tilt
* We will implement client-side mouse move events to slightly rotate the card around the X and Y axes (`transform: rotateX(...) rotateY(...)`), giving it a premium 3D feeling.
* Category Thumbnail Mapping:
  * **`Pemrograman`**: Gradient: `#e8e0c8` to `#d4c8a8`. Icon: Code brackets. Accent bar: `var(--color-accent-olive)`.
  * **`Desain`**: Gradient: `#f0e8d0` to `#e8d8b8`. Icon: Figma layout/canvas. Accent bar: `var(--color-accent-coral)`.
  * **`Bisnis`**: Gradient: `#ece4cc` to `#e0d8b8`. Icon: Bar charts/user group. Accent bar: `var(--color-accent-mustard)`.
  * **`Other`**: Neutral warm paper gradient. Icon: Book. Accent bar: `var(--color-text-faint)`.

---

## 4. Verification Plan

* Execute `yarn lint` and `yarn type-check` to verify code correctness and clean integration.
* Check that catalog filter queries are accurately forwarded to `/api/courses`.
