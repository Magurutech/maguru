# Design System Handbook Implementation Plan

> **For Antigravity:** REQUIRED SUB-SKILL: Load executing-plans to implement this plan task-by-task.

**Goal:** Create a structured, physically separate Design System catalog at `/design-system` displaying Maguru's design system tokens, typography scales, colors, and UI elements.

**Architecture:** We use Next.js App Router. A shared layout wrapper (`app/design-system/layout.tsx`) handles the header and top tab navigation, dynamically highlighting the active tab. Pages (`/design-system`, `/typography`, `/colors`, `/ui-elements`) showcase their respective design details.

**Tech Stack:** Next.js, React, Tailwind CSS v4, Lucide React.

---

## Proposed Changes

### Next.js Pages & Layout
We will create a layout and 4 separate pages to showcase the Design System elements.

#### [NEW] app/design-system/layout.tsx
Shared layout wrapper containing:
*   Header title ("Maguru Design System Handbook") and versioning.
*   Client component top tab navigation bar styled with `.debossed-skeuo`.
*   Active route highlighting (`usePathname`) using `.paper-skeuo` and bottom-border accent.

#### [NEW] app/design-system/page.tsx
Index / Introduction Page:
*   Introduction to Atelier Zero & Artisan Skeuomorphism design principles.
*   Do's & Don'ts cards.
*   Quick navigation link cards to typography, colors, and UI elements.

#### [NEW] app/design-system/typography/page.tsx
Typography Page:
*   Scale visual display (Display L down to Code Snippet).
*   Table mapping each scale role, font family, px size, weight, line-height, and letter spacing.

#### [NEW] app/design-system/colors/page.tsx
Color Palette Page:
*   Visual color swatches grouped by type (Backgrounds, Text, Accents, States).
*   Each swatch shows variables (e.g. `--color-accent-coral`), light and dark mode colors, and hex codes.

#### [NEW] app/design-system/ui-elements/page.tsx
UI Elements Page:
*   Card-based visual catalog categorized by size:
    *   **Small (1 column):** Primary button, secondary button, AI button, status badges (`.gold-skeuo`, `.success-skeuo`), interactive active state buttons.
    *   **Medium (2 columns):** Input fields (`.neu-input` for default, focus, error), AI Chat bubbles.
    *   **Large (3 columns):** 3D Tilt Course Card, Empty State visual box, AI Chat input bar.

---

## Verification Plan

### Manual Verification
1. Open the dev server: `npm run dev`
2. Navigate to `http://localhost:3000/design-system`
3. Click through the tabs (Beranda, Typography, Colors, UI Elements) and verify:
   *   URL changes correctly.
   *   Active tab highlighting works.
   *   Skeuomorphic button active states and card 3D tilt behaviors operate as designed.

---

## Tasks

### Task 1: Scaffolding Routes
**Files:**
*   Create: `app/design-system/layout.tsx` (stub)
*   Create: `app/design-system/page.tsx` (stub)
*   Create: `app/design-system/typography/page.tsx` (stub)
*   Create: `app/design-system/colors/page.tsx` (stub)
*   Create: `app/design-system/ui-elements/page.tsx` (stub)

**Step 1: Write minimal implementation**
Create the stub pages that export basic functional components under `app/design-system/`.

**Step 2: Verify page loads**
Navigate to `/design-system`, `/design-system/typography`, `/design-system/colors`, and `/design-system/ui-elements` on the local server to verify that the basic layout loads successfully.

**Step 3: Commit**
```bash
git add app/design-system/
git commit -m "feat: scaffold stub pages for design system handbook"
```

---

### Task 2: Layout & Navigation Tab Implementation
**Files:**
*   Modify: `app/design-system/layout.tsx`

**Step 1: Write implementation**
Implement the client-interactive tab navigation inside `app/design-system/layout.tsx` with dynamic active styling.

**Step 2: Verify navigation**
Navigate to `/design-system` and click the navigation tabs to ensure proper client routing and visual highlight updates.

**Step 3: Commit**
```bash
git add app/design-system/layout.tsx
git commit -m "feat: implement shared layout and dynamic tab navigation"
```

---

### Task 3: Index and Typography Showcase Page
**Files:**
*   Modify: `app/design-system/page.tsx`
*   Modify: `app/design-system/typography/page.tsx`

**Step 1: Write implementation**
Add content to `app/design-system/page.tsx` (philosophy, principles) and `app/design-system/typography/page.tsx` (skala font visual showcase table).

**Step 2: Verify content**
Open `/design-system` and `/design-system/typography` to verify layout aesthetics and typographical styling accuracy.

**Step 3: Commit**
```bash
git add app/design-system/page.tsx app/design-system/typography/page.tsx
git commit -m "feat: implement design system index and typography showcase page"
```

---

### Task 4: Color Palette Showcase Page
**Files:**
*   Modify: `app/design-system/colors/page.tsx`

**Step 1: Write implementation**
Implement `app/design-system/colors/page.tsx` displaying swatches with hex codes, variables, light vs. dark mode colors.

**Step 2: Verify colors**
Open `/design-system/colors` and verify visual representation of the Atelier Zero theme palette.

**Step 3: Commit**
```bash
git add app/design-system/colors/page.tsx
git commit -m "feat: implement color palette showcase page"
```

---

### Task 5: UI Elements Showcase Page
**Files:**
*   Modify: `app/design-system/ui-elements/page.tsx`

**Step 1: Write implementation**
Implement the cards of varying column sizes in `app/design-system/ui-elements/page.tsx`:
*   Grid layout using Tailwind classes `grid-cols-1 md:grid-cols-3 gap-6`.
*   Small (col-span-1) items.
*   Medium (col-span-2) items.
*   Large (col-span-3) items.

**Step 2: Verify UI components**
Open `/design-system/ui-elements` and test hover states, 3D tilt effects, inputs, chat bubbles, and the AI input bar manual interactions.

**Step 3: Commit**
```bash
git add app/design-system/ui-elements/page.tsx
git commit -m "feat: implement ui elements showcase page"
```
