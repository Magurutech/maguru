# Design Document: Premium Course Detail Page Reconstruction

This document outlines the visual and architectural redesign of the Course Detail page (`/course/[slug]`) using **Pendekatan A (Full Reconstruction)**, bringing it in line with the premium editorial styling defined in `course-detail.html` (Atelier Zero visual language).

---

## 1. Architectural Overview & Files Affected

We will reconstruct the following components and files:
1. **[page.tsx](file:///D:/.maguru/maguru/app/course/[slug]/page.tsx)**: Reconstructed as the main Server Component page orchestrator.
2. **`features/cms/components/student/overview/CourseDetailMock.ts`**: Helper mapping utility supplying high-quality contextual mockup data (Outcomes, Project, AI chat, Reviews, Instructor profile) based on the course category and slug.
3. **`features/cms/components/student/overview/PremiumHero.tsx`**: New premium hero displaying breadcrumbs, main display typography, dynamic course badges, and meta indicators.
4. **`features/cms/components/student/overview/PremiumCourseTabs.tsx`**: Tab control manager to navigate layout panels.
5. **`features/cms/components/student/overview/PremiumCurriculum.tsx`**: New curriculum component with smooth details-based accordion foldings.
6. **`features/cms/components/student/overview/PremiumSidebar.tsx`**: New desktop sticky enrollment panel and mobile bottom CTA bar wrapper.
7. **`features/cms/components/student/overview/PremiumSections.tsx`**: Group of clean editorial sub-sections: Overview, Outcomes, AI Co-Teacher, Project, Instructor, and Reviews.

---

## 2. Layout & Spacing Design System (Atelier Zero)

* **Canvas & Noise**: Uses `.paper-texture` class for background simulation of physical paper cards and textures.
* **Ambient Mesh**: Top-right Coral gradient (`bg-accent-coral/7`) and bottom-left Mustard gradient (`bg-accent-mustard/6`) overlays.
* **Tabs Navigation & Grid**:
  * The main content area is structured into 3 dynamic tabs:
    1. **Deskripsi Kelas**: Combines Overview (Section 2), Learning Outcomes (Section 3), and Instructor (Section 7) for a cohesive and high-density course presentation.
    2. **Kurikulum (Learning Path)**: Renders the structured syllabus (Section 4).
    3. **Ulasan Pelajar**: Renders user testimonials (Section 8).
  * High-value visual interactive sections (AI Co-Teacher Card and Course Project Card) are placed immediately below the tabs block so they are consistently visible as highlights.
  * Desktop layout uses a 2-column responsive grid (8 cols content tabs, 4 cols Sticky sidebar).
  * Mobile layout renders full-width content with bottom sticky overlay CTA.

---

## 3. Dynamic Mock Data Structure (CourseDetailMock)

Since the `courses` model only has basic metadata in the database, we will map dynamic content based on `category` (e.g., `Pemrograman`, `Desain`, `Bisnis`, `Matematika`, etc.):
* **Outcomes**: 4-6 bulleted competencies tailored to the topic.
* **AI Co-Teacher**: Tailored interactive prompt & answer bubbles showing the AI's capabilities.
* **Course Project**: Specific mock final project matching the course.
* **Instructor**: Mocked professional bio, ratings, and course counts.
* **Reviews**: Context-appropriate student reviews.

---

## 4. Verification Plan

* Run TypeScript compiler: `yarn type-check`.
* Run ESLint validation: `yarn lint`.
